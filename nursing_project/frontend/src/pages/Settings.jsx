import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Settings as SettingsIcon, User, Lock, Bell, Palette, Globe, Shield, HelpCircle, Info } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // States
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [settings, setSettings] = useState({ emailNotifications: true, appointmentReminders: true, medicineReminders: true });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
        if (user) {
          setProfile({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || ''
          });
        }
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/settings/profile', profile);
      toast.success('Profile updated successfully (Please re-login to see all changes globally)');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      await api.put('/settings/security', {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword
      });
      toast.success('Password updated successfully');
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed');
    }
  };

  const handleSettingsChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await api.put('/settings', { [key]: value });
      toast.success('Preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '3rem 1.5rem' }}><Skeleton height="400px" /></div>;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><SettingsIcon color="var(--color-primary)" /> Global Settings</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start', '@media (min-width: 768px)': { gridTemplateColumns: '250px 1fr' } }}>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: window.innerWidth > 768 ? '1 / 2' : '1 / -1' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  background: isActive ? 'var(--color-primary-light)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <Icon size={18} /> {tab.label}
              </button>
            )
          })}
        </div>

        <div className="glass-card animate-fade-in" style={{ padding: '3rem', gridColumn: window.innerWidth > 768 ? '2 / 3' : '1 / -1' }}>
          {activeTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '2rem', fontWeight: 'bold' }}>
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{profile.name}</h3>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{profile.email}</p>
                </div>
              </div>

              <h3 style={{ marginBottom: '1.5rem' }}>Personal Information</h3>
              <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Full Name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                </div>
                <Input label="Email Address" type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} disabled />
                <Input label="Phone Number" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Full Address" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
                </div>
                <Button type="submit" style={{ marginTop: '1rem', gridColumn: '1 / -1', justifySelf: 'start', padding: '0.75rem 2rem' }}>Save Profile Changes</Button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Change Password</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Ensure your account is using a long, random password to stay secure.</p>
              <form onSubmit={handleSecuritySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                <Input label="Current Password" type="password" required value={security.currentPassword} onChange={e => setSecurity({...security, currentPassword: e.target.value})} />
                <Input label="New Password" type="password" required value={security.newPassword} onChange={e => setSecurity({...security, newPassword: e.target.value})} />
                <Input label="Confirm New Password" type="password" required value={security.confirmPassword} onChange={e => setSecurity({...security, confirmPassword: e.target.value})} />
                <Button type="submit" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>Update Password</Button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {[
                  { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive general updates via email.' },
                  { id: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Get notified before your scheduled appointments.' },
                  { id: 'medicineReminders', label: 'Medicine Reminders', desc: 'Alerts to take your prescribed medication.' }
                ].map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.label}</h4>
                      <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{item.desc}</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '28px' }}>
                      <input 
                        type="checkbox" 
                        checked={settings[item.id] || false}
                        onChange={(e) => handleSettingsChange(item.id, e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }} 
                      />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: settings[item.id] ? 'var(--color-primary)' : '#ccc',
                        transition: '.4s', borderRadius: '34px'
                      }}>
                        <span style={{
                          position: 'absolute', content: '""', height: '20px', width: '20px', left: '4px', bottom: '4px',
                          backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                          transform: settings[item.id] ? 'translateX(28px)' : 'translateX(0)'
                        }}></span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {['appearance', 'language', 'privacy', 'help', 'about'].includes(activeTab) && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
              <SettingsIcon size={48} style={{ opacity: 0.2, margin: '0 auto 1.5rem' }} />
              <h3>This section is under construction</h3>
              <p>We are actively working to bring you more customization options soon.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
