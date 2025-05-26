import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './mocks/mockData';

// Components
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SetupMFA from './components/auth/SetupMFA';
import Dashboard from './pages/Dashboard';
import PropertyMap from './pages/PropertyMap';
import PropertyDetails from './pages/PropertyDetails';
import Search from './pages/Search';
import CompanySettings from './pages/CompanySettings';
import UserManagement from './pages/UserManagement';
import DataSources from './pages/DataSources';
import ActivityLogs from './pages/ActivityLogs';
import NotFound from './pages/NotFound';

// Auth context
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup-mfa" element={<SetupMFA />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout user={getCurrentUser()} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="map" element={<PropertyMap />} />
            <Route path="properties/:id" element={<PropertyDetails />} />
            <Route path="search" element={<Search />} />
            <Route path="company" element={<CompanySettings />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="data-sources" element={<DataSources />} />
            <Route path="activity" element={<ActivityLogs />} />
          </Route>
          
          {/* Not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;