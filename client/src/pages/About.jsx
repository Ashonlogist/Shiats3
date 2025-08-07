import React from 'react';
import { FaBuilding, FaUsers, FaHandshake, FaGlobeAfrica } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>About Shiats3</h1>
          <p className="subtitle">Rooted in Culture. Driven by Trust.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Story</h2>
            <div className="divider"></div>
          </div>
          
          <div className="about-content">
            <div className="about-text">
              <p>
                Founded in 2023, Shiats3 has quickly become a leading real estate and hospitality platform in Africa. 
                Our mission is to connect people with their dream properties while celebrating the rich cultural 
                heritage of the African continent.
              </p>
              <p>
                What started as a small team with a shared vision has grown into a trusted name in the industry, 
                known for our integrity, professionalism, and deep understanding of local markets.
              </p>
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
            <div className="value-card">
              <div className="value-icon">
                <FaBuilding />
              </div>
              <h3>Integrity</h3>
              <p>We believe in transparency and honesty in all our dealings, building trust with our clients and partners.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <FaUsers />
              </div>
              <h3>Community</h3>
              <p>We're committed to creating value for the communities we serve, not just our clients.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <FaHandshake />
              </div>
              <h3>Excellence</h3>
              <p>We strive for the highest standards in everything we do, from property selection to customer service.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <FaGlobeAfrica />
              </div>
              <h3>Cultural Pride</h3>
              <p>We celebrate and promote African culture through our work and partnerships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <div className="divider"></div>
            <p className="section-description">The people behind Shiats3's success</p>
          </div>
          
          <div className="team-grid">
            {[
              {
                name: 'John Doe',
                role: 'CEO & Founder',
                image: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              {
                name: 'Jane Smith',
                role: 'Head of Sales',
                image: 'https://randomuser.me/api/portraits/women/44.jpg'
              },
              {
                name: 'David Omondi',
                role: 'Property Manager',
                image: 'https://randomuser.me/api/portraits/men/22.jpg'
              },
              {
                name: 'Amina Ndirangu',
                role: 'Customer Relations',
                image: 'https://randomuser.me/api/portraits/women/63.jpg'
              }
            ].map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
