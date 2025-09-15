/**
 * Sample ARC Request Data for Demo
 */

import { ARCRequest } from './types';

// Demo ARC Requests - Start with empty array for clean demo walkthrough
export const SAMPLE_ARC_REQUESTS: ARCRequest[] = [];

// Helper function to create a new ARC request
export function createNewARCRequest(
  title: string,
  description: string,
  projectType: ARCRequest['projectType'],
  submittedBy: ARCRequest['submittedBy'],
  desiredStartDate?: Date
): ARCRequest {
  const now = new Date();
  return {
    id: `arc-${Date.now()}`,
    title,
    description,
    status: 'submitted',
    desiredStartDate,
    submittedBy,
    submittedAt: now,
    updatedAt: now,
    projectType,
    
    // Initialize empty arrays for clean demo
    documents: [],
    conversations: [{
      id: 'msg-initial',
      type: 'homeowner',
      content: `ARC request submitted for review.`,
      author: {
        name: submittedBy.name,
        role: 'Homeowner'
      },
      timestamp: now,
      visibility: 'public'
    }],
    
    ccrAttachments: [],
    formAssignments: [],
    neighborPositions: [
      { position: 'left', required: false },
      { position: 'right', required: false },
      { position: 'front-left', required: false },
      { position: 'front-right', required: false },
      { position: 'back', required: false }
    ],
    neighborSignoffs: [],
    boardVotes: [],
    appeals: [],
    inspections: [],
    
    currentStage: 'submitted',
    stageHistory: [{
      stage: 'submitted',
      enteredAt: now,
      enteredBy: submittedBy.name,
      notes: 'Initial submission'
    }],
    
    notificationLog: []
  };
}

// Sample community members for neighbor sign-offs
export const COMMUNITY_MEMBERS = [
  { name: 'Robert Chen', address: '1421 Oceanview Drive', email: 'robert.chen@email.com', phone: '(949) 555-0191' },
  { name: 'Maria Santos', address: '1425 Oceanview Drive', email: 'maria.santos@email.com', phone: '(949) 555-0192' },
  { name: 'Jennifer Walsh', address: '1245 Seaside Drive', email: 'jennifer.walsh@email.com', phone: '(949) 555-0193' },
  { name: 'Tom Anderson', address: '1336 Hillside Court', email: 'tom.anderson@email.com', phone: '(949) 555-0194' },
  { name: 'Lisa Kim', address: '1420 Oceanview Drive', email: 'lisa.kim@email.com', phone: '(949) 555-0195' },
  { name: 'David Martinez', address: '1427 Oceanview Drive', email: 'david.martinez@email.com', phone: '(949) 555-0196' }
];

// Sample Board Members
export const BOARD_MEMBERS = [
  { id: 'board-001', name: 'Sarah Johnson', role: 'President', email: 'president@samplehoa.com' },
  { id: 'board-002', name: 'Mike Chen', role: 'Vice President', email: 'vp@samplehoa.com' },
  { id: 'board-003', name: 'Linda Rodriguez', role: 'Secretary', email: 'secretary@samplehoa.com' },
  { id: 'board-004', name: 'James Park', role: 'Treasurer', email: 'treasurer@samplehoa.com' },
  { id: 'board-005', name: 'Amanda Foster', role: 'Member at Large', email: 'member@samplehoa.com' }
];

// Common ARC Forms and Documents Library
export const ARC_FORMS_LIBRARY = [
  {
    id: 'form-1',
    name: 'Architectural Review Application',
    type: 'form',
    category: 'Required Forms',
    description: 'Main application form for all architectural changes',
    requiresSignature: true,
    fileUrl: '/forms/arc-application.pdf'
  },
  {
    id: 'form-2', 
    name: 'Contractor Information Form',
    type: 'form',
    category: 'Required Forms',
    description: 'Details about contractors performing the work',
    requiresSignature: true,
    fileUrl: '/forms/contractor-info.pdf'
  },
  {
    id: 'form-3',
    name: 'Property Impact Assessment',
    type: 'form', 
    category: 'Required Forms',
    description: 'Assessment of potential impact on neighboring properties',
    requiresSignature: true,
    fileUrl: '/forms/impact-assessment.pdf'
  },
  {
    id: 'form-4',
    name: 'Construction Timeline Notice',
    type: 'form',
    category: 'Optional Forms',
    description: 'Notification form for construction schedule and duration',
    requiresSignature: true,
    fileUrl: '/forms/construction-timeline.pdf'
  },
  {
    id: 'form-5',
    name: 'Temporary Parking Request',
    type: 'form',
    category: 'Optional Forms',
    description: 'Request for temporary parking during construction',
    requiresSignature: true,
    fileUrl: '/forms/parking-request.pdf'
  },
  {
    id: 'doc-1',
    name: 'Architectural Guidelines',
    type: 'document',
    category: 'Reference Documents',
    description: 'Community architectural standards and guidelines',
    requiresSignature: false,
    fileUrl: '/docs/architectural-guidelines.pdf'
  },
  {
    id: 'doc-2',
    name: 'Color Palette Guide', 
    type: 'document',
    category: 'Reference Documents',
    description: 'Approved paint colors and exterior finishes',
    requiresSignature: false,
    fileUrl: '/docs/color-palette.pdf'
  },
  {
    id: 'doc-3',
    name: 'Landscaping Requirements',
    type: 'document',
    category: 'Reference Documents', 
    description: 'Guidelines for landscaping and plant selection',
    requiresSignature: false,
    fileUrl: '/docs/landscaping-requirements.pdf'
  },
  {
    id: 'doc-4',
    name: 'HOA Contact Directory',
    type: 'document',
    category: 'Reference Documents',
    description: 'Contact information for HOA management and board members',
    requiresSignature: false,
    fileUrl: '/docs/contact-directory.pdf'
  },
  {
    id: 'doc-5',
    name: 'Permit Application Guide',
    type: 'document',
    category: 'Reference Documents',
    description: 'Step-by-step guide for city permit applications',
    requiresSignature: false,
    fileUrl: '/docs/permit-guide.pdf'
  }
];


