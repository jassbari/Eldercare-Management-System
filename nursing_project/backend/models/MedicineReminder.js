const mongoose = require('mongoose');

const medicineReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineName: { type: String, required: true },
  time: { type: String, required: true },
  frequency: { type: String, required: true }, // e.g., 'Daily', 'Weekly'
  takenDates: { type: [Date], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('MedicineReminder', medicineReminderSchema);
