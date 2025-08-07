import axios from 'axios';
import { getApiUrl, DEFAULT_HEADERS } from './config';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '', // We'll use the full URL from getApiUrl
  headers: { ...DEFAULT_HEADERS },
  withCredentials: true, // Important for handling cookies
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh and common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(getApiUrl('auth/jwt/refresh/'), {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Update the authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (error) {
        // If refresh fails, clear auth data and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Generic request methods
  get(endpoint, params = {}, config = {}) {
    return api.get(getApiUrl(endpoint), { ...config, params });
  },

  post(endpoint, data, config = {}) {
    return api.post(getApiUrl(endpoint), data, config);
  },

  put(endpoint, data, config = {}) {
    return api.put(getApiUrl(endpoint), data, config);
  },

  patch(endpoint, data, config = {}) {
    return api.patch(getApiUrl(endpoint), data, config);
  },

  delete(endpoint, config = {}) {
    return api.delete(getApiUrl(endpoint), config);
  },

  // File upload helper
  upload(endpoint, file, fieldName = 'file', config = {}) {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    return this.post(endpoint, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default apiService;
