/**
 * HOA Connect Authentication & Role Management Types
 * Defines user roles and permissions for the demo platform
 */

export type UserRole = 'captain' | 'board-member' | 'homeowner' | 'management-company';

export interface UserPermissions {
  // ARC Workflow Permissions
  canReviewARCRequests: boolean;
  canApproveARCRequests: boolean;
  canSubmitARCRequests: boolean;
  canViewAllARCRequests: boolean;
  
  // Vendor Management Permissions
  canManageVendors: boolean;
  canScheduleVendorTasks: boolean;
  canViewVendorPerformance: boolean;
  
  // Communications Permissions
  canPublishNotices: boolean;
  canCreateForms: boolean;
  canViewAllCommunications: boolean;
  
  // Administrative Permissions
  canAccessPresenterTools: boolean;
  canConfigureBranding: boolean;
  canManageResidents: boolean;
  canViewReports: boolean;
  
  // Onboarding Permissions
  canManageWelcomeCommittee: boolean;
  canViewOnboardingProgress: boolean;
}

export interface UserProfile {
  role: UserRole;
  name: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  permissions: UserPermissions;
}

export interface AuthContextType {
  currentRole: UserRole;
  userProfile: UserProfile;
  switchRole: (role: UserRole) => void;
  permissions: UserPermissions;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  updateProfile: (updates: Partial<Omit<UserProfile, 'role' | 'permissions'>>) => void;
}

// Role Definitions with Permissions
export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  'captain': {
    // Full administrative access
    canReviewARCRequests: true,
    canApproveARCRequests: true,
    canSubmitARCRequests: true,
    canViewAllARCRequests: true,
    canManageVendors: true,
    canScheduleVendorTasks: true,
    canViewVendorPerformance: true,
    canPublishNotices: true,
    canCreateForms: true,
    canViewAllCommunications: true,
    canAccessPresenterTools: true,
    canConfigureBranding: true,
    canManageResidents: true,
    canViewReports: true,
    canManageWelcomeCommittee: true,
    canViewOnboardingProgress: true,
  },
  'board-member': {
    // Board-level access with voting rights
    canReviewARCRequests: true,
    canApproveARCRequests: true,
    canSubmitARCRequests: true,
    canViewAllARCRequests: true,
    canManageVendors: false,
    canScheduleVendorTasks: false,
    canViewVendorPerformance: true,
    canPublishNotices: false,
    canCreateForms: false,
    canViewAllCommunications: true,
    canAccessPresenterTools: false,
    canConfigureBranding: false,
    canManageResidents: false,
    canViewReports: true,
    canManageWelcomeCommittee: true,
    canViewOnboardingProgress: true,
  },
  'homeowner': {
    // Resident-level access
    canReviewARCRequests: false,
    canApproveARCRequests: false,
    canSubmitARCRequests: true,
    canViewAllARCRequests: false,
    canManageVendors: false,
    canScheduleVendorTasks: false,
    canViewVendorPerformance: false,
    canPublishNotices: false,
    canCreateForms: false,
    canViewAllCommunications: false,
    canAccessPresenterTools: false,
    canConfigureBranding: false,
    canManageResidents: false,
    canViewReports: false,
    canManageWelcomeCommittee: false,
    canViewOnboardingProgress: false,
  },
  'management-company': {
    // Management company access
    canReviewARCRequests: true,
    canApproveARCRequests: false,
    canSubmitARCRequests: false,
    canViewAllARCRequests: true,
    canManageVendors: true,
    canScheduleVendorTasks: true,
    canViewVendorPerformance: true,
    canPublishNotices: true,
    canCreateForms: true,
    canViewAllCommunications: true,
    canAccessPresenterTools: true,
    canConfigureBranding: false,
    canManageResidents: true,
    canViewReports: true,
    canManageWelcomeCommittee: false,
    canViewOnboardingProgress: true,
  },
};

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  'captain': 'HOA Admin',
  'board-member': 'Board Member',
  'homeowner': 'Homeowner',
  'management-company': 'Management Company'
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  'captain': 'Full administrative access to all HOA management features',
  'board-member': 'Board-level access with voting rights and oversight capabilities',
  'homeowner': 'Resident access for submitting requests and viewing community information',
  'management-company': 'Professional management access with vendor and communication tools'
};

export const DEFAULT_USER_PROFILES: Record<UserRole, Omit<UserProfile, 'role'>> = {
  'captain': {
    name: 'Sarah Johnson',
    email: 'president@hoa.demo',
    phone: '(949) 555-0101',
    permissions: ROLE_PERMISSIONS['captain']
  },
  'board-member': {
    name: 'Mike Chen',
    email: 'board@hoa.demo',
    phone: '(949) 555-0102',
    permissions: ROLE_PERMISSIONS['board-member']
  },
  'homeowner': {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(949) 555-0189',
    address: '1423 Oceanview Drive',
    permissions: ROLE_PERMISSIONS['homeowner']
  },
  'management-company': {
    name: 'ProManage HOA Services',
    email: 'contact@promanage.demo',
    phone: '(949) 555-0200',
    permissions: ROLE_PERMISSIONS['management-company']
  }
};



