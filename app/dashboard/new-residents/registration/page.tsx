'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useHOAInfo } from '@/lib/branding/context';
import { Button } from '@/components/ui/Button';
import { 
  FileText, 
  Save, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Home as HomeIcon,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface RegistrationData {
  // Owner Information
  ownerNames: string;
  homePhone: string;
  cellPhone: string;
  ownerEmails: string;
  
  // Property Information
  propertyAddress: string;
  mailingAddress: string;
  mailingAddressSame: boolean;
  
  // Contact Preferences
  validEmailAddresses: string;
  secondaryMailingAddress: string;
  secondaryEmailAddresses: string;
  preferredDeliveryMethod: 'mail' | 'email' | 'both';
  
  // Rental Information
  isRented: boolean;
  tenantName: string;
  tenantPhone: string;
  tenantEmails: string;
  
  // Submission Info
  submissionDate: string;
  status: 'draft' | 'submitted' | 'approved';
}

const DEFAULT_REGISTRATION: RegistrationData = {
  ownerNames: '',
  homePhone: '',
  cellPhone: '',
  ownerEmails: '',
  propertyAddress: '',
  mailingAddress: '',
  mailingAddressSame: true,
  validEmailAddresses: '',
  secondaryMailingAddress: '',
  secondaryEmailAddresses: '',
  preferredDeliveryMethod: 'both',
  isRented: false,
  tenantName: '',
  tenantPhone: '',
  tenantEmails: '',
  submissionDate: new Date().toISOString().split('T')[0],
  status: 'draft'
};

export default function NewResidentRegistrationPage() {
  const { hasPermission } = useAuth();
  const hoaInfo = useHOAInfo();
  const [formData, setFormData] = useState<RegistrationData>(DEFAULT_REGISTRATION);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Update form field
  const updateField = (field: keyof RegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle mailing address checkbox
  const handleMailingAddressSame = (checked: boolean) => {
    updateField('mailingAddressSame', checked);
    if (checked) {
      updateField('mailingAddress', formData.propertyAddress);
    }
  };

  // Submit form
  const submitForm = async () => {
    setIsSubmitting(true);
    
    // Simulate form processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save to localStorage
    const savedRegistrations = JSON.parse(localStorage.getItem('new-resident-registrations') || '[]');
    const newRegistration = {
      ...formData,
      id: `reg-${Date.now()}`,
      status: 'submitted',
      submissionDate: new Date().toISOString()
    };
    
    savedRegistrations.push(newRegistration);
    localStorage.setItem('new-resident-registrations', JSON.stringify(savedRegistrations));
    
    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  // Download as PDF (mock)
  const downloadPDF = () => {
    alert('PDF download would be implemented here');
  };

  // Check if form is valid
  const isFormValid = formData.ownerNames && formData.propertyAddress && formData.ownerEmails;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="text-blue-600" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-ink-900">New Resident Registration</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadPDF}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1" ref={formRef}>
        {/* Form Header */}
        <div className="p-6 border-b border-ink-900/8 text-center">
          <h2 className="text-2xl font-bold text-ink-900">{hoaInfo.name}</h2>
          <h3 className="text-xl font-semibold text-ink-900 mt-2">Owner Notice Disclosure</h3>
          <p className="text-body text-ink-600 mt-1">Date: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        {/* Legal Notice */}
        <div className="p-6 bg-blue-50 border-b border-ink-900/8">
          <p className="text-body text-ink-900 leading-relaxed">
            <strong>California law requires all Owners in a community association to provide the 
            following information to the association <u>on an annual basis</u>.</strong> Please complete and 
            return this form within ten (10) days. If this form is not returned, then by law Association 
            notices will only be sent to the last property address provided by you, or if none was 
            received, the property address within this association.
          </p>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-6">
          {/* 1. Owner Names */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-1 text-right">
              <span className="text-body font-semibold text-ink-900">1.</span>
            </div>
            <div className="col-span-3">
              <label className="text-body font-medium text-ink-900">Owner Name(s):</label>
            </div>
            <div className="col-span-8">
              <input
                type="text"
                value={formData.ownerNames}
                onChange={(e) => updateField('ownerNames', e.target.value)}
                className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                placeholder="Enter full name(s) of property owner(s)"
              />
            </div>
          </div>

          {/* 2. Owner Phones */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-1 text-right">
              <span className="text-body font-semibold text-ink-900">2.</span>
            </div>
            <div className="col-span-3">
              <label className="text-body font-medium text-ink-900">Owner Phones:</label>
            </div>
            <div className="col-span-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-caption text-ink-700 mb-1">H:</label>
                  <input
                    type="tel"
                    value={formData.homePhone}
                    onChange={(e) => updateField('homePhone', e.target.value)}
                    className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                    placeholder="(949) 555-0123"
                  />
                </div>
                <div>
                  <label className="block text-caption text-ink-700 mb-1">C:</label>
                  <input
                    type="tel"
                    value={formData.cellPhone}
                    onChange={(e) => updateField('cellPhone', e.target.value)}
                    className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                    placeholder="(949) 555-0123"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Owner Emails */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-1 text-right">
              <span className="text-body font-semibold text-ink-900">3.</span>
            </div>
            <div className="col-span-3">
              <label className="text-body font-medium text-ink-900">Owner Email(s):</label>
            </div>
            <div className="col-span-8">
              <input
                type="email"
                value={formData.ownerEmails}
                onChange={(e) => updateField('ownerEmails', e.target.value)}
                className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                placeholder="owner@email.com, spouse@email.com"
              />
            </div>
          </div>

          {/* 4. Property Address */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-1 text-right">
              <span className="text-body font-semibold text-ink-900">4.</span>
            </div>
            <div className="col-span-3">
              <label className="text-body font-medium text-ink-900">Address in the Association:</label>
            </div>
            <div className="col-span-8">
              <input
                type="text"
                value={formData.propertyAddress}
                onChange={(e) => {
                  updateField('propertyAddress', e.target.value);
                  if (formData.mailingAddressSame) {
                    updateField('mailingAddress', e.target.value);
                  }
                }}
                className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                placeholder="123 Community Drive, San Juan Capistrano, CA 92675"
              />
            </div>
          </div>

          {/* 5. Mailing Address */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-1 text-right">
              <span className="text-body font-semibold text-ink-900">5.</span>
            </div>
            <div className="col-span-3">
              <label className="text-body font-medium text-ink-900">Mailing Address (can be same):</label>
            </div>
            <div className="col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sameAddress"
                  checked={formData.mailingAddressSame}
                  onChange={(e) => handleMailingAddressSame(e.target.checked)}
                  className="rounded border-ink-300 text-primary focus:ring-primary"
                />
                <label htmlFor="sameAddress" className="text-body text-ink-700">
                  Same as property address
                </label>
              </div>
              {!formData.mailingAddressSame && (
                <input
                  type="text"
                  value={formData.mailingAddress}
                  onChange={(e) => updateField('mailingAddress', e.target.value)}
                  className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                  placeholder="Different mailing address"
                />
              )}
            </div>
          </div>

          {/* 6. Valid Email Addresses */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-1 text-right">
              <span className="text-body font-semibold text-ink-900">6.</span>
            </div>
            <div className="col-span-3">
              <label className="text-body font-medium text-ink-900">Valid Email Address(es):*</label>
            </div>
            <div className="col-span-8">
              <input
                type="email"
                value={formData.validEmailAddresses}
                onChange={(e) => updateField('validEmailAddresses', e.target.value)}
                className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                placeholder="primary@email.com, secondary@email.com"
              />
              <p className="text-caption text-ink-600 mt-1">
                Optional alternate or secondary delivery method for receiving notices from the Association, including:
              </p>
            </div>
          </div>

          {/* 7. Secondary Mailing Address */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-1 text-right">
              <span className="text-body font-semibold text-ink-900">7.</span>
            </div>
            <div className="col-span-3">
              <label className="text-body font-medium text-ink-900">Secondary Mailing Address:</label>
            </div>
            <div className="col-span-8">
              <input
                type="text"
                value={formData.secondaryMailingAddress}
                onChange={(e) => updateField('secondaryMailingAddress', e.target.value)}
                className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                placeholder="Optional secondary mailing address"
              />
            </div>
          </div>

          {/* 8. Secondary Email Addresses */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-1 text-right">
              <span className="text-body font-semibold text-ink-900">8.</span>
            </div>
            <div className="col-span-3">
              <label className="text-body font-medium text-ink-900">Secondary Email Address(es):*</label>
            </div>
            <div className="col-span-8">
              <input
                type="email"
                value={formData.secondaryEmailAddresses}
                onChange={(e) => updateField('secondaryEmailAddresses', e.target.value)}
                className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                placeholder="backup@email.com"
              />
            </div>
          </div>

          {/* 9. Preferred Delivery Method */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-1 text-right">
              <span className="text-body font-semibold text-ink-900">9.</span>
            </div>
            <div className="col-span-3">
              <label className="text-body font-medium text-ink-900">Member's preferred delivery method for receiving notices:</label>
            </div>
            <div className="col-span-8">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="mail"
                    name="deliveryMethod"
                    value="mail"
                    checked={formData.preferredDeliveryMethod === 'mail'}
                    onChange={(e) => updateField('preferredDeliveryMethod', e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <label htmlFor="mail" className="text-body text-ink-900">Mailing address</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="email"
                    name="deliveryMethod"
                    value="email"
                    checked={formData.preferredDeliveryMethod === 'email'}
                    onChange={(e) => updateField('preferredDeliveryMethod', e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <label htmlFor="email" className="text-body text-ink-900">Email address</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="both"
                    name="deliveryMethod"
                    value="both"
                    checked={formData.preferredDeliveryMethod === 'both'}
                    onChange={(e) => updateField('preferredDeliveryMethod', e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <label htmlFor="both" className="text-body text-ink-900">Both</label>
                </div>
              </div>
            </div>
          </div>

          {/* 10. Rental Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-1 text-right">
                <span className="text-body font-semibold text-ink-900">10.</span>
              </div>
              <div className="col-span-11">
                <label className="text-body font-medium text-ink-900 mb-3 block">
                  If the property is rented, please fill out the tenant's info below so they can be 
                  notified in the event of emergency:
                </label>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="isRented"
                    checked={formData.isRented}
                    onChange={(e) => updateField('isRented', e.target.checked)}
                    className="rounded border-ink-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isRented" className="text-body text-ink-700">
                    This property is rented
                  </label>
                </div>
              </div>
            </div>

            {/* Tenant Information - Only show if rented */}
            {formData.isRented && (
              <div className="ml-16 space-y-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                {/* 10a. Tenant Name */}
                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-1 text-right">
                    <span className="text-body font-medium text-ink-900">10a.</span>
                  </div>
                  <div className="col-span-3">
                    <label className="text-body font-medium text-ink-900">Tenant Name:</label>
                  </div>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={formData.tenantName}
                      onChange={(e) => updateField('tenantName', e.target.value)}
                      className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                      placeholder="Tenant full name"
                    />
                  </div>
                </div>

                {/* 10b. Tenant Phone */}
                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-1 text-right">
                    <span className="text-body font-medium text-ink-900">10b.</span>
                  </div>
                  <div className="col-span-3">
                    <label className="text-body font-medium text-ink-900">Phone Number:</label>
                  </div>
                  <div className="col-span-8">
                    <input
                      type="tel"
                      value={formData.tenantPhone}
                      onChange={(e) => updateField('tenantPhone', e.target.value)}
                      className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                      placeholder="(949) 555-0123"
                    />
                  </div>
                </div>

                {/* 10c. Tenant Email */}
                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-1 text-right">
                    <span className="text-body font-medium text-ink-900">10c.</span>
                  </div>
                  <div className="col-span-3">
                    <label className="text-body font-medium text-ink-900">Valid Email Address(es):</label>
                  </div>
                  <div className="col-span-8">
                    <input
                      type="email"
                      value={formData.tenantEmails}
                      onChange={(e) => updateField('tenantEmails', e.target.value)}
                      className="w-full px-3 py-2 border-b border-ink-300 focus:border-primary focus:outline-none bg-transparent"
                      placeholder="tenant@email.com"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="p-6 border-t border-ink-900/8 bg-neutral-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isFormValid ? (
                <>
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-body text-green-600">Form is ready to submit</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-amber-600" />
                  <span className="text-body text-amber-600">Please complete required fields</span>
                </>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setFormData(DEFAULT_REGISTRATION)}
              >
                Clear Form
              </Button>
              <Button
                variant="primary"
                onClick={submitForm}
                disabled={!isFormValid || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Submit Registration
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-h3 font-semibold text-ink-900 mb-2">Registration Submitted!</h3>
            <p className="text-body text-ink-600 mb-6">
              Your new resident registration has been successfully submitted to the HOA management team.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  setFormData(DEFAULT_REGISTRATION);
                }}
              >
                Register Another Resident
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
