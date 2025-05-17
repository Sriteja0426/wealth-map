export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  avatar: string;
  companyId: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website: string;
  dateRegistered: string;
  plan: 'Free' | 'Professional' | 'Enterprise';
  usersCount: number;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Land' | 'Mixed Use';
  size: number; // square feet
  value: number;
  lastSale: {
    date: string;
    price: number;
  };
  yearBuilt: number;
  owner: Owner;
  images: string[];
  features: string[];
}

export interface Owner {
  id: string;
  name: string;
  type: 'Individual' | 'Company' | 'Trust' | 'Government';
  netWorth: number;
  confidenceScore: number;
  properties: string[]; // array of property IDs
  lastUpdated: string;
  dataSources: {
    name: string;
    lastUpdated: string;
    confidenceScore: number;
  }[];
}

export interface SavedSearch {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  filters: SearchFilters;
}

export interface SearchFilters {
  propertyType?: string[];
  valueMin?: number;
  valueMax?: number;
  sizeMin?: number;
  sizeMax?: number;
  ownerNetWorthMin?: number;
  ownerNetWorthMax?: number;
  state?: string;
  city?: string;
  zipCode?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface DataSourceInfo {
  id: string;
  name: string;
  type: string;
  lastSync: string;
  recordCount: number;
  status: 'Active' | 'Inactive' | 'Error';
  confidenceScore: number;
}