import { useState, useEffect } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import styles from '../pages/Properties.module.css';

const PropertiesFilters = ({
  searchParams,
  propertyTypes,
  onFilterChange,
  onSearch,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const type = searchParams.get('type') || 'all';
  const category = searchParams.get('category') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSearch(formData.get('search'));
  };
  
  return (
    <section className={styles.filtersSection}>
      <div className={styles.filtersHeader}>
        <h2 className={styles.filtersTitle}>Search Properties</h2>
        <button 
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-controls="filters-content"
          type="button"
        >
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
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
        {(showFilters || !isMobile) && (
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className={styles.priceInput}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.filterActions}>
              <button 
                type="button" 
                className={styles.resetButton}
                onClick={() => window.location.href = '/properties'}
              >
                Reset Filters
              </button>
              {isMobile && (
                <button 
                  type="button" 
                  className={styles.applyButton}
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

PropertiesFilters.propTypes = {
  searchParams: PropTypes.instanceOf(URLSearchParams).isRequired,
  propertyTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default PropertiesFilters;
