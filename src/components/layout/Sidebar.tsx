import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Search as SearchIcon, 
  Building2, 
  Users, 
  Database, 
  Activity, 
  Settings, 
  X, 
  Lock, 
  Shield,
  Building
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  user: User;
  mobile?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, mobile = false, onClose }) => {
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Property Map', path: '/map', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Search', path: '/search', icon: <SearchIcon className="w-5 h-5" /> },
    { name: 'Company', path: '/company', icon: <Building className="w-5 h-5" /> },
    // Admin-only items
    ...(user.role === 'Admin' ? [
      { name: 'User Management', path: '/users', icon: <Users className="w-5 h-5" /> },
    ] : []),
    { name: 'Data Sources', path: '/data-sources', icon: <Database className="w-5 h-5" /> },
    { name: 'Activity Logs', path: '/activity', icon: <Activity className="w-5 h-5" /> },
  ];

  const activeLinkClasses = "bg-primary-50 text-primary-700 font-medium";
  const linkClasses = "flex items-center px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors";

  return (
    <div className={`w-64 bg-white h-full border-r border-neutral-200 flex flex-col ${mobile ? 'pt-4' : 'pt-6'}`}>
      {/* Mobile close button */}
      {mobile && onClose && (
        <div className="flex justify-end px-4 mb-2">
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center">
          <Building2 className="w-8 h-8 text-primary-600" />
          <div className="ml-2">
            <h1 className="text-xl font-bold text-neutral-900">PropWealth</h1>
            <div className="flex items-center mt-0.5">
              <span className="text-xs font-medium text-primary-600">Intelligence Platform</span>
              <span className="text-xs ml-1.5 px-1.5 py-0.5 bg-accent-100 text-accent-800 rounded-full">BETA</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `${linkClasses} ${isActive ? activeLinkClasses : ''}`
            }
            end={item.path === '/'}
          >
            <span className="text-neutral-500 mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Security badge */}
      <div className="px-4 py-3 mt-4 mb-4">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-success-500" />
            <span className="ml-2 text-sm font-medium text-neutral-800">Data Protected</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-neutral-500">
            <Lock className="w-3 h-3 mr-1" />
            <span>End-to-end encryption</span>
          </div>
          <div className="mt-1 flex items-center text-xs text-neutral-500">
            <div className="w-1.5 h-1.5 bg-success-500 rounded-full mr-1"></div>
            <span>GDPR & CCPA Compliant</span>
          </div>
        </div>
      </div>
      
      {/* Settings and help */}
      <div className="px-3 pt-2 border-t border-neutral-200">
        <NavLink
          to="/settings"
          className={({ isActive }) => 
            `${linkClasses} ${isActive ? activeLinkClasses : ''}`
          }
        >
          <span className="text-neutral-500 mr-3">
            <Settings className="w-5 h-5" />
          </span>
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;