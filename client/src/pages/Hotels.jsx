import { useState, useEffect } from 'react';
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
  FaArrowRight,
  FaSpinner
} from 'react-icons/fa';
import { propertiesAPI } from '../services/api';
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
  // State management
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hotelsPerPage = 6;

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      console.log('Fetching hotels from API...');
      try {
        setLoading(true);
        setError(null);
        
        // Log the API call details
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/properties/`;
        console.log('API URL:', apiUrl);
        
        const response = await propertiesAPI.getProperties();
        console.log('API Response:', response);
        
        if (response && response.data && Array.isArray(response.data)) {
          // Transform API data to match our frontend format
          const transformedHotels = response.data.map(hotel => ({
            id: hotel.id,
            name: hotel.name || 'Unnamed Hotel',
            location: hotel.city || hotel.address || 'Location not specified',
            price: hotel.price_per_night || 0,
            rating: hotel.average_rating || 0,
            reviews: hotel.review_count || 0,
            stars: hotel.star_rating || 0,
            amenities: hotel.amenities?.map(a => a.toLowerCase()) || [],
            image: hotel.images?.[0]?.image || 'https://placehold.co/800x500/EEEEEE/999999?text=No+Image+Available',
            featured: hotel.is_featured || false
          }));
          
          console.log('Transformed hotels data:', transformedHotels);
          setAllHotels(transformedHotels);
          setFilteredHotels(transformedHotels);
          setIsInitialLoad(false);
        } else {
          const errorMsg = response?.data?.message || 'No data received from server';
          console.error('Unexpected API response format:', response);
          setError(`Failed to load hotels: ${errorMsg}`);
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to load hotels. Please try again later.';
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config
        });
        setError(`Error: ${errorMsg}`);
        setIsInitialLoad(false);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Filter hotels based on search and filters
  useEffect(() => {
    if (!Array.isArray(allHotels) || allHotels.length === 0) {
      setFilteredHotels([]);
      return;
    }
    
    try {
      const filtered = allHotels.filter(hotel => {
        if (!hotel || typeof hotel !== 'object') return false;
        
        // Ensure name and location are strings before calling toLowerCase
        const safeToLower = (str) => (str || '').toString().toLowerCase();
        const searchTermLower = safeToLower(searchTerm);
        
        // Search term filter with null checks
        const matchesSearch = searchTerm === '' || 
          (hotel.name && safeToLower(hotel.name).includes(searchTermLower)) ||
          (hotel.location && safeToLower(hotel.location).includes(searchTermLower));
        
        // Price range filter with null check
        const price = parseFloat(hotel.price) || 0;
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        
        // Star rating filter with null check
        const stars = parseInt(hotel.stars) || 0;
        const matchesStars = selectedStars.length === 0 || selectedStars.includes(stars);
        
        // Amenities filter with null check
        const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];
        const matchesAmenities = selectedAmenities.length === 0 || 
          selectedAmenities.every(amenity => amenities.includes(amenity));
        
        return matchesSearch && matchesPrice && matchesStars && matchesAmenities;
      });
      
      setFilteredHotels(filtered);
    } catch (err) {
      console.error('Error filtering hotels:', err);
      setFilteredHotels([]);
    }
    
    setCurrentPage(1); // Reset to first page when filters change
  }, [allHotels, searchTerm, priceRange, selectedStars, selectedAmenities]);
  
  // Get current hotels for pagination
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle star filter
  const toggleStarFilter = (star) => {
    setSelectedStars(prev => 
      prev.includes(star) 
        ? prev.filter(s => s !== star)
        : [...prev, star]
    );
  };

  // Toggle amenity filter
  const toggleAmenityFilter = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 100000]);
    setSelectedStars([]);
    setSelectedAmenities([]);
  };

  // Render loading state
  if (loading && isInitialLoad) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading hotels...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Unable to load hotels</h3>
        <p>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // No results state
  if (!loading && filteredHotels.length === 0) {
    return (
      <div className={styles.noResults}>
        <h3>No hotels found</h3>
        <p>Try adjusting your search or filters</p>
        <button 
          className={styles.clearFiltersButton}
          onClick={() => {
            setSearchTerm('');
            setSelectedStars([]);
            setSelectedAmenities([]);
            setPriceRange([0, 100000]);
          }}
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className={styles.hotelsPage}>
      <div className={styles.header}>
        <h1>Hotels</h1>
        <button 
          className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          type="button"
        >
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Mobile Filters Toggle */}
      <div className={styles.mobileFilterToggle}>
        <button 
          className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          type="button"
        >
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Filters'}
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
              onClick={clearFilters}
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

      <div className={styles.mainContent}>
        {filteredHotels.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No hotels found matching your criteria</h3>
            <p>Try adjusting your filters or search term</p>
            <button 
              className={styles.clearButton}
              onClick={clearFilters}
              type="button"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={styles.hotelsGrid}>
            {currentHotels.map((hotel) => (
              <div key={hotel.id} className={styles.hotelCard}>
                <div className={styles.hotelImage}>
                  <img src={hotel.image} alt={hotel.name} />
                  {hotel.featured && <span className={styles.featuredBadge}>Featured</span>}
                </div>
                <div className={styles.hotelInfo}>
                  <div className={styles.hotelHeader}>
                    <h3>{hotel.name}</h3>
                    <div className={styles.rating}>
                      <FaStar className={styles.starIcon} />
                      <span>{hotel.rating} ({hotel.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className={styles.location}>
                    <FaMapMarkerAlt />
                    <span>{hotel.location}</span>
                  </div>
                  <div className={styles.amenities}>
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className={styles.amenity}>
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className={styles.moreAmenities}>+{hotel.amenities.length - 3} more</span>
                    )}
                  </div>
                  <div className={styles.priceSection}>
                    <div>
                      <span className={styles.price}>KSh {hotel.price.toLocaleString()}</span>
                      <span className={styles.night}> / night</span>
                    </div>
                    <Link to={`/hotels/${hotel.id}`} className={styles.viewButton}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredHotels.length > hotelsPerPage && (
          <div className={styles.pagination}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
              type="button"
            >
              <FaArrowLeft />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
                type="button"
              >
                {number}
              </button>
            ))}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
              type="button"
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