import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';

const CaregiverDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/bookings/caregiver');
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Request ${newStatus.toLowerCase()} successfully`);
      fetchRequests(); // Refresh list
    } catch (error) {
      toast.error(`Failed to update request`);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Caregiver Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ height: '12px', width: '12px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', display: 'inline-block' }}></span>
          <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Available</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card card-hover stagger-1" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text-muted)' }}>Today's Visits</h4>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}><Calendar size={20} /></div>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-primary)' }}>1</p>
        </div>

        <div className="glass-card card-hover stagger-2" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text-muted)' }}>Pending Requests</h4>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-warning)' }}><Clock size={20} /></div>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-warning)' }}>{requests.filter(r => r.status === 'Pending').length}</p>
        </div>

        <div className="glass-card card-hover stagger-3" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text-muted)' }}>Completed Visits</h4>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-accent-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-accent)' }}><CheckCircle size={20} /></div>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>12</p>
        </div>

        <div className="glass-card card-hover stagger-4" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text-muted)' }}>Active Patients</h4>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-secondary-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-secondary)' }}><Users size={20} /></div>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-secondary)' }}>4</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3>Incoming Requests</h3>
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <Skeleton height="200px" />
            <Skeleton height="200px" />
          </div>
        ) : requests.length === 0 ? (
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>No incoming requests found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {requests.map((request) => (
              <div key={request._id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{request.serviceType}</h4>
                    <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                      Date: {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{ 
                    backgroundColor: request.status === 'Cancelled' ? '#fee2e2' : request.status === 'Accepted' ? '#dcfce7' : request.status === 'Rejected' ? '#fee2e2' : '#fef3c7', 
                    color: request.status === 'Cancelled' ? '#ef4444' : request.status === 'Accepted' ? '#16a34a' : request.status === 'Rejected' ? '#ef4444' : '#d97706',
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontWeight: '600',
                    height: 'fit-content'
                  }}>
                    {request.status}
                  </span>
                </div>
                
                <p><strong>Patient:</strong> {request.patientInfo?.name} ({request.patientInfo?.age} yrs) - {request.patientInfo?.medicalHistory}</p>
                <p><strong>Contact:</strong> {request.userId?.name} ({request.userId?.phone})</p>
                
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  {request.status === 'Pending' && (
                    <>
                      <Button onClick={() => handleUpdateStatus(request._id, 'Accepted')}>Accept Request</Button>
                      <button 
                        onClick={() => handleUpdateStatus(request._id, 'Rejected')}
                        className="btn" 
                        style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none' }}
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {request.status === 'Accepted' && (
                    <Button variant="secondary" onClick={() => handleUpdateStatus(request._id, 'In Progress')}>Mark In Progress</Button>
                  )}
                  {request.status === 'In Progress' && (
                    <Button onClick={() => handleUpdateStatus(request._id, 'Completed')}>Mark Completed</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Visit Timeline</h3>
          <div style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: '1rem', marginLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-1.35rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>10:00 AM - Check Vitals</p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Patient: Alice Johnson</p>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-1.35rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-border)' }}></div>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: 'var(--color-text-muted)' }}>02:00 PM - Physiotherapy</p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Patient: Robert Smith</p>
            </div>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default CaregiverDashboard;
