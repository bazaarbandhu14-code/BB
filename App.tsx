import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ServiceDashboard from './pages/ServiceDashboard';
import BazaarBandhu from './pages/BazaarBandhu';
import SupplierRegistration from './pages/SupplierRegistration';
import DeliveryTracking from './pages/DeliveryTracking';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/supplier-registration" element={<SupplierRegistration />} />
            
            {/* Test Route */}
            <Route path="/test-service" element={<ServiceDashboard />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute userType="vendor">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/service-dashboard" 
              element={
                <ProtectedRoute userType="supplier">
                  <ServiceDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bazaar" 
              element={
                <ProtectedRoute userType="vendor">
                  <BazaarBandhu />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/delivery-tracking" 
              element={
                <ProtectedRoute userType="vendor">
                  <DeliveryTracking />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
