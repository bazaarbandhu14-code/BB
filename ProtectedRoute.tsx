import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'vendor' | 'supplier';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const user = localStorage.getItem('user');
  
  console.log('ProtectedRoute Debug:', { user, userType });
  
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If userType is specified, check if user has the correct role
  if (userType) {
    try {
      const userData = JSON.parse(user);
      console.log('User data:', userData);
      console.log('Expected userType:', userType);
      console.log('Actual userType:', userData.userType);
      
      if (userData.userType !== userType) {
        console.log('User type mismatch, redirecting');
        // Redirect to appropriate dashboard based on user type
        if (userData.userType === 'supplier') {
          return <Navigate to="/service-dashboard" replace />;
        } else {
          return <Navigate to="/dashboard" replace />;
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      return <Navigate to="/login" replace />;
    }
  }

  console.log('User authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute; 