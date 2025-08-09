import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import * as authUtils from '../utils/auth';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authUtils.getToken();
        if (token) {
          // If token exists, fetch user data
          await fetchUser();
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        authUtils.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch user data from API
  const fetchUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      authUtils.setUserData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
      throw err;
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call login API
      const response = await authAPI.login(credentials);
      
      // Save tokens
      authUtils.setTokens(response.data.access, response.data.refresh);
      
      // Fetch user data
      const userData = await fetchUser();
      
      return userData;
    } catch (err) {
      console.error('Login failed:', err);
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authUtils.clearAuth();
    setUser(null);
    // Navigation should be handled by the component
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call register API
      const response = await authAPI.register(userData);
      
      // Auto-login after registration if needed
      if (response.data) {
        await login({
          email: userData.email,
          password: userData.password,
        });
      }
      
      return response.data;
    } catch (err) {
      console.error('Registration failed:', err);
      const errorMessage = err.response?.data?.email?.[0] || 
                         err.response?.data?.password?.[0] || 
                         'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prev => ({
      ...prev,
      ...userData
    }));
    authUtils.setUserData(userData);
  };

  // Check if user has role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role || user.is_superuser;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role) || user.is_superuser;
  };

  // Get dashboard path based on user role
  const getDashboardPath = useCallback((role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'hotel_manager':
        return '/hotel-manager/dashboard';
      case 'agent':
        return '/agent/dashboard';
      default:
        return '/dashboard';
    }
  }, []);

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateUser,
    hasRole,
    hasAnyRole,
    getDashboardPath,
    refreshUser: fetchUser,
    isInitialized: !loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
