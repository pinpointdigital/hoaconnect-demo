'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { SimpleOnboardingProvider, useSimpleOnboarding } from '@/lib/onboarding/simple-context';
import { CATEGORY_INFO, FEATURE_FLAGS } from '@/lib/onboarding/simple-types';
import { Button } from '@/components/ui/Button';
import { OnboardingItemCard } from '@/components/onboarding/OnboardingItemCard';
import { CheckCircle, Settings, RotateCcw, Save } from 'lucide-react';

function SimpleSetupContent() {
  const { hasPermission } = useAuth();
  const { config, getItemsByCategory, resetToDefaults } = useSimpleOnboarding();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Check permissions
  if (!hasPermission('canManageResidents')) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="text-neutral-400" size={24} />
        </div>
        <h3 className="text-h4 font-medium text-ink-900 mb-2">Access Restricted</h3>
        <p className="text-body text-ink-700">You don't have permission to manage resident onboarding.</p>
      </div>
    );
  }

  // Check feature flag
  if (!FEATURE_FLAGS.onboarding.simpleEnabled) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="text-neutral-400" size={24} />
        </div>
        <h3 className="text-h4 font-medium text-ink-900 mb-2">Feature Not Available</h3>
        <p className="text-body text-ink-700">Simple onboarding setup is currently disabled.</p>
      </div>
    );
  }

  const handleSave = () => {
    // TODO: API call to save configuration
    console.log('Saving onboarding configuration:', config);
    setSavedAt(new Date());
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default settings? This will lose all customizations.')) {
      resetToDefaults();
    }
  };

  const enabledCount = config.items.filter(item => item.enabled).length;
  const totalCount = config.items.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-ink-900 mb-2">New Resident Onboarding (Simple)</h1>
          <p className="text-body text-ink-700">
            Configure checklist items for new resident welcome process
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-ink-900">
              {enabledCount} of {totalCount} items enabled
            </div>
            {savedAt && (
              <div className="text-xs text-ink-600">
                Saved {savedAt.toLocaleTimeString()}
              </div>
            )}
          </div>
          <Button variant="ghost" onClick={handleReset} className="text-ink-700">
            <RotateCcw size={16} />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save size={16} />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Categories */}
      {Object.entries(CATEGORY_INFO).map(([categoryKey, categoryInfo]) => {
        const items = getItemsByCategory(categoryKey);
        const enabledInCategory = items.filter(item => item.enabled).length;

        return (
          <section key={categoryKey} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-${categoryInfo.color}-500`} />
              <div>
                <h2 className="text-h3 font-semibold text-ink-900">
                  {categoryInfo.title}
                </h2>
                <p className="text-caption text-ink-700">
                  {categoryInfo.description} • {enabledInCategory}/{items.length} enabled
                </p>
              </div>
            </div>

            {/* Category Items */}
            <div className="space-y-3">
              {items.map(item => (
                <OnboardingItemCard 
                  key={item.id} 
                  item={item}
                  categoryColor={categoryInfo.color}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Summary */}
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="text-green-600" size={24} />
          <h3 className="text-h4 font-semibold text-ink-900">Configuration Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(CATEGORY_INFO).map(([categoryKey, categoryInfo]) => {
            const items = getItemsByCategory(categoryKey);
            const enabledInCategory = items.filter(item => item.enabled).length;
            
            return (
              <div key={categoryKey} className="text-center">
                <div className={`w-8 h-8 rounded-full bg-${categoryInfo.color}-100 flex items-center justify-center mx-auto mb-2`}>
                  <div className={`w-3 h-3 rounded-full bg-${categoryInfo.color}-500`} />
                </div>
                <div className="text-h4 font-bold text-ink-900">{enabledInCategory}</div>
                <div className="text-caption text-ink-700">{categoryInfo.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SimpleSetupPage() {
  return (
    <SimpleOnboardingProvider>
      <SimpleSetupContent />
    </SimpleOnboardingProvider>
  );
}





