import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaBed, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaSnowflake, FaDumbbell, FaSpa, FaTv, FaWheelchair, FaChevronLeft, FaChevronRight, FaShareAlt, FaHeart } from 'react-icons/fa';
import { FiShare2, FiHeart } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Mock data - in a real app, this would come from an API
const hotelData = {
  id: 1,
  name: 'Serena Beach Resort',
  location: 'Mombasa',
  address: 'Nyali Road, Mombasa, Kenya',
  price: 25000,
  rating: 4.8,
  reviews: 124,
  stars: 5,
  description: 'Experience luxury and comfort at Serena Beach Resort, a 5-star beachfront property offering world-class amenities and breathtaking views of the Indian Ocean.',
  amenities: [
    { id: 'wifi', name: 'Free WiFi', icon: <FaWifi /> },
    { id: 'pool', name: 'Swimming Pool', icon: <FaSwimmingPool /> },
    { id: 'restaurant', name: 'Restaurant', icon: <FaUtensils /> },
    { id: 'parking', name: 'Free Parking', icon: <FaParking /> },
    { id: 'ac', name: 'Air Conditioning', icon: <FaSnowflake /> },
    { id: 'gym', name: 'Fitness Center', icon: <FaDumbbell /> },
    { id: 'spa', name: 'Spa & Wellness', icon: <FaSpa /> },
    { id: 'tv', name: 'Cable TV', icon: <FaTv /> },
    { id: 'accessible', name: 'Accessible', icon: <FaWheelchair /> }
  ],
  images: [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ],
  rooms: [
    {
      id: 1,
      name: 'Deluxe Ocean View Room',
      description: 'Spacious room with a king-size bed and stunning ocean views.',
      maxGuests: 2,
      size: '45 m²',
      bedType: '1 King Bed',
      price: 25000,
      refundable: true,
      breakfastIncluded: true,
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      ]
    },
    {
      id: 2,
      name: 'Family Suite',
      description: 'Perfect for families with a master bedroom and living area.',
      maxGuests: 4,
      size: '75 m²',
      bedType: '1 King Bed + 1 Sofa Bed',
      price: 38000,
      refundable: true,
      breakfastIncluded: true,
      images: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      ]
    }
  ],
  policies: {
    checkIn: '2:00 PM',
    checkOut: '11:00 AM',
    cancellation: 'Free cancellation up to 7 days before check-in',
    children: 'Children of all ages are welcome',
    pets: 'Pets are not allowed',
    payment: 'Credit card required at check-in',
    taxes: 'All prices include 16% VAT and 2% tourism levy'
  }
};

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: null,
    checkOut: null,
    adults: 2,
    children: 0,
    rooms: 1,
    specialRequests: ''
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === hotelData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? hotelData.images.length - 1 : prev - 1
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: parseInt(value) || value
    }));
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setBookingData(prev => ({
      ...prev,
      checkIn: start,
      checkOut: end
    }));
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    alert('Your booking has been confirmed! A confirmation has been sent to your email.');
    setShowBookingForm(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: hotelData.name,
          text: `Check out ${hotelData.name} on Shiats3 - ${hotelData.rating}★`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={`star ${i < rating ? 'star--filled' : 'star--empty'}`} 
      />
    ));
  };

  return (
    <div className="hotel-detail">
      {/* Header */}
      <div className="hotel-header">
        <div className="container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaChevronLeft /> Back to Results
          </button>
          
          <div className="hotel-header__top">
            <div>
              <h1>{hotelData.name}</h1>
              <div className="hotel-location">
                <FaMapMarkerAlt /> {hotelData.location}, {hotelData.address}
              </div>
              <div className="hotel-rating">
                <div className="stars">
                  {renderStars(hotelData.stars)}
                </div>
                <span>{hotelData.rating} ({hotelData.reviews} reviews)</span>
              </div>
            </div>
            <div className="hotel-actions">
              <button 
                className="button button--outline"
                onClick={handleShare}
              >
                <FiShare2 /> Share
              </button>
              <button 
                className={`button button--outline ${isFavorite ? 'active' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <FaHeart /> : <FiHeart />}
                {isFavorite ? ' Saved' : ' Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="hotel-gallery">
        <div className="main-image">
          <img 
            src={hotelData.images[currentImageIndex]} 
            alt={hotelData.name}
          />
          
          {hotelData.images.length > 1 && (
            <>
              <button className="gallery-nav prev" onClick={prevImage}>
                <FaChevronLeft />
              </button>
              <button className="gallery-nav next" onClick={nextImage}>
                <FaChevronRight />
              </button>
              
              <div className="gallery-indicators">
                {hotelData.images.map((_, index) => (
                  <button 
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="thumbnail-container">
          {hotelData.images.slice(0, 4).map((img, index) => (
            <button 
              key={index}
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img src={img} alt="" />
              {index === 3 && hotelData.images.length > 4 && (
                <div className="thumbnail-overlay">
                  +{hotelData.images.length - 4} more
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="container">
        <div className="hotel-content">
          {/* Main Content */}
          <div className="hotel-main">
            {/* Tabs */}
            <div className="hotel-tabs">
              <button 
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab ${activeTab === 'rooms' ? 'active' : ''}`}
                onClick={() => setActiveTab('rooms')}
              >
                Rooms & Rates
              </button>
              <button 
                className={`tab ${activeTab === 'amenities' ? 'active' : ''}`}
                onClick={() => setActiveTab('amenities')}
              >
                Amenities
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="tab-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="tab-pane">
                  <h2>About {hotelData.name}</h2>
                  <p>{hotelData.description}</p>
                  
                  <div className="highlighted-amenities">
                    <h3>Top Amenities</h3>
                    <div className="amenities-grid">
                      {hotelData.amenities.slice(0, 6).map((amenity, index) => (
                        <div key={index} className="amenity-item">
                          <span className="amenity-icon">{amenity.icon}</span>
                          <span>{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Rooms Tab */}
              {activeTab === 'rooms' && (
                <div className="tab-pane">
                  <div className="booking-widget">
                    <h3>Check Availability</h3>
                    <div className="booking-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Check-in</label>
                          <DatePicker
                            selected={bookingData.checkIn}
                            onChange={handleDateChange}
                            startDate={bookingData.checkIn}
                            endDate={bookingData.checkOut}
                            selectsRange
                            minDate={new Date()}
                            placeholderText="Select dates"
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Check-out</label>
                          <DatePicker
                            selected={bookingData.checkOut}
                            onChange={handleDateChange}
                            startDate={bookingData.checkIn}
                            endDate={bookingData.checkOut}
                            selectsRange
                            minDate={bookingData.checkIn || new Date()}
                            placeholderText="Select dates"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Adults</label>
                          <select 
                            name="adults" 
                            className="form-control"
                            value={bookingData.adults}
                            onChange={handleInputChange}
                          >
                            {[1, 2, 3, 4].map(num => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? 'Adult' : 'Adults'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Children</label>
                          <select 
                            name="children" 
                            className="form-control"
                            value={bookingData.children}
                            onChange={handleInputChange}
                          >
                            {[0, 1, 2, 3].map(num => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? 'Child' : 'Children'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button 
                        className="button button--primary button--block"
                        onClick={() => setShowBookingForm(true)}
                      >
                        Check Availability
                      </button>
                    </div>
                  </div>
                  
                  <div className="rooms-list">
                    <h3>Available Rooms</h3>
                    {hotelData.rooms.map(room => (
                      <div key={room.id} className="room-card">
                        <div className="room-image">
                          <img src={room.images[0]} alt={room.name} />
                        </div>
                        <div className="room-content">
                          <h4>{room.name}</h4>
                          <p>{room.description}</p>
                          
                          <div className="room-features">
                            <div className="feature">
                              <FaBed /> {room.bedType}
                            </div>
                            <div className="feature">
                              <FaRulerCombined /> {room.size}
                            </div>
                            <div className="feature">
                              👥 Max {room.maxGuests} {room.maxGuests === 1 ? 'guest' : 'guests'}
                            </div>
                            {room.breakfastIncluded && (
                              <div className="feature">
                                🍳 Breakfast included
                              </div>
                            )}
                          </div>
                          
                          <div className="room-actions">
                            <div className="room-price">
                              <span className="price">{formatPrice(room.price)}</span>
                              <span className="period">per night</span>
                            </div>
                            <button 
                              className="button button--primary"
                              onClick={() => handleSelectRoom(room)}
                            >
                              Select Room
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Amenities Tab */}
              {activeTab === 'amenities' && (
                <div className="tab-pane">
                  <h2>Hotel Amenities</h2>
                  <div className="amenities-grid">
                    {hotelData.amenities.map((amenity, index) => (
                      <div key={index} className="amenity-item">
                        <span className="amenity-icon">{amenity.icon}</span>
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <aside className="hotel-sidebar">
            {/* Quick Booking */}
            <div className="sidebar-widget">
              <h3>Book Your Stay</h3>
              <div className="booking-widget">
                <div className="price-display">
                  <span className="price">{formatPrice(hotelData.price)}</span>
                  <span className="period">per night</span>
                  <span className="taxes">{hotelData.policies.taxes}</span>
                </div>
                
                <form className="quick-booking-form" onSubmit={handleBookingSubmit}>
                  <div className="form-group">
                    <label>Check-in</label>
                    <DatePicker
                      selected={bookingData.checkIn}
                      onChange={handleDateChange}
                      startDate={bookingData.checkIn}
                      endDate={bookingData.checkOut}
                      selectsRange
                      minDate={new Date()}
                      placeholderText="Check-in date"
                      className="form-control"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Check-out</label>
                    <DatePicker
                      selected={bookingData.checkOut}
                      onChange={handleDateChange}
                      startDate={bookingData.checkIn}
                      endDate={bookingData.checkOut}
                      selectsRange
                      minDate={bookingData.checkIn || new Date()}
                      placeholderText="Check-out date"
                      className="form-control"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Adults</label>
                      <select 
                        name="adults" 
                        className="form-control"
                        value={bookingData.adults}
                        onChange={handleInputChange}
                        required
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Children</label>
                      <select 
                        name="children" 
                        className="form-control"
                        value={bookingData.children}
                        onChange={handleInputChange}
                      >
                        {[0, 1, 2, 3].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Rooms</label>
                    <select 
                      name="rooms" 
                      className="form-control"
                      value={bookingData.rooms}
                      onChange={handleInputChange}
                      required
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button type="submit" className="button button--primary button--block">
                    Book Now
                  </button>
                </form>
                
                <div className="cancellation-policy">
                  <p>🎯 {hotelData.policies.cancellation}</p>
                  <p>🔒 Best price guarantee</p>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="sidebar-widget">
              <h3>Contact Information</h3>
              <div className="contact-info">
                <p>📍 {hotelData.address}</p>
                <p>📞 +254 20 123 4567</p>
                <p>✉️ info@serenabeach.com</p>
                
                <div className="social-links">
                  <a href="#" className="social-link" aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="TripAdvisor">
                    <i className="fab fa-tripadvisor"></i>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      {/* Booking Modal */}
      {showBookingForm && selectedRoom && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Complete Your Booking</h3>
              <button 
                className="modal-close"
                onClick={() => setShowBookingForm(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="booking-summary">
                <h4>{selectedRoom.name}</h4>
                <p>{selectedRoom.description}</p>
                
                <div className="booking-details">
                  <div className="detail-row">
                    <span>Check-in:</span>
                    <strong>
                      {bookingData.checkIn ? 
                        bookingData.checkIn.toLocaleDateString() : 
                        'Select dates'}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Check-out:</span>
                    <strong>
                      {bookingData.checkOut ? 
                        bookingData.checkOut.toLocaleDateString() : 
                        'Select dates'}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Guests:</span>
                    <strong>
                      {bookingData.adults} {bookingData.adults === 1 ? 'Adult' : 'Adults'}
                      {bookingData.children > 0 && 
                        `, ${bookingData.children} ${bookingData.children === 1 ? 'Child' : 'Children'}`}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Rooms:</span>
                    <strong>{bookingData.rooms}</strong>
                  </div>
                </div>
                
                <div className="price-summary">
                  <div className="price-row">
                    <span>{formatPrice(selectedRoom.price)} x {bookingData.rooms} room x 1 night</span>
                    <span>{formatPrice(selectedRoom.price * bookingData.rooms)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total (incl. taxes)</span>
                    <span>{formatPrice(selectedRoom.price * bookingData.rooms * 1.18)}</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="booking-form">
                <h4>Guest Information</h4>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email" 
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone *</label>
                    <input 
                      type="tel" 
                      className="form-control"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Special Requests (Optional)</label>
                  <textarea 
                    className="form-control"
                    rows="3"
                    placeholder="Any special requests?"
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="button button--outline"
                    onClick={() => setShowBookingForm(false)}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="button button--primary"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetail;
