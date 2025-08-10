import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FaSearch, 
  FaStar, 
  FaMapMarkerAlt, 
  FaFilter, 
  FaBed,
  FaBath,
  FaRulerCombined,
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
import { propertiesAPI } from '../services/api';
import styles from './Properties.module.css';

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

// Property types
const propertyTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'house', name: 'Houses' },
  { id: 'apartment', name: 'Apartments' },
  { id: 'villa', name: 'Villas' },
  { id: 'townhouse', name: 'Townhouses' },
  { id: 'penthouse', name: 'Penthouses' },
  { id: 'land', name: 'Land' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'beach_house', name: 'Beach Houses' },
  { id: 'country_house', name: 'Country Houses' }
];

// Map backend property data to frontend format
const mapPropertyData = (property) => ({
  id: property.id,
  title: property.title,
  location: `${property.city}, ${property.country}`,
  price: parseFloat(property.price),
  rating: 4.5, // Default rating, can be updated if ratings are implemented
  reviews: 0, // Default reviews count
  type: property.property_type || 'house',
  bedrooms: property.bedrooms || 0,
  bathrooms: property.bathrooms || 0,
  area: parseFloat(property.area) || 0,
  amenities: property.amenities ? property.amenities.map(a => a.name.toLowerCase().replace(' ', '_')) : [],
  image: property.images && property.images.length > 0 
    ? property.images[0].image 
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  featured: property.is_featured || false
});

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const propertiesPerPage = 6;

  // Fetch properties from the backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getProperties({
          is_published: true,
          limit: 100, // Adjust based on your pagination needs
        });
        
        // Log the response to debug
        console.log('API Response:', response);
        
        // Handle different response structures
        const propertiesData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.results || [];
          
        if (!Array.isArray(propertiesData)) {
          throw new Error('Invalid data format received from server');
        }
        
        setProperties(propertiesData.map(mapPropertyData));
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
        setProperties([]); // Reset properties to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
                         property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price filter
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    // Type filter
    const matchesType = selectedType === 'all' || property.type === selectedType;
    
    // Amenities filter
    const matchesAmenities = selectedAmenities.length === 0 || 
                           selectedAmenities.every(amenity => property.amenities.includes(amenity));
    
    return matchesSearch && matchesPrice && matchesType && matchesAmenities;
  });

  // Get current properties for pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    setPriceRange([0, 50000000]);
    setSelectedType('all');
    setSelectedAmenities([]);
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

  // Get amenity icon by ID
  const getAmenityIcon = (id) => {
    const amenity = amenityOptions.find(a => a.id === id);
    return amenity ? amenity.icon : null;
  };

  return (
    <div className={styles.propertiesPage}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80') center/cover no-repeat`
        }}
      >
        <div className={styles.heroContent}>
          <h1>Find Your Dream Property</h1>
          <p>Discover and buy or rent luxury properties with the best prices and amenities</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <div className={styles.searchInput}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by property name or location..."
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
                  max="50000000"
                  step="100000"
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
              <h3>Property Type</h3>
              <div className={styles.typeFilters}>
                {propertyTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    className={`${styles.typeFilter} ${selectedType === type.id ? styles.active : ''}`}
                    onClick={() => {
                      setSelectedType(type.id);
                      setCurrentPage(1);
                    }}
                  >
                    {type.name}
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
          <h2>Available Properties</h2>
          <p>{filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found</p>
        </div>

        {currentProperties.length > 0 ? (
          <div className={styles.propertiesGrid}>
            {currentProperties.map(property => (
              <div key={property.id} className={`${styles.propertyCard} ${property.featured ? styles.featured : ''}`}>
                <div className={styles.propertyImage}>
                  <img src={property.image} alt={property.title} />
                  {property.featured && <span className={styles.featuredTag}>Featured</span>}
                  <div className={styles.propertyRating}>
                    <FaStar className={styles.starIcon} />
                    <span className={styles.ratingValue}>{property.rating}</span>
                    <span className={styles.reviews}>({property.reviews} reviews)</span>
                  </div>
                </div>
                <div className={styles.propertyDetails}>
                  <div className={styles.propertyHeader}>
                    <h3>{property.title}</h3>
                    <div className={styles.propertyType}>
                      {propertyTypes.find(t => t.id === property.type)?.name || 'Property'}
                    </div>
                  </div>
                  
                  <div className={styles.propertyLocation}>
                    <FaMapMarkerAlt className={styles.locationIcon} />
                    <span>{property.location}</span>
                  </div>
                  
                  <div className={styles.propertyFeatures}>
                    <div className={styles.feature}>
                      <FaBed />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className={styles.feature}>
                      <FaBath />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className={styles.feature}>
                      <FaRulerCombined />
                      <span>{property.area} sqft</span>
                    </div>
                  </div>
                  
                  <div className={styles.propertyAmenities}>
                    {property.amenities.slice(0, 5).map((amenity, index) => (
                      <span key={index} className={styles.amenity} title={amenity}>
                        {getAmenityIcon(amenity) || amenity.charAt(0).toUpperCase()}
                      </span>
                    ))}
                    {property.amenities.length > 5 && (
                      <span className={styles.moreAmenities}>
                        +{property.amenities.length - 5}
                      </span>
                    )}
                  </div>
                  
                  <div className={styles.propertyFooter}>
                    <div className={styles.priceContainer}>
                      <span className={styles.priceLabel}>Starting from</span>
                      <div className={styles.priceValue}>
                        {formatPrice(property.price)}
                        {property.type === 'rent' && <span className={styles.pricePeriod}>/mo</span>}
                      </div>
                    </div>
                    <Link 
                      to={`/properties/${property.id}`} 
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
            <h3>No properties found matching your criteria</h3>
            <p>Try adjusting your search filters or try a different search term</p>
            <button 
              className={styles.resetButton}
              onClick={resetFilters}
            >
              Reset All Filters
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
              onClick={() => paginate(currentPage - 1)}
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
                  onClick={() => paginate(pageNum)}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
              onClick={() => paginate(currentPage + 1)}
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

export default Properties;
