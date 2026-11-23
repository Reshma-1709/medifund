const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide password']
    },
    role: {
      type: String,
      enum: ['patient', 'donor', 'hospital', 'ngo', 'admin'],
      default: 'patient'
    },
    profileImage: {
      type: String,
      default: ''
    },
    isEmailVerified: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    organizationDetails: {
      orgName: { type: String, default: '' },
      regNumber: { type: String, default: '' },
      address: { type: String, default: '' },
      contactPerson: { type: String, default: '' },
      licenseDocument: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Static helper to hash password
userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = mongoose.model('User', userSchema);
