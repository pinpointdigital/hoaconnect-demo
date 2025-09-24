'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MessageSquare, FileText, Users, Vote, Eye, Scale, CheckSquare, Save, Bot, ThumbsUp, Clock, CheckCircle, XCircle, FileSearch, Trash2, AlertTriangle, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface RequestDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { currentRole, hasPermission, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('communication');
  const [paramId, setParamId] = useState<string>('');
  const [animateVoteCount, setAnimateVoteCount] = useState(false);
  const [message, setMessage] = useState('');
  const [messageRecipient, setMessageRecipient] = useState('homeowner');
  const [messageFilter, setMessageFilter] = useState('all');
  const [messageOrder, setMessageOrder] = useState<'newest' | 'oldest'>('newest');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [hasUnsavedFormChanges, setHasUnsavedFormChanges] = useState(false);
  const [pendingRemovals, setPendingRemovals] = useState<string[]>([]);
  const [selectedCCRRules, setSelectedCCRRules] = useState<string[]>([]);
  const [ccrRuleNotes, setCCRRuleNotes] = useState<{[key: string]: string}>({});
  const [hasUnsavedCCRChanges, setHasUnsavedCCRChanges] = useState(false);
  const [showAITrainingModal, setShowAITrainingModal] = useState(false);
  const [aiTrainingRule, setAITrainingRule] = useState<any>(null);
  const [aiTrainingFeedback, setAITrainingFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [aiTrainingComment, setAITrainingComment] = useState('');
  const [hasUnsavedNeighborChanges, setHasUnsavedNeighborChanges] = useState(false);
  const [showUpdateNeighborModal, setShowUpdateNeighborModal] = useState(false);
  const [updateNeighborPosition, setUpdateNeighborPosition] = useState<{position: string, location: string} | null>(null);
  const [neighborSearchTerm, setNeighborSearchTerm] = useState('');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [inspectionPhotos, setInspectionPhotos] = useState<File[]>([]);
  const [showInspectionSignatureModal, setShowInspectionSignatureModal] = useState(false);
  const [pendingInspectionAction, setPendingInspectionAction] = useState<{action: string, status: string} | null>(null);
  const [digitalSignature, setDigitalSignature] = useState('');

  // Resolve params in useEffect (Next.js 15 requirement)
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setParamId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Load request data from localStorage
  useEffect(() => {
    if (!paramId) return;
    
    const loadRequest = () => {
      if (typeof window === 'undefined') return;
      
      try {
        const stored = localStorage.getItem('hoa-connect-arc-requests');
        if (stored) {
          const requests = JSON.parse(stored);
          const foundRequest = requests.find((r: any) => r.id === paramId);
            if (foundRequest) {
              // Parse dates back from strings
              foundRequest.submittedAt = new Date(foundRequest.submittedAt);
              foundRequest.desiredStartDate = new Date(foundRequest.desiredStartDate);
              if (foundRequest.conversations) {
                foundRequest.conversations.forEach((conv: any) => {
                  conv.timestamp = new Date(conv.timestamp);
                });
              }
              // Parse neighbor notification dates
              if (foundRequest.neighborPositions) {
                foundRequest.neighborPositions.forEach((pos: any) => {
                  if (pos.assignedNeighbor && pos.assignedNeighbor.notifiedAt) {
                    pos.assignedNeighbor.notifiedAt = new Date(pos.assignedNeighbor.notifiedAt);
                  }
                  if (pos.assignedNeighbor && pos.assignedNeighbor.signedAt) {
                    pos.assignedNeighbor.signedAt = new Date(pos.assignedNeighbor.signedAt);
                  }
                });
              }
              // Parse form assignment dates
              if (foundRequest.formAssignments) {
                foundRequest.formAssignments.forEach((assignment: any) => {
                  assignment.assignedAt = new Date(assignment.assignedAt);
                });
              }
              // Parse CC&R attachment dates
              if (foundRequest.ccrAttachments) {
                foundRequest.ccrAttachments.forEach((attachment: any) => {
                  attachment.attachedAt = new Date(attachment.attachedAt);
                });
              }
              setCurrentRequest(foundRequest);
            }
        }
      } catch (error) {
        console.error('Error loading request:', error);
      }
    };

    loadRequest();
    
    // Listen for localStorage changes
    const handleStorageChange = () => loadRequest();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [paramId]);

  // Helper functions for date formatting
  const formatDate = (date: Date) => {
    if (typeof window === 'undefined') {
      return date.toISOString().split('T')[0];
    }
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    if (typeof window === 'undefined') {
      return '12:00 PM';
    }
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return timeStr.replace(/(\d+:\d+:\d+\s*(AM|PM))\d*/, '$1');
  };

  const formatDateTime = (date: Date) => {
    return `${formatDate(date)}, ${formatTime(date)}`;
  };

  // Trigger vote count animation when board tab is viewed
  useEffect(() => {
    if (activeTab === 'board') {
      setAnimateVoteCount(true);
      const timer = setTimeout(() => setAnimateVoteCount(false), 600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [activeTab]);

  // Sample board members and voting data
  const getBoardMembers = () => [
    { id: 'board-1', name: 'Robert Chen', title: 'President', vote: 'approved', votedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'board-2', name: 'Maria Santos', title: 'Vice President', vote: 'approved', votedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { id: 'board-3', name: 'Tom Anderson', title: 'Treasurer', vote: null, votedAt: null },
    { id: 'board-4', name: 'Jennifer Walsh', title: 'Secretary', vote: 'approved', votedAt: new Date(Date.now() - 30 * 60 * 1000) },
    { id: 'board-5', name: 'David Martinez', title: 'Member', vote: null, votedAt: null }
  ];

  const getVotingStats = () => {
    const members = getBoardMembers();
    const totalMembers = members.length;
    const votedMembers = members.filter(m => m.vote !== null).length;
    const approvedVotes = members.filter(m => m.vote === 'approved').length;
    const deniedVotes = members.filter(m => m.vote === 'denied').length;
    const remainingVotes = totalMembers - votedMembers;
    const majorityNeeded = Math.ceil(totalMembers / 2);
    
    return {
      totalMembers,
      votedMembers,
      approvedVotes,
      deniedVotes,
      remainingVotes,
      majorityNeeded,
      hasApprovalMajority: approvedVotes >= majorityNeeded,
      hasDenialMajority: deniedVotes >= majorityNeeded
    };
  };

  // Forms library data
  const ARC_FORMS_LIBRARY = [
    {
      id: 'form-1',
      name: 'Property Modification Agreement',
      description: 'Required signature form for all exterior modifications',
      category: 'Required Forms',
      requiresSignature: true
    },
    {
      id: 'form-2', 
      name: 'Architectural Guidelines',
      description: 'Community architectural standards and requirements',
      category: 'Reference Documents',
      requiresSignature: false
    },
    {
      id: 'form-3',
      name: 'Contractor Insurance Requirements',
      description: 'Insurance and bonding requirements for contractors',
      category: 'Required Forms',
      requiresSignature: true
    },
    {
      id: 'form-4',
      name: 'Color Palette Guidelines',
      description: 'Approved exterior color options',
      category: 'Reference Documents', 
      requiresSignature: false
    },
    {
      id: 'form-5',
      name: 'Construction Timeline Form',
      description: 'Project schedule and milestone documentation',
      category: 'Optional Forms',
      requiresSignature: false
    }
  ];

  // CC&R AI Recommendations based on project type
  const getCCRRecommendations = () => {
    const recommendations = [
      {
        id: 'ccr-1',
        title: 'Exterior Modifications',
        section: 'Article IV, Section 4.2',
        excerpt: 'No exterior modifications, alterations, or improvements shall be made to any dwelling unit without prior written approval of the Architectural Review Committee.',
        explanation: 'Since this is an exterior addition/modification, you must get ARC approval before starting construction. This rule ensures all changes maintain community standards.',
        confidence: 94,
        projectTypes: ['exterior-modification', 'addition', 'fence']
      },
      {
        id: 'ccr-2',
        title: 'Construction Standards',
        section: 'Article V, Section 5.1', 
        excerpt: 'All construction must comply with applicable building codes and homeowner association architectural guidelines.',
        explanation: 'Construction must meet both local building codes and HOA standards. This ensures safety and aesthetic consistency throughout the community.',
        confidence: 87,
        projectTypes: ['exterior-modification', 'addition', 'adu-jadu']
      },
      {
        id: 'ccr-3',
        title: 'Landscaping Requirements',
        section: 'Article VI, Section 6.3',
        excerpt: 'Landscaping modifications must maintain the aesthetic character of the community and use drought-resistant plants where possible.',
        explanation: 'Landscaping changes should complement the neighborhood design and support water conservation efforts.',
        confidence: 78,
        projectTypes: ['landscaping']
      },
      {
        id: 'ccr-4',
        title: 'Paint and Color Standards',
        section: 'Article IV, Section 4.5',
        excerpt: 'Exterior paint colors must be selected from the approved color palette maintained by the Architectural Review Committee.',
        explanation: 'Color consistency maintains property values and community aesthetic appeal.',
        confidence: 91,
        projectTypes: ['paint', 'exterior-modification']
      }
    ];

    // Filter by project type
    return recommendations.filter(rec => 
      rec.projectTypes.includes(request.projectType || 'other')
    );
  };

  // CC&R management functions
  const handleCCRRuleSelection = (ruleId: string) => {
    setSelectedCCRRules(prev => {
      const newSelection = prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId];
      setHasUnsavedCCRChanges(true);
      return newSelection;
    });
  };

  const handleCCRRuleNotes = (ruleId: string, notes: string) => {
    setCCRRuleNotes(prev => ({
      ...prev,
      [ruleId]: notes
    }));
    setHasUnsavedCCRChanges(true);
  };

  const saveCCRAttachments = () => {
    if (typeof window === 'undefined' || !currentRequest) return;

    try {
      const stored = localStorage.getItem('hoa-connect-arc-requests');
      if (!stored) return;

      const requests = JSON.parse(stored);
      const updatedRequests = requests.map((req: any) => {
        if (req.id === paramId) {
          const now = new Date();
          
          // Add new CC&R attachments
          const newAttachments = selectedCCRRules.map(ruleId => {
            const rule = getCCRRecommendations().find(r => r.id === ruleId);
            return {
              id: `ccr-${Date.now()}-${ruleId}`,
              ruleId,
              title: rule?.title || 'Unknown Rule',
              section: rule?.section || '',
              excerpt: rule?.excerpt || '',
              explanation: rule?.explanation || '',
              managerNotes: ccrRuleNotes[ruleId] || '',
              requiresCompliance: !!(ccrRuleNotes[ruleId] && ccrRuleNotes[ruleId].trim()),
              attachedAt: now,
              attachedBy: userProfile?.name || 'HOA Manager'
            };
          });

          // Remove pending removals
          const filteredAttachments = (req.ccrAttachments || []).filter(
            (attachment: any) => !pendingRemovals.includes(attachment.id)
          );

          return {
            ...req,
            ccrAttachments: [...filteredAttachments, ...newAttachments]
          };
        }
        return req;
      });

      localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));
      window.dispatchEvent(new Event('storage'));
      
      setSelectedCCRRules([]);
      setCCRRuleNotes({});
      setPendingRemovals([]);
      setHasUnsavedCCRChanges(false);
    } catch (error) {
      console.error('Error saving CC&R attachments:', error);
    }
  };

  const openAITrainingModal = (rule: any) => {
    setAITrainingRule(rule);
    setShowAITrainingModal(true);
    setAITrainingFeedback(null);
    setAITrainingComment('');
  };

  const submitAITraining = () => {
    // In a real app, this would send feedback to the AI training system
    console.log('AI Training Feedback:', {
      ruleId: aiTrainingRule?.id,
      feedback: aiTrainingFeedback,
      comment: aiTrainingComment
    });
    
    setShowAITrainingModal(false);
    setAITrainingRule(null);
    setAITrainingFeedback(null);
    setAITrainingComment('');
  };

  const cancelAITraining = () => {
    setShowAITrainingModal(false);
    setAITrainingRule(null);
    setAITrainingFeedback(null);
    setAITrainingComment('');
  };

  // Sample neighbor data
  const COMMUNITY_MEMBERS = [
    { id: 'neighbor-1', name: 'Mike Thompson', address: '1245 Oak Street', phone: '(555) 234-5678' },
    { id: 'neighbor-2', name: 'Lisa Chen', address: '1249 Oak Street', phone: '(555) 345-6789' },
    { id: 'neighbor-3', name: 'David Rodriguez', address: '1241 Oak Street', phone: '(555) 456-7890' },
    { id: 'neighbor-4', name: 'Sarah Williams', address: '1253 Oak Street', phone: '(555) 567-8901' },
    { id: 'neighbor-5', name: 'Tom Anderson', address: '1237 Oak Street', phone: '(555) 678-9012' }
  ];

  // Neighbor management functions
  const updateNeighborPositions = (positions: string[]) => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('hoa-connect-arc-requests');
      if (!stored) return;

      const requests = JSON.parse(stored);
      const updatedRequests = requests.map((req: any) => {
        if (req.id === paramId) {
          // Preserve existing neighbor assignments while updating requirements
          const existingPositions = req.neighborPositions || [];
          const newPositions = [
            'left', 'right', 'front-left', 'front-right', 'back'
          ].map(position => {
            const existing = existingPositions.find((pos: any) => pos.position === position);
            return {
              position,
              required: positions.includes(position),
              assignedNeighbor: existing?.assignedNeighbor || null,
              hasNoNeighbor: existing?.hasNoNeighbor || false
            };
          });

          return {
            ...req,
            neighborPositions: newPositions
          };
        }
        return req;
      });

      localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));
      window.dispatchEvent(new Event('storage'));
      setHasUnsavedNeighborChanges(true);
    } catch (error) {
      console.error('Error updating neighbor positions:', error);
    }
  };

  const assignNeighborToPosition = (position: string, neighbor: any) => {
    if (typeof window === 'undefined' || !currentRequest) return;

    try {
      const stored = localStorage.getItem('hoa-connect-arc-requests');
      if (!stored) return;

      const requests = JSON.parse(stored);
      const updatedRequests = requests.map((req: any) => {
        if (req.id === paramId) {
          // Initialize neighborPositions if it doesn't exist
          const existingPositions = req.neighborPositions || [];
          
          // Find or create the position
          let updatedPositions = [...existingPositions];
          const existingPositionIndex = updatedPositions.findIndex((pos: any) => pos.position === position);
          
          if (existingPositionIndex >= 0) {
            // Update existing position
            updatedPositions[existingPositionIndex] = {
              ...updatedPositions[existingPositionIndex],
              assignedNeighbor: neighbor ? {
                ...neighbor,
                status: 'pending',
                notifiedAt: new Date(),
                location: getPositionLabel(position)
              } : null,
              hasNoNeighbor: neighbor === null,
              required: true // Ensure it's marked as required when assigning
            };
          } else {
            // Create new position
            updatedPositions.push({
              position,
              required: true,
              assignedNeighbor: neighbor ? {
                ...neighbor,
                status: 'pending', 
                notifiedAt: new Date(),
                location: getPositionLabel(position)
              } : null,
              hasNoNeighbor: neighbor === null
            });
          }

          return {
            ...req,
            neighborPositions: updatedPositions
          };
        }
        return req;
      });

      localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));
      window.dispatchEvent(new Event('storage'));
      setHasUnsavedNeighborChanges(true);
    } catch (error) {
      console.error('Error assigning neighbor:', error);
    }
  };

  const getPositionLabel = (position: string) => {
    const labels: {[key: string]: string} = {
      'left': 'Left Neighbor',
      'right': 'Right Neighbor', 
      'front-left': 'Front Left Neighbor',
      'front-right': 'Front Right Neighbor',
      'back': 'Behind Neighbor'
    };
    return labels[position] || position;
  };

  const saveNeighborChanges = () => {
    setHasUnsavedNeighborChanges(false);
    // Changes are already saved to localStorage in real-time
  };

  // Initialize neighbor positions if they don't exist
  const initializeNeighborPositions = () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('hoa-connect-arc-requests');
      if (!stored) return;

      const requests = JSON.parse(stored);
      const foundRequest = requests.find((r: any) => r.id === paramId);
      
      if (foundRequest && !foundRequest.neighborPositions) {
        const updatedRequests = requests.map((req: any) => {
          if (req.id === paramId) {
            return {
              ...req,
              neighborPositions: [
                { position: 'left', required: false, assignedNeighbor: null, hasNoNeighbor: false },
                { position: 'right', required: false, assignedNeighbor: null, hasNoNeighbor: false },
                { position: 'front-left', required: false, assignedNeighbor: null, hasNoNeighbor: false },
                { position: 'front-right', required: false, assignedNeighbor: null, hasNoNeighbor: false },
                { position: 'back', required: false, assignedNeighbor: null, hasNoNeighbor: false }
              ]
            };
          }
          return req;
        });

        localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error initializing neighbor positions:', error);
    }
  };

  // Initialize neighbor positions when component loads
  useEffect(() => {
    if (paramId && currentRequest) {
      initializeNeighborPositions();
    }
  }, [paramId, currentRequest]);

  // Inspection management functions
  const handleInspectionPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setInspectionPhotos(Array.from(e.target.files));
    }
  };

  const removeInspectionPhoto = (index: number) => {
    setInspectionPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleInspectionDecision = (action: string, status: string) => {
    if (!inspectionNotes.trim()) {
      alert('Inspection notes are required before making a decision.');
      return;
    }
    
    setPendingInspectionAction({ action, status });
    setShowInspectionSignatureModal(true);
    setDigitalSignature('');
  };

  const processInspectionDecision = () => {
    if (!digitalSignature.trim()) return;
    
    // Validate digital signature
    const expectedName = userProfile?.name || '';
    if (digitalSignature.trim().toLowerCase() !== expectedName.toLowerCase()) {
      alert('Digital signature must match your full name exactly.');
      return;
    }

    if (!pendingInspectionAction || !currentRequest) return;

    // Update request status and add inspection data
    try {
      const stored = localStorage.getItem('hoa-connect-arc-requests');
      if (!stored) return;

      const requests = JSON.parse(stored);
      const updatedRequests = requests.map((req: any) => {
        if (req.id === paramId) {
          return {
            ...req,
            status: pendingInspectionAction.status,
            inspectionNotes,
            inspectionPhotos,
            inspectionCompletedAt: new Date(),
            inspectionCompletedBy: userProfile?.name || 'HOA Manager'
          };
        }
        return req;
      });

      localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));
      window.dispatchEvent(new Event('storage'));
      
      setShowInspectionSignatureModal(false);
      setPendingInspectionAction(null);
      setDigitalSignature('');
    } catch (error) {
      console.error('Error processing inspection decision:', error);
    }
  };

  const cancelInspectionDecision = () => {
    setShowInspectionSignatureModal(false);
    setPendingInspectionAction(null);
    setDigitalSignature('');
  };

  // Form management functions
  const handleFormSelection = (formId: string) => {
    setSelectedForms(prev => {
      const newSelection = prev.includes(formId) 
        ? prev.filter(id => id !== formId)
        : [...prev, formId];
      setHasUnsavedFormChanges(true);
      return newSelection;
    });
  };

  const saveFormAssignments = () => {
    if (typeof window === 'undefined' || !currentRequest) return;

    try {
      const stored = localStorage.getItem('hoa-connect-arc-requests');
      if (!stored) return;

      const requests = JSON.parse(stored);
      const updatedRequests = requests.map((req: any) => {
        if (req.id === paramId) {
          const now = new Date();
          
          // Add new form assignments
          const newAssignments = selectedForms.map(formId => {
            const form = ARC_FORMS_LIBRARY.find(f => f.id === formId);
            return {
              id: `assignment-${Date.now()}-${formId}`,
              formId,
              formName: form?.name || 'Unknown Form',
              formDescription: form?.description || '',
              requiresSignature: form?.requiresSignature || false,
              status: form?.requiresSignature ? 'signature-required' : 'reference',
              assignedAt: now,
              assignedBy: userProfile?.name || 'HOA Manager'
            };
          });

          // Remove pending removals
          const filteredAssignments = (req.formAssignments || []).filter(
            (assignment: any) => !pendingRemovals.includes(assignment.id)
          );

          return {
            ...req,
            formAssignments: [...filteredAssignments, ...newAssignments]
          };
        }
        return req;
      });

      localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));
      window.dispatchEvent(new Event('storage'));
      
      setSelectedForms([]);
      setPendingRemovals([]);
      setHasUnsavedFormChanges(false);
    } catch (error) {
      console.error('Error saving form assignments:', error);
    }
  };

  // Use loaded request data or fallback
  const request = currentRequest || {
    id: paramId,
    title: 'Loading...',
    description: 'Loading request details...',
    status: 'submitted' as const,
    submittedBy: {
      name: 'Loading...',
      address: 'Loading...',
      email: 'Loading...',
      phone: 'Loading...'
    },
    submittedAt: new Date(),
    projectType: 'exterior-modification',
    conversations: [],
    formAssignments: [],
    ccrAttachments: [],
    neighborPositions: []
  };

  const tabs = [
    { id: 'communication', label: 'Communication' },
    { id: 'forms', label: 'Forms & Documents' },
    { id: 'ccr', label: 'CC&R & Rules' },
    { id: 'neighbors', label: 'Neighbor Sign-offs' },
    { id: 'board', label: 'Board Review' },
    { id: 'inspection', label: 'Inspection' }
  ];

  if (!paramId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back to Requests Link */}
      <div className="mb-4">
        <Link href="/dashboard/arc-management" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors inline-flex items-center gap-1">
          <ArrowLeft size={14} />
          Back to Requests
        </Link>
      </div>

      {/* Request Header */}
      <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Owner Name - 3x size */}
            <h1 className="text-5xl font-bold text-ink-900 mb-2">{request.submittedBy.name}</h1>
            
            {/* Address Link */}
            <div className="mb-4">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(request.submittedBy.address)}&zoom=20`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-700 transition-colors text-body font-medium"
              >
                📍 {request.submittedBy.address}
              </a>
            </div>
            
            {/* Request Title - 2x size */}
            <h2 className="text-4xl font-semibold text-ink-900 mb-3">{request.title}</h2>
            
            {/* Request Description */}
            <p className="text-body text-ink-700 leading-relaxed">{request.description}</p>
          </div>
          
          {/* Status Badge */}
          <div className="ml-6 flex-shrink-0">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              request.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
              request.status === 'under-review' ? 'bg-yellow-100 text-yellow-700' :
              request.status === 'board-voting' ? 'bg-purple-100 text-purple-700' :
              request.status === 'approved' ? 'bg-green-100 text-green-700' :
              request.status === 'denied' ? 'bg-red-100 text-red-700' :
              request.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
              'bg-neutral-100 text-neutral-700'
            }`}>
              {request.status === 'submitted' ? 'Submitted' :
               request.status === 'under-review' ? 'Under Review' :
               request.status === 'board-voting' ? 'Board Voting' :
               request.status === 'approved' ? 'Approved' :
               request.status === 'denied' ? 'Denied' :
               request.status === 'completed' ? 'Completed' :
               'In Progress'}
            </span>
          </div>
        </div>
      </div>


      {/* Tabs */}
      <div className="bg-white rounded-card border border-ink-900/8">
        <div className="border-b border-ink-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-ink-600 hover:text-ink-900 hover:border-ink-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div className="space-y-6">
              {/* Send Message Section */}
              <div className="bg-white rounded-card border border-ink-900/8 p-6">
                <h3 className="text-h3 font-semibold text-ink-900 flex items-center gap-2 mb-4">
                  <MessageSquare size={24} />
                  Send Message
                </h3>
                
                <div className="space-y-4">
                  {/* Recipient Selection */}
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Send to:</label>
                    <select
                      value={messageRecipient}
                      onChange={(e) => setMessageRecipient(e.target.value)}
                      className="w-full px-3 py-2 border border-ink-200 rounded-control focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="homeowner">Homeowner</option>
                      <option value="board">Board Members</option>
                      <option value="neighbors">Affected Neighbors</option>
                      <option value="all">All Parties</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Message:</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          // Send message on Ctrl+Enter
                          e.preventDefault();
                          // Add send logic here
                        }
                      }}
                      placeholder="Type your message here... (Ctrl+Enter to send)"
                      className="w-full p-3 border border-ink-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  {/* Attachment and Send */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        id="message-attachments"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            setAttachments(Array.from(e.target.files));
                          }
                        }}
                      />
                      <label
                        htmlFor="message-attachments"
                        className="cursor-pointer inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        style={{ cursor: 'pointer' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
                        </svg>
                        Attach Files
                      </label>
                    </div>
                    <Button size="sm" disabled={!message.trim()}>
                      Send Message
                    </Button>
                  </div>

                  {/* Attachment Preview */}
                  {attachments.length > 0 && (
                    <div className="border-t border-ink-200 pt-3">
                      <p className="text-xs text-ink-600 mb-2">Attachments:</p>
                      <div className="space-y-1">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-xs text-ink-600">
                            <span>{file.name}</span>
                            <button
                              onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity & Communication Log */}
              <div className="bg-white rounded-card border border-ink-900/8 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-ink-900 flex items-center gap-2">
                    <MessageSquare size={24} />
                    Activity & Communication Log
                  </h3>
                  <div className="flex items-center gap-3">
                    <label className="text-caption text-ink-600">Filter by:</label>
                    <select
                      value={messageFilter}
                      onChange={(e) => setMessageFilter(e.target.value)}
                      className="px-3 py-1 border border-neutral-300 rounded-control text-caption focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="all">All Actions</option>
                      <option value="homeowner">Homeowner Actions</option>
                      <option value="manager">HOA Manager Actions</option>
                      <option value="system">System Actions</option>
                      <option value="board">Board Actions</option>
                      <option value="neighbor">Neighbor Actions</option>
                    </select>
                    <button
                      onClick={() => setMessageOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                      className="p-1 text-ink-500 hover:text-ink-700 transition-colors"
                      title={`Sort ${messageOrder === 'newest' ? 'oldest first' : 'newest first'}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M7 12h10m-7 6h4"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages/Activity Log */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {request.conversations && request.conversations.length > 0 ? (
                    request.conversations
                      .filter((conv: any) => {
                        if (messageFilter === 'all') return true;
                        return conv.type === messageFilter;
                      })
                      .sort((a: any, b: any) => {
                        const dateA = new Date(a.timestamp).getTime();
                        const dateB = new Date(b.timestamp).getTime();
                        return messageOrder === 'newest' ? dateB - dateA : dateA - dateB;
                      })
                      .map((conv: any) => (
                        <div key={conv.id} className="border-b border-ink-100 pb-4">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium text-blue-700">
                                {conv.author.name.split(' ').map((n: string) => n.charAt(0)).join('')}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-caption font-medium text-ink-900">{conv.author.name}</span>
                                <span className="text-xs text-ink-600">{formatDateTime(new Date(conv.timestamp))}</span>
                              </div>
                              <p className="text-body text-ink-800">{conv.content}</p>
                              {conv.attachments && conv.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {conv.attachments.map((attachment: any, index: number) => (
                                    <a
                                      key={index}
                                      href={attachment instanceof File ? URL.createObjectURL(attachment) : '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-700 hover:underline block"
                                    >
                                      📎 {attachment.name || 'Attachment'}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto text-ink-400 mb-4" size={48} />
                      <p className="text-body text-ink-600">No activity yet</p>
                      <p className="text-caption text-ink-500 mt-1">
                        Messages and status updates will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Forms & Documents Tab */}
          {activeTab === 'forms' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1 max-w-2xl">
                    <h4 className="text-h3 font-semibold text-ink-900 mb-2 flex items-center gap-2">
                      <FileText size={24} />
                      Forms & Documents
                    </h4>
                    {hasPermission('canReviewARCRequests') ? (
                      <p className="text-caption text-ink-600">
                        Attach forms and documents required for this ARC request. Homeowners will receive these in their dashboard.
                      </p>
                    ) : (
                      <p className="text-caption text-ink-600">
                        Forms and documents assigned to this ARC request by the HOA Manager.
                      </p>
                    )}
                  </div>
                  {hasPermission('canReviewARCRequests') && hasUnsavedFormChanges && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={saveFormAssignments}
                        className="inline-flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save Attachments
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* No forms message for Board Members */}
              {!hasPermission('canReviewARCRequests') && (!request.formAssignments || request.formAssignments.length === 0) && (
                <div className="text-center py-8">
                  <FileText className="mx-auto text-ink-400 mb-4" size={48} />
                  <p className="text-body text-ink-600">No forms or documents assigned to this request</p>
                </div>
              )}
              
              {/* Currently Attached Forms */}
              {request.formAssignments && request.formAssignments.length > 0 && (
                <div className="bg-white rounded-card border border-ink-900/8 p-6">
                  <h5 className="text-body font-semibold text-ink-900 border-b border-ink-200 pb-2 mb-4">
                    Currently Attached
                  </h5>
                  <div className="space-y-3">
                    {request.formAssignments.map((assignment: any) => (
                      <div key={assignment.id} className="flex items-start justify-between p-4 bg-neutral-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h6 className="text-body font-medium text-ink-900">{assignment.formName}</h6>
                            {assignment.requiresSignature && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                Signature Required
                              </span>
                            )}
                          </div>
                          <p className="text-caption text-ink-600 mb-2">{assignment.formDescription}</p>
                          <p className="text-xs text-ink-500">
                            Attached: {formatDate(new Date(assignment.assignedAt))} at {formatTime(new Date(assignment.assignedAt))} by {assignment.assignedBy}
                          </p>
                        </div>
                        {hasPermission('canReviewARCRequests') && (
                          <div className="flex flex-col items-center gap-1 min-w-[140px]">
                            {pendingRemovals.includes(assignment.id) ? (
                              <div className="text-center">
                                <span className="text-xs text-red-600 font-medium">Pending Removal</span>
                                <button
                                  onClick={() => {
                                    setPendingRemovals(prev => prev.filter(id => id !== assignment.id));
                                    setHasUnsavedFormChanges(prev => pendingRemovals.length > 1 || selectedForms.length > 0);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors block mt-1"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setPendingRemovals(prev => [...prev, assignment.id]);
                                  setHasUnsavedFormChanges(true);
                                }}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Select Forms and Documents - Separate Section */}
          {activeTab === 'forms' && hasPermission('canReviewARCRequests') && (
            <div className="bg-white rounded-card border border-ink-900/8 p-6">
              <h3 className="text-h3 font-semibold text-ink-900 mb-4 flex items-center gap-2">
                <FileSearch size={24} />
                Select Forms and Documents
              </h3>
              
              {['Required Forms', 'Optional Forms', 'Reference Documents'].map(category => {
                // Filter out forms that are already assigned
                const assignedFormIds = request.formAssignments?.map((assignment: any) => assignment.formId) || [];
                const availableForms = ARC_FORMS_LIBRARY.filter(item => 
                  item.category === category && !assignedFormIds.includes(item.id)
                );
                
                // Don't render category if no available forms
                if (availableForms.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-3 mb-6">
                    <h6 className="text-caption font-semibold text-ink-700">
                      {category}
                    </h6>
                    <div className="grid gap-3">
                      {availableForms.map(item => (
                      <div 
                        key={item.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          selectedForms.includes(item.id) 
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h6 className="text-body font-medium text-ink-900">{item.name}</h6>
                              {item.requiresSignature && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                  Signature Required
                                </span>
                              )}
                            </div>
                            <p className="text-caption text-ink-600">{item.description}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleFormSelection(item.id)}
                            className={selectedForms.includes(item.id) ? 'bg-green-100 text-green-700 border-green-200' : ''}
                          >
                            {selectedForms.includes(item.id) ? 'Selected' : 'Attach'}
                          </Button>
                        </div>
                      </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Save Button */}
              {(selectedForms.length > 0 || pendingRemovals.length > 0) && (
                <div className="pt-4 border-t border-ink-200">
                  <Button
                    onClick={saveFormAssignments}
                    className="inline-flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Attachments
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* CC&R & Rules Tab */}
          {activeTab === 'ccr' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1 max-w-2xl">
                    <h4 className="text-h3 font-semibold text-ink-900 mb-2 flex items-center gap-2">
                      <Scale size={24} />
                      CC&R, Bylaws & Rules
                      {hasPermission('canReviewARCRequests') && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                          <Bot size={12} />
                          AI Powered - Simulator
                        </span>
                      )}
                    </h4>
                    {hasPermission('canReviewARCRequests') ? (
                      <p className="text-caption text-ink-600">
                        AI-recommended rules and regulations relevant to this ARC request. Review and attach applicable rules with your notes.
                      </p>
                    ) : (
                      <p className="text-caption text-ink-600">
                        CC&R, bylaws, and rules assigned to this ARC request by the HOA Manager.
                      </p>
                    )}
                  </div>
                  {hasPermission('canReviewARCRequests') && hasUnsavedCCRChanges && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={saveCCRAttachments}
                        className="inline-flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save Attachments
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* No CC&R Rules Message for Board Members */}
              {!hasPermission('canReviewARCRequests') && (!request.ccrAttachments || request.ccrAttachments.length === 0) && (
                <div className="text-center py-8">
                  <Scale className="mx-auto text-ink-400 mb-4" size={48} />
                  <p className="text-body text-ink-600">No CC&R, bylaws, or rules assigned to this request</p>
                </div>
              )}

              {/* Currently Attached CC&R Rules */}
              {request.ccrAttachments && request.ccrAttachments.length > 0 && (
                <div className="bg-white rounded-card border border-ink-900/8 p-6">
                  <h5 className="text-body font-semibold text-ink-900 border-b border-ink-200 pb-2 mb-4">
                    Currently Attached
                  </h5>
                  <div className="space-y-4">
                    {request.ccrAttachments.map((attachment: any) => (
                      <div key={attachment.id} className="border border-neutral-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h6 className="text-body font-semibold text-ink-900">{attachment.title}</h6>
                              <span className="text-xs text-ink-500">{attachment.section}</span>
                              {attachment.requiresCompliance && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                  Compliance Required
                                </span>
                              )}
                            </div>
                            <div className="mb-2 p-3 bg-white rounded border-l-4 border-green-500">
                              <p className="text-sm text-ink-700 italic">"{attachment.excerpt}"</p>
                            </div>
                            <p className="text-sm text-ink-600 mb-2">{attachment.explanation}</p>
                            {attachment.managerNotes && (
                              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                                <p className="text-xs font-medium text-blue-800 mb-1">Manager Instructions:</p>
                                <p className="text-sm text-blue-700">{attachment.managerNotes}</p>
                              </div>
                            )}
                            <p className="text-xs text-ink-500 mt-2">
                              Attached: {formatDate(new Date(attachment.attachedAt))} at {formatTime(new Date(attachment.attachedAt))} by {attachment.attachedBy}
                            </p>
                            
                            {/* Train the AI Link */}
                            <div className="mt-2">
                              <button
                                onClick={() => {
                                  // Find the original rule data to pass to training modal
                                  const originalRule = getCCRRecommendations().find(r => r.id === attachment.ruleId);
                                  if (originalRule) {
                                    openAITrainingModal(originalRule);
                                  }
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors inline-flex items-center gap-1"
                                title="Provide feedback to improve AI recommendations"
                              >
                                <GraduationCap size={12} />
                                Train the AI
                              </button>
                            </div>
                          </div>
                          {hasPermission('canReviewARCRequests') && (
                            <div className="flex flex-col items-center gap-1 min-w-[140px]">
                              {pendingRemovals.includes(attachment.id) ? (
                                <div className="text-center">
                                  <span className="text-xs text-red-600 font-medium">Pending Removal</span>
                                  <button
                                    onClick={() => {
                                      setPendingRemovals(prev => prev.filter(id => id !== attachment.id));
                                      setHasUnsavedCCRChanges(prev => pendingRemovals.length > 1 || selectedCCRRules.length > 0);
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors block mt-1"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setPendingRemovals(prev => [...prev, attachment.id]);
                                    setHasUnsavedCCRChanges(true);
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI CC&R Recommendations - Separate Section */}
          {activeTab === 'ccr' && hasPermission('canReviewARCRequests') && (
            <div className="bg-white rounded-card border border-ink-900/8 p-6">
              <h3 className="text-h3 font-semibold text-ink-900 mb-4 flex items-center gap-2">
                <Bot size={24} />
                AI Recommendations
              </h3>
              
              {getCCRRecommendations()
                .filter(rule => !request.ccrAttachments?.some((attached: any) => attached.ruleId === rule.id))
                .map(rule => (
                <div key={rule.id} className={`border rounded-lg p-4 mb-4 transition-colors ${
                  selectedCCRRules.includes(rule.id) 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}>
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h6 className="text-body font-semibold text-ink-900">{rule.title}</h6>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {rule.confidence}% confidence
                        </span>
                        <span className="text-xs text-ink-500">{rule.section}</span>
                      </div>
                      
                      {/* Rule Excerpt */}
                      <div className="mb-3 p-3 bg-neutral-50 rounded border-l-4 border-blue-500">
                        <p className="text-sm text-ink-700 italic">"{rule.excerpt}"</p>
                      </div>
                      
                      {/* AI Explanation */}
                      <div className="mb-3">
                        <p className="text-sm text-ink-600">{rule.explanation}</p>
                      </div>
                      
                      {/* Manager Notes (if selected) */}
                      {selectedCCRRules.includes(rule.id) && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-ink-700 mb-2">
                            Manager Notes & Instructions (Optional)
                          </label>
                          <textarea
                            value={ccrRuleNotes[rule.id] || ''}
                            onChange={(e) => handleCCRRuleNotes(rule.id, e.target.value)}
                            placeholder="Add specific instructions or requirements for the homeowner..."
                            className="w-full p-2 border border-ink-200 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>
                      )}

                      {/* Train the AI Link */}
                      <div className="mt-3">
                        <button
                          onClick={() => openAITrainingModal(rule)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors inline-flex items-center gap-1"
                          title="Provide feedback to improve AI recommendations"
                        >
                          <GraduationCap size={12} />
                          Train the AI
                        </button>
                      </div>
                    </div>
                    
                    {/* Attach Button */}
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Button
                        size="sm"
                        onClick={() => handleCCRRuleSelection(rule.id)}
                        className={selectedCCRRules.includes(rule.id) ? 'bg-green-100 text-green-700 border-green-200' : ''}
                      >
                        {selectedCCRRules.includes(rule.id) ? 'Selected' : 'Attach'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Save Button */}
              {(selectedCCRRules.length > 0 || pendingRemovals.length > 0) && (
                <div className="pt-4 border-t border-ink-200">
                  <Button
                    onClick={saveCCRAttachments}
                    className="inline-flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Attachments
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Neighbor Sign-offs Tab */}
          {activeTab === 'neighbors' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1 max-w-2xl">
                    <h4 className="text-h3 font-semibold text-ink-900 mb-2 flex items-center gap-2">
                      <ThumbsUp size={24} />
                      Neighbor Sign-offs
                    </h4>
                    {hasPermission('canReviewARCRequests') ? (
                      <p className="text-caption text-ink-600">
                        Select neighbors affected by this ARC request who'll need to digitally sign their approval / disapproval.
                      </p>
                    ) : (
                      <p className="text-caption text-ink-600">
                        Neighbor sign-offs required for this ARC request by the HOA Manager.
                      </p>
                    )}
                  </div>
                  {hasPermission('canReviewARCRequests') && hasUnsavedNeighborChanges && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={saveNeighborChanges}
                        className="inline-flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* No neighbors message for Board Members */}
              {!hasPermission('canReviewARCRequests') && (!request.neighborPositions || !request.neighborPositions.some((pos: any) => pos.required)) && (
                <div className="text-center py-8">
                  <ThumbsUp className="mx-auto text-ink-400 mb-4" size={48} />
                  <p className="text-body text-ink-600">No neighbor sign-offs required for this request</p>
                </div>
              )}

              {/* HOA Manager Interface */}
              {hasPermission('canReviewARCRequests') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Visual House Diagram */}
                  <div>
                    <div className="bg-white border border-ink-900/8 rounded-card p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h5 className="text-body font-semibold text-ink-900">Select Affected Neighbors</h5>
                        <Button 
                          size="sm"
                          onClick={() => {
                            // Initialize positions if they don't exist
                            if (!request.neighborPositions || request.neighborPositions.length === 0) {
                              updateNeighborPositions(['left', 'right', 'front-left', 'front-right', 'back']);
                              return;
                            }
                            
                            // Toggle all positions
                            const allRequired = request.neighborPositions?.every((pos: any) => pos.required) || false;
                            updateNeighborPositions(allRequired ? [] : ['left', 'right', 'front-left', 'front-right', 'back']);
                          }}
                        >
                          {request.neighborPositions?.every((pos: any) => pos.required) ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>

                      <div className="flex justify-center">
                        <div className="relative">
                          {/* Center House */}
                          <button
                            onClick={() => {
                              const currentPositions = request.neighborPositions?.filter((pos: any) => pos.required).map((pos: any) => pos.position) || [];
                              const allSelected = currentPositions.length === 5;
                              updateNeighborPositions(allSelected ? [] : ['left', 'right', 'front-left', 'front-right', 'back']);
                            }}
                            className="w-20 h-20 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                          >
                            <span className="text-xs font-medium text-blue-700">House</span>
                          </button>
                          
                          {/* Position Buttons */}
                          {[
                            { key: 'left', label: 'Left', style: 'absolute -left-16 top-1/2 transform -translate-y-1/2' },
                            { key: 'right', label: 'Right', style: 'absolute -right-16 top-1/2 transform -translate-y-1/2' },
                            { key: 'front-left', label: 'Front L', style: 'absolute -top-16 left-0' },
                            { key: 'front-right', label: 'Front R', style: 'absolute -top-16 right-0' },
                            { key: 'back', label: 'Back', style: 'absolute -bottom-16 left-1/2 transform -translate-x-1/2' }
                          ].map((position) => {
                            const positionData = request.neighborPositions?.find((p: any) => p.position === position.key);
                            const isRequired = positionData?.required || false;
                            const hasNoNeighbor = positionData?.hasNoNeighbor || false;
                            const assignedNeighbor = positionData?.assignedNeighbor;
                            
                            return (
                              <div key={position.key} className={position.style}>
                                <button
                                  onClick={() => {
                                    // Get current required positions
                                    const currentPositions = request.neighborPositions?.filter((pos: any) => pos.required).map((pos: any) => pos.position) || [];
                                    
                                    // Toggle this position
                                    const newPositions = isRequired 
                                      ? currentPositions.filter((p: string) => p !== position.key)  // Remove if currently required
                                      : [...currentPositions, position.key];             // Add if not currently required
                                    
                                    updateNeighborPositions(newPositions);
                                  }}
                                  className={`w-12 h-12 border rounded-lg text-xs font-medium transition-colors relative ${
                                    isRequired
                                      ? hasNoNeighbor
                                        ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200'
                                        : assignedNeighbor
                                        ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
                                        : 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                                      : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:bg-neutral-200'
                                  }`}
                                >
                                  {position.label}
                                  {hasNoNeighbor && isRequired && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-caption">×</span>
                                    </div>
                                  )}
                                  {assignedNeighbor && isRequired && !hasNoNeighbor && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-caption">✓</span>
                                    </div>
                                  )}
                                </button>
                                
                                {/* X button for deselecting positions with no neighbor */}
                                {isRequired && hasNoNeighbor && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const currentPositions = request.neighborPositions?.filter((pos: any) => pos.required && pos.position !== position.key).map((pos: any) => pos.position) || [];
                                      updateNeighborPositions(currentPositions);
                                    }}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                    title="Remove this position"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-ink-600">Click positions to select affected neighbors</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Required Neighbor Sign-offs */}
                  <div>
                    <div className="bg-white border border-ink-900/8 rounded-card p-6">
                      <h5 className="text-body font-semibold text-ink-900 mb-4">Required Neighbor Sign-offs</h5>
                      
                      {request.neighborPositions?.some((pos: any) => pos.required) ? (
                        <div className="space-y-3">
                          {[
                            { key: 'front-left', label: 'Front Left Neighbor' },
                            { key: 'front-right', label: 'Front Right Neighbor' },
                            { key: 'left', label: 'Left Neighbor' },
                            { key: 'right', label: 'Right Neighbor' },
                            { key: 'back', label: 'Behind Neighbor' }
                          ].map((position) => {
                            const positionData = request.neighborPositions?.find((p: any) => p.position === position.key);
                            const isRequired = positionData?.required || false;
                            const hasNoNeighbor = positionData?.hasNoNeighbor || false;
                            const assignedNeighbor = positionData?.assignedNeighbor;
                            
                            // Only show positions that are required
                            if (!isRequired) return null;
                            
                            return (
                              <div key={position.key} className={`flex items-start justify-between p-4 rounded-lg ${
                                hasNoNeighbor ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                              }`}>
                                <div className="flex-1">
                                  {hasNoNeighbor ? (
                                    <div>
                                      <button
                                        onClick={() => {
                                          setUpdateNeighborPosition({position: position.key, location: position.label});
                                          setShowUpdateNeighborModal(true);
                                          setNeighborSearchTerm('');
                                        }}
                                        className="text-left hover:underline"
                                      >
                                        <p className="font-medium text-ink-900">{position.label}</p>
                                        <p className="text-sm text-red-600">No neighbor in this position</p>
                                      </button>
                                    </div>
                                  ) : assignedNeighbor ? (
                                    <div>
                                      <button
                                        onClick={() => {
                                          setUpdateNeighborPosition({position: position.key, location: position.label});
                                          setShowUpdateNeighborModal(true);
                                          setNeighborSearchTerm('');
                                        }}
                                        className="text-left hover:underline"
                                      >
                                        <p className="font-medium text-ink-900">{assignedNeighbor.name}</p>
                                        <p className="text-sm text-ink-600">{assignedNeighbor.address}</p>
                                        <p className="text-sm text-ink-600">({position.label})</p>
                                      </button>
                                      {assignedNeighbor.status === 'approved' && (
                                        <div className="mt-2 flex items-center gap-2">
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <ThumbsUp size={12} className="mr-1" />
                                            Approved
                                          </span>
                                          {assignedNeighbor.signedAt && (
                                            <span className="text-xs text-ink-500">
                                              Signed: {formatDate(new Date(assignedNeighbor.signedAt))} at {formatTime(new Date(assignedNeighbor.signedAt))}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div>
                                      <button
                                        onClick={() => {
                                          setUpdateNeighborPosition({position: position.key, location: position.label});
                                          setShowUpdateNeighborModal(true);
                                          setNeighborSearchTerm('');
                                        }}
                                        className="text-left hover:underline"
                                      >
                                        <p className="font-medium text-ink-900">{position.label}</p>
                                        <p className="text-sm text-ink-500">Click to assign neighbor</p>
                                      </button>
                                    </div>
                                  )}
                                </div>
                                
                                <button
                                  onClick={() => {
                                    const currentPositions = request.neighborPositions?.filter((pos: any) => pos.required && pos.position !== position.key).map((pos: any) => pos.position) || [];
                                    updateNeighborPositions(currentPositions);
                                  }}
                                  className="text-blue-600 hover:text-blue-700 hover:underline text-sm transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ThumbsUp className="mx-auto text-ink-400 mb-4" size={48} />
                          <p className="text-body text-ink-600">No neighbor positions selected</p>
                          <p className="text-caption text-ink-500 mt-1">
                            Use the visual selector to choose which neighbors need to sign off
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Board Member Interface - Read-only neighbor sign-offs */}
              {!hasPermission('canReviewARCRequests') && request.neighborPositions?.some((pos: any) => pos.required) && (
                <div className="bg-white border border-ink-900/8 rounded-card p-6">
                  <h5 className="text-body font-semibold text-ink-900 mb-4">Required Neighbor Sign-offs</h5>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'front-left', label: 'Front Left Neighbor' },
                      { key: 'front-right', label: 'Front Right Neighbor' },
                      { key: 'left', label: 'Left Neighbor' },
                      { key: 'right', label: 'Right Neighbor' },
                      { key: 'back', label: 'Behind Neighbor' }
                    ].map((position) => {
                      const positionData = request.neighborPositions?.find((p: any) => p.position === position.key);
                      const isRequired = positionData?.required || false;
                      const hasNoNeighbor = positionData?.hasNoNeighbor || false;
                      const assignedNeighbor = positionData?.assignedNeighbor;
                      
                      // Only show positions that are required
                      if (!isRequired) return null;
                      
                      return (
                        <div key={position.key} className={`flex items-start justify-between p-4 rounded-lg ${
                          hasNoNeighbor ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                        }`}>
                          <div className="flex-1">
                            {hasNoNeighbor ? (
                              <div>
                                <p className="font-medium text-ink-900">{position.label}</p>
                                <p className="text-sm text-red-600">No neighbor in this position</p>
                              </div>
                            ) : assignedNeighbor ? (
                              <div>
                                <p className="font-medium text-ink-900">{assignedNeighbor.name}</p>
                                <p className="text-sm text-ink-600">{assignedNeighbor.address}</p>
                                <p className="text-sm text-ink-600">({position.label})</p>
                                {assignedNeighbor.status === 'approved' && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <ThumbsUp size={12} className="mr-1" />
                                      Approved
                                    </span>
                                    {assignedNeighbor.signedAt && (
                                      <span className="text-xs text-ink-500">
                                        Signed: {formatDate(new Date(assignedNeighbor.signedAt))} at {formatTime(new Date(assignedNeighbor.signedAt))}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <p className="font-medium text-ink-900">{position.label}</p>
                                <p className="text-sm text-ink-500">Pending neighbor assignment</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Board Review Tab */}
          {activeTab === 'board' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="mb-6">
                <h4 className="text-h3 font-semibold text-ink-900 flex items-center gap-2 mb-2">
                  <Vote size={24} />
                  Board Review & Voting
                </h4>
                <p className="text-caption text-ink-600">
                  Monitor board member voting progress and view board discussions.
                </p>
              </div>

              {/* Voting Progress Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-card border border-blue-200 p-6 mb-6">
                <h5 className="text-body font-semibold text-ink-900 mb-4">Voting Progress</h5>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-caption text-ink-600">Approved</p>
                    <p className={`text-h2 font-bold text-green-600 transition-transform duration-500 ${
                      animateVoteCount ? 'scale-110' : 'scale-100'
                    }`}>
                      {getVotingStats().approvedVotes}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-caption text-ink-600">Denied</p>
                    <p className={`text-h2 font-bold text-red-600 transition-transform duration-500 ${
                      animateVoteCount ? 'scale-110' : 'scale-100'
                    }`}>
                      {getVotingStats().deniedVotes}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-caption text-ink-600">Remaining</p>
                    <p className={`text-h2 font-bold text-amber-600 transition-transform duration-500 ${
                      animateVoteCount ? 'scale-110' : 'scale-100'
                    }`}>
                      {getVotingStats().remainingVotes}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-caption text-ink-600">Needed</p>
                    <p className={`text-h2 font-bold text-blue-600 transition-transform duration-500 ${
                      animateVoteCount ? 'scale-110' : 'scale-100'
                    }`}>
                      {getVotingStats().majorityNeeded}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-neutral-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(getVotingStats().votedMembers / getVotingStats().totalMembers) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-ink-500 text-center">
                  {getVotingStats().votedMembers} of {getVotingStats().totalMembers} board members have voted
                </p>

                {/* Status Indicator */}
                {getVotingStats().hasApprovalMajority && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="text-sm font-medium text-green-800">
                        Approval Majority Achieved! ({getVotingStats().approvedVotes}/{getVotingStats().majorityNeeded} needed)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Individual Board Member Votes */}
              <div className="bg-white rounded-card border border-ink-900/8 p-6">
                <h5 className="text-body font-semibold text-ink-900 mb-4">Board Member Votes</h5>
                
                <div className="space-y-3">
                  {getBoardMembers().map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {member.name.split(' ').map(n => n.charAt(0)).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-900">{member.name}</p>
                          <p className="text-xs text-ink-500">{member.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {member.vote === 'approved' && (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              Approved
                            </span>
                            <span className="text-xs text-ink-500">
                              {member.votedAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                        
                        {member.vote === 'denied' && (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle size={12} className="mr-1" />
                              Denied
                            </span>
                            <span className="text-xs text-ink-500">
                              {member.votedAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                        
                        {member.vote === null && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock size={12} className="mr-1" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Board Discussion */}
              <div className="bg-white rounded-card border border-ink-900/8 p-6">
                <h5 className="text-body font-semibold text-ink-900 mb-4">Board Discussion</h5>
                
                <div className="space-y-4 mb-4">
                  {/* Sample discussion messages */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-blue-700">RC</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-ink-900">Robert Chen</span>
                        <span className="text-xs" style={{ color: '#434343' }}>2 hours ago</span>
                      </div>
                      <p className="text-sm text-ink-700 bg-neutral-50 rounded-lg p-3">
                        The exterior modification looks reasonable and follows our architectural guidelines. I'm approving this request.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-purple-700">MS</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-ink-900">Maria Santos</span>
                        <span className="text-xs" style={{ color: '#434343' }}>1 hour ago</span>
                      </div>
                      <p className="text-sm text-ink-700 bg-neutral-50 rounded-lg p-3">
                        Agreed. The materials and colors are consistent with neighborhood standards. Voting to approve.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-green-700">JW</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-ink-900">Jennifer Walsh</span>
                        <span className="text-xs" style={{ color: '#434343' }}>30 minutes ago</span>
                      </div>
                      <p className="text-sm text-ink-700 bg-neutral-50 rounded-lg p-3">
                        This sets a good precedent for similar modifications. I support this request.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-ink-200 pt-4">
                  <p className="text-xs text-ink-500 text-center">
                    Board discussions are visible to HOA Managers for transparency and record-keeping.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Inspection Tab */}
          {activeTab === 'inspection' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="mb-6">
                <h4 className="text-h3 font-semibold text-ink-900 flex items-center gap-2 mb-2">
                  <CheckSquare size={24} />
                  Inspection
                </h4>
                {hasPermission('canReviewARCRequests') ? (
                  <p className="text-caption text-ink-600">
                    Conduct final inspection and document project completion or required corrections.
                  </p>
                ) : (
                  <p className="text-caption text-ink-600">
                    Inspection results published by the HOA Manager after project completion.
                  </p>
                )}
              </div>

              {/* No inspection results message for Board Members */}
              {!hasPermission('canReviewARCRequests') && !request.inspectionNotes && (
                <div className="text-center py-8">
                  <CheckSquare className="mx-auto text-ink-400 mb-4" size={48} />
                  <p className="text-body text-ink-600">No inspection results available</p>
                  <p className="text-caption text-ink-500 mt-1">
                    Inspection will be conducted after board approval and project completion
                  </p>
                </div>
              )}

              {/* Inspection Results for Board Members */}
              {!hasPermission('canReviewARCRequests') && request.inspectionNotes && (
                <div className="bg-white border border-ink-900/8 rounded-card p-6">
                  <h5 className="text-body font-semibold text-ink-900 mb-3">Inspection Results</h5>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-body text-ink-700">{request.inspectionNotes}</p>
                  </div>
                  {request.inspectionPhotos && request.inspectionPhotos.length > 0 && (
                    <div className="mt-4">
                      <h6 className="text-caption font-medium text-ink-700 mb-2">Inspection Photos</h6>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {request.inspectionPhotos.map((photo: any, index: number) => (
                          <div key={index} className="relative">
                            <img
                              src={photo instanceof File ? URL.createObjectURL(photo) : (photo.url || '#')}
                              alt={`Inspection photo ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-ink-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Inspection Notes - HOA Managers Only */}
              {hasPermission('canReviewARCRequests') && (
                <div>
                  <div className="bg-white rounded-card border border-ink-900/8 p-6">
                    <h5 className="text-body font-semibold text-ink-900 mb-3">Inspection Notes</h5>
                    <textarea
                      value={inspectionNotes}
                      onChange={(e) => setInspectionNotes(e.target.value)}
                      placeholder="Add inspection notes, observations, or required corrections..."
                      className="w-full p-3 border border-ink-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  {/* Photo Upload Section - HOA Managers Only */}
                  <div className="bg-white rounded-card border border-ink-900/8 p-6">
                    <h5 className="text-body font-semibold text-ink-900 mb-3">Inspection Photos</h5>
                    <div className="border-2 border-dashed border-ink-200 rounded-lg p-6">
                      <div className="text-center">
                        <input
                          id="inspection-photos"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleInspectionPhotos}
                          className="hidden"
                        />
                        <label
                          htmlFor="inspection-photos"
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                              <CheckSquare className="text-blue-600" size={24} />
                            </div>
                            <p className="text-sm font-medium text-ink-900 mb-1">Upload inspection photos</p>
                            <p className="text-xs text-ink-500">PNG, JPG up to 10MB each</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Photo Preview */}
                    {inspectionPhotos.length > 0 && (
                      <div className="mt-4">
                        <h6 className="text-caption font-medium text-ink-700 mb-2">Selected Photos</h6>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {inspectionPhotos.map((photo, index) => (
                            <div key={index} className="relative">
                              {photo instanceof File ? (
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt={`Inspection photo ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border border-ink-200"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-32 bg-neutral-100 rounded-lg border border-ink-200 flex items-center justify-center">
                                  <span className="text-neutral-500 text-caption">Invalid photo</span>
                                </div>
                              )}
                              <button
                                onClick={() => removeInspectionPhoto(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                              <p className="text-xs text-ink-600 mt-1 truncate">{photo.name || 'Unknown file'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inspection Actions - HOA Managers Only */}
                  <div className="bg-white rounded-card border border-ink-900/8 p-6">
                    <div className="border-t border-ink-200 pt-6">
                      <h5 className="text-body font-semibold text-ink-900 mb-4">Inspection Decision</h5>
                      <div className="flex gap-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => handleInspectionDecision('Inspection Failed', 'inspection-failed')}
                          disabled={!inspectionNotes.trim()}
                        >
                          Inspection Failed
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleInspectionDecision('Mark Complete', 'completed')}
                          disabled={!inspectionNotes.trim()}
                        >
                          Mark Complete
                        </Button>
                      </div>
                      {!inspectionNotes.trim() && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Inspection notes required before making a decision
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Training Modal */}
      {showAITrainingModal && aiTrainingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="text-blue-600" size={20} />
              </div>
              <h3 className="text-h3 font-semibold text-ink-900">
                Train the AI
              </h3>
            </div>
            
            <div className="mb-4 p-3 bg-neutral-50 rounded border border-neutral-200">
              <p className="text-sm font-medium text-ink-900 mb-1">{aiTrainingRule.title}</p>
              <p className="text-xs text-ink-600">{aiTrainingRule.section} • {aiTrainingRule.confidence}% confidence</p>
            </div>
            
            <p className="text-body text-ink-600 mb-4">
              How helpful was this AI recommendation for this specific ARC request?
            </p>

            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name="feedback"
                  value="helpful"
                  checked={aiTrainingFeedback === 'helpful'}
                  onChange={(e) => setAITrainingFeedback(e.target.value as 'helpful')}
                  className="text-blue-600"
                />
                <div className="flex items-center gap-2">
                  <ThumbsUp size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-ink-900">Helpful & Relevant</span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name="feedback"
                  value="not-helpful"
                  checked={aiTrainingFeedback === 'not-helpful'}
                  onChange={(e) => setAITrainingFeedback(e.target.value as 'not-helpful')}
                  className="text-blue-600"
                />
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-600" />
                  <span className="text-sm font-medium text-ink-900">Not Helpful / Irrelevant</span>
                </div>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-ink-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={aiTrainingComment}
                onChange={(e) => setAITrainingComment(e.target.value)}
                placeholder="Help us improve by explaining why this recommendation was or wasn't helpful..."
                className="w-full p-2 border border-ink-200 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={cancelAITraining}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={submitAITraining}
                disabled={!aiTrainingFeedback}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Signature Modal for Inspection */}
      {showInspectionSignatureModal && pendingInspectionAction && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-h3 font-semibold text-ink-900 mb-4">
              Digital Signature Required
            </h3>
            
            <div className="mb-4 p-3 bg-neutral-50 rounded border border-neutral-200">
              <p className="text-sm font-medium text-ink-900 mb-1">Action: {pendingInspectionAction.action}</p>
              <p className="text-xs text-ink-600">This action requires your digital signature to proceed.</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-ink-700 mb-2">
                Digital Signature (Type your full name)
              </label>
              <input
                type="text"
                value={digitalSignature}
                onChange={(e) => setDigitalSignature(e.target.value)}
                placeholder={userProfile?.name || 'Your full name'}
                className={`w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                  digitalSignature.trim() && digitalSignature.trim().toLowerCase() === (userProfile?.name || '').toLowerCase()
                    ? 'border-green-300 focus:ring-green-500 bg-green-50'
                    : digitalSignature.trim()
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-ink-200 focus:ring-blue-500'
                }`}
              />
              {digitalSignature.trim() && digitalSignature.trim().toLowerCase() !== (userProfile?.name || '').toLowerCase() && (
                <p className="text-xs text-red-600 mt-1">Signature must match your full name exactly</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={cancelInspectionDecision}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={processInspectionDecision}
                disabled={!digitalSignature.trim() || digitalSignature.trim().toLowerCase() !== (userProfile?.name || '').toLowerCase()}
                className={pendingInspectionAction.action === 'Inspection Failed' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {pendingInspectionAction.action}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Neighbor Assignment Modal */}
      {showUpdateNeighborModal && updateNeighborPosition && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-h3 font-semibold text-ink-900 mb-4">
              Assign Neighbor - {updateNeighborPosition.location}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-ink-700 mb-2">
                Search for neighbor:
              </label>
              <input
                type="text"
                value={neighborSearchTerm}
                onChange={(e) => setNeighborSearchTerm(e.target.value)}
                placeholder="Search by name or address..."
                className="w-full p-2 border border-ink-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {COMMUNITY_MEMBERS
                .filter(member => 
                  member.name.toLowerCase().includes(neighborSearchTerm.toLowerCase()) ||
                  member.address.toLowerCase().includes(neighborSearchTerm.toLowerCase())
                )
                .map(member => (
                  <button
                    key={member.id}
                    onClick={() => {
                      assignNeighborToPosition(updateNeighborPosition.position, member);
                      setShowUpdateNeighborModal(false);
                    }}
                    className="w-full text-left p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-ink-900">{member.name}</p>
                    <p className="text-xs text-ink-600">{member.address}</p>
                    <p className="text-xs text-ink-500">{member.phone}</p>
                  </button>
                ))}
              
              {/* No Neighbor Option */}
              <button
                onClick={() => {
                  assignNeighborToPosition(updateNeighborPosition.position, null);
                  setShowUpdateNeighborModal(false);
                }}
                className="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors bg-red-25"
              >
                <p className="text-sm font-medium text-red-700">No neighbor in this position</p>
                <p className="text-xs text-red-600">Mark this position as having no neighbor</p>
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowUpdateNeighborModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
