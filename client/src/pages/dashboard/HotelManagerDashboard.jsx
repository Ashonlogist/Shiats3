import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHotel, FaBed, FaCalendarAlt, FaDollarSign, FaUsers, FaChartLine } from 'react-icons/fa';
import StatCard from '../../components/dashboard/components/StatCard';
import ActivityFeed from '../../components/dashboard/components/ActivityFeed';
import api from '../../services/api';
import styles from './Dashboard.module.css';

const HotelManagerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an actual API call
        // const response = await api.get('/api/v1/dashboard/hotel-manager/');
        // setDashboardData(response.data);
        
        // Mock data for now
        setTimeout(() => {
          setDashboardData({
            total_rooms: 85,
            occupied_rooms: 62,
            occupancy_rate: 73,
            total_revenue: 45230,
            upcoming_check_ins: [
              {
                id: 1,
                guest: 'John Smith',
                room: 'Deluxe Suite (305)',
                check_in: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
                nights: 3,
                total: 1275,
                status: 'confirmed'
              },
              {
                id: 2,
                guest: 'Sarah Johnson',
                room: 'Standard Double (208)',
                check_in: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6 hours from now
                nights: 2,
                total: 450,
                status: 'confirmed'
              }
            ],
            recent_activities: [
              {
                id: 1,
                message: 'New booking from John Smith for Deluxe Suite',
                timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
                type: 'success',
                action: 'View',
                actionType: 'primary',
                onAction: () => navigate('/dashboard/bookings/123')
              },
              {
                id: 2,
                message: 'Room 305 has been cleaned and is ready for check-in',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
                type: 'info'
              },
              {
                id: 3,
                message: 'Maintenance request for AC in Room 208',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
                type: 'warning',
                action: 'View',
                actionType: 'secondary'
              }
            ]
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching hotel manager dashboard data:', err);
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
        <p>Loading your dashboard...</p>
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

  // Format date to display as "Today at 2:00 PM" or "Tomorrow at 2:00 PM"
  const formatCheckInTime = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) return `Today at ${timeString}`;
    if (isTomorrow) return `Tomorrow at ${timeString}`;
    
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${timeString}`;
  };

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.dashboardHeader}>
        <div>
          <h2 className={styles.dashboardTitle}>Hotel Manager Dashboard</h2>
          <p className={styles.welcomeSubtitle}>Welcome back! Here's what's happening at your hotel today.</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={`${styles.primaryButton} ${styles.secondaryButton}`}
            onClick={() => navigate('/dashboard/calendar')}
          >
            <FaCalendarAlt /> View Calendar
          </button>
          <button 
            className={styles.primaryButton}
            onClick={() => navigate('/dashboard/bookings/new')}
          >
            + New Booking
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Rooms"
          value={dashboardData?.total_rooms || 0}
          change={0}
          icon={FaHotel}
          color="#5A3825" // Earth Brown
          onClick={() => navigate('/dashboard/rooms')}
        />
        
        <StatCard
          title="Occupied Rooms"
          value={`${dashboardData?.occupied_rooms || 0}/${dashboardData?.total_rooms || 0}`}
          change={2.5}
          icon={FaBed}
          color="#228B22" // Forest Green
          onClick={() => navigate('/dashboard/rooms?status=occupied')}
        />
        
        <StatCard
          title="Occupancy Rate"
          value={`${dashboardData?.occupancy_rate || 0}%`}
          change={1.2}
          icon={FaChartLine}
          color="#DAA520" // Warm Gold
          onClick={() => navigate('/dashboard/analytics')}
        />
        
        <StatCard
          title="Today's Revenue"
          value={dashboardData?.total_revenue ? `$${dashboardData.total_revenue.toLocaleString()}` : '$0'}
          change={8.7}
          icon={FaDollarSign}
          color="#2E2E2E" // Deep Charcoal
          onClick={() => navigate('/dashboard/revenue')}
        />
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Upcoming Check-ins */}
          <div className={styles.upcomingCheckIns}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Upcoming Check-ins</h3>
              <button 
                className={styles.viewAllButton}
                onClick={() => navigate('/dashboard/check-ins')}
              >
                View All
              </button>
            </div>
            
            {dashboardData?.upcoming_check_ins?.length > 0 ? (
              <div className={styles.checkInsList}>
                {dashboardData.upcoming_check_ins.map((checkIn) => (
                  <div key={checkIn.id} className={styles.checkInItem}>
                    <div className={styles.checkInTime}>
                      <FaCalendarAlt className={styles.calendarIcon} />
                      <span>{formatCheckInTime(new Date(checkIn.check_in))}</span>
                    </div>
                    <div className={styles.checkInDetails}>
                      <h4>{checkIn.guest}</h4>
                      <p>{checkIn.room} • {checkIn.nights} {checkIn.nights === 1 ? 'night' : 'nights'}</p>
                      <span className={`${styles.statusBadge} ${styles[checkIn.status]}`}>
                        {checkIn.status}
                      </span>
                    </div>
                    <div className={styles.checkInAmount}>
                      ${checkIn.total}
                    </div>
                    <button 
                      className={styles.viewButton}
                      onClick={() => navigate(`/dashboard/bookings/${checkIn.id}`)}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No upcoming check-ins today</p>
                <button 
                  className={styles.primaryButton}
                  onClick={() => navigate('/dashboard/bookings/new')}
                >
                  Create New Booking
                </button>
              </div>
            )}
          </div>
          
          {/* Recent Activities */}
          <ActivityFeed 
            activities={dashboardData?.recent_activities || []} 
            title="Recent Activities"
            limit={3}
          />
        </div>
        
        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.actionsGrid}>
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/bookings/new')}
              >
                <FaCalendarAlt className={styles.actionIcon} />
                <span>New Booking</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/check-in')}
              >
                <FaUsers className={styles.actionIcon} />
                <span>Check-in Guest</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/rooms')}
              >
                <FaBed className={styles.actionIcon} />
                <span>Manage Rooms</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/housekeeping')}
              >
                <FaHotel className={styles.actionIcon} />
                <span>Housekeeping</span>
              </button>
            </div>
          </div>
          
          {/* Occupancy Overview */}
          <div className={styles.occupancyOverview}>
            <h3 className={styles.sectionTitle}>Occupancy Overview</h3>
            <div className={styles.occupancyChart}>
              {/* This would be a chart in a real app */}
              <div className={styles.chartPlaceholder}>
                <FaChartLine className={styles.chartIcon} />
                <p>Occupancy: {dashboardData?.occupancy_rate || 0}%</p>
                <div className={styles.occupancyBar}>
                  <div 
                    className={styles.occupancyFill}
                    style={{ width: `${dashboardData?.occupancy_rate || 0}%` }}
                  ></div>
                </div>
                <span className={styles.occupancyLabel}>
                  {dashboardData?.occupied_rooms || 0} of {dashboardData?.total_rooms || 0} rooms occupied
                </span>
              </div>
            </div>
            <div className={styles.occupancyStats}>
              <div className={styles.occupancyStat}>
                <span className={styles.statValue}>{dashboardData?.total_rooms - dashboardData?.occupied_rooms || 0}</span>
                <span className={styles.statLabel}>Available Rooms</span>
              </div>
              <div className={styles.occupancyStat}>
                <span className={styles.statValue}>{dashboardData?.upcoming_check_ins?.length || 0}</span>
                <span className={styles.statLabel}>Check-ins Today</span>
              </div>
              <div className={styles.occupancyStat}>
                <span className={styles.statValue}>
                  ${dashboardData?.total_revenue ? (dashboardData.total_revenue / (dashboardData.occupied_rooms || 1)).toFixed(2) : '0'}
                </span>
                <span className={styles.statLabel}>Avg. Revenue per Room</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelManagerDashboard;
