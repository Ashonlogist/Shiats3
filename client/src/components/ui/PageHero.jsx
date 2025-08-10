import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PageHero.css';

const PageHero = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  ctaText, 
  ctaLink, 
  secondaryCtaText, 
  secondaryCtaLink,
  height = '100vh',
  minHeight = '600px',
  overlayOpacity = 0.3,
  children 
}) => {
  const heroStyle = {
    position: 'relative',
    width: '100%',
    height: height,
    minHeight: minHeight,
    backgroundImage: `linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity})), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
    padding: '0 20px',
    margin: 0,
    boxSizing: 'border-box',
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    zIndex: 2,
  };

  const titleStyle = {
    fontSize: '3.5rem',
    marginBottom: '1rem',
    fontWeight: '700',
    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
  };

  const subtitleStyle = {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const buttonStyle = {
    padding: '0.8rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '4px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: '2px solid #e74c3c',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#fff',
    border: '2px solid #fff',
  };

  return (
    <div className="page-hero" style={heroStyle}>
      <div style={contentStyle}>
        {title && <h1 style={titleStyle}>{title}</h1>}
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        
        {(ctaText || secondaryCtaText) && (
          <div style={buttonContainerStyle}>
            {ctaText && (
              <Link 
                to={ctaLink || '#'} 
                style={primaryButtonStyle}
                className="page-hero__button page-hero__button--primary"
              >
                {ctaText}
              </Link>
            )}
            {secondaryCtaText && (
              <Link 
                to={secondaryCtaLink || '#'} 
                style={secondaryButtonStyle}
                className="page-hero__button page-hero__button--secondary"
              >
                {secondaryCtaText}
              </Link>
            )}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

PageHero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backgroundImage: PropTypes.string.isRequired,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
  secondaryCtaText: PropTypes.string,
  secondaryCtaLink: PropTypes.string,
  height: PropTypes.string,
  minHeight: PropTypes.string,
  overlayOpacity: PropTypes.number,
  children: PropTypes.node,
};

export default PageHero;
