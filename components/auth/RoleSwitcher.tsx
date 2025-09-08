'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { UserRole, ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS } from '@/lib/auth/types';
import { Button } from '@/components/ui/Button';
import { ChevronDown, User, Shield, Home as HomeIcon, Building } from 'lucide-react';

interface RoleSwitcherProps {
  compact?: boolean;
  className?: string;
}

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  'captain': <Shield size={16} />,
  'board-member': <User size={16} />,
  'homeowner': <HomeIcon size={16} />,
  'management-company': <Building size={16} />
};

export function RoleSwitcher({ compact = false, className = '' }: RoleSwitcherProps) {
  const { currentRole, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
        >
          {ROLE_ICONS[currentRole]}
          <span className="hidden sm:inline">{ROLE_DISPLAY_NAMES[currentRole]}</span>
          <ChevronDown size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-border rounded-lg shadow-lg z-20">
              <div className="p-2">
                {Object.entries(ROLE_DISPLAY_NAMES).map(([role, displayName]) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role as UserRole)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-3 cursor-pointer ${
                      role === currentRole 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    {ROLE_ICONS[role as UserRole]}
                    <div>
                      <div className="font-medium">{displayName}</div>
                      <div className="text-xs opacity-75">
                        {ROLE_DESCRIPTIONS[role as UserRole]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full role switcher for demo presentations
  return (
    <div className={`bg-white border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
        <User size={16} />
        Demo Role Switcher
      </h3>
      
      <div className="space-y-2">
        {Object.entries(ROLE_DISPLAY_NAMES).map(([role, displayName]) => (
          <button
            key={role}
            onClick={() => handleRoleChange(role as UserRole)}
            className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors border ${
              role === currentRole 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-background hover:bg-muted border-border text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              {ROLE_ICONS[role as UserRole]}
              <div className="flex-1">
                <div className="font-medium">{displayName}</div>
                <div className={`text-xs mt-1 ${
                  role === currentRole ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {ROLE_DESCRIPTIONS[role as UserRole]}
                </div>
              </div>
              {role === currentRole && (
                <div className="text-xs font-medium bg-accent text-accent-foreground px-2 py-1 rounded">
                  Active
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-muted rounded-md">
        <p className="text-xs text-muted-foreground">
          <strong>Current Role:</strong> {ROLE_DISPLAY_NAMES[currentRole]}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Role switching instantly updates navigation, permissions, and dashboard content.
        </p>
      </div>
    </div>
  );
}
