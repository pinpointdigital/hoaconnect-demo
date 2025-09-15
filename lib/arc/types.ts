/**
 * ARC (Architectural Review Committee) Types
 * Core types for the ARC request workflow
 */

export type ARCStatus = 
  | 'draft'
  | 'submitted' 
  | 'under-review'
  | 'neighbor-signoff'
  | 'board-voting'
  | 'approved'
  | 'denied'
  | 'appeal-pending'
  | 'appeal-review'
  | 'in-progress'
  | 'inspection-required'
  | 'inspection-failed'
  | 'completed';

export type MessageType = 'system' | 'user' | 'manager' | 'board' | 'neighbor';
export type MessageVisibility = 'public' | 'private-board' | 'private-manager';

export interface ConversationMessage {
  id: string;
  type: MessageType;
  content: string;
  author: {
    name: string;
    role: string;
    userId?: string;
  };
  timestamp: Date;
  visibility: MessageVisibility;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  replyTo?: string; // ID of message being replied to
  reactions?: {
    userId: string;
    emoji: string;
  }[];
}

export interface BoardVote {
  id: string;
  boardMemberId: string;
  boardMemberName: string;
  vote: 'approve' | 'deny' | 'abstain';
  notes?: string;
  votedAt: Date;
  isPublic: boolean; // Whether vote details are visible to homeowner
}

export interface Appeal {
  id: string;
  reason: string;
  submittedAt: Date;
  status: 'pending' | 'under-review' | 'approved' | 'denied';
  response?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface Inspection {
  id: string;
  type: 'initial' | 're-inspection';
  scheduledDate?: Date;
  completedDate?: Date;
  inspector: {
    name: string;
    userId: string;
  };
  status: 'scheduled' | 'in-progress' | 'passed' | 'failed' | 'punch-list';
  notes?: string;
  photos?: {
    id: string;
    url: string;
    caption?: string;
    uploadedAt: Date;
  }[];
  punchListItems?: {
    id: string;
    description: string;
    isCompleted: boolean;
    completedAt?: Date;
  }[];
  result?: 'approved' | 'requires-changes' | 'major-violations';
}

export interface NeighborPosition {
  position: 'left' | 'right' | 'front-left' | 'front-right' | 'back';
  required: boolean;
  hasNoNeighbor?: boolean; // Indicates no physical neighbor exists in this position
  assignedNeighbor?: {
    id: string;
    name: string;
    address: string;
    email?: string;
    phone?: string;
  };
  status?: 'pending' | 'approved' | 'objection' | 'no-response';
  notes?: string;
  signedAt?: Date;
  notifiedAt?: Date;
  remindersSent?: number;
}

export interface NeighborSignoff {
  id: string;
  address: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'pending' | 'approved' | 'objection' | 'no-response';
  notes?: string;
  signedAt?: Date;
  notifiedAt?: Date;
  remindersSent?: number;
}

export interface CCRAttachment {
  id: string;
  section: string;
  title: string;
  content: string;
  attachedBy: string;
  attachedAt: Date;
  managerNotes?: string;
}

export interface FormAssignment {
  id: string;
  formId: string;
  formName: string;
  description?: string;
  isRequired: boolean;
  assignedBy: string;
  assignedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'completed' | 'overdue';
}

export interface ARCRequest {
  id: string;
  title: string;
  description: string;
  status: ARCStatus;
  desiredStartDate?: Date;
  
  // Submitter Information
  submittedBy: {
    name: string;
    address: string;
    email: string;
    phone?: string;
    userId: string;
  };
  submittedAt: Date;
  updatedAt: Date;
  
  // Request Details
  projectType: 'landscaping' | 'exterior-modification' | 'addition' | 'adu-jadu' | 'paint' | 'fence' | 'other';
  contractor?: {
    name: string;
    license?: string;
    contact: string;
    insurance?: boolean;
  };
  
  // Documents & Media
  documents: {
    id: string;
    name: string;
    url: string;
    type: 'photo' | 'plan' | 'permit' | 'contract' | 'insurance' | 'other';
    uploadedAt: Date;
    uploadedBy: string;
  }[];
  
  // Communication & Threading
  conversations: ConversationMessage[];
  
  // Workflow Components
  assignedManager?: string;
  ccrAttachments: CCRAttachment[];
  formAssignments: FormAssignment[];
  neighborPositions: NeighborPosition[];
  neighborSignoffs: NeighborSignoff[];
  boardVotes: BoardVote[];
  appeals: Appeal[];
  inspections: Inspection[];
  
  // Progress Tracking
  currentStage: ARCStatus;
  stageHistory: {
    stage: ARCStatus;
    enteredAt: Date;
    enteredBy: string;
    notes?: string;
  }[];
  
  // Notifications
  lastNotificationSent?: Date;
  notificationLog: {
    id: string;
    type: 'sms' | 'email' | 'portal';
    recipient: string;
    content: string;
    sentAt: Date;
    status: 'sent' | 'delivered' | 'failed';
  }[];
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

// Manager Action Types
export type ManagerAction = 
  | 'approve-to-board'
  | 'request-changes'
  | 'attach-ccr'
  | 'assign-form'
  | 'add-neighbors'
  | 'send-message'
  | 'schedule-inspection'
  | 'complete-inspection';

// Board Action Types  
export type BoardAction = 'vote' | 'discuss' | 'request-info';

// Notification Templates
export const NOTIFICATION_TEMPLATES = {
  'submitted': 'New ARC request submitted and under review',
  'under-review': 'Your ARC request is being reviewed by the HOA Manager',
  'neighbor-signoff': 'Neighbor sign-offs required for your ARC request',
  'board-voting': 'Your ARC request is now under Board review',
  'approved': 'Congratulations! Your ARC request has been approved',
  'denied': 'Your ARC request requires changes - please review feedback',
  'appeal-pending': 'Appeal submitted and under review',
  'in-progress': 'You may now begin your approved project',
  'inspection-required': 'Project inspection has been scheduled',
  'completed': 'Your ARC request process is now complete'
} as const;

export const PROJECT_TYPES = [
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'exterior-modification', label: 'Exterior Modification' },
  { value: 'addition', label: 'Addition/Extension' },
  { value: 'adu-jadu', label: 'ADU/JADU' },
  { value: 'paint', label: 'Paint/Color Change' },
  { value: 'fence', label: 'Fence/Gate' },
  { value: 'other', label: 'Other' }
] as const;


