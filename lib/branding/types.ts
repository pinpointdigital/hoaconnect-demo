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

export interface UtilityCompany {
  name: string;
  website: string;
  logo?: string;
}

export interface BrandingAssets {
  communityImages?: {
    url: string;
    file: File | null;
  }[];
  headerImage?: {
    url: string;
    file: File | null;
  };
  utilityCompanies?: UtilityCompany[];
}

export interface HOAUserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface ServiceCredentials {
  twilio?: {
    accountSid?: string;
    authToken?: string;
    phoneNumber?: string;
  };
  sendGrid?: {
    apiKey?: string;
    fromEmail?: string;
    fromName?: string;
  };
}

export interface BrandingConfig {
  hoaInfo: HOAInfo;
  assets: BrandingAssets;
  hoaUsers?: {
    captain?: HOAUserProfile;
    boardMember?: HOAUserProfile;
    management?: HOAUserProfile;
  };
  serviceCredentials?: ServiceCredentials;
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
  updateHOAUsers: (users: Partial<BrandingConfig['hoaUsers']>) => void;
  updateServiceCredentials: (credentials: Partial<ServiceCredentials>) => void;
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

export const DEFAULT_HOA_USERS = {
  captain: {
    name: "Sarah Johnson",
    email: "president@samplehoa.com",
    phone: "(949) 555-0101",
    role: "HOA President"
  },
  boardMember: {
    name: "Mike Chen",
    email: "board@samplehoa.com", 
    phone: "(949) 555-0102",
    role: "Board Member"
  },
  management: {
    name: "ProManage HOA Services",
    email: "contact@promanage.demo",
    phone: "(949) 555-0200",
    role: "Management Company"
  }
};

export const DEFAULT_SERVICE_CREDENTIALS: ServiceCredentials = {
  twilio: {
    accountSid: '',
    authToken: '',
    phoneNumber: ''
  },
  sendGrid: {
    apiKey: '',
    fromEmail: '',
    fromName: ''
  }
};

const DEFAULT_UTILITY_COMPANIES: UtilityCompany[] = [
  { name: 'Southern California Edison', website: 'https://sce.com', logo: 'https://via.placeholder.com/120x60/003366/FFFFFF?text=SCE' },
  { name: 'Los Angeles Dept of Water & Power', website: 'https://ladwp.com', logo: 'https://via.placeholder.com/120x60/0066CC/FFFFFF?text=LADWP' },
  { name: 'Republic Services', website: 'https://republicservices.com', logo: 'https://via.placeholder.com/120x60/00AA44/FFFFFF?text=Republic' },
  { name: 'Spectrum', website: 'https://spectrum.com', logo: 'https://via.placeholder.com/120x60/CC0000/FFFFFF?text=Spectrum' },
];

export const DEFAULT_BRANDING_CONFIG: BrandingConfig = {
  hoaInfo: DEFAULT_HOA_INFO,
  assets: {
    utilityCompanies: DEFAULT_UTILITY_COMPANIES
  },
  hoaUsers: DEFAULT_HOA_USERS,
  serviceCredentials: DEFAULT_SERVICE_CREDENTIALS,
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
