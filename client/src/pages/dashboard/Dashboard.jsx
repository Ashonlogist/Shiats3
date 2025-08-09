import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  FaHome, 
  FaBuilding, 
  FaHotel, 
  FaUsers, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaBell,
  FaEnvelope,
  FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.styles.css';

// Lazy load dashboard components
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const AgentDashboard = React.lazy(() => import('./components/AgentDashboard'));
const HotelManagerDashboard = React.lazy(() => import('./components/HotelManagerDashboard'));

const Dashboard = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Close sidebar when clicking outside
  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest(`.${styles.profileDropdown}`)) {
        setProfileOpen(false);
      }
      if (notificationsOpen && !event.target.closest(`.${styles.notificationsDropdown}`)) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen, notificationsOpen]);
  
  // Close sidebar on route change (mobile)
  useEffect(() => {
    closeSidebar();
  }, [location]);
  
  // Mock notifications - in a real app, these would come from an API
  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications = [
      { id: 1, message: 'New booking request from John Doe', read: false, time: '2 min ago', type: 'booking' },
      { id: 2, message: 'Your property was viewed 15 times today', read: false, time: '1 hour ago', type: 'view' },
      { id: 3, message: 'Payment received for booking #4567', read: true, time: '3 days ago', type: 'payment' },
      { id: 4, message: 'Your subscription will expire in 7 days', read: true, time: '1 week ago', type: 'system' },
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const nameParts = user.name ? user.name.split(' ') : [];
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.name ? user.name[0].toUpperCase() : 'U';
  };
  
  // Get user role display name
  const getUserRole = () => {
    if (!user) return 'User';
    switch(user.user_type) {
      case 'admin':
        return 'Administrator';
      case 'agent':
        return 'Real Estate Agent';
      case 'hotel_manager':
        return 'Hotel Manager';
      default:
        return 'User';
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  // Navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { 
        title: 'Dashboard', 
        path: '/dashboard', 
        icon: <FaHome className={styles.navIcon} />,
        exact: true
      },
      { 
        title: 'Bookings', 
        path: '/dashboard/bookings', 
        icon: <FaCalendarAlt className={styles.navIcon} />
      },
      { 
        title: 'Profile', 
        path: '/dashboard/profile', 
        icon: <FaUserCircle className={styles.navIcon} />
      },
      { 
        title: 'Settings', 
        path: '/dashboard/settings', 
        icon: <FaCog className={styles.navIcon} />
      }
    ];
    
    const roleSpecificItems = [];
    
    if (user?.user_type === 'admin') {
      roleSpecificItems.push(
        { 
          title: 'Users', 
          path: '/dashboard/users', 
          icon: <FaUsers className={styles.navIcon} />
        },
        { 
          title: 'Properties', 
          path: '/dashboard/properties', 
          icon: <FaBuilding className={styles.navIcon} />
        },
        { 
          title: 'Hotels', 
          path: '/dashboard/hotels', 
          icon: <FaHotel className={styles.navIcon} />
        },
        { 
          title: 'Reports', 
          path: '/dashboard/reports', 
          icon: <FaChartLine className={styles.navIcon} />
        }
      );
    } else if (user?.user_type === 'agent') {
      roleSpecificItems.push(
        { 
          title: 'My Properties', 
          path: '/dashboard/properties', 
          icon: <FaBuilding className={styles.navIcon} />
        },
        { 
          title: 'Inquiries', 
          path: '/dashboard/inquiries', 
          icon: <FaEnvelope className={styles.navIcon} />
        },
        { 
          title: 'Earnings', 
          path: '/dashboard/earnings', 
          icon: <FaDollarSign className={styles.navIcon} />
        }
      );
    } else if (user?.user_type === 'hotel_manager') {
      roleSpecificItems.push(
        { 
          title: 'Rooms', 
          path: '/dashboard/rooms', 
          icon: <FaHotel className={styles.navIcon} />
        },
        { 
          title: 'Reservations', 
          path: '/dashboard/reservations', 
          icon: <FaCalendarAlt className={styles.navIcon} />
        },
        { 
          title: 'Housekeeping', 
          path: '/dashboard/housekeeping', 
          icon: <FaUsers className={styles.navIcon} />
        },
        { 
          title: 'Revenue', 
          path: '/dashboard/revenue', 
          icon: <FaDollarSign className={styles.navIcon} />
        }
      );
    }
    
    return [...commonItems, ...roleSpecificItems];
  };
  
  const navItems = getNavItems();
  
  // Check if a nav item is active
  const isActive = (path, exact = false) => {
    return exact 
      ? location.pathname === path
      : location.pathname.startsWith(path) && path !== '/dashboard';
  };
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/dashboard/');
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock activities - in a real app, these would come from the API
  const mockActivities = [
    {
      id: 1,
      message: 'New booking request from John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      type: 'info',
      action: 'View',
      actionType: 'primary',
      onAction: () => window.location.href = '/dashboard/bookings/123'
    },
    {
      id: 2,
      message: 'Your property "Luxury Villa" was viewed 15 times today',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: 'success'
    },
    {
      id: 3,
      message: 'Payment received for booking #4567',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'success',
      action: 'View Receipt',
      actionType: 'secondary'
    },
    {
      id: 4,
      message: 'Your subscription will expire in 7 days',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      type: 'warning',
      action: 'Renew Now',
      actionType: 'primary'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Determine which stats to show based on user role
  const renderStats = () => {
    if (!dashboardData) return null;
    
    const commonStats = [
      {
        title: 'Total Properties',
        value: dashboardData.total_properties || 0,
        change: 12, // This would come from the API in a real app
        icon: FaBuilding,
        color: '#5A3825' // Earth Brown
      },
      {
        title: 'Active Listings',
        value: dashboardData.active_listings || 0,
        change: 5,
        icon: FaHome,
        color: '#228B22' // Forest Green
      },
      {
        title: 'Total Bookings',
        value: dashboardData.total_bookings || 0,
        change: -2,
        icon: FaCalendarAlt,
        color: '#DAA520' // Warm Gold
      },
      {
        title: 'Total Revenue',
        value: dashboardData.total_revenue ? `$${dashboardData.total_revenue.toLocaleString()}` : '$0',
        change: 18,
        icon: FaDollarSign,
        color: '#2E2E2E' // Deep Charcoal
      }
    ];

    // Add role-specific stats
    if (dashboardData.user_type === 'admin') {
      commonStats.splice(1, 0, {
        title: 'Total Users',
        value: dashboardData.total_users || 0,
        change: 8,
        icon: FaUsers,
        color: '#6A5ACD' // Slate Blue
      });
    } else if (dashboardData.user_type === 'agent') {
      commonStats.splice(1, 0, {
        title: 'Pending Inquiries',
        value: dashboardData.pending_inquiries || 0,
        change: 3,
        icon: FaUsers,
        color: '#6A5ACD' // Slate Blue
      });
    } else if (dashboardData.user_type === 'hotel_manager') {
      commonStats.splice(1, 0, {
        title: 'Occupancy Rate',
        value: dashboardData.occupancy_rate ? `${dashboardData.occupancy_rate}%` : '0%',
        change: 5,
        icon: FaChartLine,
        color: '#6A5ACD' // Slate Blue
      });
    }

    return commonStats;
  };

  // Get welcome message based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!user) return null;
    
    switch(user.user_type) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'agent':
        return <AgentDashboard user={user} />;
      case 'hotel_manager':
        return <HotelManagerDashboard user={user} />;
      default:
        return (
          <div className="default-dashboard">
            <h2>Welcome to Shiats3</h2>
            <p>You don't have a specific dashboard assigned. Please contact support.</p>
          </div>
        );
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="loading-container">
      <FaSpinner className="spinner" />
      <p>Loading dashboard...</p>
    </div>
  );

  // Error boundary component
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Dashboard Error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="error-container">
            <h2>Something went wrong</h2>
            <p>We're having trouble loading your dashboard. Please try refreshing the page.</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        );
      }

      return this.props.children;
    }
  }

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Shiats3" className="logo-image" />
            <span className="logo-text">Shiats3</span>
          </Link>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        
        <div className="user-profile">
          <div className="avatar">
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt={user.name || 'User'} />
            ) : (
              <span className="avatar-text">{getUserInitials()}</span>
            )}
          </div>
          <div className="user-info">
            <h4 className="user-name">{user?.name || 'User'}</h4>
            <span className="user-role">{getUserRole()}</span>
          </div>
        </div>
        
        <nav className="nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                >
                  {item.icon}
                  <span className="nav-text">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <header className="top-nav">
          <div className="nav-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <h1 className="page-title">
              {navItems.find(item => isActive(item.path, item.exact))?.title || 'Dashboard'}
            </h1>
          </div>
          
          <div className="nav-right">
            <div className={`notifications ${notificationsOpen ? 'notifications-open' : ''}`}>
              <button 
                className={`notification-button ${unreadCount > 0 ? 'has-unread' : ''}`}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <FaBell className="notification-icon" />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="notifications-dropdown dropdown">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <button 
                      className="mark-all-read"
                      onClick={() => {
                        // In a real app, this would mark all as read via API
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                        setUnreadCount(0);
                      }}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                          onClick={() => {
                            // Handle notification click
                            if (!notification.read) {
                              // Mark as read
                              setNotifications(notifications.map(n => 
                                n.id === notification.id ? { ...n, read: true } : n
                              ));
                              setUnreadCount(prev => Math.max(0, prev - 1));
                            }
                            // Navigate based on notification type
                            // This is just a placeholder - actual navigation would depend on the notification
                            navigate('/dashboard/notifications');
                          }}
                        >
                          <div className="notification-content">
                            <p className="notification-message">{notification.message}</p>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                          {!notification.read && <div className="unread-indicator"></div>}
                        </div>
                      ))
                    ) : (
                      <div className="empty-notifications">
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="dropdown-footer">
                    <Link to="/dashboard/notifications" className="view-all-link">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`profile ${profileOpen ? 'profile-open' : ''}`}>
              <button 
                className="profile-button"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="avatar-small">
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt={user.name || 'User'} />
                  ) : (
                    <span className="avatar-text-small">{getUserInitials()}</span>
                  )}
                </div>
                <span className="user-name">{user?.name || 'User'}</span>
              </button>
              
              {profileOpen && (
                <div className="profile-dropdown dropdown">
                  <div className="profile-info">
                    <div className="avatar-medium">
                      {user?.profile_picture ? (
                        <img src={user.profile_picture} alt={user.name || 'User'} />
                      ) : (
                        <span className="avatar-text-medium">{getUserInitials()}</span>
                      )}
                    </div>
                    <div className="user-info">
                      <h4 className="user-name">{user?.name || 'User'}</h4>
                      <span className="user-email">{user?.email || ''}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link 
                    to="/dashboard/profile" 
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaUserCircle className="dropdown-icon" />
                    <span>My Profile</span>
                  </Link>
                  <Link 
                    to="/dashboard/settings" 
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaCog className="dropdown-icon" />
                    <span>Settings</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="content-wrapper">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              {renderDashboard()}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
