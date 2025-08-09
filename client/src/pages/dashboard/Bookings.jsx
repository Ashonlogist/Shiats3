import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaUser, 
  FaHotel, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaEllipsisV,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload
} from 'react-icons/fa';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'newest'
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockBookings = [
          {
            id: 'BK-1001',
            guest: 'John Doe',
            email: 'john@example.com',
            property: 'Luxury Villa with Ocean View',
            propertyId: 'PR-1001',
            checkIn: '2023-08-15',
            checkOut: '2023-08-22',
            guests: 4,
            totalAmount: 2800,
            status: 'confirmed',
            bookingDate: '2023-07-10T14:30:00Z',
            paymentStatus: 'paid'
          },
          {
            id: 'BK-1002',
            guest: 'Jane Smith',
            email: 'jane@example.com',
            property: 'Modern Downtown Apartment',
            propertyId: 'PR-1002',
            checkIn: '2023-08-20',
            checkOut: '2023-08-25',
            guests: 2,
            totalAmount: 1250,
            status: 'pending',
            bookingDate: '2023-07-15T10:15:00Z',
            paymentStatus: 'pending'
          },
          {
            id: 'BK-1003',
            guest: 'Robert Johnson',
            email: 'robert@example.com',
            property: 'Cozy Mountain Cabin',
            propertyId: 'PR-1003',
            checkIn: '2023-09-05',
            checkOut: '2023-09-12',
            guests: 6,
            totalAmount: 2100,
            status: 'cancelled',
            bookingDate: '2023-07-05T16:45:00Z',
            paymentStatus: 'refunded'
          },
          {
            id: 'BK-1004',
            guest: 'Emily Davis',
            email: 'emily@example.com',
            property: 'Beachfront Condo',
            propertyId: 'PR-1004',
            checkIn: '2023-08-25',
            checkOut: '2023-09-01',
            guests: 3,
            totalAmount: 1750,
            status: 'completed',
            bookingDate: '2023-06-28T11:20:00Z',
            paymentStatus: 'paid'
          },
          {
            id: 'BK-1005',
            guest: 'Michael Wilson',
            email: 'michael@example.com',
            property: 'Historic Townhouse',
            propertyId: 'PR-1005',
            checkIn: '2023-09-10',
            checkOut: '2023-09-17',
            guests: 5,
            totalAmount: 2300,
            status: 'confirmed',
            bookingDate: '2023-07-18T09:30:00Z',
            paymentStatus: 'paid'
          },
          {
            id: 'BK-1006',
            guest: 'Sarah Brown',
            email: 'sarah@example.com',
            property: 'Luxury Penthouse',
            propertyId: 'PR-1006',
            checkIn: '2023-08-30',
            checkOut: '2023-09-06',
            guests: 4,
            totalAmount: 3500,
            status: 'pending',
            bookingDate: '2023-07-20T15:10:00Z',
            paymentStatus: 'pending'
          }
        ];

        setBookings(mockBookings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || booking.status === filters.status;
      
      // Date range filtering (simplified)
      const today = new Date();
      const checkInDate = new Date(booking.checkIn);
      let matchesDateRange = true;
      
      if (filters.dateRange === 'today') {
        matchesDateRange = 
          checkInDate.toDateString() === today.toDateString();
      } else if (filters.dateRange === 'upcoming') {
        matchesDateRange = checkInDate > today;
      } else if (filters.dateRange === 'past') {
        matchesDateRange = checkInDate < today;
      }
      
      return matchesSearch && matchesStatus && matchesDateRange;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'newest') return new Date(b.bookingDate) - new Date(a.bookingDate);
      if (filters.sortBy === 'oldest') return new Date(a.bookingDate) - new Date(b.bookingDate);
      if (filters.sortBy === 'checkin-asc') return new Date(a.checkIn) - new Date(b.checkIn);
      if (filters.sortBy === 'checkin-desc') return new Date(b.checkIn) - new Date(a.checkIn);
      if (filters.sortBy === 'amount-asc') return a.totalAmount - b.totalAmount;
      if (filters.sortBy === 'amount-desc') return b.totalAmount - a.totalAmount;
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
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  // Get payment status class
  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'payment-paid';
      case 'pending':
        return 'payment-pending';
      case 'refunded':
        return 'payment-refunded';
      case 'failed':
        return 'payment-failed';
      default:
        return 'payment-default';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get booking statistics
  const getBookingStats = () => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const revenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    return { totalBookings, confirmedBookings, pendingBookings, revenue };
  };

  const stats = getBookingStats();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>Bookings</h1>
        <div className="header-actions">
          <button className="btn btn-export">
            <FaDownload className="icon" /> Export
          </button>
          <Link to="/dashboard/bookings/new" className="btn btn-primary">
            + New Booking
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="booking-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaCalendarAlt />
          </div>
          <div className="stat-details">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon confirmed">
            <FaCheckCircle />
          </div>
          <div className="stat-details">
            <h3>{stats.confirmedBookings}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaClock />
          </div>
          <div className="stat-details">
            <h3>{stats.pendingBookings}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div className="stat-details">
            <h3>{formatCurrency(stats.revenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bookings-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search bookings..."
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
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="date-range">Date Range:</label>
          <select
            id="date-range"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
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
            <option value="checkin-asc">Check-in (Earliest)</option>
            <option value="checkin-desc">Check-in (Latest)</option>
            <option value="amount-asc">Amount (Low to High)</option>
            <option value="amount-desc">Amount (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bookings-table-container">
        {filteredBookings.length > 0 ? (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest</th>
                <th>Property</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td className="booking-id">
                    <Link to={`/dashboard/bookings/${booking.id}`}>
                      {booking.id}
                    </Link>
                  </td>
                  <td className="guest-info">
                    <div className="guest-name">{booking.guest}</div>
                    <div className="guest-email">{booking.email}</div>
                  </td>
                  <td className="property-info">
                    <div className="property-name">
                      <FaHotel className="property-icon" />
                      {booking.property}
                    </div>
                  </td>
                  <td className="date-cell">
                    <div className="date">{formatDate(booking.checkIn)}</div>
                  </td>
                  <td className="date-cell">
                    <div className="date">{formatDate(booking.checkOut)}</div>
                  </td>
                  <td className="guests">
                    <FaUser className="guest-icon" /> {booking.guests}
                  </td>
                  <td className="amount">
                    {formatCurrency(booking.totalAmount)}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-status ${getPaymentStatusClass(booking.paymentStatus)}`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="actions">
                    <div className="dropdown">
                      <button className="dropdown-toggle">
                        <FaEllipsisV />
                      </button>
                      <div className="dropdown-menu">
                        <button className="dropdown-item">
                          <FaEye className="icon" /> View
                        </button>
                        <button className="dropdown-item">
                          <FaEdit className="icon" /> Edit
                        </button>
                        <button className="dropdown-item text-danger">
                          <FaTrash className="icon" /> Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <h3>No bookings found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredBookings.length > 0 && (
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

export default Bookings;
