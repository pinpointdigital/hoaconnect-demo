'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  FileText, 
  Save, 
  Plus,
  Trash2,
  User, 
  Home as HomeIcon,
  Mail,
  Phone,
  MapPin,
  Car,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PropertyOwner {
  name: string;
  driversLicense: string;
}

interface Vehicle {
  make: string;
  model: string;
  year: string;
  color: string;
  license: string;
  state: string;
}

interface RegistrationData {
  // Auto-filled
  date: string;
  associationName: string;
  
  // Property Address
  propertyAddress: {
    streetNumber: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // Property Owners
  propertyOwners: PropertyOwner[];
  
  // Property Owner Address
  ownerAddress: {
    streetNumber: string;
    city: string;
    state: string;
    zip: string;
    sameAsProperty: boolean;
  };
  
  // Contact Information
  ownerPhone: {
    home: string;
    cell: string;
    work: string;
    fax: string;
  };
  ownerEmail: {
    primary: string;
    secondary: string;
  };
  emergencyPhone: string;
  
  // Mailing Address
  mailingAddress: {
    address: string;
    sameAsProperty: boolean;
  };
  
  // Property Occupants
  occupants: {
    sameAsOwner: boolean;
    differentThanOwner: boolean;
    occupantPhone: {
      home: string;
      cell: string;
      work: string;
      fax: string;
    };
    occupantEmail: {
      primary: string;
      secondary: string;
    };
  };
  
  // Delivery Preferences
  deliveryMethod: 'mail' | 'email';
  mailDeliveryFee: boolean;
  
  // Parking & Vehicles
  numberOfCars: string;
  vehicles: Vehicle[];
  
  // Status
  status: 'draft' | 'submitted' | 'approved';
}

export default function NewResidentRegistration() {
  const [formData, setFormData] = useState<RegistrationData>({
    date: new Date().toLocaleDateString(),
    associationName: 'Rancho Madrina Community Association',
    propertyAddress: {
      streetNumber: '',
      city: 'San Juan Capistrano',
      state: 'CA',
      zip: ''
    },
    propertyOwners: [{ name: '', driversLicense: '' }],
    ownerAddress: {
      streetNumber: '',
      city: '',
      state: '',
      zip: '',
      sameAsProperty: true
    },
    ownerPhone: {
      home: '',
      cell: '',
      work: '',
      fax: ''
    },
    ownerEmail: {
      primary: '',
      secondary: ''
    },
    emergencyPhone: '',
    mailingAddress: {
      address: '',
      sameAsProperty: true
    },
    occupants: {
      sameAsOwner: true,
      differentThanOwner: false,
      occupantPhone: {
        home: '',
        cell: '',
        work: '',
        fax: ''
      },
      occupantEmail: {
        primary: '',
        secondary: ''
      }
    },
    deliveryMethod: 'email',
    mailDeliveryFee: false,
    numberOfCars: '',
    vehicles: [{ make: '', model: '', year: '', color: '', license: '', state: 'CA' }],
    status: 'draft'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPropertyOwner = () => {
    setFormData(prev => ({
      ...prev,
      propertyOwners: [...prev.propertyOwners, { name: '', driversLicense: '' }]
    }));
  };

  const removePropertyOwner = (index: number) => {
    if (formData.propertyOwners.length > 1) {
      setFormData(prev => ({
        ...prev,
        propertyOwners: prev.propertyOwners.filter((_, i) => i !== index)
      }));
    }
  };

  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, { make: '', model: '', year: '', color: '', license: '', state: 'CA' }]
    }));
  };

  const removeVehicle = (index: number) => {
    if (formData.vehicles.length > 1) {
      setFormData(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePropertyOwner = (index: number, field: keyof PropertyOwner, value: string) => {
    setFormData(prev => ({
      ...prev,
      propertyOwners: prev.propertyOwners.map((owner, i) => 
        i === index ? { ...owner, [field]: value } : owner
      )
    }));
  };

  const updateVehicle = (index: number, field: keyof Vehicle, value: string) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map((vehicle, i) => 
        i === index ? { ...vehicle, [field]: value } : vehicle
      )
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFormData(prev => ({ ...prev, status: 'submitted' }));
    setIsSubmitting(false);
    alert('Registration submitted successfully!');
  };

  const steps = [
    { id: 1, title: 'Property & Owners', icon: <HomeIcon size={16} /> },
    { id: 2, title: 'Contact Information', icon: <Phone size={16} /> },
    { id: 3, title: 'Occupants & Delivery', icon: <User size={16} /> },
    { id: 4, title: 'Vehicles', icon: <Car size={16} /> },
    { id: 5, title: 'Review & Submit', icon: <CheckCircle size={16} /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink-900">Community Registration</h1>
            <p className="text-body text-ink-600">Owner Notice Disclosure Form</p>
          </div>
        </div>
        
        {/* Legal Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">California Legal Requirement</h3>
              <p className="text-sm text-yellow-700 leading-relaxed">
                California law requires all Owners in a community association to provide the following information to the association on an 
                annual basis. Upon becoming an owner of a property in the community, this form needs to be completed in its entirety within five (5) 
                days of taking title. Once complete and submitted, you will receive an acceptance notification that the disclosures have been received 
                and approved.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
              </div>
              <div className="ml-2 hidden sm:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
        {/* Step 1: Property & Owners */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-ink-900 mb-4">Property & Owner Information</h2>
            
            {/* Auto-filled Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-filled, cannot edit</p>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Association Name</label>
                <input
                  type="text"
                  value={formData.associationName}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-filled, cannot edit</p>
              </div>
            </div>

            {/* Property Address */}
            <div>
              <h3 className="text-lg font-semibold text-ink-900 mb-3">Property Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-body font-medium text-ink-700 mb-2">Street Number & Address</label>
                  <input
                    type="text"
                    value={formData.propertyAddress.streetNumber}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      propertyAddress: { ...prev.propertyAddress, streetNumber: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="31462 Paseo Campeon"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.propertyAddress.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      propertyAddress: { ...prev.propertyAddress, city: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">State</label>
                  <select
                    value={formData.propertyAddress.state}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      propertyAddress: { ...prev.propertyAddress, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="CA">CA</option>
                    <option value="NV">NV</option>
                    <option value="AZ">AZ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Zip</label>
                  <input
                    type="text"
                    value={formData.propertyAddress.zip}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      propertyAddress: { ...prev.propertyAddress, zip: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="92675"
                  />
                </div>
              </div>
            </div>

            {/* Property Owners */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-ink-900">List Names of Property Owners</h3>
                <Button
                  onClick={addPropertyOwner}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus size={14} />
                  Add Owner
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.propertyOwners.map((owner, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="md:col-span-2">
                      <label className="block text-body font-medium text-ink-700 mb-2">
                        Owner Name {index + 1}
                      </label>
                      <input
                        type="text"
                        value={owner.name}
                        onChange={(e) => updatePropertyOwner(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Full legal name"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-body font-medium text-ink-700 mb-2">Driver's License #</label>
                        <input
                          type="text"
                          value={owner.driversLicense}
                          onChange={(e) => updatePropertyOwner(index, 'driversLicense', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="License number"
                        />
                      </div>
                      {formData.propertyOwners.length > 1 && (
                        <Button
                          onClick={() => removePropertyOwner(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-ink-900 mb-4">Contact Information</h2>
            
            {/* Property Owner Address */}
            <div>
              <h3 className="text-lg font-semibold text-ink-900 mb-3">Property Owner Address</h3>
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.ownerAddress.sameAsProperty}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ownerAddress: { ...prev.ownerAddress, sameAsProperty: e.target.checked }
                    }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-body text-ink-700">Same as property address</span>
                </label>
              </div>
              
              {!formData.ownerAddress.sameAsProperty && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-body font-medium text-ink-700 mb-2">Street Number & Address</label>
                    <input
                      type="text"
                      value={formData.ownerAddress.streetNumber}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        ownerAddress: { ...prev.ownerAddress, streetNumber: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.ownerAddress.city}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        ownerAddress: { ...prev.ownerAddress, city: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">State</label>
                    <input
                      type="text"
                      value={formData.ownerAddress.state}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        ownerAddress: { ...prev.ownerAddress, state: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">Zip</label>
                    <input
                      type="text"
                      value={formData.ownerAddress.zip}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        ownerAddress: { ...prev.ownerAddress, zip: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Phone Numbers */}
            <div>
              <h3 className="text-lg font-semibold text-ink-900 mb-3">Property Owner Phone Numbers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Home</label>
                  <input
                    type="tel"
                    value={formData.ownerPhone.home}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ownerPhone: { ...prev.ownerPhone, home: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(949) 555-0123"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Cell</label>
                  <input
                    type="tel"
                    value={formData.ownerPhone.cell}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ownerPhone: { ...prev.ownerPhone, cell: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(949) 555-0123"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Work</label>
                  <input
                    type="tel"
                    value={formData.ownerPhone.work}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ownerPhone: { ...prev.ownerPhone, work: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(949) 555-0123"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Fax</label>
                  <input
                    type="tel"
                    value={formData.ownerPhone.fax}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ownerPhone: { ...prev.ownerPhone, fax: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(949) 555-0123"
                  />
                </div>
              </div>
            </div>

            {/* Email Addresses */}
            <div>
              <h3 className="text-lg font-semibold text-ink-900 mb-3">Property Owner Email</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">
                    Primary Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.ownerEmail.primary}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ownerEmail: { ...prev.ownerEmail, primary: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="owner@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Second Email</label>
                  <input
                    type="email"
                    value={formData.ownerEmail.secondary}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ownerEmail: { ...prev.ownerEmail, secondary: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="secondary@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block text-body font-medium text-ink-700 mb-2">
                Property Owner Emergency Phone# <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(949) 555-0123"
                required
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            variant="outline"
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-3">
            <Button
              onClick={() => {
                localStorage.setItem('registration-draft', JSON.stringify(formData));
                alert('Draft saved!');
              }}
              variant="outline"
            >
              <Save size={16} />
              Save Draft
            </Button>
            
            {currentStep < 5 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
