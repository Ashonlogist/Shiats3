import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <FaExclamationTriangle className="icon" />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p className="error-message">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="search-box">
          <div className="search-input">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="search-field"
            />
            <button className="search-button">Search</button>
          </div>
        </div>
        
        <div className="suggestions">
          <p>Here are some helpful links instead:</p>
          <ul className="helpful-links">
            <li><Link to="/"><FaHome /> Homepage</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/hotels">Hotels</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <Link to="/" className="home-button">
          <FaHome /> Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
