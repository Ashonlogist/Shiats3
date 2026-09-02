import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBuilding, FaLayerGroup, FaCalendarAlt, FaChevronRight, FaChevronLeft, FaPhoneAlt } from 'react-icons/fa';
import { FiShare2, FiHeart, FiMessageSquare } from 'react-icons/fi';
import './Portfolio.css';

// Portfolio projects - showcase of the developer's residential and commercial developments
const projects = [
  {
    id: 1,
    title: 'East Legon Skyline Villas',
    location: 'East Legon, Accra',
    excerpt: 'A gated community of 24 luxury villas with private gardens, a clubhouse and 24/7 security, set on 12 acres of landscaped grounds.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2024-06-15',
    category: 'Residential',
    units: '24 Villas',
    area: '12 Acres',
    status: 'Ongoing',
    tags: ['luxury villas', 'gated community', 'accra']
  },
  {
    id: 2,
    title: 'Ridge Corporate Tower',
    location: 'Ridge, Accra',
    excerpt: 'A 12-storey Grade-A office building with smart building technology, rooftop gardens and ample parking for 400 vehicles.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2024-03-28',
    category: 'Commercial',
    units: '12 Storeys',
    area: '85,000 sqft',
    status: 'Completed',
    tags: ['office space', 'commercial', 'green building']
  },
  {
    id: 3,
    title: 'Labadi Palm Residences',
    location: 'Labadi, Accra',
    excerpt: 'Beachfront apartments and penthouses with panoramic Gulf of Guinea views, infinity pool and direct beach access.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2024-01-10',
    category: 'Hospitality',
    units: '48 Units',
    area: '6 Acres',
    status: 'Ongoing',
    tags: ['beachfront', 'apartments', 'hospitality']
  },
  {
    id: 4,
    title: 'Spintex Upmarket Court',
    location: 'Spintex, Accra',
    excerpt: 'Modern 2 and 3 bedroom apartments with elegant finishes, a fitness centre and a rooftop lounge in a fast-growing corridor.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-12-05',
    category: 'Residential',
    units: '120 Units',
    area: '3 Acres',
    status: 'Completed',
    tags: ['apartments', 'modern living', 'accra']
  },
  {
    id: 5,
    title: 'Tema Freezone Industrial Park',
    location: 'Tema, Greater Accra',
    excerpt: 'Warehousing and light manufacturing park with serviced plots, reliable utilities and direct access to the Tema Motorway.',
    image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-09-22',
    category: 'Commercial',
    units: '60 Plots',
    area: '40 Acres',
    status: 'Completed',
    tags: ['industrial', 'warehousing', 'investment']
  },
  {
    id: 6,
    title: 'Aburi Highland Cottages',
    location: 'Aburi, Eastern Region',
    excerpt: 'Country cottages overlooking the Aburi hills with solar power, rainwater harvesting and expansive gardens for weekend getaways.',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-06-18',
    category: 'Residential',
    units: '16 Cottages',
    area: '20 Acres',
    status: 'Ongoing',
    tags: ['country homes', 'sustainability', 'getaways']
  },
  {
    id: 7,
    title: 'Accra CBD Gateway Plaza',
    location: 'Accra Central',
    excerpt: 'Retail and hospitality centre in the heart of the city with ground-floor shops, restaurants, and serviced hotel suites.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-04-10',
    category: 'Hospitality',
    units: '250,000 sqft',
    area: '1.5 Acres',
    status: 'Completed',
    tags: ['retail', 'hospitality', 'city centre']
  },
  {
    id: 8,
    title: 'Kasoa Road Premium Plots',
    location: 'Kasoa, Central Region',
    excerpt: 'Serviced residential plots with water, electricity and approved building plans, perfect for own development or investment.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-02-14',
    category: 'Land Development',
    units: '80 Plots',
    area: '25 Acres',
    status: 'Completed',
    tags: ['land', 'plots', 'investment']
  }
];

const categories = [
  { name: 'All', count: projects.length },
  { name: 'Residential', count: 3 },
  { name: 'Commercial', count: 2 },
  { name: 'Hospitality', count: 2 },
  { name: 'Land Development', count: 1 }
];

const popularTags = [
  { name: 'luxury villas', count: 1 },
  { name: 'apartments', count: 1 },
  { name: 'commercial', count: 2 },
  { name: 'investment', count: 3 },
  { name: 'beachfront', count: 1 },
  { name: 'nairobi', count: 4 },
  { name: 'sustainability', count: 1 }
];

const recentProjects = [
  projects[0],
  projects[1],
  projects[2]
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <section className="portfolio-hero">
        <div className="container">
          <h1>Our Development Portfolio</h1>
          <p>A curated showcase of residential, commercial and hospitality projects developed by 2PJ Reality</p>

          {/* Search Bar */}
          <div className="portfolio-search">
            <input
              type="text"
              placeholder="Search projects, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button">
              <FaSearch />
            </button>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="portfolio-container">
          {/* Main Content */}
          <main className="portfolio-main">
            {/* Category Filter */}
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`category-btn ${activeCategory === category.name ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(category.name);
                    setCurrentPage(1);
                  }}
                >
                  {category.name} <span>({category.count})</span>
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="portfolio-grid">
              {currentProjects.length > 0 ? (
                currentProjects.map((project) => (
                  <article key={project.id} className="portfolio-card">
                    <div className="portfolio-card__image">
                      <img src={project.image} alt={project.title} />
                      <div className="portfolio-card__category">{project.category}</div>
                    </div>
                    <div className="portfolio-card__content">
                      <div className="portfolio-meta">
                        <span><FaCalendarAlt /> {formatDate(project.date)}</span>
                        <span><FaMapMarkerAlt /> {project.location}</span>
                      </div>
                      <h2 className="portfolio-card__title">
                        <Link to={`/portfolio/${project.id}`}>{project.title}</Link>
                      </h2>
                      <p className="portfolio-card__excerpt">{project.excerpt}</p>
                      <div className="portfolio-card__stats">
                        <span><FaBuilding /> {project.units}</span>
                        <span><FaLayerGroup /> {project.area}</span>
                      </div>
                      <div className="portfolio-card__footer">
                        <div className="portfolio-tags">
                          <FaBuilding />
                          {project.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <Link to={`/portfolio/${project.id}`} className="read-more">
                        View Project <FaChevronRight />
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="no-results">
                  <h3>No projects found matching your search criteria.</h3>
                  <button
                    className="reset-filters"
                    onClick={() => {
                      setActiveCategory('All');
                      setSearchQuery('');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-arrow"
                >
                  <FaChevronLeft />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-arrow"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="portfolio-sidebar">
            {/* About Widget */}
            <div className="sidebar-widget">
              <h3 className="widget-title">About the Developer</h3>
              <p>2PJ Reality Developments has delivered over 40 residential and commercial projects across Ghana. We build communities, not just buildings, with a focus on quality, sustainability and lasting value.</p>
            </div>

            {/* Featured Projects */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Featured Projects</h3>
              <div className="popular-posts">
                {recentProjects.map((project) => (
                  <div key={project.id} className="popular-post">
                    <img src={project.image} alt={project.title} />
                    <div className="popular-post__content">
                      <h4><Link to={`/portfolio/${project.id}`}>{project.title}</Link></h4>
                      <span>{project.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Project Categories</h3>
              <ul className="categories-list">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button
                      className={activeCategory === category.name ? 'active' : ''}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      {category.name}
                      <span>({category.count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Popular Tags</h3>
              <div className="tag-cloud">
                {popularTags.map((tag, index) => (
                  <button
                    key={index}
                    className="tag"
                    onClick={() => setSearchQuery(tag.name)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Consultation CTA */}
            <div className="sidebar-widget newsletter-widget">
              <h3 className="widget-title">Planning a Development?</h3>
              <p>Partner with our development team to design and build your next project.</p>
              <Link to="/contact" className="btn btn-primary btn-block">Book a Consultation</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;