import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Include cookies in requests if using session-based auth
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't retry if it's a retry request or not a 401 error
    if (originalRequest._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }
    
    // Mark this request as already being retried
    originalRequest._retry = true;
    
    // If this is a refresh token request, log out the user
    if (originalRequest.url.includes('/auth/jwt/refresh/')) {
      console.error('Refresh token failed, logging out...');
      removeToken();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
    
    // Try to refresh the token
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      console.log('Attempting to refresh access token...');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/auth/jwt/refresh/`,
        { refresh: refreshToken }
      );
      
      if (!response.data?.access) {
        throw new Error('No access token in refresh response');
      }
      
      // Store the new token
      const { access } = response.data;
      setTokens(access, refreshToken);
      
      // Update the auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      originalRequest.headers['Authorization'] = `Bearer ${access}`;
      
      console.log('Token refreshed successfully, retrying request...');
      return api(originalRequest);
    } catch (err) {
      console.error('Failed to refresh token:', err);
      
      // If we're not already on the login page, redirect there
      if (!window.location.pathname.startsWith('/login')) {
        // Clear any existing tokens
        removeToken();
        
        // Add a small delay to allow the error to be processed
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
      
      return Promise.reject(error);
    }
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/jwt/create/', credentials),
  register: (userData) => api.post('/auth/users/', userData),
  getCurrentUser: () => api.get('/auth/users/me/'),
  refreshToken: (refresh) => api.post('/auth/jwt/refresh/', { refresh }),
  verifyToken: (token) => api.post('/auth/jwt/verify/', { token }),
};

export const propertiesAPI = {
  getProperties: (params = {}) => api.get('/properties/', { params }),
  getProperty: (id) => api.get(`/properties/${id}/`),
  createProperty: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach((file, index) => {
          formData.append(`image_${index}`, file);
        });
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/properties/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateProperty: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach((file, index) => {
          formData.append(`image_${index}`, file);
        });
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.patch(`/properties/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProperty: (id) => api.delete(`/properties/${id}/`),
  getPropertyStats: () => api.get('/dashboard/property-stats/'),
};

export const bookingsAPI = {
  getBookings: (params = {}) => api.get('/bookings/', { params }),
  getBooking: (id) => api.get(`/bookings/${id}/`),
  createBooking: (data) => api.post('/bookings/', data),
  updateBooking: (id, data) => api.patch(`/bookings/${id}/`, data),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel/`),
  getBookingStats: () => api.get('/dashboard/booking-stats/'),
};

export const usersAPI = {
  getUsers: (params = {}) => api.get('/users/', { params }),
  getUser: (id) => api.get(`/users/${id}/`),
  createUser: (data) => api.post('/users/', data),
  updateUser: (id, data) => api.patch(`/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/users/${id}/`),
  getUserStats: () => api.get('/dashboard/user-stats/'),
};

// Hotel Manager specific API calls
export const hotelManagerAPI = {
  // Property management
  getMyProperties: (params = {}) => api.get('/hotel-manager/properties/', { params }),
  getPropertyBookings: (propertyId, params = {}) => 
    api.get(`/hotel-manager/properties/${propertyId}/bookings/`, { params }),
  
  // Booking management
  updateBookingStatus: (bookingId, status) => 
    api.patch(`/hotel-manager/bookings/${bookingId}/status/`, { status }),
  
  // Dashboard stats
  getDashboardStats: () => api.get('/hotel-manager/dashboard/stats/'),
  getRecentBookings: (limit = 5) => 
    api.get('/hotel-manager/dashboard/recent-bookings/', { params: { limit } }),
  getRevenueStats: (period = 'monthly') => 
    api.get('/hotel-manager/dashboard/revenue/', { params: { period } }),
  
  // Room management
  getRooms: (propertyId) => 
    api.get(`/hotel-manager/properties/${propertyId}/rooms/`),
  updateRoom: (propertyId, roomId, data) => 
    api.patch(`/hotel-manager/properties/${propertyId}/rooms/${roomId}/`, data),
  
  // Reviews
  getPropertyReviews: (propertyId) => 
    api.get(`/hotel-manager/properties/${propertyId}/reviews/`),
  respondToReview: (reviewId, response) => 
    api.post(`/hotel-manager/reviews/${reviewId}/respond/`, { response }),
};

export default api;
