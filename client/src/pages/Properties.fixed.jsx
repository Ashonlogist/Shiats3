import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaFilter, FaArrowLeft, FaArrowRight, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import styles from './Properties.module.css';

// Mock data with dateAdded for sorting
const allProperties = [
  {
    id: 1,
    title: 'Luxury Villa in Karen',
    location: 'Karen, Nairobi',
    price: 45000000,
    type: 'sale',
    category: 'house',
    beds: 5,
    baths: 4,
    sqft: 4500,
    featured: true,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    dateAdded: '2023-05-15'
  },
  {
    id: 2,
    title: 'Modern Apartment in Westlands',
    location: 'Westlands, Nairobi',
    price: 25000,
    type: 'rent',
    category: 'apartment',
    beds: 3,
    baths: 2,
    sqft: 1800,
    featured: true,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    dateAdded: '2023-06-20'
  },
  {
    id: 3,
    title: 'Beachfront Villa in Diani',
    location: 'Diani, Mombasa',
    price: 68000000,
    type: 'sale',
    category: 'villa',
    beds: 6,
    baths: 5,
    sqft: 5200,
    featured: true,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    dateAdded: '2023-04-10'
  },
  {
    id: 4,
    title: 'Cozy Apartment in Kilimani',
    location: 'Kilimani, Nairobi',
    price: 18000,
    type: 'rent',
    category: 'apartment',
    beds: 2,
    baths: 2,
    sqft: 1200,
    featured: false,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    dateAdded: '2023-07-05'
  },
  {
    id: 5,
    title: 'Townhouse in Runda',
    location: 'Runda, Nairobi',
    price: 32000000,
    type: 'sale',
    category: 'townhouse',
    beds: 4,
    baths: 3,
    sqft: 2800,
    featured: false,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    dateAdded: '2023-03-22'
  },
  {
    id: 6,
    title: 'Penthouse in Upper Hill',
    location: 'Upper Hill, Nairobi',
    price: 85000,
    type: 'rent',
    category: 'penthouse',
    beds: 3,
    baths: 3,
    sqft: 3200,
    featured: true,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    dateAdded: '2023-08-12'
  }
];

const propertyTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'house', name: 'Houses' },
  { id: 'apartment', name: 'Apartments' },
  { id: 'villa', name: 'Villas' },
  { id: 'townhouse', name: 'Townhouses' },
  { id: 'penthouse', name: 'Penthouses' },
  { id: 'land', name: 'Land' },
  { id: 'commercial', name: 'Commercial' }
];

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  
  // Get filter values from URL or use defaults
  const type = searchParams.get('type') || 'all';
  const category = searchParams.get('category') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'featured';
  const itemsPerPage = 6;
  
  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...allProperties];
    
    // Apply filters
    if (type !== 'all') {
      result = result.filter(property => property.type === type);
    }
    
    if (category !== 'all') {
      result = result.filter(property => property.category === category);
    }
    
    if (minPrice) {
      result = result.filter(property => property.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      result = result.filter(property => property.price <= parseFloat(maxPrice));
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(property => 
        property.title.toLowerCase().includes(searchLower) || 
        property.location.toLowerCase().includes(searchLower) ||
        property.category.toLowerCase().includes(searchLower)
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
      case 'newest':
        result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || 
                  new Date(b.dateAdded) - new Date(a.dateAdded));
    }
    
    return result;
  }, [type, category, minPrice, maxPrice, search, sort]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const currentPageItems = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle filter changes
  const handleFilterChange = (name, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === 'all' || !value) {
      newParams.delete(name);
    } else {
      newParams.set(name, value);
    }
    
    // Reset to first page when filters change
    newParams.set('page', '1');
    setCurrentPage(1);
    
    // Update URL
    navigate(`?${newParams.toString()}`, { replace: true });
  };
  
  // Handle search
  const handleSearch = (searchQuery) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    
    // Reset to first page when searching
    newParams.set('page', '1');
    setCurrentPage(1);
    
    // Update URL
    navigate(`?${newParams.toString()}`, { replace: true });
  };
  
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
      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Find Your Perfect Property
          </motion.h1>
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Discover amazing properties that match your lifestyle
          </motion.p>
        </div>
      </section>
      
      <div className={styles.container}>
        {/* Search and Filters */}
        <section className={styles.filtersSection}>
          <div className={styles.filtersHeader}>
            <h2 className={styles.filtersTitle}>Search Properties</h2>
            <button 
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filters-content"
            >
              <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSearch(formData.get('search'));
          }} className={styles.searchForm}>
            <div className={styles.searchInputGroup}>
              <input
                type="text"
                name="search"
                placeholder="Search by location, property type, or keyword..."
                defaultValue={search}
                className={styles.searchInput}
                aria-label="Search properties"
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
                    <label htmlFor="category" className={styles.filterLabel}>Category</label>
                    <select
                      id="category"
                      name="category"
                      value={category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
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
        
        {/* Results Count and Sort */}
        <div className={styles.resultsHeader}>
          <p className={styles.resultsCount}>
            Showing {currentPageItems.length} of {filteredProperties.length} properties
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
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        
        {/* Properties Grid */}
        {currentPageItems.length === 0 ? (
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
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
              >
                <Link to={`/properties/${property.id}`} className={styles.propertyLink}>
                  <div className={styles.propertyImage}>
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      loading="lazy"
                    />
                    {property.featured && (
                      <span className={styles.propertyBadge}>
                        <FaStar className={styles.badgeIcon} /> Featured
                      </span>
                    )}
                    <button 
                      className={`${styles.favoriteButton} ${favorites.has(property.id) ? styles.active : ''}`}
                      onClick={(e) => toggleFavorite(property.id, e)}
                      aria-label={favorites.has(property.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {favorites.has(property.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>
                  <div className={styles.propertyContent}>
                    <div className={styles.propertyHeader}>
                      <h3 className={styles.propertyPrice}>
                        {formatPrice(property.price)}
                        {property.type === 'rent' && <span>/mo</span>}
                      </h3>
                      <span className={styles.propertyType}>
                        {property.category.charAt(0).toUpperCase() + property.category.slice(1)}
                      </span>
                    </div>
                    <h4 className={styles.propertyTitle}>{property.title}</h4>
                    <div className={styles.propertyLocation}>
                      <FaMapMarkerAlt />
                      <span>{property.location}</span>
                    </div>
                    <div className={styles.propertyFeatures}>
                      <div className={styles.feature}>
                        <FaBed />
                        <span>{property.beds} {property.beds === 1 ? 'Bed' : 'Beds'}</span>
                      </div>
                      <div className={styles.feature}>
                        <FaBath />
                        <span>{property.baths} {property.baths === 1 ? 'Bath' : 'Baths'}</span>
                      </div>
                      <div className={styles.feature}>
                        <FaRulerCombined />
                        <span>{property.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                </Link>
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
      </div>
    </div>
  );
};

export default Properties;
