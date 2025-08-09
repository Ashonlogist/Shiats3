import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
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
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      removeToken();
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
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
