const express = require('express');
const router = express.Router();
const {
  getUpdatesByCampaign,
  addTreatmentUpdate,
  getDashboardUpdates,
  addDashboardUpdate
} = require('../controllers/treatmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:id/updates', getUpdatesByCampaign);
router.post('/:id/updates', protect, authorize('hospital', 'patient', 'admin'), addTreatmentUpdate);
router.get('/:campaignId', protect, authorize('patient', 'donor', 'ngo', 'admin'), getDashboardUpdates);
router.post('/:campaignId', protect, authorize('patient'), addDashboardUpdate);

module.exports = router;
