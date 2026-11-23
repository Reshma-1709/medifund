const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    age: {
      type: Number,
      default: 30
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Male'
    },
    bloodGroup: {
      type: String,
      default: 'O+'
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relationship: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    medicalCondition: {
      type: String,
      default: ''
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null
    },
    qrCodeUrl: {
      type: String,
      default: ''
    },
    upiId: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9._-]{2,256}@[a-z0-9.-]{2,64}$/, 'Enter a valid UPI ID'],
      default: ''
    },
    documents: [
      {
        title: { type: String, required: true },
        docType: { type: String, default: 'Medical Report' },
        fileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        verificationStatus: {
          type: String,
          enum: ['pending', 'verified', 'rejected'],
          default: 'pending'
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
