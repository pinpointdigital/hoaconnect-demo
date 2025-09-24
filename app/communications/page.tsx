'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { 
  MessageSquare, 
  Plus, 
  Upload, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  BarChart3,
  Calendar,
  Eye,
  Bell,
  X,
  Send,
  LayoutDashboard,
  Car,
  CreditCard,
  Key
} from 'lucide-react';

interface CommunicationItem {
  id: string;
  title: string;
  category: 'Architectural' | 'Landscaping' | 'Security' | 'General';
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  submittedBy: {
    name: string;
    address: string;
  };
  submittedAt: Date;
  lastUpdate: Date;
  attachments: string[];
  timeline: Array<{
    id: string;
    type: 'comment' | 'status_change' | 'attachment';
    content: string;
    author: string;
    timestamp: Date;
    attachments?: string[];
  }>;
}

interface CommunityUpdate {
  id: string;
  title: string;
  type: 'notice' | 'resolution';
  content: string;
  author: {
    name: string;
    role: 'Board' | 'Manager';
  };
  postedAt: Date;
}

interface Poll {
  id: string;
  title: string;
  audience: 'Community' | 'Board' | 'All';
  questionType: 'single' | 'multiple';
  options: string[];
  openDate: Date;
  closeDate: Date;
  anonymous: boolean;
  requireQuorum?: number;
  status: 'Active' | 'Scheduled' | 'Closed';
  votes: Array<{
    optionIndex: number;
    voter?: string; // null if anonymous
  }>;
  createdBy: string;
  attachments?: string[];
}


const DEFAULT_ITEMS: CommunicationItem[] = [
  {
    id: 'comm-1',
    title: 'Mailbox Post Repair Request',
    category: 'General',
    description: 'The mailbox post at 31462 Paseo Campeon is leaning and needs repair or replacement.',
    status: 'In Progress',
    submittedBy: {
      name: 'Allan Chua',
      address: '31462 Paseo Campeon'
    },
    submittedAt: new Date('2024-09-20'),
    lastUpdate: new Date('2024-09-22'),
    attachments: [],
    timeline: [
      {
        id: 't1',
        type: 'comment',
        content: 'Request submitted for mailbox post repair',
        author: 'Allan Chua',
        timestamp: new Date('2024-09-20')
      },
      {
        id: 't2',
        type: 'status_change',
        content: 'Status changed to In Progress',
        author: 'HOA Manager',
        timestamp: new Date('2024-09-22')
      }
    ]
  }
];

const DEFAULT_UPDATES: CommunityUpdate[] = [
  {
    id: 'update-1',
    title: 'Street Sweeping Schedule Update',
    type: 'notice',
    content: 'Street sweeping will occur every second Tuesday of the month. Please move vehicles by 8 AM.',
    author: {
      name: 'HOA Board',
      role: 'Board'
    },
    postedAt: new Date('2024-09-18')
  },
  {
    id: 'update-2',
    title: 'Landscape Lighting Issue Resolved',
    type: 'resolution',
    content: 'The landscape lighting issue on Paseo Campeon has been resolved. All lights are now operational.',
    author: {
      name: 'Property Manager',
      role: 'Manager'
    },
    postedAt: new Date('2024-09-15')
  }
];


export default function CommunicationsPage() {
  const { user, hasPermission } = useAuth();
  const [items, setItems] = useState<CommunicationItem[]>(DEFAULT_ITEMS);
  const [updates, setUpdates] = useState<CommunityUpdate[]>(DEFAULT_UPDATES);
  const [polls, setPolls] = useState<Poll[]>([]);
  
  // Modal states
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showItemDetail, setShowItemDetail] = useState<CommunicationItem | null>(null);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);
  
  // Form states
  const [newRequest, setNewRequest] = useState({
    title: '',
    category: 'General' as CommunicationItem['category'],
    description: '',
    emailBoard: true
  });
  const [newPoll, setNewPoll] = useState({
    title: '',
    audience: 'Community' as Poll['audience'],
    questionType: 'single' as Poll['questionType'],
    options: ['', ''],
    openDate: '',
    closeDate: '',
    anonymous: true,
    requireQuorum: ''
  });
  const [pollAttachments, setPollAttachments] = useState<File[]>([]);
  
  // Tab and filter states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [updatesFilter, setUpdatesFilter] = useState<'All' | 'Notices' | 'Resolutions'>('All');
  const [pollsFilter, setPollsFilter] = useState<'Active' | 'Scheduled' | 'Closed'>('Active');
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  
  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Load data from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('communication-items');
    const savedUpdates = localStorage.getItem('community-updates');
    const savedPolls = localStorage.getItem('community-polls');
    
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);
        const itemsWithDates = parsed.map((item: any) => ({
          ...item,
          submittedAt: new Date(item.submittedAt),
          lastUpdate: new Date(item.lastUpdate),
          timeline: item.timeline.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp)
          }))
        }));
        setItems(itemsWithDates);
      } catch (error) {
        console.error('Error loading communication items:', error);
      }
    }
    
    if (savedUpdates) {
      try {
        const parsed = JSON.parse(savedUpdates);
        const updatesWithDates = parsed.map((update: any) => ({
          ...update,
          postedAt: new Date(update.postedAt)
        }));
        setUpdates(updatesWithDates);
      } catch (error) {
        console.error('Error loading community updates:', error);
      }
    }
    
    if (savedPolls) {
      try {
        const parsed = JSON.parse(savedPolls);
        const pollsWithDates = parsed.map((poll: any) => ({
          ...poll,
          openDate: new Date(poll.openDate),
          closeDate: new Date(poll.closeDate)
        }));
        setPolls(pollsWithDates);
      } catch (error) {
        console.error('Error loading polls:', error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem('communication-items', JSON.stringify(items));
    localStorage.setItem('community-updates', JSON.stringify(updates));
    localStorage.setItem('community-polls', JSON.stringify(polls));
  };

  // Event emitters (stubs)
  const emitEvent = (eventType: string, data: any) => {
    console.log(`Event: ${eventType}`, data);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Handle poll file upload
  const handlePollFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPollAttachments(prev => [...prev, ...files]);
  };

  // Submit new request
  const submitNewRequest = () => {
    const newItem: CommunicationItem = {
      id: `comm-${Date.now()}`,
      title: newRequest.title,
      category: newRequest.category,
      description: newRequest.description,
      status: 'Open',
      submittedBy: {
        name: user?.name || 'Current User',
        address: user?.address || 'User Address'
      },
      submittedAt: new Date(),
      lastUpdate: new Date(),
      attachments: selectedFiles.map(f => f.name),
      timeline: [{
        id: `t-${Date.now()}`,
        type: 'comment',
        content: `Request submitted: ${newRequest.description}`,
        author: user?.name || 'Current User',
        timestamp: new Date()
      }]
    };

    setItems(prev => [newItem, ...prev]);
    emitEvent('request:created', { category: newRequest.category, item: newItem });
    
    // Reset form
    setNewRequest({ title: '', category: 'General', description: '', emailBoard: true });
    setSelectedFiles([]);
    setShowNewRequestModal(false);
    saveData();
  };


  // Create poll
  const createPoll = () => {
    const poll: Poll = {
      id: `poll-${Date.now()}`,
      title: newPoll.title,
      audience: newPoll.audience,
      questionType: newPoll.questionType,
      options: newPoll.options.filter(opt => opt.trim()),
      openDate: new Date(newPoll.openDate),
      closeDate: new Date(newPoll.closeDate),
      anonymous: newPoll.anonymous,
      requireQuorum: newPoll.requireQuorum ? parseInt(newPoll.requireQuorum) : undefined,
      status: new Date(newPoll.openDate) <= new Date() ? 'Active' : 'Scheduled',
      votes: [],
      createdBy: user?.name || 'HOA Manager',
      attachments: pollAttachments.map(f => f.name)
    };

    setPolls(prev => [poll, ...prev]);
    emitEvent('poll:created', poll);
    
    setNewPoll({
      title: '',
      audience: 'Community',
      questionType: 'single',
      options: ['', ''],
      openDate: '',
      closeDate: '',
      anonymous: true,
      requireQuorum: ''
    });
    setPollAttachments([]);
    setShowCreatePollModal(false);
    saveData();
  };

  // Filter functions
  const filteredUpdates = updates.filter(update => {
    if (updatesFilter === 'All') return true;
    if (updatesFilter === 'Notices') return update.type === 'notice';
    if (updatesFilter === 'Resolutions') return update.type === 'resolution';
    return true;
  });

  const filteredPolls = polls.filter(poll => poll.status === pollsFilter);

  const canManage = hasPermission('canManageResidents') || hasPermission('canReviewARCRequests');

  // Tab definitions
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'forms', label: 'Resident Request Forms', icon: <FileText size={16} /> }
  ];

  // Form definitions
  const residentForms = [
    {
      id: 'safe-listing',
      title: 'Safe Listing Vehicles',
      icon: <Car size={20} className="text-blue-600" />,
      description: 'Register your vehicles with the HOA for gate access and security purposes',
      fields: [
        { label: 'Vehicle Make', type: 'text', placeholder: 'Toyota, Honda, Ford, etc.' },
        { label: 'Vehicle Model', type: 'text', placeholder: 'Camry, Civic, F-150, etc.' },
        { label: 'Vehicle Year', type: 'number', placeholder: '2020' },
        { label: 'License Plate', type: 'text', placeholder: 'ABC1234' },
        { label: 'Vehicle Color', type: 'text', placeholder: 'White, Black, Silver, etc.' },
        { label: 'Owner Name', type: 'text', placeholder: 'Full name of vehicle owner' },
        { label: 'Relationship to Resident', type: 'select', options: ['Self', 'Spouse', 'Child', 'Guest', 'Other'] }
      ]
    },
    {
      id: 'transponder',
      title: 'Transponder Application',
      icon: <CreditCard size={20} className="text-green-600" />,
      description: 'Apply for a gate transponder for convenient community access',
      fields: [
        { label: 'Resident Name', type: 'text', placeholder: 'Full name as on HOA records' },
        { label: 'Property Address', type: 'text', placeholder: 'Your community address' },
        { label: 'Phone Number', type: 'tel', placeholder: '(949) 555-0123' },
        { label: 'Email Address', type: 'email', placeholder: 'your.email@example.com' },
        { label: 'Number of Transponders', type: 'number', placeholder: '1', min: 1, max: 4 },
        { label: 'Vehicle Information', type: 'textarea', placeholder: 'List vehicles that will use transponders (Make, Model, License Plate)' },
        { label: 'Reason for Request', type: 'select', options: ['New Resident', 'Replacement', 'Additional Vehicle', 'Lost/Stolen'] }
      ]
    },
    {
      id: 'gate-code',
      title: 'Gate Code Request',
      icon: <Key size={20} className="text-purple-600" />,
      description: 'Request temporary gate codes for guests and service providers',
      fields: [
        { label: 'Resident Name', type: 'text', placeholder: 'Your full name' },
        { label: 'Property Address', type: 'text', placeholder: 'Your community address' },
        { label: 'Guest/Service Provider Name', type: 'text', placeholder: 'Name of person needing access' },
        { label: 'Company Name', type: 'text', placeholder: 'If applicable (delivery, contractor, etc.)' },
        { label: 'Phone Number', type: 'tel', placeholder: 'Contact number for guest/provider' },
        { label: 'Access Date(s)', type: 'text', placeholder: 'Specific dates or date range' },
        { label: 'Access Time', type: 'text', placeholder: 'Time range (e.g., 9:00 AM - 5:00 PM)' },
        { label: 'Purpose of Visit', type: 'textarea', placeholder: 'Reason for access (delivery, maintenance, guest visit, etc.)' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-blue-600" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-ink-900">Communications</h1>
        </div>
        
        {/* Action Button */}
        <Button 
          onClick={() => setShowNewRequestModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Post Announcement
        </Button>
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

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community Updates */}
        <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-ink-900">Community Updates</h2>
            <select
              value={updatesFilter}
              onChange={(e) => setUpdatesFilter(e.target.value as any)}
              className="px-3 py-1 border border-neutral-300 rounded-lg text-body"
            >
              <option value="All">All</option>
              <option value="Notices">Notices</option>
              <option value="Resolutions">Resolutions</option>
            </select>
          </div>
          
          {filteredUpdates.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="mx-auto text-neutral-400 mb-4" size={48} />
              <p className="text-body text-ink-600">No updates posted.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <div key={update.id} className="p-4 border border-ink-900/8 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-h4 font-semibold text-ink-900">{update.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      update.type === 'notice' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {update.type === 'notice' ? 'Notice' : 'Resolution'}
                    </span>
                  </div>
                  <p className="text-body text-ink-700 mb-3">{update.content}</p>
                  <div className="flex items-center gap-4 text-caption text-ink-600">
                    <span>{update.author.name} ({update.author.role})</span>
                    <span>{update.postedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Polls */}
        <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-ink-900">Polls</h2>
            <div className="flex items-center gap-3">
              <select
                value={pollsFilter}
                onChange={(e) => setPollsFilter(e.target.value as any)}
                className="px-3 py-1 border border-neutral-300 rounded-lg text-body"
              >
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Closed">Closed</option>
              </select>
              {canManage && (
                <Button 
                  size="sm"
                  onClick={() => setShowCreatePollModal(true)}
                  className="flex items-center gap-1"
                >
                  <Plus size={14} />
                  Create Poll
                </Button>
              )}
            </div>
          </div>
          
          {filteredPolls.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto text-neutral-400 mb-4" size={48} />
              <p className="text-body text-ink-600">No {pollsFilter.toLowerCase()} polls.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPolls.map((poll) => (
                <div key={poll.id} className="p-4 border border-ink-900/8 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-h4 font-semibold text-ink-900">{poll.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      poll.status === 'Active' ? 'bg-green-100 text-green-700' :
                      poll.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-neutral-100 text-neutral-700'
                    }`}>
                      {poll.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-caption text-ink-600 mb-3">
                    <span>{poll.audience} Poll</span>
                    <span>Closes: {poll.closeDate.toLocaleDateString()}</span>
                    <span>{poll.votes.length} votes</span>
                  </div>
                  {poll.status === 'Active' && (
                    <div className="space-y-2">
                      {poll.options.map((option, index) => (
                        <button
                          key={index}
                          className="w-full p-2 text-left border border-neutral-300 rounded-lg hover:border-primary transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      )}

      {/* Resident Request Forms Tab */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          {!selectedForm ? (
            // Forms List
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {residentForms.map((form) => (
                <div 
                  key={form.id}
                  onClick={() => setSelectedForm(form.id)}
                  className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6 hover:border-neutral-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                      {form.icon}
                    </div>
                    <div>
                      <h3 className="text-h3 font-semibold text-ink-900">{form.title}</h3>
                    </div>
                  </div>
                  <p className="text-body text-ink-600">{form.description}</p>
                  <div className="mt-4 flex items-center text-primary hover:text-primary-700 transition-colors">
                    <span className="text-body font-medium">View Form</span>
                    <Eye size={16} className="ml-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Selected Form View
            (() => {
              const form = residentForms.find(f => f.id === selectedForm);
              if (!form) return null;
              
              return (
                <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                        {form.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-ink-900">{form.title}</h2>
                        <p className="text-body text-ink-600">{form.description}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedForm(null)}
                      className="flex items-center gap-2"
                    >
                      <X size={16} />
                      Back to Forms
                    </Button>
                  </div>
                  
                  <form className="space-y-4">
                    {form.fields.map((field, index) => (
                      <div key={index}>
                        <label className="block text-body font-medium text-ink-700 mb-2">
                          {field.label}
                          {field.type === 'number' && field.min && field.max && (
                            <span className="text-caption text-ink-500 ml-1">
                              (Max {field.max})
                            </span>
                          )}
                        </label>
                        
                        {field.type === 'select' ? (
                          <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body">
                            <option value="">Select {field.label}</option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body resize-none"
                          />
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            min={field.min}
                            max={field.max}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body"
                          />
                        )}
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-neutral-200">
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setSelectedForm(null)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Submit Request
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-semibold text-ink-900">Post Announcement</h3>
              <button onClick={() => setShowNewRequestModal(false)}>
                <X size={20} className="text-ink-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Brief description of the issue"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Category</label>
                <select
                  value={newRequest.category}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="Architectural">Architectural</option>
                  <option value="Landscaping">Landscaping</option>
                  <option value="Security">Security</option>
                  <option value="General">General</option>
                </select>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Detailed description of the issue or request"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Photos (Optional)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  Upload Photos
                </Button>
                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-caption text-ink-600">{selectedFiles.length} file(s) selected</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="emailBoard"
                  checked={newRequest.emailBoard}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, emailBoard: e.target.checked }))}
                  className="rounded border-neutral-300"
                />
                <label htmlFor="emailBoard" className="text-body text-ink-700">
                  Email board on submit
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowNewRequestModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitNewRequest}
                disabled={!newRequest.title || !newRequest.description}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Drawer */}
      {showItemDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-semibold text-ink-900">{showItemDetail.title}</h3>
              <button onClick={() => setShowItemDetail(null)}>
                <X size={20} className="text-ink-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-neutral-100 rounded text-xs">{showItemDetail.category}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  showItemDetail.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                  showItemDetail.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {showItemDetail.status}
                </span>
              </div>
              
              <p className="text-body text-ink-700">{showItemDetail.description}</p>
              
              <div className="border-t border-neutral-200 pt-4">
                <h4 className="text-h4 font-semibold text-ink-900 mb-3">Timeline</h4>
                <div className="space-y-3">
                  {showItemDetail.timeline.map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-body text-ink-700">{event.content}</p>
                        <p className="text-caption text-ink-600">
                          {event.author} • {event.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add an update..."
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <Button size="sm">
                    <Send size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Create Poll Modal */}
      {showCreatePollModal && canManage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-semibold text-ink-900">Create Poll</h3>
              <button onClick={() => setShowCreatePollModal(false)}>
                <X size={20} className="text-ink-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newPoll.title}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Audience</label>
                  <select
                    value={newPoll.audience}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, audience: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="Community">Community</option>
                    <option value="Board">Board</option>
                    <option value="All">All</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Question Type</label>
                  <select
                    value={newPoll.questionType}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, questionType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Options</label>
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newPoll.options];
                        newOptions[index] = e.target.value;
                        setNewPoll(prev => ({ ...prev, options: newOptions }));
                      }}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={`Option ${index + 1}`}
                    />
                    {newPoll.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = newPoll.options.filter((_, i) => i !== index);
                          setNewPoll(prev => ({ ...prev, options: newOptions }));
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewPoll(prev => ({ ...prev, options: [...prev.options, ''] }))}
                  className="mr-2"
                >
                  Add Option
                </Button>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Attachments (Optional)</label>
                <input
                  ref={pollFileInputRef}
                  type="file"
                  multiple
                  onChange={handlePollFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => pollFileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  Upload Files
                </Button>
                {pollAttachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-caption text-ink-600">{pollAttachments.length} file(s) selected</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {pollAttachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded text-xs">
                          <span className="truncate max-w-[100px]">{file.name}</span>
                          <button
                            onClick={() => setPollAttachments(prev => prev.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Open Date</label>
                  <input
                    type="datetime-local"
                    value={newPoll.openDate}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, openDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-body font-medium text-ink-700 mb-2">Close Date</label>
                  <input
                    type="datetime-local"
                    value={newPoll.closeDate}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, closeDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPoll.anonymous}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, anonymous: e.target.checked }))}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-body text-ink-700">Anonymous voting</span>
                </label>
                
                <div className="flex items-center gap-2">
                  <label className="text-body text-ink-700">Require quorum:</label>
                  <input
                    type="number"
                    value={newPoll.requireQuorum}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, requireQuorum: e.target.value }))}
                    className="w-20 px-2 py-1 border border-neutral-300 rounded text-body"
                    placeholder="%"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreatePollModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={createPoll}
                disabled={!newPoll.title || newPoll.options.filter(opt => opt.trim()).length < 2}
              >
                Create Poll
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
