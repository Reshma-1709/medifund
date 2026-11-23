const express = require('express');
const router = express.Router();
const {
  createOrder,
  createCashfreeOrder,
  verifyCashfreePayment,
  submitManualDonation,
  getPendingManualDonations,
  verifyManualDonation,
  verifyPayment,
  handleWebhook,
  getMyDonations,
  getMyUpdates,
  getCampaignDonations,
  getAllDonations,
  getReceipt,
  requestRefund
} = require('../controllers/donationController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.post('/webhook', handleWebhook);
router.get('/payment-status', (req, res) => {
  res.status(200).json({
    provider: 'razorpay',
    currency: 'INR',
    gateway: 'Razorpay Indian Payment Gateway (UPI, GPay, PhonePe, Paytm, Cards, NetBanking)',
    configured: true,
    environment: 'development'
  });
});

// Donation flows - accessible to guests and authenticated donors
router.post('/create-order', optionalAuth, createOrder);
router.post('/verify-payment', optionalAuth, verifyPayment);
router.post('/create-cashfree-order', protect, createCashfreeOrder);
router.post('/verify-cashfree-payment', protect, verifyCashfreePayment);
router.post('/manual', protect, submitManualDonation);
router.get('/my-donations', protect, getMyDonations);
router.get('/my-updates', protect, getMyUpdates);
router.get('/receipt/:id', optionalAuth, getReceipt);
router.post('/refund-request', protect, requestRefund);

// Admin-only donation management
router.get('/pending-manual', protect, authorize('admin'), getPendingManualDonations);
router.put('/:id/verify-manual', protect, authorize('admin'), verifyManualDonation);
router.get('/', protect, authorize('admin'), getAllDonations);

// Public campaign donations
router.get('/campaign/:campaignId', getCampaignDonations);

module.exports = router;
