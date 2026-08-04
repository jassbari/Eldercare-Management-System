const express = require('express');
const router = express.Router();
const HealthRecord = require('../models/HealthRecord');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/health-records
// @desc    Get user's health record
router.get('/', protect, async (req, res) => {
  try {
    let record = await HealthRecord.findOne({ userId: req.user._id });
    if (!record) {
      record = await HealthRecord.create({ userId: req.user._id });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/health-records
// @desc    Update health record
router.put('/', protect, async (req, res) => {
  try {
    let record = await HealthRecord.findOne({ userId: req.user._id });
    if (!record) {
      record = new HealthRecord({ userId: req.user._id });
    }
    
    const updates = req.body;
    // Handle specific array additions if needed, but for simplicity we can just update the whole object
    // except userId
    delete updates.userId;
    Object.assign(record, updates);
    
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
