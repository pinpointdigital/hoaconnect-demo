/**
 * ARC Workflow Engine
 * Manages the complete end-to-end ARC request workflow with automated transitions,
 * business logic validation, and state management
 */

import { ARCRequest, ARCStatus, ARCWorkflowStep, ManagerAction, BoardAction, NOTIFICATION_TEMPLATES } from './types';

export interface WorkflowTransition {
  from: ARCStatus;
  to: ARCStatus;
  trigger: 'auto' | 'manual' | 'time-based';
  conditions?: WorkflowCondition[];
  actions?: WorkflowAction[];
  requiredRole?: string[];
  timeDelay?: number; // in hours
}

export interface WorkflowCondition {
  type: 'neighbor_signoffs' | 'board_votes' | 'forms_completed' | 'inspection_passed' | 'documents_uploaded';
  required: boolean;
  minimumCount?: number;
  customCheck?: (request: ARCRequest) => boolean;
}

export interface WorkflowAction {
  type: 'notify' | 'assign' | 'create_task' | 'update_status' | 'send_reminder';
  target: string[];
  template?: string;
  data?: any;
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  projectTypes: string[];
  conditions: WorkflowCondition[];
  transitions: WorkflowTransition[];
  isActive: boolean;
}

/**
 * Core Workflow Engine Class
 */
export class ARCWorkflowEngine {
  private rules: WorkflowRule[] = [];
  private activeTransitions: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default workflow rules for different project types
   */
  private initializeDefaultRules(): void {
    // Standard workflow for most projects
    this.rules.push({
      id: 'standard-arc-workflow',
      name: 'Standard ARC Workflow',
      description: 'Default workflow for most ARC requests',
      projectTypes: ['landscaping', 'exterior-modification', 'paint', 'fence', 'other'],
      conditions: [],
      transitions: [
        {
          from: 'submitted',
          to: 'under-review',
          trigger: 'auto',
          timeDelay: 0.5, // 30 minutes for demo
          actions: [{
            type: 'notify',
            target: ['manager'],
            template: 'manager_new_request'
          }]
        },
        {
          from: 'under-review',
          to: 'neighbor-signoff',
          trigger: 'manual',
          requiredRole: ['captain', 'management-company'],
          conditions: [{
            type: 'documents_uploaded',
            required: true
          }],
          actions: [{
            type: 'notify',
            target: ['neighbors'],
            template: 'neighbor_signoff_required'
          }]
        },
        {
          from: 'neighbor-signoff',
          to: 'board-voting',
          trigger: 'auto',
          conditions: [{
            type: 'neighbor_signoffs',
            required: true,
            minimumCount: 2
          }],
          actions: [{
            type: 'notify',
            target: ['board'],
            template: 'board_review_required'
          }]
        },
        {
          from: 'board-voting',
          to: 'approved',
          trigger: 'auto',
          conditions: [{
            type: 'board_votes',
            required: true,
            minimumCount: 3
          }],
          actions: [{
            type: 'notify',
            target: ['homeowner'],
            template: 'request_approved'
          }]
        },
        {
          from: 'approved',
          to: 'in-progress',
          trigger: 'manual',
          requiredRole: ['homeowner'],
          actions: [{
            type: 'notify',
            target: ['manager'],
            template: 'project_started'
          }]
        },
        {
          from: 'in-progress',
          to: 'inspection-required',
          trigger: 'manual',
          requiredRole: ['homeowner'],
          actions: [{
            type: 'notify',
            target: ['manager'],
            template: 'inspection_requested'
          }]
        },
        {
          from: 'inspection-required',
          to: 'completed',
          trigger: 'manual',
          requiredRole: ['captain', 'management-company'],
          conditions: [{
            type: 'inspection_passed',
            required: true
          }],
          actions: [{
            type: 'notify',
            target: ['homeowner'],
            template: 'request_completed'
          }]
        }
      ],
      isActive: true
    });

    // Major construction workflow (additions, ADU/JADU)
    this.rules.push({
      id: 'major-construction-workflow',
      name: 'Major Construction Workflow',
      description: 'Enhanced workflow for major construction projects',
      projectTypes: ['addition', 'adu-jadu'],
      conditions: [],
      transitions: [
        {
          from: 'submitted',
          to: 'under-review',
          trigger: 'auto',
          timeDelay: 1, // 1 hour delay for major projects
          actions: [{
            type: 'notify',
            target: ['manager', 'board'],
            template: 'major_project_submitted'
          }]
        },
        // Additional steps for major construction...
        {
          from: 'under-review',
          to: 'neighbor-signoff',
          trigger: 'manual',
          requiredRole: ['captain', 'management-company'],
          conditions: [
            {
              type: 'documents_uploaded',
              required: true
            },
            {
              type: 'forms_completed',
              required: true,
              minimumCount: 2 // Require additional forms for major projects
            }
          ]
        }
      ],
      isActive: true
    });
  }

  /**
   * Process a workflow transition
   */
  async processTransition(
    request: ARCRequest, 
    targetStatus: ARCStatus, 
    triggeredBy: string,
    notes?: string
  ): Promise<{ success: boolean; message: string; updatedRequest?: ARCRequest }> {
    
    const applicableRule = this.findApplicableRule(request);
    if (!applicableRule) {
      return { success: false, message: 'No applicable workflow rule found' };
    }

    const transition = applicableRule.transitions.find(
      t => t.from === request.status && t.to === targetStatus
    );

    if (!transition) {
      return { success: false, message: `Invalid transition from ${request.status} to ${targetStatus}` };
    }

    // Validate conditions
    const conditionCheck = await this.validateConditions(request, transition.conditions || []);
    if (!conditionCheck.valid) {
      return { success: false, message: conditionCheck.message };
    }

    // Execute transition
    const updatedRequest = await this.executeTransition(request, transition, triggeredBy, notes);
    
    // Schedule any time-based transitions
    this.scheduleTimeBasedTransitions(updatedRequest);

    return { success: true, message: 'Transition completed successfully', updatedRequest };
  }

  /**
   * Get next possible transitions for a request
   */
  getAvailableTransitions(request: ARCRequest, userRole: string): WorkflowTransition[] {
    const applicableRule = this.findApplicableRule(request);
    if (!applicableRule) return [];

    return applicableRule.transitions.filter(transition => {
      // Check if transition is from current status
      if (transition.from !== request.status) return false;
      
      // Check role requirements
      if (transition.requiredRole && !transition.requiredRole.includes(userRole)) return false;
      
      // Check if trigger allows manual execution
      if (transition.trigger === 'auto' && transition.timeDelay) return false;
      
      return true;
    });
  }

  /**
   * Get workflow steps for display
   */
  getWorkflowSteps(request: ARCRequest): ARCWorkflowStep[] {
    const applicableRule = this.findApplicableRule(request);
    if (!applicableRule) return [];

    const steps: ARCWorkflowStep[] = [];
    const statusOrder: ARCStatus[] = ['submitted', 'under-review', 'neighbor-signoff', 'board-voting', 'approved', 'in-progress', 'inspection-required', 'completed'];
    
    statusOrder.forEach(status => {
      const stageHistory = request.stageHistory.find(stage => stage.stage === status);
      const isCompleted = !!stageHistory;
      const isActive = request.status === status;
      
      steps.push({
        step: status,
        title: this.getStatusDisplayName(status),
        description: this.getStatusDescription(status),
        isCompleted,
        isActive,
        completedAt: stageHistory?.enteredAt,
        assignedTo: stageHistory?.enteredBy
      });
    });

    return steps;
  }

  /**
   * Auto-process eligible transitions
   */
  async autoProcessTransitions(request: ARCRequest): Promise<ARCRequest> {
    const applicableRule = this.findApplicableRule(request);
    if (!applicableRule) return request;

    let updatedRequest = { ...request };
    let hasChanges = false;

    for (const transition of applicableRule.transitions) {
      if (transition.from === updatedRequest.status && transition.trigger === 'auto' && !transition.timeDelay) {
        const conditionCheck = await this.validateConditions(updatedRequest, transition.conditions || []);
        
        if (conditionCheck.valid) {
          updatedRequest = await this.executeTransition(updatedRequest, transition, 'system', 'Auto-transition');
          hasChanges = true;
          break; // Process one transition at a time
        }
      }
    }

    return updatedRequest;
  }

  /**
   * Private helper methods
   */
  private findApplicableRule(request: ARCRequest): WorkflowRule | null {
    return this.rules.find(rule => 
      rule.isActive && rule.projectTypes.includes(request.projectType)
    ) || this.rules.find(rule => rule.id === 'standard-arc-workflow');
  }

  private async validateConditions(request: ARCRequest, conditions: WorkflowCondition[]): Promise<{ valid: boolean; message: string }> {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'neighbor_signoffs':
          const approvedSignoffs = request.neighborSignoffs.filter(n => n.status === 'approved').length;
          if (condition.required && (!condition.minimumCount || approvedSignoffs < condition.minimumCount)) {
            return { valid: false, message: `Requires ${condition.minimumCount || 1} neighbor sign-offs` };
          }
          break;

        case 'board_votes':
          const approveVotes = request.boardVotes.filter(v => v.vote === 'approve').length;
          if (condition.required && (!condition.minimumCount || approveVotes < condition.minimumCount)) {
            return { valid: false, message: `Requires ${condition.minimumCount || 1} board approvals` };
          }
          break;

        case 'forms_completed':
          const completedForms = request.formAssignments.filter(f => f.status === 'completed').length;
          if (condition.required && (!condition.minimumCount || completedForms < condition.minimumCount)) {
            return { valid: false, message: `Requires ${condition.minimumCount || 1} completed forms` };
          }
          break;

        case 'inspection_passed':
          const passedInspection = request.inspections.some(i => i.status === 'passed');
          if (condition.required && !passedInspection) {
            return { valid: false, message: 'Requires passed inspection' };
          }
          break;

        case 'documents_uploaded':
          if (condition.required && request.documents.length === 0) {
            return { valid: false, message: 'Requires uploaded documents' };
          }
          break;

        default:
          if (condition.customCheck && !condition.customCheck(request)) {
            return { valid: false, message: 'Custom condition not met' };
          }
      }
    }

    return { valid: true, message: 'All conditions met' };
  }

  private async executeTransition(
    request: ARCRequest, 
    transition: WorkflowTransition, 
    triggeredBy: string,
    notes?: string
  ): Promise<ARCRequest> {
    const now = new Date();
    
    const updatedRequest: ARCRequest = {
      ...request,
      status: transition.to,
      currentStage: transition.to,
      updatedAt: now,
      stageHistory: [
        ...request.stageHistory,
        {
          stage: transition.to,
          enteredAt: now,
          enteredBy: triggeredBy,
          notes: notes || `Transitioned to ${transition.to}`
        }
      ]
    };

    // Execute workflow actions
    if (transition.actions) {
      for (const action of transition.actions) {
        await this.executeWorkflowAction(updatedRequest, action);
      }
    }

    return updatedRequest;
  }

  private async executeWorkflowAction(request: ARCRequest, action: WorkflowAction): Promise<void> {
    switch (action.type) {
      case 'notify':
        // In a real implementation, this would send actual notifications
        console.log(`Notification sent to ${action.target.join(', ')} for request ${request.id}`);
        break;
      
      case 'assign':
        // Auto-assign to users or roles
        console.log(`Auto-assigned request ${request.id} to ${action.target.join(', ')}`);
        break;
      
      case 'create_task':
        // Create follow-up tasks
        console.log(`Created task for request ${request.id}`);
        break;
      
      case 'send_reminder':
        // Send reminder notifications
        console.log(`Reminder sent for request ${request.id}`);
        break;
    }
  }

  private scheduleTimeBasedTransitions(request: ARCRequest): void {
    const applicableRule = this.findApplicableRule(request);
    if (!applicableRule) return;

    const timeBasedTransitions = applicableRule.transitions.filter(
      t => t.from === request.status && t.trigger === 'auto' && t.timeDelay
    );

    timeBasedTransitions.forEach(transition => {
      if (transition.timeDelay) {
        const timeoutId = setTimeout(async () => {
          const conditionCheck = await this.validateConditions(request, transition.conditions || []);
          if (conditionCheck.valid) {
            await this.processTransition(request, transition.to, 'system', 'Time-based transition');
          }
        }, transition.timeDelay * 60 * 60 * 1000); // Convert hours to milliseconds

        this.activeTransitions.set(`${request.id}-${transition.to}`, timeoutId);
      }
    });
  }

  private getStatusDisplayName(status: ARCStatus): string {
    const displayNames = {
      'draft': 'Draft',
      'submitted': 'Submitted',
      'under-review': 'Under Review',
      'neighbor-signoff': 'Neighbor Sign-off',
      'board-voting': 'Board Voting',
      'approved': 'Approved',
      'denied': 'Denied',
      'appeal-pending': 'Appeal Pending',
      'appeal-review': 'Appeal Under Review',
      'in-progress': 'In Progress',
      'inspection-required': 'Inspection Required',
      'inspection-failed': 'Inspection Failed',
      'completed': 'Completed'
    };
    return displayNames[status] || status;
  }

  private getStatusDescription(status: ARCStatus): string {
    const descriptions = {
      'submitted': 'Request has been submitted and is awaiting initial review',
      'under-review': 'HOA Manager is reviewing the request for compliance',
      'neighbor-signoff': 'Collecting required neighbor approvals',
      'board-voting': 'Board members are voting on the request',
      'approved': 'Request has been approved and can proceed',
      'in-progress': 'Project work is in progress',
      'inspection-required': 'Project inspection is required',
      'completed': 'Request and project are complete'
    };
    return descriptions[status] || 'Status description not available';
  }

  /**
   * Cleanup method for scheduled transitions
   */
  cleanup(): void {
    this.activeTransitions.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.activeTransitions.clear();
  }
}

/**
 * Singleton instance
 */
export const workflowEngine = new ARCWorkflowEngine();

/**
 * Utility functions for workflow management
 */
export const WorkflowUtils = {
  /**
   * Check if a user can perform a specific action
   */
  canPerformAction(request: ARCRequest, action: ManagerAction | BoardAction, userRole: string): boolean {
    const rolePermissions = {
      'captain': ['approve-to-board', 'request-changes', 'attach-ccr', 'assign-form', 'add-neighbors', 'send-message', 'schedule-inspection', 'complete-inspection'],
      'management-company': ['approve-to-board', 'request-changes', 'attach-ccr', 'assign-form', 'add-neighbors', 'send-message', 'schedule-inspection', 'complete-inspection'],
      'board-member': ['vote', 'discuss', 'request-info'],
      'homeowner': ['send-message']
    };

    return rolePermissions[userRole as keyof typeof rolePermissions]?.includes(action) || false;
  },

  /**
   * Get required actions for current status
   */
  getRequiredActions(request: ARCRequest): string[] {
    const actions: string[] = [];
    
    switch (request.status) {
      case 'under-review':
        if (request.documents.length === 0) actions.push('Upload required documents');
        if (request.ccrAttachments.length === 0) actions.push('Review CC&R compliance');
        break;
      case 'neighbor-signoff':
        const pendingSignoffs = request.neighborSignoffs.filter(n => n.status === 'pending').length;
        if (pendingSignoffs > 0) actions.push(`${pendingSignoffs} neighbor sign-offs pending`);
        break;
      case 'board-voting':
        const totalVotes = request.boardVotes.length;
        if (totalVotes < 3) actions.push(`${3 - totalVotes} more board votes needed`);
        break;
      case 'inspection-required':
        const hasInspection = request.inspections.some(i => i.status !== 'scheduled');
        if (!hasInspection) actions.push('Schedule inspection');
        break;
    }
    
    return actions;
  },

  /**
   * Calculate workflow progress percentage
   */
  calculateProgress(request: ARCRequest): number {
    const statusOrder: ARCStatus[] = ['submitted', 'under-review', 'neighbor-signoff', 'board-voting', 'approved', 'in-progress', 'inspection-required', 'completed'];
    const currentIndex = statusOrder.indexOf(request.status);
    const totalSteps = statusOrder.length - 1; // Exclude 'submitted' as starting point
    
    if (currentIndex === -1) return 0;
    return Math.round((currentIndex / totalSteps) * 100);
  },

  /**
   * Get estimated completion date
   */
  getEstimatedCompletion(request: ARCRequest): Date | null {
    const avgDaysPerStage = {
      'under-review': 3,
      'neighbor-signoff': 7,
      'board-voting': 14,
      'approved': 1,
      'in-progress': 30,
      'inspection-required': 3
    };

    const remainingStages: ARCStatus[] = [];
    const statusOrder: ARCStatus[] = ['under-review', 'neighbor-signoff', 'board-voting', 'approved', 'in-progress', 'inspection-required'];
    const currentIndex = statusOrder.indexOf(request.status);
    
    if (currentIndex === -1) return null;
    
    const remainingDays = statusOrder
      .slice(currentIndex + 1)
      .reduce((total, stage) => total + (avgDaysPerStage[stage] || 0), 0);
    
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + remainingDays);
    
    return estimatedDate;
  }
};
