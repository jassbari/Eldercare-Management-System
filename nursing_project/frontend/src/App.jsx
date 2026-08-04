import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ServiceBrowser from './pages/ServiceBrowser';
import UserDashboard from './pages/UserDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import BookingPage from './pages/BookingPage';
import Appointments from './pages/Appointments';
import HealthRecords from './pages/HealthRecords';
import Settings from './pages/Settings';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import './App.css';


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<><Navbar /><main className="main-content"><Home /></main><Footer /></>} />
            <Route path="/login" element={<><Navbar /><main className="main-content"><Login /></main><Footer /></>} />
            <Route path="/register" element={<><Navbar /><main className="main-content"><Register /></main><Footer /></>} />
            <Route path="/services" element={<><Navbar /><main className="main-content"><ServiceBrowser /></main><Footer /></>} />
            <Route path="/book/:caregiverId" element={<><Navbar /><main className="main-content"><BookingPage /></main><Footer /></>} />
            
            <Route path="/dashboard/user" element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout role="user"><UserDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/caregiver" element={
              <ProtectedRoute allowedRoles={['caregiver']}>
                <DashboardLayout role="caregiver"><CaregiverDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute allowedRoles={['user', 'caregiver']}>
                <DashboardLayout role="user"><Appointments /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/health" element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout role="user"><HealthRecords /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['user', 'caregiver']}>
                <DashboardLayout role="user"><Settings /></DashboardLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
    </AuthProvider>
  );
}

const Footer = () => (
  <footer className="footer">
    <div className="container text-center">
      <p>&copy; 2026 ElderCare Services. All rights reserved.</p>
    </div>
  </footer>
);

export default App;
