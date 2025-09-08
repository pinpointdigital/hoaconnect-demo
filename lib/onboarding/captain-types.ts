/**
 * HOA Captain New Resident Management Types
 * Comprehensive tracking and KPI system for new resident experience
 */

export interface NewResidentKPIs {
  // Overall Metrics
  totalNewResidents: number;
  residentsThisMonth: number;
  averageCompletionTime: number; // days
  completionRate: number; // percentage
  
  // Experience Quality Metrics
  averageWelcomeRating: number; // 1-5 stars
  welcomeEmailResponseRate: number; // percentage
  communityEventAttendance: number; // percentage
  
  // Process Efficiency Metrics
  averageResponseTime: number; // hours for captain responses
  documentsProcessedOnTime: number; // percentage
  welcomeCommitteeEngagement: number; // percentage of assigned welcomes completed
  
  // Risk Indicators
  overdueTasks: number;
  residentsWithIncompleteRequiredItems: number;
  missedWelcomeCommitteeContacts: number;
}

export interface NewResidentOverview {
  id: string;
  name: string;
  address: string;
  email: string;
  phone?: string;
  moveInDate: Date;
  daysInCommunity: number;
  
  // Progress Tracking
  overallProgress: number;
  requiredItemsCompleted: number;
  totalRequiredItems: number;
  optionalItemsCompleted: number;
  totalOptionalItems: number;
  
  // Welcome Experience
  welcomeCommitteeMember?: string;
  welcomeEmailSent: boolean;
  welcomeEmailOpened: boolean;
  welcomeEmailReplied: boolean;
  welcomeMeetingCompleted: boolean;
  welcomeRating?: number; // 1-5 stars from resident feedback
  
  // Status & Alerts
  status: 'new' | 'in-progress' | 'completed' | 'needs-attention';
  alerts: string[];
  lastActivity: Date;
  
  // Communication Log
  communications: {
    id: string;
    type: 'email' | 'sms' | 'call' | 'in-person';
    from: string;
    to: string;
    subject?: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'opened' | 'replied';
  }[];
}

export interface WelcomeCommitteeMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string; // Board Member title or Community Resident
  isActive: boolean;
  assignedResidents: string[]; // resident IDs
  completedWelcomes: number;
  averageRating: number;
  responseTime: number; // average hours to first contact
  memberSince: Date;
  isBoardMember: boolean;
}

export interface CaptainAlert {
  id: string;
  type: 'overdue' | 'needs-attention' | 'welcome-needed' | 'document-missing' | 'follow-up-required';
  priority: 'high' | 'medium' | 'low';
  residentId: string;
  residentName: string;
  message: string;
  actionRequired: string;
  createdAt: Date;
  dueDate?: Date;
}

export const ALERT_TYPES = {
  'overdue': {
    color: 'red',
    icon: 'alert-triangle',
    label: 'Overdue Task'
  },
  'needs-attention': {
    color: 'yellow', 
    icon: 'alert-circle',
    label: 'Needs Attention'
  },
  'welcome-needed': {
    color: 'blue',
    icon: 'heart',
    label: 'Welcome Needed'
  },
  'document-missing': {
    color: 'orange',
    icon: 'file-x',
    label: 'Missing Document'
  },
  'follow-up-required': {
    color: 'purple',
    icon: 'clock',
    label: 'Follow-up Required'
  }
} as const;
