const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllUsers,
  toggleUserStatus,
  manageRefund,
  getAuditLogs,
  getRefundRequests,
  getOrganizations,
  verifyOrganization
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/refunds', getRefundRequests);
router.put('/refunds/:id', manageRefund);
router.get('/audit-logs', getAuditLogs);
router.get('/organizations', getOrganizations);
router.put('/organizations/:type/:id', verifyOrganization);

module.exports = router;
