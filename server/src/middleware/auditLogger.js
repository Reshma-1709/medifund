const AuditLog = require('../models/AuditLog');

const logAudit = async ({
  actorId = null,
  actorName = 'System',
  actorRole = 'system',
  action,
  entityType,
  entityId = '',
  details = {},
  ipAddress = '127.0.0.1'
}) => {
  try {
    await AuditLog.create({
      actorId,
      actorName,
      actorRole,
      action,
      entityType,
      entityId,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('[AuditLog Error]', error.message);
  }
};

module.exports = logAudit;
