'use client';

/**
 * Simple Onboarding Context
 * State management for checkbox-based onboarding setup
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  SimpleOnboardingConfig, 
  OnboardingItem, 
  OnboardingDocument,
  DEFAULT_SIMPLE_ONBOARDING_CONFIG 
} from './simple-types';

interface SimpleOnboardingContextType {
  config: SimpleOnboardingConfig;
  updateItem: (itemId: string, updates: Partial<OnboardingItem>) => void;
  toggleItem: (itemId: string) => void;
  addDocument: (document: OnboardingDocument) => void;
  removeDocument: (documentId: string) => void;
  getItemsByCategory: (category: string) => OnboardingItem[];
  resetToDefaults: () => void;
}

const SimpleOnboardingContext = createContext<SimpleOnboardingContextType | undefined>(undefined);

interface SimpleOnboardingProviderProps {
  children: React.ReactNode;
}

export function SimpleOnboardingProvider({ children }: SimpleOnboardingProviderProps) {
  const [config, setConfig] = useState<SimpleOnboardingConfig>(DEFAULT_SIMPLE_ONBOARDING_CONFIG);

  const updateItem = useCallback((itemId: string, updates: Partial<OnboardingItem>) => {
    setConfig(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ),
      lastUpdated: new Date()
    }));
  }, []);

  const toggleItem = useCallback((itemId: string) => {
    setConfig(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, enabled: !item.enabled } : item
      ),
      lastUpdated: new Date()
    }));
  }, []);

  const addDocument = useCallback((document: OnboardingDocument) => {
    setConfig(prev => ({
      ...prev,
      documentLibrary: [...prev.documentLibrary, document],
      lastUpdated: new Date()
    }));
  }, []);

  const removeDocument = useCallback((documentId: string) => {
    setConfig(prev => ({
      ...prev,
      documentLibrary: prev.documentLibrary.filter(doc => doc.id !== documentId),
      lastUpdated: new Date()
    }));
  }, []);

  const getItemsByCategory = useCallback((category: string) => {
    return config.items.filter(item => item.category === category);
  }, [config.items]);

  const resetToDefaults = useCallback(() => {
    setConfig(DEFAULT_SIMPLE_ONBOARDING_CONFIG);
  }, []);

  const contextValue: SimpleOnboardingContextType = {
    config,
    updateItem,
    toggleItem,
    addDocument,
    removeDocument,
    getItemsByCategory,
    resetToDefaults
  };

  return (
    <SimpleOnboardingContext.Provider value={contextValue}>
      {children}
    </SimpleOnboardingContext.Provider>
  );
}

export function useSimpleOnboarding(): SimpleOnboardingContextType {
  const context = useContext(SimpleOnboardingContext);
  if (context === undefined) {
    throw new Error('useSimpleOnboarding must be used within a SimpleOnboardingProvider');
  }
  return context;
}





