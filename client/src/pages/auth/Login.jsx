import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would handle the login logic here
      console.log('Login form submitted:', formData);
      
      // Redirect to dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        submit: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Sign in to continue to Shiats3</p>
        </div>
        
        {errors.submit && (
          <div className="alert alert-danger">
            {errors.submit}
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
