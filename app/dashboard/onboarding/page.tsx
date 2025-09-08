'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { SAMPLE_ONBOARDING_PROGRESS } from '@/lib/onboarding/data';
import { CATEGORY_INFO } from '@/lib/onboarding/types';
import { ChecklistItem } from '@/lib/onboarding/types';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  UserPlus, 
  Key, 
  Home, 
  Book, 
  Users,
  ExternalLink,
  FileText,
  Phone
} from 'lucide-react';

const CATEGORY_ICONS = {
  registration: <UserPlus size={20} />,
  access: <Key size={20} />,
  amenities: <Home size={20} />,
  rules: <Book size={20} />,
  community: <Users size={20} />
};

const LINK_ICONS = {
  form: <FileText size={16} />,
  document: <FileText size={16} />,
  contact: <Phone size={16} />,
  external: <ExternalLink size={16} />
};

export default function OnboardingPage() {
  const { hasPermission } = useAuth();
  const [progress, setProgress] = useState(SAMPLE_ONBOARDING_PROGRESS);

  const toggleItem = (itemId: string) => {
    setProgress(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              isCompleted: !item.isCompleted,
              completedAt: !item.isCompleted ? new Date() : undefined
            }
          : item
      ),
      lastUpdated: new Date()
    }));
  };

  const calculateCategoryProgress = (category: string) => {
    const categoryItems = progress.items.filter(item => item.category === category);
    const completedItems = categoryItems.filter(item => item.isCompleted);
    return categoryItems.length > 0 ? Math.round((completedItems.length / categoryItems.length) * 100) : 0;
  };

  const overallProgress = Math.round(
    (progress.items.filter(item => item.isCompleted).length / progress.items.length) * 100
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-caption uppercase tracking-wide text-ink-800 mb-2">New Resident</div>
            <h1 className="text-h1 font-bold text-ink-900 mb-2">{progress.residentName}</h1>
            <p className="text-body-lg text-ink-800 mb-4">
              {progress.address} • Moved in {progress.moveInDate.toLocaleDateString()}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <span className="text-body font-medium text-ink-900">{overallProgress}% Complete</span>
              </div>
              <span className="text-caption text-ink-800">
                {progress.items.filter(item => item.isCompleted).length} of {progress.items.length} items
              </span>
            </div>
          </div>
          
          {hasPermission('canManageResidents') && (
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">Send Welcome Email</Button>
              <Button variant="ghost" size="sm">View Profile</Button>
            </div>
          )}
        </div>
      </div>

      {/* Checklist by Category */}
      <div className="space-y-6">
        {CATEGORY_INFO && Object.entries(CATEGORY_INFO).map(([categoryKey, categoryData]) => {
          const categoryItems = progress.items.filter(item => item.category === categoryKey);
          const categoryProgress = calculateCategoryProgress(categoryKey);
          
          if (categoryItems.length === 0) return null;

          return (
            <div key={categoryKey} className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-primary/10 rounded-ctl flex items-center justify-center">
                  {CATEGORY_ICONS[categoryKey as keyof typeof CATEGORY_ICONS]}
                </div>
                <div className="flex-1">
                  <h3 className="text-h4 font-medium text-ink-900">{categoryData.name}</h3>
                  <p className="text-body text-ink-800">{categoryData.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-body font-medium text-ink-900">{categoryProgress}%</div>
                  <div className="text-caption text-ink-800">
                    {categoryItems.filter(item => item.isCompleted).length}/{categoryItems.length} items
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {categoryItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`border rounded-ctl p-4 transition-all duration-150 ${
                      item.isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="mt-1 text-primary hover:text-primary-700 transition-colors cursor-pointer"
                      >
                        {item.isCompleted ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className={`text-body font-medium ${
                            item.isCompleted ? 'text-green-800 line-through' : 'text-ink-900'
                          }`}>
                            {item.title}
                          </h4>
                          {item.isRequired && (
                            <span className="text-caption bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                              Required
                            </span>
                          )}
                          {item.estimatedMinutes && (
                            <span className="text-caption text-ink-800 flex items-center gap-1">
                              <Clock size={12} />
                              {item.estimatedMinutes} min
                            </span>
                          )}
                        </div>
                        
                        <p className={`text-body mb-3 ${
                          item.isCompleted ? 'text-green-700' : 'text-ink-800'
                        }`}>
                          {item.description}
                        </p>

                        {item.links && item.links.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.links.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                className="inline-flex items-center gap-1 text-caption text-primary hover:text-primary-700 hover:underline"
                              >
                                {LINK_ICONS[link.type]}
                                {link.label}
                              </a>
                            ))}
                          </div>
                        )}

                        {item.isCompleted && item.completedAt && (
                          <p className="text-caption text-green-600 mt-2">
                            ✓ Completed on {item.completedAt.toLocaleDateString()} at {item.completedAt.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Status */}
      {overallProgress === 100 && (
        <div className="rounded-card border border-green-200 bg-green-50 shadow-elev1 p-6 text-center">
          <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
          <h3 className="text-h3 font-medium text-green-800 mb-2">
            Welcome to the Community!
          </h3>
          <p className="text-body text-green-700 mb-4">
            You've completed all onboarding requirements. Enjoy your new home!
          </p>
          <Button variant="primary">View Community Guide</Button>
        </div>
      )}
    </div>
  );
}
