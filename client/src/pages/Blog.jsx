import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaUser, FaTags, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { FiShare2, FiHeart, FiMessageSquare } from 'react-icons/fi';
import './Blog.css';

// Mock data - in a real app, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Real Estate Investment Tips for 2023',
    excerpt: 'Discover the best strategies for real estate investment in the current market and maximize your returns.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-06-15',
    author: 'Sarah Johnson',
    category: 'Investment',
    readTime: '5 min read',
    comments: 8,
    likes: 24,
    tags: ['investment', 'market trends', 'finance']
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Home Staging',
    excerpt: 'Learn how to stage your home effectively to attract potential buyers and sell faster at the best price.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-05-28',
    author: 'Michael Chen',
    category: 'Home Selling',
    readTime: '7 min read',
    comments: 12,
    likes: 36,
    tags: ['home staging', 'selling', 'interior design']
  },
  {
    id: 3,
    title: 'Understanding Mortgage Rates in 2023',
    excerpt: 'A comprehensive guide to understanding current mortgage rates and how they affect your home buying power.',
    image: 'https://images.unsplash.com/photo-1560519546-4c3a2d4a4a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-05-10',
    author: 'David Kimani',
    category: 'Mortgage',
    readTime: '6 min read',
    comments: 5,
    likes: 18,
    tags: ['mortgage', 'finance', 'home buying']
  },
  {
    id: 4,
    title: 'Luxury Living: Modern Home Features Buyers Love',
    excerpt: 'Explore the most sought-after luxury home features that can increase your property value significantly.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-04-22',
    author: 'Grace Mwangi',
    category: 'Luxury Homes',
    readTime: '8 min read',
    comments: 15,
    likes: 42,
    tags: ['luxury homes', 'modern design', 'home features']
  },
  {
    id: 5,
    title: 'First-Time Home Buyer Mistakes to Avoid',
    excerpt: 'Common pitfalls that first-time home buyers should be aware of to make informed decisions.',
    image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-04-05',
    author: 'James Omondi',
    category: 'Home Buying',
    readTime: '6 min read',
    comments: 9,
    likes: 31,
    tags: ['first-time buyers', 'tips', 'home buying']
  },
  {
    id: 6,
    title: 'The Rise of Green Homes in Africa',
    excerpt: 'How sustainable and eco-friendly homes are becoming increasingly popular in the African real estate market.',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-03-18',
    author: 'Amina Njoroge',
    category: 'Sustainability',
    readTime: '7 min read',
    comments: 14,
    likes: 29,
    tags: ['green homes', 'sustainability', 'eco-friendly']
  }
];

const categories = [
  { name: 'All', count: blogPosts.length },
  { name: 'Investment', count: 2 },
  { name: 'Home Selling', count: 1 },
  { name: 'Mortgage', count: 1 },
  { name: 'Luxury Homes', count: 1 },
  { name: 'Home Buying', count: 1 },
  { name: 'Sustainability', count: 1 }
];

const popularTags = [
  { name: 'investment', count: 2 },
  { name: 'market trends', count: 1 },
  { name: 'finance', count: 2 },
  { name: 'home staging', count: 1 },
  { name: 'selling', count: 1 },
  { name: 'interior design', count: 1 },
  { name: 'mortgage', count: 1 },
  { name: 'home buying', count: 2 },
  { name: 'luxury homes', count: 1 },
  { name: 'modern design', count: 1 },
  { name: 'first-time buyers', count: 1 },
  { name: 'tips', count: 1 },
  { name: 'green homes', count: 1 },
  { name: 'sustainability', count: 1 },
  { name: 'eco-friendly', count: 1 }
];

const recentPosts = [
  blogPosts[0],
  blogPosts[1],
  blogPosts[2]
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  // Filter posts by category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <h1>Shiats3 Blog</h1>
          <p>Insights, tips, and trends in real estate and hospitality</p>
          
          {/* Search Bar */}
          <div className="blog-search">
            <input
              type="text"
              placeholder="Search articles..."
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
        <div className="blog-container">
          {/* Main Content */}
          <main className="blog-main">
            {/* Category Filter */}
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`category-btn ${activeCategory === category.name ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(category.name);
                    setCurrentPage(1); // Reset to first page when changing category
                  }}
                >
                  {category.name} <span>({category.count})</span>
                </button>
              ))}
            </div>

            {/* Blog Posts Grid */}
            <div className="blog-grid">
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <article key={post.id} className="blog-card">
                    <div className="blog-card__image">
                      <img src={post.image} alt={post.title} />
                      <div className="blog-card__category">{post.category}</div>
                    </div>
                    <div className="blog-card__content">
                      <div className="blog-meta">
                        <span><FaCalendarAlt /> {formatDate(post.date)}</span>
                        <span><FaUser /> {post.author}</span>
                      </div>
                      <h2 className="blog-card__title">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h2>
                      <p className="blog-card__excerpt">{post.excerpt}</p>
                      <div className="blog-card__footer">
                        <div className="blog-tags">
                          <FaTags />
                          {post.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                        </div>
                        <div className="blog-actions">
                          <button className="action-btn">
                            <FiMessageSquare /> {post.comments}
                          </button>
                          <button className="action-btn">
                            <FiHeart /> {post.likes}
                          </button>
                          <button className="action-btn">
                            <FiShare2 />
                          </button>
                        </div>
                      </div>
                      <Link to={`/blog/${post.id}`} className="read-more">
                        Read More <FaChevronRight />
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="no-results">
                  <h3>No articles found matching your search criteria.</h3>
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
                  // Show first, last, and current with neighbors
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
          <aside className="blog-sidebar">
            {/* About Widget */}
            <div className="sidebar-widget">
              <h3 className="widget-title">About Shiats3 Blog</h3>
              <p>Welcome to the Shiats3 Blog, your trusted source for real estate insights, market trends, and expert advice on buying, selling, and investing in African properties.</p>
            </div>

            {/* Popular Posts */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Popular Posts</h3>
              <div className="popular-posts">
                {recentPosts.map((post) => (
                  <div key={post.id} className="popular-post">
                    <img src={post.image} alt={post.title} />
                    <div className="popular-post__content">
                      <h4><Link to={`/blog/${post.id}`}>{post.title}</Link></h4>
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Categories</h3>
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

            {/* Newsletter */}
            <div className="sidebar-widget newsletter-widget">
              <h3 className="widget-title">Subscribe to Our Newsletter</h3>
              <p>Get the latest real estate news and updates delivered to your inbox.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Your email address" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;
