'use client';

/**
 * HOA Connect Branding Context
 * React Context API for managing branding state across the application
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  BrandingConfig, 
  BrandingContextType, 
  HOAInfo, 
  BrandingAssets, 
  DEFAULT_BRANDING_CONFIG,
  ResetType
} from './types';
import { 
  saveBrandingConfig, 
  loadBrandingConfig, 
  clearBrandingConfig,
  migrateBrandingConfig
} from './storage';

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

interface BrandingProviderProps {
  children: React.ReactNode;
}

export function BrandingProvider({ children }: BrandingProviderProps) {
  const [config, setConfig] = useState<BrandingConfig>(DEFAULT_BRANDING_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize branding configuration on mount
  useEffect(() => {
    migrateBrandingConfig();
    const loadedConfig = loadBrandingConfig();
    setConfig(loadedConfig);
    setIsLoaded(true);
  }, []);

  // Save configuration whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveBrandingConfig(config);
    }
  }, [config, isLoaded]);

  const updateHOAInfo = useCallback((info: Partial<HOAInfo>) => {
    setConfig(prev => ({
      ...prev,
      hoaInfo: {
        ...prev.hoaInfo,
        ...info,
        // Handle nested address updates
        ...(info.address && {
          address: {
            ...prev.hoaInfo.address,
            ...info.address
          }
        }),
        // Handle nested admin updates
        ...(info.admin && {
          admin: {
            ...prev.hoaInfo.admin,
            ...info.admin
          }
        })
      },
      lastUpdated: new Date()
    }));
  }, []);

  const updateAssets = useCallback((assets: Partial<BrandingAssets>) => {
    setConfig(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        ...assets
      },
      lastUpdated: new Date()
    }));
  }, []);

  const updateTheme = useCallback((theme: Partial<BrandingConfig['theme']>) => {
    setConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...theme
      },
      lastUpdated: new Date()
    }));
  }, []);

  const softReset = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      // Keep branding info but reset demo activity data
      // This would clear things like seeded ARC requests, vendor activities, etc.
      // For now, just update the timestamp
      lastUpdated: new Date()
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    clearBrandingConfig();
    setConfig(DEFAULT_BRANDING_CONFIG);
  }, []);

  // Check if the HOA has been configured beyond defaults
  const isConfigured = config.hoaInfo.name !== DEFAULT_BRANDING_CONFIG.hoaInfo.name ||
                      config.hoaInfo.admin.name !== DEFAULT_BRANDING_CONFIG.hoaInfo.admin.name ||
                      Boolean(config.assets.communityImages && config.assets.communityImages.length > 0);

  const contextValue: BrandingContextType = {
    config,
    updateHOAInfo,
    updateAssets,
    updateTheme,
    resetToDefaults,
    softReset,
    isConfigured
  };

  return (
    <BrandingContext.Provider value={contextValue}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding(): BrandingContextType {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}

// Helper hooks for specific branding data
export function useHOAInfo() {
  const { config } = useBranding();
  return config.hoaInfo;
}

export function useBrandingAssets() {
  const { config } = useBranding();
  return config.assets;
}

export function useBrandingTheme() {
  const { config } = useBranding();
  return config.theme;
}
