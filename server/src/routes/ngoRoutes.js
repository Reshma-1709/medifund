const express = require('express');
const router = express.Router();
const {
  getNgoDashboard,
  updateKyc,
  donateToCampaign,
  sponsorFullCampaign,
  getHospitalPartnerships,
  createHospitalPartnership,
  getNgoLeaderboard,
  createDisbursement,
  createAllocation,
  transferCase,
  respondToTransfer,
  getNgoDirectory
} = require('../controllers/ngoController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getNgoDirectory);
router.get('/directory', getNgoDirectory);
router.get('/leaderboard', getNgoLeaderboard);

// Protected NGO & Admin routes
router.get('/dashboard', protect, authorize('ngo', 'admin'), getNgoDashboard);
router.put('/kyc', protect, authorize('ngo', 'admin'), updateKyc);
router.post('/donate', protect, authorize('ngo', 'admin'), donateToCampaign);
router.post('/sponsor-full', protect, authorize('ngo', 'admin'), sponsorFullCampaign);
router.get('/partnerships', protect, authorize('ngo', 'hospital', 'admin'), getHospitalPartnerships);
router.post('/partnerships', protect, authorize('ngo', 'admin'), createHospitalPartnership);
router.post('/disbursements', protect, authorize('ngo', 'admin'), createDisbursement);
router.post('/allocations', protect, authorize('ngo', 'admin'), createAllocation);
router.post('/transfer-case', protect, authorize('ngo', 'admin'), transferCase);
router.put('/transfer-case/:transferId', protect, authorize('ngo', 'admin'), respondToTransfer);

module.exports = router;
