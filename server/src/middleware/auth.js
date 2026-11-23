const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes with JWT verification
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'medifund_super_secret_jwt_key_2026_secure'
    );
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Contact administration.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired. Please sign in again.'
    });
  }
};

// Optional JWT verification (attaches req.user if token is present, continues without error if not)
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'medifund_super_secret_jwt_key_2026_secure'
    );
    req.user = await User.findById(decoded.id).select('-passwordHash');
  } catch (error) {
    req.user = null;
  }
  next();
};

// Grant access to specific roles (case-insensitive with admin fallback)
exports.authorize = (...roles) => {
  const normalizedRoles = roles.map(r => String(r).toLowerCase().trim());
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to access this resource.'
      });
    }
    const userRole = String(req.user.role || '').toLowerCase().trim();
    if (userRole === 'admin' || normalizedRoles.includes(userRole) || normalizedRoles.includes('*')) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: `User role '${req.user.role}' is not authorized to access this route.`
    });
  };
};

// Optional auth for public routes where user might be logged in
exports.optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'medifund_super_secret_jwt_key_2026_secure'
      );
      req.user = await User.findById(decoded.id).select('-passwordHash');
    } catch (err) {
      // Ignore invalid token on optional auth
    }
  }
  next();
};
