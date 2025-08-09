import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import api from '../services/api';
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
      // First check if we have a token
      const token = authUtils.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Set the authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Make the API request
      const response = await authAPI.getCurrentUser();
      
      if (!response || !response.data) {
        throw new Error('Invalid user data received from server');
      }
      
      // Ensure required user fields exist
      if (!response.data.id || !response.data.email) {
        throw new Error('Incomplete user data received');
      }
      
      // Update user state and local storage
      const userData = response.data;
      setUser(userData);
      authUtils.setUserData(userData);
      setError(null);
      
      return userData;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      
      // Clear auth state on any error
      if (err.response?.status === 401 || err.message === 'No authentication token found') {
        // If unauthorized, clear auth and redirect to login
        logout();
        
        // Only redirect if not already on login page
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      } else {
        // For other errors, keep the user logged in but show an error
        setError('Failed to load user data. ' + (err.message || 'Please refresh the page.'));
      }
      
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
      
      if (!response || !response.data) {
        throw new Error('No response from server');
      }
      
      // The backend should return both access and refresh tokens
      const { access, refresh } = response.data;
      
      if (!access) {
        throw new Error('No access token received');
      }
      
      // Store the tokens
      authUtils.setTokens(access, refresh);
      
      // Set the default Authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Fetch user data
      const userData = await fetchUser();
      
      return userData;
    } catch (err) {
      console.error('Login failed:', err);
      // Clear any partial auth state on failure
      authUtils.clearAuth();
      
      // Provide user-friendly error messages
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err.response) {
        // Handle different HTTP error statuses
        if (err.response.status === 400) {
          errorMessage = 'Invalid email or password.';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear all auth data from local storage
      authUtils.clearAuth();
      
      // Reset user state
      setUser(null);
      setError(null);
      
      // Optional: Call backend logout endpoint if available
      try {
        await authAPI.logout();
      } catch (error) {
        console.warn('Error during logout API call:', error);
        // Continue with logout even if API call fails
      }
      
      // Ensure all state is cleared
      setLoading(false);
      
      // Return a resolved promise for components to chain if needed
      return Promise.resolve();
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, we should still clear local state
      authUtils.clearAuth();
      setUser(null);
      return Promise.reject(error);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }
      
      // Ensure password confirmation matches if provided
      if (userData.password !== userData.re_password) {
        throw new Error('Passwords do not match');
      }
      
      // Prepare the registration data
      const registrationData = {
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
      };
      
      // Call register API
      const response = await authAPI.register(registrationData);
      
      if (!response) {
        throw new Error('No response from server during registration');
      }
      
      // If we have user data, update the state
      if (response.data) {
        // If the registration includes tokens, use them
        if (response.data.access && response.data.refresh) {
          authUtils.setTokens(response.data.access, response.data.refresh);
          
          // If we have user data in the response, use it
          if (response.data.user) {
            setUser(response.data.user);
            authUtils.setUserData(response.data.user);
            return response.data;
          }
        }
        
        // If no auto-login, just return the response
        return response.data;
      }
      
      // If we get here, the registration was successful but we don't have user data
      // Try to log in with the provided credentials
      try {
        await login({
          email: userData.email,
          password: userData.password,
        });
      } catch (loginError) {
        console.warn('Registration successful but auto-login failed:', loginError);
        // Don't throw, as the registration was still successful
      }
      
      return response.data || { success: true };
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
