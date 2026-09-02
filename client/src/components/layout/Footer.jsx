import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaChevronRight
} from 'react-icons/fa';
import { useContent } from '../../contexts/ContentContext';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { content } = useContent();
  const brand = content.brand;
  const footer = content.footer;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* About Section */}
          <div className="footer__section">
            <h3 className="footer__title">About {brand.name}</h3>
            <div className="footer__logo">
              <span className="logo">
                {brand.logoImage ? (
                  <img src={brand.logoImage} alt={brand.name} className="logo__image" />
                ) : (
                  <span className="logo__icon">{brand.logoIcon}</span>
                )}
                <span>{brand.logoText}</span>
              </span>
            </div>
            <p className="footer__about">
              {footer.about}
            </p>
            <div className="footer__social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h3 className="footer__title">Quick Links</h3>
            <ul className="footer__links">
              <li><Link to="/properties"><FaChevronRight className="link-icon" /> Properties</Link></li>
              <li><Link to="/hotels"><FaChevronRight className="link-icon" /> Hotels</Link></li>
              <li><Link to="/about"><FaChevronRight className="link-icon" /> About Us</Link></li>
              <li><Link to="/portfolio"><FaChevronRight className="link-icon" /> Portfolio</Link></li>
              <li><Link to="/contact"><FaChevronRight className="link-icon" /> Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__section">
            <h3 className="footer__title">Contact Us</h3>
            <ul className="footer__contact-info">
              <li>
                <FaMapMarkerAlt />
                <span>{footer.location}</span>
              </li>
              <li>
                <FaPhone />
                <a href={`tel:${footer.phone.replace(/[^+\d]/g, '')}`}>{footer.phone}</a>
              </li>
              <li>
                <FaEnvelope />
                <a href={`mailto:${footer.email}`}>{footer.email}</a>
              </li>
              <li>
                <FaClock />
                <span>Mon - Fri: 9:00 - 18:00</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer__section">
            <h3 className="footer__title">Newsletter</h3>
            <p className="footer__newsletter-text">
              Subscribe to our newsletter for the latest property listings and travel deals.
            </p>
            <form className="footer__newsletter">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="footer__input"
                required 
              />
              <button type="submit" className="button button--primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>

      </div>
      
      {/* Copyright */}
      <div className="footer__bottom">
        <div className="container">
          <p>&copy; {currentYear} {brand.name}. All rights reserved.</p>
          <div className="footer__legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span> | </span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
