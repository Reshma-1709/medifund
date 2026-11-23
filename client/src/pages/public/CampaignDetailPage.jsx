import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import DonationModal from '../../components/common/DonationModal';
import ReceiptModal from '../../components/common/ReceiptModal';
import { formatINR } from '../../utils/currency';
import {
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  Share2,
  FileText,
  Activity,
  Users,
  CheckCircle2,
  ExternalLink,
  Stethoscope,
  Copy,
  Clock,
  HeartHandshake
} from 'lucide-react';
import toast from 'react-hot-toast';

const CampaignDetailPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('story'); // 'story', 'documents', 'updates', 'donors'
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [activeReceiptId, setActiveReceiptId] = useState(null);

  const fetchCampaignData = async () => {
    try {
      const [campaignRes, updatesRes, donorsRes] = await Promise.all([
        api.get(`/campaigns/${id}`),
        api.get(`/treatment/${id}/updates`),
        api.get(`/donations/campaign/${id}`)
      ]);

      if (campaignRes.data.success) {
        setCampaign(campaignRes.data.campaign);
      }
      if (updatesRes.data.success) {
        setUpdates(updatesRes.data.updates || []);
      }
      if (donorsRes.data.success) {
        setDonors(donorsRes.data.donors || []);
      }
    } catch (error) {
      console.error('Error fetching campaign details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Campaign link copied to clipboard!');
  };

  const handleDonationSuccess = (newDonation, updatedCampaign) => {
    setCampaign((prev) => ({
      ...prev,
      raisedAmount: updatedCampaign.raisedAmount,
      donorsCount: updatedCampaign.donorsCount
    }));
    setDonors((prev) => [newDonation, ...prev]);
  };

  if (loading) {
    return (
      <div className="text-center py-5 vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 text-muted">Retrieving hospital-verified records...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container py-5 text-center">
        <h3>Campaign Not Found</h3>
        <p className="text-muted">The requested medical case file may have been archived or removed.</p>
        <Link to="/campaigns" className="btn btn-primary">Browse Active Cases</Link>
      </div>
    );
  }

  const percentRaised = Math.min(
    100,
    Math.round(((campaign.raisedAmount || 0) / (campaign.fundingGoal || 1)) * 100)
  );

  return (
    <div className="py-4 py-md-5 bg-light min-vh-100">
      <div className="container">
        
        {/* Navigation Breadcrumb */}
        <nav className="mb-3 small">
          <Link to="/" className="text-muted text-decoration-none">Home</Link>
          <span className="mx-2 text-muted">/</span>
          <Link to="/campaigns" className="text-muted text-decoration-none">Campaigns</Link>
          <span className="mx-2 text-muted">/</span>
          <span className="text-dark fw-bold text-truncate">{campaign.title}</span>
        </nav>

        {/* Campaign Title & Verification Header */}
        <div className="mb-4">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span className="badge bg-primary text-white rounded-pill px-3 py-1">
              {campaign.category}
            </span>
            {campaign.urgency === 'critical' ? (
              <span className="badge-critical">Critical Emergency</span>
            ) : campaign.urgency === 'urgent' ? (
              <span className="badge-urgent">Urgent Need</span>
            ) : (
              <span className="badge bg-light text-secondary border">Standard Case</span>
            )}

            {campaign.verifiedByHospital && (
              <span className="badge-verified bg-white shadow-sm">
                <ShieldCheck size={14} className="text-success" />
                <span>Hospital Medical Records Verified</span>
              </span>
            )}
          </div>

          <h1 className="fw-bold text-mfms-navy mb-2 display-6" style={{ lineHeight: '1.25' }}>
            {campaign.title}
          </h1>

          <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
            <span>Patient: <strong>{campaign.patientName}</strong> ({campaign.patientAge} yrs, {campaign.patientGender})</span>
            <span>•</span>
            <span className="d-flex align-items-center gap-1">
              <Building2 size={15} className="text-mfms-blue" />
              <span>{campaign.hospitalName}</span>
            </span>
            <span>•</span>
            <span className="d-flex align-items-center gap-1">
              <Calendar size={15} />
              <span>Started {new Date(campaign.createdAt).toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="row g-4">
          
          {/* Left Column: Media & Tabs */}
          <div className="col-12 col-lg-8">
            
            {/* Main Visual Banner */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <img
                src={campaign.bannerImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80'}
                alt={campaign.title}
                className="w-100 object-fit-cover"
                style={{ maxHeight: '420px' }}
              />
            </div>

            {/* Content Tabs Navigation */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
              <div className="card-header bg-white border-bottom p-0">
                <ul className="nav nav-tabs border-0 flex-nowrap overflow-auto px-3">
                  {[
                    { id: 'story', label: 'Patient Story & Condition', icon: FileText },
                    { id: 'documents', label: 'Medical Documents & Estimates', icon: ShieldCheck },
                    { id: 'updates', label: `Treatment Updates (${updates.length})`, icon: Activity },
                    { id: 'donors', label: `Supporters Wall (${donors.length})`, icon: Users }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id} className="nav-item">
                        <button
                          type="button"
                          className={`nav-link border-0 py-3 px-3 d-flex align-items-center gap-2 fw-semibold ${
                            activeTab === tab.id
                              ? 'text-mfms-blue border-bottom border-primary border-3 active bg-transparent'
                              : 'text-muted'
                          }`}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          <Icon size={16} />
                          <span>{tab.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Tab Content Panes */}
              <div className="card-body p-4 p-md-5">
                
                {/* 1. Patient Story Tab */}
                {activeTab === 'story' && (
                  <div>
                    <h4 className="fw-bold text-mfms-navy mb-3">About The Patient's Case</h4>
                    <p className="lead text-secondary fs-6 mb-4 leading-relaxed">
                      {campaign.description}
                    </p>
                    <div className="story-content text-dark mb-4" style={{ whiteSpace: 'pre-line', lineHeight: '1.75' }}>
                      {campaign.story}
                    </div>

                    {/* Hospital & Doctor Note Alert */}
                    {campaign.hospitalReviewNotes && (
                      <div className="alert alert-info bg-mfms-light border-info border-opacity-25 rounded-3 p-3 mt-4">
                        <div className="d-flex align-items-center gap-2 fw-bold text-mfms-navy mb-1">
                          <Stethoscope size={18} className="text-primary" />
                          <span>Hospital Review & Clinical Notes</span>
                        </div>
                        <p className="mb-0 small text-dark opacity-90">
                          {campaign.hospitalReviewNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Medical Documents & Estimates Tab */}
                {activeTab === 'documents' && (
                  <div>
                    <h4 className="fw-bold text-mfms-navy mb-2">Verified Medical Records & Cost Estimates</h4>
                    <p className="text-muted small mb-4">
                      All diagnostic scans, surgery estimates, and hospital admission summaries are scrutinized by our medical board before public listing.
                    </p>

                    <div className="row g-3">
                      {(campaign.medicalDocuments && campaign.medicalDocuments.length > 0) ? (
                        campaign.medicalDocuments.map((doc, idx) => (
                          <div key={idx} className="col-12 col-md-6">
                            <div className="card h-100 border rounded-3 p-3 bg-light">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <span className="badge bg-success-subtle text-success small">
                                  ✓ Verified by Hospital
                                </span>
                                <span className="text-muted small">{doc.docType}</span>
                              </div>
                              <h6 className="fw-bold text-dark mb-1">{doc.name}</h6>
                              {doc.notes && <p className="text-muted small mb-3">{doc.notes}</p>}
                              
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-primary mt-auto d-inline-flex align-items-center gap-1"
                              >
                                <ExternalLink size={14} />
                                <span>Inspect Clinical Document</span>
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12">
                          <p className="text-muted small">Hospital files verified on file.</p>
                        </div>
                      )}
                    </div>

                    {/* Itemized Estimate Summary */}
                    <div className="card border-0 bg-light rounded-3 p-3 mt-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="small text-muted text-uppercase fw-bold">Official Hospital Surgery Estimate:</span>
                          <h4 className="fw-bold text-mfms-navy mb-0">
                            {formatINR(campaign.hospitalEstimate || campaign.fundingGoal)}
                          </h4>
                        </div>
                        <span className="badge bg-success text-white px-3 py-2">
                          Signed by Medical Director
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Treatment Updates Tab */}
                {activeTab === 'updates' && (
                  <div>
                    <h4 className="fw-bold text-mfms-navy mb-3">Live Clinical Treatment & Recovery Updates</h4>
                    {updates.length === 0 ? (
                      <div className="text-center py-4 text-muted small">
                        No treatment updates published yet. Attending physicians post milestones as procedures occur.
                      </div>
                    ) : (
                      <div className="timeline position-relative ps-4 border-start border-2 border-primary">
                        {updates.map((update) => (
                          <div key={update._id} className="mb-4 position-relative">
                            <div
                              className="position-absolute bg-primary rounded-circle border border-white"
                              style={{ width: '12px', height: '12px', left: '-22px', top: '5px' }}
                            />
                            <div className="card border rounded-3 p-3 shadow-xs">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="badge bg-primary-subtle text-primary fw-semibold small">
                                  {update.stage}
                                </span>
                                <small className="text-muted">
                                  {new Date(update.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                              <h6 className="fw-bold text-dark mb-1">{update.title}</h6>
                              <p className="text-secondary small mb-2">{update.description}</p>
                              
                              {update.recoveryPercentage > 0 && (
                                <div className="mb-2">
                                  <div className="d-flex justify-content-between small text-muted mb-1">
                                    <span>Recovery Progress:</span>
                                    <span className="fw-bold text-success">{update.recoveryPercentage}%</span>
                                  </div>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div
                                      className="progress-bar bg-success"
                                      style={{ width: `${update.recoveryPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {update.doctorNotes && (
                                <div className="bg-light p-2 rounded small text-muted fst-italic">
                                  <strong>Doctor Note:</strong> {update.doctorNotes}
                                </div>
                              )}

                              <div className="mt-2 text-end text-muted small" style={{ fontSize: '0.72rem' }}>
                                Posted by {update.authorName} ({update.authorRole})
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Donors Wall Tab */}
                {activeTab === 'donors' && (
                  <div>
                    <h4 className="fw-bold text-mfms-navy mb-3">Community Supporters Wall</h4>
                    {donors.length === 0 ? (
                      <div className="text-center py-4 text-muted small">
                        Be the first kind supporter to donate to this patient!
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {donors.map((d, index) => (
                          <div key={index} className="card border-0 bg-light rounded-3 p-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-bold text-dark">
                                {d.isAnonymous ? 'Kind Anonymous Donor' : d.donorName}
                              </span>
                              <span className="fw-bold text-mfms-blue">{formatINR(d.amount)}</span>
                            </div>
                            {d.message && (
                              <p className="text-muted small mb-1 fst-italic">"{d.message}"</p>
                            )}
                            <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
                              {new Date(d.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Hospital & Doctor Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-mfms-light text-mfms-blue p-3 rounded-circle">
                  <Building2 size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-mfms-navy mb-0">{campaign.hospitalName}</h6>
                  <p className="text-muted small mb-0">Admitted Treating Hospital Center</p>
                  <span className="badge bg-success-subtle text-success small mt-1">
                    NABH & JCI Accredited Medical Facility
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Donation Card */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
              
              {/* Fundraising Progress Dashboard */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-baseline mb-1">
                  <div>
                    <span className="text-muted small text-uppercase fw-semibold d-block">Amount Raised</span>
                    <h3 className="fw-bold text-mfms-blue mb-0">
                      {formatINR(campaign.raisedAmount || 0)}
                    </h3>
                  </div>
                  <div className="text-end">
                    <span className="text-muted small text-uppercase fw-semibold d-block">Goal Amount</span>
                    <span className="fw-bold text-dark fs-6">
                      {formatINR(campaign.fundingGoal || 1000000)}
                    </span>
                  </div>
                </div>

                <div className="mfms-progress-wrapper my-2" style={{ height: '10px' }}>
                  <div className="mfms-progress-bar" style={{ width: `${percentRaised}%` }} />
                </div>

                {/* 4 Key Metrics Display */}
                <div className="row g-2 text-center bg-light rounded-3 p-3 mt-2 border">
                  <div className="col-6 border-end border-bottom pb-2">
                    <span className="text-muted small d-block text-uppercase" style={{ fontSize: '0.68rem' }}>Amount Raised</span>
                    <strong className="text-primary fs-6">{formatINR(campaign.raisedAmount || 0)}</strong>
                  </div>
                  <div className="col-6 border-bottom pb-2">
                    <span className="text-muted small d-block text-uppercase" style={{ fontSize: '0.68rem' }}>Amount Remaining</span>
                    <strong className="text-danger fs-6">{formatINR(Math.max(0, (campaign.fundingGoal || 1000000) - (campaign.raisedAmount || 0)))}</strong>
                  </div>
                  <div className="col-6 border-end pt-2">
                    <span className="text-muted small d-block text-uppercase" style={{ fontSize: '0.68rem' }}>Percentage Completed</span>
                    <strong className="text-success fs-6">{percentRaised}%</strong>
                  </div>
                  <div className="col-6 pt-2">
                    <span className="text-muted small d-block text-uppercase" style={{ fontSize: '0.68rem' }}>Total Donors</span>
                    <strong className="text-dark fs-6">{campaign.donorsCount || 0} Donors</strong>
                  </div>
                </div>
              </div>

              {/* Outstanding need alert */}
              {Math.max(0, (campaign.fundingGoal || 1000000) - (campaign.raisedAmount || 0)) > 0 ? (
                <div className="alert alert-warning py-2 px-3 rounded-3 small mb-3">
                  <strong>Amount Remaining:</strong> {formatINR(Math.max(0, (campaign.fundingGoal || 1000000) - (campaign.raisedAmount || 0)))} needed to reach full medical goal.
                </div>
              ) : (
                <div className="alert alert-success py-2 px-3 rounded-3 small mb-3">
                  <strong>Goal Reached!</strong> This patient has achieved 100% funding.
                </div>
              )}

              {/* Patient Direct UPI QR Scanner Card */}
              <div className="bg-light border rounded-3 p-3 mb-3 text-center">
                <div className="d-flex align-items-center justify-content-center gap-1 fw-bold text-mfms-navy small mb-2">
                  <QrCode size={16} className="text-mfms-blue" />
                  <span>Scan Patient QR to Donate Instantly</span>
                </div>
                <div className="bg-white p-2 d-inline-block rounded-3 shadow-xs border mb-2">
                  <img
                    src={campaign.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${encodeURIComponent(campaign.upiId || 'patient@medifund')}&pn=${encodeURIComponent(campaign.patientName || 'Medical Case')}&am=100`}
                    alt="Patient Payment QR"
                    style={{ width: '130px', height: '130px', objectFit: 'contain' }}
                  />
                </div>
                {campaign.upiId && (
                  <div className="fw-bold text-mfms-navy small mb-1">
                    UPI ID: <span className="text-primary">{campaign.upiId}</span>
                  </div>
                )}
                <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                  Scan with GPay, PhonePe, Paytm, or any banking app
                </div>
              </div>

              {/* Big CTA Donate Button */}
              <button
                className="btn btn-mfms-primary w-100 py-3 fw-bold fs-6 mb-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                onClick={() => setDonationModalOpen(true)}
              >
                <Activity size={18} />
                <span>Donate Now (Card / UPI / NetBanking)</span>
              </button>

              {/* Share Button */}
              <button
                className="btn btn-outline-secondary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3"
                onClick={handleCopyLink}
              >
                <Share2 size={16} />
                <span>Share & Copy Campaign Link</span>
              </button>

              {/* Trust highlights */}
              <div className="border-top pt-3 small text-muted d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={16} className="text-success shrink-0" />
                  <span>Funds disbursed directly to verified hospital accounts.</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>Eligible for Section 80G / 501(c)(3) tax exemption.</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Activity size={16} className="text-info shrink-0" />
                  <span>Track treatment updates sent straight to your email.</span>
                </div>
              </div>

              {/* NGO Backing Card */}
              {campaign.ngoName && (
                <div className="bg-light p-3 rounded-3 mt-3 border small">
                  <div className="fw-bold text-dark mb-1">Humanitarian Partner NGO:</div>
                  <div className="text-mfms-blue fw-semibold">{campaign.ngoName}</div>
                  <p className="text-muted mb-0 small mt-1" style={{ fontSize: '0.75rem' }}>
                    Oversees bill settlements and co-sponsors family living needs.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Donation Modal */}
      {donationModalOpen && (
        <DonationModal
          campaign={campaign}
          onClose={() => setDonationModalOpen(false)}
          onDonationSuccess={handleDonationSuccess}
          onOpenReceipt={(receiptId) => {
            setDonationModalOpen(false);
            setActiveReceiptId(receiptId);
          }}
        />
      )}

      {/* Receipt Modal */}
      {activeReceiptId && (
        <ReceiptModal
          donationId={activeReceiptId}
          onClose={() => setActiveReceiptId(null)}
        />
      )}

    </div>
  );
};

export default CampaignDetailPage;
