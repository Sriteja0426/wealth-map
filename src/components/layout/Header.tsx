import React, { useState } from 'react';
import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm z-10">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left: Mobile menu button and search */}
        <div className="flex items-center">
          <button 
            type="button" 
            className="md:hidden inline-flex items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 p-2 mr-2"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden sm:flex items-center ml-4 bg-neutral-100 rounded-full py-2 px-4">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search properties, owners..."
              className="ml-2 bg-transparent border-none focus:outline-none text-sm text-neutral-800 placeholder:text-neutral-500 w-64"
            />
          </div>
        </div>
        
        {/* Right: User info, notifications */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-neutral-100 relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-5 w-5 text-neutral-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-800">Notifications</h3>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-neutral-50 border-l-4 border-primary-500">
                    <p className="text-sm font-medium text-neutral-800">New property added in San Francisco</p>
                    <p className="text-xs text-neutral-500 mt-1">10 minutes ago</p>
                  </div>
                  
                  <div className="px-4 py-3 hover:bg-neutral-50">
                    <p className="text-sm font-medium text-neutral-800">Market report ready for Q2 2025</p>
                    <p className="text-xs text-neutral-500 mt-1">1 hour ago</p>
                  </div>
                  
                  <div className="px-4 py-3 hover:bg-neutral-50">
                    <p className="text-sm font-medium text-neutral-800">Jane Smith added a new saved search</p>
                    <p className="text-xs text-neutral-500 mt-1">Yesterday at 4:30 PM</p>
                  </div>
                </div>
                
                <div className="px-4 py-2 border-t border-neutral-200">
                  <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User menu */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <img 
                src={user.avatar} 
                alt={user.fullName} 
                className="w-8 h-8 rounded-full object-cover border border-neutral-200"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-800">{user.fullName}</p>
                <p className="text-xs text-neutral-500">{user.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-neutral-500" />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-neutral-200">
                  <p className="text-sm font-medium text-neutral-800">{user.fullName}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
                
                <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                  Profile Settings
                </button>
                
                <button className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                  Company Settings
                </button>
                
                <div className="border-t border-neutral-200 my-1"></div>
                
                <button className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-neutral-50">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;