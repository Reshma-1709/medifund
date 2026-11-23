const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    donorName: {
      type: String,
      default: 'Generous Supporter'
    },
    donorEmail: {
      type: String,
      default: 'donor@example.com'
    },
    donorPhone: {
      type: String,
      default: ''
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Amount must be at least 1']
    },
    tipAmount: {
      type: Number,
      default: 0
    },
    paymentProvider: {
      type: String,
      default: 'Cashfree'
    },
    paymentMethod: {
      type: String,
      default: 'UPI'
    },
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true
    },
    cashfreeOrderId: {
      type: String,
      unique: true,
      sparse: true
    },
    cashfreePaymentId: {
      type: String,
      unique: true,
      sparse: true
    },
    paidAt: Date,
    upiTransactionReference: {
      type: String,
      trim: true,
      maxlength: 40,
      unique: true,
      sparse: true
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    verificationNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true
    },
    transactionStatus: {
      type: String,
      enum: ['completed', 'pending', 'failed', 'refunded'],
      default: 'completed'
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Wishing you a speedy recovery and good health!'
    },
    taxDeductible: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
