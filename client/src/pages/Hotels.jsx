import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FaSearch, 
  FaStar, 
  FaMapMarkerAlt, 
  FaFilter, 
  FaWifi, 
  FaSwimmingPool, 
  FaParking, 
  FaUtensils, 
  FaSnowflake, 
  FaDumbbell,
  FaCocktail,
  FaConciergeBell,
  FaCoffee,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import styles from './Hotels.module.css';

// Available filters
const starOptions = [5, 4, 3, 2, 1];
const amenityOptions = [
  { id: 'wifi', label: 'Free WiFi', icon: <FaWifi /> },
  { id: 'pool', label: 'Swimming Pool', icon: <FaSwimmingPool /> },
  { id: 'parking', label: 'Free Parking', icon: <FaParking /> },
  { id: 'restaurant', label: 'Restaurant', icon: <FaUtensils /> },
  { id: 'ac', label: 'Air Conditioning', icon: <FaSnowflake /> },
  { id: 'gym', label: 'Gym', icon: <FaDumbbell /> },
  { id: 'bar', label: 'Bar', icon: <FaCocktail /> },
  { id: 'spa', label: 'Spa', icon: <FaConciergeBell /> },
  { id: 'breakfast', label: 'Breakfast', icon: <FaCoffee /> },
  { id: 'beach', label: 'Beach Access', icon: <FaSwimmingPool /> },
];

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
    amenities: ['wifi', 'pool', 'restaurant', 'spa', 'gym', 'parking', 'bar', 'breakfast'],
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
    amenities: ['wifi', 'pool', 'restaurant', 'bar', 'ac', 'spa', 'breakfast'],
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
    amenities: ['wifi', 'pool', 'restaurant', 'gym', 'parking', 'bar', 'spa'],
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
    amenities: ['wifi', 'pool', 'restaurant', 'spa', 'gym', 'beach', 'bar', 'breakfast'],
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
    amenities: ['wifi', 'restaurant', 'bar', 'gym', 'parking', 'spa'],
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
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 6;

  // Filter hotels based on search and filters
  const filteredHotels = allHotels.filter(hotel => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
                         hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price filter
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    
    // Star rating filter
    const matchesStars = selectedStars.length === 0 || selectedStars.includes(hotel.stars);
    
    // Amenities filter
    const matchesAmenities = selectedAmenities.length === 0 || 
                           selectedAmenities.every(amenity => hotel.amenities.includes(amenity));
    
    return matchesSearch && matchesPrice && matchesStars && matchesAmenities;
  });

  // Get current hotels for pagination
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle star filter
  const toggleStarFilter = (star) => {
    setSelectedStars(prev => 
      prev.includes(star) 
        ? prev.filter(s => s !== star)
        : [...prev, star]
    );
    setCurrentPage(1);
  };

  // Toggle amenity filter
  const toggleAmenityFilter = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 100000]);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setCurrentPage(1);
  };

  // Get amenity icon by ID
  const getAmenityIcon = (id) => {
    const amenity = amenityOptions.find(a => a.id === id);
    return amenity ? amenity.icon : null;
  };

  return (
    <div className={styles.hotelsPage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Find Your Perfect Stay</h1>
          <p>Discover and book luxury hotels with the best prices and amenities</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <div className={styles.searchInput}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by hotel name or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button 
            className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            type="button"
          >
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className={styles.filters}>
            <div className={styles.filterSection}>
              <h3>Price Range</h3>
              <div className={styles.rangeSlider}>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    setPriceRange([priceRange[0], parseInt(e.target.value)]);
                    setCurrentPage(1);
                  }}
                />
                <div className={styles.priceRange}>
                  <span>Ksh 0</span>
                  <span>Ksh {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3>Star Rating</h3>
              <div className={styles.starFilters}>
                {starOptions.map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.starFilter} ${selectedStars.includes(star) ? styles.active : ''}`}
                    onClick={() => toggleStarFilter(star)}
                  >
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`${styles.starIcon} ${i < star ? styles.filled : ''}`} 
                      />
                    ))}
                    {star === 5 ? ' 5 Stars' : `${star}+`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3>Amenities</h3>
              <div className={styles.amenityGrid}>
                {amenityOptions.map(({ id, label, icon }) => (
                  <label key={id} className={styles.amenityFilter}>
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(id)}
                      onChange={() => toggleAmenityFilter(id)}
                      style={{ display: 'none' }}
                    />
                    <span className={styles.amenityIcon}>{icon}</span>
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterActions}>
              <button 
                type="button"
                className={styles.resetButton}
                onClick={resetFilters}
              >
                Reset All Filters
              </button>
              <button 
                type="button"
                className={styles.applyButton}
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <div className={styles.resultsHeader}>
          <h2>Available Hotels</h2>
          <p>{filteredHotels.length} {filteredHotels.length === 1 ? 'property' : 'properties'} found</p>
        </div>

        {currentHotels.length > 0 ? (
          <div className={styles.hotelsGrid}>
            {currentHotels.map(hotel => (
              <div key={hotel.id} className={`${styles.hotelCard} ${hotel.featured ? styles.featured : ''}`}>
                <div className={styles.hotelImage}>
                  <img src={hotel.image} alt={hotel.name} />
                  {hotel.featured && <span className={styles.featuredTag}>Featured</span>}
                  <div className={styles.hotelRating}>
                    <FaStar className={styles.starIcon} />
                    <span className={styles.ratingValue}>{hotel.rating}</span>
                    <span className={styles.reviews}>({hotel.reviews} reviews)</span>
                  </div>
                </div>
                <div className={styles.hotelDetails}>
                  <div className={styles.hotelHeader}>
                    <h3>{hotel.name}</h3>
                    <div className={styles.hotelStars}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`${styles.starIcon} ${i < hotel.stars ? styles.filled : ''}`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.hotelLocation}>
                    <FaMapMarkerAlt className={styles.locationIcon} />
                    <span>{hotel.location}</span>
                  </div>
                  
                  <div className={styles.hotelAmenities}>
                    {hotel.amenities.slice(0, 5).map((amenity, index) => (
                      <span key={index} className={styles.amenity} title={amenity}>
                        {getAmenityIcon(amenity) || amenity.charAt(0).toUpperCase() + amenity.slice(1).charAt(0)}
                      </span>
                    ))}
                    {hotel.amenities.length > 5 && (
                      <span className={styles.moreAmenities}>
                        +{hotel.amenities.length - 5}
                      </span>
                    )}
                  </div>
                  
                  <div className={styles.hotelFooter}>
                    <div className={styles.priceContainer}>
                      <span className={styles.priceLabel}>Starting from</span>
                      <div className={styles.priceValue}>
                        Ksh {hotel.price.toLocaleString()}
                        <span className={styles.pricePeriod}>/night</span>
                      </div>
                    </div>
                    <Link 
                      to={`/hotels/${hotel.id}`} 
                      className={styles.viewDetails}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <h3>No hotels found matching your criteria</h3>
            <p>Try adjusting your search or filters</p>
            <button 
              className={styles.resetButton}
              onClick={resetFilters}
              type="button"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredHotels.length > hotelsPerPage && (
          <div className={styles.pagination}>
            <button 
              className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              type="button"
            >
              <FaArrowLeft /> Previous
            </button>
            
            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show first page, last page, and pages around current page
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
                
                if (i === 3 && currentPage < totalPages - 3) {
                  return <span key="ellipsis" className={styles.ellipsis}>...</span>;
                }
                
                if (i === 4 && currentPage < totalPages - 3) {
                  return (
                    <button
                      key={totalPages}
                      onClick={() => paginate(totalPages)}
                      className={`${styles.pageNumber} ${currentPage === totalPages ? styles.active : ''}`}
                      type="button"
                    >
                      {totalPages}
                    </button>
                  );
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`${styles.pageNumber} ${currentPage === pageNum ? styles.active : ''}`}
                    type="button"
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              type="button"
            >
              Next <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;