const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getCampaigns,
  getFeaturedCampaigns,
  getCampaignById,
  getMyCampaigns,
  createCampaign,
  updateCampaign,
  hospitalReview,
  adminChangeStatus
} = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/auth');

// Optional auth helper
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'medifund_super_secret_jwt_key_2026_secure'
      );
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (e) {}
  }
  next();
};

router.get('/', getCampaigns);
router.get('/featured', getFeaturedCampaigns);
router.get('/mine', optionalAuth, getMyCampaigns);
router.get('/:id', getCampaignById);
router.post('/', optionalAuth, createCampaign);
router.put('/:id', optionalAuth, updateCampaign);
router.put('/:id/hospital-review', protect, authorize('hospital', 'admin'), hospitalReview);
router.put('/:id/status', protect, authorize('admin'), adminChangeStatus);

module.exports = router;
