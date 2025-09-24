'use client';

import { useAuth } from '@/lib/auth/context';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Wrench, 
  MessageSquare, 
  Home as HomeIcon,
  UserPlus,
  CreditCard,
  User,
  ClipboardCheck
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  permission?: keyof import('@/lib/auth/types').UserPermissions;
  disabled?: boolean;
  hasNotification?: boolean;
}

const getNavigation = (userRole: import('@/lib/auth/types').UserRole): NavItem[] => [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  
  // ARC Requests - Different access levels
  ...(userRole === 'homeowner' 
    ? [{ name: 'My ARC Requests', href: '/dashboard/arc', icon: <FileText size={20} />, hasNotification: true }]
    : [
        { name: 'ARC Management', href: '/dashboard/arc-management', icon: <ClipboardCheck size={20} />, permission: 'canReviewARCRequests' as const }
      ]
  ),
  
  // Onboarding & Welcome - Admin/Board only
  ...(userRole !== 'homeowner' ? [
    { name: 'New Residents', href: '/dashboard/new-residents', icon: <UserPlus size={20} />, permission: 'canViewOnboardingProgress' as const },
  ] : []),
  
  // Residents - Admin/Management only
  ...(userRole === 'captain' || userRole === 'management-company' ? [
    { name: 'Residents', href: '/residents', icon: <Users size={20} />, permission: 'canManageResidents' as const },
  ] : []),
  
  // Vendors - Admin/Management/Board
  ...(userRole !== 'homeowner' ? [
    { name: 'Vendors', href: '/vendors', icon: <Wrench size={20} />, permission: 'canViewVendorPerformance' as const },
  ] : []),
  
  // Communications - Role-specific access
  ...(userRole === 'homeowner'
    ? [
        { name: 'Community News', href: '/communications', icon: <MessageSquare size={20} />, disabled: true },
        { name: 'Pay HOA Fees', href: '/billing', icon: <CreditCard size={20} />, disabled: true }
      ]
    : [{ name: 'Communications', href: '/communications', icon: <MessageSquare size={20} />, permission: 'canViewAllCommunications' as const }]
  ),
  
  // My Account - Homeowner only, Community Info for others
  ...(userRole === 'homeowner'
    ? [{ name: 'My Account', href: '/dashboard/account', icon: <User size={20} /> }]
    : [{ name: 'HOA Community Info', href: '/community', icon: <HomeIcon size={20} /> }]
  ),
];

export function Sidebar() {
  const { hasPermission, currentRole } = useAuth();
  const pathname = usePathname();

  const navigation = getNavigation(currentRole);
  const visibleNavigation = navigation.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <nav className="w-64 bg-white border-r border-ink-900/8 h-full">
      <div className="p-6">
        <div className="space-y-1">
          {visibleNavigation.map((item) => (
            item.disabled ? (
              <div
                key={item.name}
                className="group flex items-center px-3 py-2 text-body font-medium rounded-ctl text-neutral-400 cursor-not-allowed"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-body font-medium rounded-ctl transition-all duration-150 cursor-pointer ${
                  pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-ink-800 hover:bg-neutral-50 hover:text-ink-900 hover:-translate-y-0.5 hover:underline'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="flex items-center gap-2">
                  {item.name}
                  {item.hasNotification && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </span>
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  );
}
