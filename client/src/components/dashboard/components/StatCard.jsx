import React from 'react';
import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, change, icon: Icon, color = '#5A3825' }) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  return (
    <div className={styles.statCard} style={{ borderTop: `4px solid ${color}` }}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon} style={{ backgroundColor: `${color}15` }}>
          <Icon style={{ color }} />
        </div>
        <div className={styles.statTitle}>{title}</div>
      </div>
      
      <div className={styles.statValue}>{value}</div>
      
      {(change !== null && change !== undefined) && (
        <div className={`${styles.statChange} ${isPositive ? styles.positive : isNeutral ? styles.neutral : styles.negative}`}>
          <span className={styles.changeIcon}>
            {isPositive ? <FaArrowUp /> : isNeutral ? <FaEquals /> : <FaArrowDown />}
          </span>
          <span className={styles.changeValue}>
            {Math.abs(change)}% {isNeutral ? 'No change' : isPositive ? 'increase' : 'decrease'}
          </span>
          <span className={styles.changeLabel}>vs last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
