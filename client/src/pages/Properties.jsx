import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaBed, 
  FaBath, 
  FaRulerCombined, 
  FaMapMarkerAlt, 
  FaFilter, 
  FaArrowLeft, 
  FaArrowRight, 
  FaHeart, 
  FaRegHeart, 
  FaStar, 
  FaSpinner,
  FaWifi,
  FaSwimmingPool,
  FaParking,
  FaSnowflake,
  FaTv,
  FaUtensils,
  FaDumbbell,
  FaPaw
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import propertyService from '../api/propertyService';
import styles from './Properties.module.css';

const propertyTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'house', name: 'Houses' },
  { id: 'apartment', name: 'Apartments' },
  { id: 'villa', name: 'Villas' },
  { id: 'townhouse', name: 'Townhouses' },
  { id: 'penthouse', name: 'Penthouses' },
  { id: 'land', name: 'Land' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'hotel', name: 'Hotels' },
  { id: 'resort', name: 'Resorts' },
  { id: 'cabin', name: 'Cabins' },
  { id: 'beach_house', name: 'Beach Houses' },
  { id: 'country_house', name: 'Country Houses' }
];

const amenities = [
  { id: 'wifi', name: 'WiFi', icon: <FaWifi /> },
  { id: 'pool', name: 'Pool', icon: <FaSwimmingPool /> },
  { id: 'parking', name: 'Parking', icon: <FaParking /> },
  { id: 'ac', name: 'Air Conditioning', icon: <FaSnowflake /> },
  { id: 'tv', name: 'TV', icon: <FaTv /> },
  { id: 'kitchen', name: 'Kitchen', icon: <FaUtensils /> },
  { id: 'gym', name: 'Gym', icon: <FaDumbbell /> },
  { id: 'pets', name: 'Pets Allowed', icon: <FaPaw /> }
];

const starOptions = [1, 2, 3, 4, 5];

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [totalProperties, setTotalProperties] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [type, setType] = useState('all');
  const navigate = useNavigate();

  // Get filter values from URL or use defaults
  const searchTerm = searchParams.get('search') || '';
  const propertyType = searchParams.get('type') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const minArea = searchParams.get('minArea') || '';
  const maxArea = searchParams.get('maxArea') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sortBy = searchParams.get('sort') || 'featured';
  const view = searchParams.get('view') || 'grid';
  const selectedAmenities = searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [];
  const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')) : 0;

  // State for filter inputs
  const [filters, setFilters] = useState({
    search: searchTerm,
    type: propertyType,
    minPrice: minPrice,
    maxPrice: maxPrice,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    minArea: minArea,
    maxArea: maxArea,
    sort: sortBy,
    view: view,
    amenities: new Set(selectedAmenities),
    rating: rating
  });

  // Toggle mobile filter menu
  const toggleMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(prev => !prev);
  }, []);

  // Fetch properties from API
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = {
        page: page,
        page_size: 12,
        search: filters.search || undefined,
        min_price: filters.minPrice || undefined,
        max_price: filters.maxPrice || undefined,
        ordering: filters.sort === 'price_asc' ? 'price' : filters.sort === 'price_desc' ? '-price' : '-created_at',
        property_type: filters.type !== 'all' ? filters.type : undefined,
        bedrooms: filters.bedrooms || undefined,
        bathrooms: filters.bathrooms || undefined,
        min_area: filters.minArea || undefined,
        max_area: filters.maxArea || undefined,
        amenities: Array.from(filters.amenities).join(',') || undefined,
        rating: filters.rating || undefined
      };
      
      // Remove undefined params
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      
      const response = await propertyService.getProperties(params);
      setProperties(response.data.results || []);
      setTotalProperties(response.data.count || 0);
      setCurrentPage(parseInt(page));
      
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, minPrice, maxPrice, sort, type]);
  
  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    // Update params with new filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === '' || value === 'all' || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Reset to first page when filters change
    params.set('page', '1');
    
    // Update URL
    setSearchParams(params);
  }, [searchParams, setSearchParams]);
  
  // Handle search submit
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const searchValue = e.target.search.value.trim();
    handleFilterChange({ search: searchValue, page: '1' });
  }, [handleFilterChange]);
  
  // Handle sort change
  const handleSortChange = useCallback((e) => {
    handleFilterChange({ sort: e.target.value, page: '1' });
  }, [handleFilterChange]);
  
  // Calculate pagination
  const totalPages = Math.ceil(totalProperties / pageSize);
  
  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    // Since we're handling filtering on the backend, just return the properties as-is
    // The filtering is done via query parameters in fetchProperties
    return properties.map(property => ({
      ...property,
      // Ensure consistent property names with the frontend
      image: property.images?.[0]?.image || 'https://via.placeholder.com/600x400?text=No+Image',
      location: `${property.city}, ${property.country}`,
      beds: property.bedrooms,
      baths: property.bathrooms,
      sqft: property.area,
      type: property.property_type,
      featured: property.is_featured
    }));
  }, [properties]);
  
  // Toggle favorite status
  const toggleFavorite = (propertyId, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
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
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setCurrentPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    navigate(`?${newParams.toString()}`, { replace: true });
    
    // Scroll to top of results
    window.scrollTo({
      top: 600,
      behavior: 'smooth'
    });
  };
  
  // Animation variants for Framer Motion
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
    <div className={styles.propertiesPage}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Find Your Perfect Property</h1>
          <p>Discover amazing properties that match your lifestyle</p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Search and Filters Section */}
        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchInputGroup}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  name="search"
                  placeholder="Search by location, property type, or keyword..."
                  defaultValue={search}
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                  Search
                </button>
              </div>
              
              <div className={styles.filtersToggle}>
                <button 
                  type="button"
                  className={styles.filterToggleButton}
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                  aria-controls="filters-content"
                >
                  <FaFilter />
                  <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                </button>
              </div>
              
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
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </form>
          </div> {/* Close searchContainer */}
          
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
                    <label htmlFor="type" className={styles.filterLabel}>Type</label>
                    <select
                      id="type"
                      name="type"
                      value={type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Types</option>
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                  
                  <div className={styles.filterGroup}>
                    <label htmlFor="type" className={styles.filterLabel}>Property Type</label>
                    <select
                      id="type"
                      name="type"
                      value={type}
                      onChange={(e) => handleFilterChange({ type: e.target.value })}
                      className={styles.filterSelect}
                    >
                      {propertyTypes.map(pt => (
                        <option key={pt.id} value={pt.id}>
                          {pt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.filterGroup}>
                    <label htmlFor="minPrice" className={styles.filterLabel}>Min Price</label>
                    <div className={styles.priceInputGroup}>
                      <span className={styles.currencySymbol}>KSh</span>
                      <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        min="0"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className={styles.priceInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.filterGroup}>
                    <label htmlFor="maxPrice" className={styles.filterLabel}>Max Price</label>
                    <div className={styles.priceInputGroup}>
                      <span className={styles.currencySymbol}>KSh</span>
                      <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        min="0"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className={styles.priceInput}
                      />
                    </div>
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
      </div>
      
      {/* Results Section */}
      <section className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <p className={styles.resultsCount}>
            Showing {properties.length} of {totalProperties} properties
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
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        
        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No properties found matching your criteria</h3>
            <p>Try adjusting your search filters or try a different search term</p>
            <button 
              className={styles.resetButton}
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div 
            className={styles.propertiesGrid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentPageItems.map((property) => (
              <motion.div 
                key={property.id}
                className={styles.propertyCard}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
              >
                <div className={styles.propertyImageContainer}>
                  <img 
                    src={property.image || '/placeholder-property.jpg'} 
                    alt={property.title} 
                    className={styles.propertyImage}
                    loading="lazy"
                  />
                  <button 
                    className={`${styles.favoriteButton} ${favorites.has(property.id) ? styles.favorited : ''}`}
                    onClick={(e) => toggleFavorite(property.id, e)}
                    aria-label={favorites.has(property.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.has(property.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  {property.featured && (
                    <span className={styles.propertyBadge}>
                      <FaStar className={styles.badgeIcon} /> Featured
                    </span>
                  )}
                </div>
                <div className={styles.propertyContent}>
                  <div className={styles.propertyHeader}>
                    <h3 className={styles.propertyPrice}>
                      {formatPrice(property.price)}
                      {property.type === 'rent' && <span>/mo</span>}
                    </h3>
                    <span className={styles.propertyType}>
                      {property.category?.charAt(0).toUpperCase() + property.category?.slice(1) || 'Property'}
                    </span>
                  </div>
                  <h4 className={styles.propertyTitle}>
                    <Link to={`/properties/${property.id}`} className={styles.propertyLink}>
                      {property.title}
                    </Link>
                  </h4>
                  <div className={styles.propertyLocation}>
                    <FaMapMarkerAlt />
                    <span>{property.location || 'Location not specified'}</span>
                  </div>
                  <div className={styles.propertyFeatures}>
                    <div className={styles.feature}>
                      <FaBed />
                      <span>{property.bedrooms || 'N/A'} Beds</span>
                    </div>
                    <div className={styles.feature}>
                      <FaBath />
                      <span>{property.bathrooms || 'N/A'} Baths</span>
                    </div>
                    <div className={styles.feature}>
                      <FaRulerCombined />
                      <span>{property.area ? `${property.area} sqft` : 'N/A'}</span>
                    </div>
                  </div>
                  <div className={styles.propertyFooter}>
                    {property.rating ? (
                      <div className={styles.propertyRating}>
                        <FaStar />
                        <span>{property.rating.toFixed(1)}</span>
                        <span className={styles.ratingCount}>({property.reviewCount || 0})</span>
                      </div>
                    ) : (
                      <div className={styles.propertyRating}>
                        <span>No reviews</span>
                      </div>
                    )}
                    <Link 
                      to={`/properties/${property.id}`} 
                      className={styles.viewDetailsButton}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
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
                  onClick={() => handlePageChange(pageNum)}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Properties;
