import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaCheck } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitted(false);
    }, 5000);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: 'Our Location',
      description: 'Westlands, Nairobi, Kenya',
      link: 'https://maps.google.com',
      linkText: 'View on Map'
    },
    {
      icon: <FaPhone />,
      title: 'Phone Number',
      description: '+254 700 000000',
      link: 'tel:+254700000000',
      linkText: 'Call Now'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email Address',
      description: 'info@shiats3.com',
      link: 'mailto:info@shiats3.com',
      linkText: 'Send Email'
    },
    {
      icon: <FaClock />,
      title: 'Working Hours',
      description: 'Mon - Fri: 8:00 AM - 6:00 PM',
      details: 'Saturday: 9:00 AM - 4:00 PM',
      details2: 'Sunday: Closed'
    }
  ];

  const faqItems = [
    {
      question: 'How can I schedule a property viewing?',
      answer: 'You can schedule a viewing by filling out the contact form, calling our office, or using the "Schedule a Viewing" button on any property listing.'
    },
    {
      question: 'What areas do you serve?',
      answer: 'We primarily serve major cities across Africa including Nairobi, Lagos, Cape Town, and Accra. However, we can assist with properties throughout the continent.'
    },
    {
      question: 'What are your fees for property sales?',
      answer: 'Our commission rates vary depending on the property value and type. Please contact us for a personalized quote based on your specific needs.'
    },
    {
      question: 'Do you offer property management services?',
      answer: 'Yes, we provide comprehensive property management services for both residential and commercial properties, including tenant screening, rent collection, and maintenance coordination.'
    },
    {
      question: 'How can I list my property with Shiats3?',
      answer: 'To list your property, you can call our office, visit us in person, or use the "List Your Property" form on our website. One of our agents will guide you through the process.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with our team today.</p>
        </div>
      </section>

      <div className="container">
        <div className="contact-container">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p className="contact-intro">
              Have questions about our properties or services? Fill out the form and our team will get back to you as soon as possible.
            </p>
            
            <div className="contact-methods">
              {contactInfo.map((item, index) => (
                <div key={index} className="contact-method">
                  <div className="contact-icon">{item.icon}</div>
                  <div className="contact-details">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.details && <p>{item.details}</p>}
                    {item.details2 && <p>{item.details2}</p>}
                    {item.link && (
                      <a href={item.link} className="contact-link">
                        {item.linkText}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
                <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
                <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
                <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <div className="form-tabs">
              <button 
                className={`tab ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                General Inquiry
              </button>
              <button 
                className={`tab ${activeTab === 'viewing' ? 'active' : ''}`}
                onClick={() => setActiveTab('viewing')}
              >
                Schedule Viewing
              </button>
              <button 
                className={`tab ${activeTab === 'support' ? 'active' : ''}`}
                onClick={() => setActiveTab('support')}
              >
                Customer Support
              </button>
            </div>

            {isSubmitted ? (
              <div className="form-success">
                <div className="success-icon">
                  <FaCheck />
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {activeTab === 'viewing' && (
                  <div className="form-group">
                    <label>Preferred Viewing Date & Time</label>
                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="date"
                          name="viewingDate"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="form-group">
                        <select name="viewingTime" defaultValue="">
                          <option value="" disabled>Select Time</option>
                          <option value="09:00">09:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="14:00">02:00 PM</option>
                          <option value="15:00">03:00 PM</option>
                          <option value="16:00">04:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="submit-button">
                  <FaPaperPlane /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about our services and processes.</p>
          </div>
          
          <div className="faq-container">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="map-container">
        <iframe
          title="Our Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819818040403!2d36.81521531533075!3d-1.2826856359753392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d9c1a2e1c9%3A0x9e5c3c4d4d5d6e6f!2sWestlands%2C%20Nairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
