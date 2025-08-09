import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBuilding, FaHotel, FaUserTie, FaUsers, FaClipboardList, FaEnvelope, FaBell, FaBars, FaTimes, FaChartLine, FaCog } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import UserProfile from './UserProfile';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Determine user type for navigation
  const isAdmin = user?.user_type === 'admin';
  const isAgent = user?.user_type === 'agent';
  const isHotelManager = user?.user_type === 'hotel_manager';

  // Navigation items based on user role
  const navItems = [
    { 
      icon: <FaHome />, 
      label: 'Dashboard', 
      path: '/dashboard',
      roles: ['admin', 'agent', 'hotel_manager']
    },
    { 
      icon: <FaBuilding />, 
      label: 'Properties', 
      path: '/dashboard/properties',
      roles: ['admin', 'agent']
    },
    { 
      icon: <FaHotel />, 
      label: 'Hotels', 
      path: '/dashboard/hotels',
      roles: ['admin', 'hotel_manager']
    },
    { 
      icon: <FaUserTie />, 
      label: 'Agents', 
      path: '/dashboard/agents',
      roles: ['admin']
    },
    { 
      icon: <FaUsers />, 
      label: 'Users', 
      path: '/dashboard/users',
      roles: ['admin']
    },
    { 
      icon: <FaClipboardList />, 
      label: 'Bookings', 
      path: '/dashboard/bookings',
      roles: ['admin', 'agent', 'hotel_manager']
    },
    { 
      icon: <FaEnvelope />, 
      label: 'Inquiries', 
      path: '/dashboard/inquiries',
      roles: ['admin', 'agent']
    },
    { 
      icon: <FaChartLine />, 
      label: 'Analytics', 
      path: '/dashboard/analytics',
      roles: ['admin', 'hotel_manager']
    },
    { 
      icon: <FaCog />, 
      label: 'Settings', 
      path: '/dashboard/settings',
      roles: ['admin', 'agent', 'hotel_manager']
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.user_type)
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await authLogout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <button 
          className={styles.menuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <Link to="/" className={styles.mobileLogo}>
          <FaBuilding className={styles.logoIcon} />
          <span>Shiats3</span>
        </Link>
        <div className={styles.mobileHeaderRight}>
          <UserProfile />
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>
            <FaBuilding className={styles.logoIcon} />
            <span>Shiats3</span>
          </Link>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {filteredNavItems.map((item) => (
              <li 
                key={item.path} 
                className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              >
                <Link to={item.path} className={styles.navLink}>
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              {filteredNavItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.notificationButton} aria-label="Notifications">
              <FaBell className={styles.notificationIcon} />
              <span className={styles.notificationBadge}>3</span>
            </button>
            <UserProfile />
          </div>
        </header>
        
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
