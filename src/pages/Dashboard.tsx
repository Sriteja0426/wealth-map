import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Building, 
  Search as SearchIcon, 
  MapPin, 
  ArrowUpRight, 
  HelpCircle,
  Activity,
  AlertTriangle,
  TrendingUp,
  BarChart2,
  Clock
} from 'lucide-react';
import { getCurrentUser, getActivityLogs, mockProperties, mockDataSources } from '../mocks/mockData';

const Dashboard: React.FC = () => {
  const currentUser = getCurrentUser();
  const activityLogs = getActivityLogs();
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600 mt-1">
            Welcome back, {currentUser.fullName}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <HelpCircle className="mr-2 h-4 w-4 text-neutral-500" />
            Help
          </button>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <BarChart2 className="mr-2 h-4 w-4" />
            Generate Report
          </button>
        </div>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-sm rounded-lg p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-neutral-500">Properties</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">{mockProperties.length}</p>
                <p className="ml-2 text-sm text-success-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3 this week
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
              <Building className="h-5 w-5 text-accent-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-neutral-500">Property Value</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">$68.3M</p>
                <p className="ml-2 text-sm text-success-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success-100 flex items-center justify-center">
              <SearchIcon className="h-5 w-5 text-success-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-neutral-500">Data Sources</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">{mockDataSources.length}</p>
                <p className="ml-2 text-sm text-success-600 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Updated 1h ago
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center">
              <User className="h-5 w-5 text-warning-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-neutral-500">Team Members</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">12</p>
                <p className="ml-2 text-sm text-neutral-500 flex items-center">
                  3 active now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick access */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-neutral-200">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link 
            to="/map" 
            className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            <MapPin className="h-6 w-6 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-neutral-800">Property Map</span>
          </Link>
          
          <Link 
            to="/search" 
            className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            <SearchIcon className="h-6 w-6 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-neutral-800">Search Properties</span>
          </Link>
          
          <Link 
            to="/data-sources" 
            className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            <Activity className="h-6 w-6 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-neutral-800">Data Sources</span>
          </Link>
          
          <Link 
            to="/users" 
            className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            <User className="h-6 w-6 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-neutral-800">User Management</span>
          </Link>
        </div>
      </div>
      
      {/* Recent activity and alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity logs */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-neutral-900">Recent Activity</h2>
            <Link to="/activity" className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center">
              View all
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          
          <div className="divide-y divide-neutral-200">
            {activityLogs.slice(0, 5).map(log => (
              <div key={log.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start">
                  <div className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-neutral-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-900">{log.userName}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">{log.details}</p>
                    <div className="mt-1 flex">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800">
                        {log.action}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Alerts and notifications */}
        <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-medium text-neutral-900">Alerts & Notifications</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="p-4 bg-warning-50 border-l-4 border-warning-500 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-warning-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-warning-800">
                    Data source requires attention
                  </h3>
                  <div className="mt-1">
                    <p className="text-sm text-warning-700">
                      Tax Assessment Database has not been updated in 5 days.
                    </p>
                  </div>
                  <div className="mt-2">
                    <button className="text-xs font-medium text-warning-800 hover:text-warning-900">
                      Check status →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-primary-50 border-l-4 border-primary-500 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <LayoutDashboard className="h-5 w-5 text-primary-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary-800">
                    New market report available
                  </h3>
                  <div className="mt-1">
                    <p className="text-sm text-primary-700">
                      Q2 2025 Market Analysis Report is now available.
                    </p>
                  </div>
                  <div className="mt-2">
                    <button className="text-xs font-medium text-primary-800 hover:text-primary-900">
                      View report →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-success-50 border-l-4 border-success-500 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-success-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-success-800">
                    Property value increase
                  </h3>
                  <div className="mt-1">
                    <p className="text-sm text-success-700">
                      3 properties in your portfolio have increased in value.
                    </p>
                  </div>
                  <div className="mt-2">
                    <button className="text-xs font-medium text-success-800 hover:text-success-900">
                      View details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;