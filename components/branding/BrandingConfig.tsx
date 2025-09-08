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
  const { config, updateHOAInfo, updateAssets, resetToDefaults, softReset } = useBranding();
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
    <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                              variant="outline"
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
