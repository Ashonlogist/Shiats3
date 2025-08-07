// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Default headers for all requests
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// Helper function to build full API URL
const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

export { API_BASE_URL, DEFAULT_HEADERS, getApiUrl };
