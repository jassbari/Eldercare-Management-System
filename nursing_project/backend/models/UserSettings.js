const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  emailNotifications: { type: Boolean, default: true },
  appointmentReminders: { type: Boolean, default: true },
  medicineReminders: { type: Boolean, default: true },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  language: { type: String, default: 'en' },
  privacy: {
    shareHealthData: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('UserSettings', userSettingsSchema);
