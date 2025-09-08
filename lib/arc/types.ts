/**
 * ARC (Architectural Review Committee) Types
 * Core types for the ARC request workflow
 */

export type ARCStatus = 
  | 'draft'
  | 'submitted' 
  | 'under-review'
  | 'neighbor-signoff'
  | 'ai-review'
  | 'board-voting'
  | 'approved'
  | 'denied'
  | 'appeal-pending'
  | 'inspection-required'
  | 'completed';

export interface ARCRequest {
  id: string;
  title: string;
  description: string;
  status: ARCStatus;
  submittedBy: {
    name: string;
    address: string;
    email: string;
    phone?: string;
  };
  submittedAt: Date;
  updatedAt: Date;
  
  // Request Details
  projectType: 'landscaping' | 'exterior-modification' | 'addition' | 'adu-jadu' | 'paint' | 'fence' | 'other';
  estimatedCost?: number;
  contractor?: {
    name: string;
    license?: string;
    contact: string;
  };
  
  // Documents & Media
  documents: {
    id: string;
    name: string;
    url: string;
    type: 'photo' | 'plan' | 'permit' | 'contract' | 'other';
    uploadedAt: Date;
  }[];
  
  // Workflow Tracking
  reviewNotes?: string;
  neighborSignoffs?: {
    address: string;
    name: string;
    status: 'pending' | 'approved' | 'objection';
    notes?: string;
    signedAt?: Date;
  }[];
  
  aiGuidance?: {
    compliance: 'compliant' | 'needs-review' | 'non-compliant';
    suggestions: string[];
    relevantRules: string[];
    generatedAt: Date;
  };
  
  boardVotes?: {
    member: string;
    vote: 'approve' | 'deny' | 'abstain';
    notes?: string;
    votedAt: Date;
  }[];
  
  // Appeals
  appeals?: {
    id: string;
    reason: string;
    submittedAt: Date;
    status: 'pending' | 'approved' | 'denied';
    response?: string;
  }[];
  
  // Post-Approval
  inspection?: {
    scheduledDate?: Date;
    completedDate?: Date;
    inspector: string;
    status: 'scheduled' | 'passed' | 'failed' | 'punch-list';
    notes?: string;
    punchListItems?: string[];
  };
}

export interface ARCWorkflowStep {
  step: ARCStatus;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  completedAt?: Date;
  assignedTo?: string;
}

export const ARC_STATUS_LABELS: Record<ARCStatus, string> = {
  'draft': 'Draft',
  'submitted': 'Submitted',
  'under-review': 'Under Review',
  'neighbor-signoff': 'Neighbor Sign-off',
  'ai-review': 'AI Compliance Check',
  'board-voting': 'Board Voting',
  'approved': 'Approved',
  'denied': 'Denied',
  'appeal-pending': 'Appeal Pending',
  'inspection-required': 'Inspection Required',
  'completed': 'Completed'
};

export const PROJECT_TYPES = [
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'exterior-modification', label: 'Exterior Modification' },
  { value: 'addition', label: 'Addition/Extension' },
  { value: 'adu-jadu', label: 'ADU/JADU' },
  { value: 'paint', label: 'Paint/Color Change' },
  { value: 'fence', label: 'Fence/Gate' },
  { value: 'other', label: 'Other' }
] as const;


