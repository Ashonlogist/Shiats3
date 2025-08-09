import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCog, FaSignOutAlt, FaChevronDown, FaHome, FaUserTie } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.15, ease: 'easeIn' }
    }
  };

  return (
    <div className={styles.userProfile} ref={dropdownRef}>
      <button 
        className={styles.profileButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={styles.avatar}>
          {user?.profile_picture ? (
            <img 
              src={user.profile_picture} 
              alt={`${user.first_name} ${user.last_name}`}
              className={styles.avatarImage}
            />
          ) : (
            <FaUserCircle className={styles.avatarFallback} />
          )}
        </div>
        <span className={styles.userName}>
          {user?.first_name} {user?.last_name?.charAt(0)}.
        </span>
        <motion.span 
          className={styles.chevron}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdownMenu}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
          >
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                {user?.profile_picture ? (
                  <img 
                    src={user.profile_picture} 
                    alt={`${user.first_name} ${user.last_name}`}
                    className={styles.avatarImage}
                  />
                ) : (
                  <FaUserCircle className={styles.avatarFallbackLarge} />
                )}
              </div>
              <div className={styles.profileInfo}>
                <h4 className={styles.profileName}>
                  {user?.first_name} {user?.last_name}
                </h4>
                <p className={styles.profileEmail}>{user?.email}</p>
                <span className={`${styles.userRole} ${styles[user?.user_type]}`}>
                  {user?.user_type?.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className={styles.menuDivider}></div>

            <nav className={styles.menuNav}>
              <Link 
                to="/dashboard" 
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <FaHome className={styles.menuIcon} />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                to="/dashboard/profile" 
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <FaUserTie className={styles.menuIcon} />
                <span>My Profile</span>
              </Link>
              
              <Link 
                to="/dashboard/settings" 
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <FaCog className={styles.menuIcon} />
                <span>Settings</span>
              </Link>
            </nav>

            <div className={styles.menuDivider}></div>

            <button 
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              <FaSignOutAlt className={styles.logoutIcon} />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
