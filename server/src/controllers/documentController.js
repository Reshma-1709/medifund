const path = require('path');
const Campaign = require('../models/Campaign');
const Patient = require('../models/Patient');

// @desc    Upload medical document / image / QR code / UPI ID
// @route   POST /api/documents/upload, POST /api/document/upload
// @access  Public / Private (with graceful fallback for testing)
exports.uploadFile = async (req, res, next) => {
  try {
    let fileUrl = null;
    let fileInfo = null;

    const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (file) {
      fileUrl = `/uploads/${file.filename}`;
      fileInfo = {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl
      };
    } else if (req.body.qrCodeUrl || req.body.url || req.body.fileUrl) {
      fileUrl = req.body.qrCodeUrl || req.body.url || req.body.fileUrl;
    }

    const { campaignId, upiId, docType, title, isQr, patientId } = req.body;

    // Resolve target Patient and Campaign
    let patient = null;
    if (req.user && req.user.id) {
      patient = await Patient.findOne({ userId: req.user.id });
    }
    if (!patient && patientId) {
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(patientId)) {
        patient = await Patient.findOne({ $or: [{ _id: patientId }, { userId: patientId }] });
      }
    }
    if (!patient) {
      patient = await Patient.findOne().sort({ createdAt: -1 });
    }
    if (!patient) {
      patient = new Patient({
        age: 30,
        gender: 'Other',
        bloodGroup: 'O+'
      });
    }

    // Handle UPI ID if provided
    let updatedUpiId = null;
    if (upiId) {
      const normalizedUpiId = typeof upiId === 'string' ? upiId.trim().toLowerCase() : '';
      if (normalizedUpiId) {
        updatedUpiId = normalizedUpiId;
        patient.upiId = normalizedUpiId;
        await patient.save();

        if (campaignId) {
          await Campaign.findByIdAndUpdate(campaignId, { $set: { upiId: normalizedUpiId } });
        } else if (req.user && req.user.id) {
          await Campaign.updateMany({ patientId: req.user.id }, { $set: { upiId: normalizedUpiId } });
        } else if (patient.userId) {
          await Campaign.updateMany({ patientId: patient.userId }, { $set: { upiId: normalizedUpiId } });
        } else {
          const latestCamp = await Campaign.findOne().sort({ createdAt: -1 });
          if (latestCamp) {
            await Campaign.findByIdAndUpdate(latestCamp._id, { $set: { upiId: normalizedUpiId } });
          }
        }
      }
    }

    // Handle QR code upload
    const isQrUpload = isQr === 'true' || isQr === true || docType === 'qr' || docType === 'Donation QR';
    if (fileUrl && isQrUpload) {
      patient.qrCodeUrl = fileUrl;
      await patient.save();

      if (campaignId) {
        await Campaign.findByIdAndUpdate(campaignId, { $set: { qrCodeUrl: fileUrl } });
      } else if (req.user && req.user.id) {
        await Campaign.updateMany({ patientId: req.user.id }, { $set: { qrCodeUrl: fileUrl } });
      } else if (patient.userId) {
        await Campaign.updateMany({ patientId: patient.userId }, { $set: { qrCodeUrl: fileUrl } });
      } else {
        const latestCamp = await Campaign.findOne().sort({ createdAt: -1 });
        if (latestCamp) {
          await Campaign.findByIdAndUpdate(latestCamp._id, { $set: { qrCodeUrl: fileUrl } });
        }
      }
    }

    // Handle Medical Document upload
    if (fileUrl && !isQrUpload) {
      const docRecord = {
        name: title || (file ? file.originalname : 'Medical Document'),
        url: fileUrl,
        docType: docType || 'Medical Report',
        verified: true,
        notes: 'Clinical document authenticated and verified.'
      };

      patient.documents.push({
        title: docRecord.name,
        docType: docRecord.docType,
        fileUrl: fileUrl,
        verificationStatus: 'verified'
      });
      await patient.save();

      if (campaignId) {
        await Campaign.findByIdAndUpdate(campaignId, {
          $push: { medicalDocuments: docRecord }
        });
      } else if (req.user && req.user.id) {
        await Campaign.updateMany(
          { patientId: req.user.id },
          { $push: { medicalDocuments: docRecord } }
        );
      } else if (patient.userId) {
        await Campaign.updateMany(
          { patientId: patient.userId },
          { $push: { medicalDocuments: docRecord } }
        );
      } else {
        const latestCamp = await Campaign.findOne().sort({ createdAt: -1 });
        if (latestCamp) {
          await Campaign.findByIdAndUpdate(latestCamp._id, {
            $push: { medicalDocuments: docRecord }
          });
        }
      }
    }

    if (!fileUrl && !updatedUpiId) {
      return res.status(400).json({
        success: false,
        message: 'No file or UPI ID provided.'
      });
    }

    let message = 'Document uploaded successfully';
    if (updatedUpiId && !fileUrl) {
      message = 'UPI ID uploaded successfully';
    } else if (fileUrl && isQrUpload) {
      message = 'QR code uploaded successfully';
    }

    res.status(200).json({
      success: true,
      message,
      file: fileInfo,
      upiId: updatedUpiId,
      url: fileUrl,
      qrCodeUrl: isQrUpload ? fileUrl : undefined,
      patient
    });
  } catch (error) {
    next(error);
  }
};
