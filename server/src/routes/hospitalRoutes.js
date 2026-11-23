const express = require('express');
const router = express.Router();
const {
  getHospitalDashboard,
  processVerification,
  getHospitalPatients
} = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('hospital', 'admin'), getHospitalDashboard);
router.post('/verifications/:campaignId', protect, authorize('hospital', 'admin'), processVerification);
router.get('/patients', protect, authorize('hospital', 'admin'), getHospitalPatients);

module.exports = router;
