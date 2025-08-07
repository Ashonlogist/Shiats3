import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { 
  FaHome, 
  FaBuilding, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaChevronDown
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from an API
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'Property Owner'
  };

  const stats = [
    { id: 1, title: 'Total Properties', value: '12', icon: <FaBuilding />, color: '#4e73df' },
    { id: 2, title: 'Bookings', value: '8', icon: <FaCalendarAlt />, color: '#1cc88a' },
    { id: 3, title: 'Messages', value: '5', icon: <FaEnvelope />, color: '#36b9cc' },
    { id: 4, title: 'Earnings', value: '$24,500', icon: <FaBuilding />, color: '#f6c23e' }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <FaHome />, path: '/dashboard' },
    { id: 'properties', label: 'Properties', icon: <FaBuilding />, path: '/dashboard/properties' },
    { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt />, path: '/dashboard/bookings' },
    { id: 'messages', label: 'Messages', icon: <FaEnvelope />, path: '/dashboard/messages' },
    { id: 'profile', label: 'Profile', icon: <FaUser />, path: '/dashboard/profile' },
    { id: 'settings', label: 'Settings', icon: <FaCog />, path: '/dashboard/settings' }
  ];

  return (
    <div className={`dashboard-container ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-toggle" onClick={toggleMobileMenu}>
          {showMobileMenu ? <FaTimes /> : <FaBars />}
        </button>
        <Link to="/" className="logo">
          <span>Shiats3</span>
        </Link>
        <div className="mobile-actions">
          <button className="notification-btn">
            <FaBell />
            <span className="badge">3</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${showMobileMenu ? 'mobile-visible' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="logo">
            <span>Shiats3</span>
          </Link>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        <div className="user-profile">
          <div className="avatar">
            <img src={user.avatar} alt={user.name} />
          </div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>{user.role}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className={activeTab === item.id ? 'active' : ''}>
                <Link 
                  to={item.path} 
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMobileMenu(false);
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          
          <div className="header-actions">
            <button className="notification-btn">
              <FaBell />
              <span className="badge">3</span>
            </button>
            
            <div 
              className="profile-dropdown" 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="profile-info">
                <img src={user.avatar} alt={user.name} className="profile-avatar" />
                <div className="profile-details">
                  <span className="profile-name">{user.name}</span>
                  <span className="profile-role">{user.role}</span>
                </div>
                <FaChevronDown className={`dropdown-arrow ${showProfileDropdown ? 'open' : ''}`} />
              </div>
              
              {showProfileDropdown && (
                <div className="dropdown-menu">
                  <Link to="/dashboard/profile" className="dropdown-item">
                    <FaUser /> My Profile
                  </Link>
                  <Link to="/dashboard/settings" className="dropdown-item">
                    <FaCog /> Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <Outlet />
          
          {!window.location.pathname.includes('/dashboard/') && (
            <div className="dashboard-overview">
              <h2 className="page-title">Dashboard Overview</h2>
              
              <div className="stats-grid">
                {stats.map((stat) => (
                  <div key={stat.id} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                    <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                    <div className="stat-info">
                      <h3>{stat.title}</h3>
                      <p>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="recent-activity">
                <div className="section-header">
                  <h3>Recent Activity</h3>
                  <Link to="/dashboard/activity" className="view-all">View All</Link>
                </div>
                
                <div className="activity-list">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="activity-item">
                      <div className="activity-icon">
                        <FaBell />
                      </div>
                      <div className="activity-content">
                        <p><strong>New booking</strong> received for your property at 123 Main St</p>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <Link to="/dashboard/properties/add" className="action-btn">
                    <FaPlus /> Add New Property
                  </Link>
                  <Link to="/dashboard/bookings/new" className="action-btn">
                    <FaCalendarAlt /> Create Booking
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
