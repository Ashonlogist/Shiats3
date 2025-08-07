import apiService from './apiService';

const authService = {
  // Login with email and password
  async login(email, password) {
    try {
      const response = await apiService.post('auth/jwt/create/', {
        email,
        password,
      });
      
      // Save tokens to local storage
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Get user data
      const userResponse = await this.getCurrentUser();
      return userResponse.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register a new user
  async register(userData) {
    try {
      const response = await apiService.post('auth/users/', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout the current user
  logout() {
    // You might want to call your backend's logout endpoint here if you have one
    // await apiService.post('auth/logout/');
    
    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/login';
  },

  // Get current user data
  async getCurrentUser() {
    try {
      const response = await apiService.get('auth/users/me/');
      // Cache user data in local storage
      localStorage.setItem('user', JSON.stringify(response.data));
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      // If not authenticated, clear any existing tokens
      if (error.response?.status === 401) {
        this.logout();
      }
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  // Get the stored access token
  getAccessToken() {
    return localStorage.getItem('access_token');
  },

  // Get the stored user data
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Password reset request
  requestPasswordReset(email) {
    return apiService.post('auth/users/reset_password/', { email });
  },

  // Confirm password reset
  confirmPasswordReset(uid, token, new_password) {
    return apiService.post('auth/users/reset_password_confirm/', {
      uid,
      token,
      new_password,
    });
  },
};

export default authService;
