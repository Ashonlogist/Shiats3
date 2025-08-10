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

const Hero = ({ pageType = 'home' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('all');

  // Get page-specific content
  const getPageContent = () => {
    switch(pageType) {
      case 'properties':
        return {
          title: 'Find Your Perfect Property',
          subtitle: 'Browse our exclusive selection of homes and apartments',
          cta: 'View All Listings',
          ctaLink: '/properties',
          secondaryCta: 'Contact an Agent',
          secondaryCtaLink: '/contact'
        };
      case 'hotels':
        return {
          title: 'Luxury Accommodations',
          subtitle: 'Discover the finest hotels and resorts for your next stay',
          cta: 'Book Now',
          ctaLink: '/hotels',
          secondaryCta: 'Special Offers',
          secondaryCtaLink: '/special-offers'
        };
      case 'about':
        return {
          title: 'About Our Company',
          subtitle: 'Your trusted partner in real estate and hospitality',
          cta: 'Our Services',
          ctaLink: '/services',
          secondaryCta: 'Meet the Team',
          secondaryCtaLink: '/team'
        };
      case 'contact':
        return {
          title: 'Get In Touch',
          subtitle: 'We\'d love to hear from you',
          cta: 'Contact Us',
          ctaLink: '/contact',
          secondaryCta: 'Visit Our Office',
          secondaryCtaLink: '/locations'
        };
      case 'blog':
        return {
          title: 'Latest News & Insights',
          subtitle: 'Stay updated with the latest trends and tips',
          cta: 'Read Our Blog',
          ctaLink: '/blog',
          secondaryCta: 'Subscribe',
          secondaryCtaLink: '/subscribe'
        };
      default: // home
        return {
          title: 'Discover Your Dream Property',
          subtitle: 'Luxury homes and apartments in the most desirable locations',
          cta: 'Explore Properties',
          ctaLink: '/properties',
          secondaryCta: 'Learn More',
          secondaryCtaLink: '/about'
        };
    }
  };

  const pageContent = getPageContent();

  // Use different images based on page type
  const getHeroImages = () => {
    const commonImages = [...heroImages];
    
    if (pageType === 'properties') {
      return [
        {
          ...commonImages[0],
          title: pageContent.title,
          subtitle: pageContent.subtitle,
          cta: pageContent.cta,
          ctaLink: pageContent.ctaLink,
          secondaryCta: pageContent.secondaryCta,
          secondaryCtaLink: pageContent.secondaryCtaLink
        },
        ...commonImages.slice(1)
      ];
    }
    
    if (pageType === 'hotels') {
      return [
        {
          ...commonImages[1],
          title: pageContent.title,
          subtitle: pageContent.subtitle,
          cta: pageContent.cta,
          ctaLink: pageContent.ctaLink,
          secondaryCta: pageContent.secondaryCta,
          secondaryCtaLink: pageContent.secondaryCtaLink
        },
        ...commonImages.filter((_, i) => i !== 1)
      ];
    }
    
    return commonImages.map((img, index) => ({
      ...img,
      title: index === 0 ? pageContent.title : img.title,
      subtitle: index === 0 ? pageContent.subtitle : img.subtitle,
      cta: index === 0 ? pageContent.cta : img.cta,
      ctaLink: index === 0 ? pageContent.ctaLink : img.ctaLink,
      secondaryCta: index === 0 ? pageContent.secondaryCta : img.secondaryCta,
      secondaryCtaLink: index === 0 ? pageContent.secondaryCtaLink : img.secondaryCtaLink
    }));
  };

  const [currentImages, setCurrentImages] = useState(getHeroImages());

  // Update images when pageType changes
  useEffect(() => {
    setCurrentImages(getHeroImages());
  }, [pageType]);

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
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSlide, currentImages]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', { searchQuery, searchLocation, searchType });
  };

  return (
    <div className="hero">
      <div className="hero-slider">
        <AnimatePresence initial={false} custom={currentSlide}>
          {currentImages.map((image, index) => {
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
