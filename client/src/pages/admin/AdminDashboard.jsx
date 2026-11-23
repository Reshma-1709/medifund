import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  QrCode,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  Building2,
  Clock,
  ExternalLink,
  ChevronRight,
  User,
  HeartHandshake
} from 'lucide-react';

const AdminDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [rejectModalCampaign, setRejectModalCampaign] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState(
    'Campaign was rejected because documents were not genuine.'
  );

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await api.get('/campaigns?limit=200');
      if (res.data.success) {
        setCampaigns(res.data.campaigns || []);
      }
    } catch (err) {
      toast.error('Failed to load campaigns');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleApprove = async (campaignId) => {
    try {
      setProcessingId(campaignId);
      const res = await api.put(`/campaigns/${campaignId}/status`, {
        status: 'approved'
      });
      if (res.data.success) {
        toast.success('Campaign approved successfully! It is now live.');
        setCampaigns((prev) =>
          prev.map((c) =>
            c._id === campaignId
              ? { ...c, status: 'approved', rejectionReason: '' }
              : c
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve campaign');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModalCampaign) return;
    try {
      setProcessingId(rejectModalCampaign._id);
      const reason = rejectionReasonInput.trim() || 'Campaign was rejected because documents were not genuine.';
      const res = await api.put(`/campaigns/${rejectModalCampaign._id}/status`, {
        status: 'rejected',
        rejectionReason: reason
      });
      if (res.data.success) {
        toast.success('Campaign rejected. Patient has been notified.');
        setCampaigns((prev) =>
          prev.map((c) =>
            c._id === rejectModalCampaign._id
              ? { ...c, status: 'rejected', rejectionReason: reason }
              : c
          )
        );
        setRejectModalCampaign(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject campaign');
    } finally {
      setProcessingId(null);
    }
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const isPending = c.status === 'pending_hospital' || c.status === 'pending_ngo' || c.status === 'draft';
    const isApproved = c.status === 'approved' || c.status === 'completed';
    const isRejected = c.status === 'rejected';

    if (activeTab === 'pending' && !isPending) return false;
    if (activeTab === 'approved' && !isApproved) return false;
    if (activeTab === 'rejected' && !isRejected) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (c.title || '').toLowerCase().includes(q);
      const matchPatient = (c.patientName || '').toLowerCase().includes(q);
      const matchHospital = (c.hospitalName || '').toLowerCase().includes(q);
      const matchCategory = (c.category || '').toLowerCase().includes(q);
      return matchTitle || matchPatient || matchHospital || matchCategory;
    }
    return true;
  });

  const countPending = campaigns.filter(
    (c) => c.status === 'pending_hospital' || c.status === 'pending_ngo' || c.status === 'draft'
  ).length;
  const countApproved = campaigns.filter(
    (c) => c.status === 'approved' || c.status === 'completed'
  ).length;
  const countRejected = campaigns.filter((c) => c.status === 'rejected').length;

  return (
    <div className="container-fluid py-3">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
        <div>
          <div className="d-inline-flex align-items-center gap-2 bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill small fw-bold mb-2">
            <ShieldCheck size={16} />
            <span>Admin Review Center</span>
          </div>
          <h2 className="fw-bold text-mfms-navy mb-1">Patient Campaigns</h2>
          <p className="text-muted small mb-0">
            Review patient medical submissions, inspect verified clinical records and donation QR codes, and approve or reject campaigns.
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-white text-secondary border px-3 py-2 rounded-3 shadow-xs">
            Total Campaigns: <strong className="text-dark">{campaigns.length}</strong>
          </span>
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 rounded-3">
            Pending: <strong>{countPending}</strong>
          </span>
          <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle px-3 py-2 rounded-3">
            Live: <strong>{countApproved}</strong>
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-3 shadow-xs p-3 mb-4 border">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          {/* Tabs */}
          <ul className="nav nav-pills gap-2">
            <li className="nav-item">
              <button
                className={`nav-link btn-sm rounded-pill px-3 py-2 fw-semibold ${
                  activeTab === 'all' ? 'active bg-primary' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Campaigns ({campaigns.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn-sm rounded-pill px-3 py-2 fw-semibold ${
                  activeTab === 'pending' ? 'active bg-warning text-dark' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Verification ({countPending})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn-sm rounded-pill px-3 py-2 fw-semibold ${
                  activeTab === 'approved' ? 'active bg-success' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('approved')}
              >
                Approved & Live ({countApproved})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn-sm rounded-pill px-3 py-2 fw-semibold ${
                  activeTab === 'rejected' ? 'active bg-danger' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('rejected')}
              >
                Rejected ({countRejected})
              </button>
            </li>
          </ul>

          {/* Search Box */}
          <div className="position-relative" style={{ maxWidth: '320px', width: '100%' }}>
            <Search
              size={16}
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            />
            <input
              type="text"
              className="form-control form-control-sm ps-5 rounded-pill"
              placeholder="Search patient, hospital, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Campaign List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted small">Loading patient campaigns...</p>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border p-5">
          <ShieldCheck size={48} className="text-muted opacity-50 mb-3" />
          <h5 className="fw-bold text-mfms-navy mb-1">No campaigns found</h5>
          <p className="text-muted small mb-0">
            {searchTerm
              ? 'No campaigns matched your search filter.'
              : 'There are no campaigns under this category tab.'}
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredCampaigns.map((camp) => {
            const isApproved = camp.status === 'approved' || camp.status === 'completed';
            const isRejected = camp.status === 'rejected';
            const isPending = !isApproved && !isRejected;
            const docs = camp.medicalDocuments || [];

            return (
              <div
                key={camp._id}
                className={`card rounded-3 shadow-xs border transition-all ${
                  isApproved
                    ? 'border-success-subtle'
                    : isRejected
                    ? 'border-danger-subtle bg-danger-subtle bg-opacity-10'
                    : 'border-warning-subtle'
                }`}
              >
                <div className="card-body p-4">
                  <div className="row g-4 align-items-center">
                    {/* Left: Thumbnail & Patient Info */}
                    <div className="col-12 col-md-3 col-lg-2 text-center text-md-start">
                      <div className="position-relative d-inline-block">
                        <img
                          src={
                            camp.bannerImage ||
                            'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={camp.title}
                          className="rounded-3 shadow-xs object-fit-cover"
                          style={{ width: '120px', height: '100px' }}
                        />
                        {camp.urgency === 'critical' || camp.urgency === 'urgent' ? (
                          <span className="position-absolute top-0 start-0 badge bg-danger text-uppercase m-1 small" style={{ fontSize: '0.62rem' }}>
                            {camp.urgency}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-2 small text-muted">
                        <div className="fw-bold text-dark">{camp.patientName || 'Patient'}</div>
                        <div>Age: {camp.patientAge || '—'} | {camp.patientGender || '—'}</div>
                      </div>
                    </div>

                    {/* Middle: Campaign & Medical Details */}
                    <div className="col-12 col-md-6 col-lg-7">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <h5 className="fw-bold text-mfms-navy mb-0">{camp.title}</h5>
                        <span className="badge bg-light text-primary border small">{camp.category || 'General'}</span>
                        
                        {/* Status Badge */}
                        {isApproved && (
                          <span className="badge bg-success text-white small d-inline-flex align-items-center gap-1">
                            <CheckCircle size={12} /> Live & Approved
                          </span>
                        )}
                        {isPending && (
                          <span className="badge bg-warning text-dark small d-inline-flex align-items-center gap-1">
                            <Clock size={12} /> Pending Verification
                          </span>
                        )}
                        {isRejected && (
                          <span className="badge bg-danger text-white small d-inline-flex align-items-center gap-1">
                            <XCircle size={12} /> Rejected
                          </span>
                        )}
                      </div>

                      <p className="text-muted small mb-2 text-truncate-2" style={{ lineHeight: '1.4' }}>
                        {camp.description || camp.story}
                      </p>

                      <div className="d-flex flex-wrap gap-4 small text-secondary mb-3">
                        <div>
                          <strong className="text-dark">Goal:</strong> ₹{camp.fundingGoal?.toLocaleString()}
                        </div>
                        <div>
                          <strong className="text-success">Raised:</strong> ₹{camp.raisedAmount?.toLocaleString() || 0}
                        </div>
                        <div>
                          <strong className="text-dark">Hospital:</strong> {camp.hospitalName || 'Apollo Memorial Hospital'}
                        </div>
                        {camp.upiId && (
                          <div className="badge bg-light text-dark border px-2 py-1">
                            UPI: <strong>{camp.upiId}</strong>
                          </div>
                        )}
                      </div>

                      {/* Rejection Notice Banner if rejected */}
                      {isRejected && (
                        <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                          <AlertTriangle size={16} className="shrink-0 text-danger" />
                          <span>
                            <strong>Rejection Note:</strong> {camp.rejectionReason || 'Campaign was rejected because documents were not genuine.'}
                          </span>
                        </div>
                      )}

                      {/* Medical Documents Section */}
                      <div className="border-top pt-2">
                        <span className="small fw-bold text-secondary text-uppercase d-block mb-2" style={{ fontSize: '0.7rem' }}>
                          Uploaded Medical Documents & Verification Files ({docs.length})
                        </span>
                        {docs.length === 0 ? (
                          <span className="text-muted small fst-italic">No medical records uploaded yet</span>
                        ) : (
                          <div className="d-flex flex-wrap gap-2">
                            {docs.map((doc, idx) => (
                              <button
                                key={idx}
                                className="btn btn-sm btn-light border d-inline-flex align-items-center gap-1 text-truncate"
                                style={{ maxWidth: '200px', fontSize: '0.78rem' }}
                                onClick={() => setSelectedDoc(doc)}
                                title={doc.name}
                              >
                                <FileText size={14} className="text-primary" />
                                <span className="text-truncate">{doc.name || 'Medical Document'}</span>
                                <Eye size={12} className="text-muted ms-1" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* QR Code preview pill */}
                      {camp.qrCodeUrl && (
                        <div className="mt-2">
                          <button
                            className="btn btn-sm btn-outline-info py-0 px-2 rounded-pill small"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() =>
                              setSelectedDoc({
                                name: 'Donation QR Code',
                                url: camp.qrCodeUrl,
                                docType: 'Payment QR'
                              })
                            }
                          >
                            <QrCode size={13} className="me-1" />
                            View Donation QR Code
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right: Approve / Reject Verification Actions */}
                    <div className="col-12 col-md-3 col-lg-3 text-md-end border-start-md pt-3 pt-md-0">
                      <div className="d-flex flex-column gap-2 justify-content-center">
                        {isPending && (
                          <>
                            <button
                              className="btn btn-success btn-sm fw-bold py-2 d-inline-flex align-items-center justify-content-center gap-2 shadow-xs"
                              disabled={processingId === camp._id}
                              onClick={() => handleApprove(camp._id)}
                            >
                              <CheckCircle size={16} />
                              <span>{processingId === camp._id ? 'Approving...' : 'Approve Campaign'}</span>
                            </button>

                            <button
                              className="btn btn-outline-danger btn-sm fw-bold py-2 d-inline-flex align-items-center justify-content-center gap-2"
                              disabled={processingId === camp._id}
                              onClick={() => {
                                setRejectModalCampaign(camp);
                                setRejectionReasonInput(
                                  'Campaign was rejected because documents were not genuine.'
                                );
                              }}
                            >
                              <XCircle size={16} />
                              <span>Reject Campaign</span>
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <div className="d-flex flex-column gap-2">
                            <div className="text-success small fw-bold d-flex align-items-center justify-content-md-end gap-1">
                              <CheckCircle size={16} /> Live on Website
                            </div>
                            <Link
                              to={`/campaigns/${camp._id}`}
                              target="_blank"
                              className="btn btn-outline-primary btn-sm py-1 d-inline-flex align-items-center justify-content-center gap-1"
                            >
                              <span>View Public Page</span>
                              <ExternalLink size={14} />
                            </Link>
                            <button
                              className="btn btn-light text-danger btn-sm py-1 border"
                              onClick={() => {
                                setRejectModalCampaign(camp);
                                setRejectionReasonInput(
                                  'Campaign was rejected because documents were not genuine.'
                                );
                              }}
                            >
                              Revoke & Reject
                            </button>
                          </div>
                        )}

                        {isRejected && (
                          <div className="d-flex flex-column gap-2">
                            <span className="badge bg-danger-subtle text-danger p-2 small">
                              Rejected from Public Platform
                            </span>
                            <button
                              className="btn btn-outline-success btn-sm py-1 d-inline-flex align-items-center justify-content-center gap-1"
                              disabled={processingId === camp._id}
                              onClick={() => handleApprove(camp._id)}
                            >
                              <CheckCircle size={14} /> Re-Approve Campaign
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectModalCampaign && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom bg-danger bg-opacity-10 py-3">
                <h5 className="modal-title fw-bold text-danger d-flex align-items-center gap-2">
                  <XCircle size={20} />
                  Reject Campaign
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRejectModalCampaign(null)}
                />
              </div>
              <div className="modal-body p-4">
                <p className="text-muted small mb-3">
                  You are about to reject the campaign for{' '}
                  <strong className="text-dark">{rejectModalCampaign.patientName}</strong>:{' '}
                  <em>"{rejectModalCampaign.title}"</em>.
                </p>

                <label className="form-label fw-bold small text-dark">
                  Rejection Reason (Message sent to Patient)
                </label>
                <textarea
                  className="form-control rounded-3 mb-2"
                  rows={3}
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                />
                <small className="text-muted d-block">
                  Standard template: <em>“Campaign was rejected because documents were not genuine.”</em>
                </small>
              </div>
              <div className="modal-footer border-top p-3">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  onClick={() => setRejectModalCampaign(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill px-4 fw-bold"
                  disabled={processingId === rejectModalCampaign._id}
                  onClick={handleReject}
                >
                  {processingId === rejectModalCampaign._id ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1070 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom py-3">
                <div className="d-flex align-items-center gap-2">
                  <FileText className="text-primary" size={20} />
                  <h6 className="modal-title fw-bold mb-0 text-mfms-navy">
                    {selectedDoc.name || 'Medical Document'}
                  </h6>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedDoc(null)}
                />
              </div>
              <div className="modal-body p-3 text-center bg-light">
                {selectedDoc.url ? (
                  selectedDoc.url.toLowerCase().endsWith('.pdf') ? (
                    <div className="p-4 bg-white rounded-3 shadow-xs">
                      <FileText size={48} className="text-primary mb-3" />
                      <p className="fw-semibold text-dark mb-2">{selectedDoc.name}</p>
                      <a
                        href={selectedDoc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm px-4 rounded-pill"
                      >
                        Open PDF in New Window
                      </a>
                    </div>
                  ) : (
                    <img
                      src={selectedDoc.url}
                      alt={selectedDoc.name}
                      className="img-fluid rounded-3 shadow-xs"
                      style={{ maxHeight: '500px', objectFit: 'contain' }}
                    />
                  )
                ) : (
                  <p className="text-muted small my-4">Document preview unavailable</p>
                )}
                {selectedDoc.notes && (
                  <div className="mt-3 text-start bg-white p-3 rounded-3 border small">
                    <strong className="text-dark">Clinical Note:</strong> {selectedDoc.notes}
                  </div>
                )}
              </div>
              <div className="modal-footer border-top py-2 px-3">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm rounded-pill px-4"
                  onClick={() => setSelectedDoc(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
