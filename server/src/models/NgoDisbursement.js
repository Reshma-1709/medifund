const mongoose = require('mongoose');

const ngoDisbursementSchema = new mongoose.Schema(
  {
    ngoUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    recipientType: {
      type: String,
      enum: ['patient', 'hospital'],
      required: true
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    transactionReference: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    purpose: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    status: {
      type: String,
      enum: ['recorded'],
      default: 'recorded'
    }
  },
  { timestamps: true }
);

ngoDisbursementSchema.index({ ngoUserId: 1, transactionReference: 1 }, { unique: true });

module.exports = mongoose.model('NgoDisbursement', ngoDisbursementSchema);
