const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Caregiver', required: true },
  patientInfo: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    medicalHistory: { type: String }
  },
  serviceType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  totalAmount: { type: Number },
  careNotes: [{
    date: { type: Date, default: Date.now },
    note: { type: String }
  }]
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
