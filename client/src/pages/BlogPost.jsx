import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTags, FaComment, FaShare, FaFacebook, FaTwitter, FaLinkedin, FaPinterest } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import './BlogPost.css';

// Mock data - in a real app, this would come from an API
const blogPost = {
  id: 1,
  title: 'Top 10 Real Estate Investment Tips for 2023',
  content: `
    <p>Investing in real estate can be one of the most profitable decisions you'll ever make, but it's not without its challenges. Whether you're a first-time investor or looking to expand your portfolio, these tips will help you make informed decisions in the 2023 market.</p>
    
    <h2>1. Research the Local Market</h2>
    <p>Understanding the local real estate market is crucial. Look at recent sales, rental yields, and future development plans in the area. Consider working with a local real estate agent who has in-depth knowledge of the neighborhood.</p>
    
    <h2>2. Consider Emerging Neighborhoods</h2>
    <p>Established areas often come with premium prices. Look for up-and-coming neighborhoods where property values are likely to appreciate. Signs of growth include new infrastructure, schools, and commercial developments.</p>
    
    <h2>3. Calculate All Costs</h2>
    <p>Beyond the purchase price, factor in closing costs, property taxes, insurance, maintenance, and potential homeowners' association fees. Create a detailed budget to avoid unexpected expenses.</p>
    
    <h2>4. Secure Financing Early</h2>
    <p>Get pre-approved for a mortgage before you start house hunting. This will give you a clear budget and make your offers more attractive to sellers in competitive markets.</p>
    
    <h2>5. Think Long-Term</h2>
    <p>Real estate is typically a long-term investment. Consider how the property will appreciate over 5-10 years rather than focusing on short-term gains.</p>
    
    <h2>6. Consider Rental Potential</h2>
    <p>Even if you plan to live in the property, think about its rental potential. Features like extra bedrooms, a separate entrance, or a location near universities can increase rental income.</p>
    
    <h2>7. Get a Professional Inspection</h2>
    <p>Never skip the home inspection. A professional can identify potential issues that could cost you thousands in repairs down the line.</p>
    
    <h2>8. Understand Tax Implications</h2>
    <p>Consult with a tax professional to understand how your investment will affect your taxes, including deductions, capital gains, and property tax implications.</p>
    
    <h2>9. Build a Reliable Team</h2>
    <p>Assemble a team of professionals including a real estate agent, attorney, accountant, and contractor. Their expertise can save you time, money, and stress.</p>
    
    <h2>10. Stay Patient and Disciplined</h2>
    <p>Don't rush into a purchase. Wait for the right property at the right price, and don't let emotions drive your investment decisions.</p>
    
    <p>By following these tips and conducting thorough research, you'll be well on your way to making smart real estate investments in 2023 and beyond.</p>
  `,
  excerpt: 'Discover the best strategies for real estate investment in the current market and maximize your returns.',
  image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  date: '2023-06-15',
  author: 'Sarah Johnson',
  authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  authorBio: 'Sarah is a certified real estate investment advisor with over 10 years of experience in the market. She specializes in helping first-time investors build profitable portfolios.',
  category: 'Investment',
  readTime: '5 min read',
  comments: 8,
  likes: 24,
  tags: ['investment', 'market trends', 'finance', 'real estate tips'],
  relatedPosts: [
    {
      id: 2,
      title: 'Understanding Mortgage Rates in 2023',
      image: 'https://images.unsplash.com/photo-1560519546-4c3a2d4a4a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '2023-05-10',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'The Ultimate Guide to Home Staging',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '2023-05-28',
      readTime: '7 min read'
    }
  ]
};

const BlogPost = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blogPost.likes);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: '2023-06-16',
      content: 'Great insights! I especially agree with point #5 about thinking long-term. Too many investors focus on quick flips these days.'
    },
    {
      id: 2,
      author: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      date: '2023-06-17',
      content: 'Thanks for the tips! Do you have any recommendations for first-time investors in the current market?'
    }
  ]);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = {
      id: comments.length + 1,
      author: 'Current User',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      date: new Date().toISOString().split('T')[0],
      content: comment
    };
    
    setComments([...comments, newComment]);
    setComment('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="blog-post-page">
      {/* Header */}
      <header className="post-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span> / </span>
            <Link to="/blog">Blog</Link>
            <span> / {blogPost.title}</span>
          </nav>
          <h1>{blogPost.title}</h1>
          <div className="post-meta">
            <span><FaCalendarAlt /> {formatDate(blogPost.date)}</span>
            <span><FaUser /> By {blogPost.author}</span>
            <span><FaTags /> {blogPost.category}</span>
            <span><FaComment /> {blogPost.comments} Comments</span>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="post-content">
          {/* Main Content */}
          <article className="post-article">
            <div className="featured-image">
              <img src={blogPost.image} alt={blogPost.title} />
            </div>
            
            <div className="post-body" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
            
            <div className="post-tags">
              <span>Tags: </span>
              {blogPost.tags.map((tag, index) => (
                <Link key={index} to={`/blog?tag=${tag}`} className="tag">{tag}</Link>
              ))}
            </div>
            
            <div className="post-actions">
              <button 
                className={`like-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                <FiHeart /> {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
              </button>
              <div className="share-buttons">
                <span>Share: </span>
                <a href="#" aria-label="Share on Facebook"><FaFacebook /></a>
                <a href="#" aria-label="Share on Twitter"><FaTwitter /></a>
                <a href="#" aria-label="Share on LinkedIn"><FaLinkedin /></a>
                <a href="#" aria-label="Share on Pinterest"><FaPinterest /></a>
              </div>
            </div>
            
            {/* Author Bio */}
            <div className="author-bio">
              <div className="author-avatar">
                <img src={blogPost.authorImage} alt={blogPost.author} />
              </div>
              <div className="author-info">
                <h3>About {blogPost.author}</h3>
                <p>{blogPost.authorBio}</p>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="comments-section">
              <h3>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</h3>
              
              {/* Comment Form */}
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <h4>Leave a Comment</h4>
                <textarea
                  placeholder="Write your comment here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="5"
                  required
                ></textarea>
                <button type="submit" className="submit-comment">Post Comment</button>
              </form>
              
              {/* Comments List */}
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-avatar">
                      <img src={comment.avatar} alt={comment.author} />
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <h4>{comment.author}</h4>
                        <span className="comment-date">{formatDate(comment.date)}</span>
                      </div>
                      <p>{comment.content}</p>
                      <button className="reply-btn">Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
          
          {/* Sidebar */}
          <aside className="post-sidebar">
            <div className="sidebar-widget">
              <h3 className="widget-title">About Author</h3>
              <div className="author-widget">
                <img src={blogPost.authorImage} alt={blogPost.author} />
                <h4>{blogPost.author}</h4>
                <p>{blogPost.authorBio}</p>
                <div className="author-social">
                  <a href="#" aria-label="Facebook"><FaFacebook /></a>
                  <a href="#" aria-label="Twitter"><FaTwitter /></a>
                  <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                </div>
              </div>
            </div>
            
            <div className="sidebar-widget">
              <h3 className="widget-title">Related Posts</h3>
              <div className="related-posts">
                {blogPost.relatedPosts.map(post => (
                  <div key={post.id} className="related-post">
                    <img src={post.image} alt={post.title} />
                    <div className="related-post-content">
                      <h4><Link to={`/blog/${post.id}`}>{post.title}</Link></h4>
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="sidebar-widget">
              <h3 className="widget-title">Newsletter</h3>
              <div className="newsletter-widget">
                <p>Subscribe to our newsletter for the latest updates and insights.</p>
                <form className="newsletter-form">
                  <input type="email" placeholder="Your email address" required />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
