import apiService from './apiService';

const authService = {
  // Login with email and password
  async login(email, password) {
    try {
      // First get CSRF token
      await apiService.get('auth/csrf/');
      
      // Then perform login
      const response = await apiService.post('auth/jwt/create/', {
        email,
        password,
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Save tokens to local storage
      const { access, refresh } = response.data;
      if (!access || !refresh) {
        throw new Error('Invalid response format - missing tokens');
      }
      
      // Set tokens in local storage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Get user data
      const userResponse = await this.getCurrentUser();
      if (!userResponse || !userResponse.data) {
        throw new Error('Failed to fetch user data');
      }
      
      return userResponse.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register a new user
  async register(userData) {
    try {
      // First get CSRF token
      await apiService.get('auth/csrf/');
      
      // Then register the user
      const response = await apiService.post('auth/users/', userData);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // If registration is successful, automatically log the user in
      try {
        const loginResponse = await this.login(userData.email, userData.password);
        return { ...response.data, ...loginResponse };
      } catch (loginError) {
        // If auto-login fails, still return the registration success
        console.warn('Registration successful but auto-login failed:', loginError);
        return response.data;
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout the current user
  async logout() {
    try {
      // Call the backend logout endpoint if it exists
      try {
        await apiService.post('auth/logout/');
      } catch (error) {
        console.warn('Logout API call failed, proceeding with client-side logout', error);
        // Continue with client-side logout even if the API call fails
      }
      
      // Clear all auth data from local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Return a resolved promise
      return Promise.resolve();
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      return Promise.reject(error);
    }
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
