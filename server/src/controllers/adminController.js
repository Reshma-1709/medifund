const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Hospital = require('../models/Hospital');
const NGO = require('../models/NGO');
const RefundRequest = require('../models/RefundRequest');
const CaseTransfer = require('../models/CaseTransfer');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const logAudit = require('../middleware/auditLogger');

// @desc    Get admin overview metrics & chart data
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const pendingVerifications = await Campaign.countDocuments({
      status: { $in: ['pending_hospital', 'pending_ngo'] }
    });
    const approvedCampaigns = await Campaign.countDocuments({ status: 'approved' });
    const completedCampaigns = await Campaign.countDocuments({ status: 'completed' });
    
    const donations = await Donation.find({ transactionStatus: 'completed' });
    const totalDonationsCount = donations.length;
    const totalFundsRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

    const campaigns = await Campaign.find();
    const totalFundsDisbursed = campaigns.reduce((sum, c) => sum + (c.fundsReleased || 0), 0);

    const hospitalsCount = await Hospital.countDocuments();
    const ngosCount = await NGO.countDocuments();
    const pendingRefunds = await RefundRequest.countDocuments({ status: 'pending' });

    // Category breakdown
    const categoryStats = {};
    campaigns.forEach(c => {
      categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
    });

    // Monthly trends (mock aggregate or sample timeline)
    const monthlyTrends = [
      { month: 'Jan', donations: 12500, count: 42 },
      { month: 'Feb', donations: 19800, count: 68 },
      { month: 'Mar', donations: 27400, count: 95 },
      { month: 'Apr', donations: 34100, count: 118 },
      { month: 'May', donations: 42000, count: 140 },
      { month: 'Jun', donations: totalFundsRaised > 50000 ? totalFundsRaised : 51200, count: totalDonationsCount > 10 ? totalDonationsCount : 172 }
    ];

    const recentAuditLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        totalCampaigns,
        pendingVerifications,
        approvedCampaigns,
        completedCampaigns,
        totalFundsRaised,
        totalFundsDisbursed,
        totalDonationsCount,
        hospitalsCount,
        ngosCount,
        pendingRefunds
      },
      categoryStats,
      monthlyTrends,
      recentAuditLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search & filters
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, status } = req.query;
    const query = {};

    if (role && role !== 'all') query.role = role;
    if (status !== undefined && status !== 'all') query.isActive = status === 'active';
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (activate / deactivate)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    await logAudit({
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: 'admin',
      action: user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entityType: 'User',
      entityId: user._id.toString(),
      details: { email: user.email, isActive: user.isActive }
    });

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manage refund requests (Approve / Reject)
// @route   PUT /api/admin/refunds/:id
// @access  Private (Admin)
exports.manageRefund = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const refund = await RefundRequest.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({ success: false, message: 'Refund request not found' });
    }

    refund.status = status;
    if (adminNotes) refund.adminNotes = adminNotes;
    await refund.save();

    if (status === 'approved') {
      await Donation.findByIdAndUpdate(refund.donationId, {
        transactionStatus: 'refunded'
      });
      // Deduct from campaign
      await Campaign.findByIdAndUpdate(refund.campaignId, {
        $inc: { raisedAmount: -refund.amount }
      });
    }

    // Notify donor
    await Notification.create({
      recipientId: refund.donorId,
      type: 'refund',
      title: `Refund Request ${status.toUpperCase()}`,
      message: `Your refund request for $${refund.amount} was ${status}. Notes: ${adminNotes || 'Processed by admin'}.`,
      link: '/donor/donations'
    });

    await logAudit({
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: 'admin',
      action: `REFUND_${status.toUpperCase()}`,
      entityType: 'RefundRequest',
      entityId: refund._id.toString(),
      details: { amount: refund.amount, status }
    });

    res.status(200).json({
      success: true,
      message: `Refund request marked as ${status}`,
      refund
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);

    res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get refund requests list
// @route   GET /api/admin/refunds
// @access  Private (Admin)
exports.getRefundRequests = async (req, res, next) => {
  try {
    const refunds = await RefundRequest.find()
      .sort({ createdAt: -1 })
      .populate('donorId', 'fullName email')
      .populate('campaignId', 'title');

    res.status(200).json({
      success: true,
      refunds
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hospitals and NGOs for verification & oversight
// @route   GET /api/admin/organizations
// @access  Private (Admin)
exports.getOrganizations = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find().populate('userId', 'fullName email isActive');
    const ngos = await NGO.find().populate('userId', 'fullName email isActive');

    res.status(200).json({
      success: true,
      hospitals,
      ngos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or toggle organization accreditation
// @route   PUT /api/admin/organizations/:type/:id
// @access  Private (Admin)
exports.verifyOrganization = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { status, adminNotes, trustScore } = req.body;

    let org;
    if (type === 'hospital') {
      org = await Hospital.findByIdAndUpdate(id, { verificationStatus: status }, { new: true });
    } else {
      const ngo = await NGO.findById(id);
      if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found' });
      ngo.verificationStatus = status;
      if (adminNotes) ngo.adminReviewNotes = adminNotes;
      if (status === 'verified') {
        ngo.trustBadge = (trustScore || ngo.trustScore) >= 80 ? 'Trusted NGO' : 'Verified Partner';
        ngo.verifiedAt = new Date();
        ngo.verifiedBy = req.user.id;
      } else if (status === 'rejected') {
        ngo.trustBadge = 'None';
      } else {
        ngo.trustBadge = 'Pending Verification';
      }
      ngo.calculateTrustScore();
      await ngo.save();
      org = ngo;
    }

    await logAudit({
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: 'admin',
      action: `ORG_${status.toUpperCase()}`,
      entityType: type === 'hospital' ? 'Hospital' : 'NGO',
      entityId: id,
      details: { status, adminNotes }
    });

    res.status(200).json({
      success: true,
      message: `Organization successfully marked as ${status}`,
      org
    });
  } catch (error) {
    next(error);
  }
};
