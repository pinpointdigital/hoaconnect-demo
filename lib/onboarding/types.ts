/**
 * New Resident Onboarding Types
 * Defines interfaces for the onboarding checklist and progress tracking
 */

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'registration' | 'access' | 'amenities' | 'rules' | 'community';
  isCompleted: boolean;
  completedAt?: Date;
  isRequired: boolean;
  estimatedMinutes?: number;
  links?: {
    label: string;
    url: string;
    type: 'form' | 'document' | 'contact' | 'external';
  }[];
}

export interface OnboardingProgress {
  residentId: string;
  residentName: string;
  address: string;
  email: string;
  phone?: string;
  moveInDate: Date;
  startedAt: Date;
  lastUpdated: Date;
  items: ChecklistItem[];
  overallProgress: number; // 0-100 percentage
  isCompleted: boolean;
  completedAt?: Date;
}

export interface OnboardingCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: ChecklistItem[];
  progress: number;
  isCompleted: boolean;
}

export const ONBOARDING_CATEGORIES = [
  'registration',
  'access', 
  'amenities',
  'rules',
  'community'
] as const;

export const CATEGORY_INFO = {
  registration: {
    name: 'Registration',
    description: 'Complete your resident registration and contact information',
    icon: 'user-plus'
  },
  access: {
    name: 'Access & Security',
    description: 'Set up gate codes, fobs, and security access',
    icon: 'key'
  },
  amenities: {
    name: 'Amenities',
    description: 'Learn about and gain access to community amenities',
    icon: 'home'
  },
  rules: {
    name: 'Rules & Guidelines',
    description: 'Review community rules, CC&Rs, and guidelines',
    icon: 'book'
  },
  community: {
    name: 'Community',
    description: 'Connect with neighbors and community resources',
    icon: 'users'
  }
} as const;


