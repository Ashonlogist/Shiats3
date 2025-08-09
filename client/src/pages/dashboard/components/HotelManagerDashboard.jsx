import React from 'react';
import { FaHotel, FaBed, FaUsers, FaDollarSign, FaCalendarAlt, FaChartLine, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StatCard from '../../components/dashboard/components/StatCard';
import ActivityFeed from '../../components/dashboard/components/ActivityFeed';
import './HotelManagerDashboard.css';

const HotelManagerDashboard = ({ user }) => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      title: 'Total Rooms',
      value: '85',
      change: 2.5,
      icon: <FaBed className="stat-icon" />,
      color: '#3498db' // Blue
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      change: 5.2,
      icon: <FaHotel className="stat-icon" />,
      color: '#2ecc71' // Green
    },
    {
      title: 'Today Check-ins',
      value: '12',
      change: -2,
      icon: <FaUsers className="stat-icon" />,
      color: '#e74c3c' // Red
    },
    {
      title: 'Daily Revenue',
      value: '$8,750',
      change: 12.3,
      icon: <FaDollarSign className="stat-icon" />,
      color: '#9b59b6' // Purple
    }
  ];

  const recentActivities = [
    {
      id: 1,
      message: 'New reservation for Suite #302 - 3 nights',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      type: 'info',
      action: 'View',
      actionType: 'primary',
      onAction: () => window.location.href = '/dashboard/reservations/123'
    },
    {
      id: 2,
      message: 'Room #205 checked out - Payment received',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: 'success'
    },
    {
      id: 3,
      message: 'Maintenance request for Room #112 - AC not working',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      type: 'warning'
    },
    {
      id: 4,
      message: 'New 5-star review from John D.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'success'
    }
  ];

  const quickActions = [
    {
      title: 'Add Reservation',
      icon: <FaPlus className="action-icon" />,
      path: '/dashboard/reservations/new'
    },
    {
      title: 'Check-in',
      icon: <FaUsers className="action-icon" />,
      path: '/dashboard/check-in'
    },
    {
      title: 'Manage Rooms',
      icon: <FaBed className="action-icon" />,
      path: '/dashboard/rooms'
    },
    {
      title: 'View Calendar',
      icon: <FaCalendarAlt className="action-icon" />,
      path: '/dashboard/calendar'
    }
  ];

  // Mock data for room status
  const roomStatus = {
    available: 45,
    occupied: 35,
    maintenance: 5,
    total: 85
  };

  // Calculate percentages for the room status bar
  const availablePercent = (roomStatus.available / roomStatus.total) * 100;
  const occupiedPercent = (roomStatus.occupied / roomStatus.total) * 100;
  const maintenancePercent = (roomStatus.maintenance / roomStatus.total) * 100;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="welcome-message">
            Welcome back, {user?.name?.split(' ')[0] || 'Manager'}! 👋
          </h1>
          <p className="welcome-subtitle">
            Here's what's happening at your hotel today.
          </p>
        </div>
        <div className="header-actions">
          <Link 
            to="/dashboard/reservations/new" 
            className="primary-button"
          >
            + New Reservation
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

          {/* Room Status */}
          <div className="room-status">
            <div className="section-header">
              <h3 className="section-title">Room Status</h3>
              <Link to="/dashboard/rooms" className="view-all">View All</Link>
            </div>
            
            <div className="status-bars">
              <div className="status-bar available" style={{ width: `${availablePercent}%` }}>
                <span className="status-label">Available: {roomStatus.available}</span>
              </div>
              <div className="status-bar occupied" style={{ width: `${occupiedPercent}%` }}>
                <span className="status-label">Occupied: {roomStatus.occupied}</span>
              </div>
              <div className="status-bar maintenance" style={{ width: `${maintenancePercent}%` }}>
                <span className="status-label">Maintenance: {roomStatus.maintenance}</span>
              </div>
            </div>
            
            <div className="status-legend">
              <div className="legend-item">
                <span className="legend-color available"></span>
                <span className="legend-label">Available ({roomStatus.available})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color occupied"></span>
                <span className="legend-label">Occupied ({roomStatus.occupied})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color maintenance"></span>
                <span className="legend-label">Maintenance ({roomStatus.maintenance})</span>
              </div>
            </div>
            
            <div className="total-rooms">Total Rooms: {roomStatus.total}</div>
          </div>
          
          {/* Performance Summary */}
          <div className="performance-summary">
            <h3 className="section-title">Performance Summary</h3>
            <div className="metrics-grid">
              <div className="metric">
                <div className="metric-value">92%</div>
                <div className="metric-label">Occupancy Rate</div>
              </div>
              <div className="metric">
                <div className="metric-value">4.7</div>
                <div className="metric-label">Avg. Rating</div>
              </div>
              <div className="metric">
                <div className="metric-value">$24.5K</div>
                <div className="metric-label">Monthly Revenue</div>
              </div>
            </div>
            <div className="view-details">
              <Link to="/dashboard/analytics" className="view-details-link">
                View Detailed Analytics <FaChartLine className="inline-icon" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelManagerDashboard;
