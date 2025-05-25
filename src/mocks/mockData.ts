import { faker } from '@faker-js/faker';
import { User, Company, Property, Owner, SavedSearch, ActivityLog, DataSourceInfo } from '../types';

// Generate more realistic mock data for properties
const generateMockProperties = (count: number): Property[] => {
  const properties: Property[] = [];
  
  // Major US cities with their coordinates
  const cities = [
    { name: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740 },
    { name: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652 },
    { name: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936 },
    { name: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611 },
    { name: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970 },
    { name: 'San Jose', state: 'CA', lat: 37.3382, lng: -121.8863 },
    { name: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
    { name: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 },
    { name: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903 },
    { name: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589 },
    { name: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 }
  ];

  const propertyTypes: Array<Property['propertyType']> = [
    'Residential',
    'Commercial',
    'Industrial',
    'Land',
    'Mixed Use'
  ];

  const ownerTypes: Array<Owner['type']> = [
    'Individual',
    'Company',
    'Trust',
    'Government'
  ];

  const streetTypes = ['St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Rd', 'Way', 'Circle', 'Court'];
  const streetNames = ['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Washington', 'Lake', 'Hill', 'River'];

  for (let i = 0; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const ownerType = ownerTypes[Math.floor(Math.random() * ownerTypes.length)];
    
    const streetNumber = Math.floor(Math.random() * 9900) + 100;
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
    
    const owner: Owner = {
      id: `owner-${i}`,
      name: ownerType === 'Individual' 
        ? faker.person.fullName()
        : faker.company.name(),
      type: ownerType,
      netWorth: Math.floor(Math.random() * 100000000) + 1000000,
      confidenceScore: Math.random() * 0.3 + 0.7,
      properties: [`property-${i}`],
      lastUpdated: faker.date.recent().toISOString(),
      dataSources: [
        {
          name: 'Property Records',
          lastUpdated: faker.date.recent().toISOString(),
          confidenceScore: Math.random() * 0.2 + 0.8
        },
        {
          name: 'Financial Records',
          lastUpdated: faker.date.recent().toISOString(),
          confidenceScore: Math.random() * 0.2 + 0.8
        }
      ]
    };

    const property: Property = {
      id: `property-${i}`,
      address: `${streetNumber} ${streetName} ${streetType}`,
      city: city.name,
      state: city.state,
      zipCode: faker.location.zipCode(),
      lat: city.lat + latOffset,
      lng: city.lng + lngOffset,
      propertyType,
      size: Math.floor(Math.random() * 10000) + 1000,
      value: Math.floor(Math.random() * 5000000) + 500000,
      lastSale: {
        date: faker.date.past().toISOString(),
        price: Math.floor(Math.random() * 4000000) + 400000
      },
      yearBuilt: Math.floor(Math.random() * 70) + 1950,
      owner,
      images: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ],
      features: [
        `${Math.floor(Math.random() * 6) + 2} Bedrooms`,
        `${Math.floor(Math.random() * 4) + 1} Bathrooms`,
        'Parking',
        propertyType === 'Commercial' ? 'Office Space' : 'Living Room',
        Math.random() > 0.5 ? 'Pool' : 'Garden'
      ]
    };

    properties.push(property);
  }

  return properties;
};

// Generate 500 properties across different cities
export const mockProperties = generateMockProperties(500);

// Rest of the mock data remains unchanged
export const mockUsers = [
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

export const mockCompanies = [
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

export const mockSavedSearches = [
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

export const mockActivityLogs = [
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

export const mockDataSources = [
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

// Helper functions
export const getAllProperties = (): Property[] => {
  return mockProperties;
};

export const getPropertyById = (id: string): Property | undefined => {
  return mockProperties.find(property => property.id === id);
};

export const getCurrentUser = (): User => {
  return mockUsers[0];
};

export const getCompanyInfo = (): Company => {
  return mockCompanies[0];
};

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

export const getActivityLogs = (): ActivityLog[] => {
  return mockActivityLogs;
};