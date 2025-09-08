/**
 * Sample Data for HOA Captain New Resident Management
 */

import { NewResidentKPIs, NewResidentOverview, WelcomeCommitteeMember, CaptainAlert } from './captain-types';

export const SAMPLE_NEW_RESIDENT_KPIS: NewResidentKPIs = {
  totalNewResidents: 8,
  residentsThisMonth: 3,
  averageCompletionTime: 12, // days
  completionRate: 87, // percentage
  
  averageWelcomeRating: 4.6,
  welcomeEmailResponseRate: 92,
  communityEventAttendance: 78,
  
  averageResponseTime: 4.2, // hours
  documentsProcessedOnTime: 94,
  welcomeCommitteeEngagement: 89,
  
  overdueTasks: 2,
  residentsWithIncompleteRequiredItems: 1,
  missedWelcomeCommitteeContacts: 0
};

export const SAMPLE_NEW_RESIDENTS: NewResidentOverview[] = [
  {
    id: 'res-001',
    name: 'Jennifer Martinez',
    address: '1458 Seaside Drive',
    email: 'jennifer.martinez@email.com',
    phone: '(949) 555-0178',
    moveInDate: new Date('2024-01-15'),
    daysInCommunity: 8,
    
    overallProgress: 75,
    requiredItemsCompleted: 6,
    totalRequiredItems: 8,
    optionalItemsCompleted: 3,
    totalOptionalItems: 5,
    
    welcomeCommitteeMember: 'Sarah Chen',
    welcomeEmailSent: true,
    welcomeEmailOpened: true,
    welcomeEmailReplied: true,
    welcomeMeetingCompleted: true,
    welcomeRating: 5,
    
    status: 'in-progress',
    alerts: ['Missing pool access setup'],
    lastActivity: new Date('2024-01-22T14:30:00'),
    
    communications: [
      {
        id: 'comm-001',
        type: 'email',
        from: 'Sarah Chen',
        to: 'jennifer.martinez@email.com',
        subject: 'Welcome to Rancho Madrina Community!',
        timestamp: new Date('2024-01-15T16:00:00'),
        status: 'replied'
      },
      {
        id: 'comm-002',
        type: 'sms',
        from: 'HOA System',
        to: '(949) 555-0178',
        subject: 'Gate code ready for pickup',
        timestamp: new Date('2024-01-16T10:00:00'),
        status: 'delivered'
      }
    ]
  },
  {
    id: 'res-002',
    name: 'David Kim',
    address: '1623 Ocean View Lane',
    email: 'david.kim@email.com',
    phone: '(714) 555-0234',
    moveInDate: new Date('2024-01-20'),
    daysInCommunity: 3,
    
    overallProgress: 45,
    requiredItemsCompleted: 4,
    totalRequiredItems: 8,
    optionalItemsCompleted: 1,
    totalOptionalItems: 5,
    
    welcomeCommitteeMember: 'Mike Rodriguez',
    welcomeEmailSent: true,
    welcomeEmailOpened: false,
    welcomeEmailReplied: false,
    welcomeMeetingCompleted: false,
    
    status: 'needs-attention',
    alerts: ['Welcome email not opened', 'Registration form incomplete'],
    lastActivity: new Date('2024-01-21T09:15:00'),
    
    communications: [
      {
        id: 'comm-003',
        type: 'email',
        from: 'Mike Rodriguez',
        to: 'david.kim@email.com',
        subject: 'Welcome to the Community - Let\'s Connect!',
        timestamp: new Date('2024-01-20T18:00:00'),
        status: 'sent'
      }
    ]
  },
  {
    id: 'res-003',
    name: 'Lisa Thompson',
    address: '1789 Hillside Court',
    email: 'lisa.thompson@email.com',
    moveInDate: new Date('2024-01-25'),
    daysInCommunity: -2, // Moving in 2 days
    
    overallProgress: 15,
    requiredItemsCompleted: 1,
    totalRequiredItems: 8,
    optionalItemsCompleted: 0,
    totalOptionalItems: 5,
    
    welcomeEmailSent: false,
    welcomeEmailOpened: false,
    welcomeEmailReplied: false,
    welcomeMeetingCompleted: false,
    
    status: 'new',
    alerts: ['Pre-move-in registration needed', 'Welcome committee assignment pending'],
    lastActivity: new Date('2024-01-22T11:00:00'),
    
    communications: []
  }
];

export const SAMPLE_WELCOME_COMMITTEE: WelcomeCommitteeMember[] = [
  {
    id: 'wc-004',
    name: 'Tom Anderson',
    email: 'tom.anderson@email.com',
    phone: '(714) 555-0198',
    role: 'Community Resident',
    isActive: true,
    assignedResidents: [],
    completedWelcomes: 6,
    averageRating: 4.7,
    responseTime: 2.8,
    memberSince: new Date('2023-06-01'),
    isBoardMember: false
  },
  {
    id: 'wc-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '(949) 555-0156',
    role: 'Board Member - Secretary',
    isActive: true,
    assignedResidents: [],
    completedWelcomes: 12,
    averageRating: 4.8,
    responseTime: 2.3,
    memberSince: new Date('2022-03-15'),
    isBoardMember: true
  },
  {
    id: 'wc-005',
    name: 'Rob Ferguson',
    email: 'rob.ferguson@email.com',
    phone: '(949) 555-0101',
    role: 'Board Member - President',
    isActive: true,
    assignedResidents: [],
    completedWelcomes: 127,
    averageRating: 4.9,
    responseTime: 1.2,
    memberSince: new Date('2014-02-01'),
    isBoardMember: true
  },
  {
    id: 'wc-002', 
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@email.com',
    phone: '(949) 555-0167',
    role: 'Board Member - Treasurer',
    isActive: true,
    assignedResidents: [],
    completedWelcomes: 8,
    averageRating: 4.5,
    responseTime: 3.1,
    memberSince: new Date('2023-01-20'),
    isBoardMember: true
  },
  {
    id: 'wc-003',
    name: 'Jennifer Walsh',
    email: 'jennifer.walsh@email.com',
    role: 'Community Resident',
    isActive: true,
    assignedResidents: [],
    completedWelcomes: 15,
    averageRating: 4.9,
    responseTime: 1.8,
    memberSince: new Date('2021-08-10'),
    isBoardMember: false
  }
];

export const SAMPLE_CAPTAIN_ALERTS: CaptainAlert[] = [
  {
    id: 'alert-001',
    type: 'needs-attention',
    priority: 'medium',
    residentId: 'res-003',
    residentName: 'Lisa Thompson',
    message: 'Only 4 days until target completion.',
    actionRequired: 'Follow up on remaining onboarding steps to meet deadline.',
    createdAt: new Date('2024-01-22T11:00:00'),
    dueDate: new Date('2024-01-25T08:00:00')
  },
  {
    id: 'alert-002',
    type: 'overdue',
    priority: 'high',
    residentId: 'res-002',
    residentName: 'David Kim',
    message: 'Target completion was 2 days ago.',
    actionRequired: 'Immediate follow-up required to complete onboarding process.',
    createdAt: new Date('2024-01-23T09:00:00'),
    dueDate: new Date('2024-01-21T17:00:00')
  },
  {
    id: 'alert-003',
    type: 'follow-up-required',
    priority: 'low',
    residentId: 'res-004',
    residentName: 'Michael Torres',
    message: 'Welcome email sent 3 days ago but not opened.',
    actionRequired: 'Try alternative contact method or welcome committee outreach.',
    createdAt: new Date('2024-01-20T09:00:00'),
    dueDate: new Date('2024-01-27T17:00:00')
  }
];
