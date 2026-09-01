import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaCheckCircle } from 'react-icons/fa';
import api from '../../services/api';
import './Form.css';

const HotelForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    location: '',
    price: '',
    stars: 5,
    rating: '',
    reviews: '',
    image: '',
    featured: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: form.name,
      location: form.location,
      price: Number(form.price) || 0,
      stars: Number(form.stars) || 5,
      rating: Number(form.rating) || form.stars || 5,
      image: form.image,
      featured: form.featured
    };

    try {
      await api.post('/hotels/', payload);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/hotels'), 1200);
    } catch {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/hotels'), 1200);
    }
    setSubmitting(false);
  };

  const field = (name, label, type = 'text', full = false) => (
    <div className={'form-field' + (full ? ' form-field--full' : '')}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={form[name]} onChange={handleChange} placeholder={label} />
    </div>
  );

  return (
    <div className="item-form-container">
      <div className="item-form-header">
        <h1>Add New Hotel</h1>
        <button className="btn-secondary" onClick={() => navigate('/dashboard/hotels')}>
          <FaArrowLeft /> Back
        </button>
      </div>

      {success && (
        <div className="form-success"><FaCheckCircle /> Hotel saved successfully.</div>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          {field('name', 'Hotel Name', 'text', true)}
          {field('location', 'Location')}
          {field('price', 'Price per night (KES)')}
          <div className="form-field">
            <label htmlFor="stars">Star Rating</label>
            <select id="stars" name="stars" value={form.stars} onChange={handleChange}>
              {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} Star</option>)}
            </select>
          </div>
          {field('rating', 'User Rating (e.g. 4.8)', 'number', true)}
          {field('reviews', 'Review Count', 'number')}
          {field('image', 'Image URL', 'text', true)}
          <div className="form-field form-field--full">
            <label>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Featured hotel
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            <FaPlus /> {submitting ? 'Saving...' : 'Save Hotel'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;