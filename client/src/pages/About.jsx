import React from 'react';
import { FaBuilding, FaUsers, FaHandshake, FaGlobeAfrica, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import './About.css';

const iconMap = {
  building: <FaBuilding />,
  users: <FaUsers />,
  handshake: <FaHandshake />,
  globe: <FaGlobeAfrica />,
};

const About = () => {
  const { content } = useContent();
  const about = content.about;
  const brand = content.brand;

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>{about.heroTitle || `About ${brand.name}`}</h1>
          <p className="subtitle">{brand.tagline}</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>{about.headline || 'Our Story'}</h2>
            <div className="divider"></div>
          </div>

          <div className="about-content">
            <div className="about-text">
              {(about.story && about.story.length ? about.story : []).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Our Team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section section--gray">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <div className="divider"></div>
            <p className="section-description">These principles guide everything we do</p>
          </div>

          <div className="values-grid">
            {(about.valueCards && about.valueCards.length ? about.valueCards : []).map((card, i) => (
              <div key={i} className="value-card">
                <div className="value-icon">
                  {iconMap[card.icon] || <FaBuilding />}
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <div className="divider"></div>
            <p className="section-description">The people behind {brand.name}'s success</p>
          </div>

          <div className="team-grid">
            {(about.team && about.team.length ? about.team : []).map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-image">
                  <img src={member.image || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Locations */}
      {about.contact && (
        <section className="section section--gray">
          <div className="container">
            <div className="section-header">
              <h2>Get In Touch</h2>
              <div className="divider"></div>
              <p className="section-description">We're here to help with all your real estate and hospitality needs</p>
            </div>

            <div className="contact-cards">
              {about.contact.phone && (
                <div className="contact-card">
                  <div className="contact-card__icon"><FaPhone /></div>
                  <h3>Call Us</h3>
                  <a href={`tel:${about.contact.phone.replace(/[^+\d]/g, '')}`}>{about.contact.phone}</a>
                </div>
              )}
              {about.contact.email && (
                <div className="contact-card">
                  <div className="contact-card__icon"><FaEnvelope /></div>
                  <h3>Email Us</h3>
                  <a href={`mailto:${about.contact.email}`}>{about.contact.email}</a>
                </div>
              )}
              {about.contact.location && (
                <div className="contact-card">
                  <div className="contact-card__icon"><FaMapMarkerAlt /></div>
                  <h3>Visit Us</h3>
                  <span>{about.contact.location}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="section section--cta">
        <div className="container">
          <h2>Ready to find your dream property?</h2>
          <p>Explore our listings or get in touch with our team today.</p>
          <div className="cta-buttons">
            <Link to="/properties" className="button button--primary">View Properties</Link>
            <Link to="/contact" className="button button--outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;