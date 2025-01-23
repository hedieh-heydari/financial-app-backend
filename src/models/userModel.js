const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  nationalCode: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  birthDate: { type: Date, default: null },
  mobile: { type: String, default: '' },
  completedProfile: { type: Boolean, default: false }, // Profile completion flag
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
