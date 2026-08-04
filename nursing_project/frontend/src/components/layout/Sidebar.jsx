import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Activity, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ role }) => {
  const menuItems = {
    user: [
      { path: '/dashboard/user', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/appointments', icon: Calendar, label: 'Appointments' },
      { path: '/health', icon: Activity, label: 'Health Records' },
      { path: '/settings', icon: Settings, label: 'Settings' }
    ],
    caregiver: [
      { path: '/dashboard/caregiver', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/patients', icon: Users, label: 'My Patients' },
      { path: '/schedule', icon: Calendar, label: 'Schedule' },
      { path: '/settings', icon: Settings, label: 'Settings' }
    ]
  };

  const links = menuItems[role] || menuItems.user;

  return (
    <aside style={{ width: '250px', borderRight: '1px solid var(--color-border)', height: '100vh', position: 'sticky', top: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '1.25rem' }}>
        Dashboard
      </div>
      
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path} 
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)', color: isActive ? 'white' : 'var(--color-text-main)',
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                textDecoration: 'none', transition: 'all 0.2s'
              })}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
