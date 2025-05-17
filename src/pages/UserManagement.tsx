import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Clock, 
  UserPlus, 
  X, 
  Search, 
  UserCog, 
  UserMinus,
  Check
} from 'lucide-react';
import { mockUsers } from '../mocks/mockData';

interface UserFormData {
  email: string;
  fullName: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<UserFormData>({
    email: '',
    fullName: '',
    role: 'Viewer'
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input change for new user form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  // Add new user
  const handleAddUser = () => {
    // Validate form
    if (!newUser.email || !newUser.fullName || !newUser.role) {
      return;
    }
    
    // Add new user to list
    const newUserObj = {
      id: `user-${Date.now()}`,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role as 'Admin' | 'Analyst' | 'Viewer',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
      companyId: 'company-001',
      lastLogin: new Date().toISOString(),
      twoFactorEnabled: false
    };
    
    setUsers([...users, newUserObj]);
    
    // Reset form and close dialog
    setNewUser({
      email: '',
      fullName: '',
      role: 'Viewer'
    });
    setAddUserDialogOpen(false);
    
    // Show success message
    setSuccessMessage(`User ${newUser.fullName} has been added successfully.`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Remove user
  const handleRemoveUser = (userId: string) => {
    const userToRemove = users.find(user => user.id === userId);
    setUsers(users.filter(user => user.id !== userId));
    
    // Show success message
    if (userToRemove) {
      setSuccessMessage(`User ${userToRemove.fullName} has been removed.`);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  // Update user role
  const handleRoleChange = (userId: string, newRole: 'Admin' | 'Analyst' | 'Viewer') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
        
        <button
          onClick={() => setAddUserDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
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
      
      {/* User management content */}
      <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-500">
                {users.length} Total Users
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {users.filter(u => u.role === 'Admin').length} Admins
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                {users.filter(u => u.role === 'Analyst').length} Analysts
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                {users.filter(u => u.role === 'Viewer').length} Viewers
              </span>
            </div>
          </div>
        </div>
        
        {/* User list */}
        <div>
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  2FA
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={user.avatar} 
                          alt={user.fullName} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-neutral-500 flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1 text-neutral-400" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'Admin' | 'Analyst' | 'Viewer')}
                      className="text-sm border-0 focus:ring-0 text-neutral-700 bg-transparent pr-8 py-0"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      <span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-1 animate-pulse-slow"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-neutral-400" />
                      {new Date(user.lastLogin).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.twoFactorEnabled ? (
                      <span className="inline-flex items-center text-xs font-medium text-success-700">
                        <Shield className="h-3.5 w-3.5 mr-1 text-success-500" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium text-warning-700">
                        <Shield className="h-3.5 w-3.5 mr-1 text-warning-500" />
                        Not Enabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      <UserCog className="h-4 w-4" />
                      <span className="sr-only">Edit User</span>
                    </button>
                    <button 
                      onClick={() => handleRemoveUser(user.id)}
                      className="text-error-600 hover:text-error-900"
                    >
                      <UserMinus className="h-4 w-4" />
                      <span className="sr-only">Remove User</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900">No users found</h3>
            <p className="mt-1 text-sm text-neutral-500">
              {searchQuery ? 'Try adjusting your search query' : 'Get started by adding a new user'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setAddUserDialogOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add user dialog */}
      {addUserDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-neutral-900">Add New User</h3>
              <button
                onClick={() => setAddUserDialogOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={newUser.fullName}
                    onChange={handleInputChange}
                    placeholder="Jane Smith"
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    placeholder="jane.smith@example.com"
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="send_invite"
                      name="send_invite"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="send_invite" className="font-medium text-neutral-700">Send invitation email</label>
                    <p className="text-neutral-500">The user will receive an email with instructions to set up their account.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setAddUserDialogOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;