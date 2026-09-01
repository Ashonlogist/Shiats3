import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBuilding, FaLayerGroup, FaCalendarAlt, FaChevronLeft, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { FiShare2, FiHeart } from 'react-icons/fi';
import './PortfolioDetail.css';

const project = {
  id: 1,
  title: 'Karen Skyline Villas',
  location: 'Karen, Nairobi',
  date: '2024-06-15',
  status: 'Ongoing',
  category: 'Residential',
  units: '24 Villas',
  area: '12 Acres',
  image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  excerpt: 'A gated community of 24 luxury villas with private gardens, a clubhouse and 24/7 security, set on 12 acres of landscaped grounds.',
  content: `
    <p>Karen Skyline Villas is our flagship residential development, set in one of Nairobi's most prestigious neighbourhoods. The community combines contemporary architecture with serene landscaped grounds to create a truly elevated living experience.</p>

    <h2>Design &amp; Architecture</h2>
    <p>Each villa has been designed by award-winning architects to maximise natural light and indoor-outdoor living. Open-plan living areas, double-volume ceilings and private gardens are standard across all units.</p>

    <h2>Community Amenities</h2>
    <p>Residents enjoy access to a modern clubhouse, a fitness centre, a swimming pool and secure children's play areas. Security is a priority with gated access, perimeter fencing and round-the-clock guard patrols.</p>

    <h2>Sustainability</h2>
    <p>The development incorporates solar water heating, rainwater harvesting and energy-efficient fixtures, reducing the environmental footprint and utility costs for residents.</p>

    <h2>Location</h2>
    <p>Located within minutes of top international schools, Karen Country Club, shopping centres and hospitals, the villas offer both convenience and tranquillity.</p>
  `,
  features: ['Gated community with 24/7 security', 'Private gardens and parking', 'Clubhouse, gym and pool', 'Solar water heating', 'Serviced roads and fibre internet'],
  gallery: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ],
  tags: ['luxury villas', 'gated community', 'nairobi'],
  relatedProjects: [
    {
      id: 2,
      title: 'Westlands Corporate Tower',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      location: 'Westlands, Nairobi'
    },
    {
      id: 3,
      title: 'Diani Palm Residences',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      location: 'Diani, Mombasa'
    }
  ]
};

const PortfolioDetail = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: project.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Project link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="portfolio-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/portfolio">Portfolio</Link>
          <span className="breadcrumb-separator">/</span>
          <span>{project.title}</span>
        </div>

        <div className="post-article">
          {/* Header */}
          <header className="post-header">
            <h1>{project.title}</h1>
            <div className="post-meta">
              <span><FaMapMarkerAlt /> {project.location}</span>
              <span><FaCalendarAlt /> {project.date}</span>
              <span><FaBuilding /> {project.units}</span>
              <span><FaLayerGroup /> {project.area}</span>
              <span className="tag">{project.status}</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="featured-image">
            <img src={project.image} alt={project.title} />
          </div>

          <div className="post-content">
            {/* Main Content */}
            <main className="post-body">
              <div dangerouslySetInnerHTML={{ __html: project.content }} />

              <h2>Key Features</h2>
              <ul>
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              <h2>Project Gallery</h2>
              <div className="gallery-grid">
                {project.gallery.map((img, index) => (
                  <img key={index} src={img} alt={`${project.title} gallery ${index + 1}`} />
                ))}
              </div>
            </main>

            {/* Sidebar */}
            <aside className="post-sidebar">
              <div className="sidebar-widget">
                <h3 className="widget-title">Project Summary</h3>
                <ul className="post-tags">
                  <li><FaCalendarAlt /> Completed</li>
                  <li>{project.units}</li>
                  <li>{project.area}</li>
                </ul>
                <p>{project.excerpt}</p>
              </div>

              <div className="sidebar-widget">
                <h3 className="widget-title">Get Project Details</h3>
                <p>Contact our development team for pricing, floor plans and availability.</p>
                <a className="contact-cta" href="tel:+254712345678"><FaPhoneAlt /> +254 712 345 678</a>
                <a className="contact-cta" href="mailto:developments@2pjreality.com"><FaEnvelope /> developments@2pjreality.com</a>
              </div>

              <div className="sidebar-widget">
                <h3 className="widget-title">Related Projects</h3>
                <div className="related-posts">
                  {project.relatedProjects.map((related) => (
                    <div key={related.id} className="related-post">
                      <img src={related.image} alt={related.title} />
                      <div className="related-post-content">
                        <h4><Link to={`/portfolio/${related.id}`}>{related.title}</Link></h4>
                        <span>{related.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;