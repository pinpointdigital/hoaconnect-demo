'use client';

/**
 * HOA Connect Authentication Context
 * React Context API for managing user roles and permissions
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  UserRole, 
  UserProfile, 
  AuthContextType, 
  UserPermissions,
  ROLE_PERMISSIONS,
  ROLE_DISPLAY_NAMES,
  DEFAULT_USER_PROFILES
} from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_STORAGE_KEY = 'hoa-connect-auth';
const PROFILE_STORAGE_KEY = 'hoa-connect-profile';
const DEFAULT_ROLE: UserRole = 'captain';

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>(DEFAULT_ROLE);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => ({
    role: DEFAULT_ROLE,
    ...DEFAULT_USER_PROFILES[DEFAULT_ROLE]
  }));

  // Load saved role and profile from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const { role } = JSON.parse(saved);
        if (role && Object.keys(ROLE_PERMISSIONS).includes(role)) {
          setCurrentRole(role);
          
          // Load saved profile data for this role
          const savedProfile = localStorage.getItem(`${PROFILE_STORAGE_KEY}-${role}`);
          const baseProfile = DEFAULT_USER_PROFILES[role as UserRole];
          
          if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            setUserProfile({
              role,
              ...baseProfile,
              ...parsed
            });
          } else {
            setUserProfile({
              role,
              ...baseProfile
            });
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load saved role:', error);
    }
  }, []);

  // Save role to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role: currentRole }));
    } catch (error) {
      console.warn('Failed to save role:', error);
    }
  }, [currentRole]);

  const switchRole = useCallback((role: UserRole) => {
    setCurrentRole(role);
    
    // Load any saved profile data for this role
    try {
      const savedProfile = localStorage.getItem(`${PROFILE_STORAGE_KEY}-${role}`);
      const baseProfile = DEFAULT_USER_PROFILES[role];
      
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setUserProfile({
          role,
          ...baseProfile,
          ...parsed
        });
      } else {
        setUserProfile({
          role,
          ...baseProfile
        });
      }
    } catch (error) {
      setUserProfile({
        role,
        ...DEFAULT_USER_PROFILES[role]
      });
    }
    
    console.log(`Switched to role: ${ROLE_DISPLAY_NAMES[role]}`);
  }, []);

  const updateProfile = useCallback((updates: Partial<Omit<UserProfile, 'role' | 'permissions'>>) => {
    const updatedProfile = { ...userProfile, ...updates };
    setUserProfile(updatedProfile);
    
    // Save profile updates to localStorage
    try {
      const { role, permissions, ...profileData } = updatedProfile;
      localStorage.setItem(`${PROFILE_STORAGE_KEY}-${currentRole}`, JSON.stringify(profileData));
    } catch (error) {
      console.warn('Failed to save profile:', error);
    }
  }, [userProfile, currentRole]);

  const hasPermission = useCallback((permission: keyof UserPermissions): boolean => {
    return userProfile.permissions[permission];
  }, [userProfile.permissions]);

  const contextValue: AuthContextType = {
    currentRole,
    userProfile,
    switchRole,
    permissions: userProfile.permissions,
    hasPermission,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hooks for specific auth data
export function useCurrentRole() {
  const { currentRole } = useAuth();
  return currentRole;
}

export function useUserProfile() {
  const { userProfile } = useAuth();
  return userProfile;
}

export function usePermissions() {
  const { permissions, hasPermission } = useAuth();
  return { permissions, hasPermission };
}

export function useRoleDisplayName() {
  const { currentRole } = useAuth();
  return ROLE_DISPLAY_NAMES[currentRole];
}



