import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Heart, Droplets, Scale, Thermometer, Wind, FileText, Pill, Download, Edit2 } from 'lucide-react';

const HealthRecords = () => {
  const [record, setRecord] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showMedForm, setShowMedForm] = useState(false);
  const [medData, setMedData] = useState({ medicineName: '', time: '', frequency: 'Daily' });

  const fetchData = async () => {
    try {
      const [recRes, medRes] = await Promise.all([
        api.get('/health-records'),
        api.get('/medicines')
      ]);
      setRecord(recRes.data);
      setFormData(recRes.data);
      setMedicines(medRes.data);
    } catch (error) {
      toast.error('Failed to load health records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/health-records', formData);
      setRecord(res.data);
      setIsEditing(false);
      toast.success('Health record updated');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleMedSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/medicines', medData);
      toast.success('Medicine reminder added');
      setShowMedForm(false);
      setMedData({ medicineName: '', time: '', frequency: 'Daily' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add medicine');
    }
  };

  const markMedicineTaken = async (id) => {
    try {
      await api.put(`/medicines/${id}/take`);
      toast.success('Marked as taken');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteMedicine = async (id) => {
    try {
      await api.delete(`/medicines/${id}`);
      toast.success('Medicine removed');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '3rem 1.5rem' }}><Skeleton height="400px" /></div>;
  }

  // Dummy trend data ending with the actual user's current reading
  const bpHistory = [
    { name: 'Jan', systolic: 125, diastolic: 82 },
    { name: 'Feb', systolic: 122, diastolic: 80 },
    { name: 'Mar', systolic: 128, diastolic: 85 },
    { name: 'Apr', systolic: 120, diastolic: 79 },
    { name: 'Now', systolic: record.bloodPressure ? parseInt(record.bloodPressure.split('/')[0]) : 120, diastolic: record.bloodPressure ? parseInt(record.bloodPressure.split('/')[1]) : 80 }
  ];

  const bmiHistory = [
    { name: 'Jan', bmi: 24.5 },
    { name: 'Feb', bmi: 24.2 },
    { name: 'Mar', bmi: 23.8 },
    { name: 'Apr', bmi: 23.5 },
    { name: 'Now', bmi: record.bmi || 23.5 }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Activity color="var(--color-primary)" /> Medical Dashboard</h2>
        <Button onClick={() => window.print()} style={{ display: 'flex', gap: '0.5rem' }}><Download size={18}/> Download Full Report (PDF)</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Vitals Overview Cards */}
        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card card-hover stagger-1" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-danger)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-danger-light)', borderRadius: 'var(--radius-md)' }}><Heart color="var(--color-danger)" /></div>
              <div>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Heart Rate</p>
                <h3 style={{ margin: 0 }}>{record.heartRate || '--'} bpm</h3>
              </div>
            </div>
          </div>
          <div className="glass-card card-hover stagger-2" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)' }}><Activity color="var(--color-primary)" /></div>
              <div>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Blood Pressure</p>
                <h3 style={{ margin: 0 }}>{record.bloodPressure || '--/--'}</h3>
              </div>
            </div>
          </div>
          <div className="glass-card card-hover stagger-3" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-secondary)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-secondary-light)', borderRadius: 'var(--radius-md)' }}><Wind color="var(--color-secondary)" /></div>
              <div>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Oxygen (SpO2)</p>
                <h3 style={{ margin: 0 }}>{record.oxygenLevel || '--'}%</h3>
              </div>
            </div>
          </div>
          <div className="glass-card card-hover stagger-4" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-warning)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)' }}><Droplets color="var(--color-warning)" /></div>
              <div>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Sugar Level</p>
                <h3 style={{ margin: 0 }}>{record.sugarLevel || '--'} mg/dL</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Blood Pressure Trends</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <AreaChart data={bpHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <Tooltip contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                <Area type="monotone" dataKey="systolic" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorSystolic)" />
                <Area type="monotone" dataKey="diastolic" stroke="var(--color-secondary)" fillOpacity={0.3} fill="var(--color-secondary)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>BMI History</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={bmiHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="var(--color-text-muted)" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <Tooltip contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                <Line type="monotone" dataKey="bmi" stroke="var(--color-accent)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profile & History Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={20} color="var(--color-primary)" /> Personal Medical Profile</h3>
            <Button variant={isEditing ? "secondary" : "primary"} onClick={() => setIsEditing(!isEditing)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              {isEditing ? 'Cancel Edit' : <><Edit2 size={16} style={{ marginRight: '0.5rem' }}/> Edit Records</>}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleRecordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="Blood Group" value={formData.bloodGroup || ''} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} />
                <Input label="Height (cm)" type="number" value={formData.height || ''} onChange={e => setFormData({...formData, height: e.target.value})} />
                <Input label="Weight (kg)" type="number" value={formData.weight || ''} onChange={e => setFormData({...formData, weight: e.target.value})} />
                <Input label="BMI" type="number" step="0.1" value={formData.bmi || ''} onChange={e => setFormData({...formData, bmi: e.target.value})} />
                <Input label="Blood Pressure (SYS/DIA)" placeholder="e.g. 120/80" value={formData.bloodPressure || ''} onChange={e => setFormData({...formData, bloodPressure: e.target.value})} />
                <Input label="Heart Rate (BPM)" type="number" value={formData.heartRate || ''} onChange={e => setFormData({...formData, heartRate: e.target.value})} />
                <Input label="Oxygen Level (%)" type="number" value={formData.oxygenLevel || ''} onChange={e => setFormData({...formData, oxygenLevel: e.target.value})} />
                <Input label="Sugar Level" type="number" value={formData.sugarLevel || ''} onChange={e => setFormData({...formData, sugarLevel: e.target.value})} />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Medical History & Allergies</label>
                <textarea 
                  value={formData.medicalHistory || ''} 
                  onChange={e => setFormData({...formData, medicalHistory: e.target.value})}
                  rows="4"
                  style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-main)', fontFamily: 'inherit' }}
                />
              </div>
              <Button type="submit" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>Save Changes</Button>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', color: 'var(--color-text-main)' }}>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Blood Group:</span> <br/><strong>{record.bloodGroup || '-'}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Height:</span> <br/><strong>{record.height ? `${record.height} cm` : '-'}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Weight:</span> <br/><strong>{record.weight ? `${record.weight} kg` : '-'}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>BMI:</span> <br/><strong>{record.bmi || '-'}</strong></div>
              <div style={{ gridColumn: 'span 2', marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Past Medical History & Allergies:</strong>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{record.medicalHistory || 'No medical history recorded.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Medicine Reminders Section */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Pill size={20} color="var(--color-warning)" /> Current Medicines</h3>
            <Button onClick={() => setShowMedForm(!showMedForm)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              {showMedForm ? 'Close Form' : '+ Add Medicine'}
            </Button>
          </div>

          {showMedForm && (
            <form onSubmit={handleMedSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
              <Input label="Medicine Name" placeholder="e.g. Lisinopril 10mg" required value={medData.medicineName} onChange={e => setMedData({...medData, medicineName: e.target.value})} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="Time" type="time" required value={medData.time} onChange={e => setMedData({...medData, time: e.target.value})} />
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Frequency</label>
                  <select 
                    value={medData.frequency} 
                    onChange={e => setMedData({...medData, frequency: e.target.value})}
                    style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-main)' }}
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>As Needed</option>
                  </select>
                </div>
              </div>
              <Button type="submit" style={{ alignSelf: 'flex-start' }}>Save Reminder</Button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {medicines.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)' }}>
                <Pill size={32} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <p>No active medicines tracked.</p>
              </div>
            ) : (
              medicines.map(med => {
                const todayStr = new Date().toDateString();
                const takenToday = med.takenDates.some(d => new Date(d).toDateString() === todayStr);
                
                return (
                  <div key={med._id} className="card-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '50%' }}>
                        <Pill size={18} />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{med.medicineName}</h4>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{med.time}</span> • {med.frequency}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {takenToday ? (
                         <span className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>✓ Taken</span>
                      ) : (
                        <Button variant="secondary" onClick={() => markMedicineTaken(med._id)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Take</Button>
                      )}
                      <button onClick={() => deleteMedicine(med._id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>&times;</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;
