const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiLimiter);

const authRoutes = require('./routes/authRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const healthRecordRoutes = require('./routes/healthRecordRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/settings', settingsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nursing_db';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    console.log('Continuing without database connection for now...');
    // Still listen so frontend doesn't crash completely, but API will fail
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (NO DATABASE)`);
    });
  });
