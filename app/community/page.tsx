'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useHOAInfo, useBrandingAssets, useBranding } from '@/lib/branding/context';
import { Button } from '@/components/ui/Button';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Building2, 
  Zap, 
  Save, 
  Plus, 
  Trash2, 
  Edit3,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera
} from 'lucide-react';

// Default data structure
const DEFAULT_COMMUNITY_DATA = {
  hoa: {
    name: 'Sample HOA Community',
    address: 'San Juan Capistrano, CA',
    phone: '(949) 555-0100',
    email: 'info@samplehoa.com',
    president: {
      name: 'Sarah Johnson',
      title: 'HOA President',
      phone: '(949) 555-0101',
      email: 'president@samplehoa.com'
    },
    headerImage: '/HOAConnect_Demo_BG.jpg'
  },
  schools: [
    {
      id: 'school-1',
      name: 'Capistrano Unified School District',
      address: '33122 Valle Rd, San Juan Capistrano, CA 92675',
      phone: '949.234.9200',
      website: 'www.capousd.org',
      type: 'public',
      grades: 'K-12'
    },
    {
      id: 'school-2',
      name: 'San Juan Hills High School',
      address: '29211 Stallion Rd, San Juan Capistrano CA 92675',
      phone: '949.234.5900',
      website: '',
      type: 'public',
      grades: '9-12'
    },
    {
      id: 'school-3',
      name: 'Marco Forster Middle School',
      address: '25601 Camino del Avion, San Juan Capistrano, CA 92675',
      phone: '949.234.5907',
      website: '',
      type: 'public',
      grades: '6-8'
    },
    {
      id: 'school-4',
      name: 'San Juan Elementary School',
      address: '31642 El Camino Real, San Juan Capistrano, CA 92675',
      phone: '949.493.4533',
      website: '',
      type: 'public',
      grades: 'K-5'
    },
    {
      id: 'school-5',
      name: 'St Margaret\'s Episcopal School',
      address: '31641 La Novia Ave, San Juan Capistrano, CA 92675',
      phone: '949.661.0108',
      website: '',
      type: 'private',
      grades: 'K-12'
    },
    {
      id: 'school-6',
      name: 'JSerra Catholic High School',
      address: '26351 Junipero Serra Rd, San Juan Capistrano, 92675',
      phone: '949.493.9307',
      website: '',
      type: 'private',
      grades: '9-12'
    },
    {
      id: 'school-7',
      name: 'Capistrano Valley Christian School',
      address: '32032 Del Obispo St, San Juan Capistrano, CA 92675',
      phone: '949.493.5683',
      website: '',
      type: 'private',
      grades: 'K-12'
    },
    {
      id: 'school-8',
      name: 'Fairmont Schools',
      address: '26333 Oso Rd, San Juan Capistrano, CA 92675',
      phone: '714.234.2784',
      website: '',
      type: 'private',
      grades: 'K-12'
    },
    {
      id: 'school-9',
      name: 'Stoneybrooke Christian School',
      address: '26300 Via Escolar, San Juan Capistrano, CA 92692',
      phone: '949.364.4407',
      website: '',
      type: 'private',
      grades: 'K-12'
    }
  ],
  municipalities: [
    {
      id: 'muni-1',
      name: 'City of San Juan Capistrano',
      address: '32400 Paseo Adelanto, San Juan Capistrano, CA 92675',
      phone: '949.493.1171',
      website: 'sanjuancapistrano.org',
      category: 'City Government'
    },
    {
      id: 'muni-2',
      name: 'San Juan Capistrano Police Services',
      address: '',
      phone: '949.443.7000',
      website: '',
      category: 'Police Services'
    },
    {
      id: 'muni-3',
      name: 'Orange County Sheriff\'s Department',
      address: '',
      phone: '714.647.7000',
      website: '',
      category: 'Police Services'
    },
    {
      id: 'muni-4',
      name: 'Orange County Fire Authority',
      address: '31865 Del Obispo, San Juan Capistrano 92675',
      phone: '714.573.6000',
      website: '',
      category: 'Fire Services'
    },
    {
      id: 'muni-5',
      name: 'San Juan Capistrano - Chamber of Commerce',
      address: '31421 La Matanza St, San Juan Capistrano, CA 92675',
      phone: '949.493.4700',
      website: '',
      category: 'Business Services'
    }
  ],
  utilities: [
    {
      id: 'util-1',
      name: 'Cox Communications',
      address: '',
      phone: '949.240.1212',
      website: 'www.cox.com',
      category: 'Phone, Cable & Internet'
    },
    {
      id: 'util-2',
      name: 'The Gas Company',
      address: 'PO Box C, Monterey Park CA 91756',
      phone: '(800) 427-2000',
      website: '',
      category: 'Gas'
    },
    {
      id: 'util-3',
      name: 'San Diego Gas & Electric Company',
      address: '8326 Century Park court, San Diego CA 92123',
      phone: '(800) 411-7343',
      website: '',
      category: 'Electric'
    },
    {
      id: 'util-4',
      name: 'CR&R Environmental Services',
      address: '11292 Western Ave, Stanton CA',
      phone: '(949) 646-4805',
      website: '',
      category: 'Trash & Recycling'
    },
    {
      id: 'util-5',
      name: 'Rancho Santa Margarita Water District',
      address: '26111 Antonio Pkwy, Ranch Santa Margarita, CA 92688',
      phone: '(949) 459-6420',
      website: 'SMWD.com',
      category: 'Water'
    }
  ]
};

export default function CommunityInfoPage() {
  const { hasPermission } = useAuth();
  const hoaInfo = useHOAInfo();
  const { updateHOAInfo, updateAssets } = useBranding();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [communityData, setCommunityData] = useState(DEFAULT_COMMUNITY_DATA);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'school' | 'municipality' | 'utility'>('school');

  // Image upload state
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('community-info-data');
    if (savedData) {
      try {
        setCommunityData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading community data:', error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = (newData: typeof communityData) => {
    setCommunityData(newData);
    localStorage.setItem('community-info-data', JSON.stringify(newData));
  };

  // Image upload functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Url = e.target?.result as string;
          setImagePreview(base64Url);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const uploadHeaderImage = () => {
    if (selectedImage && imagePreview) {
      const newData = {
        ...communityData,
        hoa: { ...communityData.hoa, headerImage: imagePreview }
      };
      saveData(newData);
      setShowImageUploadModal(false);
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const cancelImageUpload = () => {
    setShowImageUploadModal(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Tab definitions
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'schools', label: 'Schools', icon: <GraduationCap size={16} /> },
    { id: 'municipalities', label: 'Municipalities', icon: <Building2 size={16} /> },
    { id: 'utilities', label: 'Local Utilities', icon: <Zap size={16} /> }
  ];

  // Check permissions
  const canEdit = hasPermission('canConfigureBranding') || hasPermission('canReviewARCRequests');

  return (
    <div className="space-y-6">
      {/* Page Header - Consistent with ARC Management */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="text-blue-600" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-ink-900">HOA Community Info</h1>
        </div>
      </div>

      {/* Tab Navigation - Consistent with ARC Management */}
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

      {/* Tab Content */}
      <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            communityData={communityData}
            saveData={saveData}
            canEdit={canEdit}
            onImageUpload={() => setShowImageUploadModal(true)}
            updateHOAInfo={updateHOAInfo}
          />
        )}
        
        {activeTab === 'schools' && (
          <SchoolsTab 
            schools={communityData.schools}
            saveData={saveData}
            canEdit={canEdit}
          />
        )}
        
        {activeTab === 'municipalities' && (
          <MunicipalitiesTab 
            municipalities={communityData.municipalities}
            saveData={saveData}
            canEdit={canEdit}
          />
        )}
        
        {activeTab === 'utilities' && (
          <UtilitiesTab 
            utilities={communityData.utilities}
            saveData={saveData}
            canEdit={canEdit}
          />
        )}
      </div>

      {/* Header Image Upload Modal */}
      {showImageUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-h3 font-semibold text-ink-900 mb-4">Change Header Image</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">
                  Select Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-caption text-ink-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-caption file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>
              
              {imagePreview && (
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">
                    Preview
                  </label>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border border-ink-900/8"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={cancelImageUpload}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={uploadHeaderImage}
                disabled={!selectedImage}
              >
                Upload Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ communityData, saveData, canEdit, onImageUpload, updateHOAInfo }) {
  const [editingHOA, setEditingHOA] = useState(false);
  const [hoaForm, setHoaForm] = useState(communityData.hoa);

  const saveHOAInfo = () => {
    const newData = { ...communityData, hoa: hoaForm };
    saveData(newData);
    
    // Parse address string for global context
    const addressParts = hoaForm.address.split(',').map(part => part.trim());
    const city = addressParts.length > 1 ? addressParts[addressParts.length - 2] : addressParts[0];
    const state = addressParts.length > 1 ? addressParts[addressParts.length - 1] : 'CA';
    
    // Update global HOA info for header/footer
    updateHOAInfo({
      name: hoaForm.name,
      address: {
        street: addressParts.length > 2 ? addressParts.slice(0, -2).join(', ') : '',
        city: city,
        state: state,
        zip: '92675'
      },
      admin: {
        name: hoaForm.president.name,
        role: hoaForm.president.title,
        email: hoaForm.president.email,
        phone: hoaForm.president.phone
      }
    });
    
    setEditingHOA(false);
  };

  const cancelEdit = () => {
    setHoaForm(communityData.hoa);
    setEditingHOA(false);
  };

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* HOA Header Image */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-ink-900">HOA Header Image</h2>
            {canEdit && (
              <button
                onClick={onImageUpload}
                className="flex items-center gap-2 text-primary hover:text-primary-700 transition-colors text-body font-medium"
              >
                <Camera size={16} />
                Change Image
              </button>
            )}
          </div>
          <div className="relative h-48 rounded-lg overflow-hidden border border-ink-900/8">
            <img
              src={communityData.hoa.headerImage}
              alt="Community Header"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-body font-medium">Used across all HOA Connect dashboards</p>
            </div>
          </div>
        </div>

        {/* HOA Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-ink-900">HOA Information</h2>
            {canEdit && !editingHOA && (
              <button
                onClick={() => setEditingHOA(true)}
                className="flex items-center gap-2 text-primary hover:text-primary-700 transition-colors text-body font-medium"
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
          </div>

          {editingHOA ? (
            <div className="space-y-6 p-6 border border-ink-900/8 rounded-lg bg-neutral-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">
                    HOA Name
                  </label>
                  <input
                    type="text"
                    value={hoaForm.name}
                    onChange={(e) => setHoaForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">
                    HOA Address
                  </label>
                  <input
                    type="text"
                    value={hoaForm.address}
                    onChange={(e) => setHoaForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">
                    HOA Phone
                  </label>
                  <input
                    type="tel"
                    value={hoaForm.phone}
                    onChange={(e) => setHoaForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">
                    HOA Email
                  </label>
                  <input
                    type="email"
                    value={hoaForm.email}
                    onChange={(e) => setHoaForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-h3 font-semibold text-ink-900 mb-4">HOA President Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">
                      President Name
                    </label>
                    <input
                      type="text"
                      value={hoaForm.president.name}
                      onChange={(e) => setHoaForm(prev => ({ 
                        ...prev, 
                        president: { ...prev.president, name: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">
                      President Title
                    </label>
                    <input
                      type="text"
                      value={hoaForm.president.title}
                      onChange={(e) => setHoaForm(prev => ({ 
                        ...prev, 
                        president: { ...prev.president, title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">
                      President Phone
                    </label>
                    <input
                      type="tel"
                      value={hoaForm.president.phone}
                      onChange={(e) => setHoaForm(prev => ({ 
                        ...prev, 
                        president: { ...prev.president, phone: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium text-ink-700 mb-2">
                      President Email
                    </label>
                    <input
                      type="email"
                      value={hoaForm.president.email}
                      onChange={(e) => setHoaForm(prev => ({ 
                        ...prev, 
                        president: { ...prev.president, email: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <Button
                  variant="outline"
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={saveHOAInfo}
                  className="flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-h3 font-semibold text-ink-900">HOA Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-ink-500" />
                      <span className="text-body text-ink-900">{communityData.hoa.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-ink-500" />
                      <span className="text-body text-ink-900">{communityData.hoa.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-ink-500" />
                      <span className="text-body text-ink-900">{communityData.hoa.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-ink-500" />
                      <span className="text-body text-ink-900">{communityData.hoa.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-h3 font-semibold text-ink-900">HOA President</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-ink-500" />
                      <span className="text-body text-ink-900">{communityData.hoa.president.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-ink-500" />
                      <span className="text-body text-ink-900">{communityData.hoa.president.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-ink-500" />
                      <span className="text-body text-ink-900">{communityData.hoa.president.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-ink-500" />
                      <span className="text-body text-ink-900">{communityData.hoa.president.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Schools Tab Component
function SchoolsTab({ schools, saveData, canEdit }) {
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-ink-900">Schools</h2>
        {canEdit && (
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add School
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {schools.map((school) => (
          <div key={school.id} className="p-4 border border-ink-900/8 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-h3 font-semibold text-ink-900">{school.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    school.type === 'public' ? 'bg-blue-100 text-blue-700' :
                    school.type === 'private' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {school.type.charAt(0).toUpperCase() + school.type.slice(1)}
                  </span>
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium">
                    Grades {school.grades}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-ink-500" />
                    <span className="text-body text-ink-600">{school.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-ink-500" />
                    <span className="text-body text-ink-600">{school.phone}</span>
                  </div>
                  {school.website && (
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-ink-500" />
                      <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer" className="text-body text-primary hover:text-primary-700">
                        {school.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSchool(school)}
                >
                  <Edit3 size={14} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Municipalities Tab Component
function MunicipalitiesTab({ municipalities, saveData, canEdit }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-ink-900">Municipalities</h2>
        {canEdit && (
          <Button
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Municipality
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Group by category */}
        {['City Government', 'Police Services', 'Fire Services', 'Business Services'].map(category => {
          const categoryItems = municipalities.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h3 className="text-h3 font-semibold text-ink-900 border-b border-ink-900/8 pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {categoryItems.map((item) => (
                  <div key={item.id} className="p-4 border border-ink-900/8 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-h4 font-semibold text-ink-900 mb-2">{item.name}</h4>
                        <div className="space-y-1">
                          {item.address && (
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-ink-500" />
                              <span className="text-body text-ink-600">{item.address}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-ink-500" />
                            <span className="text-body text-ink-600">{item.phone}</span>
                          </div>
                          {item.website && (
                            <div className="flex items-center gap-2">
                              <Globe size={14} className="text-ink-500" />
                              <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer" className="text-body text-primary hover:text-primary-700">
                                {item.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      {canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Edit3 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Utilities Tab Component
function UtilitiesTab({ utilities, saveData, canEdit }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-ink-900">Local Utilities</h2>
        {canEdit && (
          <Button
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Utility
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Group by category */}
        {['Phone, Cable & Internet', 'Gas', 'Electric', 'Trash & Recycling', 'Water'].map(category => {
          const categoryItems = utilities.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h3 className="text-h3 font-semibold text-ink-900 border-b border-ink-900/8 pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {categoryItems.map((item) => (
                  <div key={item.id} className="p-4 border border-ink-900/8 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-h4 font-semibold text-ink-900 mb-2">{item.name}</h4>
                        <div className="space-y-1">
                          {item.address && (
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-ink-500" />
                              <span className="text-body text-ink-600">{item.address}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-ink-500" />
                            <span className="text-body text-ink-600">{item.phone}</span>
                          </div>
                          {item.website && (
                            <div className="flex items-center gap-2">
                              <Globe size={14} className="text-ink-500" />
                              <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer" className="text-body text-primary hover:text-primary-700">
                                {item.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      {canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Edit3 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
