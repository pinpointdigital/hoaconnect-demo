'use client';

/**
 * ARC Flow Management Page
 * Complete workflow management interface showcasing the end-to-end ARC process
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { WorkflowProvider, useWorkflow } from '@/lib/arc/workflow-context';
import { 
  WorkflowProgress, 
  WorkflowActions, 
  RequiredActions, 
  WorkflowNotifications, 
  WorkflowDashboard 
} from '@/components/arc/WorkflowComponents';
import { Button } from '@/components/ui/Button';
import { ARCRequest } from '@/lib/arc/types';
import { 
  Workflow, 
  Plus, 
  Filter, 
  Search, 
  BarChart3, 
  Settings, 
  Bell, 
  Eye, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';
import Link from 'next/link';

function ARCFlowContent() {
  const { hasPermission, currentRole } = useAuth();
  const { state, loadRequests, createRequest, getUnreadNotifications } = useWorkflow();
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'notifications' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const unreadNotifications = getUnreadNotifications();
  
  // Filter requests based on search and status
  const filteredRequests = state.requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.submittedBy.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeRequests = filteredRequests.filter(r => !['completed', 'denied'].includes(r.status));
  const needsAttention = filteredRequests.filter(r => {
    // Logic to determine which requests need attention
    switch (r.status) {
      case 'submitted':
      case 'under-review':
        return hasPermission('canReviewARCRequests');
      case 'board-voting':
        return currentRole === 'board-member';
      case 'neighbor-signoff':
        return r.neighborSignoffs.some(n => n.status === 'pending');
      default:
        return false;
    }
  });

  const tabs = [
    { 
      id: 'overview', 
      label: 'Workflow Overview', 
      icon: <Workflow size={16} />,
      badge: activeRequests.length > 0 ? activeRequests.length : null
    },
    { 
      id: 'active', 
      label: 'Active Requests', 
      icon: <Activity size={16} />,
      badge: needsAttention.length > 0 ? needsAttention.length : null
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <Bell size={16} />,
      badge: unreadNotifications.length > 0 ? unreadNotifications.length : null
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <BarChart3 size={16} />
    }
  ];

  const createDemoRequest = async () => {
    const demoRequest = {
      title: 'Solar Panel Installation',
      description: 'Installation of rooftop solar panel system on south-facing sections of the roof. Panels will be low-profile and match the existing roof color.',
      projectType: 'other' as const,
      submittedBy: {
        name: 'Demo User',
        address: '123 Demo Street',
        email: 'demo@example.com',
        phone: '(555) 123-4567',
        userId: 'demo-user'
      },
      documents: [],
      conversations: [],
      ccrAttachments: [],
      formAssignments: [],
      neighborPositions: [],
      neighborSignoffs: [],
      boardVotes: [],
      appeals: [],
      inspections: [],
      notificationLog: []
    };

    await createRequest(demoRequest);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-ink-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <Workflow size={24} />
              </div>
              ARC Flow Management
            </h1>
            <p className="text-body text-ink-700 mt-1">
              Complete end-to-end workflow management for Architectural Review Committee requests
            </p>
          </div>
          
          {hasPermission('canSubmitARCRequests') && (
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                Demo Request
              </Button>
              <Link href="/dashboard/arc">
                <Button variant="primary" size="sm">
                  <Plus size={16} />
                  New Request
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Requests</p>
                <p className="text-2xl font-bold text-ink-900">{state.requests.length}</p>
              </div>
              <FileText className="text-blue-500" size={20} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Workflows</p>
                <p className="text-2xl font-bold text-ink-900">{activeRequests.length}</p>
              </div>
              <Activity className="text-orange-500" size={20} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Need Attention</p>
                <p className="text-2xl font-bold text-ink-900">{needsAttention.length}</p>
              </div>
              <AlertTriangle className="text-yellow-500" size={20} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Transitions</p>
                <p className="text-2xl font-bold text-ink-900">{state.activeTransitions.size}</p>
              </div>
              <Zap className="text-purple-500" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-neutral-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <WorkflowDashboard requests={state.requests} showMetrics={true} />
            
            {/* Featured Workflow Examples */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-ink-900 mb-4">Workflow Engine Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="text-blue-600" size={24} />
                  </div>
                  <h4 className="font-medium text-ink-900 mb-2">Automated Transitions</h4>
                  <p className="text-sm text-neutral-600">Smart workflow engine automatically progresses requests when conditions are met</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <h4 className="font-medium text-ink-900 mb-2">Role-Based Actions</h4>
                  <p className="text-sm text-neutral-600">Different actions available based on user role and request status</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="text-purple-600" size={24} />
                  </div>
                  <h4 className="font-medium text-ink-900 mb-2">Smart Notifications</h4>
                  <p className="text-sm text-neutral-600">Contextual notifications and reminders throughout the workflow</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Requests Tab */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="under-review">Under Review</option>
                    <option value="neighbor-signoff">Neighbor Sign-off</option>
                    <option value="board-voting">Board Voting</option>
                    <option value="approved">Approved</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Requests List */}
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
                <Activity className="mx-auto text-neutral-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-ink-900 mb-2">No Active Requests</h3>
                <p className="text-neutral-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No requests match your current filters.' 
                    : 'Create a demo request to see the workflow in action.'}
                </p>
                {hasPermission('canSubmitARCRequests') && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus size={16} />
                    Create Demo Request
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-lg border border-neutral-200 p-6">
                    {/* Request Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-ink-900">{request.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'completed' ? 'bg-green-100 text-green-800' :
                            request.status === 'denied' ? 'bg-red-100 text-red-800' :
                            request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-neutral-600 mb-2">{request.description}</p>
                        <div className="flex items-center gap-4 text-sm text-neutral-600">
                          <span><strong>Submitted by:</strong> {request.submittedBy.name}</span>
                          <span><strong>Address:</strong> {request.submittedBy.address}</span>
                          <span><strong>Date:</strong> {request.submittedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Link href={`/dashboard/arc-management/${request.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye size={14} />
                          View Details
                        </Button>
                      </Link>
                    </div>

                    {/* Workflow Progress */}
                    <div className="mb-4">
                      <WorkflowProgress requestId={request.id} size="sm" />
                    </div>

                    {/* Required Actions */}
                    <RequiredActions requestId={request.id} showTitle={false} />

                    {/* Workflow Actions */}
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <WorkflowActions requestId={request.id} request={request} compact={true} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-4">Workflow Notifications</h3>
            <WorkflowNotifications maxItems={20} />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <WorkflowDashboard requests={state.requests} showMetrics={false} />
            
            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-ink-900 mb-4">Workflow Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Average Processing Time</span>
                    <span className="font-medium">12 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Approval Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Auto-Transitions</span>
                    <span className="font-medium">64%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">On-Time Completion</span>
                    <span className="font-medium">92%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-ink-900 mb-4">Bottlenecks</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="text-yellow-600" size={16} />
                    <div>
                      <p className="text-sm font-medium">Neighbor Sign-offs</p>
                      <p className="text-xs text-neutral-600">Average 5.2 days delay</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="text-blue-600" size={16} />
                    <div>
                      <p className="text-sm font-medium">Board Review</p>
                      <p className="text-xs text-neutral-600">Average 3.8 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Demo Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-4">Create Demo Request</h3>
            <p className="text-neutral-600 mb-6">
              This will create a sample ARC request that demonstrates the complete workflow engine with automated transitions and notifications.
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

export default function ARCFlowPage() {
  return (
    <WorkflowProvider>
      <ARCFlowContent />
    </WorkflowProvider>
  );
}
