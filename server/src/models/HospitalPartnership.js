const mongoose = require('mongoose');

const hospitalPartnershipSchema = new mongoose.Schema(
  {
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true
    },
    partnershipType: {
      type: String,
      enum: [
        'Subsidized Surgery Tariff',
        'Emergency ICU Bed Quota',
        'Grant Matching Protocol',
        'Comprehensive Clinical MOU'
      ],
      default: 'Subsidized Surgery Tariff'
    },
    specialties: {
      type: [String],
      default: ['Cardiology', 'Oncology', 'Pediatrics', 'Emergency Care']
    },
    discountPercentage: {
      type: Number,
      default: 20,
      min: 0,
      max: 100
    },
    bedQuota: {
      type: Number,
      default: 5
    },
    mouTerms: {
      type: String,
      default: 'Hospital agrees to prioritize emergency admission and apply humanitarian tariff rates for verified patient cases co-sponsored by partner NGO.'
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'declined'],
      default: 'active'
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    responseNotes: {
      type: String,
      default: 'Approved by Hospital Medical Board and Chief Medical Officer.'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HospitalPartnership', hospitalPartnershipSchema);
