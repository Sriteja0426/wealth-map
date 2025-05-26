import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  DollarSign, 
  Calendar, 
  Layers, 
  User, 
  X,
  Clock,
  Home,
  Info,
  History,
  FileText
} from 'lucide-react';
import { getAllProperties, Property, SearchFilters } from '../mocks/mockData';
import * as turf from '@turf/turf';

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
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
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
  const [hoveredParcel, setHoveredParcel] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'owner' | 'history'>('details');

  useEffect(() => {
    const allProperties = getAllProperties();
    setProperties(allProperties);
    setFilteredProperties(allProperties);
  }, []);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setActiveTab('details');
    
    // Generate mock parcel boundary
    const center = [property.lat, property.lng];
    const radius = 0.001; // Roughly 100 meters
    const points = 32;
    
    const circle = turf.circle(center, radius, { steps: points });
    setHoveredParcel(circle);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (value.trim() === '') {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(property => 
        property.address.toLowerCase().includes(value.toLowerCase()) ||
        property.city.toLowerCase().includes(value.toLowerCase()) ||
        property.owner.name.toLowerCase().includes(value.toLowerCase()) ||
        property.zipCode.includes(value)
      );
      setFilteredProperties(filtered);
    }
  };

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
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col rounded-lg overflow-hidden border border-neutral-200 bg-white shadow-sm">
      {/* Property map header */}
      <div className="p-4 border-b border-neutral-200 bg-white z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search by address, owner name, or zip code..."
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
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
      </div>
      
      {/* Map content with sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Map view */}
        <div className="flex-1 relative">
          <MapContainer
            center={[39.8283, -98.5795]}
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
            
            {hoveredParcel && (
              <GeoJSON
                data={hoveredParcel}
                style={{
                  color: '#2563eb',
                  weight: 2,
                  opacity: 0.8,
                  fillColor: '#3b82f6',
                  fillOpacity: 0.2
                }}
              />
            )}
            
            <MarkerClusterGroup>
              {filteredProperties.map(property => (
                <Marker 
                  key={property.id} 
                  position={[property.lat, property.lng]}
                  eventHandlers={{
                    click: () => handlePropertyClick(property),
                    mouseover: () => {
                      const circle = turf.circle([property.lat, property.lng], 0.001, { steps: 32 });
                      setHoveredParcel(circle);
                    },
                    mouseout: () => {
                      if (!selectedProperty || selectedProperty.id !== property.id) {
                        setHoveredParcel(null);
                      }
                    }
                  }}
                >
                  <Popup>
                    <div className="w-60">
                      <h3 className="font-medium text-neutral-900">{property.address}</h3>
                      <p className="text-sm text-neutral-500">{property.city}, {property.state}</p>
                      <button
                        onClick={() => handlePropertyClick(property)}
                        className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                      >
                        View Details →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>

        {/* Property details sidebar */}
        {selectedProperty && (
          <div className="absolute top-0 right-0 h-full w-96 bg-white border-l border-neutral-200 overflow-auto shadow-lg animate-slide-in">
            <div className="sticky top-0 bg-white z-10">
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                <h3 className="font-medium text-neutral-900">Property Details</h3>
                <button 
                  onClick={() => {
                    setSelectedProperty(null);
                    setHoveredParcel(null);
                  }}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation tabs */}
              <div className="flex border-b border-neutral-200">
                <button
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    activeTab === 'details'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  <Home className="h-4 w-4 inline-block mr-1" />
                  Property
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    activeTab === 'owner'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                  onClick={() => setActiveTab('owner')}
                >
                  <User className="h-4 w-4 inline-block mr-1" />
                  Owner
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    activeTab === 'history'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                  onClick={() => setActiveTab('history')}
                >
                  <History className="h-4 w-4 inline-block mr-1" />
                  History
                </button>
              </div>
            </div>

            <div className="p-4">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Property images */}
                  <div className="aspect-w-16 aspect-h-9 bg-neutral-100 rounded-lg overflow-hidden">
                    <img 
                      src={selectedProperty.images[0]} 
                      alt={selectedProperty.address}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Basic info */}
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {selectedProperty.address}
                    </h2>
                    <p className="text-neutral-600 mt-1">
                      {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}
                    </p>
                  </div>

                  {/* Key details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center text-neutral-600">
                        <Building className="h-4 w-4 mr-2" />
                        Property Type
                      </div>
                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        {selectedProperty.propertyType}
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center text-neutral-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        Land Use
                      </div>
                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        {selectedProperty.landUse}
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center text-neutral-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Value
                      </div>
                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        {formatCurrency(selectedProperty.value)}
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center text-neutral-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Year Built
                      </div>
                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        {selectedProperty.yearBuilt}
                      </p>
                    </div>
                  </div>

                  {/* Geographic info */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-neutral-900 mb-3">
                      Geographic Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Neighborhood Code</span>
                        <span className="font-medium text-neutral-900">
                          {selectedProperty.neighborhoodCode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Latitude</span>
                        <span className="font-medium text-neutral-900">
                          {selectedProperty.lat.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Longitude</span>
                        <span className="font-medium text-neutral-900">
                          {selectedProperty.lng.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'owner' && (
                <div className="space-y-6">
                  {/* Owner information */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-neutral-900 mb-3">
                      Owner Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-neutral-500">Deeded Owner</label>
                        <p className="text-sm font-medium text-neutral-900">
                          {selectedProperty.owner.deeded}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-500">Assessor Record</label>
                        <p className="text-sm font-medium text-neutral-900">
                          {selectedProperty.owner.assessor}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-500">Mailing Address</label>
                        <p className="text-sm font-medium text-neutral-900">
                          {selectedProperty.owner.mailingAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Wealth information */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-neutral-900 mb-3">
                      Wealth Assessment
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-neutral-500">Estimated Net Worth</label>
                        <p className="text-sm font-medium text-neutral-900">
                          {selectedProperty.owner.netWorth}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-500">Confidence Score</label>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-600" 
                              style={{ width: `${selectedProperty.owner.confidenceScore * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium text-neutral-900">
                            {Math.round(selectedProperty.owner.confidenceScore * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6">
                  {/* Ownership history */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-neutral-900 mb-3">
                      Ownership History
                    </h3>
                    <div className="space-y-4">
                      {selectedProperty.ownershipHistory?.map((record, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-4 w-4 mt-0.5">
                            <div className="h-full w-0.5 bg-neutral-200 mx-auto"></div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-neutral-900">
                              {record.owner}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {formatDate(record.saleDate)} • {record.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data sources */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-neutral-900 mb-3">
                      Data Sources
                    </h3>
                    <div className="space-y-3">
                      {selectedProperty.owner.dataSources.map((source, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-neutral-900">
                              {source.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              Updated {formatDate(source.lastUpdated)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-neutral-900 mr-2">
                              {Math.round(source.confidenceScore * 100)}%
                            </span>
                            <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary-600" 
                                style={{ width: `${source.confidenceScore * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyMap;