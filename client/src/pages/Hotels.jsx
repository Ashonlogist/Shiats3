import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, 
  FaMapMarkerAlt, 
  FaFilter, 
  FaWifi, 
  FaSwimmingPool, 
  FaParking, 
  FaUtensils, 
  FaSnowflake, 
  FaDumbbell,
  FaCocktail,
  FaConciergeBell,
  FaCoffee,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaSearch,
  FaPlus,
  FaUsers,
  FaUmbrellaBeach
} from 'react-icons/fa';
import { propertiesAPI } from '../services/api';
import { sampleHotels } from '../data/sampleData';
import PageHero from '../components/ui/PageHero';
import './Hotels.css';

const amenityOptions = [
  { id: 'wifi', label: 'Free WiFi', icon: <FaWifi /> },
  { id: 'pool', label: 'Pool', icon: <FaSwimmingPool /> },
  { id: 'parking', label: 'Parking', icon: <FaParking /> },
  { id: 'restaurant', label: 'Restaurant', icon: <FaUtensils /> },
  { id: 'ac', label: 'Air Conditioning', icon: <FaSnowflake /> },
  { id: 'gym', label: 'Gym', icon: <FaDumbbell /> },
  { id: 'bar', label: 'Bar', icon: <FaCocktail /> },
  { id: 'spa', label: 'Spa', icon: <FaConciergeBell /> },
  { id: 'breakfast', label: 'Breakfast', icon: <FaCoffee /> },
  { id: 'beach', label: 'Beach Access', icon: <FaUmbrellaBeach /> },
];

const heroImage = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80';

const Hotels = () => {
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hotelsPerPage = 6;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await propertiesAPI.getProperties();
        if (response && response.data && Array.isArray(response.data)) {
          const transformedHotels = response.data.map(hotel => ({
            id: hotel.id,
            name: hotel.name || 'Unnamed Hotel',
            location: hotel.city || hotel.address || 'Location not specified',
            price: hotel.price_per_night || 0,
            rating: hotel.average_rating || 0,
            reviews: hotel.review_count || 0,
            stars: hotel.star_rating || 0,
            amenities: hotel.amenities?.map(a => a.toLowerCase()) || [],
            image: hotel.images?.[0]?.image || 'https://placehold.co/800x500/EEEEEE/999999?text=No+Image',
            featured: hotel.is_featured || false
          }));
          setAllHotels(transformedHotels);
          setFilteredHotels(transformedHotels);
        } else {
          setError('Failed to load hotels');
        }
      } catch (err) {
        setAllHotels(sampleHotels);
        setFilteredHotels(sampleHotels);
        setError(null);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    if (!Array.isArray(allHotels) || allHotels.length === 0) {
      setFilteredHotels([]);
      return;
    }
    const safeToLower = (str) => (str || '').toString().toLowerCase();
    const filtered = allHotels.filter(hotel => {
      const matchesSearch = searchTerm === '' ||
        safeToLower(hotel.name).includes(safeToLower(searchTerm)) ||
        safeToLower(hotel.location).includes(safeToLower(searchTerm));
      const price = parseFloat(hotel.price) || 0;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      const stars = parseInt(hotel.stars) || 0;
      const matchesStars = selectedStars.length === 0 || selectedStars.includes(stars);
      const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];
      const matchesAmenities = selectedAmenities.length === 0 ||
        selectedAmenities.every(a => amenities.includes(a));
      return matchesSearch && matchesPrice && matchesStars && matchesAmenities;
    });
    setFilteredHotels(filtered);
    setCurrentPage(1);
  }, [allHotels, searchTerm, priceRange, selectedStars, selectedAmenities]);

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleStarFilter = (star) => {
    setSelectedStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleAmenityFilter = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 100000]);
    setSelectedStars([]);
    setSelectedAmenities([]);
  };

  if (loading && isInitialLoad) {
    return (
      <div className="hotels-page">
        <PageHero
          title="Luxury Stays"
          subtitle="Discover the finest accommodations in Ghana"
          backgroundImage={heroImage}
          height="46vh"
          minHeight="380px"
          overlayOpacity={0.5}
        />
        <div className="hotels-loading">
          <FaSpinner className="spin" />
          <p>Finding the best places to stay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hotels-page">
      <PageHero
        title="Luxury Stays"
        subtitle="Curated hotels, resorts and lodges for an unforgettable stay"
        backgroundImage={heroImage}
        height="46vh"
        minHeight="380px"
        overlayOpacity={0.5}
      />

      <div className="hotels-container">
        {/* Toolbar */}
        <div className="hotels-toolbar">
          <div className="hotels-toolbar__search">
            <FaSearch className="hotels-toolbar__search-icon" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search hotels"
            />
          </div>
          <button
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            type="button"
          >
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="hotels-filters">
            <div className="hotels-filters__grid">
              <div className="filter-group">
                <h4>Price / night</h4>
                <div className="range-labels">
                  <span>GH₵ 0</span>
                  <span>GH₵ {priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>

              <div className="filter-group">
                <h4>Star Rating</h4>
                <div className="star-filters">
                  {[5, 4, 3, 2, 1].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-filter ${selectedStars.includes(star) ? 'active' : ''}`}
                      onClick={() => toggleStarFilter(star)}
                    >
                      <span className="stars">{'★'.repeat(star)}</span>
                      <span className="plus">{star}+</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group filter-group--amenities">
                <h4>Amenities</h4>
                <div className="amenity-grid">
                  {amenityOptions.map(({ id, label, icon }) => (
                    <label key={id} className={`amenity-chip ${selectedAmenities.includes(id) ? 'active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(id)}
                        onChange={() => toggleAmenityFilter(id)}
                        style={{ display: 'none' }}
                      />
                      <span className="amenity-chip__icon">{icon}</span>
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-actions">
              <button className="filter-reset" onClick={clearFilters} type="button">Reset All</button>
              <button className="filter-apply" onClick={() => setShowFilters(false)} type="button">Show Results</button>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="hotels-count">
          <p>{filteredHotels.length} {filteredHotels.length === 1 ? 'stay' : 'stays'} available</p>
        </div>

        {/* Grid */}
        {filteredHotels.length === 0 ? (
          <div className="hotels-empty">
            <div className="hotels-empty__icon"><FaSearch /></div>
            <h3>No stays match your criteria</h3>
            <p>Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="filter-apply" type="button">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="hotels-grid">
            {currentHotels.map(hotel => (
              <Link to={`/hotels/${hotel.id}`} key={hotel.id} className="hotel-card">
                <div className="hotel-card__media">
                  <img src={hotel.image} alt={hotel.name} loading="lazy" />
                  {hotel.featured && <span className="hotel-card__badge">Featured</span>}
                  {hotel.stars > 0 && (
                    <span className="hotel-card__stars">{'★'.repeat(hotel.stars)}</span>
                  )}
                </div>
                <div className="hotel-card__body">
                  <div className="hotel-card__top">
                    <h3 className="hotel-card__name">{hotel.name}</h3>
                    <div className="hotel-card__rating">
                      <FaStar /> {hotel.rating}
                      <span className="hotel-card__reviews">({hotel.reviews})</span>
                    </div>
                  </div>
                  <p className="hotel-card__location">
                    <FaMapMarkerAlt /> {hotel.location}
                  </p>
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="hotel-card__amenities">
                      {hotel.amenities.slice(0, 4).map((a, i) => (
                        <span key={i} className="amenity-pill">{a}</span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="amenity-pill amenity-pill--more">+{hotel.amenities.length - 4}</span>
                      )}
                    </div>
                  )}
                  <div className="hotel-card__footer">
                    <div className="hotel-card__price">
                      GH₵ {hotel.price.toLocaleString()}
                      <span>/night</span>
                    </div>
                    <span className="hotel-card__view">
                      View <FaArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredHotels.length > hotelsPerPage && (
          <div className="hotels-pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
              type="button"
            >
              <FaArrowLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`page-btn ${currentPage === number ? 'active' : ''}`}
                type="button"
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
              type="button"
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;