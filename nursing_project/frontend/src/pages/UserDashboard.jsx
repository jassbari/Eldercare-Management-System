import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { Calendar, HeartPulse, Pill, FileText, Activity, ArrowRight } from 'lucide-react';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/mybookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: 'Cancelled' });
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Dashboard</h2>
        <Link to="/services" className="btn btn-primary">Book New Service</Link>
      </div>

      {/* New Dashboard Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card card-hover stagger-1" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text-muted)' }}>Upcoming</h4>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}><Calendar size={20} /></div>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-primary)' }}>2</p>
        </div>

        <div className="glass-card card-hover stagger-2" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text-muted)' }}>Health Score</h4>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-accent-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-accent)' }}><HeartPulse size={20} /></div>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>85<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>/100</span></p>
        </div>

        <div className="glass-card card-hover stagger-3" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text-muted)' }}>Medicines</h4>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-warning)' }}><Pill size={20} /></div>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-warning)' }}>3</p>
        </div>

        <div className="glass-card card-hover stagger-4" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text-muted)' }}>Latest Report</h4>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-secondary-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-secondary)' }}><FileText size={20} /></div>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: 'var(--color-secondary)' }}>Normal</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
        <h3>Active Bookings</h3>
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <Skeleton height="150px" />
            <Skeleton height="150px" />
          </div>
        ) : bookings.length === 0 ? (
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>No bookings found. <Link to="/services">Book a service now!</Link></p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {bookings.map((booking) => (
              <div key={booking._id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{booking.serviceType}</h4>
                    <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                      Date: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{ 
                    backgroundColor: booking.status === 'Cancelled' ? '#fee2e2' : booking.status === 'Accepted' ? '#dcfce7' : '#fef3c7', 
                    color: booking.status === 'Cancelled' ? '#ef4444' : booking.status === 'Accepted' ? '#16a34a' : '#d97706',
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontWeight: '600',
                    height: 'fit-content'
                  }}>
                    {booking.status}
                  </span>
                </div>
                <p><strong>Patient:</strong> {booking.patientInfo?.name} ({booking.patientInfo?.age} yrs)</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <Button variant="secondary" style={{ padding: '0.5rem 1rem' }}>View Details</Button>
                  {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      className="btn" 
                      style={{ padding: '0.5rem 1rem', border: '1px solid #ef4444', color: '#ef4444', backgroundColor: 'transparent' }}
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20} color="var(--color-primary)" /> Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/appointments" className="btn btn-secondary" style={{ justifyContent: 'space-between', padding: '1rem' }}>
              Book Appointment <ArrowRight size={16} />
            </Link>
            <Link to="/health" className="btn btn-secondary" style={{ justifyContent: 'space-between', padding: '1rem' }}>
              Update Health Vitals <ArrowRight size={16} />
            </Link>
            <Link to="/health" className="btn btn-secondary" style={{ justifyContent: 'space-between', padding: '1rem' }}>
              Add Medicine Reminder <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      
      </div>
    </div>
  );
};

export default UserDashboard;
