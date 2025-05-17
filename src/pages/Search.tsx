import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Filter, 
  Star, 
  Download, 
  Building,
  MapPin,
  Calendar,
  DollarSign,
  User,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { Property, SearchFilters, mockProperties, mockSavedSearches } from '../mocks/mockData';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    propertyType: [],
    valueMin: undefined,
    valueMax: undefined,
    sizeMin: undefined,
    sizeMax: undefined,
    ownerNetWorthMin: undefined,
    ownerNetWorthMax: undefined,
    state: undefined,
    city: undefined,
    zipCode: undefined,
  });
  const [results, setResults] = useState<Property[]>(mockProperties);
  const [savedSearches, setSavedSearches] = useState(mockSavedSearches);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  
  const propertyTypes: Array<Property['propertyType']> = ['Residential', 'Commercial', 'Industrial', 'Land', 'Mixed Use'];
  
  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Toggle property type filter
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
  
  // Apply filters
  const applyFilters = () => {
    // In a real app, this would call an API with the filters
    // For now, we'll just simulate filtering the mock data
    let filtered = [...mockProperties];
    
    // Filter by property type
    if (filters.propertyType && filters.propertyType.length > 0) {
      filtered = filtered.filter(property => filters.propertyType?.includes(property.propertyType));
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.address.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.state.toLowerCase().includes(query) ||
        property.zipCode.includes(query) ||
        property.owner.name.toLowerCase().includes(query)
      );
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
    
    // Filter by owner net worth
    if (filters.ownerNetWorthMin) {
      filtered = filtered.filter(property => property.owner.netWorth >= (filters.ownerNetWorthMin || 0));
    }
    
    if (filters.ownerNetWorthMax) {
      filtered = filtered.filter(property => property.owner.netWorth <= (filters.ownerNetWorthMax || Infinity));
    }
    
    // Filter by location
    if (filters.state) {
      filtered = filtered.filter(property => property.state === filters.state);
    }
    
    if (filters.city) {
      filtered = filtered.filter(property => property.city === filters.city);
    }
    
    if (filters.zipCode) {
      filtered = filtered.filter(property => property.zipCode === filters.zipCode);
    }
    
    setResults(filtered);
    setIsFiltersOpen(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      propertyType: [],
      valueMin: undefined,
      valueMax: undefined,
      sizeMin: undefined,
      sizeMax: undefined,
      ownerNetWorthMin: undefined,
      ownerNetWorthMax: undefined,
      state: undefined,
      city: undefined,
      zipCode: undefined,
    });
    setSearchQuery('');
    setResults(mockProperties);
  };
  
  // Save current search
  const handleSaveSearch = () => {
    if (!newSearchName.trim()) return;
    
    const newSearch = {
      id: `search-${Date.now()}`,
      name: newSearchName,
      createdAt: new Date().toISOString(),
      createdBy: 'user-001',
      filters: filters
    };
    
    setSavedSearches([...savedSearches, newSearch]);
    setNewSearchName('');
    setSaveDialogOpen(false);
  };
  
  // Load a saved search
  const loadSavedSearch = (searchId: string) => {
    const savedSearch = savedSearches.find(search => search.id === searchId);
    if (savedSearch) {
      setFilters(savedSearch.filters);
      applyFilters();
    }
  };
  
  // Delete a saved search
  const deleteSavedSearch = (searchId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedSearches(savedSearches.filter(search => search.id !== searchId));
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

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Property Search</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSaveDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Star className="mr-2 h-4 w-4 text-neutral-500" />
            Save Search
          </button>
          
          <button className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Download className="mr-2 h-4 w-4 text-neutral-500" />
            Export Results
          </button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by address, city, owner name..."
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters {Object.values(filters).some(v => v !== undefined && v.length !== 0) && '(Active)'}
            </button>
            
            <button
              onClick={applyFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </button>
          </div>
          
          {/* Filters panel */}
          {isFiltersOpen && (
            <div className="mt-4 pt-4 border-t border-neutral-200 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 mb-2">Property Type</h3>
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
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 mb-2">Value & Size</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        Property Value Range
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.valueMin || ''}
                            onChange={(e) => handleFilterChange('valueMin', e.target.value ? Number(e.target.value) : undefined)}
                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-300 rounded-md"
                          />
                        </div>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.valueMax || ''}
                            onChange={(e) => handleFilterChange('valueMax', e.target.value ? Number(e.target.value) : undefined)}
                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        Property Size (sq ft)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.sizeMin || ''}
                          onChange={(e) => handleFilterChange('sizeMin', e.target.value ? Number(e.target.value) : undefined)}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full px-3 py-2 sm:text-sm border-neutral-300 rounded-md"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.sizeMax || ''}
                          onChange={(e) => handleFilterChange('sizeMax', e.target.value ? Number(e.target.value) : undefined)}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full px-3 py-2 sm:text-sm border-neutral-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 mb-2">Owner & Location</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        Owner Net Worth
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.ownerNetWorthMin || ''}
                            onChange={(e) => handleFilterChange('ownerNetWorthMin', e.target.value ? Number(e.target.value) : undefined)}
                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-300 rounded-md"
                          />
                        </div>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.ownerNetWorthMax || ''}
                            onChange={(e) => handleFilterChange('ownerNetWorthMax', e.target.value ? Number(e.target.value) : undefined)}
                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          placeholder="State (e.g. CA)"
                          value={filters.state || ''}
                          onChange={(e) => handleFilterChange('state', e.target.value || undefined)}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full px-3 py-2 sm:text-sm border-neutral-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="City"
                          value={filters.city || ''}
                          onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full px-3 py-2 sm:text-sm border-neutral-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between">
                <button
                  onClick={resetFilters}
                  className="text-sm text-neutral-700 hover:text-neutral-900"
                >
                  Reset all filters
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Saved searches */}
        {savedSearches.length > 0 && (
          <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Saved Searches</h3>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map(search => (
                <button
                  key={search.id}
                  onClick={() => loadSavedSearch(search.id)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white border border-neutral-300 text-neutral-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700"
                >
                  <Star className="h-3.5 w-3.5 mr-1.5 text-accent-500" />
                  {search.name}
                  <button
                    onClick={(e) => deleteSavedSearch(search.id, e)}
                    className="ml-1.5 text-neutral-400 hover:text-error-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Search results */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-neutral-900">Search Results ({results.length})</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-500">Sort by:</span>
              <select className="text-sm border-none focus:ring-0 text-neutral-700 pr-8 py-1 bg-transparent">
                <option>Property Value: High to Low</option>
                <option>Property Value: Low to High</option>
                <option>Most Recent</option>
                <option>Owner Net Worth</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-warning-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-1">No properties found</h3>
                <p className="text-neutral-600 mb-4">Try adjusting your search criteria or filters.</p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              results.map(property => (
                <div 
                  key={property.id} 
                  className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-hover-card transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 lg:w-1/4">
                      <div className="h-48 md:h-full">
                        <img 
                          src={property.images[0]} 
                          alt={property.address}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-4 md:p-6 flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            <Link to={`/properties/${property.id}`} className="hover:text-primary-600">
                              {property.address}
                            </Link>
                          </h3>
                          <p className="text-neutral-600 mt-1">
                            {property.city}, {property.state} {property.zipCode}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 text-neutral-400 mr-1.5" />
                              <span className="text-sm text-neutral-700">{property.propertyType}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-neutral-400 mr-1.5" />
                              <span className="text-sm text-neutral-700">{property.size.toLocaleString()} sq ft</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-neutral-400 mr-1.5" />
                              <span className="text-sm text-neutral-700">Built {property.yearBuilt}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-neutral-400 mr-1.5" />
                              <span className="text-sm text-neutral-700">
                                {formatCurrency(property.value)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-neutral-200">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-neutral-400 mr-1.5" />
                              <div>
                                <span className="text-sm font-medium text-neutral-700">
                                  Owner: {property.owner.name}
                                </span>
                                <div className="flex items-center mt-1">
                                  <span className="text-xs text-neutral-500 mr-4">
                                    {property.owner.type}
                                  </span>
                                  <span className="text-xs text-neutral-500">
                                    Net Worth: {formatCurrency(property.owner.netWorth)}
                                  </span>
                                  <div className="ml-2 flex items-center">
                                    <span className="inline-block w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                      <span 
                                        className="h-full bg-primary-600 block" 
                                        style={{ width: `${property.owner.confidenceScore * 100}%` }}
                                      ></span>
                                    </span>
                                    <span className="ml-1 text-xs text-neutral-500">
                                      {Math.round(property.owner.confidenceScore * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex md:flex-col md:items-end space-x-2 md:space-x-0 md:space-y-2">
                          <div className="text-xl font-bold text-neutral-900">
                            {formatCurrency(property.value)}
                          </div>
                          <div className="hidden md:block text-sm text-neutral-500">
                            Last sale: {formatCurrency(property.lastSale.price)}
                          </div>
                          <div className="hidden md:flex flex-col space-y-2 mt-4">
                            <Link
                              to={`/properties/${property.id}`}
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {results.length > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-neutral-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{results.length}</span> of{' '}
                    <span className="font-medium">{results.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                      <span className="sr-only">Previous</span>
                      <ChevronUp className="h-5 w-5 rotate-270" />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-primary-50 text-sm font-medium text-primary-600">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 hidden sm:inline-flex">
                      3
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700">
                      ...
                    </span>
                    <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 hidden md:inline-flex">
                      8
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                      9
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                      10
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                      <span className="sr-only">Next</span>
                      <ChevronDown className="h-5 w-5 rotate-270" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Save search dialog */}
      {saveDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-neutral-900">Save this search</h3>
              <button
                onClick={() => setSaveDialogOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="searchName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Search Name
                </label>
                <input
                  type="text"
                  id="searchName"
                  value={newSearchName}
                  onChange={(e) => setNewSearchName(e.target.value)}
                  placeholder="E.g., High Value SF Properties"
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Search Criteria Summary</h4>
                <div className="text-sm text-neutral-600 space-y-1">
                  {searchQuery && (
                    <div className="flex items-center">
                      <SearchIcon className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                      <span>Query: "{searchQuery}"</span>
                    </div>
                  )}
                  
                  {filters.propertyType && filters.propertyType.length > 0 && (
                    <div className="flex items-center">
                      <Building className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                      <span>Types: {filters.propertyType.join(', ')}</span>
                    </div>
                  )}
                  
                  {(filters.valueMin || filters.valueMax) && (
                    <div className="flex items-center">
                      <DollarSign className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                      <span>
                        Value: {filters.valueMin ? `$${filters.valueMin.toLocaleString()}` : '$0'} - {filters.valueMax ? `$${filters.valueMax.toLocaleString()}` : 'Any'}
                      </span>
                    </div>
                  )}
                  
                  {(filters.state || filters.city) && (
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                      <span>
                        Location: {filters.city || ''} {filters.state || ''}
                      </span>
                    </div>
                  )}
                  
                  {(filters.ownerNetWorthMin || filters.ownerNetWorthMax) && (
                    <div className="flex items-center">
                      <User className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                      <span>
                        Owner Net Worth: {filters.ownerNetWorthMin ? `$${filters.ownerNetWorthMin.toLocaleString()}` : '$0'} - {filters.ownerNetWorthMax ? `$${filters.ownerNetWorthMax.toLocaleString()}` : 'Any'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                    <span>Results: {results.length} properties</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setSaveDialogOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSearch}
                  disabled={!newSearchName.trim()}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    !newSearchName.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Check className="h-4 w-4 mr-1.5 inline-block" />
                  Save Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;