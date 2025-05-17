import React, { useState } from 'react';
import { 
  Building2, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Lock, 
  Shield, 
  Database,
  Settings,
  AlertTriangle,
  Save,
  Check
} from 'lucide-react';
import { getCompanyInfo } from '../mocks/mockData';

const CompanySettings: React.FC = () => {
  const companyData = getCompanyInfo();
  
  const [company, setCompany] = useState({
    name: companyData.name,
    logo: companyData.logo,
    address: companyData.address,
    city: companyData.city,
    state: companyData.state,
    zipCode: companyData.zipCode,
    phone: companyData.phone,
    website: companyData.website,
    plan: companyData.plan
  });
  
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'data' | 'billing'>('general');
  const [formModified, setFormModified] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
    setFormModified(true);
  };

  const handleSaveChanges = () => {
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Company settings updated successfully');
      setFormModified(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Company Settings</h1>
        
        {formModified && (
          <button
            onClick={handleSaveChanges}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        )}
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
      
      {/* Settings content */}
      <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-neutral-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'general'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'security'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Security & Compliance
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'data'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Data Management
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'billing'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Billing & Subscription
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-8">
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Company Information</h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Company Logo */}
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Company Logo
                    </label>
                    <div className="flex items-center">
                      <div className="mr-4 flex-shrink-0">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-16 w-16 rounded-full object-cover border border-neutral-200"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <Upload className="mr-2 h-4 w-4 text-neutral-500" />
                          Upload New Logo
                        </button>
                        <p className="mt-1 text-xs text-neutral-500">
                          Recommended: Square image, at least 200x200 pixels. PNG or JPG format.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Company Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                      Company Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={company.name}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                      Phone Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={company.phone}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Website */}
                  <div className="sm:col-span-3">
                    <label htmlFor="website" className="block text-sm font-medium text-neutral-700">
                      Website
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        name="website"
                        id="website"
                        value={company.website}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Subscription Plan */}
                  <div className="sm:col-span-3">
                    <label htmlFor="plan" className="block text-sm font-medium text-neutral-700">
                      Subscription Plan
                    </label>
                    <div className="mt-1">
                      <select
                        id="plan"
                        name="plan"
                        value={company.plan}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="Free">Free</option>
                        <option value="Professional">Professional</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Address */}
              <div className="pt-8 border-t border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Company Address</h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Street Address */}
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-neutral-700">
                      Street Address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={company.address}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* City */}
                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={company.city}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* State */}
                  <div className="sm:col-span-2">
                    <label htmlFor="state" className="block text-sm font-medium text-neutral-700">
                      State
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="state"
                        id="state"
                        value={company.state}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Zip Code */}
                  <div className="sm:col-span-2">
                    <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700">
                      ZIP / Postal Code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        value={company.zipCode}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Administrator Info */}
              <div className="pt-8 border-t border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Administrators</h3>
                
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="John Doe"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-neutral-900">John Doe</h4>
                        <div className="flex items-center mt-1">
                          <Mail className="h-3.5 w-3.5 text-neutral-400 mr-1.5" />
                          <span className="text-xs text-neutral-500">john.doe@acme.com</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Primary Admin
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <User className="mr-2 h-4 w-4 text-neutral-500" />
                  Add Administrator
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-8">
              {/* Security Settings */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-start">
                      <Lock className="h-5 w-5 text-neutral-400 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">Two-Factor Authentication</h4>
                        <p className="mt-1 text-sm text-neutral-600">
                          Require all team members to set up two-factor authentication
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="relative w-11 h-6 bg-neutral-200 peer-checked:bg-primary-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-neutral-400 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">Single Sign-On (SSO)</h4>
                        <p className="mt-1 text-sm text-neutral-600">
                          Allow users to sign in with your corporate identity provider
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-neutral-200 peer-checked:bg-primary-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-start">
                      <Lock className="h-5 w-5 text-neutral-400 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">Password Policy</h4>
                        <p className="mt-1 text-sm text-neutral-600">
                          Require strong passwords and enforce regular password changes
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="relative w-11 h-6 bg-neutral-200 peer-checked:bg-primary-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Compliance */}
              <div className="pt-8 border-t border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Compliance Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-success-500 mt-0.5 mr-3" />
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-neutral-900">GDPR Compliance</h4>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            Active
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600">
                          Settings for European General Data Protection Regulation
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                        Configure
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-success-500 mt-0.5 mr-3" />
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-neutral-900">CCPA Compliance</h4>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            Active
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600">
                          Settings for California Consumer Privacy Act
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                        Configure
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-warning-50 rounded-lg border border-warning-200">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-warning-500 mt-0.5 mr-3" />
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-neutral-900">Data Retention Policy</h4>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                            Needs Attention
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600">
                          Configure how long your company retains user data
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Security Logs */}
              <div className="pt-8 border-t border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Security Logs</h3>
                
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-neutral-900">Recent Security Events</h4>
                    <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                      View All Logs
                    </button>
                  </div>
                  
                  <div className="overflow-hidden border border-neutral-200 rounded-lg">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-white">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            Event
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            User
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            Date
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            IP Address
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-200">
                        <tr>
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            Login Successful
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            John Doe
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            Today, 10:23 AM
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            192.168.1.101
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            Password Changed
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            Jane Smith
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            Yesterday, 3:45 PM
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            192.168.1.102
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-error-600">
                            Failed Login Attempt
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            Unknown
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            Yesterday, 11:32 AM
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-500">
                            203.45.67.89
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'data' && (
            <div className="space-y-8">
              {/* Data Management */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Data Management</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-start">
                      <Database className="h-5 w-5 text-neutral-400 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">Data Encryption</h4>
                        <p className="mt-1 text-sm text-neutral-600">
                          All data is encrypted at rest and in transit
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Enabled
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-start">
                      <Settings className="h-5 w-5 text-neutral-400 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">Data Access Controls</h4>
                        <p className="mt-1 text-sm text-neutral-600">
                          Configure who can access specific categories of data
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                        Configure
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-start">
                      <Database className="h-5 w-5 text-neutral-400 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">Database Backups</h4>
                        <p className="mt-1 text-sm text-neutral-600">
                          Automatic daily backups of all your company data
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="relative w-11 h-6 bg-neutral-200 peer-checked:bg-primary-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Data Sources */}
              <div className="pt-8 border-t border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Data Sources</h3>
                
                <div className="overflow-hidden border border-neutral-200 rounded-lg">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Source Name
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Type
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Records
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Last Sync
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          County Property Records
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          Property Data
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          15,420
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          Today, 12:45 AM
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-primary-600 space-x-2">
                          <button className="font-medium hover:text-primary-800">Configure</button>
                          <button className="font-medium hover:text-primary-800">Sync</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Credit Bureau API
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          Financial Data
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          12,250
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          Yesterday, 12:30 PM
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-primary-600 space-x-2">
                          <button className="font-medium hover:text-primary-800">Configure</button>
                          <button className="font-medium hover:text-primary-800">Sync</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Tax Assessment Database
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          Property Value
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          18,650
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          4 days ago
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                            Needs Update
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-primary-600 space-x-2">
                          <button className="font-medium hover:text-primary-800">Configure</button>
                          <button className="font-medium hover:text-primary-800">Sync</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Database className="mr-2 h-4 w-4 text-neutral-500" />
                    Add Data Source
                  </button>
                </div>
              </div>
              
              {/* Data Export */}
              <div className="pt-8 border-t border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Data Export</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <h4 className="text-sm font-medium text-neutral-900 mb-2">Full Data Export</h4>
                    <p className="text-sm text-neutral-600 mb-4">
                      Export all company data in a compressed format
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Download className="mr-2 h-4 w-4 text-neutral-500" />
                      Export All Data
                    </button>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <h4 className="text-sm font-medium text-neutral-900 mb-2">Scheduled Exports</h4>
                    <p className="text-sm text-neutral-600 mb-4">
                      Set up regular data exports to your storage location
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Settings className="mr-2 h-4 w-4 text-neutral-500" />
                      Configure Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="space-y-8">
              {/* Current Plan */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Subscription Details</h3>
                
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-primary-900">Current Plan</h4>
                      <p className="text-2xl font-bold text-primary-900 mt-1">{company.plan}</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-md shadow-sm">
                      <p className="text-lg font-bold text-primary-900">$399<span className="text-sm font-normal text-neutral-500">/month</span></p>
                      <p className="text-xs text-neutral-500">Billed annually</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-primary-200">
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-primary-800">
                        <Check className="h-4 w-4 mr-2 text-primary-600" />
                        Unlimited property searches
                      </li>
                      <li className="flex items-center text-sm text-primary-800">
                        <Check className="h-4 w-4 mr-2 text-primary-600" />
                        Advanced owner intelligence
                      </li>
                      <li className="flex items-center text-sm text-primary-800">
                        <Check className="h-4 w-4 mr-2 text-primary-600" />
                        12 team members included
                      </li>
                      <li className="flex items-center text-sm text-primary-800">
                        <Check className="h-4 w-4 mr-2 text-primary-600" />
                        Premium data sources
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 flex">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h4 className="text-sm font-medium text-neutral-900">Usage This Month</h4>
                    <div className="mt-2">
                      <p className="text-2xl font-semibold text-neutral-900">852</p>
                      <p className="text-xs text-neutral-500 mt-1">Property searches</p>
                    </div>
                    <div className="mt-2 w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">45% of monthly limit</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h4 className="text-sm font-medium text-neutral-900">Active Users</h4>
                    <div className="mt-2">
                      <p className="text-2xl font-semibold text-neutral-900">8</p>
                      <p className="text-xs text-neutral-500 mt-1">of 12 included</p>
                    </div>
                    <div className="mt-2 w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600" style={{ width: '67%' }}></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">67% of total seats</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h4 className="text-sm font-medium text-neutral-900">Next Billing Date</h4>
                    <div className="mt-2">
                      <p className="text-2xl font-semibold text-neutral-900">May 15, 2025</p>
                      <p className="text-xs text-neutral-500 mt-1">Auto-renewal enabled</p>
                    </div>
                    <div className="mt-4">
                      <button className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                        View billing history
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="pt-8 border-t border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Payment Method</h3>
                
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-neutral-900 rounded-md flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-white">VISA</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Visa ending in 4242</p>
                        <p className="text-xs text-neutral-500 mt-1">Expires 12/25</p>
                      </div>
                    </div>
                    <div>
                      <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                        Update
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <span className="mr-2">+</span>
                    Add Payment Method
                  </button>
                </div>
              </div>
              
              {/* Billing History */}
              <div className="pt-8 border-t border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Billing History</h3>
                
                <div className="overflow-hidden border border-neutral-200 rounded-lg">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Date
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Description
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Amount
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Apr 15, 2025
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Enterprise Plan - Monthly
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          $399.00
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            Paid
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-primary-600">
                          <button className="font-medium hover:text-primary-800">Download</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Mar 15, 2025
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Enterprise Plan - Monthly
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          $399.00
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            Paid
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-primary-600">
                          <button className="font-medium hover:text-primary-800">Download</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Feb 15, 2025
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          Enterprise Plan - Monthly
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          $399.00
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            Paid
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-primary-600">
                          <button className="font-medium hover:text-primary-800">Download</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;