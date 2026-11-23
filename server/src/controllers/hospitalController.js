const Hospital = require('../models/Hospital');
const Campaign = require('../models/Campaign');
const TreatmentUpdate = require('../models/TreatmentUpdate');
const Notification = require('../models/Notification');
const logAudit = require('../middleware/auditLogger');

// @desc    Get hospital dashboard metrics & data
// @route   GET /api/hospitals/dashboard
// @access  Private (Hospital, Admin)
exports.getHospitalDashboard = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user.id });
    
    // Find campaigns tagged to this hospital or all pending campaigns if not hospital-specific
    const query = hospital ? { hospitalId: hospital._id } : {};
    
    // Also grab pending verification requests across system or assigned
    const pendingRequests = await Campaign.find({
      $or: [
        { status: 'pending_hospital' },
        ...(hospital ? [{ hospitalId: hospital._id, status: 'pending_hospital' }] : [])
      ]
    }).populate('patientId', 'fullName email phone');

    const verifiedPatients = await Campaign.find({
      ...(hospital ? { hospitalId: hospital._id } : {}),
      verifiedByHospital: true
    }).populate('patientId', 'fullName email phone');

    const totalEstimateProvided = verifiedPatients.reduce((sum, c) => sum + (c.hospitalEstimate || 0), 0);

    const recentUpdates = await TreatmentUpdate.find(hospital ? { updatedBy: req.user.id } : {})
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      hospital,
      metrics: {
        pendingRequestsCount: pendingRequests.length,
        verifiedPatientsCount: verifiedPatients.length,
        totalEstimateProvided
      },
      pendingRequests,
      verifiedPatients,
      recentUpdates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process verification request (Approve, Reject, Request Info)
// @route   POST /api/hospitals/verifications/:campaignId
// @access  Private (Hospital, Admin)
exports.processVerification = async (req, res, next) => {
  try {
    const { action, hospitalReviewNotes, hospitalEstimate } = req.body;
    const campaign = await Campaign.findById(req.params.campaignId);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (action === 'approve') {
      campaign.verifiedByHospital = true;
      campaign.status = 'approved';
      campaign.hospitalReviewNotes = hospitalReviewNotes || 'Verified: Medical documents and surgical requirement authenticated.';
      if (hospitalEstimate) campaign.hospitalEstimate = Number(hospitalEstimate);
    } else if (action === 'reject') {
      campaign.verifiedByHospital = false;
      campaign.status = 'rejected';
      campaign.hospitalReviewNotes = hospitalReviewNotes || 'Rejected: Medical credentials could not be matched with hospital databases.';
    } else if (action === 'request_info') {
      campaign.hospitalReviewNotes = hospitalReviewNotes || 'Pending: Further radiological scans and doctor signed summary requested.';
    }

    await campaign.save();

    // Create notification for patient
    await Notification.create({
      recipientId: campaign.patientId,
      type: 'verification_status',
      title: `Hospital Status: ${action.toUpperCase()}`,
      message: `Your campaign "${campaign.title}" verification was processed. Notes: ${campaign.hospitalReviewNotes}`,
      link: `/campaigns/${campaign._id}`
    });

    await logAudit({
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: 'hospital',
      action: `HOSPITAL_VERIFY_${action.toUpperCase()}`,
      entityType: 'Campaign',
      entityId: campaign._id.toString(),
      details: { action, notes: campaign.hospitalReviewNotes, estimate: campaign.hospitalEstimate }
    });

    res.status(200).json({
      success: true,
      message: `Verification ${action} completed successfully`,
      campaign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hospital patients with medical records
// @route   GET /api/hospitals/patients
// @access  Private (Hospital, Admin)
exports.getHospitalPatients = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({
      verifiedByHospital: true
    }).populate('patientId', 'fullName email phone');

    res.status(200).json({
      success: true,
      patients: campaigns
    });
  } catch (error) {
    next(error);
  }
};
