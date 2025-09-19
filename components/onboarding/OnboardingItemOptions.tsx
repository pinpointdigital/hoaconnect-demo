'use client';

import { useState } from 'react';
import { useSimpleOnboarding } from '@/lib/onboarding/simple-context';
import { OnboardingItem, OnboardingDocument, TIMING_OPTIONS } from '@/lib/onboarding/simple-types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Bell, 
  FileText, 
  User, 
  Upload, 
  Library,
  Trash2,
  Plus 
} from 'lucide-react';

interface OnboardingItemOptionsProps {
  item: OnboardingItem;
}

export function OnboardingItemOptions({ item }: OnboardingItemOptionsProps) {
  const { updateItem, config, addDocument } = useSimpleOnboarding();
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Initialize states with current values
  const [reminderSettings, setReminderSettings] = useState({
    sms: item.reminder?.sms || false,
    email: item.reminder?.email || false,
    timing: item.reminder?.timing || 'move-in-date',
    offsetDays: item.reminder?.offsetDays || 1
  });

  const [documentSettings, setDocumentSettings] = useState({
    type: item.documents?.type || 'upload',
    selectedLibraryDoc: ''
  });

  const [contactInfo, setContactInfo] = useState({
    name: item.contact?.name || '',
    email: item.contact?.email || '',
    phone: item.contact?.phone || ''
  });

  const handleReminderChange = (field: string, value: any) => {
    const newSettings = { ...reminderSettings, [field]: value };
    setReminderSettings(newSettings);
    
    updateItem(item.id, {
      reminder: {
        ...newSettings,
        timing: newSettings.timing as any
      }
    });
  };

  const handleContactChange = (field: string, value: string) => {
    const newContact = { ...contactInfo, [field]: value };
    setContactInfo(newContact);
    
    updateItem(item.id, {
      contact: newContact
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      
      // Create document and add to library
      const newDoc: OnboardingDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        file: file,
        uploadedAt: new Date()
      };
      
      addDocument(newDoc);
      
      // Attach to item
      updateItem(item.id, {
        documents: {
          type: 'upload',
          files: [...(item.documents?.files || []), newDoc]
        }
      });
    }
  };

  const handleLibrarySelect = (docId: string) => {
    const doc = config.documentLibrary.find(d => d.id === docId);
    if (doc) {
      updateItem(item.id, {
        documents: {
          type: 'library',
          files: [...(item.documents?.files || []), doc]
        }
      });
    }
  };

  const handleRemoveDocument = (docId: string) => {
    updateItem(item.id, {
      documents: {
        ...item.documents!,
        files: item.documents?.files.filter(doc => doc.id !== docId) || []
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Customer Reminder */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Bell size={16} className="text-ink-600" />
          <h5 className="text-sm font-medium text-ink-900">Send Customer Reminder</h5>
        </div>
        
        <div className="space-y-3">
          {/* Channels */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={reminderSettings.sms}
                onChange={(e) => handleReminderChange('sms', e.target.checked)}
                className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-ink-800">SMS</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={reminderSettings.email}
                onChange={(e) => handleReminderChange('email', e.target.checked)}
                className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-ink-800">Email</span>
            </label>
          </div>

          {/* Timing */}
          <div className="flex items-center gap-3">
            <select
              value={reminderSettings.timing}
              onChange={(e) => handleReminderChange('timing', e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-control text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {TIMING_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {(reminderSettings.timing === 'days-before' || reminderSettings.timing === 'days-after') && (
              <Input
                type="number"
                min="1"
                max="30"
                value={reminderSettings.offsetDays}
                onChange={(e) => handleReminderChange('offsetDays', parseInt(e.target.value) || 1)}
                className="w-20"
                placeholder="Days"
              />
            )}
          </div>
        </div>
      </div>

      {/* Attach Documents */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-ink-600" />
          <h5 className="text-sm font-medium text-ink-900">Attach Documents / Forms</h5>
        </div>
        
        <div className="space-y-3">
          {/* Document Type Selection */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`doc-type-${item.id}`}
                value="upload"
                checked={documentSettings.type === 'upload'}
                onChange={(e) => setDocumentSettings(prev => ({ ...prev, type: 'upload' }))}
                className="w-4 h-4 text-primary border-neutral-300 focus:ring-primary"
              />
              <span className="text-sm text-ink-800">Upload new</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`doc-type-${item.id}`}
                value="library"
                checked={documentSettings.type === 'library'}
                onChange={(e) => setDocumentSettings(prev => ({ ...prev, type: 'library' }))}
                className="w-4 h-4 text-primary border-neutral-300 focus:ring-primary"
              />
              <span className="text-sm text-ink-800">Choose from library</span>
            </label>
          </div>

          {/* Upload Interface */}
          {documentSettings.type === 'upload' && (
            <div>
              <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload size={16} className="text-ink-600" />
                <span className="text-sm text-ink-700">Choose file to upload</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
            </div>
          )}

          {/* Library Selection */}
          {documentSettings.type === 'library' && (
            <div>
              <select
                value={documentSettings.selectedLibraryDoc}
                onChange={(e) => {
                  setDocumentSettings(prev => ({ ...prev, selectedLibraryDoc: e.target.value }));
                  if (e.target.value) {
                    handleLibrarySelect(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 border border-neutral-300 rounded-control text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select from library...</option>
                {config.documentLibrary.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              {config.documentLibrary.length === 0 && (
                <p className="text-xs text-ink-500 mt-1">No documents in library yet</p>
              )}
            </div>
          )}

          {/* Attached Documents */}
          {item.documents?.files && item.documents.files.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-ink-700">Attached Documents:</p>
              {item.documents.files.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded border">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-ink-500" />
                    <span className="text-sm text-ink-800">{doc.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Point of Contact */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <User size={16} className="text-ink-600" />
          <h5 className="text-sm font-medium text-ink-900">Add Point of Contact</h5>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Name"
            value={contactInfo.name}
            onChange={(e) => handleContactChange('name', e.target.value)}
            placeholder="John Smith"
            className="text-sm"
          />
          <Input
            label="Email"
            type="email"
            value={contactInfo.email}
            onChange={(e) => handleContactChange('email', e.target.value)}
            placeholder="john@hoa.com"
            className="text-sm"
          />
          <Input
            label="Phone"
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => handleContactChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}





