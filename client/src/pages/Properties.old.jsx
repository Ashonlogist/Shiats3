import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaFilter, FaArrowLeft, FaArrowRight, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import styles from './Properties.module.css';

// Add dateAdded to mock data for sorting
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
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
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
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
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
  const navigate = useNavigate();
  
  // Get filter values from URL or use defaults
  const type = searchParams.get('type') || 'all';
  const category = searchParams.get('category') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 6;
  
  // Filter properties based on current filters
  const filterProperties = useCallback(() => {
    return allProperties.filter(property => {
      // Filter by type
      if (type !== 'all' && property.type !== type) return false;
    // Filter by property category
    if (filters.category !== 'all' && property.category !== filters.category) {
      return false;
    }
    
    // Filter by bedrooms
    if (filters.bedrooms !== 'any') {
      const bedrooms = parseInt(filters.bedrooms, 10);
      if (property.beds < bedrooms) {
        return false;
      }
    }
    
    // Filter by price range
    if (filters.minPrice && property.price < parseInt(filters.minPrice, 10)) {
      return false;
    }
    
    if (filters.maxPrice && property.price > parseInt(filters.maxPrice, 10)) {
      return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const titleMatch = property.title.toLowerCase().includes(searchTerm);
      const locationMatch = property.location.toLowerCase().includes(searchTerm);
      
      if (!titleMatch && !locationMatch) {
        return false;
      }
    }
    
    return true;
  });

  // Get current properties
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (value) {
      newSearchParams.set(name, value);
    } else {
      newSearchParams.delete(name);
    }
    setSearchParams(newSearchParams);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Toggle favorite status
  const toggleFavorite = (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
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

  return (
    <div className="properties-page">
      {/* Page Header */}
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Properties for {filters.type === 'rent' ? 'Rent' : 'Sale'}</h1>
          <p className="page-subtitle">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>
      </header>

      <div className="container">
        <div className="properties-container">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'filters-sidebar--active' : ''}`}>
            <div className="filters-header">
              <h3>Filter Properties</h3>
              <button 
                className="filters-close"
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
              >
                &times;
              </button>
            </div>
            
            <div className="filters-group">
              <h4 className="filters-group__title">Property Type</h4>
              <div className="filters-group__content">
                <div className="form-group">
                  <select 
                    name="type" 
                    className="form-control"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All Types</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <select 
                    name="category" 
                    className="form-control"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    {propertyTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
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
              <h4 className="filters-group__title">Bedrooms</h4>
              <div className="filters-group__content">
                <div className="form-group">
                  <select 
                    name="bedrooms" 
                    className="form-control"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                  >
                    <option value="any">Any</option>
                    <option value="1">1+ Bedrooms</option>
                    <option value="2">2+ Bedrooms</option>
                    <option value="3">3+ Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
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
          </div>
        </div>
      </aside>
            
            {/* Properties Grid */}
            {currentProperties.length > 0 ? (
              <>
                <div className="properties-grid">
                  {currentProperties.map(property => (
                    <div key={property.id} className="property-card">
                      <div className="property-card__image-container">
                        <img 
                          src={property.image} 
                          alt={property.title} 
                          className="property-card__image"
                          loading="lazy"
                        />
                        {property.featured && (
                          <span className="property-card__badge">Featured</span>
                        )}
                        <span className="property-card__type">
                          {property.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </span>
                      </div>
                      <div className="property-card__content">
                        <h3 className="property-card__title">
                          <Link to={`/properties/${property.id}`}>
                            {property.title}
                          </Link>
                        </h3>
                        <p className="property-card__location">
                          <FaMapMarkerAlt className="property-card__location-icon" />
                          {property.location}
                        </p>
                        <div className="property-card__meta">
                          <span className="property-card__meta-item">
                            <FaBed className="property-card__meta-icon" />
                            {property.beds} Beds
                          </span>
                          <span className="property-card__meta-item">
                            <FaBath className="property-card__meta-icon" />
                            {property.baths} Baths
                          </span>
                          <span className="property-card__meta-item">
                            <FaRulerCombined className="property-card__meta-icon" />
                            {property.sqft.toLocaleString()} sqft
                          </span>
                        </div>
                        <div className="property-card__footer">
                          <span className="property-card__price">
                            {property.type === 'rent' 
                              ? `${formatPrice(property.price)}/mo` 
                              : formatPrice(property.price)}
                          </span>
                          <Link 
                            to={`/properties/${property.id}`} 
                            className="button button--primary button--sm"
                          >
                            View Details
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
                <h3>No properties found</h3>
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

export default Properties;
