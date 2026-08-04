import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const { caregiverId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    medicalHistory: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    alert('Booking request sent successfully!');
    navigate('/dashboard/user');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '700px' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Book Service</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
          You are requesting a service from Caregiver #{caregiverId}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Patient Name</label>
              <input type="text" name="patientName" className="input-field" onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Patient Age</label>
              <input type="number" name="patientAge" className="input-field" onChange={handleChange} required />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Medical History / Special Requirements</label>
            <textarea name="medicalHistory" className="input-field" rows="4" onChange={handleChange} required></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Start Date</label>
              <input type="date" name="startDate" className="input-field" onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>End Date</label>
              <input type="date" name="endDate" className="input-field" onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            Send Booking Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
