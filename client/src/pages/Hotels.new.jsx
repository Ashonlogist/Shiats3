import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaStar, FaMapMarkerAlt, FaFilter, 
  FaArrowLeft, FaArrowRight, FaWifi, 
  FaSwimmingPool, FaParking, FaUtensils, 
  FaSnowflake, FaDumbbell, FaBed, FaRegStar, FaStarHalfAlt
} from 'react-icons/fa';
import styles from './Hotels.module.css';

// Mock data - in a real app, this would come from an API
const allHotels = [
  {
    id: 1,
    name: 'Serena Beach Resort',
    location: 'Mombasa',
    price: 25000,
    rating: 4.8,
    reviews: 124,
    stars: 5,
    amenities: ['wifi', 'pool', 'restaurant', 'spa', 'gym'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true,
    description: 'Luxury beachfront resort with stunning ocean views and world-class amenities.'
  },
  {
    id: 2,
    name: 'Mount Kenya Safari Club',
    location: 'Nanyuki',
    price: 32000,
    rating: 4.9,
    reviews: 98,
    stars: 5,
    amenities: ['wifi', 'pool', 'restaurant', 'spa', 'gym', 'parking'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true,
    description: 'Iconic luxury hotel with breathtaking views of Mount Kenya and exceptional service.'
  },
  {
    id: 3,
    name: 'Mara Serena Safari Lodge',
    location: 'Maasai Mara',
    price: 45000,
    rating: 4.7,
    reviews: 156,
    stars: 5,
    amenities: ['wifi', 'pool', 'restaurant', 'bar', 'ac'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true,
    description: 'Luxurious lodge offering an authentic African safari experience in the heart of the Maasai Mara.'
  },
  {
    id: 4,
    name: 'Tribe Hotel Nairobi',
    location: 'Nairobi',
    price: 28000,
    rating: 4.5,
    reviews: 87,
    stars: 4,
    amenities: ['wifi', 'restaurant', 'bar', 'gym', 'parking', 'ac'],
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: false,
    description: 'Boutique luxury hotel in the heart of Nairobi with contemporary African design.'
  },
  {
    id: 5,
    name: 'Voyager Beach Resort',
    location: 'Mombasa',
    price: 19500,
    rating: 4.3,
    reviews: 203,
    stars: 4,
    amenities: ['wifi', 'pool', 'restaurant', 'beach', 'bar'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: false,
    description: 'Family-friendly beach resort with all-inclusive options and water sports.'
  },
  {
    id: 6,
    name: 'Lake Naivasha Sopa Resort',
    location: 'Naivasha',
    price: 22000,
    rating: 4.4,
    reviews: 112,
    stars: 4,
    amenities: ['wifi', 'pool', 'restaurant', 'lake-view', 'parking'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true,
    description: 'Tranquil lakeside resort with stunning views and abundant wildlife.'
  },
  {
    id: 7,
    name: 'Sarova Whitesands Beach Resort',
    location: 'Mombasa',
    price: 31000,
    rating: 4.6,
    reviews: 178,
    stars: 5,
    amenities: ['wifi', 'pool', 'restaurant', 'spa', 'gym', 'beach'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true,
    description: 'Luxurious beachfront resort with extensive facilities and entertainment options.'
  },
  {
    id: 8,
    name: 'Fairmont Mount Kenya Safari Club',
    location: 'Nanyuki',
    price: 38000,
    rating: 4.8,
    reviews: 92,
    stars: 5,
    amenities: ['wifi', 'pool', 'restaurant', 'spa', 'golf', 'parking'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true,
    description: 'Historic luxury resort with stunning views of Mount Kenya and world-class facilities.'
  }
];

const amenitiesIcons = {
  wifi: <FaWifi />,
  pool: <FaSwimmingPool />,
  parking: <FaParking />,
  restaurant: <FaUtensils />,
  ac: <FaSnowflake />,
  gym: <FaDumbbell />,
  spa: <FaBed />,
  bar: <span className={styles.iconText}>🍹</span>,
  'lake-view': <span className={styles.iconText}>🌊</span>,
  beach: <span className={styles.iconText}>🏖️</span>,
  golf: <span className={styles.iconText}>⛳</span>
};

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();
  
  // Get filter values from URL or use defaults
  const location = searchParams.get('location') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '0';
  const amenities = searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [];
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'featured';
  const itemsPerPage = 6;
  
  // Filter and sort hotels
  const filteredHotels = useMemo(() => {
    let result = [...allHotels];
    
    // Apply filters
    if (location) {
      result = result.filter(hotel => 
        hotel.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (minPrice) {
      result = result.filter(hotel => hotel.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      result = result.filter(hotel => hotel.price <= parseFloat(maxPrice));
    }
    
    if (rating && rating !== '0') {
      result = result.filter(hotel => Math.floor(hotel.rating) >= parseInt(rating));
    }
    
    if (amenities.length > 0) {
      result = result.filter(hotel => 
        amenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(hotel => 
        hotel.name.toLowerCase().includes(searchLower) || 
        hotel.location.toLowerCase().includes(searchLower) ||
        hotel.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    return result;
  }, [location, minPrice, maxPrice, rating, amenities, search, sort]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const currentPageItems = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle filter changes
  const handleFilterChange = (name, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (!value || value === '0' || (Array.isArray(value) && value.length === 0)) {
      newParams.delete(name);
    } else if (Array.isArray(value)) {
      newParams.set(name, value.join(','));
    } else {
      newParams.set(name, value);
    }
    
    // Reset to first page when filters change
    setCurrentPage(1);
    newParams.set('page', '1');
    
    // Update URL
    navigate(`?${newParams.toString()}`, { replace: true });
  };
  
  // Toggle amenity filter
  const toggleAmenity = (amenity) => {
    const newAmenities = [...amenities];
    const index = newAmenities.indexOf(amenity);
    
    if (index === -1) {
      newAmenities.push(amenity);
    } else {
      newAmenities.splice(index, 1);
    }
    
    handleFilterChange('amenities', newAmenities);
  };
  
  // Toggle favorite status
  const toggleFavorite = (hotelId, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(hotelId)) {
        newFavorites.delete(hotelId);
      } else {
        newFavorites.add(hotelId);
      }
      return newFavorites;
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchParams({});
    setCurrentPage(1);
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className={styles.star} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className={styles.star} />);
      } else {
        stars.push(<FaRegStar key={i} className={styles.star} />);
      }
    }
    
    return stars;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={styles.hotelsPage}>
      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Discover Amazing Hotels
          </motion.h1>
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Find and book the perfect hotel for your next adventure
          </motion.p>
        </div>
      </section>
      
      <div className={styles.container}>
        {/* Search and Filters */}
        <section className={styles.filtersSection}>
          <div className={styles.filtersHeader}>
            <h2 className={styles.filtersTitle}>Search Hotels</h2>
            <button 
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filters-content"
            >
              <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleFilterChange('search', formData.get('search'));
            }} 
            className={styles.searchForm}
          >
            <div className={styles.searchInputGroup}>
              <input
                type="text"
                name="search"
                placeholder="Search by hotel name, location, or description..."
                defaultValue={search}
                className={styles.searchInput}
                aria-label="Search hotels"
              />
              <button type="submit" className={styles.searchButton} aria-label="Search">
                <FaSearch />
              </button>
            </div>
          </form>
          
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.div 
                id="filters-content"
                className={`${styles.filtersContent} ${showFilters ? styles.visible : ''}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className={styles.filtersGrid}>
                  <div className={styles.filterGroup}>
                    <label htmlFor="location" className={styles.filterLabel}>Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Any location"
                      value={location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className={styles.filterInput}
                    />
                  </div>
                  
                  <div className={styles.filterGroup}>
                    <label htmlFor="minPrice" className={styles.filterLabel}>Min Price (KES)</label>
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      min="0"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className={styles.filterInput}
                    />
                  </div>
                  
                  <div className={styles.filterGroup}>
                    <label htmlFor="maxPrice" className={styles.filterLabel}>Max Price (KES)</label>
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      min="0"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className={styles.filterInput}
                    />
                  </div>
                  
                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Minimum Rating</label>
                    <div className={styles.ratingFilter}>
                      {[0, 1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          className={`${styles.ratingButton} ${parseInt(rating) === stars ? styles.active : ''}`}
                          onClick={() => handleFilterChange('rating', stars.toString())}
                        >
                          {stars === 0 ? 'Any' : (
                            <>
                              {renderStars(stars)}
                              {stars < 5 && '+'}
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={styles.amenitiesFilter}>
                  <h4 className={styles.amenitiesTitle}>Amenities</h4>
                  <div className={styles.amenitiesGrid}>
                    {Object.entries(amenitiesIcons).map(([key, icon]) => (
                      <button
                        key={key}
                        type="button"
                        className={`${styles.amenityButton} ${amenities.includes(key) ? styles.active : ''}`}
                        onClick={() => toggleAmenity(key)}
                      >
                        <span className={styles.amenityIcon}>{icon}</span>
                        <span className={styles.amenityName}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className={styles.filterActions}>
                  <button 
                    type="button" 
                    className={styles.resetButton}
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                  <button 
                    type="button" 
                    className={styles.applyButton}
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        
        {/* Results Count and Sort */}
        <div className={styles.resultsHeader}>
          <p className={styles.resultsCount}>
            {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
          </p>
          <div className={styles.sortGroup}>
            <label htmlFor="sort" className={styles.sortLabel}>Sort by:</label>
            <select
              id="sort"
              name="sort"
              value={sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className={styles.sortSelect}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
            </select>
          </div>
        </div>
        
        {/* Hotels Grid */}
        {currentPageItems.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No hotels found matching your criteria</h3>
            <p>Try adjusting your search filters or try a different search term</p>
            <button 
              className={styles.resetButton}
              onClick={resetFilters}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <motion.div 
            className={styles.hotelsGrid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentPageItems.map((hotel) => (
              <motion.article 
                key={hotel.id}
                className={styles.hotelCard}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
              >
                <Link to={`/hotels/${hotel.id}`} className={styles.hotelLink}>
                  <div className={styles.hotelImage}>
                    <img 
                      src={hotel.image} 
                      alt={hotel.name} 
                      loading="lazy"
                      className={styles.hotelImg}
                    />
                    <button 
                      className={`${styles.favoriteButton} ${favorites.has(hotel.id) ? styles.active : ''}`}
                      onClick={(e) => toggleFavorite(hotel.id, e)}
                      aria-label={favorites.has(hotel.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {favorites.has(hotel.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    {hotel.featured && (
                      <span className={styles.featuredBadge}>
                        <FaStar className={styles.badgeIcon} /> Featured
                      </span>
                    )}
                  </div>
                  
                  <div className={styles.hotelContent}>
                    <div className={styles.hotelHeader}>
                      <h3 className={styles.hotelName}>{hotel.name}</h3>
                      <div className={styles.hotelRating}>
                        <FaStar className={styles.ratingIcon} />
                        <span className={styles.ratingValue}>{hotel.rating}</span>
                        <span className={styles.ratingCount}>({hotel.reviews})</span>
                      </div>
                    </div>
                    
                    <div className={styles.hotelLocation}>
                      <FaMapMarkerAlt className={styles.locationIcon} />
                      <span>{hotel.location}</span>
                    </div>
                    
                    <p className={styles.hotelDescription}>
                      {hotel.description}
                    </p>
                    
                    <div className={styles.hotelAmenities}>
                      {hotel.amenities.slice(0, 5).map((amenity) => (
                        <span key={amenity} className={styles.amenity}>
                          {amenitiesIcons[amenity] || <span className={styles.iconText}>•</span>}
                          <span className={styles.amenityTooltip}>
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1).replace('-', ' ')}
                          </span>
                        </span>
                      ))}
                      {hotel.amenities.length > 5 && (
                        <span className={styles.moreAmenities}>+{hotel.amenities.length - 5} more</span>
                      )}
                    </div>
                    
                    <div className={styles.hotelFooter}>
                      <div className={styles.priceContainer}>
                        <span className={styles.priceLabel}>From</span>
                        <div className={styles.priceValue}>{formatPrice(hotel.price)}</div>
                        <span className={styles.pricePeriod}>/ night</span>
                      </div>
                      
                      <div className={styles.starsContainer}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${styles.star} ${i < hotel.stars ? styles.filled : ''}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <FaArrowLeft />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                  aria-label={`Page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
