'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { StepModal } from '@/components/ui/StepModal';
import { useHOAInfo } from '@/lib/branding/context';
import { 
  Settings, 
  Plus, 
  Trash2, 
  GripVertical, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Mail,
  MessageSquare,
  Heart,
  X,
  Zap,
  Edit3,
  Save,
  Route
} from 'lucide-react';
import Link from 'next/link';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  category: string;
  stepType: 'required' | 'recommended';
  targetDays: number; // days before/after move-in
  targetType: 'before-move-in' | 'after-move-in' | 'upon-move-in';
  pointOfContact?: string;
  attachedForms: string[]; // form IDs
  attachedDocuments: string[]; // document IDs
  notifications: {
    channels: ('platform' | 'email' | 'sms')[];
    timing: 'before-move-in' | 'after-move-in' | 'upon-move-in';
    daysAfter: number;
    autoReminder?: boolean;
    reminderDays?: number;
  };
  order: number;
}

export default function OnboardingSetupPage() {
  const hoaInfo = useHOAInfo();
  const [showStepModal, setShowStepModal] = useState(false);
  const [currentModalStep, setCurrentModalStep] = useState(1);
  const [selectedAttachments, setSelectedAttachments] = useState<string[]>([]);
  const [customDocuments, setCustomDocuments] = useState<{id: string, name: string}[]>([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: ''
  });
  const [hasAutoFilled, setHasAutoFilled] = useState(false);
  const [hasAutoFilledContact, setHasAutoFilledContact] = useState(false);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [tempDocumentName, setTempDocumentName] = useState('');
  const [hasAttachments, setHasAttachments] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [draggedStep, setDraggedStep] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  // Initialize steps state
  const [steps, setSteps] = useState<OnboardingStep[]>([]);

  // Load steps from localStorage on component mount
  useEffect(() => {
    const savedSteps = localStorage.getItem('hoa-onboarding-steps');
    if (savedSteps) {
      try {
        const parsedSteps = JSON.parse(savedSteps);
        setSteps(parsedSteps);
        // If we loaded existing steps, they're already saved
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Error loading saved onboarding steps:', error);
      }
    }
  }, []);

  // Save steps to localStorage whenever steps change
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem('hoa-onboarding-steps', JSON.stringify(steps));
    } else {
      localStorage.removeItem('hoa-onboarding-steps');
    }
  }, [steps]);

  // Open step creation modal
  const openStepModal = () => {
    setEditingStepId(null);
    setCurrentModalStep(1);
    setSelectedAttachments([]);
    setCustomDocuments([]);
    setContactForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: ''
    });
    setHasAutoFilled(false);
    setHasAutoFilledContact(false);
    setEditingDocument(null);
    setTempDocumentName('');
    setHasAttachments(false);
    setHasNotifications(false);
    setNewStep({
      title: '',
      description: '',
      category: 'Registration',
      stepType: 'required',
      targetDays: 1,
      targetType: 'after-move-in',
      pointOfContact: '',
      attachedForms: [],
      attachedDocuments: [],
      notifications: {
        channels: ['platform'],
        timing: 'after-move-in',
        daysAfter: 0
      }
    });
    setShowStepModal(true);
  };

  // Open edit modal for existing step
  const openEditModal = (step: OnboardingStep) => {
    setEditingStepId(step.id);
    setCurrentModalStep(1);
    setSelectedAttachments([...step.attachedForms, ...step.attachedDocuments]);
    setCustomDocuments([]);
    setContactForm({
      name: step.pointOfContact || '',
      company: '',
      email: '',
      phone: '',
      address: ''
    });
    setHasAutoFilled(false);
    setHasAutoFilledContact(false);
    setEditingDocument(null);
    setTempDocumentName('');
    setHasAttachments(step.attachedForms.length > 0 || step.attachedDocuments.length > 0);
    setHasNotifications(step.notifications.channels.length > 0);
    setNewStep({
      title: step.title,
      description: step.description,
      category: step.category,
      stepType: step.stepType,
      targetDays: step.targetDays,
      targetType: step.targetType,
      pointOfContact: step.pointOfContact,
      attachedForms: step.attachedForms,
      attachedDocuments: step.attachedDocuments,
      notifications: step.notifications
    });
    setShowStepModal(true);
  };

  // AI Auto-fill for Step 1 - Step Basics
  const autoFillStepBasics = () => {
    // If this is the first step (no existing steps), always use "New Resident Registration"
    if (steps.length === 0) {
      const firstStep = {
        title: 'New Resident Registration',
        description: 'Complete the resident registration form with household information, emergency contacts, and vehicle details. This is the foundation step for all new residents.',
        category: 'Registration',
        targetDays: 3,
        targetType: 'before-move-in'
      };
      
      setNewStep({
        ...newStep,
        title: firstStep.title,
        description: firstStep.description,
        category: firstStep.category,
        targetDays: firstStep.targetDays,
        targetType: firstStep.targetType as 'before-move-in' | 'after-move-in' | 'upon-move-in'
      });
      setHasAutoFilled(true);
      return;
    }

    // For additional steps, check if "New Resident Registration" already exists
    const hasRegistrationStep = steps.some(step => 
      step.title.toLowerCase().includes('registration') || 
      step.title.toLowerCase().includes('new resident')
    );

    const sampleSteps = [
      ...(!hasRegistrationStep ? [{
        title: 'New Resident Registration',
        description: 'Complete the resident registration form with household information, emergency contacts, and vehicle details. This is the foundation step for all new residents.',
        category: 'Registration',
        targetDays: 3,
        targetType: 'before-move-in'
      }] : []),
      {
        title: 'Complete Pool Registration',
        description: 'Register for pool access by submitting the pool registration form and providing emergency contact information. Pool access cards will be issued within 3-5 business days.',
        category: 'Amenities',
        targetDays: 7,
        targetType: 'after-move-in'
      },
      {
        title: 'Submit Parking Information',
        description: 'Provide vehicle information for all household vehicles including license plates, make, model, and assigned parking spots. Guest parking passes are also available.',
      category: 'Access & Security',
        targetDays: 3,
        targetType: 'after-move-in'
      },
      {
        title: 'Review Community Guidelines',
        description: 'Read and acknowledge the community CC&Rs, bylaws, and architectural guidelines. These documents outline community standards and procedures.',
        category: 'Rules & Guidelines',
        targetDays: 14,
        targetType: 'after-move-in'
      },
      {
        title: 'Welcome Package Pickup',
        description: 'Pick up your welcome package from the community office including keys, access cards, community directory, and important documents. Office hours: Monday-Friday 9AM-5PM.',
        category: 'Registration',
        targetDays: 0,
        targetType: 'upon-move-in'
      },
      {
        title: 'Alert HOA Welcome Committee',
        description: 'Alert the Welcome Committee that there is a new family joining the community so they can prepare welcome materials and coordinate outreach efforts.',
        category: 'Internal',
        targetDays: 7,
        targetType: 'before-move-in'
      },
      {
        title: 'Contact Gas and Electric Company to Connect Utilities',
        description: 'Contact your local utility providers to schedule connection of gas and electric services for your move-in date. Have your new address and preferred service dates ready.',
        category: 'Registration',
        targetDays: 14,
        targetType: 'before-move-in'
      }
    ];
    
    const randomStep = sampleSteps[Math.floor(Math.random() * sampleSteps.length)];
    if (randomStep) {
      setNewStep({
        ...newStep,
        title: randomStep.title,
        description: randomStep.description,
        category: randomStep.category,
        targetDays: randomStep.targetDays,
        targetType: randomStep.targetType as 'before-move-in' | 'after-move-in' | 'upon-move-in'
      });
      setHasAutoFilled(true);
    }
  };

  // AI Auto-fill for demo purposes - includes utility companies based on HOA city
  const autoFillContact = () => {
    const city = hoaInfo.address.city;
    const state = hoaInfo.address.state;
    
    // Utility companies and local services by city
    const utilityContacts: Record<string, any[]> = {
      'San Juan Capistrano': [
        {
          name: 'Maria Gonzalez',
          company: 'Southern California Edison',
          email: 'm.gonzalez@sce.com',
          phone: '(949) 555-2100',
          address: '24000 Avila Rd, Laguna Hills, CA 92653'
        },
        {
          name: 'David Park',
          company: 'South Coast Water District',
          email: 'dpark@scwd.org',
          phone: '(949) 555-3200',
          address: '31592 West Street, Laguna Beach, CA 92651'
        },
        {
          name: 'Jennifer Martinez',
          company: 'Waste Management OC',
          email: 'j.martinez@wm.com',
          phone: '(714) 555-4300',
          address: '1 Park Plaza, Suite 600, Irvine, CA 92614'
        }
      ],
      'Phoenix': [
        {
          name: 'Robert Chen',
          company: 'Arizona Public Service (APS)',
          email: 'r.chen@aps.com',
          phone: '(602) 555-1100',
          address: '400 N 5th St, Phoenix, AZ 85004'
        },
        {
          name: 'Lisa Thompson',
          company: 'City of Phoenix Water Services',
          email: 'lisa.thompson@phoenix.gov',
          phone: '(602) 555-2200',
          address: '200 W Washington St, Phoenix, AZ 85003'
        }
      ],
      'Denver': [
        {
          name: 'Michael Rodriguez',
          company: 'Xcel Energy Colorado',
          email: 'michael.rodriguez@xcelenergy.com',
          phone: '(303) 555-1300',
          address: '1800 Larimer St, Denver, CO 80202'
        },
        {
          name: 'Sarah Wilson',
          company: 'Denver Water',
          email: 's.wilson@denverwater.org',
          phone: '(303) 555-2400',
          address: '1600 W 12th Ave, Denver, CO 80204'
        }
      ]
    };

    // Fallback general contacts if city not found
    const generalContacts = [
      {
        name: 'Sarah Mitchell',
        company: 'Regional Property Management',
        email: 'sarah.mitchell@rpm.com',
        phone: '(555) 234-5678',
        address: `456 Business Blvd, ${city}, ${state}`
      },
      {
        name: 'Jennifer Chen',
        company: 'Local Utility Services',
        email: 'j.chen@localutility.com',
        phone: '(555) 456-7890',
        address: `321 Service Way, ${city}, ${state}`
      }
    ];
    
    const contacts = utilityContacts[city] || generalContacts;
    const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
    setContactForm(randomContact);
    setHasAutoFilledContact(true);
  };

  // Clear contact form
  const clearContactForm = () => {
    setContactForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: ''
    });
    setHasAutoFilledContact(false);
  };

  // Clear Step 1 form
  const clearStepBasics = () => {
    setNewStep({
      ...newStep,
      title: '',
      description: '',
      category: 'Registration',
      targetDays: 1,
      targetType: 'after-move-in'
    });
    setHasAutoFilled(false);
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

  const finishStep = () => {
    // Update the step with selected attachments
    const updatedStep = {
      ...newStep,
      attachedForms: selectedAttachments.filter(item => item.includes('Form')),
      attachedDocuments: selectedAttachments.filter(item => !item.includes('Form'))
    };
    
    if (editingStepId) {
      // Edit existing step
      const stepToUpdate: OnboardingStep = {
        id: editingStepId,
        title: updatedStep.title || '',
        description: updatedStep.description || '',
        category: updatedStep.category || 'Registration',
        stepType: updatedStep.stepType || 'required',
        targetDays: updatedStep.targetDays || 1,
        targetType: updatedStep.targetType || 'after-move-in',
        pointOfContact: updatedStep.pointOfContact || '',
        attachedForms: updatedStep.attachedForms || [],
        attachedDocuments: updatedStep.attachedDocuments || [],
        notifications: updatedStep.notifications || {
          channels: ['platform'],
          timing: 'after-move-in',
          daysAfter: 0
        },
        order: steps.find(s => s.id === editingStepId)?.order || 1
      };
      
      setSteps(steps.map(step => step.id === editingStepId ? stepToUpdate : step));
    } else {
      // Add new step
      const stepWithId: OnboardingStep = {
        id: `step-${Date.now()}`,
        title: updatedStep.title || '',
        description: updatedStep.description || '',
        category: updatedStep.category || 'Registration',
        stepType: updatedStep.stepType || 'required',
        targetDays: updatedStep.targetDays || 1,
        targetType: updatedStep.targetType || 'after-move-in',
        pointOfContact: updatedStep.pointOfContact || '',
        attachedForms: updatedStep.attachedForms || [],
        attachedDocuments: updatedStep.attachedDocuments || [],
        notifications: updatedStep.notifications || {
          channels: ['platform'],
          timing: 'after-move-in',
          daysAfter: 0
        },
        order: steps.length + 1
      };
      
      setSteps([...steps, stepWithId]);
    }
    
    setShowStepModal(false);
    setHasUnsavedChanges(true);
  };
  

  const [newStep, setNewStep] = useState<Partial<OnboardingStep>>({
    title: '',
    description: '',
    category: 'Registration',
    stepType: 'required',
    targetDays: 1,
    targetType: 'after-move-in',
    pointOfContact: '',
    attachedForms: [],
    attachedDocuments: [],
    notifications: {
      channels: ['platform'],
      timing: 'after-move-in',
      daysAfter: 0
    }
  });


  const removeStep = (id: string) => {
    const step = steps.find(s => s.id === id);
    const stepTitle = step?.title || 'this step';
    
    if (confirm(`Are you sure you want to delete "${stepTitle}"? This action cannot be undone.`)) {
    setSteps(steps.filter(step => step.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  const saveChanges = () => {
    // Save to localStorage (already done automatically via useEffect)
    // Mark as saved
    setHasUnsavedChanges(false);
    
    // Show success feedback (could add toast notification here)
    console.log('Onboarding journey saved successfully');
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    setDraggedStep(stepId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedStep) return;
    
    const draggedIndex = steps.findIndex(step => step.id === draggedStep);
    if (draggedIndex === -1 || draggedIndex === targetIndex) return;
    
    const newSteps = [...steps];
    const [draggedItem] = newSteps.splice(draggedIndex, 1);
    if (draggedItem) {
      newSteps.splice(targetIndex, 0, draggedItem);
      
      // Update order property
      const updatedSteps = newSteps.map((step, index) => ({
        ...step,
        order: index + 1
      }));
      
      setSteps(updatedSteps);
      setHasUnsavedChanges(true);
    }
    
    setDraggedStep(null);
  };

  const handleDragEnd = () => {
    setDraggedStep(null);
    setDragOverIndex(null);
  };

  // Helper function to get the visual step number during drag
  const getVisualStepNumber = (stepId: string, currentIndex: number) => {
    // For now, just return the current index to avoid complexity
    return currentIndex + 1;
  };

  const categories = ['Registration', 'Access & Security', 'Amenities', 'Rules & Guidelines', 'Community', 'Internal'];

  return (
    <div className="space-y-6">
      {/* Header with Sub-Navigation */}
      <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-ink-900">New Resident Onboarding</h1>
        </div>
        
        <div>
          {steps.length > 0 && (
            <Button 
              variant="primary"
              onClick={saveChanges}
              disabled={!hasUnsavedChanges}
              className={hasUnsavedChanges ? '' : 'opacity-50 cursor-not-allowed'}
            >
            Save Changes
          </Button>
          )}
        </div>
      </div>

        {/* Sub-Navigation */}
        <div className="flex gap-1 border-b border-neutral-200">
          <Link href="/dashboard/new-residents">
            <button className="px-4 py-2 text-body font-medium text-ink-800 hover:text-primary hover:bg-primary/5 transition-colors">
              Overview
            </button>
          </Link>
          <Link href="/dashboard/new-residents/welcome-committee">
            <button className="px-4 py-2 text-body font-medium text-ink-800 hover:text-primary hover:bg-primary/5 transition-colors">
              <Heart size={16} className="inline mr-2" />
              Welcome Committee
            </button>
          </Link>
          <Link href="/dashboard/new-residents/onboarding-setup">
            <button className="px-4 py-2 text-body font-medium text-primary border-b-2 border-primary bg-primary/5">
              <Route size={16} className="inline mr-2" />
              Onboarding Journey
            </button>
          </Link>
        </div>
      </div>


      {/* Journey Designer Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div>
          <h2 className="text-h2 font-bold text-ink-900">
            Onboarding Journey Designer
          </h2>
          <p className="text-body text-ink-700 mt-2">
            Design an onboarding journey with our intuitive drag-and-drop tool, making it simple to create an experience where every new resident feels informed, connected, and welcome.
          </p>
      </div>

      {/* Current Onboarding Steps */}
      <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
          {steps.length > 0 && (
            <h3 className="text-h3 font-medium text-ink-900 mb-6">Onboarding Steps</h3>
          )}
        
          {steps.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <Route className="mx-auto text-ink-400 mb-4" size={48} />
                <h4 className="text-h4 font-medium text-ink-900 mb-2">Create Your First Onboarding Step</h4>
              </div>
              <Button onClick={openStepModal} variant="primary" size="lg">
                <Plus size={16} />
                Get Started
              </Button>
            </div>
          ) : (
            <div 
              className="space-y-4"
              onDragOver={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseY = e.clientY;
                const containerBottom = rect.bottom;
                if (mouseY > containerBottom - 50) {
                  setDragOverIndex(steps.length);
                }
              }}
              onDrop={(e) => handleDrop(e, steps.length)}
            >
          {steps.map((step, index) => (
            <div key={step.id}>
              {/* Drop Indicator - show above current item if dragging over it */}
              {dragOverIndex === index && draggedStep && (
                <div className="h-1 bg-primary rounded-full mb-2 opacity-75 transition-all"></div>
              )}
              
              <div 
                draggable
                onDragStart={(e) => handleDragStart(e, step.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`group border border-neutral-200 rounded-control p-4 hover:border-neutral-300 hover:shadow-sm transition-all cursor-move ${
                  draggedStep === step.id ? 'opacity-50 scale-[0.98]' : ''
                } ${dragOverIndex === index ? 'border-primary border-2' : ''}`}
              >
              <div className="flex items-start gap-4">
                  {/* Step Number Circle with real-time updates */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0 transition-all ${
                    draggedStep === step.id ? 'bg-primary-700 text-white scale-110' : 'bg-primary text-white'
                  }`}>
                    {getVisualStepNumber(step.id, index)}
                  </div>
                
                {/* Drag Handle */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  <GripVertical size={16} className="text-neutral-400" />
                </div>
                
                {/* Step Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Step Name and Category */}
                  <div className="flex items-center gap-2">
                    <h4 className="text-body font-medium text-ink-900 truncate">{step.title}</h4>
                    <span className="text-caption bg-neutral-100 text-ink-900 px-2 py-1 rounded font-medium flex-shrink-0">
                      {step.category}
                    </span>
                  </div>
                  
                  {/* Target Completion */}
                  <div className="text-caption text-ink-800 flex items-center gap-1">
                      <Clock size={12} />
                    {step.targetType === 'upon-move-in' ? 'Upon move-in' : 
                     `${step.targetDays} days ${step.targetType === 'before-move-in' ? 'before' : 'after'} move-in`}
                  </div>
                  
                  {/* Point of Contact (only if exists) */}
                  {step.pointOfContact && (
                    <div className="text-caption text-ink-800">
                      Contact: {step.pointOfContact}
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openEditModal(step)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeStep(step.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Drop Indicator - show after last item if dragging to end */}
          {dragOverIndex === steps.length && draggedStep && (
            <div className="h-1 bg-primary rounded-full mt-2 opacity-75 transition-all"></div>
          )}

              {/* Add New Step Button */}
              <div className="flex justify-center gap-3 mt-6">
                <Button onClick={openStepModal} variant="primary">
                  <Plus size={16} />
                  Add New Onboarding Step
                </Button>
                <Button 
                  variant="secondary"
                  onClick={saveChanges}
                  disabled={!hasUnsavedChanges}
                  className={hasUnsavedChanges ? '' : 'opacity-50 cursor-not-allowed'}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Step Add Onboarding Step Modal */}
      <StepModal
        isOpen={showStepModal}
        onClose={() => setShowStepModal(false)}
        title={editingStepId ? "Edit Onboarding Step" : "Add New Onboarding Step"}
        currentStep={currentModalStep}
        totalSteps={4}
        onNext={nextStep}
        onPrevious={previousStep}
        onFinish={finishStep}
        canProceed={currentModalStep === 1 ? !!(newStep.title && newStep.description) : true}
      >
        {currentModalStep === 1 && (
          <div className="space-y-4">
            {/* AI Auto-fill Button */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={autoFillStepBasics}
                className="text-primary hover:text-primary-700 border border-primary/20 hover:border-primary/40"
              >
                <Zap size={14} />
                AI Auto-Fill (Demo)
              </Button>
              {hasAutoFilled && (
                <button
                  type="button"
                  onClick={clearStepBasics}
                  className="text-ink-700 hover:text-ink-900 text-sm underline"
                >
                  Clear
                </button>
              )}
            </div>

          <Input
              label="Step Name"
            value={newStep.title || ''}
            onChange={(e) => setNewStep({...newStep, title: e.target.value})}
            placeholder="e.g., Complete Pool Registration"
          />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea
                value={newStep.description || ''}
                onChange={(e) => setNewStep({...newStep, description: e.target.value})}
                placeholder="Clear instructions for what the resident needs to do"
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md resize-y min-h-[80px]"
                rows={3}
              />
            </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <select 
              value={newStep.category}
                onChange={(e) => {
                  const category = e.target.value;
                  setNewStep({...newStep, category});
                  
                  // If Internal is selected, disable attachments and notifications
                  if (category === 'Internal') {
                    setHasAttachments(false);
                    setHasNotifications(false);
                    setSelectedAttachments([]);
                    setNewStep(prev => ({
                      ...prev,
                      category,
                      attachedForms: [],
                      attachedDocuments: [],
                      notifications: {
                        channels: [],
                        timing: 'after-move-in',
                        daysAfter: 0
                      }
                    }));
                  }
                }}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
              {newStep.category === 'Internal' && (
                <p className="text-caption text-amber-700 mt-2 bg-amber-50 px-3 py-2 rounded border border-amber-200">
                  ⚠️ Internal steps are for HOA staff coordination only and will not be displayed on the resident's dashboard.
                </p>
              )}
          </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Target Completion</label>
              <div className="flex gap-2">
                {newStep.targetType !== 'upon-move-in' && (
            <Input
                    type="number"
                    value={newStep.targetDays || 1}
                    onChange={(e) => setNewStep({...newStep, targetDays: parseInt(e.target.value)})}
                    className="w-20"
                    placeholder="1"
                  />
                )}
                <select 
                  value={newStep.targetType || 'after-move-in'}
                  onChange={(e) => {
                    const targetType = e.target.value as 'before-move-in' | 'after-move-in' | 'upon-move-in';
                    setNewStep({
                      ...newStep, 
                      targetType,
                      // Reset targetDays to 0 when "upon move-in" is selected
                      targetDays: targetType === 'upon-move-in' ? 0 : (newStep.targetDays || 1)
                    });
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md"
                >
                  <option value="before-move-in">days before move-in</option>
                  <option value="upon-move-in">upon move-in date</option>
                  <option value="after-move-in">days after move-in</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentModalStep === 2 && (
          <div className="space-y-4">
            {newStep.category === 'Internal' ? (
              <div className="text-center py-8">
                <div className="text-amber-700 bg-amber-50 px-4 py-3 rounded border border-amber-200">
                  <p className="font-medium mb-1">⚠️ Attachments Not Available for Internal Steps</p>
                  <p className="text-sm">Internal steps are for HOA staff coordination and don't require resident-facing attachments.</p>
                </div>
              </div>
            ) : (
              <>
                <h4 className="text-body font-medium text-ink-900 mb-4">Are there any attachments required for this step?</h4>
                
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasAttachments"
                      value="yes"
                      checked={hasAttachments}
                      onChange={() => setHasAttachments(true)}
                      className="border-border"
                    />
                    <span className="text-body text-ink-900">Yes, add attachments</span>
                  </label>
            <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasAttachments"
                      value="no"
                      checked={!hasAttachments}
                      onChange={() => {
                        setHasAttachments(false);
                        setSelectedAttachments([]);
                        setCustomDocuments([]);
                      }}
                      className="border-border"
                    />
                    <span className="text-body text-ink-900">No attachments needed</span>
                  </label>
                </div>
              </>
            )}

            {hasAttachments && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'CC&Rs Document',
                'Community Bylaws',
                'Emergency Contact Form',
                'Emergency Contact List',
                'Move-In Notice Form',
                'Parking Guidelines',
                'Pool Registration Form',
                'Pool Rules',
                'Resident Registration Form'
              ].map((item) => (
                <label key={item} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded cursor-pointer">
              <input
                type="checkbox"
                    checked={selectedAttachments.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAttachments([...selectedAttachments, item]);
                      } else {
                        setSelectedAttachments(selectedAttachments.filter(i => i !== item));
                      }
                    }}
                className="rounded border-border"
              />
                  <span className="text-body text-ink-900">{item}</span>
            </label>
              ))}
              
              {/* Custom uploaded documents - editable */}
              {customDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded border border-blue-200">
                  <input
                    type="checkbox"
                    checked={selectedAttachments.includes(doc.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAttachments([...selectedAttachments, doc.name]);
                      } else {
                        setSelectedAttachments(selectedAttachments.filter(i => i !== doc.name));
                      }
                    }}
                    className="rounded border-border"
                  />
                  
                  {editingDocument === doc.id ? (
                    <input
                      type="text"
                      value={tempDocumentName}
                      onChange={(e) => setTempDocumentName(e.target.value)}
                      className="flex-1 text-sm bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-ink-900"
                      placeholder="Enter document name"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 text-sm text-ink-900">{doc.name}</span>
                  )}
                  
                  <div className="flex items-center gap-1">
                    {editingDocument === doc.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (tempDocumentName.trim()) {
                            // Update the document name
                            const updatedDocs = customDocuments.map(d => 
                              d.id === doc.id ? { ...d, name: tempDocumentName.trim() } : d
                            );
                            setCustomDocuments(updatedDocs);
                            
                            // Update selected attachments
                            const updatedAttachments = selectedAttachments.map(att => 
                              att === doc.name ? tempDocumentName.trim() : att
                            );
                            setSelectedAttachments(updatedAttachments);
                          }
                          setEditingDocument(null);
                          setTempDocumentName('');
                        }}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <Save size={12} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDocument(doc.id);
                          setTempDocumentName(doc.name);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit3 size={12} />
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setCustomDocuments(customDocuments.filter(d => d.id !== doc.id));
                        setSelectedAttachments(selectedAttachments.filter(att => att !== doc.name));
                        if (editingDocument === doc.id) {
                          setEditingDocument(null);
                          setTempDocumentName('');
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex justify-center">
                <Button 
                  type="button"
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    const newDoc = {
                      id: `doc-${Date.now()}`,
                      name: `New Document ${customDocuments.length + 1}`
                    };
                    setCustomDocuments([...customDocuments, newDoc]);
                    setSelectedAttachments([...selectedAttachments, newDoc.name]);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus size={14} />
                  Upload Form/Document
                </Button>
              </div>
            </div>
              </div>
            )}
          </div>
        )}

        {currentModalStep === 3 && (
          <div className="space-y-4">
            <h4 className="text-body font-medium text-ink-900 mb-4">Is there a point of contact for this step?</h4>
            
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hasContact"
                  value="yes"
                  checked={contactForm.name !== '' || editingDocument === 'contact-form'}
                  onChange={() => setEditingDocument('contact-form')}
                  className="border-border"
                />
                <span className="text-body text-ink-900">Yes, add contact details</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hasContact"
                  value="no"
                  checked={contactForm.name === '' && editingDocument !== 'contact-form'}
                  onChange={() => {
                    setContactForm({name: '', company: '', email: '', phone: '', address: ''});
                    setEditingDocument(null);
                  }}
                  className="border-border"
                />
                <span className="text-body text-ink-900">No, skip this step</span>
              </label>
            </div>

            {/* Contact Form - only show if "Yes" is selected */}
            {(contactForm.name !== '' || editingDocument === 'contact-form') && (
              <div className="space-y-4">
                {/* Search Existing Users */}
                <div>
                  <Input
                    label="Search Existing Users"
                    placeholder="Search board members, community members, or staff..."
                    helperText="Search from existing users in your HOA Connect account"
                  />
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-neutral-200"></div>
                  <span className="text-caption text-ink-700">or Add 3rd Party Point of Contact</span>
                  <div className="flex-1 h-px bg-neutral-200"></div>
                </div>

                {/* AI Auto-fill Button */}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={autoFillContact}
                    className="text-primary hover:text-primary-700 border border-primary/20 hover:border-primary/40"
                  >
                    <Zap size={14} />
                    AI Auto-Fill (Demo)
                  </Button>
                  {hasAutoFilledContact && (
                    <button
                      type="button"
                      onClick={clearContactForm}
                      className="text-ink-700 hover:text-ink-900 text-sm underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="John Smith"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  />
                  <Input
                    label="Company/Role"
                    placeholder="ABC Property Management"
                    value={contactForm.company}
                    onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  />
            <Input
                    label="Phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
            />
          </div>
          
                <Input
                  label="Address (Optional)"
                  placeholder="123 Main St, City, State 12345"
                  value={contactForm.address}
                  onChange={(e) => setContactForm({...contactForm, address: e.target.value})}
                />
              </div>
            )}
          </div>
        )}

        {currentModalStep === 4 && (
          <div className="space-y-4">
            {newStep.category === 'Internal' ? (
              <div className="text-center py-8">
                <div className="text-amber-700 bg-amber-50 px-4 py-3 rounded border border-amber-200">
                  <p className="font-medium mb-1">⚠️ Resident Notifications Not Available for Internal Steps</p>
                  <p className="text-sm">Internal steps are for HOA staff coordination and don't send notifications to residents.</p>
                </div>
              </div>
            ) : (
              <>
                <h4 className="text-body font-medium text-ink-900 mb-4">Do you want to send notifications to residents about this step?</h4>
                
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasNotifications"
                      value="yes"
                      checked={hasNotifications}
                      onChange={() => setHasNotifications(true)}
                      className="border-border"
                    />
                    <span className="text-body text-ink-900">Yes, send notifications</span>
                  </label>
            <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasNotifications"
                      value="no"
                      checked={!hasNotifications}
                      onChange={() => {
                        setHasNotifications(false);
                        setNewStep({
                          ...newStep,
                          notifications: {
                            channels: [],
                            timing: 'after-move-in',
                            daysAfter: 0
                          }
                        });
                      }}
                      className="border-border"
                    />
                    <span className="text-body text-ink-900">No notifications needed</span>
                  </label>
                </div>
              </>
            )}

            {hasNotifications && (
              <div className="space-y-4">
                <div>
                  <p className="text-caption text-ink-800 mb-3">How should residents be notified about this step?</p>
              <div className="flex gap-6">
                {(['email', 'sms'] as const).map((channel) => (
                  <label key={channel} className="flex items-center gap-2">
              <input
                type="checkbox"
                      checked={newStep.notifications?.channels?.includes(channel) || false}
                      onChange={(e) => {
                        const channels = newStep.notifications?.channels || [];
                        const newChannels = e.target.checked 
                          ? [...channels, channel]
                          : channels.filter(c => c !== channel);
                        setNewStep({
                          ...newStep, 
                          notifications: { ...newStep.notifications!, channels: newChannels }
                        });
                      }}
                className="rounded border-border"
              />
                    {channel === 'email' ? (
                      <Mail size={16} className="text-blue-600" />
                    ) : (
                      <MessageSquare size={16} className="text-green-600" />
                    )}
                    <span className="text-body text-ink-900 capitalize">{channel === 'sms' ? 'SMS' : 'Email'}</span>
            </label>
                ))}
                  </div>
                </div>

            <div className="border-t border-neutral-200 pt-4">
              <p className="text-caption text-ink-800 mb-3">When should the initial notification be sent?</p>
              <div className="flex gap-2">
                {newStep.notifications?.timing !== 'upon-move-in' && (
                  <Input
                    type="number"
                    value={newStep.notifications?.daysAfter || 0}
                    onChange={(e) => setNewStep({
                      ...newStep, 
                      notifications: { 
                        ...newStep.notifications!, 
                        daysAfter: parseInt(e.target.value) 
                      }
                    })}
                    className="w-20"
                    placeholder="0"
                  />
                )}
              <select 
                  value={newStep.notifications?.timing || 'after-move-in'}
                  onChange={(e) => {
                    const timing = e.target.value as 'before-move-in' | 'after-move-in' | 'upon-move-in';
                    setNewStep({
                      ...newStep, 
                      notifications: { 
                        ...newStep.notifications!, 
                        timing,
                        // Reset daysAfter to 0 when "upon move-in" is selected
                        daysAfter: timing === 'upon-move-in' ? 0 : (newStep.notifications?.daysAfter || 0)
                      }
                    });
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md"
                >
                  <option value="before-move-in">days before move-in</option>
                  <option value="upon-move-in">upon move-in</option>
                  <option value="after-move-in">days after move-in</option>
              </select>
          </div>
        </div>
        
            <div className="border-t border-neutral-200 pt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newStep.notifications?.autoReminder || false}
                  onChange={(e) => setNewStep({
                    ...newStep, 
                    notifications: { 
                      ...newStep.notifications!, 
                      autoReminder: e.target.checked 
                    }
                  })}
                  className="rounded border-border"
                />
                <span className="text-body text-ink-900">Send Auto-Reminders</span>
              </label>
              {newStep.notifications?.autoReminder && (
                <div className="ml-6 mt-3 flex gap-2">
                  <Input
                    type="number"
                    defaultValue={3}
                    className="w-20"
                    placeholder="3"
                  />
                  <span className="text-body text-ink-900 self-center">days after initial notification</span>
                </div>
              )}
              <p className="text-caption text-ink-700 mt-2">
                Automatic reminders help ensure residents don't miss important steps.
              </p>
            </div>
              </div>
            )}
      </div>
        )}
      </StepModal>
    </div>
  );
}
