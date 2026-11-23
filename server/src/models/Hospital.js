const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hospitalName: {
      type: String,
      required: true,
      trim: true
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true
    },
    licenseNumber: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    contactEmail: {
      type: String,
      default: ''
    },
    contactPhone: {
      type: String,
      default: ''
    },
    departments: {
      type: [String],
      default: ['Oncology', 'Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'Emergency']
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'verified'
    },
    bedCount: {
      type: Number,
      default: 250
    },
    doctorCount: {
      type: Number,
      default: 45
    },
    accreditation: {
      type: String,
      default: 'NABH & JCI Certified'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
