import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Hero.css';

const heroImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    title: 'Luxury Apartments',
    subtitle: 'Find your dream home today',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    title: 'Modern Living',
    subtitle: 'Experience comfort like never before',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    title: 'Premium Locations',
    subtitle: 'Prime locations across the city',
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload images
  useEffect(() => {
    heroImages.forEach(image => {
      const img = new Image();
      img.src = image.url;
    });
  }, []);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    const newIndex = currentSlide === heroImages.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newIndex);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    const newIndex = currentSlide === 0 ? heroImages.length - 1 : currentSlide - 1;
    setCurrentSlide(newIndex);
  };

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className="hero">
      <div className="hero-slider">
        {heroImages.map((image, index) => {
          let slideClass = 'hero-slide';
          if (index === currentSlide) slideClass += ' active';
          else if (index > currentSlide) slideClass += ' next';
          else slideClass += ' prev';
          
          return (
            <div 
              key={image.id}
              className={slideClass}
              style={{
                backgroundImage: `url(${image.url})`,
              }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <h1>{image.title}</h1>
                <p>{image.subtitle}</p>
                <div className="hero-buttons">
                  <Link to="/properties" className="btn btn-primary">
                    View Properties
                  </Link>
                  <Link to="/contact" className="btn btn-outline">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

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
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
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
