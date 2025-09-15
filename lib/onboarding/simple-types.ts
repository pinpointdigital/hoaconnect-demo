/**
 * Simple Onboarding Setup Types
 * Lightweight checkbox-based onboarding configuration
 */

export interface OnboardingItem {
  id: string;
  title: string;
  details?: string;
  enabled: boolean;
  category: 'essentials' | 'community' | 'local-life';
  
  // Reminder settings
  reminder?: {
    sms: boolean;
    email: boolean;
    timing: 'days-before' | 'move-in-date' | 'days-after';
    offsetDays?: number; // Only used for days-before/days-after
  };
  
  // Document attachments
  documents?: {
    type: 'upload' | 'library';
    files: OnboardingDocument[];
  };
  
  // Point of contact
  contact?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface OnboardingDocument {
  id: string;
  name: string;
  url?: string; // For uploaded files
  file?: File; // For new uploads
  uploadedAt: Date;
}

export interface SimpleOnboardingConfig {
  items: OnboardingItem[];
  documentLibrary: OnboardingDocument[];
  lastUpdated: Date;
}

// Feature flags
export const FEATURE_FLAGS = {
  onboarding: {
    simpleEnabled: true // Default true for now
  }
};

// Default seed data
export const DEFAULT_ONBOARDING_ITEMS: OnboardingItem[] = [
  // Essentials
  {
    id: 'welcome-packet',
    title: 'Welcome Packet & HOA Handbook',
    details: 'Comprehensive introduction to community rules, amenities, and contacts',
    enabled: true,
    category: 'essentials'
  },
  {
    id: 'cc-rs-bylaws',
    title: 'CC&Rs and Bylaws Review',
    details: 'Important governing documents every resident should understand',
    enabled: true,
    category: 'essentials'
  },
  {
    id: 'emergency-contacts',
    title: 'Emergency Contacts & Procedures',
    details: 'Key contacts for maintenance emergencies and security',
    enabled: true,
    category: 'essentials'
  },
  {
    id: 'hoa-fees-payment',
    title: 'HOA Fees & Payment Setup',
    details: 'Payment methods, due dates, and auto-pay enrollment',
    enabled: true,
    category: 'essentials'
  },
  {
    id: 'amenity-registration',
    title: 'Amenity Access & Registration',
    details: 'Pool, gym, clubhouse access cards and reservation systems',
    enabled: false,
    category: 'essentials'
  },
  {
    id: 'architectural-guidelines',
    title: 'Architectural Review Guidelines',
    details: 'Process for modifications, landscaping, and exterior changes',
    enabled: true,
    category: 'essentials'
  },

  // Community
  {
    id: 'neighbor-introduction',
    title: 'Meet Your Neighbors',
    details: 'Introduction to immediate neighbors and community leaders',
    enabled: true,
    category: 'community'
  },
  {
    id: 'community-events',
    title: 'Community Events & Calendar',
    details: 'Upcoming social events, meetings, and seasonal activities',
    enabled: true,
    category: 'community'
  },
  {
    id: 'volunteer-opportunities',
    title: 'Volunteer & Committee Opportunities',
    details: 'Ways to get involved in community governance and activities',
    enabled: false,
    category: 'community'
  },
  {
    id: 'communication-channels',
    title: 'Community Communication Channels',
    details: 'Newsletter, social media groups, and announcement systems',
    enabled: true,
    category: 'community'
  },
  {
    id: 'pet-policies',
    title: 'Pet Policies & Registration',
    details: 'Pet rules, registration requirements, and designated areas',
    enabled: false,
    category: 'community'
  },

  // Local Life
  {
    id: 'local-services',
    title: 'Local Services Directory',
    details: 'Recommended contractors, services, and vendors',
    enabled: true,
    category: 'local-life'
  },
  {
    id: 'trash-recycling',
    title: 'Trash & Recycling Schedule',
    details: 'Collection days, guidelines, and special pickup procedures',
    enabled: true,
    category: 'local-life'
  },
  {
    id: 'parking-guidelines',
    title: 'Parking Guidelines & Guest Policies',
    details: 'Resident and guest parking rules, permits, and restrictions',
    enabled: true,
    category: 'local-life'
  },
  {
    id: 'local-attractions',
    title: 'Local Attractions & Dining',
    details: 'Nearby restaurants, shopping, entertainment, and points of interest',
    enabled: false,
    category: 'local-life'
  },
  {
    id: 'transportation',
    title: 'Transportation & Commute Info',
    details: 'Public transit, carpool options, and traffic patterns',
    enabled: false,
    category: 'local-life'
  }
];

export const DEFAULT_SIMPLE_ONBOARDING_CONFIG: SimpleOnboardingConfig = {
  items: DEFAULT_ONBOARDING_ITEMS,
  documentLibrary: [],
  lastUpdated: new Date()
};

// Category display info
export const CATEGORY_INFO = {
  essentials: {
    title: 'Essentials',
    description: 'Critical information every new resident needs',
    color: 'blue'
  },
  community: {
    title: 'Community',
    description: 'Social connections and community involvement',
    color: 'green'
  },
  'local-life': {
    title: 'Local Life',
    description: 'Neighborhood services and local information',
    color: 'purple'
  }
} as const;

// Timing options for reminders
export const TIMING_OPTIONS = [
  { value: 'days-before', label: 'Days before move-in' },
  { value: 'move-in-date', label: 'On move-in date' },
  { value: 'days-after', label: 'Days after move-in' }
] as const;


