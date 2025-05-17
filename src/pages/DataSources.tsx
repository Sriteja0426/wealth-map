import React, { useState } from 'react';
import { 
  Database, 
  ArrowUpDown, 
  ExternalLink, 
  Clock, 
  Shield, 
  RefreshCw, 
  AlertTriangle,
  Plus,
  X,
  Check,
  Settings
} from 'lucide-react';
import { mockDataSources } from '../mocks/mockData';

interface DataSourceFormData {
  name: string;
  type: string;
  url: string;
  apiKey: string;
  scanFrequency: string;
}

const DataSources: React.FC = () => {
  const [dataSources, setDataSources] = useState(mockDataSources);
  const [addSourceDialogOpen, setAddSourceDialogOpen] = useState(false);
  const [newDataSource, setNewDataSource] = useState<DataSourceFormData>({
    name: '',
    type: '',
    url: '',
    apiKey: '',
    scanFrequency: 'daily'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState<Record<string, boolean>>({});

  // Handle input change for new data source form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDataSource(prev => ({ ...prev, [name]: value }));
  };

  // Add new data source
  const handleAddDataSource = () => {
    // Validate form
    if (!newDataSource.name || !newDataSource.type || !newDataSource.url) {
      return;
    }
    
    // Add new data source to list
    const newDataSourceObj = {
      id: `source-${Date.now()}`,
      name: newDataSource.name,
      type: newDataSource.type,
      lastSync: new Date().toISOString(),
      recordCount: 0,
      status: 'Active' as 'Active' | 'Inactive' | 'Error',
      confidenceScore: 0.9
    };
    
    setDataSources([...dataSources, newDataSourceObj]);
    
    // Reset form and close dialog
    setNewDataSource({
      name: '',
      type: '',
      url: '',
      apiKey: '',
      scanFrequency: 'daily'
    });
    setAddSourceDialogOpen(false);
    
    // Show success message
    setSuccessMessage(`Data source ${newDataSource.name} has been added successfully.`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Refresh data source
  const handleRefreshDataSource = (sourceId: string) => {
    setIsRefreshing(prev => ({ ...prev, [sourceId]: true }));
    
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(prev => ({ ...prev, [sourceId]: false }));
      
      // Update last sync time
      setDataSources(dataSources.map(source => 
        source.id === sourceId 
          ? { ...source, lastSync: new Date().toISOString() } 
          : source
      ));
      
      // Show success message
      const dataSource = dataSources.find(source => source.id === sourceId);
      if (dataSource) {
        setSuccessMessage(`Data source ${dataSource.name} has been refreshed successfully.`);
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    }, 2000);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffHrs < 24) {
      return `${Math.round(diffHrs)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Data Sources</h1>
        
        <button
          onClick={() => setAddSourceDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Data Source
        </button>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-success-50 border-l-4 border-success-500 p-4 rounded-md animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-success-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-success-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Data sources summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-sm rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-neutral-500">Total Data Sources</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">{dataSources.length}</p>
                <p className="ml-2 text-sm text-success-600 flex items-center">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  All connected
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success-100 flex items-center justify-center">
              <Check className="h-5 w-5 text-success-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-neutral-500">Data Records</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">
                  {dataSources.reduce((sum, source) => sum + source.recordCount, 0).toLocaleString()}
                </p>
                <p className="ml-2 text-sm text-success-600 flex items-center">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  Updated daily
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-neutral-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-neutral-500">Average Confidence</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">
                  {(dataSources.reduce((sum, source) => sum + source.confidenceScore, 0) / dataSources.length * 100).toFixed(1)}%
                </p>
                <p className="ml-2 text-sm text-neutral-600 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Trending up
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data sources list */}
      <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
        <div className="px-4 py-5 border-b border-neutral-200 sm:px-6">
          <h3 className="text-lg font-medium text-neutral-900">Connected Data Sources</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Manage and monitor your data connections
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Records
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Last Sync
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {dataSources.map((source) => (
                <tr key={source.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                        <Database className="h-5 w-5 text-neutral-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {source.name}
                        </div>
                        <div className="text-xs text-neutral-500 flex items-center mt-1">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Connected to API
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {source.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {source.recordCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-neutral-400" />
                      {formatDate(source.lastSync)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      source.status === 'Active' 
                        ? 'bg-success-100 text-success-800' 
                        : source.status === 'Error'
                        ? 'bg-error-100 text-error-800'
                        : 'bg-warning-100 text-warning-800'
                    }`}>
                      {source.status === 'Active' && <span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-1 animate-pulse-slow"></span>}
                      {source.status === 'Error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {source.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${source.confidenceScore >= 0.9 ? 'bg-success-500' : 
                            source.confidenceScore >= 0.8 ? 'bg-primary-500' : 'bg-warning-500'}`} 
                          style={{ width: `${source.confidenceScore * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-neutral-700">
                        {Math.round(source.confidenceScore * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleRefreshDataSource(source.id)}
                      className={`text-primary-600 hover:text-primary-900 mr-3 ${isRefreshing[source.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isRefreshing[source.id]}
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing[source.id] ? 'animate-spin' : ''}`} />
                      <span className="sr-only">Refresh</span>
                    </button>
                    <button className="text-neutral-600 hover:text-neutral-900">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add data source dialog */}
      {addSourceDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-neutral-900">Add New Data Source</h3>
              <button
                onClick={() => setAddSourceDialogOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Data Source Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newDataSource.name}
                  onChange={handleInputChange}
                  placeholder="e.g., County Property Records"
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
                  Data Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={newDataSource.type}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Property Data">Property Data</option>
                  <option value="Financial Data">Financial Data</option>
                  <option value="Company Data">Company Data</option>
                  <option value="Property Value">Property Value</option>
                  <option value="Public Records">Public Records</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-neutral-700 mb-1">
                  API Endpoint URL
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={newDataSource.url}
                  onChange={handleInputChange}
                  placeholder="https://api.example.com/data"
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-neutral-700 mb-1">
                  API Key / Access Token
                </label>
                <input
                  type="password"
                  id="apiKey"
                  name="apiKey"
                  value={newDataSource.apiKey}
                  onChange={handleInputChange}
                  placeholder="Enter your API key"
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="scanFrequency" className="block text-sm font-medium text-neutral-700 mb-1">
                  Sync Frequency
                </label>
                <select
                  id="scanFrequency"
                  name="scanFrequency"
                  value={newDataSource.scanFrequency}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setAddSourceDialogOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDataSource}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Connect Data Source
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSources;