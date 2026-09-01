import React, { useState, useEffect } from 'react';
import { FaUsers, FaBuilding, FaHotel, FaDollarSign, FaChartLine } from 'react-icons/fa';
import api from '../../services/api';
import './Properties.css';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/admin/dashboard/');
        setData(response.data || {});
      } catch {
        setData({});
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  const stats = [
    { label: 'Total Users', value: data?.total_users, icon: FaUsers, color: '#5A3825' },
    { label: 'Total Properties', value: data?.total_properties, icon: FaBuilding, color: '#228B22' },
    { label: 'Total Hotels', value: data?.total_hotels, icon: FaHotel, color: '#DAA520' },
    { label: 'Total Revenue', value: data?.total_revenue, icon: FaDollarSign, color: '#2E2E2E' }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="properties-container">
      <div className="properties-header">
        <h1><FaChartLine style={{ marginRight: '0.5rem' }} /> Platform Reports</h1>
      </div>

      <div className="properties-stats">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <s.icon style={{ color: s.color, fontSize: '1.4rem', marginBottom: '0.4rem' }} />
            <h3>{s.value ?? '—'}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="no-results" style={{ marginTop: '2rem' }}>
        <h3>Activity feed</h3>
        <p>Recent platform activities will appear here once the backend connects. Run the Django API server to see live data.</p>
      </div>
    </div>
  );
};

export default Reports;