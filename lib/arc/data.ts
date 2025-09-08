/**
 * Sample ARC Request Data for Demo
 */

import { ARCRequest } from './types';

export const SAMPLE_ARC_REQUESTS: ARCRequest[] = [
  {
    id: 'arc-001',
    title: 'Front Yard Landscape Renovation',
    description: 'Complete redesign of front yard landscaping including new drought-resistant plants, decorative stones, and updated irrigation system.',
    status: 'board-voting',
    submittedBy: {
      name: 'Michael Rodriguez',
      address: '1247 Seaside Drive',
      email: 'michael.r@email.com',
      phone: '(949) 555-0145'
    },
    submittedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    projectType: 'landscaping',
    estimatedCost: 8500,
    contractor: {
      name: 'Pacific Landscape Management',
      license: 'C-27 #987654',
      contact: '(949) 555-0200'
    },
    documents: [
      {
        id: 'doc-001',
        name: 'Landscape Plan.pdf',
        url: '/demo/landscape-plan.pdf',
        type: 'plan',
        uploadedAt: new Date('2024-01-15')
      },
      {
        id: 'doc-002', 
        name: 'Current Front Yard.jpg',
        url: '/demo/current-yard.jpg',
        type: 'photo',
        uploadedAt: new Date('2024-01-15')
      }
    ],
    reviewNotes: 'Proposal looks good, meets drought-resistance requirements. Checking with neighbors on potential irrigation impact.',
    neighborSignoffs: [
      {
        address: '1245 Seaside Drive',
        name: 'Jennifer Walsh',
        status: 'approved',
        notes: 'Looks great! Happy to see drought-resistant improvements.',
        signedAt: new Date('2024-01-18')
      },
      {
        address: '1249 Seaside Drive', 
        name: 'Robert Kim',
        status: 'pending',
        notes: undefined
      }
    ],
    aiGuidance: {
      compliance: 'compliant',
      suggestions: [
        'Ensure irrigation runoff does not affect neighboring properties',
        'Consider adding water-wise plant labels for educational purposes'
      ],
      relevantRules: [
        'Section 4.2: Landscaping must be drought-resistant',
        'Section 4.5: No irrigation water waste onto sidewalks or streets'
      ],
      generatedAt: new Date('2024-01-17')
    },
    boardVotes: [
      {
        member: 'Sarah Johnson (President)',
        vote: 'approve',
        notes: 'Excellent water conservation approach',
        votedAt: new Date('2024-01-19')
      },
      {
        member: 'Mike Chen',
        vote: 'approve', 
        notes: 'Supports community sustainability goals',
        votedAt: new Date('2024-01-20')
      }
    ]
  },
  {
    id: 'arc-002',
    title: 'Exterior Paint Color Change',
    description: 'Repainting house exterior from current beige to approved warm gray color (Sherwin Williams SW 7029).',
    status: 'approved',
    submittedBy: {
      name: 'Lisa Thompson',
      address: '1156 Ocean View Lane',
      email: 'lisa.thompson@email.com'
    },
    submittedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    projectType: 'paint',
    estimatedCost: 4200,
    contractor: {
      name: 'Orange County Painting Co.',
      license: 'C-33 #876543',
      contact: '(714) 555-0150'
    },
    documents: [
      {
        id: 'doc-003',
        name: 'Color Sample.jpg',
        url: '/demo/color-sample.jpg',
        type: 'photo',
        uploadedAt: new Date('2024-01-10')
      }
    ],
    reviewNotes: 'Color is pre-approved per community guidelines. Fast-track approval.',
    aiGuidance: {
      compliance: 'compliant',
      suggestions: ['Color matches approved palette'],
      relevantRules: ['Section 3.1: Approved exterior color palette'],
      generatedAt: new Date('2024-01-11')
    },
    inspection: {
      scheduledDate: new Date('2024-02-01'),
      inspector: 'David Park - Community Inspector',
      status: 'scheduled'
    }
  },
  {
    id: 'arc-003',
    title: 'Backyard Deck Addition',
    description: 'Adding 12x16 composite deck to backyard with safety railings and integrated lighting.',
    status: 'neighbor-signoff',
    submittedBy: {
      name: 'James Wilson',
      address: '1334 Hillside Court',
      email: 'jwilson@email.com',
      phone: '(949) 555-0167'
    },
    submittedAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-25'),
    projectType: 'addition',
    estimatedCost: 12500,
    contractor: {
      name: 'Coastal Construction LLC',
      license: 'B #765432',
      contact: '(949) 555-0300'
    },
    documents: [
      {
        id: 'doc-004',
        name: 'Deck Plans.pdf',
        url: '/demo/deck-plans.pdf',
        type: 'plan',
        uploadedAt: new Date('2024-01-22')
      },
      {
        id: 'doc-005',
        name: 'Current Backyard.jpg', 
        url: '/demo/current-backyard.jpg',
        type: 'photo',
        uploadedAt: new Date('2024-01-22')
      }
    ],
    reviewNotes: 'Deck design meets setback requirements. Pending neighbor approval due to potential privacy impact.',
    neighborSignoffs: [
      {
        address: '1332 Hillside Court',
        name: 'Maria Gonzalez',
        status: 'pending'
      },
      {
        address: '1336 Hillside Court',
        name: 'Tom Anderson', 
        status: 'pending'
      }
    ]
  },
  {
    id: 'arc-004',
    title: 'Backyard Patio Addition',
    description: 'Install new covered patio with outdoor kitchen area including built-in BBQ, sink, and storage.',
    status: 'neighbor-signoff',
    submittedBy: {
      name: 'Sarah Johnson',
      address: '1423 Oceanview Drive',
      email: 'sarah.johnson@email.com',
      phone: '(949) 555-0189'
    },
    submittedAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-02'),
    projectType: 'addition',
    estimatedCost: 15000,
    contractor: {
      name: 'Pacific Outdoor Living',
      license: 'C-27-1234567',
      contact: '(949) 555-0298'
    },
    neighborSignoffs: [
      {
        address: '1421 Oceanview Drive',
        name: 'Robert Chen',
        status: 'approved',
        submittedAt: new Date('2024-01-30')
      },
      {
        address: '1425 Oceanview Drive', 
        name: 'Maria Santos',
        status: 'pending'
      }
    ]
  }
];


