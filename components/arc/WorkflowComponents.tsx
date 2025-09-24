'use client';

/**
 * ARC Workflow Components
 * Reusable UI components for different workflow stages and user roles
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useWorkflow } from '@/lib/arc/workflow-context';
import { useAuth } from '@/lib/auth/context';
import { ARCRequest, ARCStatus } from '@/lib/arc/types';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Pause, 
  FastForward,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  TrendingUp,
  Settings,
  Eye,
  Send,
  AlertTriangle,
  Info
} from 'lucide-react';

interface WorkflowProgressProps {
  requestId: string;
  showEstimatedCompletion?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function WorkflowProgress({ requestId, showEstimatedCompletion = true, size = 'md' }: WorkflowProgressProps) {
  const { getWorkflowSteps, calculateProgress, getEstimatedCompletion } = useWorkflow();
  
  const steps = getWorkflowSteps(requestId);
  const progress = calculateProgress(requestId);
  const estimatedCompletion = getEstimatedCompletion(requestId);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink-900">Progress</span>
          <span className="text-ink-600">{progress}% Complete</span>
        </div>
        <div className={`w-full bg-neutral-200 rounded-full ${sizeClasses[size]}`}>
          <div 
            className={`bg-gradient-to-r from-blue-500 to-green-500 ${sizeClasses[size]} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Estimated Completion */}
      {showEstimatedCompletion && estimatedCompletion && (
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <Calendar size={16} />
          <span>Estimated completion: {estimatedCompletion.toLocaleDateString()}</span>
        </div>
      )}

      {/* Workflow Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div 
            key={step.step}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              step.isActive ? 'bg-blue-50 border border-blue-200' : 
              step.isCompleted ? 'bg-green-50' : 'bg-neutral-50'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              step.isCompleted ? 'bg-green-500 text-white' :
              step.isActive ? 'bg-blue-500 text-white' : 'bg-neutral-300 text-neutral-600'
            }`}>
              {step.isCompleted ? (
                <CheckCircle size={14} />
              ) : step.isActive ? (
                <Clock size={14} />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                step.isActive ? 'text-blue-900' : 
                step.isCompleted ? 'text-green-900' : 'text-neutral-600'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-neutral-600">{step.description}</p>
              {step.completedAt && (
                <p className="text-xs text-neutral-500">
                  Completed {step.completedAt.toLocaleDateString()} by {step.assignedTo}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface WorkflowActionsProps {
  requestId: string;
  request: ARCRequest;
  compact?: boolean;
}

export function WorkflowActions({ requestId, request, compact = false }: WorkflowActionsProps) {
  const { transitionRequest, getAvailableTransitions, canPerformAction, state } = useWorkflow();
  const { currentRole } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showNotes, setShowNotes] = useState<string | null>(null);
  const [transitionNotes, setTransitionNotes] = useState('');

  const availableTransitions = getAvailableTransitions(requestId);
  const isActive = state.activeTransitions.has(requestId);

  const handleTransition = async (targetStatus: ARCStatus, notes?: string) => {
    setIsTransitioning(true);
    try {
      const result = await transitionRequest(requestId, targetStatus, notes);
      if (result.success) {
        setShowNotes(null);
        setTransitionNotes('');
      }
    } finally {
      setIsTransitioning(false);
    }
  };

  const getTransitionButton = (transition: any) => {
    const buttonConfig = {
      'under-review': { label: 'Start Review', variant: 'primary' as const, icon: <Play size={16} /> },
      'neighbor-signoff': { label: 'Request Neighbor Sign-offs', variant: 'secondary' as const, icon: <Users size={16} /> },
      'board-voting': { label: 'Send to Board', variant: 'primary' as const, icon: <Send size={16} /> },
      'approved': { label: 'Approve Request', variant: 'primary' as const, icon: <CheckCircle size={16} /> },
      'denied': { label: 'Deny Request', variant: 'destructive' as const, icon: <AlertCircle size={16} /> },
      'in-progress': { label: 'Start Project', variant: 'primary' as const, icon: <Play size={16} /> },
      'inspection-required': { label: 'Request Inspection', variant: 'secondary' as const, icon: <Eye size={16} /> },
      'completed': { label: 'Mark Complete', variant: 'primary' as const, icon: <CheckCircle size={16} /> }
    };

    const config = buttonConfig[transition.to as keyof typeof buttonConfig] || {
      label: `Move to ${transition.to}`,
      variant: 'secondary' as const,
      icon: <FastForward size={16} />
    };

    return (
      <Button
        key={transition.to}
        variant={config.variant}
        size={compact ? 'sm' : 'md'}
        onClick={() => {
          if (['denied', 'approved', 'completed'].includes(transition.to)) {
            setShowNotes(transition.to);
          } else {
            handleTransition(transition.to);
          }
        }}
        disabled={isTransitioning || isActive}
        className="flex items-center gap-2"
      >
        {config.icon}
        {config.label}
      </Button>
    );
  };

  if (availableTransitions.length === 0 && !compact) {
    return (
      <div className="text-center py-4 text-neutral-600">
        <Info size={20} className="mx-auto mb-2" />
        <p className="text-sm">No actions available at this stage</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Available Actions */}
      {availableTransitions.length > 0 && (
        <div className={`flex ${compact ? 'gap-2' : 'gap-3'} ${compact ? 'flex-wrap' : 'flex-col sm:flex-row'}`}>
          {availableTransitions.map(getTransitionButton)}
        </div>
      )}

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-4">
              {showNotes === 'approved' ? 'Approve Request' : 
               showNotes === 'denied' ? 'Deny Request' : 'Complete Request'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  {showNotes === 'denied' ? 'Reason for denial:' : 'Notes (optional):'}
                </label>
                <textarea
                  value={transitionNotes}
                  onChange={(e) => setTransitionNotes(e.target.value)}
                  placeholder={showNotes === 'denied' ? 'Please provide a reason for denial...' : 'Add any notes about this decision...'}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowNotes(null);
                    setTransitionNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant={showNotes === 'denied' ? 'destructive' : 'primary'}
                  onClick={() => handleTransition(showNotes as ARCStatus, transitionNotes)}
                  disabled={isTransitioning || (showNotes === 'denied' && !transitionNotes.trim())}
                >
                  {isTransitioning ? 'Processing...' : 
                   showNotes === 'approved' ? 'Approve' : 
                   showNotes === 'denied' ? 'Deny' : 'Complete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isActive && (
        <div className="text-center py-2 text-blue-600">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm">Processing workflow transition...</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface RequiredActionsProps {
  requestId: string;
  showTitle?: boolean;
}

export function RequiredActions({ requestId, showTitle = true }: RequiredActionsProps) {
  const { getRequiredActions } = useWorkflow();
  const requiredActions = getRequiredActions(requestId);

  if (requiredActions.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      {showTitle && (
        <h4 className="flex items-center gap-2 text-sm font-medium text-yellow-800 mb-3">
          <AlertTriangle size={16} />
          Action Required
        </h4>
      )}
      <ul className="space-y-2">
        {requiredActions.map((action, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-yellow-700">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface WorkflowNotificationsProps {
  requestId?: string;
  maxItems?: number;
}

export function WorkflowNotifications({ requestId, maxItems = 5 }: WorkflowNotificationsProps) {
  const { state, markNotificationRead, clearNotifications } = useWorkflow();
  
  let notifications = state.notifications;
  if (requestId) {
    notifications = notifications.filter(n => n.requestId === requestId);
  }
  
  notifications = notifications.slice(0, maxItems);

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-600">
        <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No notifications</p>
      </div>
    );
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={16} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'error': return <AlertCircle className="text-red-500" size={16} />;
      default: return <Info className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border transition-colors ${
            notification.isRead 
              ? 'bg-white border-neutral-200' 
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-ink-900">
                  {notification.title}
                </h4>
                <span className="text-xs text-neutral-500">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-ink-600 mt-1">
                {notification.message}
              </p>
              
              {/* Notification Actions */}
              <div className="flex items-center gap-2 mt-3">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markNotificationRead(notification.id)}
                    className="text-xs"
                  >
                    Mark as Read
                  </Button>
                )}
                {notification.actions?.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={action.action}
                    className="text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearNotifications(requestId)}
            className="text-xs text-neutral-600"
          >
            Clear {requestId ? 'Request' : 'All'} Notifications
          </Button>
        </div>
      )}
    </div>
  );
}

interface WorkflowDashboardProps {
  requests: ARCRequest[];
  showMetrics?: boolean;
}

export function WorkflowDashboard({ requests, showMetrics = true }: WorkflowDashboardProps) {
  const { state } = useWorkflow();

  // Calculate metrics
  const totalRequests = requests.length;
  const activeRequests = requests.filter(r => !['completed', 'denied'].includes(r.status)).length;
  const completedToday = requests.filter(r => {
    const today = new Date();
    const completed = r.stageHistory.find(s => s.stage === 'completed');
    return completed && completed.enteredAt.toDateString() === today.toDateString();
  }).length;

  const avgProcessingTime = requests
    .filter(r => r.status === 'completed')
    .reduce((acc, r) => {
      const submitted = r.stageHistory.find(s => s.stage === 'submitted');
      const completed = r.stageHistory.find(s => s.stage === 'completed');
      if (submitted && completed) {
        const days = Math.ceil((completed.enteredAt.getTime() - submitted.enteredAt.getTime()) / (1000 * 60 * 60 * 24));
        return acc + days;
      }
      return acc;
    }, 0) / Math.max(requests.filter(r => r.status === 'completed').length, 1);

  const statusCounts = requests.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Requests</p>
                <p className="text-2xl font-bold text-ink-900">{totalRequests}</p>
              </div>
              <FileText className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active</p>
                <p className="text-2xl font-bold text-ink-900">{activeRequests}</p>
              </div>
              <Clock className="text-yellow-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Completed Today</p>
                <p className="text-2xl font-bold text-ink-900">{completedToday}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Avg. Processing</p>
                <p className="text-2xl font-bold text-ink-900">{Math.round(avgProcessingTime)} days</p>
              </div>
              <TrendingUp className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Active Transitions */}
      {state.activeTransitions.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-2">
            <Settings className="animate-spin" size={16} />
            Active Workflow Transitions
          </h3>
          <p className="text-sm text-blue-700">
            {state.activeTransitions.size} request{state.activeTransitions.size !== 1 ? 's' : ''} currently processing...
          </p>
        </div>
      )}

      {/* Status Breakdown */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-ink-900 mb-4">Request Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="text-center p-3 bg-neutral-50 rounded-lg">
              <p className="text-lg font-bold text-ink-900">{count}</p>
              <p className="text-sm text-neutral-600 capitalize">
                {status.replace('-', ' ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
