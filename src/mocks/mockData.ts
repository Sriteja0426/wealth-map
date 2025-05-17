import { User, Company, Property, Owner, SavedSearch, ActivityLog, DataSourceInfo } from '../types';

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'john.doe@acme.com',
    fullName: 'John Doe',
    role: 'Admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    companyId: 'company-001',
    lastLogin: '2025-04-23T14:32:21Z',
    twoFactorEnabled: true
  },
  {
    id: 'user-002',
    email: 'jane.smith@acme.com',
    fullName: 'Jane Smith',
    role: 'Analyst',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100',
    companyId: 'company-001',
    lastLogin: '2025-04-22T10:15:43Z',
    twoFactorEnabled: false
  },
  {
    id: 'user-003',
    email: 'michael.johnson@acme.com',
    fullName: 'Michael Johnson',
    role: 'Viewer',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
    companyId: 'company-001',
    lastLogin: '2025-04-21T16:45:12Z',
    twoFactorEnabled: true
  }
];

// Mock companies
export const mockCompanies: Company[] = [
  {
    id: 'company-001',
    name: 'Acme Real Estate Analytics',
    logo: 'https://images.pexels.com/photos/12628400/pexels-photo-12628400.jpeg?auto=compress&cs=tinysrgb&w=100',
    address: '123 Main Street, Suite 500',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    phone: '(415) 555-1234',
    website: 'www.acmerea.com',
    dateRegistered: '2023-01-15T00:00:00Z',
    plan: 'Enterprise',
    usersCount: 12
  }
];

// Mock owners
export const mockOwners: Owner[] = [
  {
    id: 'owner-001',
    name: 'John Smith',
    type: 'Individual',
    netWorth: 15000000,
    confidenceScore: 0.85,
    properties: ['property-001', 'property-003'],
    lastUpdated: '2025-03-15T12:30:45Z',
    dataSources: [
      {
        name: 'Property Records',
        lastUpdated: '2025-03-15T12:30:45Z',
        confidenceScore: 0.92
      },
      {
        name: 'Credit Bureau',
        lastUpdated: '2025-02-28T09:14:22Z',
        confidenceScore: 0.78
      }
    ]
  },
  {
    id: 'owner-002',
    name: 'Oceanview Holdings LLC',
    type: 'Company',
    netWorth: 98000000,
    confidenceScore: 0.92,
    properties: ['property-002', 'property-004', 'property-005'],
    lastUpdated: '2025-03-22T14:25:12Z',
    dataSources: [
      {
        name: 'Corporate Filings',
        lastUpdated: '2025-03-22T14:25:12Z',
        confidenceScore: 0.95
      },
      {
        name: 'Business Credit',
        lastUpdated: '2025-03-01T11:08:33Z',
        confidenceScore: 0.89
      }
    ]
  }
];

// Mock properties
export const mockProperties: Property[] = [
  {
    id: 'property-001',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    lat: 40.7128,
    lng: -74.006,
    propertyType: 'Residential',
    size: 2500,
    value: 1850000,
    lastSale: {
      date: '2023-05-12T00:00:00Z',
      price: 1750000
    },
    yearBuilt: 1998,
    owner: mockOwners[0],
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    features: ['4 Bedrooms', '3 Bathrooms', 'Garage', 'Swimming Pool']
  },
  {
    id: 'property-002',
    address: '456 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    lat: 37.7749,
    lng: -122.4194,
    propertyType: 'Commercial',
    size: 15000,
    value: 12500000,
    lastSale: {
      date: '2022-08-03T00:00:00Z',
      price: 11000000
    },
    yearBuilt: 2005,
    owner: mockOwners[1],
    images: [
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    features: ['Office Space', '3 Floors', 'Parking Garage', 'Conference Rooms']
  },
  {
    id: 'property-003',
    address: '789 Park Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10021',
    lat: 40.7725,
    lng: -73.9630,
    propertyType: 'Residential',
    size: 4200,
    value: 6500000,
    lastSale: {
      date: '2021-11-15T00:00:00Z',
      price: 5800000
    },
    yearBuilt: 1912,
    owner: mockOwners[0],
    images: [
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    features: ['5 Bedrooms', '4.5 Bathrooms', 'Doorman', 'Terrace']
  },
  {
    id: 'property-004',
    address: '101 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    lat: 37.7850,
    lng: -122.3980,
    propertyType: 'Commercial',
    size: 25000,
    value: 28000000,
    lastSale: {
      date: '2022-03-20T00:00:00Z',
      price: 25000000
    },
    yearBuilt: 2018,
    owner: mockOwners[1],
    images: [
      'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    features: ['Modern Office', '5 Floors', 'Cafeteria', 'Green Building Certified']
  },
  {
    id: 'property-005',
    address: '222 Jefferson Avenue',
    city: 'Miami',
    state: 'FL',
    zipCode: '33139',
    lat: 25.7617,
    lng: -80.1918,
    propertyType: 'Mixed Use',
    size: 18000,
    value: 19500000,
    lastSale: {
      date: '2023-01-10T00:00:00Z',
      price: 17800000
    },
    yearBuilt: 2010,
    owner: mockOwners[1],
    images: [
      'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    features: ['Retail First Floor', 'Residential Upper Floors', 'Beachfront View', 'Pool Deck']
  }
];

// Generate more properties across the US for the map
export const generateMoreProperties = (): Property[] => {
  const baseProperties = [...mockProperties];
  
  // Add 100 more properties with randomized data
  const cities = [
    { city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
    { city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
    { city: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },
    { city: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740 },
    { city: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652 },
    { city: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936 },
    { city: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611 },
    { city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970 },
    { city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
    { city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 }
  ];
  
  const propertyTypes: Array<Property['propertyType']> = ['Residential', 'Commercial', 'Industrial', 'Land', 'Mixed Use'];
  
  for (let i = 0; i < 100; i++) {
    const cityInfo = cities[Math.floor(Math.random() * cities.length)];
    const latOffset = (Math.random() - 0.5) * 0.2;
    const lngOffset = (Math.random() - 0.5) * 0.2;
    
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const owner = mockOwners[Math.floor(Math.random() * mockOwners.length)];
    
    const size = propertyType === 'Residential' 
      ? 1000 + Math.floor(Math.random() * 5000)
      : 5000 + Math.floor(Math.random() * 50000);
    
    const value = propertyType === 'Residential'
      ? 500000 + Math.floor(Math.random() * 5000000)
      : 2000000 + Math.floor(Math.random() * 30000000);
    
    baseProperties.push({
      id: `property-${1000 + i}`,
      address: `${1000 + Math.floor(Math.random() * 9000)} ${['Main', 'Oak', 'Maple', 'Pine', 'Cedar'][Math.floor(Math.random() * 5)]} ${['St', 'Ave', 'Blvd', 'Dr', 'Ln'][Math.floor(Math.random() * 5)]}`,
      city: cityInfo.city,
      state: cityInfo.state,
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      lat: cityInfo.lat + latOffset,
      lng: cityInfo.lng + lngOffset,
      propertyType,
      size,
      value,
      lastSale: {
        date: `202${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}T00:00:00Z`,
        price: value - Math.floor(Math.random() * 1000000)
      },
      yearBuilt: 1960 + Math.floor(Math.random() * 63),
      owner,
      images: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ],
      features: ['Feature 1', 'Feature 2', 'Feature 3']
    });
  }
  
  return baseProperties;
};

// Mock saved searches
export const mockSavedSearches: SavedSearch[] = [
  {
    id: 'search-001',
    name: 'High Value SF Properties',
    createdAt: '2025-04-01T15:30:22Z',
    createdBy: 'user-001',
    filters: {
      propertyType: ['Commercial', 'Mixed Use'],
      valueMin: 10000000,
      city: 'San Francisco',
      state: 'CA'
    }
  },
  {
    id: 'search-002',
    name: 'NY Residential Properties',
    createdAt: '2025-03-27T09:12:14Z',
    createdBy: 'user-002',
    filters: {
      propertyType: ['Residential'],
      sizeMin: 2000,
      city: 'New York',
      state: 'NY'
    }
  }
];

// Mock activity logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'activity-001',
    userId: 'user-001',
    userName: 'John Doe',
    userRole: 'Admin',
    action: 'Viewed Property',
    details: 'Viewed property details for 123 Main Street',
    timestamp: '2025-04-23T14:35:12Z',
    ip: '192.168.1.101'
  },
  {
    id: 'activity-002',
    userId: 'user-002',
    userName: 'Jane Smith',
    userRole: 'Analyst',
    action: 'Exported Data',
    details: 'Exported property data for High Value SF Properties search',
    timestamp: '2025-04-23T11:22:04Z',
    ip: '192.168.1.102'
  },
  {
    id: 'activity-003',
    userId: 'user-003',
    userName: 'Michael Johnson',
    userRole: 'Viewer',
    action: 'Created Search',
    details: 'Created and saved new search: Miami Properties',
    timestamp: '2025-04-22T16:05:45Z',
    ip: '192.168.1.103'
  },
  {
    id: 'activity-004',
    userId: 'user-001',
    userName: 'John Doe',
    userRole: 'Admin',
    action: 'Added User',
    details: 'Added new user: sarah.parker@acme.com with Analyst role',
    timestamp: '2025-04-22T10:15:32Z',
    ip: '192.168.1.101'
  },
  {
    id: 'activity-005',
    userId: 'user-002',
    userName: 'Jane Smith',
    userRole: 'Analyst',
    action: 'Generated Report',
    details: 'Generated property valuation report for San Francisco market',
    timestamp: '2025-04-21T14:45:21Z',
    ip: '192.168.1.102'
  }
];

// Mock data source info
export const mockDataSources: DataSourceInfo[] = [
  {
    id: 'source-001',
    name: 'County Property Records',
    type: 'Property Data',
    lastSync: '2025-04-22T23:45:12Z',
    recordCount: 15420,
    status: 'Active',
    confidenceScore: 0.95
  },
  {
    id: 'source-002',
    name: 'Credit Bureau API',
    type: 'Financial Data',
    lastSync: '2025-04-21T12:30:45Z',
    recordCount: 12250,
    status: 'Active',
    confidenceScore: 0.82
  },
  {
    id: 'source-003',
    name: 'Business Registry',
    type: 'Company Data',
    lastSync: '2025-04-20T08:15:33Z',
    recordCount: 8753,
    status: 'Active',
    confidenceScore: 0.88
  },
  {
    id: 'source-004',
    name: 'Tax Assessment Database',
    type: 'Property Value',
    lastSync: '2025-04-19T15:22:08Z',
    recordCount: 18650,
    status: 'Active',
    confidenceScore: 0.91
  }
];

// Get all properties
export const getAllProperties = (): Property[] => {
  return generateMoreProperties();
};

// Get property by ID
export const getPropertyById = (id: string): Property | undefined => {
  return mockProperties.find(property => property.id === id);
};

// Get current user
export const getCurrentUser = (): User => {
  return mockUsers[0]; // Default to first user (admin)
};

// Get company info
export const getCompanyInfo = (): Company => {
  return mockCompanies[0];
};

// Search properties
export const searchProperties = (filters: SearchFilters): Property[] => {
  let results = mockProperties;
  
  if (filters.propertyType && filters.propertyType.length > 0) {
    results = results.filter(property => filters.propertyType?.includes(property.propertyType));
  }
  
  if (filters.valueMin) {
    results = results.filter(property => property.value >= (filters.valueMin || 0));
  }
  
  if (filters.valueMax) {
    results = results.filter(property => property.value <= (filters.valueMax || Infinity));
  }
  
  if (filters.sizeMin) {
    results = results.filter(property => property.size >= (filters.sizeMin || 0));
  }
  
  if (filters.sizeMax) {
    results = results.filter(property => property.size <= (filters.sizeMax || Infinity));
  }
  
  if (filters.state) {
    results = results.filter(property => property.state === filters.state);
  }
  
  if (filters.city) {
    results = results.filter(property => property.city === filters.city);
  }
  
  if (filters.zipCode) {
    results = results.filter(property => property.zipCode === filters.zipCode);
  }
  
  return results;
};

// Get activity logs
export const getActivityLogs = (): ActivityLog[] => {
  return mockActivityLogs;
};