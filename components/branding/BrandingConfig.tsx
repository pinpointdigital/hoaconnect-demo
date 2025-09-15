'use client';

import React, { useState, useEffect } from 'react';
import { useBranding } from '@/lib/branding/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { HOAInfo, UtilityCompany } from '@/lib/branding/types';
import { X, Trash2, Plus } from 'lucide-react';

interface BrandingConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrandingConfig({ isOpen, onClose }: BrandingConfigProps) {
  const { config, updateHOAInfo, updateAssets, updateHOAUsers, updateServiceCredentials, resetToDefaults, softReset } = useBranding();
  const [formData, setFormData] = useState<HOAInfo>(config.hoaInfo);
  const [communityImageFiles, setCommunityImageFiles] = useState<File[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [twilioTestStatus, setTwilioTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [sendGridTestStatus, setSendGridTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testEmailAddress, setTestEmailAddress] = useState('');

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

  const handleDemoReset = () => {
    // Reset HOA info and admin info to defaults, but keep service credentials
    const defaultConfig = {
      hoaInfo: {
        name: "Sample HOA Community",
        address: {
          street: "123 Community Drive",
          city: "San Juan Capistrano",
          state: "CA",
          zip: "92675"
        },
        admin: {
          name: "John Smith",
          role: "HOA President",
          email: "president@samplehoa.com",
          phone: "(949) 555-0123"
        }
      }
    };
    
    updateHOAInfo(defaultConfig.hoaInfo);
    setFormData(defaultConfig.hoaInfo);
    onClose();
  };

  const handleFullReset = () => {
    setShowResetModal(true);
  };

  const confirmFullReset = () => {
    resetToDefaults();
    setFormData(config.hoaInfo);
    setCommunityImageFiles([]);
    setShowResetModal(false);
    onClose();
  };

  const testTwilioConnection = async () => {
    const twilioConfig = config.serviceCredentials?.twilio;
    
    if (!twilioConfig?.accountSid || !twilioConfig?.authToken || !twilioConfig?.phoneNumber || !testPhoneNumber) {
      setTwilioTestStatus('error');
      setTimeout(() => setTwilioTestStatus('idle'), 3000);
      return;
    }

    setTwilioTestStatus('testing');
    
    try {
      // Simulate API call - in real implementation, this would be a server-side API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate success
      // In production, you'd make an actual API call to send test SMS
      console.log('Sending test SMS via Twilio:', {
        from: twilioConfig.phoneNumber,
        to: testPhoneNumber,
        message: 'Test message from HOA Connect demo platform'
      });
      
      setTwilioTestStatus('success');
      setTimeout(() => setTwilioTestStatus('idle'), 5000);
    } catch (error) {
      console.error('Twilio test failed:', error);
      setTwilioTestStatus('error');
      setTimeout(() => setTwilioTestStatus('idle'), 3000);
    }
  };

  const testSendGridConnection = async () => {
    const sendGridConfig = config.serviceCredentials?.sendGrid;
    
    if (!sendGridConfig?.apiKey || !sendGridConfig?.fromEmail || !testEmailAddress) {
      setSendGridTestStatus('error');
      setTimeout(() => setSendGridTestStatus('idle'), 3000);
      return;
    }

    setSendGridTestStatus('testing');
    
    try {
      // Simulate API call - in real implementation, this would be a server-side API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate success
      // In production, you'd make an actual API call to send test email
      console.log('Sending test email via SendGrid:', {
        from: sendGridConfig.fromEmail,
        fromName: sendGridConfig.fromName,
        to: testEmailAddress,
        subject: 'Test Email from HOA Connect Demo',
        message: 'This is a test email from the HOA Connect demo platform'
      });
      
      setSendGridTestStatus('success');
      setTimeout(() => setSendGridTestStatus('idle'), 5000);
    } catch (error) {
      console.error('SendGrid test failed:', error);
      setSendGridTestStatus('error');
      setTimeout(() => setSendGridTestStatus('idle'), 3000);
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





            {/* Service Credentials */}
            <section>
              <h3 className="text-lg font-medium text-foreground mb-4">Service Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure live credentials for SMS and email services (optional)
              </p>
              
              {/* Twilio Configuration */}
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src="/HOAConnect_Twilio.png" 
                    alt="Twilio" 
                    className="h-6 w-auto"
                  />
                  <h4 className="text-md font-medium text-red-900">SMS Notification Service</h4>
                </div>
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
                
                {/* Test SMS Section */}
                <div className="mt-4 p-3 bg-white rounded border border-red-300">
                  <h5 className="text-sm font-medium text-red-900 mb-3">Test SMS Message</h5>
                  <div className="space-y-3">
                    <Input
                      label="Test Phone Number"
                      value={testPhoneNumber}
                      onChange={(e) => setTestPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                      helperText="Enter a phone number to receive a test SMS"
                    />
                    
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={testTwilioConnection}
                        disabled={twilioTestStatus === 'testing' || !testPhoneNumber}
                        className="flex items-center gap-2"
                      >
                        {twilioTestStatus === 'testing' && (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        )}
                        {twilioTestStatus === 'success' && <span className="text-green-600">✓</span>}
                        {twilioTestStatus === 'error' && <span className="text-red-600">✗</span>}
                        {twilioTestStatus === 'testing' ? 'Sending...' : 'Send Test SMS'}
                      </Button>
                      
                      <div className="text-right">
                        {twilioTestStatus === 'success' && (
                          <span className="text-sm text-green-600 font-medium">Test SMS sent successfully!</span>
                        )}
                        {twilioTestStatus === 'error' && (
                          <span className="text-sm text-red-600 font-medium">Failed - check credentials & phone number</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SendGrid Configuration */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src="/HOAConnect_SendGrid.png" 
                    alt="SendGrid" 
                    className="h-6 w-auto"
                  />
                  <h4 className="text-md font-medium text-blue-900">Email Notification Service</h4>
                </div>
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
                
                {/* Test Email Section */}
                <div className="mt-4 p-3 bg-white rounded border border-blue-300">
                  <h5 className="text-sm font-medium text-blue-900 mb-3">Test Email Message</h5>
                  <div className="space-y-3">
                    <Input
                      label="Test Email Address"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      placeholder="test@example.com"
                      helperText="Enter an email address to receive a test email"
                      type="email"
                    />
                    
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={testSendGridConnection}
                        disabled={sendGridTestStatus === 'testing' || !testEmailAddress}
                        className="flex items-center gap-2"
                      >
                        {sendGridTestStatus === 'testing' && (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        )}
                        {sendGridTestStatus === 'success' && <span className="text-green-600">✓</span>}
                        {sendGridTestStatus === 'error' && <span className="text-red-600">✗</span>}
                        {sendGridTestStatus === 'testing' ? 'Sending...' : 'Send Test Email'}
                      </Button>
                      
                      <div className="text-right">
                        {sendGridTestStatus === 'success' && (
                          <span className="text-sm text-green-600 font-medium">Test email sent successfully!</span>
                        )}
                        {sendGridTestStatus === 'error' && (
                          <span className="text-sm text-red-600 font-medium">Failed - check credentials & email address</span>
                        )}
                      </div>
                    </div>
                  </div>
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
                onClick={handleDemoReset}
                size="sm"
              >
                Demo Reset
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

      {/* Branded Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            {/* HOA Connect Logo */}
            <div className="mb-6">
              <img
                src="/hoa-connect-logo.png"
                alt="HOA Connect"
                className="h-10 w-auto mx-auto"
              />
            </div>
            
            {/* Warning Content */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Full Reset Confirmation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                This will permanently reset <strong>all demo settings</strong> including:
              </p>
              <ul className="text-sm text-gray-600 mt-3 space-y-1 text-left">
                <li>• HOA information and contact details</li>
                <li>• Service integration credentials</li>
                <li>• All customization settings</li>
              </ul>
              <p className="text-gray-800 font-medium mt-4">
                This action cannot be undone.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button 
                variant="secondary" 
                onClick={() => setShowResetModal(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmFullReset}
                className="px-6 bg-red-600 hover:bg-red-700 text-white"
              >
                Reset Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
