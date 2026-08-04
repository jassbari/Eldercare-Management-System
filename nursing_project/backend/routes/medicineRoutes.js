const express = require('express');
const router = express.Router();
const MedicineReminder = require('../models/MedicineReminder');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/medicines
// @desc    Get all medicine reminders for a user
router.get('/', protect, async (req, res) => {
  try {
    const reminders = await MedicineReminder.find({ userId: req.user._id });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/medicines
// @desc    Add a medicine reminder
router.post('/', protect, async (req, res) => {
  try {
    const { medicineName, time, frequency } = req.body;
    const reminder = await MedicineReminder.create({
      userId: req.user._id,
      medicineName,
      time,
      frequency
    });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/medicines/:id/take
// @desc    Mark medicine as taken for today
router.put('/:id/take', protect, async (req, res) => {
  try {
    const reminder = await MedicineReminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    
    if (reminder.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    reminder.takenDates.push(new Date());
    await reminder.save();
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/medicines/:id
// @desc    Delete a medicine reminder
router.delete('/:id', protect, async (req, res) => {
  try {
    const reminder = await MedicineReminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    
    if (reminder.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await reminder.deleteOne();
    res.json({ message: 'Reminder removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
