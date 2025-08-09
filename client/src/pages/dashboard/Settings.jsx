import React, { useState, useEffect } from 'react';
import { 
  FaCog, 
  FaUserCog, 
  FaLock, 
  FaBell, 
  FaGlobe, 
  FaPalette, 
  FaSave, 
  FaUndo,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  // Form state
  const [formData, setFormData] = useState({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: ''
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      newsletter: true,
      promotions: false
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h'
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Simulate API call to fetch user settings
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - in a real app, this would come from an API
        const mockSettings = {
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            bio: 'Real estate professional with 8+ years of experience in property management and sales.'
          },
          security: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          },
          notifications: {
            email: true,
            sms: false,
            push: true,
            newsletter: true,
            promotions: false
          },
          preferences: {
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h'
          }
        };
        
        setFormData(mockSettings);
        setInitialData(JSON.stringify(mockSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
        setSaveStatus({
          type: 'error',
          message: 'Failed to load settings. Please try again.'
        });
      }
    };

    loadSettings();
  }, []);

  // Check for changes
  useEffect(() => {
    if (initialData) {
      const currentData = JSON.stringify(formData);
      setHasChanges(currentData !== initialData);
    }
  }, [formData, initialData]);

  // Handle input changes
  const handleChange = (section, field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus({ type: '', message: '' });

    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update initial data to reflect saved state
      setInitialData(JSON.stringify(formData));
      
      setSaveStatus({
        type: 'success',
        message: 'Settings saved successfully!'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({
        type: 'error',
        message: 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      if (saveStatus.type === 'success') {
        setTimeout(() => {
          setSaveStatus({ type: '', message: '' });
        }, 3000);
      }
    }
  };

  // Reset form to initial values
  const handleReset = () => {
    if (initialData) {
      setFormData(JSON.parse(initialData));
    }
    setSaveStatus({ type: '', message: '' });
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-section">
            <h3>Profile Information</h3>
            <p className="section-description">Update your personal information and how it appears to others.</p>
            
            <div className="form-group">
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.profile.firstName}
                    onChange={handleChange('profile', 'firstName')}
                    className="form-control"
                  />
                </div>
                <div className="form-col">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.profile.lastName}
                    onChange={handleChange('profile', 'lastName')}
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.profile.email}
                    onChange={handleChange('profile', 'email')}
                    className="form-control"
                  />
                </div>
                <div className="form-col">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.profile.phone}
                    onChange={handleChange('profile', 'phone')}
                    className="form-control"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={formData.profile.bio}
                  onChange={handleChange('profile', 'bio')}
                  className="form-control"
                  rows="4"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
            </div>
          </div>
        );
        
      case 'security':
        return (
          <div className="settings-section">
            <h3>Security Settings</h3>
            <p className="section-description">Manage your password and account security settings.</p>
            
            <div className="form-group">
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={formData.security.currentPassword}
                    onChange={handleChange('security', 'currentPassword')}
                    className="form-control"
                    placeholder="Enter current password"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={formData.security.newPassword}
                    onChange={handleChange('security', 'newPassword')}
                    className="form-control"
                    placeholder="Enter new password"
                  />
                  <small className="form-text text-muted">Use 8 or more characters with a mix of letters, numbers & symbols.</small>
                </div>
                <div className="form-col">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.security.confirmPassword}
                    onChange={handleChange('security', 'confirmPassword')}
                    className="form-control"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <div className="security-tips">
                <h4>Security Tips:</h4>
                <ul>
                  <li>Use a unique password for this account</li>
                  <li>Don't share your password with anyone</li>
                  <li>Consider using a password manager</li>
                  <li>Enable two-factor authentication for added security</li>
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="settings-section">
            <h3>Notification Preferences</h3>
            <p className="section-description">Choose how and when you want to be notified.</p>
            
            <div className="notification-options">
              <div className="notification-category">
                <h4>Email Notifications</h4>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={formData.notifications.email}
                    onChange={handleChange('notifications', 'email')}
                    className="form-check-input"
                  />
                  <label htmlFor="emailNotifications" className="form-check-label">
                    Enable email notifications
                  </label>
                  <small className="form-text text-muted">Receive important updates via email</small>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={formData.notifications.newsletter}
                    onChange={handleChange('notifications', 'newsletter')}
                    className="form-check-input"
                    disabled={!formData.notifications.email}
                  />
                  <label 
                    htmlFor="newsletter" 
                    className={`form-check-label ${!formData.notifications.email ? 'text-muted' : ''}`}
                  >
                    Subscribe to newsletter
                  </label>
                  <small className="form-text text-muted">Get the latest news and updates</small>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="promotions"
                    checked={formData.notifications.promotions}
                    onChange={handleChange('notifications', 'promotions')}
                    className="form-check-input"
                    disabled={!formData.notifications.email}
                  />
                  <label 
                    htmlFor="promotions" 
                    className={`form-check-label ${!formData.notifications.email ? 'text-muted' : ''}`}
                  >
                    Marketing & Promotions
                  </label>
                  <small className="form-text text-muted">Receive special offers and promotions</small>
                </div>
              </div>
              
              <div className="notification-category">
                <h4>Other Notifications</h4>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={formData.notifications.sms}
                    onChange={handleChange('notifications', 'sms')}
                    className="form-check-input"
                  />
                  <label htmlFor="smsNotifications" className="form-check-label">
                    Enable SMS notifications
                  </label>
                  <small className="form-text text-muted">Receive text message alerts</small>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={formData.notifications.push}
                    onChange={handleChange('notifications', 'push')}
                    className="form-check-input"
                  />
                  <label htmlFor="pushNotifications" className="form-check-label">
                    Enable push notifications
                  </label>
                  <small className="form-text text-muted">Get browser or app notifications</small>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'preferences':
        return (
          <div className="settings-section">
            <h3>Appearance & Preferences</h3>
            <p className="section-description">Customize how the application looks and behaves.</p>
            
            <div className="form-group">
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="theme">Theme</label>
                  <select
                    id="theme"
                    value={formData.preferences.theme}
                    onChange={handleChange('preferences', 'theme')}
                    className="form-control"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <div className="form-col">
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    value={formData.preferences.language}
                    onChange={handleChange('preferences', 'language')}
                    className="form-control"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="timezone">Timezone</label>
                  <select
                    id="timezone"
                    value={formData.preferences.timezone}
                    onChange={handleChange('preferences', 'timezone')}
                    className="form-control"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="EST">Eastern Time (ET)</option>
                    <option value="CST">Central Time (CT)</option>
                    <option value="MST">Mountain Time (MT)</option>
                    <option value="PST">Pacific Time (PT)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                    <option value="CET">Central European Time (CET)</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="dateFormat">Date Format</label>
                  <select
                    id="dateFormat"
                    value={formData.preferences.dateFormat}
                    onChange={handleChange('preferences', 'dateFormat')}
                    className="form-control"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</option>
                    <option value="MMM D, YYYY">MMM D, YYYY (Dec 31, 2023)</option>
                  </select>
                </div>
                <div className="form-col">
                  <label htmlFor="timeFormat">Time Format</label>
                  <select
                    id="timeFormat"
                    value={formData.preferences.timeFormat}
                    onChange={handleChange('preferences', 'timeFormat')}
                    className="form-control"
                  >
                    <option value="12h">12-hour (2:30 PM)</option>
                    <option value="24h">24-hour (14:30)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1><FaCog className="header-icon" /> Settings</h1>
        <p className="header-description">Manage your account preferences and settings</p>
      </div>
      
      <div className="settings-content">
        <div className="settings-sidebar">
          <button
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUserCog className="sidebar-icon" />
            <span>Profile</span>
          </button>
          
          <button
            className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaLock className="sidebar-icon" />
            <span>Security</span>
          </button>
          
          <button
            className={`sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell className="sidebar-icon" />
            <span>Notifications</span>
          </button>
          
          <button
            className={`sidebar-item ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <FaPalette className="sidebar-icon" />
            <span>Appearance</span>
          </button>
        </div>
        
        <div className="settings-main">
          <form onSubmit={handleSubmit}>
            {renderTabContent()}
            
            <div className="settings-actions">
              {saveStatus.message && (
                <div className={`save-status ${saveStatus.type}`}>
                  {saveStatus.type === 'success' ? (
                    <FaCheckCircle className="status-icon" />
                  ) : (
                    <FaExclamationCircle className="status-icon" />
                  )}
                  <span>{saveStatus.message}</span>
                </div>
              )}
              
              <div className="buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={!hasChanges || isSaving}
                >
                  <FaUndo className="btn-icon" />
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!hasChanges || isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ms-2">Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="btn-icon" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
