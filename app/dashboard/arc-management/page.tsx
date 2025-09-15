'use client';
// @ts-nocheck

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { SAMPLE_ARC_REQUESTS, createNewARCRequest } from '@/lib/arc/data';
import { ARC_STATUS_LABELS } from '@/lib/arc/types';
import { 
  Plus, 
  Search, 
  Filter,
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  FileText,
  Eye,
  MessageSquare,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS = {
  'draft': 'bg-neutral-100 text-neutral-700',
  'submitted': 'bg-blue-100 text-blue-700',
  'under-review': 'bg-yellow-100 text-yellow-700',
  'neighbor-signoff': 'bg-purple-100 text-purple-700',
  'board-voting': 'bg-orange-100 text-orange-700',
  'approved': 'bg-green-100 text-green-700',
  'denied': 'bg-red-100 text-red-700',
  'appeal-pending': 'bg-pink-100 text-pink-700',
  'appeal-review': 'bg-pink-100 text-pink-700',
  'in-progress': 'bg-indigo-100 text-indigo-700',
  'inspection-required': 'bg-cyan-100 text-cyan-700',
  'inspection-failed': 'bg-red-100 text-red-700',
  'completed': 'bg-emerald-100 text-emerald-700'
};

const STATUS_ICONS = {
  'submitted': <AlertCircle size={16} />,
  'under-review': <Clock size={16} />,
  'neighbor-signoff': <Users size={16} />,
  'board-voting': <Users size={16} />,
  'approved': <CheckCircle size={16} />,
  'denied': <XCircle size={16} />,
  'appeal-pending': <AlertCircle size={16} />,
  'appeal-review': <Clock size={16} />,
  'in-progress': <Clock size={16} />,
  'inspection-required': <Eye size={16} />,
  'inspection-failed': <XCircle size={16} />,
  'completed': <CheckCircle size={16} />
};

export default function ARCManagementPage() {
  const { hasPermission, currentRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Helper function to parse dates in stored requests
  const parseStoredRequests = (stored: string) => {
    const requests = JSON.parse(stored);
    return requests.map((request: any) => ({
      ...request,
      submittedAt: new Date(request.submittedAt),
      updatedAt: new Date(request.updatedAt),
      desiredStartDate: request.desiredStartDate ? new Date(request.desiredStartDate) : undefined,
      conversations: request.conversations?.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp)
      })) || [],
      stageHistory: request.stageHistory?.map((stage: any) => ({
        ...stage,
        enteredAt: new Date(stage.enteredAt)
      })) || []
    }));
  };

  // For demo - load requests from localStorage with fallback to SAMPLE_ARC_REQUESTS
  const [requests, setRequests] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('hoa-connect-arc-requests');
        return stored ? parseStoredRequests(stored) : SAMPLE_ARC_REQUESTS;
      } catch (error) {
        console.error('Error loading ARC requests from localStorage:', error);
        return SAMPLE_ARC_REQUESTS;
      }
    }
    return SAMPLE_ARC_REQUESTS;
  });

  const filteredRequests = requests.filter((request: any) => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.submittedBy.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeRequests = requests.filter((r: any) => !['completed', 'denied'].includes(r.status));
  const needsAttention = requests.filter((r: any) => ['submitted', 'under-review', 'appeal-pending'].includes(r.status));

  const createDemoRequest = () => {
    // Array of different demo request types and requestors
    const demoRequests = [
      {
        title: 'Backyard Patio Addition',
        description: 'Install new covered patio with outdoor kitchen area including built-in BBQ, sink, and storage.',
        type: 'addition' as const,
        requestor: {
          name: 'Sarah Johnson',
          address: '1423 Oceanview Drive', 
          email: 'sarah.johnson@email.com',
          phone: '(949) 555-0189',
          userId: 'user-homeowner-001'
        }
      },
      {
        title: 'Front Yard Landscaping',
        description: 'Replace existing lawn with drought-resistant native plants and decorative rock garden.',
        type: 'landscaping' as const,
        requestor: {
          name: 'Robert Chen',
          address: '1421 Oceanview Drive', 
          email: 'robert.chen@email.com',
          phone: '(949) 555-0191',
          userId: 'user-homeowner-002'
        }
      },
      {
        title: 'Solar Panel Installation',
        description: 'Install 20-panel solar system on south-facing roof with battery backup system.',
        type: 'exterior-modification' as const,
        requestor: {
          name: 'Maria Santos',
          address: '1425 Oceanview Drive', 
          email: 'maria.santos@email.com',
          phone: '(949) 555-0192',
          userId: 'user-homeowner-003'
        }
      },
      {
        title: 'Exterior Paint Color Change',
        description: 'Repaint house exterior from beige to approved sage green color from HOA palette.',
        type: 'exterior-modification' as const,
        requestor: {
          name: 'Tom Anderson',
          address: '1336 Hillside Court', 
          email: 'tom.anderson@email.com',
          phone: '(949) 555-0194',
          userId: 'user-homeowner-004'
        }
      },
      {
        title: 'Swimming Pool Installation',
        description: 'Install in-ground swimming pool with safety fence and automatic cover in backyard.',
        type: 'addition' as const,
        requestor: {
          name: 'Jennifer Walsh',
          address: '1245 Seaside Drive', 
          email: 'jennifer.walsh@email.com',
          phone: '(949) 555-0193',
          userId: 'user-homeowner-005'
        }
      },
      {
        title: 'Garage Door Replacement',
        description: 'Replace old sectional garage door with modern carriage-style door to match home architecture.',
        type: 'exterior-modification' as const,
        requestor: {
          name: 'David Martinez',
          address: '1427 Oceanview Drive', 
          email: 'david.martinez@email.com',
          phone: '(949) 555-0196',
          userId: 'user-homeowner-006'
        }
      }
    ];

    // Randomly select a demo request
    const randomRequest = demoRequests[Math.floor(Math.random() * demoRequests.length)];
    
    if (!randomRequest) return;
    
    // Set desired start date to 30-60 days from now (randomized)
    const desiredStartDate = new Date();
    const daysFromNow = 30 + Math.floor(Math.random() * 31); // 30-60 days
    desiredStartDate.setDate(desiredStartDate.getDate() + daysFromNow);
    
    const newRequest = createNewARCRequest(
      randomRequest.title,
      randomRequest.description,
      randomRequest.type,
      randomRequest.requestor,
      desiredStartDate
    );
    const updatedRequests = [newRequest, ...requests];
    setRequests(updatedRequests);
    
    // Persist to localStorage
    try {
      localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));
    } catch (error) {
      console.error('Error saving ARC requests to localStorage:', error);
    }
    
    setShowCreateModal(false);
  };

  const updateRequestStatus = (requestId: string, newStatus: any, managerName?: string) => {
    const updatedRequests = requests.map((request: any) => {
      if (request.id === requestId) {
        const now = new Date();
        const updatedRequest = {
          ...request,
          status: newStatus,
          currentStage: newStatus,
          updatedAt: now,
          stageHistory: [
            ...request.stageHistory,
            {
              stage: newStatus,
              enteredAt: now,
              enteredBy: managerName || 'HOA Manager',
              notes: `Status updated to ${ARC_STATUS_LABELS[newStatus as keyof typeof ARC_STATUS_LABELS] || newStatus}`
            }
          ],
          conversations: [
            ...request.conversations,
            {
              id: `msg-${Date.now()}`,
              type: 'manager' as const,
              content: `Request status updated to "${ARC_STATUS_LABELS[newStatus as keyof typeof ARC_STATUS_LABELS] || newStatus}".`,
              author: {
                name: managerName || 'HOA Manager',
                role: 'HOA Manager'
              },
              timestamp: now,
              visibility: 'public' as const
            }
          ]
        };
        return updatedRequest;
      }
      return request;
    });

    setRequests(updatedRequests);
    
    // Persist to localStorage
    try {
      localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));
    } catch (error) {
      console.error('Error saving ARC requests to localStorage:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-ink-900">ARC Request Management</h1>
          <p className="text-body text-ink-600 mt-1">
            Review and manage architectural review committee requests
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Start Demo Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-card border border-ink-900/8 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-ink-600">Active Requests</p>
              <p className="text-h2 font-bold text-ink-900">{activeRequests.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card border border-ink-900/8 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-ink-600">Needs Attention</p>
              <p className="text-h2 font-bold text-ink-900">{needsAttention.length}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-yellow-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card border border-ink-900/8 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-ink-600">Board Review</p>
              <p className="text-h2 font-bold text-ink-900">
                {requests.filter(r => r.status === 'board-voting').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="text-orange-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card border border-ink-900/8 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-ink-600">Completed</p>
              <p className="text-h2 font-bold text-ink-900">
                {requests.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-card border border-ink-900/8 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-500" size={16} />
              <input
                type="text"
                placeholder="Search requests by title, homeowner, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-control text-body focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-control text-body focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under-review">Under Review</option>
              <option value="neighbor-signoff">Neighbor Sign-off</option>
              <option value="board-voting">Board Voting</option>
              <option value="approved">Approved</option>
              <option value="in-progress">In Progress</option>
              <option value="inspection-required">Inspection Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-card border border-ink-900/8">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="text-h3 font-semibold text-ink-900">
            {filteredRequests.length === 0 ? 'No Requests' : `${filteredRequests.length} Request${filteredRequests.length !== 1 ? 's' : ''}`}
          </h3>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto text-ink-400 mb-4" size={48} />
            <h4 className="text-h4 font-medium text-ink-900 mb-2">No ARC Requests</h4>
            <p className="text-body text-ink-600 mb-6">
              {requests.length === 0 
                ? 'Start the demo by creating a sample ARC request to walk through the complete workflow.'
                : 'No requests match your current search criteria.'
              }
            </p>
            {requests.length === 0 && (
              <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
                <Plus size={16} />
                Start Demo Request
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-body font-semibold text-ink-900 truncate">
                        {request.title}
                      </h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[request.status]}`}>
                        {STATUS_ICONS[request.status]}
                        {ARC_STATUS_LABELS[request.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-caption text-ink-600">
                      <span>{request.submittedBy.name}</span>
                      <span>{request.submittedBy.address}</span>
                      <span>Submitted {request.submittedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/arc-management/${request.id}`}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => {
                          // Update status to "under-review" when manager clicks Review
                          if (request.status === 'submitted') {
                            updateRequestStatus(request.id, 'under-review', 'HOA Manager');
                          }
                        }}
                      >
                        <Eye size={14} />
                        Review
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <MoreVertical size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Demo Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-h3 font-semibold text-ink-900 mb-4">Start Demo Walkthrough</h3>
            <p className="text-body text-ink-600 mb-6">
              This will create a sample ARC request that you can use to demonstrate the complete workflow from submission to completion.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={createDemoRequest}>
                Create Demo Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
