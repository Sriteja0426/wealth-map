import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center px-6 py-12">
      <div className="mx-auto max-w-md text-center">
        <AlertTriangle className="h-16 w-16 text-warning-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Page Not Found</h2>
        <p className="text-neutral-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center justify-center px-5 py-2.5 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;