import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FaUserCircle,
  FaBars, 
  FaTimes,
  FaSearch,
  FaHome,
  FaBuilding,
  FaHotel,
  FaInfoCircle,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaChevronDown,
  FaUserCog,
  FaHeart,
  FaBlog,
  FaUser,
  FaTachometerAlt
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ isAuthenticated = false, user = null, onLogout = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle escape key to close menus
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      if (isOpen) setIsOpen(false);
      if (showUserMenu) setShowUserMenu(false);
    }
  }, [isOpen, showUserMenu]);

  // Set up event listeners
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Handle search close if needed
      }
      if (mobileMenuRef.current && isOpen && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.navbar__toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  // Handle scroll effect for navbar - always solid
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Set initial scroll state
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // When opening the menu, ensure user menu is closed
      setShowUserMenu(false);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Navbar is always solid
  const isTransparent = false;

  return (
    <>
      <nav className="navbar navbar--solid navbar--scrolled">
        <div className="navbar__container">
          {/* Logo */}
          <Link to="/" className="logo" aria-label="Shiats3 Home">
            <span className="logo__icon">🏠</span>
            <span>Shiats3</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="navbar__toggle" 
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop Navigation and Search */}
          <div className="navbar__desktop-content">
            {/* Search Bar - Desktop */}
            <div className="navbar__search" ref={searchRef}>
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search properties, hotels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  aria-label="Search"
                />
                <button type="submit" className="search-button" aria-label="Search">
                  <FaSearch />
                </button>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="navbar__menu">
              <ul className="navbar__list">
                <li className="navbar__item">
                  <Link 
                    to="/" 
                    className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}
                  >
                    <FaHome className="navbar__icon" />
                    <span>Home</span>
                  </Link>
                </li>
                <li className="navbar__item">
                  <Link 
                    to="/properties" 
                    className={`navbar__link ${location.pathname.startsWith('/properties') ? 'active' : ''}`}
                  >
                    <FaBuilding className="navbar__icon" />
                    <span>Properties</span>
                  </Link>
                </li>
                <li className="navbar__item">
                  <Link 
                    to="/hotels" 
                    className={`navbar__link ${location.pathname.startsWith('/hotels') ? 'active' : ''}`}
                  >
                    <FaHotel className="navbar__icon" />
                    <span>Hotels</span>
                  </Link>
                </li>
                <li className="navbar__item">
                  <Link 
                    to="/blog" 
                    className={`navbar__link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}
                  >
                    <FaBlog className="navbar__icon" />
                    <span>Blog</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* User Actions */}
            <div className="navbar__actions">
              {isAuthenticated ? (
                <>
                  {/* Dashboard Link - Always Visible */}
                  <Link 
                    to="/dashboard" 
                    className="navbar__link navbar__link--dashboard"
                    title="Dashboard"
                  >
                    <FaTachometerAlt className="navbar__icon" />
                    <span className="navbar__link-text">Dashboard</span>
                  </Link>
                  
                  {/* User Profile Dropdown */}
                  <div className="user-menu" ref={userMenuRef}>
                    <button 
                      className="user-menu__toggle"
                      onClick={toggleUserMenu}
                      aria-expanded={showUserMenu}
                      aria-haspopup="true"
                      aria-label="User menu"
                    >
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user?.name || 'User'} 
                          className="user-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=e74c3c&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="user-avatar user-avatar--default">
                          <FaUserCircle className="user-avatar__icon" />
                        </div>
                      )}
                      <span className="user-name">{user?.name?.split(' ')[0] || 'Account'}</span>
                      <FaChevronDown className={`dropdown-arrow ${showUserMenu ? 'open' : ''}`} />
                    </button>
                    
                    {showUserMenu && (
                      <div className="user-menu__dropdown">
                        <Link 
                          to="/dashboard" 
                          className="user-menu__item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaTachometerAlt className="user-menu__icon" />
                          <span>Dashboard</span>
                        </Link>
                        <Link 
                          to="/profile" 
                          className="user-menu__item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaUser className="user-menu__icon" />
                          <span>My Profile</span>
                        </Link>
                        <Link 
                          to="/saved" 
                          className="user-menu__item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaHeart className="user-menu__icon" />
                          <span>Saved Items</span>
                        </Link>
                        <Link 
                          to="/settings" 
                          className="user-menu__item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaUserCog className="user-menu__icon" />
                          <span>Settings</span>
                        </Link>
                        <div className="user-menu__divider"></div>
                        <button 
                          className="user-menu__item user-menu__item--logout"
                          onClick={() => {
                            handleLogout();
                            setShowUserMenu(false);
                          }}
                        >
                          <FaSignOutAlt className="user-menu__icon" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="auth-buttons">
                  <Link 
                    to="/login" 
                    className="button button--outline"
                    state={{ from: location.pathname }}
                  >
                    <FaSignInAlt className="button__icon" />
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="button button--primary"
                    state={{ from: location.pathname }}
                  >
                    <FaUserPlus className="button__icon" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`mobile-menu-overlay ${isOpen ? 'mobile-menu-overlay--open' : ''}`}
          onClick={() => setIsOpen(false)}
          aria-hidden={!isOpen}
        ></div>

        {/* Mobile Menu Sidebar */}
        <div 
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`mobile-menu ${isOpen ? 'mobile-menu--open' : ''}`}
          aria-hidden={!isOpen}
        >
          <div className="mobile-menu__header">
            <h3 className="mobile-menu__title">Menu</h3>
            <button 
              className="mobile-menu__close" 
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="mobile-menu__search">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search properties, hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search"
              />
              <button type="submit" className="search-button" aria-label="Search">
                <FaSearch />
              </button>
            </form>
          </div>
          
          <nav className="mobile-nav">
            <ul className="mobile-nav__list">
              <li className="mobile-nav__item">
                <Link to="/" className={`mobile-nav__link ${location.pathname === '/' ? 'active' : ''}`}>
                  <FaHome className="mobile-nav__icon" />
                  <span>Home</span>
                </Link>
              </li>
              <li className="mobile-nav__item">
                <Link to="/properties" className={`mobile-nav__link ${location.pathname.startsWith('/properties') ? 'active' : ''}`}>
                  <FaBuilding className="mobile-nav__icon" />
                  <span>Properties</span>
                </Link>
              </li>
              <li className="mobile-nav__item">
                <Link to="/hotels" className={`mobile-nav__link ${location.pathname.startsWith('/hotels') ? 'active' : ''}`}>
                  <FaHotel className="mobile-nav__icon" />
                  <span>Hotels</span>
                </Link>
              </li>
              <li className="mobile-nav__item">
                <Link to="/blog" className={`mobile-nav__link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}>
                  <FaBlog className="mobile-nav__icon" />
                  <span>Blog</span>
                </Link>
              </li>
              <li className="mobile-nav__item">
                <Link to="/about" className={`mobile-nav__link ${location.pathname === '/about' ? 'active' : ''}`}>
                  <FaInfoCircle className="mobile-nav__icon" />
                  <span>About Us</span>
                </Link>
              </li>
              <li className="mobile-nav__item">
                <Link to="/contact" className={`mobile-nav__link ${location.pathname === '/contact' ? 'active' : ''}`}>
                  <FaEnvelope className="mobile-nav__icon" />
                  <span>Contact</span>
                </Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li className="mobile-nav__divider"></li>
                  <li className="mobile-nav__item">
                    <Link to="/dashboard" className="mobile-nav__link">
                      <FaHome className="mobile-nav__icon" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li className="mobile-nav__item">
                    <Link to="/profile" className="mobile-nav__link">
                      <FaUser className="mobile-nav__icon" />
                      <span>My Profile</span>
                    </Link>
                  </li>
                  <li className="mobile-nav__item">
                    <Link to="/saved" className="mobile-nav__link">
                      <FaHeart className="mobile-nav__icon" />
                      <span>Saved Items</span>
                    </Link>
                  </li>
                  <li className="mobile-nav__item">
                    <Link to="/settings" className="mobile-nav__link">
                      <FaUserCog className="mobile-nav__icon" />
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li className="mobile-nav__item">
                    <button className="mobile-nav__link mobile-nav__link--button" onClick={handleLogout}>
                      <FaSignOutAlt className="mobile-nav__icon" />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="mobile-nav__divider"></li>
                  <li className="mobile-nav__item">
                    <Link 
                      to="/login" 
                      className="mobile-nav__button button button--outline"
                      state={{ from: location.pathname }}
                    >
                      <FaSignInAlt className="button__icon" />
                      <span>Login</span>
                    </Link>
                  </li>
                  <li className="mobile-nav__item">
                    <Link 
                      to="/register" 
                      className="mobile-nav__button button button--primary"
                      state={{ from: location.pathname }}
                    >
                      <FaUserPlus className="button__icon" />
                      <span>Sign Up</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          
          <div className="mobile-footer">
            <p>&copy; {new Date().getFullYear()} Shiats3. All rights reserved.</p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
