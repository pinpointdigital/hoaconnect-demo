'use client';

import { useState } from 'react';
import { useSimpleOnboarding } from '@/lib/onboarding/simple-context';
import { OnboardingItem } from '@/lib/onboarding/simple-types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { OnboardingItemOptions } from './OnboardingItemOptions';
import { 
  ChevronDown, 
  ChevronRight, 
  Settings, 
  CheckCircle2, 
  Circle 
} from 'lucide-react';

interface OnboardingItemCardProps {
  item: OnboardingItem;
  categoryColor: string;
}

export function OnboardingItemCard({ item, categoryColor }: OnboardingItemCardProps) {
  const { toggleItem, updateItem } = useSimpleOnboarding();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDetails, setEditDetails] = useState(item.details || '');

  const handleToggle = () => {
    toggleItem(item.id);
  };

  const handleSaveEdit = () => {
    updateItem(item.id, {
      title: editTitle,
      details: editDetails
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(item.title);
    setEditDetails(item.details || '');
    setIsEditing(false);
  };

  return (
    <div className={`border rounded-lg transition-all duration-200 ${
      item.enabled 
        ? `border-${categoryColor}-200 bg-${categoryColor}-50/30` 
        : 'border-neutral-200 bg-white'
    }`}>
      {/* Main Item Row */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={`flex-shrink-0 w-6 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center ${
              item.enabled
                ? `border-${categoryColor}-500 bg-${categoryColor}-500 text-white`
                : 'border-neutral-300 hover:border-neutral-400'
            }`}
          >
            {item.enabled && <CheckCircle2 size={16} />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Item title"
                  className="font-medium"
                />
                <textarea
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  placeholder="Item details (optional)"
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-control text-body resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h4 className={`font-medium text-ink-900 ${item.enabled ? '' : 'text-ink-600'}`}>
                  {item.title}
                </h4>
                {item.details && (
                  <p className={`text-caption mt-1 ${item.enabled ? 'text-ink-700' : 'text-ink-500'}`}>
                    {item.details}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-ink-600 hover:text-ink-900"
              >
                <Settings size={14} />
                Edit
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-ink-600 hover:text-ink-900"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Options
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Options */}
      {isExpanded && (
        <div className="border-t border-neutral-200 bg-white">
          <OnboardingItemOptions item={item} />
        </div>
      )}
    </div>
  );
}




