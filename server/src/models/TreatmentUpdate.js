const mongoose = require('mongoose');

const treatmentUpdateSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    authorRole: {
      type: String,
      enum: ['hospital', 'patient', 'ngo', 'admin'],
      default: 'hospital'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    stage: {
      type: String,
      enum: [
        'Diagnosis & Admission',
        'Treatment Plan & Tests',
        'Surgery / Procedure',
        'ICU Care',
        'Post-Op Recovery',
        'Discharged & Follow-up'
      ],
      default: 'Treatment Plan & Tests'
    },
    mediaUrls: {
      type: [String],
      default: []
    },
    doctorNotes: {
      type: String,
      default: ''
    },
    recoveryPercentage: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    dischargeDate: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TreatmentUpdate', treatmentUpdateSchema);
