const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  servicesOffered: [{ type: String }], // e.g., 'Nursing Care', 'Elderly Attendant', 'Physiotherapy'
  hourlyRate: { type: Number, required: true },
  experienceYears: { type: Number, required: true },
  qualifications: [{ type: String }],
  bio: { type: String },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  availability: [{
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String }
  }],
  profileImage: { type: String, default: 'https://via.placeholder.com/150' }
}, { timestamps: true });

const Caregiver = mongoose.model('Caregiver', caregiverSchema);
module.exports = Caregiver;
