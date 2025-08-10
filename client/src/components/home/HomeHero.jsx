import React from 'react';
import PageHero from '../ui/PageHero';
import { Link } from 'react-router-dom';

const HomeHero = () => {
  const heroImages = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
  ];

  // Get a random image for the hero
  const randomImage = heroImages[Math.floor(Math.random() * heroImages.length)];

  return (
    <PageHero
      title="Discover Your Dream Property"
      subtitle="Luxury homes and apartments in the most desirable locations"
      backgroundImage={randomImage}
      ctaText="Explore Properties"
      ctaLink="/properties"
      secondaryCtaText="View Special Offers"
      secondaryCtaLink="/special-offers"
      height="90vh"
      minHeight="700px"
      overlayOpacity={0.4}
    >
      {/* Search form can be added here as children if needed */}
    </PageHero>
  );
};

export default HomeHero;
