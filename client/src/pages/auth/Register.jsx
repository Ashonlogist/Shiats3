import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaBuilding, FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: 'buyer',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    receiveUpdates: true
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9\-\+\(\)\s]{10,20}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
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
      // Call the registration API endpoint
      const response = await fetch('http://localhost:8000/api/v1/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone,
          user_type: formData.userType
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed. Please try again.');
      }
      
      // Redirect to login page with success message
      navigate('/login', { 
        state: { 
          registrationSuccess: true,
          message: 'Registration successful! Please log in to continue.' 
        } 
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        submit: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create an Account</h2>
          <p>Join Shiats3 to find your dream property</p>
        </div>
        
        {errors.submit && (
          <div className="alert alert-danger">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
              <div className="input-group">
                <span className="input-icon">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>
            
            <div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
              <div className="input-group">
                <span className="input-icon">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>
          
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <div className="input-group">
              <span className="input-icon">
                <FaEnvelope />
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
          
          <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
            <div className="input-group">
              <span className="input-icon">
                <FaPhone />
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              />
            </div>
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>
          
          <div className={`form-group ${errors.userType ? 'has-error' : ''}`}>
            <label>I am a</label>
            <div className="radio-group">
              <label className={`radio-option ${formData.userType === 'buyer' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="userType"
                  value="buyer"
                  checked={formData.userType === 'buyer'}
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Buyer/Renter</span>
              </label>
              
              <label className={`radio-option ${formData.userType === 'agent' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="userType"
                  value="agent"
                  checked={formData.userType === 'agent'}
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Real Estate Agent</span>
              </label>
              
              <label className={`radio-option ${formData.userType === 'owner' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="userType"
                  value="owner"
                  checked={formData.userType === 'owner'}
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Property Owner</span>
              </label>
            </div>
          </div>
          
          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <div className="input-group">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
            <div className="password-strength">
              <div 
                className={`strength-bar ${formData.password.length === 0 ? 'empty' : 
                  formData.password.length < 4 ? 'weak' : 
                  formData.password.length < 8 ? 'medium' : 'strong'}`}
              ></div>
              <span className="strength-text">
                {formData.password.length === 0 ? 'Password strength' : 
                 formData.password.length < 4 ? 'Weak' : 
                 formData.password.length < 8 ? 'Medium' : 'Strong'}
              </span>
            </div>
          </div>
          
          <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <div className="input-group">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          <div className={`form-group checkbox-group ${errors.agreeTerms ? 'has-error' : ''}`}>
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="terms-link">Privacy Policy</Link>
            </label>
            {errors.agreeTerms && <div className="error-message">{errors.agreeTerms}</div>}
            
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="receiveUpdates"
                checked={formData.receiveUpdates}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              I want to receive news and updates
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="divider">
            <span>Or sign up with</span>
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
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </div>
        </form>
      </div>
      
      <div className="auth-illustration">
        <div className="illustration-content">
          <h2>Join Our Community</h2>
          <p>Become part of Africa's fastest growing real estate platform and unlock exclusive benefits.</p>
          
          <div className="benefits">
            <div className="benefit">
              <div className="benefit-icon">
                <FaUser />
              </div>
              <div className="benefit-text">
                <h4>Personalized Experience</h4>
                <p>Get property recommendations tailored to your preferences</p>
              </div>
            </div>
            
            <div className="benefit">
              <div className="benefit-icon">
                <FaBuilding />
              </div>
              <div className="benefit-text">
                <h4>Save Properties</h4>
                <p>Save your favorite properties and come back to them later</p>
              </div>
            </div>
            
            <div className="benefit">
              <div className="benefit-icon">
                <FaEnvelope />
              </div>
              <div className="benefit-text">
                <h4>Instant Alerts</h4>
                <p>Be the first to know about new properties that match your criteria</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="testimonial-content">
              "Shiats3 helped me find my dream home in just a few weeks. The process was smooth and the support team was amazing!"
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah J." />
              </div>
              <div className="author-info">
                <h5>Sarah Johnson</h5>
                <p>Homeowner, Lagos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
