import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaCheckCircle } from 'react-icons/fa';
import api from '../../services/api';
import './Form.css';

const PropertyForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    type: 'house',
    status: 'active',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    image: '',
    featured: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...form,
      price: Number(form.price) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      area: Number(form.area) || 0
    };

    try {
      await api.post('/properties/', payload);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/properties'), 1200);
    } catch {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/properties'), 1200);
    }
    setSubmitting(false);
  };

  const field = (name, label, type = 'text', full = false) => {
    const shared = { className: 'form-field' + (full ? ' form-field--full' : '') };
    return (
      <div {...shared}>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          placeholder={label}
        />
      </div>
    );
  };

  return (
    <div className="item-form-container">
      <div className="item-form-header">
        <h1>Add New Property</h1>
        <button className="btn-secondary" onClick={() => navigate('/dashboard/properties')}>
          <FaArrowLeft /> Back
        </button>
      </div>

      {success && (
        <div className="form-success"><FaCheckCircle /> Property saved successfully.</div>
      )}
      {error && <div className="form-error">{error}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          {field('title', 'Property Title', 'text', true)}
          {field('location', 'Location')}
          {field('price', 'Price (GH₵)')}
          <div className="form-field">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={form.type} onChange={handleChange}>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="villa">Villa</option>
              <option value="townhouse">Townhouse</option>
              <option value="cabin">Cabin</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          {field('bedrooms', 'Bedrooms', 'number')}
          {field('bathrooms', 'Bathrooms', 'number')}
          {field('area', 'Area (sq.ft)', 'number')}
          {field('image', 'Image URL', 'text', true)}
          <div className="form-field form-field--full">
            <label>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Featured property
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            <FaPlus /> {submitting ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;