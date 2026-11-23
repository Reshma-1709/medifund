const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    clientCampaignId: {
      type: String,
      trim: true,
      maxlength: 100
    },
    patientName: {
      type: String,
      required: true
    },
    patientAge: {
      type: Number,
      default: 30
    },
    patientGender: {
      type: String,
      default: 'Male'
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null
    },
    hospitalName: {
      type: String,
      default: 'Apollo General Hospital'
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      default: null
    },
    ngoName: {
      type: String,
      default: 'Global Hope Healthcare Foundation'
    },
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true
    },
    category: {
      type: String,
      enum: [
        'Cardiology',
        'Oncology',
        'Organ Transplant',
        'Pediatrics',
        'Neurology',
        'Orthopedics',
        'Rare Diseases',
        'Emergency Care',
        'Other'
      ],
      default: 'Cardiology'
    },
    description: {
      type: String,
      required: true
    },
    story: {
      type: String,
      required: true
    },
    fundingGoal: {
      type: Number,
      required: [true, 'Funding goal is required'],
      min: [100, 'Goal must be at least 100']
    },
    raisedAmount: {
      type: Number,
      default: 0
    },
    donorsCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: [
        'draft',
        'pending_hospital',
        'pending_ngo',
        'approved',
        'rejected',
        'completed',
        'suspended'
      ],
      default: 'approved'
    },
    urgency: {
      type: String,
      enum: ['normal', 'urgent', 'critical'],
      default: 'normal'
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
    },
    qrCodeUrl: {
      type: String,
      default: ''
    },
    upiId: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    medicalDocuments: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        docType: { type: String, default: 'Hospital Bill & Clinical Report' },
        verified: { type: Boolean, default: true },
        notes: { type: String, default: '' }
      }
    ],
    verifiedByHospital: {
      type: Boolean,
      default: true
    },
    verifiedByNgo: {
      type: Boolean,
      default: true
    },
    hospitalReviewNotes: {
      type: String,
      default: 'Medical reports verified by Senior Resident Physician. Diagnosis matches hospital admission record.'
    },
    ngoReviewNotes: {
      type: String,
      default: 'Income background and family dependency verified for humanitarian medical aid.'
    },
    hospitalEstimate: {
      type: Number,
      default: 0
    },
    treatmentStage: {
      type: String,
      default: 'Treatment Plan & Tests'
    },
    featured: {
      type: Boolean,
      default: false
    },
    fundsReleased: {
      type: Number,
      default: 0
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    deadline: {
      type: Date,
      default: () => new Date(+new Date() + 60 * 24 * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
);

campaignSchema.index(
  { patientId: 1, clientCampaignId: 1 },
  { unique: true, partialFilterExpression: { clientCampaignId: { $type: 'string' } } }
);

module.exports = mongoose.model('Campaign', campaignSchema);
