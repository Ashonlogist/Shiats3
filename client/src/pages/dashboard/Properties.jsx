import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaFilter, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './Properties.css';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    sortBy: 'newest'
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProperties = [
          {
            id: 1,
            title: 'Luxury Villa with Ocean View',
            type: 'villa',
            status: 'active',
            price: 1200000,
            location: 'Malibu, CA',
            bedrooms: 5,
            bathrooms: 4.5,
            area: 3200,
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
            featured: true,
            createdAt: '2023-05-15T10:30:00Z'
          },
          {
            id: 2,
            title: 'Modern Downtown Apartment',
            type: 'apartment',
            status: 'pending',
            price: 450000,
            location: 'New York, NY',
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
            featured: false,
            createdAt: '2023-06-20T14:15:00Z'
          },
          {
            id: 3,
            title: 'Cozy Mountain Cabin',
            type: 'cabin',
            status: 'inactive',
            price: 320000,
            location: 'Aspen, CO',
            bedrooms: 3,
            bathrooms: 2,
            area: 1800,
            image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
            featured: true,
            createdAt: '2023-04-10T09:45:00Z'
          },
          {
            id: 4,
            title: 'Beachfront Condo',
            type: 'condo',
            status: 'active',
            price: 675000,
            location: 'Miami, FL',
            bedrooms: 3,
            bathrooms: 3,
            area: 2200,
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
            featured: false,
            createdAt: '2023-07-05T11:20:00Z'
          },
          {
            id: 5,
            title: 'Historic Townhouse',
            type: 'townhouse',
            status: 'active',
            price: 890000,
            location: 'Boston, MA',
            bedrooms: 4,
            bathrooms: 3.5,
            area: 2800,
            image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c',
            featured: true,
            createdAt: '2023-03-22T16:40:00Z'
          },
          {
            id: 6,
            title: 'Luxury Penthouse',
            type: 'penthouse',
            status: 'pending',
            price: 2500000,
            location: 'Los Angeles, CA',
            bedrooms: 4,
            bathrooms: 4.5,
            area: 3800,
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
            featured: true,
            createdAt: '2023-08-01T10:15:00Z'
          }
        ];

        setProperties(mockProperties);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter and sort properties
  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || property.status === filters.status;
      const matchesType = filters.type === 'all' || property.type === filters.type;
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'inactive':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="properties-container">
      <div className="properties-header">
        <h1>Properties</h1>
        <Link to="/dashboard/properties/new" className="btn-primary">
          <FaPlus className="icon" /> Add New Property
        </Link>
      </div>

      <div className="properties-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search properties..."
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
          <label htmlFor="type-filter">Type:</label>
          <select
            id="type-filter"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="villa">Villa</option>
            <option value="townhouse">Townhouse</option>
            <option value="cabin">Cabin</option>
            <option value="penthouse">Penthouse</option>
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
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <button className="btn-secondary">
          <FaFilter className="icon" /> More Filters
        </button>
      </div>

      <div className="properties-stats">
        <div className="stat-card">
          <h3>{properties.length}</h3>
          <p>Total Properties</p>
        </div>
        <div className="stat-card">
          <h3>{properties.filter(p => p.status === 'active').length}</h3>
          <p>Active</p>
        </div>
        <div className="stat-card">
          <h3>{properties.filter(p => p.status === 'pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{properties.filter(p => p.featured).length}</h3>
          <p>Featured</p>
        </div>
      </div>

      <div className="properties-grid">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <div key={property.id} className="property-card">
              <div className="property-image">
                <img src={property.image} alt={property.title} />
                <div className={`status-badge ${getStatusBadgeClass(property.status)}`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
                {property.featured && <div className="featured-badge">Featured</div>}
                <div className="property-actions">
                  <button className="action-btn view-btn" title="View">
                    <FaEye />
                  </button>
                  <button className="action-btn edit-btn" title="Edit">
                    <FaEdit />
                  </button>
                  <button className="action-btn delete-btn" title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="property-details">
                <h3>{property.title}</h3>
                <p className="location">
                  <i className="fas fa-map-marker-alt"></i> {property.location}
                </p>
                <div className="property-meta">
                  <span><i className="fas fa-bed"></i> {property.bedrooms} Beds</span>
                  <span><i className="fas fa-bath"></i> {property.bathrooms} Baths</span>
                  <span><i className="fas fa-ruler-combined"></i> {property.area} sq.ft</span>
                </div>
                <div className="property-footer">
                  <div className="price">{formatPrice(property.price)}</div>
                  <div className="date">Listed: {formatDate(property.createdAt)}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No properties found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {filteredProperties.length > 0 && (
        <div className="pagination">
          <button className="pagination-btn" disabled>Previous</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <span className="pagination-ellipsis">...</span>
          <button className="pagination-btn">10</button>
          <button className="pagination-btn">Next</button>
        </div>
      )}
    </div>
  );
};

export default Properties;
