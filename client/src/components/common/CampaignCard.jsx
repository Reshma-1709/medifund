import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Building2, FileText, QrCode, Users } from 'lucide-react';
import { formatINR } from '../../utils/currency';

const CampaignCard = ({ campaign, onDonateClick }) => {
  if (!campaign) return null;

  const fundingGoal = campaign.fundingGoal || 1000000;
  const raisedAmount = campaign.raisedAmount || 0;
  const remainingAmount = Math.max(0, fundingGoal - raisedAmount);
  const percentRaised = Math.min(100, Math.round((raisedAmount / fundingGoal) * 100));

  const getUrgencyBadge = () => {
    if (campaign.urgency === 'critical') {
      return <span className="badge-critical">Critical Emergency</span>;
    }
    if (campaign.urgency === 'urgent') {
      return <span className="badge-urgent">Urgent Need</span>;
    }
    return <span className="badge bg-light text-secondary border">Standard Case</span>;
  };

  return (
    <div className="mfms-card mfms-card-hover h-100 d-flex flex-column overflow-hidden">
      {/* Card Image Banner */}
      <div className="position-relative" style={{ height: '200px', backgroundColor: '#e2e8f0' }}>
        <img
          src={campaign.bannerImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'}
          alt={campaign.title}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
        />
        
        {/* Badges on top of image */}
        <div className="position-absolute top-0 start-0 m-3 d-flex flex-wrap gap-1">
          {getUrgencyBadge()}
        </div>

        {campaign.verifiedByHospital && (
          <div className="position-absolute top-0 end-0 m-3">
            <span className="badge-verified bg-white shadow-sm">
              <ShieldCheck size={14} className="text-success" />
              <span>Verified Hospital</span>
            </span>
          </div>
        )}

        <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-gradient-dark text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}>
          <span className="badge bg-primary text-white rounded-pill px-2 py-1 small">
            {campaign.category || 'Cardiology'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 p-md-4 d-flex flex-column flex-grow-1">
        
        {/* Patient & Hospital tags */}
        <div className="d-flex align-items-center justify-content-between text-muted small mb-2">
          <div className="d-flex align-items-center gap-1 text-truncate">
            <Building2 size={13} className="text-mfms-blue shrink-0" />
            <span className="text-truncate" style={{ maxWidth: '140px' }}>{campaign.hospitalName || 'Partner Hospital'}</span>
          </div>
          {campaign.patientName && (
            <span className="badge bg-light text-dark border small">
              Patient: {campaign.patientName}
            </span>
          )}
        </div>

        <h5 className="fw-bold mb-2 text-mfms-navy line-clamp-2" style={{ minHeight: '3rem', fontSize: '1.05rem', lineHeight: '1.4' }}>
          <Link to={`/campaigns/${campaign._id}`} className="text-mfms-navy text-decoration-none hover-primary">
            {campaign.title}
          </Link>
        </h5>

        <p className="text-muted small mb-2 line-clamp-2" style={{ minHeight: '2.5rem' }}>
          {campaign.description}
        </p>

        {/* Verification Status + Uploaded Docs/QR + UPI ID */}
        <div className="bg-light rounded-3 p-2 mb-3 border small">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className={`badge ${
              campaign.status === 'approved' ? 'bg-success' : 'bg-warning text-dark'
            }`} style={{ fontSize: '0.68rem' }}>
              {campaign.status === 'approved' ? 'VERIFIED & ACTIVE' : (campaign.status || 'ACTIVE').toUpperCase()}
            </span>
            <span className="badge bg-white text-dark border d-flex align-items-center gap-1" style={{ fontSize: '0.68rem' }}>
              <FileText size={11} className="text-primary" />
              <span>{campaign.medicalDocuments?.length || 1} Docs Uploaded</span>
            </span>
          </div>
          <div className="d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
            <span className="d-flex align-items-center gap-1 text-truncate" style={{ maxWidth: '170px' }}>
              <QrCode size={12} className="text-mfms-blue shrink-0" />
              <span className="text-truncate">{campaign.upiId ? `UPI: ${campaign.upiId}` : 'Direct UPI Enabled'}</span>
            </span>
            {campaign.qrCodeUrl ? (
              <span className="text-success fw-semibold" style={{ fontSize: '0.7rem' }}>
                ✓ QR Linked
              </span>
            ) : null}
          </div>
        </div>

        {/* Progress Bar & 4 Key Fundraising Metrics */}
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-baseline mb-1">
            <span className="fw-bold text-mfms-blue fs-6">
              {formatINR(raisedAmount)}
            </span>
            <span className="text-muted small">
              Goal: {formatINR(fundingGoal)}
            </span>
          </div>

          <div className="mfms-progress-wrapper mb-2">
            <div
              className="mfms-progress-bar"
              style={{ width: `${percentRaised}%` }}
              role="progressbar"
              aria-valuenow={percentRaised}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          {/* 4 Metrics: Raised, Remaining, Percentage, Donors */}
          <div className="row g-1 text-center bg-light rounded-3 p-2 mb-3 border" style={{ fontSize: '0.73rem' }}>
            <div className="col-3 border-end">
              <div className="text-muted text-truncate" style={{ fontSize: '0.68rem' }}>Raised</div>
              <div className="fw-bold text-primary text-truncate">{formatINR(raisedAmount)}</div>
            </div>
            <div className="col-3 border-end">
              <div className="text-muted text-truncate" style={{ fontSize: '0.68rem' }}>Remaining</div>
              <div className="fw-bold text-danger text-truncate">{formatINR(remainingAmount)}</div>
            </div>
            <div className="col-3 border-end">
              <div className="text-muted text-truncate" style={{ fontSize: '0.68rem' }}>Progress</div>
              <div className="fw-bold text-success">{percentRaised}%</div>
            </div>
            <div className="col-3">
              <div className="text-muted text-truncate" style={{ fontSize: '0.68rem' }}>Donors</div>
              <div className="fw-bold text-dark">{campaign.donorsCount || 0}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <Link
              to={`/campaigns/${campaign._id}`}
              className="btn btn-sm btn-outline-secondary flex-grow-1 py-2 fw-semibold"
            >
              View Story
            </Link>
            <Link
              to={`/campaigns/${campaign._id}`}
              className="btn btn-sm btn-mfms-primary py-2 px-3 fw-semibold d-flex align-items-center justify-content-center gap-1"
            >
              <Activity size={15} />
              <span>Donate Now</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CampaignCard;
