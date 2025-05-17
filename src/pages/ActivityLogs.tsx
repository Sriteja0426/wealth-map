import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  Download, 
  User, 
  Eye, 
  Edit, 
  Server,
  Shield,
  AlertTriangle,
  FileText,
  Calendar
} from 'lucide-react';
import { getActivityLogs, ActivityLog } from '../mocks/mockData';

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    dateRange: '7' // days
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    // Get activity logs
    const activityLogs = getActivityLogs();
    
    // Add more mock logs for demonstration
    const extraLogs: ActivityLog[] = [];
    for (let i = 0; i < 20; i++) {
      const baseLog = activityLogs[i % activityLogs.length];
      const daysAgo = Math.floor(Math.random() * 14);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      extraLogs.push({
        ...baseLog,
        id: `activity-${100 + i}`,
        timestamp: date.toISOString()
      });
    }
    
    setLogs([...activityLogs, ...extraLogs]);
    setFilteredLogs([...activityLogs, ...extraLogs]);
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    let filtered = [...logs];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.userName.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }
    
    if (filters.user) {
      filtered = filtered.filter(log => log.userId === filters.user);
    }
    
    if (filters.dateRange) {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= cutoffDate);
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setFilteredLogs(filtered);
  }, [logs, searchQuery, filters]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Get unique action types and users for filters
  const actionTypes = Array.from(new Set(logs.map(log => log.action)));
  const users = Array.from(new Set(logs.map(log => log.userId)))
    .map(userId => {
      const user = logs.find(log => log.userId === userId);
      return { id: userId, name: user?.userName || '' };
    });

  // Get icon for activity type
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'Viewed Property':
        return <Eye className="h-4 w-4 text-primary-500" />;
      case 'Exported Data':
        return <Download className="h-4 w-4 text-primary-500" />;
      case 'Created Search':
        return <Search className="h-4 w-4 text-primary-500" />;
      case 'Added User':
        return <User className="h-4 w-4 text-primary-500" />;
      case 'Generated Report':
        return <FileText className="h-4 w-4 text-primary-500" />;
      default:
        return <Server className="h-4 w-4 text-primary-500" />;
    }
  };

  // Format date relative to now
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  // Group logs by date
  const groupLogsByDate = (logs: ActivityLog[]) => {
    const grouped: Record<string, ActivityLog[]> = {};
    
    logs.forEach(log => {
      const date = new Date(log.timestamp);
      const dateKey = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(log);
    });
    
    return Object.entries(grouped).sort((a, b) => {
      const dateA = new Date(a[0]).getTime();
      const dateB = new Date(b[0]).getTime();
      return dateB - dateA; // Newest first
    });
  };

  const groupedLogs = groupLogsByDate(filteredLogs);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Activity Logs</h1>
        
        <button
          className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Download className="mr-2 h-4 w-4 text-neutral-500" />
          Export Logs
        </button>
      </div>
      
      {/* Security badge */}
      <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-success-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-neutral-900">Secure Audit Trail</h3>
            <p className="text-sm text-neutral-600 mt-1">
              All user actions are securely logged with timestamps, IP addresses, and user details for compliance and security.
            </p>
          </div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs by user, action, or details..."
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </button>
          </div>
          
          {/* Filters panel */}
          {isFiltersOpen && (
            <div className="mt-4 pt-4 border-t border-neutral-200 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="action" className="block text-sm font-medium text-neutral-700 mb-1">
                    Action Type
                  </label>
                  <select
                    id="action"
                    name="action"
                    value={filters.action}
                    onChange={handleFilterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Actions</option>
                    {actionTypes.map(action => (
                      <option key={action} value={action}>{action}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="user" className="block text-sm font-medium text-neutral-700 mb-1">
                    User
                  </label>
                  <select
                    id="user"
                    name="user"
                    value={filters.user}
                    onChange={handleFilterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Users</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dateRange" className="block text-sm font-medium text-neutral-700 mb-1">
                    Time Period
                  </label>
                  <select
                    id="dateRange"
                    name="dateRange"
                    value={filters.dateRange}
                    onChange={handleFilterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="1">Last 24 Hours</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="">All Time</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Close Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Activity logs */}
        <div className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-neutral-900">Activity History</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Showing {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
              </p>
            </div>
            
            <div className="text-sm text-neutral-500 flex items-center">
              <Clock className="h-4 w-4 mr-1.5" />
              All times in your local timezone
            </div>
          </div>
          
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-warning-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-1">No activity logs found</h3>
              <p className="text-neutral-600 mb-4">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedLogs.map(([date, logs]) => (
                <div key={date}>
                  <div className="relative py-3">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-neutral-400 mr-2" />
                      <h3 className="text-sm font-medium text-neutral-900">{date}</h3>
                    </div>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-neutral-200" />
                    </div>
                  </div>
                  
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {logs.map((log, logIdx) => (
                        <li key={log.id}>
                          <div className="relative pb-8">
                            {logIdx !== logs.length - 1 ? (
                              <span
                                className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-neutral-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                              <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center ring-8 ring-white">
                                  {getActivityIcon(log.action)}
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div>
                                  <div className="text-sm">
                                    <span className="font-medium text-neutral-900">{log.userName}</span>{' '}
                                    <span className="text-neutral-500">{log.action}</span>
                                  </div>
                                  <p className="mt-0.5 text-sm text-neutral-500">
                                    {formatRelativeDate(log.timestamp)} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <div className="mt-2 text-sm text-neutral-700">
                                  <p>{log.details}</p>
                                </div>
                                <div className="mt-2 flex items-center text-xs text-neutral-500">
                                  <div className="flex items-center mr-3">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    <span>{log.userRole}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Server className="h-3.5 w-3.5 mr-1" />
                                    <span>IP: {log.ip}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Load more button */}
        {filteredLogs.length > 0 && (
          <div className="px-4 py-4 border-t border-neutral-200">
            <button
              type="button"
              className="relative block w-full rounded-lg border-2 border-dashed border-neutral-300 p-4 text-center hover:border-neutral-400 focus:outline-none"
            >
              <span className="text-sm font-medium text-primary-600">Load more activity</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;