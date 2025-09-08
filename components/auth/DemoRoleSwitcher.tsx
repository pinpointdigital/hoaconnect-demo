'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { UserRole, ROLE_DISPLAY_NAMES } from '@/lib/auth/types';
import { ChevronUp, User, Shield, Home as HomeIcon, Building, RotateCcw, CornerDownLeft, CornerDownRight, CornerUpLeft, CornerUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Position = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  'captain': <Shield size={16} />,
  'board-member': <User size={16} />,
  'homeowner': <HomeIcon size={16} />,
  'management-company': <Building size={16} />
};

const POSITION_CLASSES: Record<Position, string> = {
  'bottom-left': 'bottom-6 left-6',
  'bottom-right': 'bottom-6 right-6', 
  'top-left': 'top-20 left-6',
  'top-right': 'top-20 right-6'
};

const POSITION_ICONS: Record<Position, React.ReactNode> = {
  'bottom-left': <CornerDownLeft size={14} />,
  'bottom-right': <CornerDownRight size={14} />,
  'top-left': <CornerUpLeft size={14} />,
  'top-right': <CornerUpRight size={14} />
};

export function DemoRoleSwitcher() {
  const { currentRole, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>('bottom-right');
  const router = useRouter();

  // Load saved position from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('demo-role-switcher-position');
    if (saved && Object.keys(POSITION_CLASSES).includes(saved)) {
      setPosition(saved as Position);
    }
  }, []);

  // Save position when it changes
  useEffect(() => {
    localStorage.setItem('demo-role-switcher-position', position);
  }, [position]);

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setIsOpen(false);
  };

  const handleDemoRestart = () => {
    router.push('/');
    setIsOpen(false);
  };

  const handlePositionChange = (newPosition: Position) => {
    setPosition(newPosition);
    setIsOpen(false);
  };

  return (
    <div className={`fixed ${POSITION_CLASSES[position]} z-50 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-70'}`}>
      <div className="bg-neutral-900 text-white rounded-lg shadow-lg border border-neutral-700">
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="mb-2 bg-neutral-800 rounded-lg border border-neutral-700 min-w-[280px]">
            <div className="p-3 border-b border-neutral-700">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src="/hoa-connect-logo-icon-white.png"
                  alt="HOA Connect"
                  className="w-4 h-4 object-contain"
                />
                <span className="text-sm font-medium text-white">HOA Connect Demo</span>
              </div>
              <p className="text-xs text-neutral-400">
                Switch roles to see different user experiences
              </p>
            </div>
            
            <div className="p-2">
              {Object.entries(ROLE_DISPLAY_NAMES).map(([role, displayName]) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role as UserRole)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-3 cursor-pointer ${
                    role === currentRole 
                      ? 'bg-white text-neutral-900' 
                      : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  {ROLE_ICONS[role as UserRole]}
                  <div className="flex-1">
                    <div className="font-medium">{displayName}</div>
                  </div>
                  {role === currentRole && (
                    <div className="text-xs bg-neutral-900 text-white px-2 py-0.5 rounded font-medium">
                      Active
                    </div>
                  )}
                </button>
              ))}
              
              <div className="border-t border-neutral-700 mt-2 pt-2 space-y-1">
                {/* Compact Position Controls */}
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white">Position</span>
                    <div className="flex gap-1">
                      {Object.entries(POSITION_ICONS).map(([pos, icon]) => (
                        <button
                          key={pos}
                          onClick={() => handlePositionChange(pos as Position)}
                          className={`p-2 rounded transition-colors cursor-pointer ${
                            pos === position 
                              ? 'bg-white text-black' 
                              : 'text-neutral-400 hover:bg-neutral-600 hover:text-white'
                          }`}
                          title={`Move to ${pos.replace('-', ' ')}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleDemoRestart}
                  className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-3 cursor-pointer text-neutral-300 hover:bg-neutral-700 hover:text-white"
                >
                  <RotateCcw size={16} />
                  <span>Restart Demo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors cursor-pointer rounded-lg"
        >
          {ROLE_ICONS[currentRole]}
          <div className="flex-1 text-left">
            <div className="text-xs text-neutral-400 uppercase tracking-wide">Demo Role</div>
            <div>{ROLE_DISPLAY_NAMES[currentRole]}</div>
          </div>
          <ChevronUp size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}
