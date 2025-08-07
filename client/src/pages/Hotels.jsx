import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaStar, FaMapMarkerAlt, FaFilter, FaArrowLeft, FaArrowRight, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaSnowflake, FaDumbbell } from 'react-icons/fa';

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
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: true
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
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: true
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
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: true
  },
  {
    id: 4,
    name: 'Tribe Hotel Nairobi',
    location: 'Nairobi',
    price: 28000,
    rating: 4.5,
    reviews: 87,
    stars: 4,
    amenities: ['wifi', 'pool', 'restaurant', 'gym', 'parking'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: false
  },
  {
    id: 5,
    name: 'Diani Reef Beach Resort',
    location: 'Diani',
    price: 36000,
    rating: 4.6,
    reviews: 112,
    stars: 5,
    amenities: ['wifi', 'pool', 'restaurant', 'spa', 'gym', 'beach'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: true
  },
  {
    id: 6,
    name: 'Sarova Stanley',
    location: 'Nairobi',
    price: 22000,
    rating: 4.4,
    reviews: 76,
    stars: 5,
    amenities: ['wifi', 'restaurant', 'bar', 'gym', 'parking'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    featured: false
  }
];

const locations = [
  { id: 'all', name: 'All Locations' },
  { id: 'nairobi', name: 'Nairobi' },
  { id: 'mombasa', name: 'Mombasa' },
  { id: 'diani', name: 'Diani' },
  { id: 'masai-mara', name: 'Maasai Mara' },
  { id: 'nakuru', name: 'Nakuru' },
  { id: 'nanyuki', name: 'Nanyuki' },
  { id: 'kisumu', name: 'Kisumu' }
];

const starRatings = [
  { id: 'all', name: 'All Ratings', value: 0 },
  { id: '5', name: '5 Stars', value: 5 },
  { id: '4', name: '4 Stars & Up', value: 4 },
  { id: '3', name: '3 Stars & Up', value: 3 },
  { id: '2', name: '2 Stars & Up', value: 2 },
  { id: '1', name: '1 Star & Up', value: 1 }
];

const amenitiesList = [
  { id: 'wifi', name: 'Free WiFi', icon: <FaWifi /> },
  { id: 'pool', name: 'Swimming Pool', icon: <FaSwimmingPool /> },
  { id: 'restaurant', name: 'Restaurant', icon: <FaUtensils /> },
  { id: 'parking', name: 'Free Parking', icon: <FaParking /> },
  { id: 'ac', name: 'Air Conditioning', icon: <FaSnowflake /> },
  { id: 'gym', name: 'Fitness Center', icon: <FaDumbbell /> }
];

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || 'all',
    stars: searchParams.get('stars') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    amenities: searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [],
    search: searchParams.get('search') || ''
  });

  const hotelsPerPage = 6;
  
  // Filter hotels based on search params and filters
  const filteredHotels = allHotels.filter(hotel => {
    // Filter by location
    if (filters.location !== 'all' && 
        hotel.location.toLowerCase() !== filters.location.toLowerCase()) {
      return false;
    }
    
    // Filter by star rating
    if (filters.stars !== 'all' && 
        hotel.stars < parseInt(filters.stars, 10)) {
      return false;
    }
    
    // Filter by price range
    if (filters.minPrice && hotel.price < parseInt(filters.minPrice, 10)) {
      return false;
    }
    
    if (filters.maxPrice && hotel.price > parseInt(filters.maxPrice, 10)) {
      return false;
    }
    
    // Filter by amenities
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        hotel.amenities.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const nameMatch = hotel.name.toLowerCase().includes(searchTerm);
      const locationMatch = hotel.location.toLowerCase().includes(searchTerm);
      
      if (!nameMatch && !locationMatch) {
        return false;
      }
    }
    
    return true;
  });

  // Get current hotels
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      let updatedAmenities = [...filters.amenities];
      
      if (checked) {
        updatedAmenities.push(value);
      } else {
        updatedAmenities = updatedAmenities.filter(item => item !== value);
      }
      
      setFilters(prev => ({
        ...prev,
        amenities: updatedAmenities
      }));
      
      // Update URL with new filters
      const newSearchParams = new URLSearchParams(searchParams);
      if (updatedAmenities.length > 0) {
        newSearchParams.set('amenities', updatedAmenities.join(','));
      } else {
        newSearchParams.delete('amenities');
      }
      setSearchParams(newSearchParams);
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Update URL with new filters
      const newSearchParams = new URLSearchParams(searchParams);
      if (value) {
        newSearchParams.set(name, value);
      } else {
        newSearchParams.delete(name);
      }
      setSearchParams(newSearchParams);
    }
    
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      location: 'all',
      stars: 'all',
      minPrice: '',
      maxPrice: '',
      amenities: [],
      search: ''
    });
    setSearchParams({});
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
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={`star ${i < rating ? 'star--filled' : 'star--empty'}`} 
      />
    ));
  };

  // Render amenities
  const renderAmenities = (amenities) => {
    return amenitiesList
      .filter(amenity => amenities.includes(amenity.id))
      .map(amenity => (
        <span key={amenity.id} className="amenity-tag" title={amenity.name}>
          {amenity.icon}
        </span>
      ));
  };

  return (
    <div className="hotels-page">
      {/* Page Header */}
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Hotels & Resorts</h1>
          <p className="page-subtitle">
            {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
          </p>
        </div>
      </header>

      <div className="container">
        <div className="hotels-container">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'filters-sidebar--active' : ''}`}>
            <div className="filters-header">
              <h3>Filter Hotels</h3>
              <button 
                className="filters-close"
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
              >
                &times;
              </button>
            </div>
            
            <div className="filters-group">
              <h4 className="filters-group__title">Location</h4>
              <div className="filters-group__content">
                <div className="form-group">
                  <select 
                    name="location" 
                    className="form-control"
                    value={filters.location}
                    onChange={handleFilterChange}
                  >
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="filters-group">
              <h4 className="filters-group__title">Price Range (KES)</h4>
              <div className="filters-group__content">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min Price"
                      className="form-control"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max Price"
                      className="form-control"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="filters-group">
              <h4 className="filters-group__title">Star Rating</h4>
              <div className="filters-group__content">
                <div className="star-rating-filters">
                  {starRatings.map(rating => (
                    <div key={rating.id} className="form-check">
                      <input
                        type="radio"
                        id={`stars-${rating.id}`}
                        name="stars"
                        value={rating.id}
                        checked={filters.stars === rating.id}
                        onChange={handleFilterChange}
                        className="form-check-input"
                      />
                      <label htmlFor={`stars-${rating.id}`} className="form-check-label">
                        {rating.name}
                        {rating.value > 0 && (
                          <div className="stars-preview">
                            {Array(5).fill(0).map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={`star-sm ${i < rating.value ? 'star--filled' : 'star--empty'}`} 
                              />
                            ))}
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="filters-group">
              <h4 className="filters-group__title">Amenities</h4>
              <div className="filters-group__content">
                <div className="amenities-filters">
                  {amenitiesList.map(amenity => (
                    <div key={amenity.id} className="form-check">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity.id}`}
                        name="amenities"
                        value={amenity.id}
                        checked={filters.amenities.includes(amenity.id)}
                        onChange={handleFilterChange}
                        className="form-check-input"
                      />
                      <label htmlFor={`amenity-${amenity.id}`} className="form-check-label">
                        <span className="amenity-icon">{amenity.icon}</span>
                        <span>{amenity.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="filters-actions">
              <button 
                type="button" 
                className="button button--primary"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
              <button 
                type="button" 
                className="button button--outline"
                onClick={resetFilters}
              >
                Reset All
              </button>
            </div>
          </aside>
          
          {/* Hotels Grid */}
          <main className="hotels-main">
            {/* Search and Filter Bar */}
            <div className="hotels-toolbar">
              <div className="hotels-search">
                <div className="search-input">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by hotel name, location, or keyword..."
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              
              <div className="hotels-actions">
                <div className="hotels-sort">
                  <label htmlFor="sort" className="sort-label">Sort by:</label>
                  <select id="sort" className="sort-select">
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                
                <button 
                  className="button button--outline filters-toggle"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter className="filters-icon" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
            
            {/* Hotels Grid */}
            {currentHotels.length > 0 ? (
              <>
                <div className="hotels-grid">
                  {currentHotels.map(hotel => (
                    <div key={hotel.id} className="hotel-card">
                      <div className="hotel-card__image-container">
                        <img 
                          src={hotel.image} 
                          alt={hotel.name} 
                          className="hotel-card__image"
                          loading="lazy"
                        />
                        {hotel.featured && (
                          <span className="hotel-card__badge">Featured</span>
                        )}
                        <div className="hotel-card__rating">
                          <FaStar className="hotel-card__star" />
                          <span>{hotel.rating}</span>
                          <span className="hotel-card__reviews">({hotel.reviews} reviews)</span>
                        </div>
                      </div>
                      <div className="hotel-card__content">
                        <div className="hotel-card__header">
                          <h3 className="hotel-card__name">
                            <Link to={`/hotels/${hotel.id}`}>
                              {hotel.name}
                            </Link>
                          </h3>
                          <p className="hotel-card__location">
                            <FaMapMarkerAlt className="hotel-card__location-icon" />
                            {hotel.location}
                          </p>
                          <div className="hotel-card__stars">
                            {renderStars(hotel.stars)}
                            <span className="hotel-card__stars-text">{hotel.stars}-star hotel</span>
                          </div>
                        </div>
                        
                        <div className="hotel-card__amenities">
                          <p className="amenities-title">Popular Amenities:</p>
                          <div className="amenities-list">
                            {renderAmenities(hotel.amenities.slice(0, 4))}
                            {hotel.amenities.length > 4 && (
                              <span className="amenity-more">+{hotel.amenities.length - 4} more</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="hotel-card__footer">
                          <div className="hotel-card__price">
                            <span className="price-amount">{formatPrice(hotel.price)}</span>
                            <span className="price-period">per night</span>
                            <span className="price-inclusive">Includes taxes & fees</span>
                          </div>
                          <Link 
                            to={`/hotels/${hotel.id}`} 
                            className="button button--primary button--sm"
                          >
                            View Deal
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FaArrowLeft />
                      <span>Previous</span>
                    </button>
                    
                    <div className="pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                          key={number}
                          className={`pagination-page ${currentPage === number ? 'active' : ''}`}
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <span>Next</span>
                      <FaArrowRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-results">
                <h3>No hotels found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button 
                  className="button button--primary"
                  onClick={resetFilters}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
