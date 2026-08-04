const express = require('express');
const router = express.Router();
const Caregiver = require('../models/Caregiver');

// @route   GET /api/caregivers
// @desc    Get all verified caregivers
router.get('/', async (req, res) => {
  try {
    // For now returning all, but should ideally filter by isVerified: true
    const caregivers = await Caregiver.find({}).populate('userId', 'name email phone');
    res.json(caregivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/caregivers/:id
// @desc    Get caregiver by ID
router.get('/:id', async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id).populate('userId', 'name email phone address');
    if (caregiver) {
      res.json(caregiver);
    } else {
      res.status(404).json({ message: 'Caregiver not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
