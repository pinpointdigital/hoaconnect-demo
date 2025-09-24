'use client';

import { DemoRoleSwitcher } from '@/components/auth/DemoRoleSwitcher';
import { BrandedHeader } from '@/components/branding/BrandedHeader';
import { BrandedFooter } from '@/components/branding/BrandedFooter';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Avatar } from '@/components/ui/Avatar';
import { useHOAInfo } from '@/lib/branding/context';
import { useAuth } from '@/lib/auth/context';
import { WorkflowProvider } from '@/lib/arc/workflow-context';
import { User } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const hoaInfo = useHOAInfo();
  const { userProfile } = useAuth();
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* App Header with Role Switcher */}
      <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-ink-900/8 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - HOA Connect Logo + HOA Info */}
            <div className="flex items-center space-x-4">
              <img
                src="/hoa-connect-logo.png"
                alt="HOA Connect"
                className="h-8 w-auto object-contain"
              />
              <div className="w-px h-6 bg-border" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {hoaInfo.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {hoaInfo.address.city}, {hoaInfo.address.state}
                </p>
              </div>
            </div>
            
            {/* Right side - Current User Info + Avatar */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {userProfile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1).replace('-', ' ')}
                </p>
              </div>
              <Avatar 
                name={userProfile.name} 
                size="md" 
                src={userProfile.profilePhoto}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <WorkflowProvider>
            {children}
          </WorkflowProvider>
        </main>
      </div>

      {/* Demo Role Switcher - Bottom Left */}
      <DemoRoleSwitcher />

      {/* App Footer */}
      <BrandedFooter />
    </div>
  );
}
