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
  MessageCircle,
  Bell,
  X,
  Send
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
  audience: 'Community' | 'Board';
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
  const [showNewNoticeModal, setShowNewNoticeModal] = useState(false);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);
  
  // Form states
  const [newRequest, setNewRequest] = useState({
    title: '',
    category: 'General' as CommunicationItem['category'],
    description: '',
    emailBoard: true
  });
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: 'notice' as CommunityUpdate['type']
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
  
  // Filter states
  const [updatesFilter, setUpdatesFilter] = useState<'All' | 'Notices' | 'Resolutions'>('All');
  const [pollsFilter, setPollsFilter] = useState<'Active' | 'Scheduled' | 'Closed'>('Active');
  
  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Submit new notice
  const submitNewNotice = () => {
    const newUpdate: CommunityUpdate = {
      id: `update-${Date.now()}`,
      title: newNotice.title,
      type: newNotice.type,
      content: newNotice.content,
      author: {
        name: user?.name || 'HOA Manager',
        role: hasPermission('canReviewARCRequests') ? 'Board' : 'Manager'
      },
      postedAt: new Date()
    };

    setUpdates(prev => [newUpdate, ...prev]);
    emitEvent('notice:posted', newUpdate);
    
    setNewNotice({ title: '', content: '', type: 'notice' });
    setShowNewNoticeModal(false);
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
      createdBy: user?.name || 'HOA Manager'
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
  const userItems = items.filter(item => item.submittedBy.name === user?.name);

  const canManage = hasPermission('canManageResidents') || hasPermission('canReviewARCRequests');

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
            <h2 className="text-2xl font-semibold text-ink-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setShowNewRequestModal(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                New Request/Complaint
              </Button>
              {canManage && (
                <Button 
                  variant="outline"
                  onClick={() => setShowNewNoticeModal(true)}
                  className="flex items-center gap-2"
                >
                  <Bell size={16} />
                  Post Notice
                </Button>
              )}
            </div>
          </div>

          {/* My Items */}
          <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
            <h2 className="text-2xl font-semibold text-ink-900 mb-4">My Items</h2>
            {userItems.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto text-neutral-400 mb-4" size={48} />
                <p className="text-body text-ink-600">No requests yet. Start one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setShowItemDetail(item)}
                    className="p-4 border border-ink-900/8 rounded-lg hover:border-neutral-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-h4 font-semibold text-ink-900">{item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-caption text-ink-600">
                      <span className="px-2 py-1 bg-neutral-100 rounded text-xs">{item.category}</span>
                      <span>Last update: {item.lastUpdate.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Community Updates Feed */}
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

        {/* Sidebar - Empty for now */}
        <div className="space-y-6">
          {/* Sidebar content removed for cleaner manager view */}
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-semibold text-ink-900">New Request/Complaint</h3>
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

      {/* New Notice Modal */}
      {showNewNoticeModal && canManage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-semibold text-ink-900">Post Community Notice</h3>
              <button onClick={() => setShowNewNoticeModal(false)}>
                <X size={20} className="text-ink-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Type</label>
                <select
                  value={newNotice.type}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="notice">Notice</option>
                  <option value="resolution">Resolution</option>
                </select>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Content</label>
                <textarea
                  value={newNotice.content}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowNewNoticeModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitNewNotice}
                disabled={!newNotice.title || !newNotice.content}
              >
                Post Notice
              </Button>
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
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newPoll.options];
                      newOptions[index] = e.target.value;
                      setNewPoll(prev => ({ ...prev, options: newOptions }));
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-2"
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewPoll(prev => ({ ...prev, options: [...prev.options, ''] }))}
                >
                  Add Option
                </Button>
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
