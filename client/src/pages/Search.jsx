import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaStar, FaRegStar, FaHotel, FaArrowRight } from 'react-icons/fa';
import { sampleProperties } from '../data/sampleData';
import { sampleHotels } from '../data/sampleData';
import './Search.css';

const fmtPrice = (n) => 'Ksh ' + n.toLocaleString('en-KE');

function Search() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();
  const [tab, setTab] = useState('all');
  const [refine, setRefine] = useState(q);

  const term = refine.trim().toLowerCase();

  const props = sampleProperties.filter((p) => {
    if (tab === 'hotels') return false;
    return term === '' || p.title.toLowerCase().includes(term) || p.location.toLowerCase().includes(term) || p.type.toLowerCase().includes(term);
  });

  const hotels = sampleHotels.filter((h) => {
    if (tab === 'properties') return false;
    return term === '' || h.name.toLowerCase().includes(term) || h.location.toLowerCase().includes(term);
  });

  const allCount = props.length + hotels.length;

  const handleRefine = (e) => {
    e.preventDefault();
    setRefine(e.target.refine.value.trim());
  };

  return (
    <div className="searchPage">
      <div className="hero">
        <div className="heroContent">
          <h1>Search 2PJ Reality</h1>
          <p>Find your next home or stay — browse properties and hotels across Kenya.</p>
        </div>
      </div>

      <div className="container">
        <div className="refineBar">
          <div className="resultsHeader">
            <h2>Results{q ? ` for "${q}"` : ''}</h2>
            <p>{tab === 'all' ? allCount : tab === 'properties' ? props.length : hotels.length}{tab !== 'all' || tab === 'hotels' ? ` ${tab}` : ''} found</p>
          </div>
          <form className="refineForm" onSubmit={handleRefine}>
            <input className="refineInput" type="text" name="refine" defaultValue={q} placeholder="Property name, location, or type..." />
            <button className="refineButton" type="submit"><FaSearch /> Search</button>
          </form>
        </div>

        <div className="tabBar">
          <button className={tab === 'all' ? 'tab active' : 'tab'} onClick={() => setTab('all')}>All ({allCount})</button>
          <button className={tab === 'properties' ? 'tab active' : 'tab'} onClick={() => setTab('properties')}>Properties ({props.length})</button>
          <button className={tab === 'hotels' ? 'tab active' : 'tab'} onClick={() => setTab('hotels')}>Hotels ({hotels.length})</button>
        </div>

        <div className="grid">
          {tab !== 'hotels' && props.length === 0 && tab === 'properties' && (
            <div className="empty">
              <div className="emptyIcon">🏠</div>
              <h3>No properties found</h3>
              <p>Try a different search term or clear the filter.</p>
            </div>
          )}
          {tab !== 'properties' && hotels.length === 0 && tab === 'hotels' && (
            <div className="empty">
              <div className="emptyIcon">🏨</div>
              <h3>No hotels found</h3>
              <p>Try a different search term or clear the filter.</p>
            </div>
          )}

          {tab === 'all' && props.length === 0 && hotels.length === 0 && (
            <div className="empty">
              <div className="emptyIcon">🔍</div>
              <h3>No results found</h3>
              <p>Try a different search term or clear the filter.</p>
            </div>
          )}

          {tab !== 'hotels' && props.map((p) => (
            <Link key={p.id} to={`/properties/${p.id}`} className="card">
              <div className="cardImage">
                <img src={p.image} alt={p.title} loading="lazy" />
                <span className="cardTag">Property</span>
              </div>
              <div className="cardBody">
                <h3 className="cardTitle">{p.title}</h3>
                <div className="cardLocation"><FaMapMarkerAlt /> {p.location}</div>
                <div className="cardMeta">
                  <span className="metaItem"><FaBed /> {p.bedrooms} bd</span>
                  <span className="metaItem"><FaBath /> {p.bathrooms} ba</span>
                  <span className="metaItem"><FaRulerCombined /> {p.area} sqft</span>
                </div>
                <div>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => <FaRegStar key={i} className="ratingStar" />)}
                    <span className="ratingValue">{p.rating}</span>
                    <span className="ratingCount">({p.reviews})</span>
                  </div>
                </div>
                <div className="cardFooter">
                  <span className="price">{fmtPrice(p.price)}</span>
                  <span className="viewLink">View <FaArrowRight /></span>
                </div>
              </div>
            </Link>
          ))}

          {tab !== 'properties' && hotels.map((h) => (
            <Link key={h.id} to={`/hotels/${h.id}`} className="card">
              <div className="cardImage">
                <img src={h.image} alt={h.name} loading="lazy" />
                <span className="cardTag">Hotel</span>
              </div>
              <div className="cardBody">
                <h3 className="cardTitle">{h.name}</h3>
                <div className="cardLocation"><FaMapMarkerAlt /> {h.location}</div>
                <div className="cardMeta">
                  <span className="metaItem"><FaHotel /> {h.stars}-star</span>
                </div>
                <div>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => <FaRegStar key={i} className="ratingStar" />)}
                    <span className="ratingValue">{h.rating}</span>
                    <span className="ratingCount">({h.reviews})</span>
                  </div>
                </div>
                <div className="cardFooter">
                  <span className="price">{fmtPrice(h.price)}<span className="pricePeriod">/night</span></span>
                  <span className="viewLink">View <FaArrowRight /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;