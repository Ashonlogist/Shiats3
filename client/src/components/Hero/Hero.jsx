import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

const heroImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    title: 'Discover Your Dream Property',
    subtitle: 'Luxury homes and apartments in the most desirable locations',
    cta: 'Explore Properties',
    ctaLink: '/properties',
    secondaryCta: 'Learn More',
    secondaryCtaLink: '/about'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    title: 'Modern Living Spaces',
    subtitle: 'Experience comfort and style in our premium properties',
    cta: 'View Listings',
    ctaLink: '/properties',
    secondaryCta: 'Contact Agent',
    secondaryCtaLink: '/contact'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    title: 'Prime Locations',
    subtitle: 'Find your perfect home in the most sought-after neighborhoods',
    cta: 'Find a Home',
    ctaLink: '/properties/for-sale',
    secondaryCta: 'Schedule Tour',
    secondaryCtaLink: '/contact'
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('all');

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = () => {
      heroImages.forEach(image => {
        const img = new Image();
        img.src = image.url;
      });
    };
    
    preloadImages();
  }, []);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  }, [currentSlide, isTransitioning]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    const newIndex = currentSlide === heroImages.length - 1 ? 0 : currentSlide + 1;
    goToSlide(newIndex);
  }, [currentSlide, goToSlide, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    const newIndex = currentSlide === 0 ? heroImages.length - 1 : currentSlide - 1;
    goToSlide(newIndex);
  }, [currentSlide, goToSlide, isTransitioning]);

  // Auto slide with pause on hover
  useEffect(() => {
    let timer;
    const slider = document.querySelector('.hero-slider');
    
    const startTimer = () => {
      timer = setInterval(() => {
        nextSlide();
      }, 7000);
    };
    
    const pauseTimer = () => {
      clearInterval(timer);
    };
    
    startTimer();
    
    if (slider) {
      slider.addEventListener('mouseenter', pauseTimer);
      slider.addEventListener('mouseleave', startTimer);
    }
    
    return () => {
      clearInterval(timer);
      if (slider) {
        slider.removeEventListener('mouseenter', pauseTimer);
        slider.removeEventListener('mouseleave', startTimer);
      }
    };
  }, [nextSlide]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', { searchQuery, searchLocation, searchType });
  };

  return (
    <div className="hero">
      <div className="hero-slider">
        <AnimatePresence initial={false} custom={currentSlide}>
          {heroImages.map((image, index) => {
            if (index !== currentSlide) return null;
            
            return (
              <motion.div
                key={image.id}
                className="hero-slide active"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                style={{
                  backgroundImage: `url(${image.url})`,
                }}
              >
                <div className="hero-content">
                  <motion.h1 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-gradient"
                  >
                    {image.title}
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.9 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    {image.subtitle}
                  </motion.p>
                  
                  <motion.div 
                    className="hero-buttons"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    <Link to={image.ctaLink} className="btn btn-primary">
                      {image.cta}
                    </Link>
                    <Link to={image.secondaryCtaLink} className="btn btn-outline">
                      {image.secondaryCta}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <button 
          className="slider-nav prev" 
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>
        
        <button 
          className="slider-nav next" 
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>
        
        <div className="slider-dots">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
