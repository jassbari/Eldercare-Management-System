import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';


const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar glass-card">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <span className="logo-icon">❤️</span>
          ElderCare
        </Link>
        <nav className="nav-links">
          <Link to="/services">Services</Link>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle" 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: '0.5rem' }}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link 
                to={`/dashboard/${user.role === 'caregiver' ? 'caregiver' : 'user'}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link to="/appointments" style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>Appointments</Link>
              {user.role === 'user' && (
                <Link to="/health" style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>Health Records</Link>
              )}
              <Link to="/settings" style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>Settings</Link>
              
              <button 
                onClick={handleLogout}
                className="btn btn-secondary" 
                style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
