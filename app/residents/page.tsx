'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Search, 
  Plus, 
  UserPlus, 
  Edit3, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Send,
  CheckCircle,
  X
} from 'lucide-react';
import Link from 'next/link';

interface Resident {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  moveInDate: string;
  unitType: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  status: 'active' | 'pending' | 'moved-out';
}

const DEFAULT_RESIDENTS: Resident[] = [
  {
    id: 'res-1',
    name: 'Allan Chua',
    address: '31462 Paseo Campeon, San Juan Capistrano, CA 92675',
    email: 'allan.chua@email.com',
    phone: '(949) 555-0123',
    profilePhoto: undefined,
    moveInDate: '2023-06-15',
    unitType: 'Single Family Home',
    emergencyContact: {
      name: 'Maria Chua',
      phone: '(949) 555-0124',
      relationship: 'Spouse'
    },
    status: 'active'
  },
  {
    id: 'res-2',
    name: 'Sarah Johnson',
    address: '27381 Via Priorato, San Juan Capistrano, CA 92675',
    email: 'sarah.johnson@email.com',
    phone: '(949) 555-0125',
    moveInDate: '2022-03-10',
    unitType: 'Single Family Home',
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '(949) 555-0126',
      relationship: 'Spouse'
    },
    status: 'active'
  },
  {
    id: 'res-3',
    name: 'Robert Chen',
    address: '31472 Paseo Caliz, San Juan Capistrano, CA 92675',
    email: 'robert.chen@email.com',
    phone: '(949) 555-0127',
    moveInDate: '2021-09-22',
    unitType: 'Single Family Home',
    status: 'active'
  },
  {
    id: 'res-4',
    name: 'David Martinez',
    address: '32156 Paseo Adelanto, San Juan Capistrano, CA 92675',
    email: 'david.martinez@email.com',
    phone: '(949) 555-0128',
    moveInDate: '2023-11-08',
    unitType: 'Single Family Home',
    status: 'active'
  },
  {
    id: 'res-5',
    name: 'Jennifer Walsh',
    address: '31890 Via Saltio, San Juan Capistrano, CA 92675',
    email: 'jennifer.walsh@email.com',
    phone: '(949) 555-0129',
    moveInDate: '2024-01-15',
    unitType: 'Single Family Home',
    emergencyContact: {
      name: 'Tom Walsh',
      phone: '(949) 555-0130',
      relationship: 'Spouse'
    },
    status: 'active'
  }
];

export default function ResidentsPage() {
  const { hasPermission } = useAuth();
  const [residents, setResidents] = useState<Resident[]>(DEFAULT_RESIDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: ''
  });
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);
  const [showMessageSuccess, setShowMessageSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load residents from localStorage
  useEffect(() => {
    const savedResidents = localStorage.getItem('residents-data');
    if (savedResidents) {
      try {
        setResidents(JSON.parse(savedResidents));
      } catch (error) {
        console.error('Error loading residents:', error);
      }
    }
  }, []);

  // Save residents to localStorage
  const saveResidents = (newResidents: Resident[]) => {
    setResidents(newResidents);
    localStorage.setItem('residents-data', JSON.stringify(newResidents));
  };

  // Filter residents based on search
  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.phone.includes(searchTerm)
  );

  // Handle invite submission
  const sendInvitation = async () => {
    // Simulate sending invitation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowInviteModal(false);
    setShowInviteSuccess(true);
    setInviteForm({ name: '', email: '', phone: '', address: '' });
  };

  // Handle message submission
  const sendMessage = async () => {
    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowMessageModal(false);
    setShowMessageSuccess(true);
    setMessageForm({ subject: '', message: '' });
    setSelectedResident(null);
  };

  // Handle image upload for resident profile
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Url = e.target?.result as string;
          setImagePreview(base64Url);
          if (editingResident) {
            setEditingResident({ ...editingResident, profilePhoto: base64Url });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Update resident
  const saveResident = () => {
    if (editingResident) {
      const updatedResidents = residents.map(resident =>
        resident.id === editingResident.id ? editingResident : resident
      );
      saveResidents(updatedResidents);
      setEditingResident(null);
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const cancelEdit = () => {
    setEditingResident(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const canEdit = hasPermission('canManageResidents') || hasPermission('canReviewARCRequests');

  // Tab definitions
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Users size={16} /> }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="text-blue-600" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-ink-900">Residents</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-ink-900/8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-body transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-600 hover:text-ink-900 hover:border-ink-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link href="/dashboard/new-residents/registration">
              <Button variant="primary" className="flex items-center gap-2">
                <Plus size={16} />
                Add Resident
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              Invite Resident
            </Button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-500" size={20} />
              <input
                type="text"
                placeholder="Search residents by name, address, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-500 hover:text-ink-700"
                >
                  ×
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-caption text-ink-600 mt-2">
                {filteredResidents.length} resident{filteredResidents.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {/* Residents List */}
          <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1">
            <div className="p-6">
              <div className="space-y-4">
                {filteredResidents.map((resident) => (
                  <div key={resident.id} className="p-4 border border-ink-900/8 rounded-lg hover:border-neutral-300 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Profile Photo */}
                      <Avatar 
                        name={resident.name}
                        size="lg"
                        src={resident.profilePhoto}
                      />

                      {/* Resident Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-h3 font-semibold text-ink-900">{resident.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            resident.status === 'active' ? 'bg-green-100 text-green-700' :
                            resident.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-neutral-100 text-neutral-700'
                          }`}>
                            {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-ink-500" />
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resident.address)}&zoom=20`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-body text-primary hover:text-primary-700 transition-colors"
                            >
                              {resident.address}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-ink-500" />
                            <span className="text-body text-ink-600">{resident.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-ink-500" />
                            <a 
                              href={`tel:${resident.phone}`}
                              className="text-body text-primary hover:text-primary-700 transition-colors"
                            >
                              {resident.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-ink-500" />
                            <span className="text-body text-ink-600">
                              Moved in {new Date(resident.moveInDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {resident.emergencyContact && (
                          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                            <p className="text-caption font-medium text-ink-700 mb-1">Emergency Contact:</p>
                            <p className="text-caption text-ink-600">
                              {resident.emergencyContact.name} ({resident.emergencyContact.relationship}) - {resident.emergencyContact.phone}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-3">
                          {canEdit && (
                            <button
                              onClick={() => {
                                setEditingResident(resident);
                                setImagePreview(resident.profilePhoto || null);
                              }}
                              className="flex items-center gap-1 text-primary hover:text-primary-700 transition-colors text-body font-medium"
                            >
                              <Edit3 size={14} />
                            </button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedResident(resident);
                              setShowMessageModal(true);
                            }}
                            className="flex items-center gap-1"
                          >
                            <MessageSquare size={14} />
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredResidents.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="mx-auto text-neutral-400 mb-4" size={48} />
                    <h3 className="text-h3 font-medium text-ink-900 mb-2">No Residents Found</h3>
                    <p className="text-body text-ink-600 mb-4">
                      {searchTerm 
                        ? 'Try adjusting your search criteria'
                        : 'Add your first resident to get started'
                      }
                    </p>
                    {canEdit && !searchTerm && (
                      <Link href="/dashboard/new-residents/registration">
                        <Button variant="primary" className="flex items-center gap-2">
                          <Plus size={16} />
                          Add Resident
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Resident Modal */}
      {editingResident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-h3 font-semibold text-ink-900 mb-4">Edit Resident Profile</h3>
            
            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 mb-3 flex-shrink-0">
                  <Avatar 
                    name={editingResident.name} 
                    size="xl" 
                    src={editingResident.profilePhoto}
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

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editingResident.name}
                    onChange={(e) => setEditingResident(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editingResident.phone}
                    onChange={(e) => setEditingResident(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    placeholder="(949) 555-0123"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={editingResident.email}
                  onChange={(e) => setEditingResident(prev => prev ? { ...prev, email: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Property Address</label>
                <input
                  type="text"
                  value={editingResident.address}
                  onChange={(e) => setEditingResident(prev => prev ? { ...prev, address: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-neutral-200 pt-4">
                <h4 className="text-h4 font-semibold text-ink-900 mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={editingResident.emergencyContact?.name || ''}
                      onChange={(e) => setEditingResident(prev => prev ? { 
                        ...prev, 
                        emergencyContact: { 
                          ...prev.emergencyContact, 
                          name: e.target.value,
                          phone: prev.emergencyContact?.phone || '',
                          relationship: prev.emergencyContact?.relationship || ''
                        }
                      } : null)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">Relationship</label>
                    <input
                      type="text"
                      value={editingResident.emergencyContact?.relationship || ''}
                      onChange={(e) => setEditingResident(prev => prev ? { 
                        ...prev, 
                        emergencyContact: { 
                          ...prev.emergencyContact, 
                          relationship: e.target.value,
                          name: prev.emergencyContact?.name || '',
                          phone: prev.emergencyContact?.phone || ''
                        }
                      } : null)}
                      placeholder="Spouse, Parent, Sibling, etc."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-body font-medium text-ink-700 mb-2">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={editingResident.emergencyContact?.phone || ''}
                    onChange={(e) => setEditingResident(prev => prev ? { 
                      ...prev, 
                      emergencyContact: { 
                        ...prev.emergencyContact, 
                        phone: e.target.value,
                        name: prev.emergencyContact?.name || '',
                        relationship: prev.emergencyContact?.relationship || ''
                      }
                    } : null)}
                    placeholder="(949) 555-0124"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Additional Fields */}
              <div className="border-t border-neutral-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">Move-in Date</label>
                    <input
                      type="date"
                      value={editingResident.moveInDate}
                      onChange={(e) => setEditingResident(prev => prev ? { ...prev, moveInDate: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">Status</label>
                    <select
                      value={editingResident.status}
                      onChange={(e) => setEditingResident(prev => prev ? { ...prev, status: e.target.value as Resident['status'] } : null)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="moved-out">Moved Out</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              <Button variant="primary" onClick={saveResident}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Resident Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-h3 font-semibold text-ink-900 mb-4">Invite New Resident</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.smith@email.com"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={inviteForm.phone}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(949) 555-0123"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Property Address</label>
                <input
                  type="text"
                  value={inviteForm.address}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Community Drive, San Juan Capistrano, CA 92675"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-caption text-blue-700">
                  <strong>Demo Simulation:</strong> This will simulate sending an email and SMS invitation to the new resident with registration instructions.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>Cancel</Button>
              <Button 
                variant="primary" 
                onClick={sendInvitation}
                disabled={!inviteForm.name || !inviteForm.email}
                className="flex items-center gap-2"
              >
                <Send size={16} />
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && selectedResident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-h3 font-semibold text-ink-900 mb-4">Send Message</h3>
            
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 mb-4">
              <p className="text-body font-medium text-ink-900">{selectedResident.name}</p>
              <p className="text-caption text-ink-600">{selectedResident.email}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="HOA Community Update"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Message</label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  placeholder="Enter your message here..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => {
                setShowMessageModal(false);
                setSelectedResident(null);
                setMessageForm({ subject: '', message: '' });
              }}>Cancel</Button>
              <Button 
                variant="primary" 
                onClick={sendMessage}
                disabled={!messageForm.subject || !messageForm.message}
                className="flex items-center gap-2"
              >
                <Send size={16} />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Success Modal */}
      {showInviteSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-h3 font-semibold text-ink-900 mb-2">Invitation Sent!</h3>
            <p className="text-body text-ink-600 mb-6">
              Email and SMS invitations have been sent to the new resident with registration instructions.
            </p>
            <Button variant="primary" onClick={() => setShowInviteSuccess(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Message Success Modal */}
      {showMessageSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-h3 font-semibold text-ink-900 mb-2">Message Sent!</h3>
            <p className="text-body text-ink-600 mb-6">
              Your message has been sent successfully to the resident.
            </p>
            <Button variant="primary" onClick={() => setShowMessageSuccess(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
