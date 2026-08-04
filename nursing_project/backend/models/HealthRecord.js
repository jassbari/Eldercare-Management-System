const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bloodGroup: { type: String, default: '' },
  height: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  bmi: { type: Number, default: 0 },
  bloodPressure: { type: String, default: '' },
  heartRate: { type: Number, default: 0 },
  oxygenLevel: { type: Number, default: 0 },
  sugarLevel: { type: Number, default: 0 },
  temperature: { type: Number, default: 0 },
  allergies: { type: [String], default: [] },
  medicalHistory: { type: String, default: '' },
  currentMedicines: { type: [String], default: [] },
  vaccinationRecords: { type: [String], default: [] },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relation: { type: String, default: '' }
  },
  healthTimeline: [{
    date: { type: Date, default: Date.now },
    event: { type: String },
    description: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
