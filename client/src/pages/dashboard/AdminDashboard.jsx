import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBuilding, FaHotel, FaDollarSign, FaChartLine, FaUserCog } from 'react-icons/fa';
import StatCard from '../../components/dashboard/components/StatCard';
import ActivityFeed from '../../components/dashboard/components/ActivityFeed';
import api from '../../services/api';
import styles from './Dashboard.module.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an actual API call
        // const response = await api.get('/api/v1/dashboard/admin/');
        // setDashboardData(response.data);
        
        // Mock data for now
        setTimeout(() => {
          setDashboardData({
            total_users: 1245,
            total_properties: 342,
            total_hotels: 87,
            total_revenue: 1254300,
            user_growth: 12.5,
            recent_activities: [
              {
                id: 1,
                message: 'New user registered: johndoe@example.com',
                timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
                type: 'info'
              },
              {
                id: 2,
                message: 'New property listing approved: Luxury Villa in Malibu',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                type: 'success',
                action: 'View',
                actionType: 'primary',
                onAction: () => navigate('/dashboard/properties/123')
              },
              {
                id: 3,
                message: 'Suspicious login attempt detected from new device',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
                type: 'warning',
                action: 'Review',
                actionType: 'secondary'
              }
            ]
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className={styles.dashboardContent}>
      <h2 className={styles.dashboardTitle}>Admin Dashboard</h2>
      <p className={styles.dashboardSubtitle}>Overview of your platform's performance and activities</p>
      
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Users"
          value={dashboardData?.total_users?.toLocaleString() || '0'}
          change={dashboardData?.user_growth || 0}
          icon={FaUsers}
          color="#5A3825" // Earth Brown
          onClick={() => navigate('/dashboard/users')}
        />
        
        <StatCard
          title="Total Properties"
          value={dashboardData?.total_properties?.toLocaleString() || '0'}
          change={8.2}
          icon={FaBuilding}
          color="#228B22" // Forest Green
          onClick={() => navigate('/dashboard/properties')}
        />
        
        <StatCard
          title="Total Hotels"
          value={dashboardData?.total_hotels?.toLocaleString() || '0'}
          change={3.5}
          icon={FaHotel}
          color="#DAA520" // Warm Gold
          onClick={() => navigate('/dashboard/hotels')}
        />
        
        <StatCard
          title="Total Revenue"
          value={dashboardData?.total_revenue ? `$${(dashboardData.total_revenue / 1000000).toFixed(1)}M` : '$0'}
          change={18.7}
          icon={FaDollarSign}
          color="#2E2E2E" // Deep Charcoal
          onClick={() => navigate('/dashboard/reports')}
        />
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Recent Activities */}
          <ActivityFeed 
            activities={dashboardData?.recent_activities || []} 
            title="Recent Activities"
            limit={5}
          />
          
          {/* Quick Stats */}
          <div className={styles.quickStats}>
            <h3 className={styles.sectionTitle}>Quick Stats</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statIcon} style={{ backgroundColor: 'rgba(90, 56, 37, 0.1)' }}>
                  <FaUserCog className={styles.statIconSvg} style={{ color: '#5A3825' }} />
                </div>
                <div className={styles.statContent}>
                  <h4>Active Admins</h4>
                  <p>12</p>
                </div>
              </div>
              
              <div className={styles.statItem}>
                <div className={styles.statIcon} style={{ backgroundColor: 'rgba(34, 139, 34, 0.1)' }}>
                  <FaChartLine className={styles.statIconSvg} style={{ color: '#228B22' }} />
                </div>
                <div className={styles.statContent}>
                  <h4>Monthly Growth</h4>
                  <p>+12.5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.actionsGrid}>
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/users/new')}
              >
                <FaUsers className={styles.actionIcon} />
                <span>Add New User</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/properties/new')}
              >
                <FaBuilding className={styles.actionIcon} />
                <span>Add New Property</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/hotels/new')}
              >
                <FaHotel className={styles.actionIcon} />
                <span>Add New Hotel</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/settings')}
              >
                <FaUserCog className={styles.actionIcon} />
                <span>System Settings</span>
              </button>
            </div>
          </div>
          
          {/* System Status */}
          <div className={styles.systemStatus}>
            <h3 className={styles.sectionTitle}>System Status</h3>
            <div className={styles.statusItem}>
              <div className={styles.statusIndicator} style={{ backgroundColor: '#4CAF50' }}></div>
              <span>API Server</span>
              <span className={styles.statusValue}>Operational</span>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusIndicator} style={{ backgroundColor: '#4CAF50' }}></div>
              <span>Database</span>
              <span className={styles.statusValue}>Healthy</span>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusIndicator} style={{ backgroundColor: '#4CAF50' }}></div>
              <span>Storage</span>
              <span className={styles.statusValue}>64% used</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
