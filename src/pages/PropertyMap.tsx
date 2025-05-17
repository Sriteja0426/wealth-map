import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Search, Filter, MapPin, Building, DollarSign, Calendar, Layers, User } from 'lucide-react';
import { getAllProperties, Property, SearchFilters } from '../mocks/mockData';

// Fix marker icon issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom fit bounds component
function FitBoundsToMarkers({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(property => [property.lat, property.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, properties]);

  return null;
}

const PropertyMap: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    propertyType: [],
    valueMin: undefined,
    valueMax: undefined,
    sizeMin: undefined,
    sizeMax: undefined,
  });
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  useEffect(() => {
    // Fetch all properties
    const allProperties = getAllProperties();
    setProperties(allProperties);
    setFilteredProperties(allProperties);
  }, []);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (value.trim() === '') {
      // Reset to all properties when search is cleared
      setFilteredProperties(properties);
    } else {
      // Filter properties based on search
      const filtered = properties.filter(property => 
        property.address.toLowerCase().includes(value.toLowerCase()) ||
        property.city.toLowerCase().includes(value.toLowerCase()) ||
        property.owner.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    let filtered = [...properties];
    
    // Filter by property type
    if (filters.propertyType && filters.propertyType.length > 0) {
      filtered = filtered.filter(property => filters.propertyType?.includes(property.propertyType));
    }
    
    // Filter by value range
    if (filters.valueMin) {
      filtered = filtered.filter(property => property.value >= (filters.valueMin || 0));
    }
    
    if (filters.valueMax) {
      filtered = filtered.filter(property => property.value <= (filters.valueMax || Infinity));
    }
    
    // Filter by size range
    if (filters.sizeMin) {
      filtered = filtered.filter(property => property.size >= (filters.sizeMin || 0));
    }
    
    if (filters.sizeMax) {
      filtered = filtered.filter(property => property.size <= (filters.sizeMax || Infinity));
    }
    
    setFilteredProperties(filtered);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      propertyType: [],
      valueMin: undefined,
      valueMax: undefined,
      sizeMin: undefined,
      sizeMax: undefined,
    });
    setFilteredProperties(properties);
  };

  const togglePropertyType = (type: Property['propertyType']) => {
    setFilters(prev => {
      const currentTypes = prev.propertyType || [];
      
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          propertyType: currentTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          propertyType: [...currentTypes, type]
        };
      }
    });
  };
  
  const propertyTypes: Property['propertyType'][] = ['Residential', 'Commercial', 'Industrial', 'Land', 'Mixed Use'];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col rounded-lg overflow-hidden border border-neutral-200 bg-white shadow-sm">
      {/* Property map header */}
      <div className="p-4 border-b border-neutral-200 bg-white z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-neutral-900">Property Map</h1>
        
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search address, city, or owner..."
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-3 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          
          <button
            onClick={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
            className="inline-flex items-center px-3 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Layers className="h-4 w-4 mr-2" />
            {mapType === 'standard' ? 'Satellite' : 'Standard'}
          </button>
        </div>
      </div>
      
      {/* Map content with sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Filter sidebar */}
        {isFilterOpen && (
          <div className="absolute inset-0 z-20 md:relative md:w-80 bg-white border-r border-neutral-200 overflow-auto animate-slide-in">
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="font-medium text-neutral-900">Filters</h3>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="text-neutral-500 hover:text-neutral-700 md:hidden"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Property Type */}
              <div>
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Property Type</h4>
                <div className="space-y-2">
                  {propertyTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.propertyType?.includes(type) || false}
                        onChange={() => togglePropertyType(type)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm text-neutral-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Value Range */}
              <div>
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Property Value</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="valueMin" className="block text-xs text-neutral-500 mb-1">
                      Min
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-neutral-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="valueMin"
                        id="valueMin"
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-300 rounded-md"
                        placeholder="0"
                        value={filters.valueMin || ''}
                        onChange={(e) => handleFilterChange('valueMin', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="valueMax" className="block text-xs text-neutral-500 mb-1">
                      Max
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-neutral-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="valueMax"
                        id="valueMax"
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-300 rounded-md"
                        placeholder="Any"
                        value={filters.valueMax || ''}
                        onChange={(e) => handleFilterChange('valueMax', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Size Range */}
              <div>
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Property Size (sq ft)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="sizeMin" className="block text-xs text-neutral-500 mb-1">
                      Min
                    </label>
                    <input
                      type="number"
                      name="sizeMin"
                      id="sizeMin"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full px-3 py-2 sm:text-sm border-neutral-300 rounded-md"
                      placeholder="0"
                      value={filters.sizeMin || ''}
                      onChange={(e) => handleFilterChange('sizeMin', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <label htmlFor="sizeMax" className="block text-xs text-neutral-500 mb-1">
                      Max
                    </label>
                    <input
                      type="number"
                      name="sizeMax"
                      id="sizeMax"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full px-3 py-2 sm:text-sm border-neutral-300 rounded-md"
                      placeholder="Any"
                      value={filters.sizeMax || ''}
                      onChange={(e) => handleFilterChange('sizeMax', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="pt-4 border-t border-neutral-200 flex justify-between">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm text-neutral-700 hover:text-neutral-900"
                >
                  Reset filters
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Map view */}
        <div className="flex-1 relative">
          <MapContainer
            center={[39.8283, -98.5795]} // Center of US
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url={mapType === 'standard' 
                ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <FitBoundsToMarkers properties={filteredProperties} />
            <MarkerClusterGroup>
              {filteredProperties.map(property => (
                <Marker 
                  key={property.id} 
                  position={[property.lat, property.lng]}
                  eventHandlers={{
                    click: () => handlePropertyClick(property),
                  }}
                >
                  <Popup>
                    <div className="w-60 sm:w-72">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-medium text-neutral-900 truncate flex-1">
                          {property.address}
                        </h3>
                        <Link
                          to={`/properties/${property.id}`}
                          className="ml-2 text-xs text-primary-600 hover:text-primary-800"
                        >
                          View
                        </Link>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {property.city}, {property.state} {property.zipCode}
                      </p>
                      
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <Building className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                          <span className="text-xs text-neutral-700">{property.propertyType}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                          <span className="text-xs text-neutral-700">{property.size.toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                          <span className="text-xs text-neutral-700">{formatCurrency(property.value)}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                          <span className="text-xs text-neutral-700">Built {property.yearBuilt}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-neutral-200">
                        <div className="flex items-center">
                          <User className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                          <span className="text-xs font-medium text-neutral-700">Owner: {property.owner.name}</span>
                        </div>
                        <div className="flex items-center mt-1 justify-between">
                          <span className="text-xs text-neutral-500">{property.owner.type}</span>
                          <span className="text-xs text-neutral-500">
                            Net Worth: {formatCurrency(property.owner.netWorth)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
          
          {/* Property info sidebar (when a property is selected) */}
          {selectedProperty && (
            <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-neutral-200 overflow-auto shadow-lg hidden lg:block animate-slide-in">
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                <h3 className="font-medium text-neutral-900">Property Details</h3>
                <button 
                  onClick={() => setSelectedProperty(null)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-md">
                  <img 
                    src={selectedProperty.images[0]} 
                    alt={selectedProperty.address}
                    className="object-cover"
                  />
                </div>
                
                <h2 className="text-lg font-semibold text-neutral-900">
                  {selectedProperty.address}
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}
                </p>
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-500">Property Type</p>
                    <p className="text-sm font-medium text-neutral-900">{selectedProperty.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Size</p>
                    <p className="text-sm font-medium text-neutral-900">{selectedProperty.size.toLocaleString()} sq ft</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Estimated Value</p>
                    <p className="text-sm font-medium text-neutral-900">{formatCurrency(selectedProperty.value)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Year Built</p>
                    <p className="text-sm font-medium text-neutral-900">{selectedProperty.yearBuilt}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <h3 className="text-sm font-medium text-neutral-900">Last Sale</h3>
                  <div className="mt-2 flex justify-between">
                    <p className="text-sm text-neutral-600">{formatDate(selectedProperty.lastSale.date)}</p>
                    <p className="text-sm font-medium text-neutral-900">{formatCurrency(selectedProperty.lastSale.price)}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <h3 className="text-sm font-medium text-neutral-900">Owner Information</h3>
                  <div className="mt-2">
                    <p className="text-sm text-neutral-900 font-medium">{selectedProperty.owner.name}</p>
                    <p className="text-xs text-neutral-500 mt-1">Type: {selectedProperty.owner.type}</p>
                    <div className="mt-2 flex justify-between">
                      <p className="text-xs text-neutral-500">Estimated Net Worth:</p>
                      <p className="text-sm font-medium text-neutral-900">{formatCurrency(selectedProperty.owner.netWorth)}</p>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <p className="text-xs text-neutral-500">Confidence Score:</p>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-neutral-900 mr-1">
                          {Math.round(selectedProperty.owner.confidenceScore * 100)}%
                        </span>
                        <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-600" 
                            style={{ width: `${selectedProperty.owner.confidenceScore * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link
                    to={`/properties/${selectedProperty.id}`}
                    className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;