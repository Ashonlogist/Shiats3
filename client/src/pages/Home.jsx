import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaStar, FaArrowRight } from 'react-icons/fa';
import HomeHero from '../components/home/HomeHero';
import './Home.css';

// Mock data - in a real app, this would come from an API
const featuredPropertiesData = [
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
  },
  {
    id: 4,
    title: 'Mountain View Cottage',
    location: 'Mount Kenya',
    price: 38000000,
    type: 'For Sale',
    beds: 4,
    baths: 3,
    sqft: 3200,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: true
  },
  {
    id: 5,
    title: 'City Center Penthouse',
    location: 'Nairobi CBD',
    price: 85000,
    type: 'For Rent',
    beds: 3,
    baths: 3,
    sqft: 2800,
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: true
  },
  {
    id: 6,
    title: 'Serene Townhouse in Runda',
    location: 'Runda, Nairobi',
    price: 55000000,
    type: 'For Sale',
    beds: 4,
    baths: 3,
    sqft: 3600,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
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
  },
  {
    id: 4,
    name: 'Villa Rosa Kempinski',
    location: 'Nairobi',
    price: 38000,
    rating: 4.9,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 5,
    name: 'Hemingways Nairobi',
    location: 'Karen, Nairobi',
    price: 42000,
    rating: 4.8,
    reviews: 187,
    image: 'https://images.unsplash.com/photo-1521783988139-89397d761dce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 6,
    name: 'Diamonds Dream of Africa',
    location: 'Diani',
    price: 28000,
    rating: 4.6,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

// Map index -> CSS grid area name for the featured properties layout
const gridAreaOf = (index) => {
  if (index === 0) return 'big';
  if (index === 1) return 'small1';
  if (index === 2) return 'small2';
  return `medium${index - 2}`;
};

const sizeClassOf = (index) => {
  if (index === 0) return 'featured-card--big';
  if (index <= 2) return 'featured-card--small';
  return 'featured-card--medium';
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0
  }).format(price);
};

const Home = () => {
  return (
    <div className="home">
      <HomeHero />

      {/* Featured Properties Section */}
      <section className="home-section home-section--dark">
        <div className="home-container">
          <div className="section-header">
            <span className="section-kicker">Featured Properties</span>
            <h2 className="section-title section-title--light">Handpicked Homes, Uncompromising Quality</h2>
            <p className="section-subtitle section-subtitle--light">
              Discover our handpicked selection of premium properties across East Africa's finest locations.
            </p>
            <Link to="/properties" className="section-cta">
              View All Properties <FaArrowRight />
            </Link>
          </div>

          <div className="featured-grid">
            {featuredPropertiesData.map((property, index) => (
              <div
                key={property.id}
                className={`featured-card ${sizeClassOf(index)}`}
                style={{ gridArea: gridAreaOf(index) }}
              >
                <div
                  className="featured-card__media"
                  style={{ backgroundImage: `url(${property.image})` }}
                />
                <div className="featured-card__overlay" />
                <span className="featured-card__tag">{property.type}</span>

                <div className="featured-card__content">
                  <h3 className="featured-card__title">{property.title}</h3>
                  <p className="featured-card__location">
                    <FaMapMarkerAlt /> {property.location}
                  </p>
                  <div className="featured-card__meta">
                    <span><FaBed /> {property.beds} Beds</span>
                    <span><FaBath /> {property.baths} Baths</span>
                    <span><FaRulerCombined /> {property.sqft} sqft</span>
                  </div>
                  <div className="featured-card__footer">
                    <span className="featured-card__price">{formatPrice(property.price)}</span>
                    <Link to={`/properties/${property.id}`} className="featured-card__link">
                      View Details <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="home-section home-section--light">
        <div className="home-container">
          <div className="section-header">
            <span className="section-kicker">Hotels & Resorts</span>
            <h2 className="section-title">Stay in Style</h2>
            <p className="section-subtitle">
              Premium hospitality experiences from beachfront resorts to safari lodges.
            </p>
            <Link to="/hotels" className="section-cta section-cta--ghost">
              View All Hotels <FaArrowRight />
            </Link>
          </div>

          <div className="hotels-grid">
            {featuredHotels.map(hotel => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-card__media" style={{ backgroundImage: `url(${hotel.image})` }}>
                  <span className="hotel-card__rating">
                    <FaStar /> {hotel.rating}
                  </span>
                </div>
                <div className="hotel-card__body">
                  <h3 className="hotel-card__name">{hotel.name}</h3>
                  <p className="hotel-card__location">
                    <FaMapMarkerAlt /> {hotel.location}
                  </p>
                  <div className="hotel-card__footer">
                    <div>
                      <span className="hotel-card__price">
                        {formatPrice(hotel.price)}
                        <span className="hotel-card__price-period"> /night</span>
                      </span>
                      <span className="hotel-card__reviews">{hotel.reviews} reviews</span>
                    </div>
                    <Link to={`/hotels/${hotel.id}`} className="hotel-card__link">
                      View Details <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;