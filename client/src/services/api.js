import axios from 'axios';
import { getToken, getRefreshToken, setTokens, removeToken } from '../utils/auth';

// Create an axios instance with default config
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Include cookies in requests if using session-based auth
});

// Request queue for failed requests due to token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    // Skip adding auth header for login/refresh endpoints
    if (config.url.includes('/auth/jwt/')) {
      return config;
    }
    
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Return any error that is not related to authentication
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Don't retry refresh token requests
    if (originalRequest.url.includes('/auth/jwt/refresh/')) {
      // Clear tokens and redirect to login
      removeToken();
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
    
    // If we're already refreshing the token, add the request to the queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
      .then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return api(originalRequest);
      })
      .catch(err => {
        return Promise.reject(err);
      });
    }
    
    // Mark that we're refreshing the token
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      console.log('Attempting to refresh access token...');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/auth/jwt/refresh/`,
        { refresh: refreshToken },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true
        }
      );
      
      const { access, refresh: newRefreshToken } = response.data;
      
      if (!access) {
        throw new Error('No access token received');
      }
      
      // Store the new tokens
      setTokens(access, newRefreshToken);
      
      // Update the default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Update the original request with the new token
      originalRequest.headers['Authorization'] = `Bearer ${access}`;
      
      console.log('Token refreshed successfully, retrying request...');
      
      // Process any queued requests
      processQueue(null, access);
      
      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      
      // Process any queued requests with the error
      processQueue(refreshError, null);
      
      // Clear auth data
      removeToken();
      localStorage.removeItem('user_data');
      
      // Redirect to login if not already there
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
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
