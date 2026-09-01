import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaCheckCircle } from 'react-icons/fa';
import api from '../../services/api';
import './Form.css';

const UserForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    user_type: 'buyer',
    password: '',
    password_confirm: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (form.password !== form.password_confirm) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/auth/register/', form);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/users'), 1200);
    } catch (err) {
      const detail = err.response?.data?.detail ||
        err.response?.data?.password?.join(', ') ||
        err.response?.data?.email?.join(', ') ||
        'Could not create user. Is the backend running?';
      setError(detail);
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
        <h1>Add New User</h1>
        <button className="btn-secondary" onClick={() => navigate('/dashboard/users')}>
          <FaArrowLeft /> Back
        </button>
      </div>

      {success && (
        <div className="form-success"><FaCheckCircle /> User created successfully.</div>
      )}
      {error && <div className="form-error">{error}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          {field('email', 'Email Address', 'email', true)}
          {field('first_name', 'First Name')}
          {field('last_name', 'Last Name')}
          {field('phone_number', 'Phone Number')}
          <div className="form-field">
            <label htmlFor="user_type">Role</label>
            <select id="user_type" name="user_type" value={form.user_type} onChange={handleChange}>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="agent">Agent</option>
              <option value="hotel_manager">Hotel Manager</option>
              <option value="admin">Admin / Site Owner</option>
            </select>
          </div>
          {field('password', 'Password', 'password')}
          {field('password_confirm', 'Confirm Password', 'password')}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            <FaPlus /> {submitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;