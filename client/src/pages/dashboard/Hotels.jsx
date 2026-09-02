import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import api from '../../services/api';
import { sampleHotels } from '../../data/sampleData';
import './Properties.css';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', sortBy: 'price-asc' });
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await api.get('/hotels/');
        const data = response.data?.results || response.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setHotels(data.map(h => ({ ...h, status: h.status || (h.is_active ? 'active' : 'inactive') })));
          setLoading(false);
          return;
        }
        setHotels(sampleHotels.map(h => ({ ...h, status: 'active', createdAt: new Date().toISOString() })));
        setUsingFallback(true);
        setLoading(false);
      } catch {
        setHotels(sampleHotels.map(h => ({ ...h, status: 'active', createdAt: new Date().toISOString() })));
        setUsingFallback(true);
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const filteredHotels = hotels
    .filter(hotel => {
      const matchesSearch = (hotel.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hotel.location || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === 'all' || hotel.status === filters.status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (filters.sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (filters.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'inactive': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GHS',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel? This cannot be undone.')) return;
    try {
      await api.delete(`/hotels/${id}/`);
      setHotels(prev => prev.filter(h => h.id !== id));
    } catch {
      setHotels(prev => prev.filter(h => h.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading hotels...</p>
      </div>
    );
  }

  return (
    <div className="properties-container">
      <div className="properties-header">
        <h1>Hotels</h1>
        <Link to="/dashboard/hotels/new" className="btn-primary">
          <FaPlus className="icon" /> Add New Hotel
        </Link>
      </div>

      {usingFallback && (
        <div className="fallback-notice">Backend offline &mdash; showing sample hotels. Changes are temporary.</div>
      )}

      <div className="properties-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search hotels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-by">Sort By:</label>
          <select
            id="sort-by"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="properties-stats">
        <div className="stat-card">
          <h3>{hotels.length}</h3>
          <p>Total Hotels</p>
        </div>
        <div className="stat-card">
          <h3>{hotels.filter(h => h.status === 'active').length}</h3>
          <p>Active</p>
        </div>
        <div className="stat-card">
          <h3>{hotels.filter(h => (h.rating || 0) >= 4.8).length}</h3>
          <p>Top Rated</p>
        </div>
        <div className="stat-card">
          <h3>{hotels.filter(h => h.featured).length}</h3>
          <p>Featured</p>
        </div>
      </div>

      <div className="properties-grid">
        {filteredHotels.length > 0 ? (
          filteredHotels.map(hotel => (
            <div key={hotel.id} className="property-card">
              <div className="property-image">
                <img src={hotel.image} alt={hotel.name || hotel.title} />
                <div className={`status-badge ${getStatusBadgeClass(hotel.status)}`}>
                  {String(hotel.status || 'active').charAt(0).toUpperCase() + String(hotel.status || 'active').slice(1)}
                </div>
                {hotel.rating && (
                  <div className="featured-badge" style={{ background: 'rgba(218, 165, 32, 0.9)' }}>
                    <FaStar /> {hotel.rating}
                  </div>
                )}
                <div className="property-actions">
                  <Link to={`/hotels/${hotel.id}`} className="action-btn view-btn" title="View">
                    <i className="fa fa-eye"></i>
                  </Link>
                  <button className="action-btn edit-btn" title="Edit">
                    <FaEdit />
                  </button>
                  <button className="action-btn delete-btn" title="Delete" onClick={() => handleDelete(hotel.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="property-details">
                <h3>{hotel.name || hotel.title}</h3>
                <p className="location">
                  <i className="fa fa-map-marker-alt"></i> {hotel.location}
                </p>
                <div className="property-meta">
                  {hotel.stars ? <span><FaStar style={{ color: '#DAA520' }} /> {hotel.stars} Star</span> : null}
                  <span>{Array.isArray(hotel.amenities) ? `${hotel.amenities.length} amenities` : ''}</span>
                </div>
                <div className="property-footer">
                  <div className="price">{formatPrice(hotel.price)} <small>/night</small></div>
                  <div className="date">{hotel.reviews || 0} reviews</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No hotels found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;