import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Heart, Users, CheckCircle, PhoneCall, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-surface) 100%)',
        padding: '6rem 1.5rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container">
          <span style={{ 
            display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: 'var(--color-accent-light)', 
            color: 'var(--color-accent-light)', /* Wait, the text color should be accent, background accent-light */
            borderRadius: '999px', fontWeight: 'bold', marginBottom: '1.5rem'
          }}>
            <span style={{ color: 'var(--color-accent)' }}>#1 Premium Healthcare Platform</span>
          </span>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
            Modern Healthcare, <br /> Brought to Your Home
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            Experience world-class medical assistance, nursing care, and continuous health monitoring from trusted professionals—all from the comfort of your home.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Find a Caregiver
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Join as a Professional
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{ padding: '3rem 0', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { label: 'Happy Patients', value: '10k+' },
            { label: 'Certified Caregivers', value: '500+' },
            { label: 'Years of Trust', value: '15+' },
            { label: 'Support Available', value: '24/7' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{stat.value}</div>
              <div style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>Why Choose Us?</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 4rem' }}>
          We set the standard for premium at-home healthcare with strict vetting and continuous monitoring.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { icon: Shield, title: 'Verified Professionals', desc: 'Every caregiver goes through a rigorous 5-step background and medical certification check.' },
            { icon: Clock, title: '24/7 Availability', desc: 'Medical emergencies don\'t wait. Neither do we. We provide round-the-clock support.' },
            { icon: Heart, title: 'Personalized Care', desc: 'Custom health plans tailored specifically for your loved ones\' medical history and needs.' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="glass-card card-hover" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                  <Icon size={32} />
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Our Services */}
      <section style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '5rem 1.5rem' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem', color: 'white' }}>Premium Care Services</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            <div className="glass-card card-hover" style={{ padding: '2rem', backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <h3 style={{ marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={24} color="var(--color-accent)" /> Nursing Care
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Post-surgery care, wound dressing, IV therapies, and daily vitals monitoring by registered nurses.</p>
            </div>

            <div className="glass-card card-hover" style={{ padding: '2rem', backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <h3 style={{ marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={24} color="var(--color-accent)" /> Physiotherapy
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Mobility improvement, pain management, and neuro-rehabilitation programs at home.</p>
            </div>

            <div className="glass-card card-hover" style={{ padding: '2rem', backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <h3 style={{ marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={24} color="var(--color-accent)" /> Specialized Elder Care
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Dementia care, bedridden patient support, and compassionate daily assistance.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Emergency SOS Banner */}
      <section style={{ backgroundColor: 'var(--color-danger-light)', padding: '3rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <PhoneCall size={48} color="var(--color-danger)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>Need Immediate Medical Assistance?</h2>
          <p style={{ color: 'var(--color-text-main)', marginBottom: '2rem', fontSize: '1.25rem' }}>Our emergency response team is available 24/7 for critical situations.</p>
          <a href="tel:911" className="btn btn-danger" style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}>Call Emergency Line</a>
        </div>
      </section>

    </div>
  );
};

export default Home;
