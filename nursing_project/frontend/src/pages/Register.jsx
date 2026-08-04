import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Register = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', address: '', password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, register } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role === 'caregiver' ? 'caregiver' : 'user'}`, { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({ ...formData, role });
      navigate(`/dashboard/${role === 'caregiver' ? 'caregiver' : 'user'}`);
    } catch (error) {
      console.error('Registration failed', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '600px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create an Account</h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <button 
            className={`btn ${role === 'user' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRole('user')}
          >
            Family / Elderly
          </button>
          <button 
            className={`btn ${role === 'caregiver' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRole('caregiver')}
          >
            Caregiver
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Input 
              label="Full Name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            <Input 
              label="Phone Number" 
              name="phone" 
              type="tel" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
          <Input 
            label="Email Address" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Password" 
            name="password" 
            type="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <Button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>

        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-muted)' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
