import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import styles from '../pages/Properties.module.css';

const PropertyCard = ({ 
  property, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatPropertyType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(property.id);
  };

  return (
    <motion.div 
      className={styles.propertyCard}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
    >
      <Link to={`/properties/${property.id}`} className={styles.propertyLink}>
        <div className={styles.propertyImage}>
          <img 
            src={property.image} 
            alt={property.title} 
            loading="lazy"
          />
          {property.featured && (
            <span className={styles.propertyBadge}>
              <FaStar className={styles.badgeIcon} /> Featured
            </span>
          )}
          <button 
            className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        <div className={styles.propertyContent}>
          <div className={styles.propertyHeader}>
            <h3 className={styles.propertyPrice}>
              {formatPrice(property.price)}
              {property.type === 'rent' && <span>/mo</span>}
            </h3>
            <span className={styles.propertyType}>
              {formatPropertyType(property.category)}
            </span>
          </div>
          <h4 className={styles.propertyTitle}>{property.title}</h4>
          <div className={styles.propertyLocation}>
            <FaMapMarkerAlt />
            <span>{property.location}</span>
          </div>
          <div className={styles.propertyFeatures}>
            <div className={styles.feature}>
              <FaBed />
              <span>{property.beds} {property.beds === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className={styles.feature}>
              <FaBath />
              <span>{property.baths} {property.baths === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className={styles.feature}>
              <FaRulerCombined />
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['sale', 'rent']).isRequired,
    category: PropTypes.string.isRequired,
    beds: PropTypes.number.isRequired,
    baths: PropTypes.number.isRequired,
    sqft: PropTypes.number.isRequired,
    featured: PropTypes.bool.isRequired,
    image: PropTypes.string.isRequired,
    dateAdded: PropTypes.string.isRequired,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

export default PropertyCard;
