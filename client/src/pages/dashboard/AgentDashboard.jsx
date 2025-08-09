import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaDollarSign, FaChartLine, FaBuilding, FaSearch } from 'react-icons/fa';
import StatCard from '../../components/dashboard/components/StatCard';
import ActivityFeed from '../../components/dashboard/components/ActivityFeed';
import api from '../../services/api';
import styles from './Dashboard.module.css';

const AgentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an actual API call
        // const response = await api.get('/api/v1/dashboard/agent/');
        // setDashboardData(response.data);
        
        // Mock data for now
        setTimeout(() => {
          setDashboardData({
            total_properties: 24,
            active_listings: 18,
            pending_inquiries: 7,
            total_earnings: 125430,
            recent_activities: [
              {
                id: 1,
                message: 'New inquiry for your property: Modern Downtown Loft',
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                type: 'info',
                action: 'View',
                actionType: 'primary',
                onAction: () => navigate('/dashboard/inquiries/123')
              },
              {
                id: 2,
                message: 'Your property "Luxury Villa" was viewed 15 times today',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                type: 'success'
              },
              {
                id: 3,
                message: 'Upcoming showing: 123 Main St at 2:00 PM tomorrow',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
                type: 'warning',
                action: 'Details',
                actionType: 'secondary'
              }
            ],
            upcoming_appointments: [
              {
                id: 1,
                property: 'Modern Downtown Loft',
                client: 'John Smith',
                date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
                type: 'showing'
              },
              {
                id: 2,
                property: 'Luxury Villa',
                client: 'Sarah Johnson',
                date: new Date(Date.now() + 1000 * 60 * 60 * 36), // Day after tomorrow
                type: 'inspection'
              }
            ]
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching agent dashboard data:', err);
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

  // Format date to display as "Tomorrow at 2:00 PM" or "Mar 15 at 2:00 PM"
  const formatAppointmentDate = (date) => {
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
          <h2 className={styles.dashboardTitle}>Agent Dashboard</h2>
          <p className={styles.welcomeSubtitle}>Welcome back! Here's what's happening with your properties today.</p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => navigate('/dashboard/properties/new')}
        >
          + Add New Property
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Properties"
          value={dashboardData?.total_properties || 0}
          change={12}
          icon={FaHome}
          color="#5A3825" // Earth Brown
          onClick={() => navigate('/dashboard/properties')}
        />
        
        <StatCard
          title="Active Listings"
          value={dashboardData?.active_listings || 0}
          change={5}
          icon={FaBuilding}
          color="#228B22" // Forest Green
          onClick={() => navigate('/dashboard/properties?status=active')}
        />
        
        <StatCard
          title="Pending Inquiries"
          value={dashboardData?.pending_inquiries || 0}
          change={-2}
          icon={FaSearch}
          color="#DAA520" // Warm Gold
          onClick={() => navigate('/dashboard/inquiries')}
        />
        
        <StatCard
          title="Total Earnings"
          value={dashboardData?.total_earnings ? `$${dashboardData.total_earnings.toLocaleString()}` : '$0'}
          change={18.7}
          icon={FaDollarSign}
          color="#2E2E2E" // Deep Charcoal
          onClick={() => navigate('/dashboard/earnings')}
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
            <h3 className={styles.sectionTitle}>Performance Overview</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statIcon} style={{ backgroundColor: 'rgba(34, 139, 34, 0.1)' }}>
                  <FaChartLine className={styles.statIconSvg} style={{ color: '#228B22' }} />
                </div>
                <div className={styles.statContent}>
                  <h4>Monthly Views</h4>
                  <p>1,245 <span style={{ color: '#228B22' }}>+12.5%</span></p>
                </div>
              </div>
              
              <div className={styles.statItem}>
                <div className={styles.statIcon} style={{ backgroundColor: 'rgba(90, 56, 37, 0.1)' }}>
                  <FaDollarSign className={styles.statIconSvg} style={{ color: '#5A3825' }} />
                </div>
                <div className={styles.statContent}>
                  <h4>Avg. Price</h4>
                  <p>$425,000 <span style={{ color: '#228B22' }}>+2.3%</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Upcoming Appointments */}
          <div className={styles.upcomingAppointments}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Upcoming Appointments</h3>
              <button 
                className={styles.viewAllButton}
                onClick={() => navigate('/dashboard/calendar')}
              >
                View Calendar
              </button>
            </div>
            
            {dashboardData?.upcoming_appointments?.length > 0 ? (
              <div className={styles.appointmentsList}>
                {dashboardData.upcoming_appointments.map((appointment) => (
                  <div key={appointment.id} className={styles.appointmentItem}>
                    <div className={styles.appointmentTime}>
                      <FaCalendarAlt className={styles.calendarIcon} />
                      <span>{formatAppointmentDate(new Date(appointment.date))}</span>
                    </div>
                    <div className={styles.appointmentDetails}>
                      <h4>{appointment.property}</h4>
                      <p>with {appointment.client}</p>
                      <span className={`${styles.appointmentType} ${styles[appointment.type]}`}>
                        {appointment.type}
                      </span>
                    </div>
                    <button 
                      className={styles.viewButton}
                      onClick={() => navigate(`/dashboard/appointments/${appointment.id}`)}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No upcoming appointments</p>
                <button 
                  className={styles.primaryButton}
                  onClick={() => navigate('/dashboard/calendar')}
                >
                  Schedule Appointment
                </button>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.actionsGrid}>
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/properties/new')}
              >
                <FaHome className={styles.actionIcon} />
                <span>Add New Property</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/appointments/new')}
              >
                <FaCalendarAlt className={styles.actionIcon} />
                <span>Schedule Showing</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/reports')}
              >
                <FaChartLine className={styles.actionIcon} />
                <span>View Reports</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/dashboard/profile')}
              >
                <FaUserCog className={styles.actionIcon} />
                <span>Profile Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
