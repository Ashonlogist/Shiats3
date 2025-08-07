import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaStar, FaArrowRight } from 'react-icons/fa';

// Mock data - in a real app, this would come from an API
const featuredProperties = [
  {
    id: 1,
    title: 'Luxury Villa in Karen',
    location: 'Karen, Nairobi',
    price: 45000000,
    type: 'For Sale',
    beds: 5,
    baths: 4,
    sqft: 4500,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: true
  },
  {
    id: 2,
    title: 'Modern Apartment in Westlands',
    location: 'Westlands, Nairobi',
    price: 25000,
    type: 'For Rent',
    beds: 3,
    baths: 2,
    sqft: 1800,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: true
  },
  {
    id: 3,
    title: 'Beachfront Villa in Diani',
    location: 'Diani, Mombasa',
    price: 68000000,
    type: 'For Sale',
    beds: 6,
    baths: 5,
    sqft: 5200,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: true
  }
];

const featuredHotels = [
  {
    id: 1,
    name: 'Serena Beach Resort',
    location: 'Mombasa',
    price: 25000,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 2,
    name: 'Mount Kenya Safari Club',
    location: 'Nanyuki',
    price: 32000,
    rating: 4.9,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 3,
    name: 'Mara Serena Safari Lodge',
    location: 'Maasai Mara',
    price: 45000,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('buy');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="home">
      {/* Hero section is now handled by the dedicated Hero component */}

      {/* Featured Properties */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Featured Properties</h2>
            <Link to="/properties" className="section__link">
              View All Properties <FaArrowRight />
            </Link>
          </div>
          
          <div className="property-grid">
            {featuredProperties.map(property => (
              <div key={property.id} className="property-card">
                <div className="property-card__image-container">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="property-card__image"
                    loading="lazy"
                  />
                  {property.featured && (
                    <span className="property-card__badge">Featured</span>
                  )}
                  <span className="property-card__type">{property.type}</span>
                </div>
                <div className="property-card__content">
                  <h3 className="property-card__title">{property.title}</h3>
                  <p className="property-card__location">
                    <FaMapMarkerAlt className="property-card__location-icon" />
                    {property.location}
                  </p>
                  <div className="property-card__meta">
                    <span className="property-card__meta-item">
                      <FaBed className="property-card__meta-icon" />
                      {property.beds} Beds
                    </span>
                    <span className="property-card__meta-item">
                      <FaBath className="property-card__meta-icon" />
                      {property.baths} Baths
                    </span>
                    <span className="property-card__meta-item">
                      <FaRulerCombined className="property-card__meta-icon" />
                      {property.sqft.toLocaleString()} sqft
                    </span>
                  </div>
                  <div className="property-card__footer">
                    <span className="property-card__price">
                      {property.type === 'For Rent' 
                        ? `${formatPrice(property.price)}/mo` 
                        : formatPrice(property.price)}
                    </span>
                    <Link to={`/properties/${property.id}`} className="button button--primary button--sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="section section--light">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Featured Hotels & Resorts</h2>
            <Link to="/hotels" className="section__link">
              View All Hotels <FaArrowRight />
            </Link>
          </div>
          
          <div className="hotel-grid">
            {featuredHotels.map(hotel => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-card__image-container">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    className="hotel-card__image"
                    loading="lazy"
                  />
                  <div className="hotel-card__rating">
                    <FaStar className="hotel-card__star" />
                    <span>{hotel.rating}</span>
                    <span className="hotel-card__reviews">({hotel.reviews} reviews)</span>
                  </div>
                </div>
                <div className="hotel-card__content">
                  <h3 className="hotel-card__name">{hotel.name}</h3>
                  <p className="hotel-card__location">
                    <FaMapMarkerAlt className="hotel-card__location-icon" />
                    {hotel.location}
                  </p>
                  <div className="hotel-card__footer">
                    <div className="hotel-card__price">
                      <span className="hotel-card__price-amount">
                        {formatPrice(hotel.price)}
                      </span>
                      <span className="hotel-card__price-period">/ night</span>
                    </div>
                    <Link to={`/hotels/${hotel.id}`} className="button button--primary button--sm">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <div className="cta__content">
            <h2 className="cta__title">Ready to Find Your Dream Home?</h2>
            <p className="cta__text">
              Join thousands of satisfied clients who found their perfect property with Shiats3.
            </p>
            <div className="cta__buttons">
              <Link to="/properties" className="button button--primary button--lg">
                Browse Properties
              </Link>
              <Link to="/contact" className="button button--outline button--lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
