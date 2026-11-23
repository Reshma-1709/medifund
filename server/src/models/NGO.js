const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ngoName: {
      type: String,
      required: true,
      trim: true
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true
    },
    legalEntityType: {
      type: String,
      enum: ['Charitable Trust', 'Registered Society', 'Section 8 Company', 'Non-Profit Organization'],
      default: 'Charitable Trust'
    },
    yearOfEstablishment: {
      type: Number,
      default: 2016
    },
    website: {
      type: String,
      default: 'https://globalhopehealth.org'
    },
    mission: {
      type: String,
      default: 'Providing lifesaving medical funding and healthcare assistance to underserved patients.'
    },
    focusAreas: {
      type: [String],
      default: ['Pediatric Cardiology', 'Oncology Care', 'Emergency Surgery', 'Organ Transplant', 'Intensive Care']
    },
    contactEmail: {
      type: String,
      default: ''
    },
    contactPhone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: 'Chicago'
    },
    state: {
      type: String,
      default: 'IL'
    },
    country: {
      type: String,
      default: 'United States'
    },

    // KYC & Regulatory Verification Documents
    panNumber: {
      type: String,
      default: 'AAATG8941K'
    },
    tanNumber: {
      type: String,
      default: 'CHCG09182F'
    },
    regCertificateDoc: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
    },
    panCardDoc: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
    },
    addressProofDoc: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
    },
    eightyGCertificate: {
      number: { type: String, default: '80G-DEL-2022-8491' },
      docUrl: { type: String, default: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80' },
      validUntil: { type: Date, default: () => new Date(+new Date() + 365 * 24 * 60 * 60 * 1000 * 3) },
      isVerified: { type: Boolean, default: true }
    },
    fcraCertificate: {
      applicable: { type: Boolean, default: true },
      number: { type: String, default: 'FCRA-0839210-2021' },
      docUrl: { type: String, default: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80' },
      validUntil: { type: Date, default: () => new Date(+new Date() + 365 * 24 * 60 * 60 * 1000 * 2) },
      isVerified: { type: Boolean, default: true }
    },
    annualAuditReports: [
      {
        financialYear: { type: String, default: 'FY 2024-25' },
        docUrl: { type: String, default: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80' },
        uploadedAt: { type: Date, default: Date.now },
        verified: { type: Boolean, default: true }
      }
    ],

    // Authorized Representative Details
    repName: {
      type: String,
      default: 'Elena Rostova'
    },
    repDesignation: {
      type: String,
      default: 'Executive Managing Trustee'
    },
    repEmail: {
      type: String,
      default: 'elena@globalhopehealth.org'
    },
    repPhone: {
      type: String,
      default: '+1 (555) 732-9011'
    },
    repIdProofType: {
      type: String,
      default: 'Passport / National Identity Card'
    },
    repIdProofNumber: {
      type: String,
      default: 'PASS-US-8941029'
    },
    repIdProofDoc: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
    },

    // Trust Score & Verification Badge
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'resubmission_required'],
      default: 'verified'
    },
    trustScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 94
    },
    trustBadge: {
      type: String,
      enum: ['Trusted NGO', 'Verified Partner', 'Pending Verification', 'None'],
      default: 'Trusted NGO'
    },
    trustFactors: {
      kycScore: { type: Number, default: 35 },        // Max 35 (Docs & Gov ID verified)
      trackRecordScore: { type: Number, default: 15 }, // Max 15 (Years of operation)
      sponsorshipScore: { type: Number, default: 22 }, // Max 25 (Campaigns completed)
      ratingsScore: { type: Number, default: 14 },     // Max 15 (Donor/Patient ratings)
      complianceScore: { type: Number, default: 8 }    // Max 10 (Audit statements)
    },
    adminReviewNotes: {
      type: String,
      default: 'All KYC documents, 80G validity, PAN records, and authorized trustee identification successfully verified by Compliance Directorate.'
    },
    verifiedAt: {
      type: Date,
      default: Date.now
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // AI Risk Detection & Compliance Monitoring
    aiRiskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 8 // Low risk
    },
    aiRiskLevel: {
      type: String,
      enum: ['Low Risk', 'Moderate Risk', 'High Risk'],
      default: 'Low Risk'
    },
    aiRiskFactors: {
      type: [String],
      default: [
        'Registration certificates match national registry database',
        '80G & FCRA regulatory filings verified active with 2+ years validity',
        'Direct hospital wire disbursals match patient invoices with zero discrepancies',
        'Executive trustee identity verified with biometric/photo ID check'
      ]
    },
    complianceStatus: {
      lastAuditedAt: { type: Date, default: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      nextAuditDue: { type: Date, default: () => new Date(Date.now() + 335 * 24 * 60 * 60 * 1000) },
      taxFilingCurrent: { type: Boolean, default: true },
      discrepanciesDetected: { type: [String], default: [] }
    },

    // Financial & Impact Metrics
    totalFundPool: {
      type: Number,
      default: 150000
    },
    allocatedFunds: {
      type: Number,
      default: 48500
    },
    totalSponsoredPatients: {
      type: Number,
      default: 24
    },
    beneficiaryRatingsAverage: {
      type: Number,
      default: 4.9
    },
    ratingsCount: {
      type: Number,
      default: 42
    },
    surgeriesFunded: {
      type: Number,
      default: 18
    },
    icuDaysFunded: {
      type: Number,
      default: 86
    },

    // Bank Details for Hospital Settlements
    bankDetails: {
      accountName: { type: String, default: 'Global Hope Healthcare Humanitarian Trust' },
      accountNumber: { type: String, default: '987654321098' },
      ifscOrRouting: { type: String, default: 'HDFC0001234' },
      bankName: { type: String, default: 'National Healthcare Federal Bank' }
    }
  },
  { timestamps: true }
);

// Method to calculate trust score dynamically
ngoSchema.methods.calculateTrustScore = function () {
  let score = 0;
  let kyc = 0;
  if (this.regCertificateDoc) kyc += 10;
  if (this.panNumber) kyc += 5;
  if (this.eightyGCertificate?.isVerified) kyc += 10;
  if (this.fcraCertificate?.isVerified || !this.fcraCertificate?.applicable) kyc += 5;
  if (this.addressProofDoc) kyc += 5;

  const currentYear = new Date().getFullYear();
  const years = Math.max(1, currentYear - (this.yearOfEstablishment || 2020));
  const track = Math.min(15, years * 2);

  const sponsorship = Math.min(25, (this.totalSponsoredPatients || 0) * 1.5);
  const ratings = Math.min(15, ((this.beneficiaryRatingsAverage || 4.5) / 5) * 15);
  const compliance = this.complianceStatus?.taxFilingCurrent ? 10 : 4;

  score = Math.round(kyc + track + sponsorship + ratings + compliance);
  score = Math.min(100, Math.max(10, score));

  this.trustScore = score;
  this.trustFactors = {
    kycScore: Math.round(kyc),
    trackRecordScore: Math.round(track),
    sponsorshipScore: Math.round(sponsorship),
    ratingsScore: Math.round(ratings),
    complianceScore: Math.round(compliance)
  };

  if (this.verificationStatus === 'verified' && score >= 80) {
    this.trustBadge = 'Trusted NGO';
  } else if (this.verificationStatus === 'verified') {
    this.trustBadge = 'Verified Partner';
  } else {
    this.trustBadge = 'Pending Verification';
  }

  return score;
};

module.exports = mongoose.model('NGO', ngoSchema);
