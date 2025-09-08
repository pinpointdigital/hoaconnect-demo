'use client';

import React, { useState, useEffect } from 'react';
import { useBranding } from '@/lib/branding/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { HOAInfo } from '@/lib/branding/types';
import { X, Trash2 } from 'lucide-react';

interface BrandingConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrandingConfig({ isOpen, onClose }: BrandingConfigProps) {
  const { config, updateHOAInfo, updateAssets, updateHOAUsers, updateServiceCredentials, resetToDefaults, softReset } = useBranding();
  const [formData, setFormData] = useState<HOAInfo>(config.hoaInfo);
  const [communityImageFiles, setCommunityImageFiles] = useState<File[]>([]);

  // Update form data when config changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(config.hoaInfo);
    }
  }, [isOpen, config.hoaInfo]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string, nested?: string) => {
    setFormData(prev => {
      if (nested && nested === 'address') {
        return {
          ...prev,
          address: {
            ...prev.address,
            [field]: value
          }
        };
      } else if (nested && nested === 'admin') {
        return {
          ...prev,
          admin: {
            ...prev.admin,
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };


  const handleCommunityImagesChange = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files).slice(0, 5); // Limit to 5 images
    const currentImages = config.assets.communityImages || [];
    
    // Don't add more than 5 total images
    if (currentImages.length + fileArray.length > 5) {
      alert('Maximum 5 community images allowed');
      return;
    }
    
    setCommunityImageFiles(prev => [...prev, ...fileArray]);
    
    // Process each file
    fileArray.forEach((file, index) => {
      console.log(`Uploading community image ${index + 1}:`, file.name, file.size, file.type);
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        console.log(`Community image ${index + 1} data URL length:`, url.length);
        
        updateAssets({
          communityImages: [
            ...(config.assets.communityImages || []),
            { url, file }
          ]
        });
      };
      reader.onerror = (e) => {
        console.error(`Error reading community image ${index + 1}:`, e);
      };
      reader.readAsDataURL(file);
    });
  };


  const handleDeleteCommunityImage = (index: number) => {
    const currentImages = config.assets.communityImages || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    
    updateAssets({
      communityImages: updatedImages
    });
    
    // Also update local state
    setCommunityImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleHOAUserChange = (userType: 'captain' | 'boardMember' | 'management', field: string, value: string) => {
    updateHOAUsers({
      [userType]: {
        ...config.hoaUsers?.[userType],
        [field]: value
      }
    });
  };

  const handleServiceCredentialChange = (service: 'twilio' | 'sendGrid', field: string, value: string) => {
    updateServiceCredentials({
      [service]: {
        ...config.serviceCredentials?.[service],
        [field]: value
      }
    });
  };

  const handleSave = () => {
    updateHOAInfo(formData);
    onClose();
  };

  const handleSoftReset = () => {
    softReset();
    onClose();
  };

  const handleFullReset = () => {
    if (confirm('This will reset all HOA information and uploaded assets. Are you sure?')) {
      resetToDefaults();
      setFormData(config.hoaInfo);
      setCommunityImageFiles([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Demo Personalization
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* HOA Information */}
            <section>
              <h3 className="text-lg font-medium text-foreground mb-4">HOA Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="HOA Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter HOA name"
                  />
                </div>
                <Input
                  label="Street Address"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('street', e.target.value, 'address')}
                  placeholder="123 Community Drive"
                />
                <Input
                  label="City"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('city', e.target.value, 'address')}
                  placeholder="San Juan Capistrano"
                />
                <Input
                  label="State"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('state', e.target.value, 'address')}
                  placeholder="CA"
                />
                <Input
                  label="ZIP Code"
                  value={formData.address.zip}
                  onChange={(e) => handleInputChange('zip', e.target.value, 'address')}
                  placeholder="92675"
                />
              </div>
            </section>

            {/* Admin Information */}
            <section>
              <h3 className="text-lg font-medium text-foreground mb-4">HOA Administrator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Admin Name"
                  value={formData.admin.name}
                  onChange={(e) => handleInputChange('name', e.target.value, 'admin')}
                  placeholder="John Smith"
                />
                <Input
                  label="Role/Title"
                  value={formData.admin.role}
                  onChange={(e) => handleInputChange('role', e.target.value, 'admin')}
                  placeholder="HOA President"
                />
                <Input
                  label="Email (Optional)"
                  type="email"
                  value={formData.admin.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value, 'admin')}
                  placeholder="president@hoa.com"
                />
                <Input
                  label="Phone (Optional)"
                  type="tel"
                  value={formData.admin.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value, 'admin')}
                  placeholder="(949) 555-0123"
                />
              </div>
            </section>

            {/* Presentation Label */}
            <section>
              <h3 className="text-lg font-medium text-foreground mb-4">Presentation</h3>
              <Input
                label="Presented To Label"
                value={formData.presentedTo || ''}
                onChange={(e) => handleInputChange('presentedTo', e.target.value)}
                placeholder="Presented to: Seaside HOA Board"
                helperText="This will appear on the landing page"
              />
            </section>

            {/* File Uploads */}
            <section>
              <h3 className="text-lg font-medium text-foreground mb-4">Presentation Background</h3>
              <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Community Images (3-5 images for slideshow)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleCommunityImagesChange(e.target.files)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Select multiple images for a slideshow effect. Maximum 5 images.
                  </p>
                  
                  {config.assets.communityImages && config.assets.communityImages.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium text-foreground">
                        Uploaded Images ({config.assets.communityImages.length}/5)
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {config.assets.communityImages.map((image, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                            <img
                              src={image.url}
                              alt={`Community Image ${index + 1}`}
                              className="h-12 w-12 object-cover border rounded"
                              onError={() => console.error(`Preview image ${index + 1} failed to load`)}
                              onLoad={() => console.log(`Preview image ${index + 1} loaded successfully`)}
                            />
                            <div className="flex-1 text-xs text-muted-foreground">
                              Image {index + 1}
                            </div>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => handleDeleteCommunityImage(index)}
                              className="text-error border-error hover:bg-error hover:text-white p-1"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
            </section>

            {/* HOA User Management */}
            <section>
              <h3 className="text-lg font-medium text-foreground mb-4">HOA User Profiles</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage contact information for built-in demo user roles
              </p>
              
              {/* HOA Captain */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-md font-medium text-blue-900 mb-3">HOA Captain/President</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Name"
                    value={config.hoaUsers?.captain?.name || ''}
                    onChange={(e) => handleHOAUserChange('captain', 'name', e.target.value)}
                    placeholder="Sarah Johnson"
                  />
                  <Input
                    label="Email"
                    value={config.hoaUsers?.captain?.email || ''}
                    onChange={(e) => handleHOAUserChange('captain', 'email', e.target.value)}
                    placeholder="president@samplehoa.com"
                  />
                  <Input
                    label="Phone"
                    value={config.hoaUsers?.captain?.phone || ''}
                    onChange={(e) => handleHOAUserChange('captain', 'phone', e.target.value)}
                    placeholder="(949) 555-0101"
                  />
                  <Input
                    label="Role Title"
                    value={config.hoaUsers?.captain?.role || ''}
                    onChange={(e) => handleHOAUserChange('captain', 'role', e.target.value)}
                    placeholder="HOA President"
                  />
                </div>
              </div>

              {/* Board Member */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-md font-medium text-green-900 mb-3">Board Member</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Name"
                    value={config.hoaUsers?.boardMember?.name || ''}
                    onChange={(e) => handleHOAUserChange('boardMember', 'name', e.target.value)}
                    placeholder="Mike Chen"
                  />
                  <Input
                    label="Email"
                    value={config.hoaUsers?.boardMember?.email || ''}
                    onChange={(e) => handleHOAUserChange('boardMember', 'email', e.target.value)}
                    placeholder="board@samplehoa.com"
                  />
                  <Input
                    label="Phone"
                    value={config.hoaUsers?.boardMember?.phone || ''}
                    onChange={(e) => handleHOAUserChange('boardMember', 'phone', e.target.value)}
                    placeholder="(949) 555-0102"
                  />
                  <Input
                    label="Role Title"
                    value={config.hoaUsers?.boardMember?.role || ''}
                    onChange={(e) => handleHOAUserChange('boardMember', 'role', e.target.value)}
                    placeholder="Board Member"
                  />
                </div>
              </div>

              {/* Management Company */}
              <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-md font-medium text-purple-900 mb-3">Management Company</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Company Name"
                    value={config.hoaUsers?.management?.name || ''}
                    onChange={(e) => handleHOAUserChange('management', 'name', e.target.value)}
                    placeholder="ProManage HOA Services"
                  />
                  <Input
                    label="Email"
                    value={config.hoaUsers?.management?.email || ''}
                    onChange={(e) => handleHOAUserChange('management', 'email', e.target.value)}
                    placeholder="contact@promanage.demo"
                  />
                  <Input
                    label="Phone"
                    value={config.hoaUsers?.management?.phone || ''}
                    onChange={(e) => handleHOAUserChange('management', 'phone', e.target.value)}
                    placeholder="(949) 555-0200"
                  />
                  <Input
                    label="Role Title"
                    value={config.hoaUsers?.management?.role || ''}
                    onChange={(e) => handleHOAUserChange('management', 'role', e.target.value)}
                    placeholder="Management Company"
                  />
                </div>
              </div>
            </section>

            {/* Service Credentials */}
            <section>
              <h3 className="text-lg font-medium text-foreground mb-4">Service Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure live credentials for SMS and email services (optional)
              </p>
              
              {/* Twilio Configuration */}
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="text-md font-medium text-red-900 mb-3">📱 Twilio SMS</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Account SID"
                    value={config.serviceCredentials?.twilio?.accountSid || ''}
                    onChange={(e) => handleServiceCredentialChange('twilio', 'accountSid', e.target.value)}
                    placeholder="AC..."
                    type="password"
                  />
                  <Input
                    label="Auth Token"
                    value={config.serviceCredentials?.twilio?.authToken || ''}
                    onChange={(e) => handleServiceCredentialChange('twilio', 'authToken', e.target.value)}
                    placeholder="Your auth token"
                    type="password"
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Phone Number"
                      value={config.serviceCredentials?.twilio?.phoneNumber || ''}
                      onChange={(e) => handleServiceCredentialChange('twilio', 'phoneNumber', e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* SendGrid Configuration */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-md font-medium text-blue-900 mb-3">📧 SendGrid Email</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <Input
                      label="API Key"
                      value={config.serviceCredentials?.sendGrid?.apiKey || ''}
                      onChange={(e) => handleServiceCredentialChange('sendGrid', 'apiKey', e.target.value)}
                      placeholder="SG..."
                      type="password"
                    />
                  </div>
                  <Input
                    label="From Email"
                    value={config.serviceCredentials?.sendGrid?.fromEmail || ''}
                    onChange={(e) => handleServiceCredentialChange('sendGrid', 'fromEmail', e.target.value)}
                    placeholder="noreply@yourhoa.com"
                  />
                  <Input
                    label="From Name"
                    value={config.serviceCredentials?.sendGrid?.fromName || ''}
                    onChange={(e) => handleServiceCredentialChange('sendGrid', 'fromName', e.target.value)}
                    placeholder="Your HOA Name"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border">
            <Button onClick={handleSave} size="lg">
              Save Configuration
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <div className="ml-auto flex gap-3">
              <Button 
                variant="ghost" 
                onClick={handleSoftReset}
                size="sm"
              >
                Soft Reset
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleFullReset}
                size="sm"
                className="text-error hover:bg-error/10 hover:text-error"
              >
                Full Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
