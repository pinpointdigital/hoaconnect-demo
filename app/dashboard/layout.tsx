'use client';

import { useState, useRef } from 'react';
import { DemoRoleSwitcher } from '@/components/auth/DemoRoleSwitcher';
import { BrandedHeader } from '@/components/branding/BrandedHeader';
import { BrandedFooter } from '@/components/branding/BrandedFooter';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useHOAInfo } from '@/lib/branding/context';
import { useAuth } from '@/lib/auth/context';
import { WorkflowProvider } from '@/lib/arc/workflow-context';
import { User, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const hoaInfo = useHOAInfo();
  const { userProfile, updateProfile } = useAuth();
  
  // Profile editing state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone || '',
    profilePhoto: userProfile.profilePhoto
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile editing functions
  const openProfileModal = () => {
    setEditingProfile({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone || '',
      profilePhoto: userProfile.profilePhoto
    });
    setShowProfileModal(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      if (file instanceof File) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setEditingProfile(prev => ({ ...prev, profilePhoto: previewUrl }));
      }
    }
  };

  const saveProfile = () => {
    updateProfile({
      name: editingProfile.name,
      email: editingProfile.email,
      phone: editingProfile.phone,
      profilePhoto: editingProfile.profilePhoto
    });
    setShowProfileModal(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const cancelEdit = () => {
    setShowProfileModal(false);
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };
  
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
            <button
              onClick={openProfileModal}
              className="flex items-center gap-4 hover:bg-neutral-100 rounded-lg p-2 transition-colors duration-200 cursor-pointer"
              title="Edit profile"
            >
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
            </button>
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

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-h3 font-semibold text-ink-900">Edit Profile</h3>
              <button
                onClick={cancelEdit}
                className="text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Profile Photo */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 mb-3 flex-shrink-0">
                  <Avatar 
                    name={editingProfile.name} 
                    size="xl" 
                    src={editingProfile.profilePhoto}
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </Button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editingProfile.email}
                  onChange={(e) => setEditingProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editingProfile.phone}
                  onChange={(e) => setEditingProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={cancelEdit}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={saveProfile}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
