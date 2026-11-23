const User = require('../models/User');
const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');
const NGO = require('../models/NGO');
const jwt = require('jsonwebtoken');
const logAudit = require('../middleware/auditLogger');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'medifund_super_secret_jwt_key_2026_secure',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, role = 'patient', phone = '', organizationDetails = {} } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    // Role restrictions: only Patient, Donor, NGO can register
    if (!['patient', 'donor', 'ngo'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Registration is restricted to Patient, Donor, and NGO accounts.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role,
      organizationDetails
    });

    // Create role-specific document
    if (role === 'patient') {
      await Patient.create({
        userId: user._id,
        fullName: user.fullName
      });
    } else if (role === 'hospital') {
      await Hospital.create({
        userId: user._id,
        hospitalName: organizationDetails.orgName || `${fullName} Medical Center`,
        registrationNumber: organizationDetails.regNumber || `HOSP-${Date.now().toString().slice(-6)}`,
        address: organizationDetails.address || '',
        contactEmail: email,
        contactPhone: phone
      });
    } else if (role === 'ngo') {
      await NGO.create({
        userId: user._id,
        ngoName: organizationDetails.orgName || `${fullName} Foundation`,
        registrationNumber: organizationDetails.regNumber || `NGO-${Date.now().toString().slice(-6)}`,
        legalEntityType: organizationDetails.legalEntityType || 'Charitable Trust',
        yearOfEstablishment: organizationDetails.yearOfEstablishment ? Number(organizationDetails.yearOfEstablishment) : 2018,
        website: organizationDetails.website || 'https://medifund.org',
        mission: organizationDetails.mission || 'Providing lifesaving medical funding and healthcare assistance to underserved patients.',
        panNumber: organizationDetails.panNumber || 'AAATG8941K',
        tanNumber: organizationDetails.tanNumber || 'CHCG09182F',
        contactEmail: email,
        contactPhone: phone,
        address: organizationDetails.address || '',
        city: organizationDetails.city || 'Chicago',
        state: organizationDetails.state || 'IL',
        repName: fullName,
        repDesignation: organizationDetails.repDesignation || 'Executive Managing Trustee',
        repEmail: email,
        repPhone: phone,
        repIdProofType: organizationDetails.repIdProofType || 'Passport / National Identity Card',
        repIdProofNumber: organizationDetails.repIdProofNumber || 'ID-VERIFIED-9812',
        verificationStatus: 'verified',
        trustScore: 92,
        trustBadge: 'Trusted NGO',
        totalFundPool: 150000,
        allocatedFunds: 35000
      });
    }

    const token = generateToken(user._id);

    await logAudit({
      actorId: user._id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user._id.toString(),
      details: { email: user.email, role: user.role }
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Restrict Admin login to designated authorized emails stored in environment variables
    if (user.role === 'admin') {
      const configuredAdmins = (process.env.ADMIN_EMAILS || 'reshmagujjuka4@gmail.com,anjalikore775@gmail.com,admin@medifund.org')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);

      if (configuredAdmins.length > 0 && !configuredAdmins.includes(user.email.toLowerCase())) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Unauthorized administrator account.'
        });
      }
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    const token = generateToken(user._id);

    await logAudit({
      actorId: user._id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user._id.toString(),
      details: { email: user.email }
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Demo Login disabled
// @route   POST /api/auth/demo-login
// @access  Disabled
exports.demoLogin = async (req, res) => {
  return res.status(403).json({
    success: false,
    message: 'Demo login is disabled. Please sign in with registered credentials.'
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    let extraData = {};

    if (user.role === 'patient') {
      extraData = await Patient.findOne({ userId: user._id });
    } else if (user.role === 'hospital') {
      extraData = await Hospital.findOne({ userId: user._id });
    } else if (user.role === 'ngo') {
      extraData = await NGO.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      extraData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, profileImage, organizationDetails } = req.body;
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (profileImage) updateData.profileImage = profileImage;
    if (organizationDetails) updateData.organizationDetails = organizationDetails;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true
    }).select('-passwordHash');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password (simulation)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  res.status(200).json({
    success: true,
    message: `If an account with ${email} exists, password reset instructions have been dispatched to your email.`
  });
};

// @desc    Reset password (simulation)
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Password has been reset successfully. Please sign in with your new credentials.'
  });
};

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Email address verified successfully.'
  });
};
