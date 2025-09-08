/**
 * HOA Connect Branding System Types
 * Defines interfaces for demo personalization and branding
 */

export interface HOAInfo {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  admin: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
  };
  presentedTo?: string;
}

export interface BrandingAssets {
  communityImages?: {
    url: string;
    file: File | null;
  }[];
}

export interface BrandingConfig {
  hoaInfo: HOAInfo;
  assets: BrandingAssets;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  lastUpdated: Date;
}

export interface BrandingContextType {
  config: BrandingConfig;
  updateHOAInfo: (info: Partial<HOAInfo>) => void;
  updateAssets: (assets: Partial<BrandingAssets>) => void;
  updateTheme: (theme: Partial<BrandingConfig['theme']>) => void;
  resetToDefaults: () => void;
  softReset: () => void;
  isConfigured: boolean;
}

export const DEFAULT_HOA_INFO: HOAInfo = {
  name: "Sample HOA Community",
  address: {
    street: "123 Community Drive",
    city: "San Juan Capistrano",
    state: "CA",
    zip: "92675"
  },
  admin: {
    name: "John Smith",
    role: "HOA President",
    email: "president@samplehoa.com",
    phone: "(949) 555-0123"
  },
  presentedTo: "Presented to: Sample HOA Board"
};

export const DEFAULT_BRANDING_CONFIG: BrandingConfig = {
  hoaInfo: DEFAULT_HOA_INFO,
  assets: {},
  theme: {
    primaryColor: "#1e40af",
    secondaryColor: "#f1f5f9"
  },
  lastUpdated: new Date()
};

export type ResetType = 'soft' | 'full';

export interface BrandingStorageData {
  config: BrandingConfig;
  version: string;
}
