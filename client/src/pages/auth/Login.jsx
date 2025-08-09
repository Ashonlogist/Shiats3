import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaFacebookF, FaGoogle, FaTwitter, FaHome, FaHotel, FaCheckCircle } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import './Auth.css';

const Login = () => {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    // Check for registration success message in location state
    if (location.state?.registrationSuccess) {
      setSuccessMessage(location.state.message || 'Registration successful! Please log in to continue.');
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setNetworkError(false);
    setErrors({});
    
    try {
      // Use the authAPI service for login
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      // Use the login function from AuthContext
      const userData = await login({
        email: formData.email,
        password: formData.password,
      });
      
      // Redirect based on user role
      const redirectPath = getDashboardPath(userData.role);
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle network errors
      if (error.message === 'Network Error') {
        setNetworkError(true);
        setErrors({
          submit: 'Unable to connect to the server. Please check your internet connection.'
        });
      } else {
        // Handle API errors
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           error.message || 
                           'Login failed. Please try again.';
        
        setErrors({
          submit: errorMessage,
          ...(error.response?.data?.email && { email: error.response.data.email[0] }),
          ...(error.response?.data?.password && { password: error.response.data.password[0] }),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your account</p>
          {successMessage && (
            <div className="alert alert-success" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginTop: '10px',
              padding: '10px 15px',
              borderRadius: '4px',
              backgroundColor: '#d4edda',
              color: '#155724',
              fontSize: '14px'
            }}>
              <FaCheckCircle style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}
        </div>
        
        {(errors.submit || networkError) && (
          <div className={`alert ${networkError ? 'alert-warning' : 'alert-danger'}`}>
            {errors.submit}
            {networkError && (
              <div style={{ marginTop: '10px' }}>
                <p>Please ensure that:</p>
                <ul style={{ margin: '5px 0 0 20px' }}>
                  <li>Your backend server is running on {import.meta.env.VITE_API_URL || 'http://localhost:8000'}</li>
                  <li>You have CORS properly configured on the backend</li>
                  <li>Your API endpoints are correct</li>
                </ul>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <div className="input-group">
              <span className="input-icon">
                <FiMail />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <div className="input-group">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              />
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
            
            <div className="d-flex justify-content-between align-items-center mt-2">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="divider">
            <span>Or continue with</span>
          </div>
          
          <div className="social-login">
            <button type="button" className="social-btn facebook">
              <FaFacebookF />
            </button>
            <button type="button" className="social-btn google">
              <FaGoogle />
            </button>
            <button type="button" className="social-btn twitter">
              <FaTwitter />
            </button>
          </div>
          
          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </div>
        </form>
      </div>
      
      <div className="auth-illustration">
        <div className="illustration-content">
          <h2>Find Your Dream Property</h2>
          <p>Discover the perfect place to live, work, and relax with our extensive collection of properties.</p>
          
          <div className="features">
            <div className="feature">
              <div className="feature-icon">
                <FaHome />
              </div>
              <div className="feature-text">
                <h4>Wide Range of Properties</h4>
                <p>Explore thousands of properties across Africa</p>
              </div>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <FaUser />
              </div>
              <div className="feature-text">
                <h4>Trusted Agents</h4>
                <p>Connect with verified real estate professionals</p>
              </div>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <FaHotel />
              </div>
              <div className="feature-text">
                <h4>Easy Booking</h4>
                <p>Simple and secure booking process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
