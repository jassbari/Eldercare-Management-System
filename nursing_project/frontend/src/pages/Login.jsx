import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  
  const from = location.state?.from?.pathname || '/';

  React.useEffect(() => {
    if (user) {
      if (from !== '/') {
        navigate(from, { replace: true });
      } else {
        navigate(`/dashboard/${user.role === 'caregiver' ? 'caregiver' : 'user'}`, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);
      
      // Redirect to the page they were trying to go to, or their dashboard
      if (from !== '/') {
        navigate(from, { replace: true });
      } else {
        navigate(`/dashboard/${user.role === 'caregiver' ? 'caregiver' : 'user'}`, { replace: true });
      }
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Input 
            label="Email Address"
            id="email"
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <Input 
            label="Password"
            id="password"
            type="password" 
            placeholder="enter minimum 6 digits password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <Button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-muted)' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
