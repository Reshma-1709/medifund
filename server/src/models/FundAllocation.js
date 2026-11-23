const mongoose = require('mongoose');

const fundAllocationSchema = new mongoose.Schema(
  {
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    purpose: {
      type: String,
      default: 'Hospital Bill Settlement - Surgery & Medications'
    },
    billInvoiceNumber: {
      type: String,
      default: () => 'INV-' + Math.floor(100000 + Math.random() * 900000)
    },
    billDocumentUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
    },
    status: {
      type: String,
      enum: ['pending', 'released', 'rejected'],
      default: 'released'
    },
    releaseDate: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      default: 'Direct hospital account transfer processed for verified patient billing.'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FundAllocation', fundAllocationSchema);
