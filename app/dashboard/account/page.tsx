'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  User, 
  Shield, 
  CreditCard, 
  Eye, 
  EyeOff,
  Save,
  Camera,
  Upload
} from 'lucide-react';

export default function AccountPage() {
  const { userProfile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'billing'>('account');
  const [showPassword, setShowPassword] = useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateProfile({ profilePhoto: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updateProfile({ profilePhoto: undefined });
  };

  return (
    <div className="space-y-6">
      {/* Header with Page Header Format */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-ink-900">My Account</h1>
            <p className="text-body text-ink-700 mt-1">
              Manage your account settings, security, and billing information
            </p>
          </div>
        </div>

        {/* Sub-Navigation */}
        <div className="flex gap-1 border-b border-neutral-200">
          <button 
            className={`px-4 py-2 text-body font-medium border-b-2 transition-colors ${
              activeTab === 'account'
                ? 'text-primary border-primary bg-primary/5'
                : 'text-ink-800 border-transparent hover:text-primary hover:bg-primary/5'
            }`}
            onClick={() => setActiveTab('account')}
          >
            <User size={16} className="inline mr-2" />
            My Account
          </button>
          <button 
            className={`px-4 py-2 text-body font-medium border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'text-primary border-primary bg-primary/5'
                : 'text-ink-800 border-transparent hover:text-primary hover:bg-primary/5'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} className="inline mr-2" />
            Security
          </button>
          <button 
            className={`px-4 py-2 text-body font-medium border-b-2 transition-colors ${
              activeTab === 'billing'
                ? 'text-primary border-primary bg-primary/5'
                : 'text-ink-800 border-transparent hover:text-primary hover:bg-primary/5'
            }`}
            onClick={() => setActiveTab('billing')}
          >
            <CreditCard size={16} className="inline mr-2" />
            Billing
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* Profile Photo Section */}
            <div>
              <h3 className="text-h3 font-semibold text-ink-900 mb-4">Profile Photo</h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center overflow-hidden">
                  {userProfile.profilePhoto ? (
                    <img 
                      src={userProfile.profilePhoto} 
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-neutral-500" size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-control text-body font-medium transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="sr-only"
                      />
                      <Camera size={14} />
                      {userProfile.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    {userProfile.profilePhoto && (
                      <Button variant="ghost" size="sm" onClick={removePhoto}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-ink-600 mt-2">
                    Upload a profile photo to personalize your account. Recommended size: 200x200px
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-h3 font-semibold text-ink-900">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                defaultValue={userProfile.name}
                placeholder="Enter your full name"
              />
              <Input
                label="Email Address"
                defaultValue={userProfile.email}
                placeholder="Enter your email"
                type="email"
              />
              <Input
                label="Phone Number"
                defaultValue={userProfile.phone || ''}
                placeholder="Enter your phone number"
                type="tel"
              />
              <Input
                label="Property Address"
                defaultValue={userProfile.address || '1423 Oceanview Drive'}
                placeholder="Enter your property address"
              />
            </div>

            <div className="flex justify-end">
              <Button variant="primary">
                <Save size={16} />
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-h3 font-semibold text-ink-900">Password & Security</h3>
            
            <div className="space-y-4">
              <Input
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter current password"
              />
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
              />
              <Input
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
              />
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center gap-2 text-caption text-ink-700 hover:text-ink-900"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPassword ? 'Hide' : 'Show'} passwords
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary">
                <Save size={16} />
                Update Password
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-h3 font-semibold text-ink-900">Billing Information</h3>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                Powered by Stripe
              </span>
            </div>
            
            <div className="space-y-4">
              {/* Current Payment Method */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-control">
                <h4 className="text-body font-medium text-ink-900 mb-2">Current Payment Method</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-ink-600" size={20} />
                    <div>
                      <p className="text-caption font-medium text-ink-900">•••• •••• •••• 4242</p>
                      <p className="text-xs text-ink-600">Expires 12/2025</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">Update</Button>
                </div>
              </div>

              {/* HOA Dues */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-control">
                <h4 className="text-body font-medium text-ink-900 mb-2">HOA Dues</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption font-medium text-ink-900">$285.00 / month</p>
                    <p className="text-xs text-ink-600">Next payment: March 1, 2024</p>
                  </div>
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                    Current
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Billing Address"
                  defaultValue="1423 Oceanview Drive"
                  placeholder="Enter billing address"
                />
                <Input
                  label="City, State ZIP"
                  defaultValue="San Juan Capistrano, CA 92675"
                  placeholder="Enter city, state, and ZIP"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary">
                <Save size={16} />
                Save Billing Info
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
