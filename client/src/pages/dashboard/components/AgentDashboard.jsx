import React from 'react';
import { FaHome, FaDollarSign, FaEnvelope, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StatCard from '../../components/dashboard/components/StatCard';
import ActivityFeed from '../../components/dashboard/components/ActivityFeed';
import './AgentDashboard.css';

const AgentDashboard = ({ user }) => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      title: 'My Listings',
      value: '24',
      change: 3.2,
      icon: <FaHome className="stat-icon" />,
      color: '#2c3e50' // Dark Blue
    },
    {
      title: 'Active Listings',
      value: '18',
      change: 2,
      icon: <FaHome className="stat-icon" />,
      color: '#27ae60' // Green
    },
    {
      title: 'Pending Inquiries',
      value: '7',
      change: -1,
      icon: <FaEnvelope className="stat-icon" />,
      color: '#e67e22' // Orange
    },
    {
      title: 'Monthly Earnings',
      value: '$12,450',
      change: 15.7,
      icon: <FaDollarSign className="stat-icon" />,
      color: '#8e44ad' // Purple
    }
  ];

  const recentActivities = [
    {
      id: 1,
      message: 'New inquiry for your property "Beachfront Villa"',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      type: 'info',
      action: 'View',
      actionType: 'primary',
      onAction: () => window.location.href = '/dashboard/inquiries/123'
    },
    {
      id: 2,
      message: 'Your property "Mountain Retreat" was viewed 12 times today',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: 'success'
    },
    {
      id: 3,
      message: 'Commission payment received: $1,250',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'success'
    },
    {
      id: 4,
      message: 'Your subscription will renew in 5 days',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      type: 'warning'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Property',
      icon: <FaHome className="action-icon" />,
      path: '/dashboard/properties/new'
    },
    {
      title: 'View Inquiries',
      icon: <FaEnvelope className="action-icon" />,
      path: '/dashboard/inquiries'
    },
    {
      title: 'Earnings',
      icon: <FaDollarSign className="action-icon" />,
      path: '/dashboard/earnings'
    },
    {
      title: 'View Calendar',
      icon: <FaCalendarAlt className="action-icon" />,
      path: '/dashboard/calendar'
    }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="welcome-message">
            Welcome back, {user?.name?.split(' ')[0] || 'Agent'}! 👋
          </h1>
          <p className="welcome-subtitle">
            Here's what's happening with your properties today.
          </p>
        </div>
        <div className="header-actions">
          <Link 
            to="/dashboard/properties/new" 
            className="primary-button"
          >
            + Add Property
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

          {/* Performance Overview */}
          <div className="performance-overview">
            <h3 className="section-title">Performance Overview</h3>
            <div className="performance-metrics">
              <div className="metric">
                <div className="metric-value">87%</div>
                <div className="metric-label">Response Rate</div>
              </div>
              <div className="metric">
                <div className="metric-value">4.8</div>
                <div className="metric-label">Avg. Rating</div>
              </div>
              <div className="metric">
                <div className="metric-value">12</div>
                <div className="metric-label">Properties Sold</div>
              </div>
            </div>
            <div className="view-details">
              <Link to="/dashboard/performance" className="view-details-link">
                View Detailed Analytics <FaChartLine className="inline-icon" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
