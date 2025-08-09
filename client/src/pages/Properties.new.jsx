import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import PropertyCard from '../components/PropertyCard';
import PropertiesFilters from '../components/PropertiesFilters';
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
  // ... (other properties from the previous data)
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
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();
  
  // Get filter values from URL or use defaults
  const type = searchParams.get('type') || 'all';
  const category = searchParams.get('category') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
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
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);
  
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
    
    // Update URL
    navigate(`?${newParams.toString()}`, { replace: true });
  };
  
  // Toggle favorite status
  const toggleFavorite = (propertyId) => {
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
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    navigate(`?${newParams.toString()}`, { replace: true });
    
    // Scroll to top of results
    window.scrollTo({
      top: 600,
      behavior: 'smooth'
    });
  };
  
  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className={styles.pagination}>
        <button 
          className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <FaArrowLeft />
        </button>
        
        {startPage > 1 && (
          <>
            <button 
              className={`${styles.pageButton} ${currentPage === 1 ? styles.active : ''}`}
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className={styles.pageEllipsis}>...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.pageEllipsis}>...</span>}
            <button 
              className={`${styles.pageButton} ${currentPage === totalPages ? styles.active : ''}`}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button 
          className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <FaArrowRight />
        </button>
      </div>
    );
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
        <PropertiesFilters 
          searchParams={searchParams}
          propertyTypes={propertyTypes}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
        
        {/* Results Count and Sort */}
        <div className={styles.resultsHeader}>
          <p className={styles.resultsCount}>
            Showing {currentProperties.length} of {filteredProperties.length} properties
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
        {currentProperties.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No properties found matching your criteria</h3>
            <p>Try adjusting your search filters or try a different search term</p>
            <button 
              className={styles.resetButton}
              onClick={() => navigate('/properties')}
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
            {currentProperties.map((property) => (
              <motion.div 
                key={property.id}
                variants={itemVariants}
              >
                <PropertyCard 
                  property={property}
                  isFavorite={favorites.has(property.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default Properties;
