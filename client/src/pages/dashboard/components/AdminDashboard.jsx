import React from 'react';
import { FaUsers, FaBuilding, FaHotel, FaChartLine, FaDollarSign, FaCalendarAlt, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StatCard from '../../components/dashboard/components/StatCard';
import ActivityFeed from '../../components/dashboard/components/ActivityFeed';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: 8.2,
      icon: <FaUsers className="stat-icon" />,
      color: '#5A3825' // Earth Brown
    },
    {
      title: 'Total Properties',
      value: '567',
      change: 5,
      icon: <FaBuilding className="stat-icon" />,
      color: '#228B22' // Forest Green
    },
    {
      title: 'Total Hotels',
      value: '89',
      change: -2,
      icon: <FaHotel className="stat-icon" />,
      color: '#DAA520' // Warm Gold
    },
    {
      title: 'Total Revenue',
      value: '$124,567',
      change: 18.7,
      icon: <FaDollarSign className="stat-icon" />,
      color: '#2E2E2E' // Deep Charcoal
    }
  ];

  const recentActivities = [
    {
      id: 1,
      message: 'New user registered: John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      type: 'info'
    },
    {
      id: 2,
      message: 'New property "Luxury Villa" was added',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'success'
    },
    {
      id: 3,
      message: 'Payment of $1,200 received from Jane Smith',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: 'success'
    },
    {
      id: 4,
      message: 'Scheduled maintenance for database backup',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'warning'
    }
  ];

  const quickActions = [
    {
      title: 'Add New User',
      icon: <FaUsers className="action-icon" />,
      path: '/dashboard/users/new'
    },
    {
      title: 'Add Property',
      icon: <FaHome className="action-icon" />,
      path: '/dashboard/properties/new'
    },
    {
      title: 'View Reports',
      icon: <FaChartLine className="action-icon" />,
      path: '/dashboard/reports'
    },
    {
      title: 'View Bookings',
      icon: <FaCalendarAlt className="action-icon" />,
      path: '/dashboard/bookings'
    }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="welcome-message">
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
          </h1>
          <p className="welcome-subtitle">
            Here's what's happening with your platform today.
          </p>
        </div>
        <div className="header-actions">
          <Link 
            to="/dashboard/users/new" 
            className="primary-button"
          >
            + Add New
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Left Column */}
        <div className="left-column">
          {/* Recent Activities */}
          <ActivityFeed 
            activities={recentActivities} 
            title="Recent Activities"
            limit={5}
          />
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Quick Actions */}
          <div className="quick-actions">
            <h3 className="section-title">Quick Actions</h3>
            <div className="actions-grid">
              {quickActions.map((action, index) => (
                <Link 
                  key={index} 
                  to={action.path}
                  className="action-button"
                >
                  {action.icon}
                  <span>{action.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
