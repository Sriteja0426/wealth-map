import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Building, 
  User, 
  Calendar, 
  DollarSign, 
  Tag, 
  ArrowLeft,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  BarChart2,
  Target,
  Activity,
  Home
} from 'lucide-react';
import { getPropertyById, Property } from '../mocks/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  date: string;
  value: number;
}

// Generate historical value chart data
const generateHistoricalData = (property: Property): ChartDataPoint[] => {
  const currentValue = property.value;
  const lastSaleDate = new Date(property.lastSale.date);
  const lastSalePrice = property.lastSale.price;
  
  // Generate 5 years of quarterly data
  const data: ChartDataPoint[] = [];
  const currentDate = new Date();
  
  // Start from 5 years ago
  const startDate = new Date(currentDate);
  startDate.setFullYear(currentDate.getFullYear() - 5);
  
  // Generate data points (one per quarter)
  let quarterDate = new Date(startDate);
  let baseValue = lastSalePrice * 0.8; // Start at 80% of last sale price
  
  while (quarterDate <= currentDate) {
    // Add some variability, but trend upward
    const randomFactor = 1 + (Math.random() * 0.04 - 0.01); // -1% to +3%
    baseValue = baseValue * randomFactor;
    
    // If after the last sale date, use a different growth pattern
    if (quarterDate >= lastSaleDate) {
      const timeSinceSale = quarterDate.getTime() - lastSaleDate.getTime();
      const yearsSinceSale = timeSinceSale / (1000 * 60 * 60 * 24 * 365);
      
      // Interpolate between last sale price and current value
      baseValue = lastSalePrice + (currentValue - lastSalePrice) * (yearsSinceSale / ((currentDate.getTime() - lastSaleDate.getTime()) / (1000 * 60 * 60 * 24 * 365)));
      
      // Add some randomness
      baseValue = baseValue * (1 + (Math.random() * 0.02 - 0.01)); // -1% to +1%
    }
    
    data.push({
      date: quarterDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      value: Math.round(baseValue)
    });
    
    // Add 3 months
    quarterDate.setMonth(quarterDate.getMonth() + 3);
  }
  
  // Make sure the last point is the current value
  data[data.length - 1].value = currentValue;
  
  return data;
};

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'property-details': true,
    'owner-info': true,
    'financial-data': false,
    'transaction-history': false,
    'location-info': false
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'documents'>('overview');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (id) {
      const propertyData = getPropertyById(id);
      setProperty(propertyData || null);
      
      if (propertyData) {
        setChartData(generateHistoricalData(propertyData));
      }
      
      setLoading(false);
    }
  }, [id]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-slow">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Property Not Found</h2>
        <p className="text-neutral-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/map" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Property Map
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center text-sm mb-2">
            <Link to="/map" className="text-neutral-500 hover:text-neutral-700">Property Map</Link>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="text-neutral-900 font-medium">Property Details</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">{property.address}</h1>
          <p className="text-neutral-600 mt-1">
            {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Share2 className="mr-2 h-4 w-4 text-neutral-500" />
            Share
          </button>
          
          <button className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Download className="mr-2 h-4 w-4 text-neutral-500" />
            Export
          </button>
        </div>
      </div>
      
      {/* Property content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property images */}
          <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src={property.images[0]} 
                alt={property.address}
                className="object-cover w-full"
              />
            </div>
            <div className="p-4 grid grid-cols-4 gap-2">
              {property.images.map((image, index) => (
                <div key={index} className={`aspect-w-4 aspect-h-3 overflow-hidden rounded-md ${index === 0 ? 'ring-2 ring-primary-500' : ''}`}>
                  <img src={image} alt={`${property.address} view ${index + 1}`} className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Tabs navigation */}
          <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
            <div className="border-b border-neutral-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'analytics'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'documents'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  Documents
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Property Details */}
                  <div>
                    <div 
                      className="flex justify-between items-center cursor-pointer" 
                      onClick={() => toggleSection('property-details')}
                    >
                      <h3 className="text-lg font-medium text-neutral-900">Property Details</h3>
                      {expandedSections['property-details'] ? (
                        <ChevronUp className="h-5 w-5 text-neutral-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-neutral-500" />
                      )}
                    </div>
                    
                    {expandedSections['property-details'] && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <Building className="mt-0.5 h-5 w-5 text-neutral-400 mr-3" />
                            <div>
                              <h4 className="text-sm font-medium text-neutral-900">Property Type</h4>
                              <p className="mt-1 text-sm text-neutral-600">{property.propertyType}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <MapPin className="mt-0.5 h-5 w-5 text-neutral-400 mr-3" />
                            <div>
                              <h4 className="text-sm font-medium text-neutral-900">Size</h4>
                              <p className="mt-1 text-sm text-neutral-600">{property.size.toLocaleString()} square feet</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <Calendar className="mt-0.5 h-5 w-5 text-neutral-400 mr-3" />
                            <div>
                              <h4 className="text-sm font-medium text-neutral-900">Year Built</h4>
                              <p className="mt-1 text-sm text-neutral-600">{property.yearBuilt}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <Tag className="mt-0.5 h-5 w-5 text-neutral-400 mr-3" />
                            <div>
                              <h4 className="text-sm font-medium text-neutral-900">Features</h4>
                              <ul className="mt-1 text-sm text-neutral-600 space-y-1">
                                {property.features.map((feature, index) => (
                                  <li key={index}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Owner Information */}
                  <div className="pt-4 border-t border-neutral-200">
                    <div 
                      className="flex justify-between items-center cursor-pointer" 
                      onClick={() => toggleSection('owner-info')}
                    >
                      <h3 className="text-lg font-medium text-neutral-900">Owner Information</h3>
                      {expandedSections['owner-info'] ? (
                        <ChevronUp className="h-5 w-5 text-neutral-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-neutral-500" />
                      )}
                    </div>
                    
                    {expandedSections['owner-info'] && (
                      <div className="mt-4">
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <User className="mt-0.5 h-5 w-5 text-neutral-400 mr-3" />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="text-sm font-medium text-neutral-900">{property.owner.name}</h4>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                                  {property.owner.type}
                                </span>
                              </div>
                              
                              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-neutral-500">Estimated Net Worth</p>
                                  <p className="text-sm font-medium text-neutral-900">
                                    {formatCurrency(property.owner.netWorth)}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-neutral-500">Confidence Score</p>
                                  <div className="flex items-center mt-1">
                                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary-600" 
                                        style={{ width: `${property.owner.confidenceScore * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="ml-2 text-xs font-medium text-neutral-700">
                                      {Math.round(property.owner.confidenceScore * 100)}%
                                    </span>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-neutral-500">Properties Owned</p>
                                  <p className="text-sm font-medium text-neutral-900">
                                    {property.owner.properties.length}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-neutral-500">Last Updated</p>
                                  <p className="text-sm font-medium text-neutral-900">
                                    {new Date(property.owner.lastUpdated).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-neutral-200">
                                <p className="text-xs font-medium text-neutral-700 mb-2">Data Sources</p>
                                <div className="space-y-2">
                                  {property.owner.dataSources.map((source, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        <ExternalLink className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                                        <span className="text-xs text-neutral-600">{source.name}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="text-xs text-neutral-500 mr-2">
                                          {new Date(source.lastUpdated).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          })}
                                        </span>
                                        <span className="inline-block w-12 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                          <span 
                                            className="h-full bg-primary-600 block" 
                                            style={{ width: `${source.confidenceScore * 100}%` }}
                                          ></span>
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Financial Data */}
                  <div className="pt-4 border-t border-neutral-200">
                    <div 
                      className="flex justify-between items-center cursor-pointer" 
                      onClick={() => toggleSection('financial-data')}
                    >
                      <h3 className="text-lg font-medium text-neutral-900">Financial Data</h3>
                      {expandedSections['financial-data'] ? (
                        <ChevronUp className="h-5 w-5 text-neutral-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-neutral-500" />
                      )}
                    </div>
                    
                    {expandedSections['financial-data'] && (
                      <div className="mt-4">
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <DollarSign className="mt-0.5 h-5 w-5 text-neutral-400 mr-3" />
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-neutral-900">Current Estimated Value</h4>
                                  <p className="mt-1 text-xl font-semibold text-neutral-900">
                                    {formatCurrency(property.value)}
                                  </p>
                                </div>
                                
                                <div className="mt-3 sm:mt-0">
                                  <h4 className="text-sm font-medium text-neutral-900">Last Sale</h4>
                                  <p className="mt-1 text-neutral-600 text-sm">
                                    {formatCurrency(property.lastSale.price)} <span className="text-xs text-neutral-500">on {formatDate(property.lastSale.date)}</span>
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-4 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                      dataKey="date" 
                                      tick={{ fontSize: 12 }} 
                                      tickFormatter={(value) => value.split(' ')[0]}
                                    />
                                    <YAxis 
                                      tick={{ fontSize: 12 }}
                                      tickFormatter={(value) => `$${value/1000}k`}
                                    />
                                    <Tooltip 
                                      formatter={(value) => [`${formatCurrency(value as number)}`, 'Value']}
                                      labelFormatter={(label) => `${label}`}
                                    />
                                    <Line 
                                      type="monotone" 
                                      dataKey="value" 
                                      stroke="#2563EB" 
                                      strokeWidth={2}
                                      activeDot={{ r: 6 }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                              
                              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                <div>
                                  <p className="text-xs text-neutral-500">1 Year Growth</p>
                                  <p className="text-sm font-medium text-success-600">+8.3%</p>
                                </div>
                                <div>
                                  <p className="text-xs text-neutral-500">3 Year Growth</p>
                                  <p className="text-sm font-medium text-success-600">+21.5%</p>
                                </div>
                                <div>
                                  <p className="text-xs text-neutral-500">5 Year Growth</p>
                                  <p className="text-sm font-medium text-success-600">+34.2%</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Transaction History */}
                  <div className="pt-4 border-t border-neutral-200">
                    <div 
                      className="flex justify-between items-center cursor-pointer" 
                      onClick={() => toggleSection('transaction-history')}
                    >
                      <h3 className="text-lg font-medium text-neutral-900">Transaction History</h3>
                      {expandedSections['transaction-history'] ? (
                        <ChevronUp className="h-5 w-5 text-neutral-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-neutral-500" />
                      )}
                    </div>
                    
                    {expandedSections['transaction-history'] && (
                      <div className="mt-4">
                        <div className="overflow-hidden border border-neutral-200 rounded-lg">
                          <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                                  Date
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                                  Transaction Type
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                                  Price
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                                  Buyer/Seller
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                              <tr>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  {formatDate(property.lastSale.date)}
                                </td>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  Sale
                                </td>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  {formatCurrency(property.lastSale.price)}
                                </td>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  {property.owner.name}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  Jan 15, 2020
                                </td>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  Sale
                                </td>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  {formatCurrency(property.lastSale.price * 0.85)}
                                </td>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  Previous Owner LLC
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  Mar 22, 2015
                                </td>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  Sale
                                </td>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  {formatCurrency(property.lastSale.price * 0.65)}
                                </td>
                                <td className="px-4 py-3 text-sm text-neutral-900">
                                  Original Owner
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Location Info */}
                  <div className="pt-4 border-t border-neutral-200">
                    <div 
                      className="flex justify-between items-center cursor-pointer" 
                      onClick={() => toggleSection('location-info')}
                    >
                      <h3 className="text-lg font-medium text-neutral-900">Location Information</h3>
                      {expandedSections['location-info'] ? (
                        <ChevronUp className="h-5 w-5 text-neutral-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-neutral-500" />
                      )}
                    </div>
                    
                    {expandedSections['location-info'] && (
                      <div className="mt-4">
                        <div className="bg-neutral-50 rounded-lg overflow-hidden">
                          <div className="aspect-w-16 aspect-h-9">
                            <img
                              src="https://images.pexels.com/photos/1769279/pexels-photo-1769279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                              alt="Map view"
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-neutral-600 mb-2">
                              {property.address}, {property.city}, {property.state} {property.zipCode}
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-neutral-500">Neighborhood</p>
                                <p className="text-sm font-medium text-neutral-900">Downtown</p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-500">School District</p>
                                <p className="text-sm font-medium text-neutral-900">Central USD</p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-500">Flood Zone</p>
                                <p className="text-sm font-medium text-neutral-900">Zone X (Low Risk)</p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-500">Zoning</p>
                                <p className="text-sm font-medium text-neutral-900">{property.propertyType === 'Residential' ? 'R-1' : 'C-2'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-neutral-900 mb-4">Property Value Comparison</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }} 
                            tickFormatter={(value) => value.split(' ')[0]}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${value/1000}k`}
                          />
                          <Tooltip />
                          <Line 
                            name="Property Value" 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#2563EB" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            name="Market Average" 
                            type="monotone" 
                            dataKey={(entry) => entry.value * 0.9} 
                            stroke="#10B981" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-end mt-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-primary-600 rounded-full mr-1"></span>
                          <span className="text-xs text-neutral-700">This Property</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-success-600 rounded-full mr-1"></span>
                          <span className="text-xs text-neutral-700">Market Average</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-neutral-900">Investment Potential</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-success-100 text-success-800">
                          High
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">5-Year ROI Potential</span>
                            <span className="font-medium text-success-600">+42.1%</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-full bg-success-500" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">Area Growth Potential</span>
                            <span className="font-medium text-success-600">+35.8%</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-full bg-success-500" style={{ width: '72%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">Market Stability</span>
                            <span className="font-medium">High</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500" style={{ width: '90%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-neutral-900 mb-4">Ownership Network</h3>
                      <div className="flex flex-col items-center justify-center h-40">
                        <Home className="h-10 w-10 text-primary-500 mb-3" />
                        <p className="text-sm text-neutral-900 font-medium">{property.owner.name}</p>
                        <p className="text-xs text-neutral-500 mt-1">Controls {property.owner.properties.length} properties</p>
                        <p className="text-xs text-neutral-500 mt-0.5">Total Value: {formatCurrency(property.owner.netWorth * 0.75)}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-neutral-200">
                        <button className="w-full text-xs text-primary-600 hover:text-primary-700 font-medium">
                          View Full Ownership Graph →
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-neutral-900 mb-4">Market Trends</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-success-500 mr-2"></div>
                        <p className="text-sm flex-1">Property values in this area have increased 12.4% year-over-year</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-success-500 mr-2"></div>
                        <p className="text-sm flex-1">Average days on market: 28 (down from 45 last year)</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-warning-500 mr-2"></div>
                        <p className="text-sm flex-1">New development planned 0.5 miles away may impact values</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-success-500 mr-2"></div>
                        <p className="text-sm flex-1">Property tax assessments expected to increase 5% this year</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="border border-neutral-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            Document Name
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            Type
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            Date
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-200">
                        <tr>
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            Deed of Trust
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            Legal
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            {formatDate(property.lastSale.date)}
                          </td>
                          <td className="px-4 py-3 text-sm text-primary-600 font-medium">
                            <button className="hover:text-primary-800">Download</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            Property Assessment
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            Financial
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            Dec 15, 2024
                          </td>
                          <td className="px-4 py-3 text-sm text-primary-600 font-medium">
                            <button className="hover:text-primary-800">Download</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            Tax Records (2024)
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            Financial
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            Jan 30, 2024
                          </td>
                          <td className="px-4 py-3 text-sm text-primary-600 font-medium">
                            <button className="hover:text-primary-800">Download</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            Floor Plans
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            Property
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            {formatDate(property.lastSale.date)}
                          </td>
                          <td className="px-4 py-3 text-sm text-primary-600 font-medium">
                            <button className="hover:text-primary-800">Download</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            Title Insurance Policy
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            Insurance
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            {formatDate(property.lastSale.date)}
                          </td>
                          <td className="px-4 py-3 text-sm text-primary-600 font-medium">
                            <button className="hover:text-primary-800">Download</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-neutral-900 mb-3">Upload Documents</h3>
                    <p className="text-xs text-neutral-500 mb-3">
                      Add property-related documents to your intelligence database
                    </p>
                    <div className="mt-2 flex items-center">
                      <button className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <Upload className="h-4 w-4 mr-2 text-neutral-500" />
                        Select Files
                      </button>
                      <span className="ml-3 text-xs text-neutral-500">
                        Maximum file size: 20MB
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Property summary card */}
          <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
            <div className="p-4 bg-primary-50 border-b border-primary-100">
              <h3 className="font-medium text-primary-900">Property Summary</h3>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="text-lg font-semibold text-neutral-900">{formatCurrency(property.value)}</h4>
                <span className="text-xs text-success-600 font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% YoY
                </span>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Property Type</span>
                  <span className="text-sm font-medium text-neutral-900">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Size</span>
                  <span className="text-sm font-medium text-neutral-900">{property.size.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Year Built</span>
                  <span className="text-sm font-medium text-neutral-900">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Last Sale</span>
                  <span className="text-sm font-medium text-neutral-900">{formatCurrency(property.lastSale.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Sale Date</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {new Date(property.lastSale.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Owner</span>
                  <span className="text-sm font-medium text-neutral-900">{property.owner.name}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <Download className="mr-2 h-4 w-4" />
                  Export Property Data
                </button>
              </div>
            </div>
          </div>
          
          {/* Data intelligence card */}
          <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
            <div className="p-4 bg-accent-50 border-b border-accent-100">
              <h3 className="font-medium text-accent-900">Intelligence Metrics</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-neutral-600">Data Completeness</span>
                    <span className="text-xs font-medium text-neutral-900">92%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-success-500" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-neutral-600">Overall Confidence</span>
                    <span className="text-xs font-medium text-neutral-900">85%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-neutral-600">Valuation Accuracy</span>
                    <span className="text-xs font-medium text-neutral-900">88%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500" style={{ width: '88%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-neutral-600">Owner Profile Completeness</span>
                    <span className="text-xs font-medium text-neutral-900">79%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-warning-500" style={{ width: '79%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  <span className="text-xs text-neutral-500">Last updated: 2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Similar properties card */}
          <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <h3 className="font-medium text-neutral-900">Similar Properties</h3>
            </div>
            <div className="divide-y divide-neutral-200">
              {mockProperties.filter(p => p.id !== property.id).slice(0, 3).map(p => (
                <Link 
                  key={p.id}
                  to={`/properties/${p.id}`}
                  className="block p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                      <img src={p.images[0]} alt={p.address} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 line-clamp-1">{p.address}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">{p.city}, {p.state}</p>
                      <p className="text-sm font-medium text-neutral-900 mt-1">{formatCurrency(p.value)}</p>
                      <div className="flex items-center mt-0.5">
                        <span className="text-xs text-neutral-500">{p.propertyType} • {p.size.toLocaleString()} sq ft</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="p-3 bg-neutral-50 border-t border-neutral-200">
              <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                View More Similar Properties
              </button>
            </div>
          </div>
          
          {/* AI analysis card */}
          <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
            <div className="p-4 bg-success-50 border-b border-success-100">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-success-900">AI Analysis</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  <span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-1 animate-pulse-slow"></span>
                  Updated
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-2">
                <BarChart2 className="h-4 w-4 text-neutral-400 mt-0.5" />
                <p className="text-sm text-neutral-600">
                  This property is in the top 15% of value for its neighborhood.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Target className="h-4 w-4 text-neutral-400 mt-0.5" />
                <p className="text-sm text-neutral-600">
                  Predicted to appreciate 8.3% in the next 12 months.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Activity className="h-4 w-4 text-neutral-400 mt-0.5" />
                <p className="text-sm text-neutral-600">
                  The owner has 5 similar holdings in adjacent neighborhoods.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-neutral-400 mt-0.5" />
                <p className="text-sm text-neutral-600">
                  Recent infrastructure improvements should positively impact value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;