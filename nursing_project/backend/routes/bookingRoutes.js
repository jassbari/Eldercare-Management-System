const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Caregiver = require('../models/Caregiver');
const { protect } = require('../middleware/authMiddleware');



// @route   POST /api/bookings
// @desc    Create new booking
router.post('/', protect, async (req, res) => {
  try {
    const { caregiverId, patientInfo, serviceType, startDate, endDate, totalAmount } = req.body;
    
    const userId = req.user._id;

    const booking = new Booking({
      userId,
      caregiverId,
      patientInfo,
      serviceType,
      startDate,
      endDate,
      totalAmount
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/mybookings
// @desc    Get logged in user bookings
router.get('/mybookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('caregiverId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/caregiver
// @desc    Get logged in caregiver bookings
router.get('/caregiver', protect, async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ userId: req.user._id });
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver profile not found' });
    }
    const bookings = await Booking.find({ caregiverId: caregiver._id })
      .populate('userId', 'name email phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (Admin/Test)
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name')
      .populate('caregiverId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
