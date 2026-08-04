const express = require('express');
const router = express.Router();
const UserSettings = require('../models/UserSettings');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// @route   GET /api/settings
// @desc    Get user settings
router.get('/', protect, async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ userId: req.user._id });
    if (!settings) {
      settings = await UserSettings.create({ userId: req.user._id });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update user settings
router.put('/', protect, async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ userId: req.user._id });
    if (!settings) {
      settings = new UserSettings({ userId: req.user._id });
    }
    
    const { emailNotifications, appointmentReminders, medicineReminders, theme, language, privacy } = req.body;
    
    if (emailNotifications !== undefined) settings.emailNotifications = emailNotifications;
    if (appointmentReminders !== undefined) settings.appointmentReminders = appointmentReminders;
    if (medicineReminders !== undefined) settings.medicineReminders = medicineReminders;
    if (theme !== undefined) settings.theme = theme;
    if (language !== undefined) settings.language = language;
    if (privacy !== undefined) settings.privacy = privacy;
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings/profile
// @desc    Update user profile details
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const { name, email, phone, address } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings/security
// @desc    Update user password
router.put('/security', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const { currentPassword, newPassword } = req.body;
    
    if (await user.matchPassword(currentPassword)) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Incorrect current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
