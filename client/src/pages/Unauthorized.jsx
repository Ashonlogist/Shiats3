import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaHome, FaArrowLeft } from 'react-icons/fa';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="icon-container">
          <FaLock className="lock-icon" />
        </div>
        <h1>Access Denied</h1>
        <p className="status-code">403 - Forbidden</p>
        <p className="message">
          You don't have permission to access this page. Please contact your administrator 
          if you believe this is an error.
        </p>
        <div className="action-buttons">
          <Link to="/" className="btn btn-primary">
            <FaHome className="btn-icon" />
            Go to Homepage
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary"
          >
            <FaArrowLeft className="btn-icon" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
