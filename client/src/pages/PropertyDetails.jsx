import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaShareAlt, FaHeart, FaChevronLeft, FaChevronRight, FaPhone, FaEnvelope, FaCalendarAlt, FaCheck } from 'react-icons/fa';
import { FiShare2, FiHeart } from 'react-icons/fi';

// Mock data - in a real app, this would come from an API
const propertyData = {
  id: 1,
  title: 'Luxury Villa in Karen',
  location: 'Karen, Nairobi',
  price: 45000000,
  type: 'sale',
  category: 'house',
  beds: 5,
  baths: 4,
  sqft: 4500,
  yearBuilt: 2018,
  garage: 2,
  description: 'This stunning luxury villa is located in the prestigious Karen neighborhood. Featuring modern architecture, high-end finishes, and breathtaking views, this property offers the ultimate in sophisticated living.',
  features: ['Swimming Pool', 'Garden', 'Security System', 'Backup Generator', 'Water Borehole'],
  amenities: ['Air Conditioning', 'Alarm System', 'Balcony', 'Cable TV', 'Fireplace', 'Gym', 'Laundry', 'Parking'],
  images: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ],
  agent: {
    id: 1,
    name: 'James Kariuki',
    title: 'Senior Real Estate Agent',
    phone: '+254 712 345 678',
    email: 'james@shiats3.com',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.9,
    properties: 47,
    experience: '8 years'
  },
  locationDescription: 'Located in the prestigious Karen neighborhood, this property is just minutes away from top international schools, shopping centers, and restaurants.'
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${propertyData.title}`,
    date: '',
    time: ''
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
      prev === propertyData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? propertyData.images.length - 1 : prev - 1
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry. We will contact you shortly!');
    setShowContactForm(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: propertyData.title,
          text: `Check out this ${propertyData.type === 'sale' ? 'property for sale' : 'rental property'}`,
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

  return (
    <div className="property-detail">
      {/* Header */}
      <div className="property-header">
        <div className="container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaChevronLeft /> Back to Results
          </button>
          
          <div className="property-header__top">
            <div>
              <h1>{propertyData.title}</h1>
              <p><FaMapMarkerAlt /> {propertyData.location}</p>
            </div>
            <div className="property-actions">
              <button className="button button--outline" onClick={handleShare}>
                <FiShare2 /> Share
              </button>
              <button 
                className={`button button--outline ${isFavorite ? 'active' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <FaHeart /> : <FiHeart />}
                {isFavorite ? ' Saved' : ' Save'}
              </button>
              <button 
                className="button button--primary"
                onClick={() => setShowContactForm(true)}
              >
                Contact Agent
              </button>
            </div>
          </div>
          
          <div className="property-meta">
            <div className="property-price">
              {formatPrice(propertyData.price)}
              {propertyData.type === 'rent' && <span>/month</span>}
            </div>
            
            <div className="property-stats">
              <div className="stat">
                <FaBed /> {propertyData.beds} Beds
              </div>
              <div className="stat">
                <FaBath /> {propertyData.baths} Baths
              </div>
              <div className="stat">
                <FaRulerCombined /> {propertyData.sqft.toLocaleString()} sqft
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="property-content">
          {/* Main Content */}
          <div className="property-main">
            {/* Image Gallery */}
            <div className="property-gallery">
              <div className="main-image">
                <img 
                  src={propertyData.images[currentImageIndex]} 
                  alt={propertyData.title}
                />
                
                {propertyData.images.length > 1 && (
                  <>
                    <button className="gallery-nav prev" onClick={prevImage}>
                      <FaChevronLeft />
                    </button>
                    <button className="gallery-nav next" onClick={nextImage}>
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>
              
              <div className="thumbnail-container">
                {propertyData.images.map((img, index) => (
                  <button 
                    key={index}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tabs */}
            <div className="property-tabs">
              <button 
                className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button 
                className={`tab ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Features
              </button>
              <button 
                className={`tab ${activeTab === 'location' ? 'active' : ''}`}
                onClick={() => setActiveTab('location')}
              >
                Location
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'details' && (
                <div className="tab-pane">
                  <h2>Property Details</h2>
                  <p>{propertyData.description}</p>
                  
                  <div className="property-details-grid">
                    <div className="detail-item">
                      <span>Property ID:</span>
                      <strong>PROP-{propertyData.id}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Property Type:</span>
                      <strong>{propertyData.category}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Year Built:</span>
                      <strong>{propertyData.yearBuilt}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Garage:</span>
                      <strong>{propertyData.garage} cars</strong>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'features' && (
                <div className="tab-pane">
                  <h2>Features & Amenities</h2>
                  <div className="amenities-grid">
                    {propertyData.amenities.map((item, index) => (
                      <div key={index} className="amenity-item">
                        <FaCheck /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'location' && (
                <div className="tab-pane">
                  <h2>Location</h2>
                  <p>{propertyData.locationDescription}</p>
                  <div className="map-container">
                    {/* Map would be integrated here */}
                    <div className="map-placeholder">
                      Map would be displayed here
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <aside className="property-sidebar">
            {/* Contact Agent */}
            <div className="sidebar-widget">
              <h3>Contact Agent</h3>
              <div className="agent-card">
                <div className="agent-avatar">
                  <img src={propertyData.agent.image} alt={propertyData.agent.name} />
                </div>
                <div className="agent-info">
                  <h4>{propertyData.agent.name}</h4>
                  <p>{propertyData.agent.title}</p>
                  <div className="agent-rating">
                    <span>★ {propertyData.agent.rating}</span>
                    <span>({propertyData.agent.properties} properties)</span>
                  </div>
                </div>
                
                <div className="agent-contact">
                  <a href={`tel:${propertyData.agent.phone}`}>
                    <FaPhone /> {propertyData.agent.phone}
                  </a>
                  <a href={`mailto:${propertyData.agent.email}`}>
                    <FaEnvelope /> {propertyData.agent.email}
                  </a>
                </div>
                
                <button 
                  className="button button--primary button--block"
                  onClick={() => setShowContactForm(true)}
                >
                  Contact Agent
                </button>
              </div>
            </div>
            
            {/* Schedule a Tour */}
            <div className="sidebar-widget">
              <h3>Schedule a Tour</h3>
              <div className="tour-widget">
                <p>Arrange a viewing at your convenience.</p>
                <button 
                  className="button button--primary button--block"
                  onClick={() => setShowContactForm(true)}
                >
                  <FaCalendarAlt /> Schedule a Viewing
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Contact Agent</h3>
              <button 
                className="modal-close"
                onClick={() => setShowContactForm(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <button type="submit" className="button button--primary button--block">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
