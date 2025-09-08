/**
 * HOA Connect Branding Storage Utilities
 * Handles persistence of branding configuration in localStorage
 */

import { BrandingConfig, BrandingStorageData, DEFAULT_BRANDING_CONFIG } from './types';

const STORAGE_KEY = 'hoa-connect-branding';
const STORAGE_VERSION = '1.0.0';

/**
 * Save branding configuration to localStorage
 */
export function saveBrandingConfig(config: BrandingConfig): void {
  try {
    const storageData: BrandingStorageData = {
      config: {
        ...config,
        lastUpdated: new Date()
      },
      version: STORAGE_VERSION
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.warn('Failed to save branding configuration:', error);
  }
}

/**
 * Load branding configuration from localStorage
 */
export function loadBrandingConfig(): BrandingConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_BRANDING_CONFIG;
    }

    const storageData: BrandingStorageData = JSON.parse(stored);
    
    // Version compatibility check
    if (storageData.version !== STORAGE_VERSION) {
      console.warn('Branding config version mismatch, using defaults');
      return DEFAULT_BRANDING_CONFIG;
    }

    // Ensure lastUpdated is a Date object
    const config = {
      ...storageData.config,
      lastUpdated: new Date(storageData.config.lastUpdated)
    };

    return config;
  } catch (error) {
    console.warn('Failed to load branding configuration:', error);
    return DEFAULT_BRANDING_CONFIG;
  }
}

/**
 * Clear branding configuration from localStorage
 */
export function clearBrandingConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear branding configuration:', error);
  }
}

/**
 * Check if branding configuration exists in localStorage
 */
export function hasBrandingConfig(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Get branding configuration age in minutes
 */
export function getBrandingConfigAge(): number {
  try {
    const config = loadBrandingConfig();
    const now = new Date();
    const lastUpdated = new Date(config.lastUpdated);
    return Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60));
  } catch (error) {
    return 0;
  }
}

/**
 * Migrate old branding configurations if needed
 */
export function migrateBrandingConfig(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const data = JSON.parse(stored);
    
    // If no version field, it's an old format
    if (!data.version) {
      // Clear old format and let it reinitialize with defaults
      clearBrandingConfig();
    }
  } catch (error) {
    console.warn('Failed to migrate branding configuration:', error);
    clearBrandingConfig();
  }
}
