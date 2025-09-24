/**
 * Sample Onboarding Data for Demo
 */

import { ChecklistItem, OnboardingProgress } from './types';

export const SAMPLE_CHECKLIST_ITEMS: ChecklistItem[] = [
  // Registration Category
  {
    id: 'reg-001',
    title: 'Complete Resident Registration Form',
    description: 'Fill out basic information and emergency contacts',
    category: 'registration',
    isCompleted: true,
    completedAt: new Date('2024-01-15T10:30:00'),
    isRequired: true,
    estimatedMinutes: 10,
    links: [
      { label: 'Registration Form', url: '/forms/resident-registration', type: 'form' },
      { label: 'Privacy Policy', url: '/documents/privacy-policy', type: 'document' }
    ]
  },
  {
    id: 'reg-002', 
    title: 'Submit Move-In Notice',
    description: 'Notify the HOA of your official move-in date and any moving truck requirements',
    category: 'registration',
    isCompleted: true,
    completedAt: new Date('2024-01-15T11:00:00'),
    isRequired: true,
    estimatedMinutes: 5,
    links: [
      { label: 'Move-In Form', url: '/forms/move-in-notice', type: 'form' }
    ]
  },

  // Access & Security Category
  {
    id: 'acc-001',
    title: 'Obtain Gate Access Code',
    description: 'Get your personal gate code and instructions for guest access',
    category: 'access',
    isCompleted: true,
    completedAt: new Date('2024-01-16T09:15:00'),
    isRequired: true,
    estimatedMinutes: 15,
    links: [
      { label: 'Contact Security Office', url: 'tel:+19495550199', type: 'contact' }
    ]
  },
  {
    id: 'acc-002',
    title: 'Pick Up Key Fob/Garage Remote',
    description: 'Collect your amenity access fob and garage door remote from the office',
    category: 'access',
    isCompleted: false,
    isRequired: true,
    estimatedMinutes: 10,
    links: [
      { label: 'HOA Office Hours', url: '/community/office-hours', type: 'document' }
    ]
  },

  // Amenities Category
  {
    id: 'amen-001',
    title: 'Pool & Spa Access Setup',
    description: 'Register for pool access and review safety guidelines',
    category: 'amenities',
    isCompleted: false,
    isRequired: false,
    estimatedMinutes: 20,
    links: [
      { label: 'Pool Rules', url: '/documents/pool-rules', type: 'document' },
      { label: 'Pool Schedule', url: '/community/pool-schedule', type: 'document' }
    ]
  },
  {
    id: 'amen-002',
    title: 'Fitness Center Orientation',
    description: 'Schedule a brief orientation for fitness center equipment and hours',
    category: 'amenities',
    isCompleted: false,
    isRequired: false,
    estimatedMinutes: 30,
    links: [
      { label: 'Schedule Orientation', url: '/forms/fitness-orientation', type: 'form' }
    ]
  },
  {
    id: 'amen-003',
    title: 'Clubhouse Reservation System',
    description: 'Learn how to reserve the clubhouse for events and gatherings',
    category: 'amenities',
    isCompleted: false,
    isRequired: false,
    estimatedMinutes: 10,
    links: [
      { label: 'Reservation System', url: '/community/reservations', type: 'external' }
    ]
  },

  // Rules & Guidelines Category
  {
    id: 'rules-001',
    title: 'Review CC&Rs and Bylaws',
    description: 'Read the community covenants, conditions, and restrictions',
    category: 'rules',
    isCompleted: false,
    isRequired: true,
    estimatedMinutes: 45,
    links: [
      { label: 'CC&Rs Document', url: '/documents/ccrs', type: 'document' },
      { label: 'Bylaws Document', url: '/documents/bylaws', type: 'document' }
    ]
  },
  {
    id: 'rules-002',
    title: 'Landscaping Guidelines',
    description: 'Understand approved plants, maintenance requirements, and ARC process',
    category: 'rules',
    isCompleted: false,
    isRequired: true,
    estimatedMinutes: 15,
    links: [
      { label: 'Landscaping Guide', url: '/documents/landscaping-guide', type: 'document' },
      { label: 'Approved Plant List', url: '/documents/approved-plants', type: 'document' }
    ]
  },
  {
    id: 'rules-003',
    title: 'Parking and Vehicle Guidelines',
    description: 'Review parking rules, guest parking, and vehicle restrictions',
    category: 'rules',
    isCompleted: false,
    isRequired: true,
    estimatedMinutes: 10,
    links: [
      { label: 'Parking Rules', url: '/documents/parking-rules', type: 'document' }
    ]
  },

  // Community Category
  {
    id: 'comm-001',
    title: 'Join Community Newsletter',
    description: 'Subscribe to monthly community updates and announcements',
    category: 'community',
    isCompleted: false,
    isRequired: false,
    estimatedMinutes: 5,
    links: [
      { label: 'Subscribe to Newsletter', url: '/forms/newsletter-signup', type: 'form' }
    ]
  },
  {
    id: 'comm-002',
    title: 'Meet Your Welcome Committee',
    description: 'Connect with volunteer neighbors who help new residents',
    category: 'community',
    isCompleted: false,
    isRequired: false,
    estimatedMinutes: 20,
    links: [
      { label: 'Welcome Committee Info', url: '/welcome', type: 'external' }
    ]
  },
  {
    id: 'comm-003',
    title: 'Emergency Contacts and Procedures',
    description: 'Save important community emergency contacts and procedures',
    category: 'community',
    isCompleted: false,
    isRequired: true,
    estimatedMinutes: 10,
    links: [
      { label: 'Emergency Contacts', url: '/documents/emergency-contacts', type: 'document' }
    ]
  }
];

export const SAMPLE_ONBOARDING_PROGRESS: OnboardingProgress = {
  residentId: 'res-001',
  residentName: 'Jennifer Martinez',
  address: '1458 Seaside Drive',
  email: 'jennifer.martinez@email.com',
  phone: '(949) 555-0178',
  moveInDate: new Date('2024-01-15'),
  startedAt: new Date('2024-01-15T09:00:00'),
  lastUpdated: new Date('2024-01-16T14:30:00'),
  items: SAMPLE_CHECKLIST_ITEMS,
  overallProgress: 25, // 3 of 12 items completed
  isCompleted: false
};








