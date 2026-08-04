const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/appointments
// @desc    Book a new appointment
router.post('/', protect, async (req, res) => {
  try {
    const { caregiverId, date, time, symptoms } = req.body;
    const appointment = await Appointment.create({
      patientId: req.user._id,
      caregiverId,
      date,
      time,
      symptoms
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/appointments
// @desc    Get user's appointments
router.get('/', protect, async (req, res) => {
  try {
    // If caregiver, get assigned appointments; if user, get their bookings
    let query = { patientId: req.user._id };
    if (req.user.role === 'caregiver') {
      query = { caregiverId: req.user._id };
    }
    const appointments = await Appointment.find(query).populate('caregiverId', 'name email').populate('patientId', 'name email phone').sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, visitNotes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    appointment.status = status || appointment.status;
    if (visitNotes) appointment.visitNotes = visitNotes;
    
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel/Delete an appointment
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    if (appointment.patientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    appointment.status = 'Cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
