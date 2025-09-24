'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { 
  Wrench, 
  Save, 
  Plus, 
  Edit3,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Search
} from 'lucide-react';

// Default vendors data
const DEFAULT_VENDORS_DATA = {
  vendors: [
    {
      id: 'vendor-1',
      name: 'South County Landscape',
      address: 'PO Box 7496, Capistrano Beach, CA 92624',
      phone: '(949) 637-1159',
      email: 's.gonzalez@socolandscapes.com',
      website: 'southcountylandscapes.com',
      category: 'Landscape & Irrigation',
      notes: '5 days a week'
    },
    {
      id: 'vendor-2',
      name: 'WB Starr',
      address: '20602 Canada Rd, Lake Forest, CA 92630',
      phone: '(949) 770-8835',
      email: 'jstarr@WBStarr.com',
      website: 'wbstarr.com',
      category: 'Tree Trimming',
      notes: 'Twice a year. Dell: (949) 370-1428, Fax: (949) 770-8839'
    },
    {
      id: 'vendor-3',
      name: 'Patrol One',
      address: '',
      phone: '',
      email: '',
      website: 'www.patrol-one.com',
      category: 'Security & Parking Enforcement',
      notes: 'Every evening, every day'
    },
    {
      id: 'vendor-4',
      name: 'DoorKing',
      address: '',
      phone: '(800) 949-1432',
      email: '',
      website: 'doorking.com',
      category: 'Main Gate',
      notes: 'Fax: (310) 641-1586'
    },
    {
      id: 'vendor-5',
      name: 'Access Unlimited',
      address: '19510 Van Buren Blvd., F-3 Suite 286, Riverside CA 92598',
      phone: '(951) 324-1169',
      email: '',
      website: '',
      category: 'Gate Monitoring',
      notes: 'On site once a month to inspect equipment. Cell: (714) 785-9018'
    },
    {
      id: 'vendor-6',
      name: 'DLE Lighting and Electric, Inc',
      address: '15510 Rockfield Blvd., Ste A, Irvine, CA 92618',
      phone: '(949) 481-7725',
      email: 'service@dielighting.com',
      website: 'dielighting.com',
      category: 'Community Lighting System',
      notes: 'Rancho Viejo Rd and Entry/Exit. Service is once a month/repair and replace.'
    },
    {
      id: 'vendor-7',
      name: 'Fenix Security Solutions',
      address: '',
      phone: '(310) 291-2446',
      email: '',
      website: 'fenixsec.com',
      category: 'Community Cameras',
      notes: ''
    }
  ]
};

export default function VendorsPage() {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('vendors');
  const [vendorsData, setVendorsData] = useState(DEFAULT_VENDORS_DATA);
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVendor, setNewVendor] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    category: 'Community Cameras',
    notes: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('vendors-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setVendorsData({
          ...DEFAULT_VENDORS_DATA,
          ...parsedData,
          vendors: DEFAULT_VENDORS_DATA.vendors // Always use updated vendor data
        });
      } catch (error) {
        console.error('Error loading vendors data:', error);
        setVendorsData(DEFAULT_VENDORS_DATA);
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = (newData: typeof vendorsData) => {
    setVendorsData(newData);
    localStorage.setItem('vendors-data', JSON.stringify(newData));
  };

  const saveVendor = () => {
    if (editingVendor) {
      const updatedVendors = vendorsData.vendors.map(vendor => 
        vendor.id === editingVendor.id ? editingVendor : vendor
      );
      saveData({ ...vendorsData, vendors: updatedVendors });
      setEditingVendor(null);
    }
  };

  const addVendor = () => {
    const newVendorData = {
      ...newVendor,
      id: `vendor-${Date.now()}`
    };
    const updatedVendors = [...vendorsData.vendors, newVendorData];
    saveData({ ...vendorsData, vendors: updatedVendors });
    setShowAddModal(false);
    setNewVendor({
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      category: 'Community Cameras',
      notes: ''
    });
  };

  const cancelEdit = () => {
    setEditingVendor(null);
    setShowAddModal(false);
    setNewVendor({
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      category: 'Community Cameras',
      notes: ''
    });
  };

  // Check permissions
  const canEdit = hasPermission('canManageVendors') || hasPermission('canReviewARCRequests');

  // Filter vendors based on search term
  const filteredVendors = vendorsData.vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header - Consistent with other pages */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Wrench className="text-blue-600" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-ink-900">Vendors</h1>
        </div>
        {canEdit && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('vendors-data');
                setVendorsData(DEFAULT_VENDORS_DATA);
              }}
              size="sm"
            >
              Reset Data
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Vendor
            </Button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-500" size={20} />
          <input
            type="text"
            placeholder="Search vendors by name, category, address, or notes..."
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
            {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Vendors Content */}
      <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-ink-900">On-Site Vendors</h2>
          </div>

          <div className="space-y-6">
            {/* Group by category - Alphabetical order */}
            {[
              'Community Cameras',
              'Community Lighting System', 
              'Gate Monitoring',
              'Landscape & Irrigation',
              'Main Gate',
              'Security & Parking Enforcement',
              'Tree Trimming'
            ].map(category => {
              const categoryVendors = filteredVendors
                .filter(vendor => vendor.category === category)
                .sort((a, b) => a.name.localeCompare(b.name));
              if (categoryVendors.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <h3 className="text-h3 font-semibold text-ink-900 border-b border-ink-900/8 pb-2">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {categoryVendors.map((vendor) => (
                      <div key={vendor.id} className="p-4 border border-ink-900/8 rounded-lg">
                        <div className="flex items-start gap-4">
                          {/* Website Favicon */}
                          <div className="w-16 h-16 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center flex-shrink-0">
                            {vendor.website ? (
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${vendor.website}&sz=64`}
                                alt={`${vendor.name} website`}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"></path></svg>';
                                  }
                                }}
                              />
                            ) : (
                              <Wrench size={20} className="text-neutral-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-h4 font-semibold text-ink-900 mb-2">{vendor.name}</h4>
                            <div className="space-y-1">
                              {vendor.address && (
                                <div className="flex items-center gap-2">
                                  <MapPin size={14} className="text-ink-500" />
                                  <span className="text-body text-ink-600">{vendor.address}</span>
                                </div>
                              )}
                              {vendor.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone size={14} className="text-ink-500" />
                                  <span className="text-body text-ink-600">{vendor.phone}</span>
                                </div>
                              )}
                              {vendor.email && (
                                <div className="flex items-center gap-2">
                                  <Mail size={14} className="text-ink-500" />
                                  <a href={`mailto:${vendor.email}`} className="text-body text-primary hover:text-primary-700">
                                    {vendor.email}
                                  </a>
                                </div>
                              )}
                              {vendor.website && (
                                <div className="flex items-center gap-2">
                                  <Globe size={14} className="text-ink-500" />
                                  <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer" className="text-body text-primary hover:text-primary-700">
                                    {vendor.website}
                                  </a>
                                </div>
                              )}
                              {vendor.notes && (
                                <div className="flex items-start gap-2 mt-2">
                                  <FileText size={14} className="text-ink-500 mt-0.5" />
                                  <span className="text-body text-ink-600 italic">{vendor.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {canEdit && (
                            <button
                              onClick={() => setEditingVendor(vendor)}
                              className="flex items-center gap-2 text-primary hover:text-primary-700 transition-colors text-body font-medium"
                            >
                              <Edit3 size={14} />
                            </button>
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
      </div>

      {/* Edit Vendor Modal */}
      {editingVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-h3 font-semibold text-ink-900 mb-4">Edit Vendor</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={editingVendor.name}
                  onChange={(e) => setEditingVendor(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Address</label>
                <input
                  type="text"
                  value={editingVendor.address}
                  onChange={(e) => setEditingVendor(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editingVendor.phone}
                    onChange={(e) => setEditingVendor(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(949) 637-1159"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingVendor.email}
                    onChange={(e) => setEditingVendor(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@vendor.com"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Website</label>
                <input
                  type="url"
                  value={editingVendor.website}
                  onChange={(e) => setEditingVendor(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="www.vendor.com"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Category</label>
                <select
                  value={editingVendor.category}
                  onChange={(e) => setEditingVendor(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="Community Cameras">Community Cameras</option>
                  <option value="Community Lighting System">Community Lighting System</option>
                  <option value="Gate Monitoring">Gate Monitoring</option>
                  <option value="Landscape & Irrigation">Landscape & Irrigation</option>
                  <option value="Main Gate">Main Gate</option>
                  <option value="Security & Parking Enforcement">Security & Parking Enforcement</option>
                  <option value="Tree Trimming">Tree Trimming</option>
                </select>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Notes</label>
                <textarea
                  value={editingVendor.notes}
                  onChange={(e) => setEditingVendor(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Service schedule, special instructions, additional contact info..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              <Button variant="primary" onClick={saveVendor}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-h3 font-semibold text-ink-900 mb-4">Add New Vendor</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Address</label>
                <input
                  type="text"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(949) 637-1159"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@vendor.com"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Website</label>
                <input
                  type="url"
                  value={newVendor.website}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="www.vendor.com"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Category</label>
                <select
                  value={newVendor.category}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="Community Cameras">Community Cameras</option>
                  <option value="Community Lighting System">Community Lighting System</option>
                  <option value="Gate Monitoring">Gate Monitoring</option>
                  <option value="Landscape & Irrigation">Landscape & Irrigation</option>
                  <option value="Main Gate">Main Gate</option>
                  <option value="Security & Parking Enforcement">Security & Parking Enforcement</option>
                  <option value="Tree Trimming">Tree Trimming</option>
                </select>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Notes</label>
                <textarea
                  value={newVendor.notes}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Service schedule, special instructions, additional contact info..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              <Button variant="primary" onClick={addVendor} disabled={!newVendor.name}>Add Vendor</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
