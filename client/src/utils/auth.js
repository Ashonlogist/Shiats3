// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

// Token management
export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (access, refresh) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
};

export const removeToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// User data management
export const getUserData = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setUserData = (userData) => {
  if (userData) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } else {
    localStorage.removeItem(USER_DATA_KEY);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getUserData();
  return user && user.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles) => {
  if (!Array.isArray(roles)) return false;
  const user = getUserData();
  return user && roles.includes(user.role);
};

// Get user role
export const getUserRole = () => {
  const user = getUserData();
  return user ? user.role : null;
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (e) {
    return true;
  }
};

// Check if user needs to refresh token
export const shouldRefreshToken = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    const currentTime = Date.now() / 1000;
    // Refresh if token expires in less than 5 minutes
    return (payload.exp - currentTime) < 300;
  } catch (e) {
    return false;
  }
};

// Get token expiration time (in seconds since epoch)
export const getTokenExpiration = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.exp;
  } catch (e) {
    return null;
  }
};

// Check if current user is the owner of a resource
export const isOwner = (resourceOwnerId) => {
  const user = getUserData();
  return user && (user.id === resourceOwnerId || user.is_superuser);
};

// Clear all auth data
export const clearAuth = () => {
  removeToken();
  setUserData(null);
};

export default {
  getToken,
  getRefreshToken,
  setTokens,
  removeToken,
  getUserData,
  setUserData,
  isAuthenticated,
  hasRole,
  hasAnyRole,
  getUserRole,
  isTokenExpired,
  shouldRefreshToken,
  getTokenExpiration,
  isOwner,
  clearAuth,
};
