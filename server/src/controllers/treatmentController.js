const TreatmentUpdate = require('../models/TreatmentUpdate');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const logAudit = require('../middleware/auditLogger');

// @desc    Get all updates for a campaign
// @route   GET /api/campaigns/:id/updates
// @access  Public
exports.getUpdatesByCampaign = async (req, res, next) => {
  try {
    const updates = await TreatmentUpdate.find({ campaignId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('updatedBy', 'fullName role profileImage');

    res.status(200).json({
      success: true,
      count: updates.length,
      updates
    });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardUpdates = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId).select('title patientId');
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    if (req.user.role === 'patient' && String(campaign.patientId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Campaign not found or not accessible.' });
    }
    if (req.user.role === 'donor' && !(await Donation.exists({ campaignId: campaign._id, donorId: req.user.id }))) {
      return res.status(404).json({ success: false, message: 'Campaign not found or not accessible.' });
    }
    const updates = await TreatmentUpdate.find({ campaignId: campaign._id }).sort({ createdAt: -1 }).lean();
    res.status(200).json(updates.map(update => ({
      _id: update._id,
      campaignId: { title: campaign.title },
      kind: /recovery|discharg/i.test(update.stage || '') ? 'recovery' : 'treatment',
      text: [update.title, update.description].filter(Boolean).join(' — '),
      createdAt: update.createdAt
    })));
  } catch (error) {
    next(error);
  }
};

exports.addDashboardUpdate = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign || (req.user.role === 'patient' && String(campaign.patientId) !== String(req.user.id))) {
      return res.status(404).json({ success: false, message: 'Campaign not found or not accessible.' });
    }
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
    if (!text || text.length > 1200) {
      return res.status(400).json({ success: false, message: 'Enter an update of 1-1200 characters.' });
    }
    const kind = req.body.kind === 'recovery' ? 'recovery' : 'treatment';
    const update = await TreatmentUpdate.create({
      campaignId: campaign._id,
      updatedBy: req.user.id,
      authorName: req.user.fullName,
      authorRole: req.user.role,
      title: kind === 'recovery' ? 'Recovery update' : 'Treatment update',
      description: text,
      stage: kind === 'recovery' ? 'Post-Op Recovery' : 'Treatment Plan & Tests'
    });
    res.status(201).json({
      _id: update._id,
      campaignId: { title: campaign.title },
      kind,
      text: update.description,
      createdAt: update.createdAt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add treatment update (Hospital, Patient, Admin)
// @route   POST /api/campaigns/:id/updates
// @access  Private (Hospital, Patient, Admin)
exports.addTreatmentUpdate = async (req, res, next) => {
  try {
    const { title, description, stage, mediaUrls = [], doctorNotes = '', recoveryPercentage = 50, dischargeDate } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    if (req.user.role === 'patient' && String(campaign.patientId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Campaign not found or not accessible.' });
    }

    const update = await TreatmentUpdate.create({
      campaignId: campaign._id,
      updatedBy: req.user.id,
      authorName: req.user.fullName,
      authorRole: req.user.role,
      title,
      description,
      stage: stage || 'Treatment Plan & Tests',
      mediaUrls,
      doctorNotes,
      recoveryPercentage: Number(recoveryPercentage),
      dischargeDate: dischargeDate ? new Date(dischargeDate) : null
    });

    // Update campaign treatment stage
    campaign.treatmentStage = update.stage;
    await campaign.save();

    // Notify patient if posted by hospital
    if (req.user.role === 'hospital') {
      await Notification.create({
        recipientId: campaign.patientId,
        type: 'campaign_update',
        title: `Medical Progress Update: ${stage}`,
        message: `${req.user.fullName} added a clinical update to your case file: "${title}".`,
        link: `/campaigns/${campaign._id}`
      });
    }

    await logAudit({
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: req.user.role,
      action: 'TREATMENT_UPDATE_POSTED',
      entityType: 'TreatmentUpdate',
      entityId: update._id.toString(),
      details: { campaignId: campaign._id, stage, title }
    });

    res.status(201).json({
      success: true,
      message: 'Treatment update published successfully',
      update
    });
  } catch (error) {
    next(error);
  }
};
