const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { uploadFile } = require('../controllers/documentController');

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
    } catch (e) {
      // Allow request to proceed even if token invalid
    }
  }
  next();
};

router.post('/upload', optionalAuth, upload.any(), uploadFile);

module.exports = router;
