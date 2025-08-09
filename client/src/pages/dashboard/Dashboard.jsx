import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useLocation, Link, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
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
  FaSpinner,
  FaTachometerAlt
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import api from '../../services/api';
import styles from './Dashboard.module.css';

// Lazy load dashboard components
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const AgentDashboard = React.lazy(() => import('./components/AgentDashboard'));
const HotelManagerDashboard = React.lazy(() => import('./components/HotelManagerDashboard'));

const Dashboard = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // State for sidebar and dropdowns
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // State for dashboard data and UI
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track navigation state to prevent multiple redirects and throttling
  const navigationRef = React.useRef({
    isNavigating: false,
    lastNavigation: 0,
    authCheckComplete: false,
    navigationTimeout: null
  });
  
  // Handle authentication and data fetching in separate effects for better control
  
  // Effect for handling authentication state
  useEffect(() => {
    if (authLoading) return;
    
    // If there's no user but we're not on the login page, navigate to login
    if (!user && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('token');
      navigate('/login', { 
        state: { from: location },
        replace: true 
      });
    }
  }, [user, authLoading, navigate, location]);
  
  // Effect for fetching dashboard data
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    
    // Only proceed if we have a user and we're not on the login page
    if (!user || window.location.pathname.startsWith('/login')) {
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        // Set loading state after a small delay to prevent flickering
        timeoutId = setTimeout(() => {
          if (isMounted) setLoading(true);
        }, 100);

        // Get the token and verify it exists
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Determine the correct dashboard endpoint based on user type
        let endpoint = '/dashboard/';
        if (user?.user_type === 'admin') {
          endpoint = '/admin/dashboard/';
        } else if (user?.user_type === 'agent') {
          endpoint = '/agent/dashboard/';
        } else if (user?.user_type === 'hotel_manager') {
          endpoint = '/hotel/dashboard/';
        }
        
        // Make the API request
        const response = await api.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        // Clear the loading timeout
        clearTimeout(timeoutId);
        
        if (isMounted) {
          // Update state with the fetched data
          setDashboardData(response.data || {});
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        clearTimeout(timeoutId);
        
        if (isMounted) {
          if (err.response?.status === 401 || err.response?.status === 403 || err.message === 'No authentication token found') {
            // If unauthorized, clear token and redirect to login
            localStorage.removeItem('token');
            navigate('/login', { 
              state: { from: location },
              replace: true 
            });
          } else {
            // For other errors, show error message but keep the UI interactive
            setError('Failed to load dashboard data. Please try again.');
            setLoading(false);
          }
        }
      }
    };

    fetchDashboardData();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, navigate, location]);
  
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
    const handleClickOutside = (e) => {
      if (profileOpen && !e.target.closest(`.${styles.userMenu}`)) {
        setProfileOpen(false);
      }
      if (notificationsOpen && !e.target.closest(`.${styles.notifications}`)) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen, notificationsOpen, styles]);
  
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
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Format user role for display
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
      // Reset navigation state before logout
      navigationRef.current = {
        isNavigating: false,
        lastNavigation: 0,
        authCheckComplete: false
      };
      
      await logout();
      // Clear any existing navigation state to prevent loops
      window.history.replaceState({}, document.title, '/login');
      navigate('/login', { replace: true });
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

  // If we're still checking authentication, show loading
  if (authLoading) {
    return (
      <div className={styles.fullPageLoader}>
        <FaSpinner className={styles.spinner} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }
  
  // If not authenticated and not on login page, redirect to login
  if (!user) {
    if (!window.location.pathname.startsWith('/login')) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return null;
  }

  // Show loading state while fetching dashboard data
  if (loading) {
    return (
      <div className={styles.fullPageLoader}>
        <FaSpinner className={styles.spinner} />
        <p>Loading your dashboard data...</p>
      </div>
    );
  }

  // Show error state if there's an error
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

  // Mock activities - in a real app, these would come from the API
  const mockActivities = [
    {
      id: 1,
      message: 'New booking request from John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      type: 'info',
      action: 'View',
      actionType: 'primary',
      onAction: () => navigate('/dashboard/bookings/123')
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

  // Render the appropriate dashboard based on user role
  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
          <p>Loading your dashboard...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      );
    }

    // If we have dashboard data, render the appropriate dashboard
    if (dashboardData) {
      return (
        <div className={styles.dashboardContent}>
          <Routes>
            <Route 
              path="/" 
              element={
                user?.user_type === 'admin' ? <AdminDashboard user={user} /> :
                user?.user_type === 'agent' ? <AgentDashboard user={user} /> :
                user?.user_type === 'hotel_manager' ? <HotelManagerDashboard user={user} /> :
                <Navigate to="/unauthorized" replace />
              } 
            />
            <Route path="properties/*" element={<div>Properties Management</div>} />
            <Route path="bookings/*" element={<div>Bookings Management</div>} />
            <Route path="reports/*" element={<div>Reports</div>} />
            <Route path="settings/*" element={<div>Settings</div>} />
          </Routes>
        </div>
      );
    }

    // Default fallback
    return (
      <div className={styles.dashboardContent}>
        <h2>Welcome to Shiats3 Dashboard</h2>
        <p>Select an option from the sidebar to get started.</p>
      </div>
    );
  };

  return (
    <div className={styles.dashboardWrapper}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🏠</span>
            <span className={styles.logoText}>Shiats3</span>
          </Link>
          <button 
            className={styles.closeSidebar} 
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user?.profile_picture ? (
              <img 
                src={user.profile_picture} 
                alt={user.name || 'User'} 
                className={styles.avatarImage}
              />
            ) : (
              <span className={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
          <div className={styles.userInfo}>
            <h4 className={styles.userName}>{user?.name || 'User'}</h4>
            <span className={styles.userRole}>
              {user?.user_type ? user.user_type.replace('_', ' ') : 'User'}
            </span>
          </div>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.path} className={styles.navItem}>
                <Link 
                  to={item.path} 
                  className={`${styles.navLink} ${isActive(item.path, item.exact) ? styles.active : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navText}>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button 
            className={styles.logoutButton} 
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FaSignOutAlt className={styles.logoutIcon} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Top Navigation */}
        <header className={styles.topNav}>
          <div className={styles.navLeft}>
            <button 
              className={styles.menuButton} 
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </button>
            <h1 className={styles.pageTitle}>
              {getPageTitle()}
            </h1>
          </div>
          
          <div className={styles.navRight}>
            <div className={styles.notifications}>
              <button 
                className={`${styles.notificationButton} ${unreadCount > 0 ? styles.hasNotifications : ''}`}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label={`${unreadCount} notifications`}
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className={styles.notificationBadge}>{unreadCount}</span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className={styles.notificationsDropdown}>
                  <div className={styles.notificationsHeader}>
                    <h3>Notifications ({unreadCount})</h3>
                    <button 
                      className={styles.markAllRead}
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                  
                  <div className={styles.notificationsList}>
                    {mockActivities.length > 0 ? (
                      mockActivities.map((activity) => (
                        <div 
                          key={activity.id} 
                          className={`${styles.notificationItem} ${activity.read ? '' : styles.unread}`}
                          onClick={() => handleNotificationClick(activity)}
                        >
                          <div className={styles.notificationIcon}>
                            {activity.type === 'success' ? '✓' : 'ℹ️'}
                          </div>
                          <div className={styles.notificationContent}>
                            <p className={styles.notificationMessage}>{activity.message}</p>
                            <p className={styles.notificationTime}>
                              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </p>
                            {activity.action && (
                              <button 
                                className={`${styles.notificationAction} ${styles[activity.actionType] || ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  activity.onAction?.();
                                }}
                              >
                                {activity.action}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noNotifications}>
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.notificationsFooter}>
                    <Link to="/dashboard/notifications">View all notifications</Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.userMenu}>
              <button 
                className={styles.userMenuButton}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className={styles.userAvatar}>
                  {user?.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt={user.name || 'User'} 
                      className={styles.avatarImage}
                    />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <span className={styles.userName}>{user?.name || 'User'}</span>
                <span className={`${styles.dropdownArrow} ${profileOpen ? styles.open : ''}`} aria-hidden="true">▼</span>
              </button>
              
              {profileOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={`${styles.userAvatar} ${styles.large}`}>
                      {user?.profile_picture ? (
                        <img 
                          src={user.profile_picture} 
                          alt={user.name || 'User'} 
                          className={styles.avatarImage}
                        />
                      ) : (
                        <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                      )}
                    </div>
                    <div className={styles.userInfo}>
                      <h4>{user?.name || 'User'}</h4>
                      <p>{user?.email || ''}</p>
                      <span className={styles.userRole}>
                        {user?.user_type ? user.user_type.replace('_', ' ') : 'User'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.dropdownLinks}>
                    <Link 
                      to="/dashboard/profile" 
                      className={styles.dropdownLink}
                      onClick={() => setProfileOpen(false)}
                    >
                      <FaUserCircle className={styles.dropdownIcon} /> My Profile
                    </Link>
                    <Link 
                      to="/dashboard/settings" 
                      className={styles.dropdownLink}
                      onClick={() => setProfileOpen(false)}
                    >
                      <FaCog className={styles.dropdownIcon} /> Settings
                    </Link>
                    <button 
                      className={`${styles.dropdownLink} ${styles.logout}`}
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className={styles.dropdownIcon} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className={styles.dashboardMainContent}>
          <ErrorBoundary>
            <Suspense fallback={
              <div className={styles.loadingContainer}>
                <FaSpinner className={styles.spinner} />
                <p>Loading dashboard...</p>
              </div>
            }>
              {renderDashboardContent()}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
