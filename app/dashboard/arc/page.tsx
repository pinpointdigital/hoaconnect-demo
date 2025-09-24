'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StepModal } from '@/components/ui/StepModal';
import { SAMPLE_ARC_REQUESTS } from '@/lib/arc/data';
import { ARC_STATUS_LABELS, PROJECT_TYPES } from '@/lib/arc/types';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, AlertTriangle, Users, Timer, Filter, Upload, Zap, Home as HomeIcon, Mail, MessageSquare, FileText, Send, Info, UserCheck, FileCheck, Vote, Eye, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS = {
  'draft': 'bg-neutral-100 text-ink-800',
  'submitted': 'bg-blue-100 text-blue-800', 
  'under-review': 'bg-yellow-100 text-yellow-800',
  'neighbor-signoff': 'bg-purple-100 text-purple-800',
  'ai-review': 'bg-cyan-100 text-cyan-800',
  'board-voting': 'bg-orange-100 text-orange-800',
  'approved': 'bg-green-100 text-green-800',
  'denied': 'bg-red-100 text-red-800',
  'appeal-pending': 'bg-pink-100 text-pink-800',
  'inspection-required': 'bg-indigo-100 text-indigo-800',
  'completed': 'bg-emerald-100 text-emerald-800'
};

const STATUS_ICONS = {
  'draft': <Clock size={16} />,
  'submitted': <AlertCircle size={16} />,
  'under-review': <Clock size={16} />,
  'neighbor-signoff': <Clock size={16} />,
  'ai-review': <AlertCircle size={16} />,
  'board-voting': <Clock size={16} />,
  'approved': <CheckCircle size={16} />,
  'denied': <XCircle size={16} />,
  'appeal-pending': <AlertCircle size={16} />,
  'inspection-required': <Clock size={16} />,
  'completed': <CheckCircle size={16} />
};

export default function ARCPage() {
  const { hasPermission, currentRole } = useAuth();
  
  // Modal state
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [currentModalStep, setCurrentModalStep] = useState(1);
  const [selectedProjectType, setSelectedProjectType] = useState<string>('');
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [showReplyField, setShowReplyField] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyAttachments, setReplyAttachments] = useState<string[]>([]);
  const [repliedMessages, setRepliedMessages] = useState<Set<string>>(new Set());
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    estimatedCost: '',
    contractorName: '',
    contractorLicense: '',
    contractorContact: ''
  });
  const [attachments, setAttachments] = useState<string[]>([]);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  // Calculate KPIs from sample data
  const totalRequests = SAMPLE_ARC_REQUESTS.length;
  const pendingReviews = SAMPLE_ARC_REQUESTS.filter(r => 
    ['submitted', 'under-review', 'neighbor-signoff', 'board-voting'].includes(r.status)
  ).length;
  const approvedThisMonth = SAMPLE_ARC_REQUESTS.filter(r => r.status === 'approved').length;
  const avgApprovalTime = 12; // days - would calculate from actual data

  // Modal functions
  const openNewRequestModal = () => {
    setCurrentModalStep(1);
    setSelectedProjectType('');
    setRequestForm({
      title: '',
      description: '',
      estimatedCost: '',
      contractorName: '',
      contractorLicense: '',
      contractorContact: ''
    });
    setAttachments([]);
    setHasAutoFilled(false);
    setShowNewRequestModal(true);
  };

  // Reply functions
  const sendReply = (messageId: string) => {
    setRepliedMessages(prev => new Set([...prev, messageId]));
    setShowReplyField(null);
    setReplyMessage('');
    setReplyAttachments([]);
  };

  // Scroll functions
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      // Add temporary highlight
      section.classList.add('ring-2', 'ring-primary', 'ring-opacity-50');
      setTimeout(() => {
        section.classList.remove('ring-2', 'ring-primary', 'ring-opacity-50');
      }, 2000);
    }
  };

  const nextStep = () => {
    if (currentModalStep < 4) {
      setCurrentModalStep(currentModalStep + 1);
    }
  };

  const previousStep = () => {
    if (currentModalStep > 1) {
      setCurrentModalStep(currentModalStep - 1);
    }
  };

  const submitRequest = () => {
    // Here would submit to backend
    console.log('Submitting ARC request:', { selectedProjectType, requestForm, attachments });
    setShowNewRequestModal(false);
    // Could add success toast here
  };

  // Get adaptive placeholders based on project type
  const getPlaceholders = () => {
    const placeholders = {
      'landscaping': {
        title: 'Front Yard Landscape Renovation',
        description: 'Describe your landscaping plans including plants, hardscaping, and irrigation changes...'
      },
      'exterior-modification': {
        title: 'Exterior Home Modification',
        description: 'Describe the exterior changes including materials, colors, and design elements...'
      },
      'addition': {
        title: 'Home Addition Project',
        description: 'Describe the addition including size, purpose, and architectural details...'
      },
      'adu-jadu': {
        title: 'ADU/JADU Construction',
        description: 'Describe your Accessory Dwelling Unit plans including size, location, and intended use...'
      },
      'paint': {
        title: 'Exterior Paint Color Change',
        description: 'Describe the paint changes including specific colors and areas to be painted...'
      },
      'fence': {
        title: 'Fence Installation/Modification',
        description: 'Describe the fencing project including materials, height, and location...'
      },
      'other': {
        title: 'Architectural Modification',
        description: 'Describe your proposed project in detail...'
      }
    };
    
    return placeholders[selectedProjectType as keyof typeof placeholders] || placeholders.other;
  };

  // AI Auto-fill for demo - adaptive based on project type
  const autoFillRequest = () => {
    const sampleRequestsByType = {
      'landscaping': {
        title: 'Front Yard Drought-Resistant Landscaping',
        description: 'Complete redesign of front yard landscaping including new drought-resistant plants, decorative stones, and updated drip irrigation system to comply with water conservation guidelines.'
      },
      'exterior-modification': {
        title: 'Window and Door Replacement',
        description: 'Replace all front-facing windows and front door with energy-efficient models in matching architectural style. Windows will be dual-pane with bronze frames.'
      },
      'addition': {
        title: 'Backyard Deck Addition',
        description: 'Adding 12x16 composite deck to backyard with safety railings and integrated LED lighting. Deck will be 18 inches off ground with stairs and privacy screening.'
      },
      'adu-jadu': {
        title: 'Detached ADU Construction',
        description: 'Construction of 600 sq ft detached ADU in backyard for family use. Single bedroom unit with full kitchen, bathroom, and separate entrance.'
      },
      'paint': {
        title: 'Exterior Paint Color Change',
        description: 'Repainting house exterior from current beige to approved warm gray color (Sherwin Williams SW 7029) including trim and garage door.'
      },
      'fence': {
        title: 'Privacy Fence Installation',
        description: 'Installing 6-foot cedar privacy fence along rear property line with matching gate. Fence will match existing community standards.'
      },
      'other': {
        title: 'Solar Panel Installation',
        description: 'Installation of rooftop solar panel system on south-facing roof sections. Panels will be low-profile and match roof color.'
      }
    };

    const projectSample = sampleRequestsByType[selectedProjectType as keyof typeof sampleRequestsByType] || sampleRequestsByType.other;
    setRequestForm({
      title: projectSample.title,
      description: projectSample.description,
      estimatedCost: '',
      contractorName: '',
      contractorLicense: '',
      contractorContact: ''
    });
    setHasAutoFilled(true);
  };

  const clearForm = () => {
    setRequestForm({
      title: '',
      description: '',
      estimatedCost: '',
      contractorName: '',
      contractorLicense: '',
      contractorContact: ''
    });
    setHasAutoFilled(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Page Header Format */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-ink-900">
              {(currentRole === 'captain' || currentRole === 'management-company') ? 'ARC Requests' : 'My ARC Requests'}
            </h1>
            <p className="text-body text-ink-700 mt-1">
              {(currentRole === 'captain' || currentRole === 'management-company') 
                ? 'Streamline architectural reviews with intelligent workflow management and automated compliance checking.' 
                : 'Track your architectural review submissions and approvals'
              }
            </p>
          </div>
          
          {hasPermission('canSubmitARCRequests') && (
            <div className="flex gap-3">
              <Button variant="primary" size="sm" onClick={openNewRequestModal}>
                <Plus size={16} />
                New Request
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Admin KPI Dashboard */}
      {(currentRole === 'captain' || currentRole === 'management-company') && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-ink-700 font-medium">Pending Reviews</p>
                <p className="text-h3 font-bold text-ink-900 mt-1">{pendingReviews}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-ink-700 font-medium">Approved This Month</p>
                <p className="text-h3 font-bold text-ink-900 mt-1">{approvedThisMonth}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-ink-700 font-medium">Avg Approval Time</p>
                <p className="text-h3 font-bold text-ink-900 mt-1">{avgApprovalTime} days</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Timer className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-ink-700 font-medium">Total Requests</p>
                <p className="text-h3 font-bold text-ink-900 mt-1">{totalRequests}</p>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="text-primary-600" size={20} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Sort Controls - Only for Admin/Management */}
      {(currentRole === 'captain' || currentRole === 'management-company') && (
        <div className="flex items-center justify-between bg-white rounded-card border border-ink-900/8 shadow-elev1 p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Filter size={16} />
              All Requests
            </Button>
            <Button variant="ghost" size="sm">Pending Review</Button>
            <Button variant="ghost" size="sm">Approved</Button>
            <Button variant="ghost" size="sm">Needs Action</Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-caption text-ink-700">Sort by:</span>
            <select className="px-3 py-1 text-sm bg-background border border-border rounded">
              <option>Most Recent</option>
              <option>Priority</option>
              <option>Address</option>
              <option>Status</option>
            </select>
          </div>
        </div>
      )}

      {/* ARC Requests - Different views for Admin vs Homeowner */}
      {(currentRole === 'captain' || currentRole === 'management-company') ? (
        // Admin/Management View - Full Grid
        <div className="grid gap-6">
          {SAMPLE_ARC_REQUESTS.map((request) => (
            <div key={request.id} className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-150">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-h4 font-medium text-ink-900">{request.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-ctl text-caption font-medium ${STATUS_COLORS[request.status]}`}>
                      {STATUS_ICONS[request.status]}
                      {ARC_STATUS_LABELS[request.status]}
                    </span>
                  </div>
                  <p className="text-body text-ink-800 mb-3">{request.description}</p>
                  <div className="flex items-center gap-4 text-caption text-ink-800">
                    <span><strong>Submitted by:</strong> {request.submittedBy.name}</span>
                    <span><strong>Address:</strong> {request.submittedBy.address}</span>
                    <span><strong>Type:</strong> {request.projectType.replace('-', ' ')}</span>
                    {request.estimatedCost && (
                      <span><strong>Cost:</strong> ${request.estimatedCost.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>

            {/* Progress Indicators */}
            {request.neighborSignoffs && (
              <div className="mb-4 p-3 bg-neutral-50 rounded-ctl">
                <h4 className="text-body font-medium text-ink-900 mb-2">Neighbor Sign-offs</h4>
                <div className="space-y-1">
                  {request.neighborSignoffs.map((signoff, index) => (
                    <div key={index} className="flex items-center justify-between text-caption">
                      <span>{signoff.address} - {signoff.name}</span>
                      <span className={`px-2 py-1 rounded ${
                        signoff.status === 'approved' ? 'bg-green-100 text-green-800' :
                        signoff.status === 'objection' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {signoff.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Board Votes */}
            {request.boardVotes && request.boardVotes.length > 0 && (
              <div className="mb-4 p-3 bg-neutral-50 rounded-ctl">
                <h4 className="text-body font-medium text-ink-900 mb-2">Board Votes</h4>
                <div className="space-y-1">
                  {request.boardVotes.map((vote, index) => (
                    <div key={index} className="flex items-center justify-between text-caption">
                      <span>{vote.member}</span>
                      <span className={`px-2 py-1 rounded ${
                        vote.vote === 'approve' ? 'bg-green-100 text-green-800' :
                        vote.vote === 'deny' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vote.vote}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Link href={`/dashboard/arc/${request.id}`}>
                  <Button variant="ghost" size="sm">View Details</Button>
                </Link>
                {hasPermission('canReviewARCRequests') && (
                  <>
                    {request.status === 'submitted' && (
                      <Button variant="primary" size="sm">Start Review</Button>
                    )}
                    {request.status === 'under-review' && (
                      <Button variant="secondary" size="sm">Continue Review</Button>
                    )}
                    {request.status === 'board-voting' && (
                      <Button variant="primary" size="sm">Cast Vote</Button>
                    )}
                    {request.status === 'neighbor-signoff' && (
                      <Button variant="secondary" size="sm">Send Reminders</Button>
                    )}
                  </>
                )}
              </div>
              
              {/* Priority/Urgency Indicator */}
              <div className="flex items-center gap-2">
                {request.status === 'neighbor-signoff' && 
                 request.neighborSignoffs?.some(n => n.status === 'pending') && (
                  <span className="text-caption bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
                    Waiting on neighbors
                  </span>
                )}
                {request.status === 'board-voting' && (
                  <span className="text-caption bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">
                    Board action needed
                  </span>
                )}
                {request.submittedAt < new Date('2024-02-01') && 
                 !['approved', 'denied', 'completed'].includes(request.status) && (
                  <span className="text-caption bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      ) : (
        // Homeowner View - Clean Active Request Focus
        <div className="space-y-6">
          {/* Active Request Section */}
          {SAMPLE_ARC_REQUESTS.filter(r => r.submittedBy.name === 'Sarah Johnson').length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-h3 font-semibold text-ink-900">Active Request</h2>
              {SAMPLE_ARC_REQUESTS.filter(r => r.submittedBy.name === 'Sarah Johnson').map((request) => (
                <div key={request.id} className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
                  {/* Request Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="text-h3 font-medium text-ink-900">{request.title}</h3>
                      </div>
                      <p className="text-body text-ink-700 mb-3">{request.description}</p>
                      <div className="flex items-center gap-4 text-caption text-ink-800">
                        <span><strong>Type:</strong> {request.projectType.replace('-', ' ')}</span>
                        <span><strong>Submitted:</strong> {request.submittedAt.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                  </div>


                  {/* Horizontal Progress Timeline */}
                  <div className="mb-6">
                    <h4 className="text-body font-medium text-ink-900 mb-4">Progress Timeline</h4>
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute top-6 left-6 right-6 h-0.5 bg-neutral-200">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-green-600 transition-all duration-500"
                          style={{
                            width: request.status === 'submitted' ? '25%' :
                                   request.status === 'neighbor-signoff' ? '25%' :
                                   ['under-review'].includes(request.status) ? '50%' :
                                   request.status === 'board-voting' ? '75%' :
                                   request.status === 'approved' ? '75%' :
                                   request.status === 'inspection-required' ? '100%' :
                                   request.status === 'completed' ? '100%' : '0%'
                          }}
                        />
                      </div>
                      
                      {/* Timeline Steps */}
                      <div className="grid grid-cols-5 gap-3">
                        {/* Step 1: Submitted */}
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 relative z-10 border-4 border-white shadow-sm">
                            <Upload className="text-blue-600" size={20} />
                          </div>
                          <div className="text-center">
                            <p className="text-caption font-medium text-ink-900">Submitted</p>
                            <p className="text-xs text-ink-700">{request.submittedAt.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}</p>
                          </div>
                        </div>

                        {/* Step 2: HOA Review */}
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 relative z-10 border-4 border-white shadow-sm ${
                            ['under-review', 'board-voting', 'approved', 'inspection-required', 'completed'].includes(request.status) 
                              ? 'bg-green-100' : request.status === 'neighbor-signoff' ? 'bg-yellow-100' : 'bg-neutral-100'
                          }`}>
                            {['under-review', 'board-voting', 'approved', 'inspection-required', 'completed'].includes(request.status) ? (
                              <CheckCircle className="text-green-600" size={20} />
                            ) : request.status === 'neighbor-signoff' ? (
                              <Clock className="text-yellow-600" size={20} />
                            ) : (
                              <Eye className="text-neutral-400" size={20} />
                            )}
                          </div>
                          <div className="text-center">
                            <p className={`text-caption font-medium ${
                              ['under-review', 'board-voting', 'approved', 'inspection-required', 'completed'].includes(request.status) || request.status === 'neighbor-signoff'
                                ? 'text-ink-900' : 'text-neutral-400'
                            }`}>HOA/ARC Review</p>
                            <p className={`text-xs ${
                              ['under-review', 'board-voting', 'approved', 'inspection-required', 'completed'].includes(request.status) || request.status === 'neighbor-signoff'
                                ? 'text-ink-700' : 'text-neutral-400'
                            }`}>
                              {['under-review', 'board-voting', 'approved', 'inspection-required', 'completed'].includes(request.status) 
                                ? 'Complete' : request.status === 'neighbor-signoff' ? 'In Progress' : 'Pending'}
                            </p>
                          </div>
                        </div>

                        {/* Step 3: Board Voting */}
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 relative z-10 border-4 border-white shadow-sm ${
                            ['approved', 'inspection-required', 'completed'].includes(request.status) ? 'bg-green-100' :
                            request.status === 'board-voting' ? 'bg-blue-100' : 'bg-neutral-100'
                          }`}>
                            {['approved', 'inspection-required', 'completed'].includes(request.status) ? (
                              <CheckCircle className="text-green-600" size={20} />
                            ) : request.status === 'board-voting' ? (
                              <Clock className="text-blue-600" size={20} />
                            ) : (
                              <Vote className="text-neutral-400" size={20} />
                            )}
                          </div>
                          <div className="text-center">
                            <p className={`text-caption font-medium ${
                              ['approved', 'inspection-required', 'completed', 'board-voting'].includes(request.status) || 
                              ['under-review', 'neighbor-signoff'].includes(request.status)
                                ? 'text-ink-900' : 'text-neutral-400'
                            }`}>Board Vote</p>
                            <p className={`text-xs ${
                              ['approved', 'inspection-required', 'completed', 'board-voting'].includes(request.status) ||
                              ['under-review', 'neighbor-signoff'].includes(request.status)
                                ? 'text-ink-700' : 'text-neutral-400'
                            }`}>
                              {['approved', 'inspection-required', 'completed'].includes(request.status) ? 'Approved' :
                               request.status === 'board-voting' ? 'Voting' : 'Pending'}
                            </p>
                          </div>
                        </div>

                        {/* Step 4: Inspection */}
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 relative z-10 border-4 border-white shadow-sm ${
                            request.status === 'completed' ? 'bg-green-100' :
                            request.status === 'inspection-required' ? 'bg-orange-100' : 'bg-neutral-100'
                          }`}>
                            {request.status === 'completed' ? (
                              <CheckCircle className="text-green-600" size={20} />
                            ) : request.status === 'inspection-required' ? (
                              <Clock className="text-orange-600" size={20} />
                            ) : (
                              <ClipboardCheck className="text-neutral-400" size={20} />
                            )}
                          </div>
                          <div className="text-center">
                            <p className={`text-caption font-medium ${
                              ['completed', 'inspection-required'].includes(request.status) || 
                              ['approved', 'board-voting', 'under-review', 'neighbor-signoff'].includes(request.status)
                                ? 'text-ink-900' : 'text-neutral-400'
                            }`}>Inspection</p>
                            <p className={`text-xs ${
                              ['completed', 'inspection-required'].includes(request.status) ||
                              ['approved', 'board-voting', 'under-review', 'neighbor-signoff'].includes(request.status)
                                ? 'text-ink-700' : 'text-neutral-400'
                            }`}>
                              {request.status === 'completed' ? 'Passed' :
                               request.status === 'inspection-required' ? 'Scheduled' : 'Pending'}
                            </p>
                          </div>
                        </div>

                        {/* Step 5: Complete */}
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 relative z-10 border-4 border-white shadow-sm ${
                            request.status === 'completed' ? 'bg-green-100' : 'bg-neutral-100'
                          }`}>
                            {request.status === 'completed' ? (
                              <CheckCircle className="text-green-600" size={20} />
                            ) : (
                              <CheckCircle className="text-neutral-400" size={20} />
                            )}
                          </div>
                          <div className="text-center">
                            <p className={`text-caption font-medium ${
                              request.status === 'completed' || ['inspection-required', 'approved', 'board-voting', 'under-review', 'neighbor-signoff'].includes(request.status)
                                ? 'text-ink-900' : 'text-neutral-400'
                            }`}>Complete</p>
                            <p className={`text-xs ${
                              request.status === 'completed' || ['inspection-required', 'approved', 'board-voting', 'under-review', 'neighbor-signoff'].includes(request.status)
                                ? 'text-ink-700' : 'text-neutral-400'
                            }`}>
                              {request.status === 'completed' ? 'Done' : 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Communication & Activity Log */}
                  <div className="border-t border-neutral-200 pt-6">
                    <h4 className="text-body font-medium text-ink-900 mb-4 flex items-center gap-2">
                      <MessageSquare size={16} />
                      Communication & Activity Log
                    </h4>
                    
                    {/* Message Composition */}
                    <div className="mb-6 bg-white rounded-control border border-neutral-200 p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <label className="text-caption font-medium text-ink-900 min-w-0">To:</label>
                          <select className="flex-1 px-3 py-2 border border-neutral-300 rounded-control text-body">
                            <option value="hoa-manager">HOA Manager (Mike Thompson)</option>
                            <option value="board">Board Members</option>
                            <option value="arc-committee">ARC Committee</option>
                          </select>
                        </div>
                        <div>
                          <textarea
                            placeholder="Type your message here..."
                            rows={3}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-control text-body resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button size="sm" variant="primary">
                            <Send size={14} />
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Activity Log */}
                    <div className="space-y-2">
                      {/* Reply Sent Entry - Shows when homeowner has replied */}
                      {repliedMessages.has('mike-message-1') && (
                        <div className="flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-control">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Send className="text-green-600" size={12} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-caption font-medium text-ink-900">Reply Sent to Mike Thompson</p>
                                <p className="text-xs text-ink-600">by You</p>
                              </div>
                              <p className="text-xs text-ink-600">Just now</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Required: Neighbor Sign-off */}
                      <div 
                        className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-control cursor-pointer hover:bg-yellow-100 transition-colors"
                        onClick={() => scrollToSection('neighbor-signoffs')}
                      >
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="text-yellow-600" size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-caption font-medium text-ink-900">Action Required: Neighbor Sign-offs</p>
                              <p className="text-xs text-ink-600">by Mike Thompson</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-medium rounded">
                                Open
                              </span>
                              <p className="text-xs" style={{ color: '#434343' }}>Jan 30, 2:15 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message from HOA Manager */}
                      <div className={`rounded-control border overflow-hidden ${
                        repliedMessages.has('mike-message-1') 
                          ? 'border-neutral-200 bg-white' 
                          : 'border-yellow-200 bg-yellow-50'
                      }`}>
                        <div 
                          className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${
                            repliedMessages.has('mike-message-1') 
                              ? 'hover:bg-neutral-50' 
                              : 'hover:bg-yellow-100'
                          }`}
                          onClick={() => setExpandedMessage(expandedMessage === 'mike-message-1' ? null : 'mike-message-1')}
                        >
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="text-blue-600" size={10} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-caption font-medium text-ink-900">Message from Mike Thompson</p>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                  repliedMessages.has('mike-message-1') 
                                    ? 'bg-neutral-200 text-neutral-600' 
                                    : 'bg-yellow-600 text-white'
                                }`}>
                                  {repliedMessages.has('mike-message-1') ? 'Done' : 'Reply Required'}
                                </span>
                                <p className="text-xs" style={{ color: '#434343' }}>Jan 29, 10:30 AM</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {expandedMessage === 'mike-message-1' && (
                          <div className="px-3 pb-3 border-t border-neutral-100">
                            <div className="bg-neutral-50 rounded p-3 mt-3">
                              <p className="text-caption text-ink-800 mb-3">
                                Hi Sarah! I need clarification on your patio plans. Could you please confirm if the outdoor kitchen will include 
                                gas connections? This affects the permit requirements. Please reply with details so I can proceed with the review.
                              </p>
                              <div className="flex justify-end">
                                <Button 
                                  size="sm" 
                                  variant="primary"
                                  onClick={() => setShowReplyField(showReplyField === 'mike-message-1' ? null : 'mike-message-1')}
                                >
                                  <MessageSquare size={14} />
                                  Reply
                                </Button>
                              </div>
                            </div>
                            
                            {/* Reply Field */}
                            {showReplyField === 'mike-message-1' && (
                              <div className="mt-4 p-4 bg-white border border-neutral-200 rounded">
                                <h5 className="text-caption font-medium text-ink-900 mb-3">Reply to Mike Thompson</h5>
                                <div className="space-y-3">
                                  <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Type your reply here..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-control text-body resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                  />
                                  
                                  {/* File Attachment */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Button size="sm" variant="ghost" className="text-ink-700 hover:text-ink-900">
                                        <Upload size={12} />
                                        Attach File
                                      </Button>
                                      {replyAttachments.length > 0 && (
                                        <span className="text-xs text-ink-600">{replyAttachments.length} file(s) attached</span>
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => {
                                          setShowReplyField(null);
                                          setReplyMessage('');
                                          setReplyAttachments([]);
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="primary"
                                        onClick={() => sendReply('mike-message-1')}
                                      >
                                        <Send size={14} />
                                        Send Reply
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status Update: Under Review */}
                      <div className="flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-control hover:bg-neutral-50 transition-colors">
                        <div className="w-5 h-5 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Info className="text-neutral-600" size={10} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-caption font-medium text-ink-900">Status Update: Under Review</p>
                              <p className="text-xs text-ink-600">by Mike Thompson</p>
                            </div>
                            <p className="text-xs" style={{ color: '#434343' }}>Jan 29, 8:45 AM</p>
                          </div>
                        </div>
                      </div>

                      {/* ARC Request Submitted */}
                      <div className="flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-control hover:bg-neutral-50 transition-colors">
                        <div className="w-5 h-5 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Info className="text-neutral-600" size={10} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-caption font-medium text-ink-900">ARC Request Submitted</p>
                              <p className="text-xs text-ink-600">by You</p>
                            </div>
                            <p className="text-xs text-ink-600">{request.submittedAt.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}, 3:22 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CC&R, Bylaws, and Rules Section */}
                  <div className="border-t-2 border-neutral-300 mt-8 pt-8" id="ccr-rules">
                    <div className="flex items-center gap-3 mb-6">
                      <h4 className="text-h4 font-semibold text-ink-900 flex items-center gap-2">
                        <FileText size={18} />
                        CC&R, Bylaws & Rules
                      </h4>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                        AI Powered - Simulator
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {/* CC&R Reference - Action Required */}
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-control">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="text-yellow-600" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-caption font-medium text-ink-900">CC&R Section 4.2: Structural Modifications</p>
                            <Button size="sm" variant="primary">
                              <Eye size={14} />
                              Review
                            </Button>
                          </div>
                          <p className="text-xs text-ink-700">
                            <strong>Manager Note:</strong> &quot;Please review the outdoor kitchen requirements in Section 4.2.3&quot;
                          </p>
                          <p className="text-xs text-ink-600">Attached by Mike Thompson - Jan 29, 2024</p>
                        </div>
                      </div>

                      {/* Bylaws Reference - Informational */}
                      <div className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-control">
                        <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="text-neutral-600" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-caption font-medium text-ink-900">Community Bylaws: Article 7 - Architectural Standards</p>
                            <span className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs font-medium rounded">
                              Reference
                            </span>
                          </div>
                          <p className="text-xs text-ink-700">
                            <strong>Manager Note:</strong> &quot;For your reference - general guidelines for outdoor structures&quot;
                          </p>
                          <p className="text-xs text-ink-600">Attached by Mike Thompson - Jan 29, 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Forms and Documents Section */}
                  <div className="border-t-2 border-neutral-300 mt-8 pt-8" id="forms-documents">
                    <h4 className="text-h4 font-semibold text-ink-900 mb-6 flex items-center gap-2">
                      <FileCheck size={18} />
                      Forms and Documents
                    </h4>
                    
                    <div className="space-y-3">
                      {/* Sample Form from HOA Manager - Action Required */}
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-control">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="text-yellow-600" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-caption font-medium text-ink-900">Contractor Insurance Verification Form</p>
                            <Button size="sm" variant="primary">
                              <Eye size={14} />
                              View & Sign
                            </Button>
                          </div>
                          <p className="text-xs text-ink-700">Required by HOA Manager - Due by Feb 5, 2024</p>
                        </div>
                      </div>

                      {/* Uploaded Documents - No Action Required */}
                      <div className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-control">
                        <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="text-neutral-600" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-caption font-medium text-ink-900">Patio Construction Plans.pdf</p>
                            <span className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs font-medium rounded">
                              Submitted
                            </span>
                          </div>
                          <p className="text-xs text-ink-700">Uploaded Jan 28, 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Neighbor Sign-Offs Section */}
                  <div className="border-t-2 border-neutral-300 mt-8 pt-8" id="neighbor-signoffs">
                    <h4 className="text-h4 font-semibold text-ink-900 mb-6 flex items-center gap-2">
                      <UserCheck size={18} />
                      Neighbor Sign-Offs
                    </h4>
                    
                    <div className="space-y-3">
                      {/* Neighbor 1 - Approved (No Action Required) */}
                      <div className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-control">
                        <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="text-neutral-600" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-caption font-medium text-ink-900">1421 Oceanview Drive - Robert Chen</p>
                            <span className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs font-medium rounded">
                              Approved
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: '#434343' }}>Signed off on Jan 30, 2024 at 9:15 AM</p>
                        </div>
                      </div>

                      {/* Neighbor 2 - Pending (Action Required) */}
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-control">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="text-yellow-600" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-caption font-medium text-ink-900">1425 Oceanview Drive - Maria Santos</p>
                            <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-medium rounded">
                              Pending
                            </span>
                          </div>
                          <p className="text-xs text-ink-700">Notification sent Jan 30, 2024 - Reminder sent yesterday</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Active Requests State
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-neutral-400" size={24} />
              </div>
              <h3 className="text-h4 font-medium text-ink-900 mb-2">No Active Requests</h3>
              <p className="text-body text-ink-700 mb-4">You don&apos;t have any ARC requests in progress.</p>
              <Button variant="primary" onClick={openNewRequestModal}>
                <Plus size={16} />
                Submit Your First Request
              </Button>
            </div>
          )}
        </div>
      )}

      {/* New ARC Request Modal */}
      <StepModal
        isOpen={showNewRequestModal}
        onClose={() => setShowNewRequestModal(false)}
        title="Submit New ARC Request"
        currentStep={currentModalStep}
        totalSteps={4}
        onNext={nextStep}
        onPrevious={previousStep}
        onFinish={submitRequest}
        canProceed={
          currentModalStep === 1 ? !!selectedProjectType :
          currentModalStep === 2 ? !!(requestForm.title && requestForm.description) :
          true
        }
      >
        {currentModalStep === 1 && (
          <div className="space-y-4">
            <h4 className="text-body font-medium text-ink-900 mb-4">What type of request are you submitting?</h4>
            
            <div className="grid grid-cols-1 gap-3">
              {PROJECT_TYPES.map((type) => (
                <label key={type.value} className={`flex items-center gap-4 p-4 border-2 rounded-control cursor-pointer transition-all hover:border-primary/40 ${
                  selectedProjectType === type.value ? 'border-primary bg-primary/5' : 'border-neutral-200'
                }`}>
                  <input
                    type="radio"
                    name="projectType"
                    value={type.value}
                    checked={selectedProjectType === type.value}
                    onChange={(e) => setSelectedProjectType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <HomeIcon size={20} className="text-ink-700" />
                    <div>
                      <p className="text-body font-medium text-ink-900">{type.label}</p>
                      <p className="text-caption text-ink-700">
                        {type.value === 'landscaping' && 'Plants, trees, hardscaping, irrigation'}
                        {type.value === 'exterior-modification' && 'Paint, siding, doors, windows, roofing'}
                        {type.value === 'addition' && 'Additions, structures, major modifications'}
                        {type.value === 'adu-jadu' && 'Accessory Dwelling Units and Junior ADUs'}
                        {type.value === 'paint' && 'Color changes and paint updates'}
                        {type.value === 'fence' && 'Fencing, gates, and barriers'}
                        {type.value === 'other' && 'Other architectural modifications'}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentModalStep === 2 && (
          <div className="space-y-4">
            {/* AI Auto-fill Button */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={autoFillRequest}
                className="text-primary hover:text-primary-700 border border-primary/20 hover:border-primary/40"
              >
                <Zap size={14} />
                AI Auto-Fill (Demo)
              </Button>
              {hasAutoFilled && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="text-ink-700 hover:text-ink-900 text-sm underline"
                >
                  Clear
                </button>
              )}
            </div>

            <Input
              label="Request Title"
              value={requestForm.title}
              onChange={(e) => setRequestForm({...requestForm, title: e.target.value})}
              placeholder={getPlaceholders().title}
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Project Description</label>
              <textarea
                value={requestForm.description}
                onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                placeholder={getPlaceholders().description}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md resize-y min-h-[100px]"
                rows={4}
              />
            </div>

          </div>
        )}

        {currentModalStep === 3 && (
          <div className="space-y-4">
            <h4 className="text-body font-medium text-ink-900 mb-4">Upload Project Documents (Optional)</h4>
            
            <div className="border-2 border-dashed border-neutral-300 rounded-control p-8 text-center">
              <Upload className="mx-auto text-ink-400 mb-4" size={32} />
              <p className="text-body text-ink-900 mb-2">Upload photos, plans, or documents</p>
              <p className="text-caption text-ink-700 mb-4">Drag and drop files here, or click to browse</p>
              <Button variant="secondary" size="sm">
                <Upload size={16} />
                Choose Files
              </Button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-body font-medium text-ink-900">Uploaded Files:</h5>
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                    <span className="text-body text-ink-900">{file}</span>
                    <button
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentModalStep === 4 && (
          <div className="space-y-4">
            <h4 className="text-body font-medium text-ink-900 mb-4">What Happens Next?</h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-control">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h5 className="text-body font-medium text-ink-900 mb-1">HOA Manager / ARC Committee Review</h5>
                  <p className="text-caption text-ink-800">
                    Your request will be reviewed for CC&R compliance. The manager will notify you of any requirements, including neighbor signatures if needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-control">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h5 className="text-body font-medium text-ink-900 mb-1">Board Voting</h5>
                  <p className="text-caption text-ink-800">
                    If approved by management, your request goes to the HOA Board for final voting and approval.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-control">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h5 className="text-body font-medium text-ink-900 mb-1">Project & Inspection</h5>
                  <p className="text-caption text-ink-800">
                    Once approved, you can begin your project. A final inspection may be required upon completion.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-control p-4 mt-6">
              <p className="text-body text-ink-900 font-medium mb-3">Ready to Submit!</p>
              
              <div className="space-y-3">
                <p className="text-caption text-ink-700 mb-2">Stay updated on your request:</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-border"
                    />
                    <Mail size={16} className="text-blue-600" />
                    <span className="text-body text-ink-900">Email notifications</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-border"
                    />
                    <MessageSquare size={16} className="text-green-600" />
                    <span className="text-body text-ink-900">SMS notifications</span>
                  </label>
                </div>
                <p className="text-caption text-ink-600">
                  You can update these preferences later from your request dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
      </StepModal>
    </div>
  );
}
