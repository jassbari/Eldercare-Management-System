import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Calendar as CalendarIcon, Clock, User, FileText, Search, Filter } from 'lucide-react';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caregivers, setCaregivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [caregiverId, setCaregiverId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCaregivers = async () => {
    try {
      const response = await api.get('/caregivers');
      setCaregivers(response.data);
    } catch (error) {
      console.error('Failed to load caregivers', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    if (user?.role === 'user') {
      fetchCaregivers();
    }
  }, [user]);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', { caregiverId, date, time, symptoms });
      toast.success('Appointment booked successfully!');
      setShowForm(false);
      setCaregiverId('');
      setDate('');
      setTime('');
      setSymptoms('');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  const updateStatus = async (id, status, notes = '') => {
    try {
      await api.put(`/appointments/${id}/status`, { status, visitNotes: notes });
      toast.success(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = user?.role === 'user' 
      ? apt.caregiverId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : apt.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CalendarIcon color="var(--color-primary)" /> Appointments Center</h2>
        {user?.role === 'user' && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close Booking Form' : '+ Book Appointment'}
          </Button>
        )}
      </div>

      {showForm && user?.role === 'user' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', borderTop: '4px solid var(--color-primary)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Book New Appointment</h3>
          <form onSubmit={handleBook} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Professional Caregiver</label>
              <select 
                value={caregiverId} 
                onChange={(e) => setCaregiverId(e.target.value)} 
                required
                style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-main)', fontSize: '1rem' }}
              >
                <option value="">-- Choose from available professionals --</option>
                {caregivers.map(c => (
                  <option key={c.userId?._id} value={c.userId?._id}>{c.userId?.name} - {c.specialization || 'Caregiver'} (₹{c.hourlyRate}/hr)</option>
                ))}
              </select>
            </div>
            <Input label="Preferred Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Input label="Preferred Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Symptoms / Medical Notes</label>
              <textarea 
                value={symptoms} 
                onChange={(e) => setSymptoms(e.target.value)}
                rows="3"
                placeholder="Briefly describe the symptoms or reason for visit..."
                style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-main)', fontFamily: 'inherit', fontSize: '1rem' }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" style={{ padding: '1rem 3rem' }}>Confirm Booking</Button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ margin: 0 }}>Upcoming & Past Appointments</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem', width: '200px' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Filter size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem', width: '150px', cursor: 'pointer' }}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
             <Skeleton height="100px" />
             <Skeleton height="100px" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            <CalendarIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No appointments found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {filteredAppointments.map(apt => (
              <div key={apt._id} className="card-hover" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', backgroundColor: 'var(--color-surface)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: apt.status === 'Cancelled' ? 'var(--color-danger)' : apt.status === 'Confirmed' ? 'var(--color-accent)' : apt.status === 'Completed' ? 'var(--color-primary)' : 'var(--color-warning)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                  <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={18} color="var(--color-primary)" />
                    {user?.role === 'user' ? apt.caregiverId?.name : apt.patientId?.name}
                  </h4>
                  <span className={`badge badge-${apt.status === 'Cancelled' ? 'danger' : apt.status === 'Confirmed' ? 'success' : apt.status === 'Completed' ? 'primary' : 'warning'}`}>
                    {apt.status}
                  </span>
                </div>
                
                <div style={{ paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                    <CalendarIcon size={16} /> {new Date(apt.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                    <Clock size={16} /> {apt.time}
                  </div>
                  {apt.symptoms && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <FileText size={16} style={{ marginTop: '0.25rem', color: 'var(--color-text-muted)' }} />
                      <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Symptoms:</strong> {apt.symptoms}</p>
                    </div>
                  )}
                  {apt.visitNotes && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <FileText size={16} style={{ marginTop: '0.25rem', color: 'var(--color-text-muted)' }} />
                      <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Notes:</strong> {apt.visitNotes}</p>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingLeft: '0.5rem' }}>
                  {user?.role === 'user' && apt.status === 'Pending' && (
                    <button onClick={() => cancelAppointment(apt._id)} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Cancel Request</button>
                  )}
                  {user?.role === 'caregiver' && apt.status === 'Pending' && (
                    <>
                      <Button onClick={() => updateStatus(apt._id, 'Confirmed')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Accept</Button>
                      <button onClick={() => updateStatus(apt._id, 'Cancelled')} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Reject</button>
                    </>
                  )}
                  {user?.role === 'caregiver' && apt.status === 'Confirmed' && (
                    <Button onClick={() => updateStatus(apt._id, 'Completed')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: '100%' }}>Mark as Completed</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
