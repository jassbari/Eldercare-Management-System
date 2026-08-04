import React from 'react';
import { Link } from 'react-router-dom';

const caregivers = [
  { id: 1, name: 'Sarah Jenkins', type: 'Nursing Care', experience: '5 years', rating: 4.8 },
  { id: 2, name: 'Michael Chen', type: 'Physiotherapy', experience: '8 years', rating: 4.9 },
  { id: 3, name: 'Emma Watson', type: 'Elderly Attendant', experience: '3 years', rating: 4.7 },
];

const ServiceBrowser = () => {
  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Browse Services & Caregivers</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {caregivers.map(cg => (
          <div key={cg.id} className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {cg.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{cg.name}</h3>
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{cg.type}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p><strong>Experience:</strong> {cg.experience}</p>
              <p><strong>Rating:</strong> ⭐ {cg.rating}/5.0</p>
            </div>
            
            <Link to={`/book/${cg.id}`} className="btn btn-primary" style={{ width: '100%' }}>
              Book Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceBrowser;
