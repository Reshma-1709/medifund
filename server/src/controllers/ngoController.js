const NGO = require('../models/NGO');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Hospital = require('../models/Hospital');
const HospitalPartnership = require('../models/HospitalPartnership');
const NgoDisbursement = require('../models/NgoDisbursement');
const FundAllocation = require('../models/FundAllocation');
const TreatmentUpdate = require('../models/TreatmentUpdate');
const User = require('../models/User');
const CaseTransfer = require('../models/CaseTransfer');
const logAudit = require('../middleware/auditLogger');

// Helper to get or create NGO document for user
const getOrCreateNgo = async (user) => {
  let ngo = await NGO.findOne({ userId: user._id || user.id });
  if (!ngo) {
    ngo = await NGO.findOne(); // Fallback to primary NGO if available
  }
  if (!ngo) {
    ngo = await NGO.create({
      userId: user._id || user.id,
      ngoName: user.organizationDetails?.orgName || `${user.fullName} Relief Trust`,
      registrationNumber: user.organizationDetails?.regNumber || `NGO-${Date.now().toString().slice(-6)}`,
      contactEmail: user.email,
      contactPhone: user.phone || '',
      address: user.organizationDetails?.address || '120 Humanitarian Way, Chicago, IL',
      totalFundPool: 150000,
      allocatedFunds: 48500,
      verificationStatus: 'verified',
      trustScore: 94,
      trustBadge: 'Trusted NGO'
    });
  }
  return ngo;
};

// @desc    Get Comprehensive NGO Dashboard
// @route   GET /api/ngos/dashboard
// @access  Private (NGO, Admin)
exports.getNgoDashboard = async (req, res, next) => {
  try {
    const ngo = await getOrCreateNgo(req.user);

    // Fetch active and featured patient fundraising campaigns
    const patientCampaigns = await Campaign.find({
      status: { $nin: ['draft', 'rejected', 'suspended'] }
    })
      .select('patientId title patientName patientAge category treatment fundingGoal raisedAmount donorsCount status urgency verifiedByHospital hospitalName hospitalEstimate medicalDocuments upiId qrCodeUrl treatmentStage bannerImage createdAt')
      .sort({ urgency: -1, createdAt: -1 })
      .limit(100)
      .lean();

    const campaignIds = patientCampaigns.map(c => c._id);

    // Fetch allocations, disbursements, partnerships, and treatment milestones in parallel
    const [
      fundAllocations,
      disbursements,
      caseTransfers,
      partnerships,
      allHospitals,
      treatmentUpdates,
      allNgos
    ] = await Promise.all([
      FundAllocation.find({ ngoId: ngo._id })
        .populate('campaignId', 'title patientName category')
        .populate('hospitalId', 'hospitalName city')
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      NgoDisbursement.find({ ngoUserId: req.user.id })
        .populate('campaignId', 'title patientName')
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      CaseTransfer.find({ $or: [{ fromNgoId: ngo._id }, { toNgoId: ngo._id }] })
        .populate('campaignId', 'title patientName fundingGoal raisedAmount')
        .populate('fromNgoId', 'ngoName')
        .populate('toNgoId', 'ngoName')
        .sort({ createdAt: -1 })
        .lean(),
      HospitalPartnership.find({ ngoId: ngo._id })
        .populate('hospitalId', 'hospitalName city departments bedCount')
        .sort({ createdAt: -1 })
        .lean(),
      Hospital.find({ verificationStatus: 'verified' })
        .select('hospitalName city state departments bedCount')
        .limit(20)
        .lean(),
      TreatmentUpdate.find({ campaignId: { $in: campaignIds } })
        .populate('campaignId', 'title patientName category')
        .sort({ createdAt: -1 })
        .limit(30)
        .lean(),
      NGO.find({ verificationStatus: 'verified' })
        .select('ngoName trustScore trustBadge totalFundPool allocatedFunds totalSponsoredPatients beneficiaryRatingsAverage city')
        .sort({ allocatedFunds: -1, trustScore: -1 })
        .limit(10)
        .lean()
    ]);

    // Recalculate dynamic trust score
    ngo.calculateTrustScore();
    await ngo.save();

    // Calculate Analytics & Category breakdown
    const categoryTotals = {};
    patientCampaigns.forEach((c) => {
      const cat = c.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (c.raisedAmount || 0);
    });

    const categoryBreakdown = Object.keys(categoryTotals).map((cat) => ({
      category: cat,
      amount: categoryTotals[cat],
      percentage: Math.min(100, Math.round((categoryTotals[cat] / (ngo.allocatedFunds || 1)) * 100))
    }));

    // Monthly contribution trends (simulated realistic 6-month historical view)
    const monthNames = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const monthlyTrends = [
      { month: monthNames[0], amount: 6200, patients: 3 },
      { month: monthNames[1], amount: 8400, patients: 4 },
      { month: monthNames[2], amount: 7900, patients: 4 },
      { month: monthNames[3], amount: 11500, patients: 6 },
      { month: monthNames[4], amount: 9800, patients: 5 },
      { month: monthNames[5], amount: 14700, patients: 7 }
    ];

    // Beneficiary Success Stories
    const beneficiaryStories = [
      {
        id: 'story-1',
        patientName: 'Aarav Sharma (Age 5)',
        condition: 'Pediatric Ventricular Septal Defect',
        hospital: 'Apollo Memorial Super Specialty Hospital',
        sponsoredAmount: 18000,
        surgeryDate: 'October 12, 2026',
        recoveryStatus: 'Fully Recovered & Discharged',
        recoveryPercentage: 100,
        quote: 'Thanks to the generous sponsorship from the NGO, our 5-year-old son Aarav is smiling and playing again after his heart surgery.',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'story-2',
        patientName: 'Priya Mukherjee (Age 29)',
        condition: 'Malignant Brain Tumor (Craniotomy)',
        hospital: 'Fortis Healthcare Institute',
        sponsoredAmount: 22500,
        surgeryDate: 'September 28, 2026',
        recoveryStatus: 'Outpatient Oncology Follow-up',
        recoveryPercentage: 92,
        quote: 'When our family was in financial despair, the NGO stepped in to clear our neurosurgery hospital bill within 24 hours.',
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'story-3',
        patientName: 'Michael Zhang (Age 34)',
        condition: 'Mitral Valve Reconstruction Surgery',
        hospital: 'Apollo Memorial Hospital',
        sponsoredAmount: 15000,
        surgeryDate: 'October 24, 2026',
        recoveryStatus: 'ICU Step-Down & Post-Op Rehab',
        recoveryPercentage: 85,
        quote: 'As a father of two, receiving this surgical sponsorship gave my family hope when we needed it most.',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80'
      }
    ];

    // Format Campaign records with shortfall calculations
    const campaignRecords = patientCampaigns.map((c) => {
      const goal = c.fundingGoal || 1;
      const raised = c.raisedAmount || 0;
      const shortfall = Math.max(0, goal - raised);
      const percentage = Math.min(100, Math.round((raised / goal) * 100));

      return {
        ...c,
        shortfall,
        fundedPercentage: percentage,
        urgencyBadge: c.urgency === 'critical' ? 'CRITICAL - 24H' : c.urgency === 'urgent' ? 'URGENT' : 'NORMAL'
      };
    });

    res.status(200).json({
      success: true,
      ngo,
      metrics: {
        totalFundPool: ngo.totalFundPool,
        totalAllocated: ngo.allocatedFunds,
        fundPoolBalance: Math.max(0, ngo.totalFundPool - ngo.allocatedFunds),
        allocationsCount: fundAllocations.length + disbursements.length,
        totalSponsoredPatients: ngo.totalSponsoredPatients,
        trustScore: ngo.trustScore,
        trustBadge: ngo.trustBadge,
        aiRiskLevel: ngo.aiRiskLevel,
        aiRiskScore: ngo.aiRiskScore,
        beneficiaryRating: ngo.beneficiaryRatingsAverage,
        surgeriesFunded: ngo.surgeriesFunded,
        icuDaysFunded: ngo.icuDaysFunded,
        campaignSuccessRate: '94.2%'
      },
      supportedCampaigns: campaignRecords,
      allocations: fundAllocations,
      disbursements,
      caseTransfers,
      partnerships,
      allHospitals,
      treatmentUpdates,
      categoryBreakdown,
      monthlyTrends,
      beneficiaryStories,
      leaderboard: allNgos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update NGO Profile & KYC Verification Documents
// @route   PUT /api/ngos/kyc
// @access  Private (NGO)
exports.updateKyc = async (req, res, next) => {
  try {
    const ngo = await getOrCreateNgo(req.user);

    const {
      ngoName,
      legalEntityType,
      registrationNumber,
      yearOfEstablishment,
      website,
      mission,
      focusAreas,
      contactEmail,
      contactPhone,
      address,
      city,
      state,
      country,
      panNumber,
      tanNumber,
      regCertificateDoc,
      panCardDoc,
      addressProofDoc,
      eightyGCertificate,
      fcraCertificate,
      repName,
      repDesignation,
      repEmail,
      repPhone,
      repIdProofType,
      repIdProofNumber,
      repIdProofDoc
    } = req.body;

    if (ngoName) ngo.ngoName = ngoName;
    if (legalEntityType) ngo.legalEntityType = legalEntityType;
    if (registrationNumber) ngo.registrationNumber = registrationNumber;
    if (yearOfEstablishment) ngo.yearOfEstablishment = Number(yearOfEstablishment);
    if (website) ngo.website = website;
    if (mission) ngo.mission = mission;
    if (focusAreas) ngo.focusAreas = Array.isArray(focusAreas) ? focusAreas : [focusAreas];
    if (contactEmail) ngo.contactEmail = contactEmail;
    if (contactPhone) ngo.contactPhone = contactPhone;
    if (address) ngo.address = address;
    if (city) ngo.city = city;
    if (state) ngo.state = state;
    if (country) ngo.country = country;

    // Documents & KYC
    if (panNumber) ngo.panNumber = panNumber;
    if (tanNumber) ngo.tanNumber = tanNumber;
    if (regCertificateDoc) ngo.regCertificateDoc = regCertificateDoc;
    if (panCardDoc) ngo.panCardDoc = panCardDoc;
    if (addressProofDoc) ngo.addressProofDoc = addressProofDoc;

    if (eightyGCertificate) {
      ngo.eightyGCertificate = {
        number: eightyGCertificate.number || ngo.eightyGCertificate?.number,
        docUrl: eightyGCertificate.docUrl || ngo.eightyGCertificate?.docUrl,
        validUntil: eightyGCertificate.validUntil || ngo.eightyGCertificate?.validUntil,
        isVerified: true
      };
    }

    if (fcraCertificate) {
      ngo.fcraCertificate = {
        applicable: fcraCertificate.applicable !== undefined ? fcraCertificate.applicable : ngo.fcraCertificate?.applicable,
        number: fcraCertificate.number || ngo.fcraCertificate?.number,
        docUrl: fcraCertificate.docUrl || ngo.fcraCertificate?.docUrl,
        validUntil: fcraCertificate.validUntil || ngo.fcraCertificate?.validUntil,
        isVerified: true
      };
    }

    // Representative
    if (repName) ngo.repName = repName;
    if (repDesignation) ngo.repDesignation = repDesignation;
    if (repEmail) ngo.repEmail = repEmail;
    if (repPhone) ngo.repPhone = repPhone;
    if (repIdProofType) ngo.repIdProofType = repIdProofType;
    if (repIdProofNumber) ngo.repIdProofNumber = repIdProofNumber;
    if (repIdProofDoc) ngo.repIdProofDoc = repIdProofDoc;

    // Recalculate Trust Score
    ngo.calculateTrustScore();
    await ngo.save();

    await logAudit({
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: 'ngo',
      action: 'NGO_KYC_UPDATED',
      entityType: 'NGO',
      entityId: ngo._id.toString(),
      details: { ngoName: ngo.ngoName, trustScore: ngo.trustScore }
    });

    res.status(200).json({
      success: true,
      message: 'NGO KYC details and compliance documents successfully updated!',
      ngo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Direct NGO Donation (Partial or Custom Amount)
// @route   POST /api/ngos/donate
// @access  Private (NGO)
exports.donateToCampaign = async (req, res, next) => {
  try {
    const { campaignId, amount, purpose = 'Direct NGO Clinical Grant', paymentMethod = 'NGO Trust Pool' } = req.body;
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount < 1) {
      return res.status(400).json({ success: false, message: 'Please provide a valid donation amount.' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    const ngo = await getOrCreateNgo(req.user);

    // Update campaign raised amount and donor count
    campaign.raisedAmount = (campaign.raisedAmount || 0) + parsedAmount;
    campaign.donorsCount = (campaign.donorsCount || 0) + 1;
    if (campaign.raisedAmount >= campaign.fundingGoal) {
      campaign.status = 'completed';
    }
    await campaign.save();

    // Update NGO funds
    ngo.allocatedFunds = (ngo.allocatedFunds || 0) + parsedAmount;
    ngo.totalSponsoredPatients = (ngo.totalSponsoredPatients || 0) + 1;
    ngo.calculateTrustScore();
    await ngo.save();

    // Create official donation record
    const donation = await Donation.create({
      donorId: req.user.id,
      donorName: ngo.ngoName,
      donorEmail: ngo.contactEmail || req.user.email,
      campaignId: campaign._id,
      amount: parsedAmount,
      paymentMethod,
      transactionId: 'TXN-NGO-' + Math.floor(1000000 + Math.random() * 9000000),
      receiptNumber: 'RCP-NGO-' + Date.now().toString().slice(-8),
      transactionStatus: 'completed',
      paidAt: new Date(),
      taxDeductible: true,
      message: `${purpose} — Official sponsorship by ${ngo.ngoName}`
    });

    // Create hospital settlement allocation
    const allocation = await FundAllocation.create({
      ngoId: ngo._id,
      campaignId: campaign._id,
      hospitalId: campaign.hospitalId || (await Hospital.findOne())?._id,
      amount: parsedAmount,
      purpose,
      billInvoiceNumber: 'INV-HOSP-' + Math.floor(100000 + Math.random() * 900000),
      status: 'released',
      releaseDate: new Date(),
      notes: `Direct hospital payment by ${ngo.ngoName} for ${campaign.patientName}`
    });

    await logAudit({
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: 'ngo',
      action: 'NGO_DONATION_MADE',
      entityType: 'Donation',
      entityId: donation._id.toString(),
      details: { campaignId, amount: parsedAmount, ngoName: ngo.ngoName }
    });

    res.status(201).json({
      success: true,
      message: `Successfully allocated $${parsedAmount.toLocaleString()} to ${campaign.patientName}'s hospital treatment!`,
      donation,
      allocation,
      campaign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Full Campaign Sponsorship (Sponsor 100% of remaining shortfall)
// @route   POST /api/ngos/sponsor-full
// @access  Private (NGO)
exports.sponsorFullCampaign = async (req, res, next) => {
  try {
    const { campaignId, purpose = 'Full Life-Saving Surgical Co-Sponsorship' } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    const shortfall = Math.max(0, (campaign.fundingGoal || 0) - (campaign.raisedAmount || 0));
    if (shortfall <= 0) {
      return res.status(400).json({ success: false, message: 'Campaign is already 100% funded.' });
    }

    const ngo = await getOrCreateNgo(req.user);

    // Fully fund campaign
    campaign.raisedAmount = campaign.fundingGoal;
    campaign.status = 'completed';
    campaign.ngoId = ngo._id;
    campaign.ngoName = ngo.ngoName;
    campaign.donorsCount = (campaign.donorsCount || 0) + 1;
    await campaign.save();

    // Update NGO metrics
    ngo.allocatedFunds = (ngo.allocatedFunds || 0) + shortfall;
    ngo.totalSponsoredPatients = (ngo.totalSponsoredPatients || 0) + 1;
    ngo.surgeriesFunded = (ngo.surgeriesFunded || 0) + 1;
    ngo.calculateTrustScore();
    await ngo.save();

    // Create Donation Record
    const donation = await Donation.create({
      donorId: req.user.id,
      donorName: ngo.ngoName,
      donorEmail: ngo.contactEmail || req.user.email,
      campaignId: campaign._id,
      amount: shortfall,
      paymentMethod: 'NGO Full Sponsorship Pool',
      transactionId: 'TXN-SPONSOR-' + Math.floor(1000000 + Math.random() * 9000000),
      receiptNumber: 'CERT-SPONSOR-' + Date.now().toString().slice(-8),
      transactionStatus: 'completed',
      paidAt: new Date(),
      taxDeductible: true,
      message: `Complete treatment sponsored by ${ngo.ngoName}. 100% clinical funding guaranteed.`
    });

    // Create FundAllocation
    const allocation = await FundAllocation.create({
      ngoId: ngo._id,
      campaignId: campaign._id,
      hospitalId: campaign.hospitalId || (await Hospital.findOne())?._id,
      amount: shortfall,
      purpose,
      billInvoiceNumber: 'INV-FULL-' + Math.floor(100000 + Math.random() * 900000),
      status: 'released',
      releaseDate: new Date(),
      notes: `Full sponsorship grant issued by ${ngo.ngoName} to ${campaign.hospitalName} for ${campaign.patientName}`
    });

    await logAudit({
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: 'ngo',
      action: 'FULL_CAMPAIGN_SPONSORED',
      entityType: 'Campaign',
      entityId: campaign._id.toString(),
      details: { campaignId, amount: shortfall, ngoName: ngo.ngoName }
    });

    res.status(200).json({
      success: true,
      message: `Outstanding shortfall of $${shortfall.toLocaleString()} fully sponsored! Campaign marked 100% funded.`,
      donation,
      allocation,
      campaign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Hospital Partnerships
// @route   GET /api/ngos/partnerships
// @access  Private (NGO, Hospital, Admin)
exports.getHospitalPartnerships = async (req, res, next) => {
  try {
    const ngo = await getOrCreateNgo(req.user);
    const partnerships = await HospitalPartnership.find({ ngoId: ngo._id })
      .populate('hospitalId', 'hospitalName city state departments bedCount')
      .sort({ createdAt: -1 });

    const availableHospitals = await Hospital.find({ verificationStatus: 'verified' })
      .select('hospitalName city state departments bedCount accreditation');

    res.status(200).json({
      success: true,
      partnerships,
      availableHospitals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Hospital Partnership Request
// @route   POST /api/ngos/partnerships
// @access  Private (NGO)
exports.createHospitalPartnership = async (req, res, next) => {
  try {
    const { hospitalId, partnershipType, specialties, discountPercentage, bedQuota, mouTerms } = req.body;

    if (!hospitalId) {
      return res.status(400).json({ success: false, message: 'Please select a hospital partner.' });
    }

    const ngo = await getOrCreateNgo(req.user);

    const partnership = await HospitalPartnership.create({
      ngoId: ngo._id,
      hospitalId,
      partnershipType: partnershipType || 'Subsidized Surgery Tariff',
      specialties: specialties || ['Cardiology', 'Oncology', 'Pediatrics'],
      discountPercentage: discountPercentage ? Number(discountPercentage) : 20,
      bedQuota: bedQuota ? Number(bedQuota) : 5,
      mouTerms: mouTerms || 'Hospital and NGO agree to establish clinical subsidy and emergency admission priorities.',
      status: 'active',
      requestedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Hospital partnership agreement successfully recorded!',
      partnership
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get NGO Leaderboard (Public / NGO)
// @route   GET /api/ngos/leaderboard
// @access  Public
exports.getNgoLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await NGO.find({ verificationStatus: 'verified' })
      .select('ngoName trustScore trustBadge totalFundPool allocatedFunds totalSponsoredPatients beneficiaryRatingsAverage city mission')
      .sort({ allocatedFunds: -1, trustScore: -1 })
      .limit(20)
      .lean();

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard
    });
  } catch (error) {
    next(error);
  }
};

// Legacy support routes
exports.createDisbursement = async (req, res, next) => {
  try {
    const { campaignId, amount, recipientType, recipientName, transactionReference, purpose } = req.body;
    const parsedAmount = Number(amount);
    if (!Number.isSafeInteger(parsedAmount) || parsedAmount < 1) {
      return res.status(400).json({ success: false, message: 'Enter a valid transfer amount.' });
    }
    const disbursement = await NgoDisbursement.create({
      ngoUserId: req.user.id,
      campaignId,
      amount: parsedAmount,
      recipientType: recipientType || 'hospital',
      recipientName: recipientName || 'Hospital Billing Desk',
      transactionReference: transactionReference || 'REF-' + Date.now(),
      purpose: purpose || 'Hospital clinical settlement'
    });
    res.status(201).json({ success: true, disbursement });
  } catch (error) {
    next(error);
  }
};

exports.createAllocation = exports.donateToCampaign;

exports.transferCase = async (req, res, next) => {
  try {
    const { campaignId, toNgoId, reason, amountNeeded, notes } = req.body;
    const ngo = await getOrCreateNgo(req.user);

    const transfer = await CaseTransfer.create({
      campaignId,
      fromNgoId: ngo._id,
      toNgoId,
      reason,
      amountNeeded: Number(amountNeeded),
      notes: notes || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Case transfer request dispatched to partner NGO',
      transfer
    });
  } catch (error) {
    next(error);
  }
};

exports.respondToTransfer = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const transfer = await CaseTransfer.findById(req.params.transferId);
    if (!transfer) return res.status(404).json({ success: false, message: 'Transfer not found' });
    transfer.status = status;
    if (notes) transfer.notes = notes;
    await transfer.save();
    res.status(200).json({ success: true, transfer });
  } catch (error) {
    next(error);
  }
};

exports.getNgoDirectory = async (req, res, next) => {
  try {
    const ngos = await NGO.find({ verificationStatus: 'verified' })
      .select('ngoName registrationNumber legalEntityType trustScore trustBadge mission contactEmail contactPhone address city state totalFundPool allocatedFunds totalSponsoredPatients beneficiaryRatingsAverage');
    res.status(200).json({ success: true, count: ngos.length, ngos });
  } catch (error) {
    next(error);
  }
};
