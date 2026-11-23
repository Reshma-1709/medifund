const mongoose = require('mongoose');

const caseTransferSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    fromNgoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true
    },
    toNgoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    amountNeeded: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CaseTransfer', caseTransferSchema);
