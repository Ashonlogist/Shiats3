import React from 'react';
import { FaBell, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import styles from './ActivityFeed.module.css';

const ActivityFeed = ({ activities, title = 'Recent Activities', limit = 5 }) => {
  // If no activities provided, show a message
  if (!activities || activities.length === 0) {
    return (
      <div className={styles.activityFeed}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.emptyState}>
          <FaBell className={styles.emptyIcon} />
          <p>No recent activities</p>
        </div>
      </div>
    );
  }

  // Function to get the appropriate icon based on activity type
  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
        return <FaCheckCircle className={`${styles.icon} ${styles.success}`} />;
      case 'warning':
        return <FaExclamationCircle className={`${styles.icon} ${styles.warning}`} />;
      case 'info':
      default:
        return <FaInfoCircle className={`${styles.icon} ${styles.info}`} />;
    }
  };

  // Format the date to a readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles.activityFeed}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button className={styles.viewAllBtn}>
          View All
        </button>
      </div>
      
      <div className={styles.activitiesList}>
        {activities.slice(0, limit).map((activity, index) => (
          <div key={index} className={styles.activityItem}>
            <div className={styles.activityIcon}>
              {activity.icon || getActivityIcon(activity.type)}
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>{activity.message}</p>
              <div className={styles.activityMeta}>
                <span className={styles.activityTime}>
                  <FaCalendarAlt className={styles.timeIcon} />
                  {formatDate(activity.timestamp || new Date())}
                </span>
                {activity.action && (
                  <button 
                    className={`${styles.actionButton} ${styles[activity.actionType || 'primary']}`}
                    onClick={() => activity.onAction && activity.onAction(activity)}
                  >
                    {activity.action}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
