import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface StepModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
  children: React.ReactNode;
  canProceed?: boolean;
  className?: string;
}

export function StepModal({ 
  isOpen, 
  onClose, 
  title, 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  onFinish,
  children, 
  canProceed = true,
  className = '' 
}: StepModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-card shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col ${className}`}>
        {/* Header */}
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h3 font-medium text-ink-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-ink-800 hover:text-ink-900 transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center">
            {Array.from({ length: totalSteps }, (_, index) => (
              <React.Fragment key={index}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 === currentStep 
                    ? 'bg-primary text-white' 
                    : index + 1 < currentStep
                    ? 'bg-green-100 text-green-800'
                    : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index + 1 < currentStep ? 'bg-green-300' : 'bg-neutral-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 min-h-0">
          {children}
        </div>

        {/* Actions */}
        <div className="flex justify-between p-6 border-t border-neutral-200 flex-shrink-0">
          <div>
            {currentStep > 1 && (
              <Button variant="ghost" onClick={onPrevious}>
                <ChevronLeft size={16} />
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < totalSteps ? (
              <Button 
                variant="primary" 
                onClick={onNext}
                disabled={!canProceed}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            ) : (
                <Button 
                  variant="primary" 
                  onClick={onFinish}
                  disabled={!canProceed}
                >
                  {title.includes('Edit') ? 'Save Changes' : 
                   title.includes('ARC Request') ? 'Submit Request' : 'Add Step'}
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
