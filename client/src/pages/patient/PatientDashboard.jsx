import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Activity, 
  PlusCircle, 
  ArrowRight, 
  ShieldCheck, 
  QrCode,
  Upload,
  ExternalLink,
  Edit2,
  Check,
  FileCheck,
  AlertCircle
} from 'lucide-react';

const PatientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [editingUpi, setEditingUpi] = useState(false);
  const [upiInput, setUpiInput] = useState('');
  const [activeCampaignId, setActiveCampaignId] = useState(null);

  // Hidden file input refs for direct browser file picker opening
  const docFileInputRef = useRef(null);
  const qrFileInputRef = useRef(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/patient/dashboard');
      if (res.data.success) {
        setData(res.data);
        if (res.data.campaigns?.length > 0) {
          const firstCamp = res.data.campaigns[0];
          setActiveCampaignId(firstCamp._id);
          setUpiInput(firstCamp.upiId || res.data.patientProfile?.upiId || '');
        } else if (res.data.patientProfile?.upiId) {
          setUpiInput(res.data.patientProfile.upiId);
        }
      }
    } catch (err) {
      console.error('Failed to load patient dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Handle direct browser file picker for Document Upload
  const triggerDocUpload = (campId = null) => {
    if (campId) setActiveCampaignId(campId);
    if (docFileInputRef.current) {
      docFileInputRef.current.value = '';
      docFileInputRef.current.click();
    }
  };

  // Handle direct browser file picker for QR Code
  const triggerQrUpload = (campId = null) => {
    if (campId) setActiveCampaignId(campId);
    if (qrFileInputRef.current) {
      qrFileInputRef.current.value = '';
      qrFileInputRef.current.click();
    }
  };

  // Process selected file from browser file picker for Document
  const handleDocFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      toast.error('Please upload a PDF, JPG, or PNG document.');
      return;
    }

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
    formData.append('docType', 'Medical Report');
    if (activeCampaignId) {
      formData.append('campaignId', activeCampaignId);
    }

    try {
      const { data } = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        toast.success('Document uploaded and stored in database successfully!');
        await fetchDashboard();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  };

  // Process selected file from browser file picker for QR Code
  const handleQrFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Please upload a JPG or PNG image for the QR code.');
      return;
    }

    setUploadingQr(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('isQr', 'true');
    formData.append('docType', 'qr');
    if (activeCampaignId) {
      formData.append('campaignId', activeCampaignId);
    }

    try {
      const { data } = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        toast.success('QR code uploaded successfully and saved to campaign!');
        await fetchDashboard();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload QR code');
    } finally {
      setUploadingQr(false);
    }
  };

  // Save UPI ID to database with confirmation toast
  const handleSaveUpi = async (campId = null) => {
    const targetCampId = campId || activeCampaignId;
    const cleanUpi = upiInput.trim().toLowerCase();
    if (!cleanUpi) {
      toast.error('Please enter a valid UPI ID (e.g. name@bank)');
      return;
    }

    try {
      const { data } = await api.post('/documents/upload', {
        upiId: cleanUpi,
        campaignId: targetCampId
      });
      if (data.success) {
        toast.success('UPI ID uploaded successfully');
        setEditingUpi(false);
        await fetchDashboard();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save UPI ID');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 text-muted small">Loading patient portfolio...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const campaigns = data?.campaigns || [];
  const recentUpdates = data?.recentUpdates || [];
  const profileDocs = data?.patientProfile?.documents || [];

  return (
    <div className="container-fluid py-2">
      
      {/* Hidden file inputs for direct native browser upload */}
      <input
        type="file"
        ref={docFileInputRef}
        accept=".pdf,.png,.jpg,.jpeg"
        style={{ display: 'none' }}
        onChange={handleDocFileChange}
      />
      <input
        type="file"
        ref={qrFileInputRef}
        accept=".png,.jpg,.jpeg"
        style={{ display: 'none' }}
        onChange={handleQrFileChange}
      />

      {/* Top Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-mfms-navy mb-1">Patient Treatment Hub</h2>
          <p className="text-muted small mb-0">
            Track your medical crowdfunding cases, uploaded hospital records, QR codes, and released treatment payments.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button
            onClick={() => triggerDocUpload(campaigns[0]?._id)}
            className="btn btn-outline-primary fw-semibold d-flex align-items-center gap-2"
            disabled={uploadingDoc}
          >
            <Upload size={16} />
            <span>{uploadingDoc ? 'Uploading...' : 'Document Upload'}</span>
          </button>
          <Link to="/patient/create-campaign" className="btn btn-mfms-primary fw-semibold d-flex align-items-center gap-2">
            <PlusCircle size={18} />
            <span>Start New Medical Campaign</span>
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="row g-3 mb-4">
        
        <div className="col-6 col-md-4 col-xl-2">
          <div className="mfms-card p-3">
            <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.68rem' }}>Total Campaigns</div>
            <div className="fs-3 fw-bold text-mfms-navy mt-1">{metrics.totalCampaigns || 0}</div>
            <div className="text-primary small" style={{ fontSize: '0.72rem' }}>Registered cases</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="mfms-card p-3">
            <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.68rem' }}>Pending Audit</div>
            <div className="fs-3 fw-bold text-warning mt-1">{metrics.pendingVerification || 0}</div>
            <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Hospital reviewing</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="mfms-card p-3">
            <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.68rem' }}>Approved & Active</div>
            <div className="fs-3 fw-bold text-success mt-1">{metrics.approvedCampaigns || 0}</div>
            <div className="text-success small" style={{ fontSize: '0.72rem' }}>Live on portal</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="mfms-card p-3">
            <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.68rem' }}>Funds Raised</div>
            <div className="fs-3 fw-bold text-mfms-blue mt-1">
              ${(metrics.totalRaised || 0).toLocaleString()}
            </div>
            <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Crowdfunded total</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="mfms-card p-3">
            <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.68rem' }}>Funds Released</div>
            <div className="fs-3 fw-bold text-info mt-1">
              ${(metrics.totalReleased || 0).toLocaleString()}
            </div>
            <div className="text-info small" style={{ fontSize: '0.72rem' }}>Paid to hospital</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="mfms-card p-3">
            <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.68rem' }}>Outstanding Need</div>
            <div className="fs-3 fw-bold text-danger mt-1">
              ${(metrics.outstandingNeed || 0).toLocaleString()}
            </div>
            <div className="text-danger small" style={{ fontSize: '0.72rem' }}>Remaining goal</div>
          </div>
        </div>

      </div>

      {/* Campaigns Table & Layout */}
      <div className="row g-4">
        
        {/* Patient Campaigns List */}
        <div className="col-12 col-xl-8">
          <div className="mfms-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-mfms-navy mb-0">Your Medical Campaigns</h5>
              <Link to="/patient/my-campaigns" className="small text-mfms-blue fw-semibold text-decoration-none">
                View All
              </Link>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-5">
                <FileText size={40} className="text-muted opacity-50 mb-2" />
                <p className="text-muted small mb-3">You have not created any medical campaigns yet.</p>
                <Link to="/patient/create-campaign" className="btn btn-sm btn-mfms-primary">
                  Launch Your First Medical Case
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {campaigns.map((c) => {
                  const percent = Math.min(100, Math.round(((c.raisedAmount || 0) / (c.fundingGoal || 1)) * 100));
                  const docs = c.medicalDocuments || [];
                  const upi = c.upiId || data?.patientProfile?.upiId || 'Not set';
                  const qr = c.qrCodeUrl || data?.patientProfile?.qrCodeUrl || '';

                  return (
                    <div key={c._id} className="card border rounded-3 p-3 bg-white shadow-xs">
                      
                      {/* Campaign Header & Status */}
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-2">
                        <div>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <h6 className="fw-bold text-mfms-navy mb-0">{c.title}</h6>
                            <span className={`badge rounded-pill small ${
                              c.status === 'approved'
                                ? 'bg-success'
                                : c.status === 'completed'
                                ? 'bg-primary'
                                : c.status === 'rejected'
                                ? 'bg-danger text-white'
                                : 'bg-warning text-dark'
                            }`}>
                              {c.status === 'rejected' ? 'REJECTED' : c.status.toUpperCase()}
                            </span>
                            <span className="badge bg-light text-secondary border small">{c.category}</span>
                          </div>
                          <small className="text-muted">
                            Admitted Hospital: <strong>{c.hospitalName}</strong>
                          </small>
                          {c.status === 'rejected' && (
                            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mt-2 mb-0">
                              <AlertCircle size={15} className="text-danger shrink-0" />
                              <span>
                                <strong>Campaign Status:</strong> {c.rejectionReason || 'Campaign was rejected because documents were not genuine.'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => triggerDocUpload(c._id)}
                            className="btn btn-sm btn-outline-primary py-1 px-2 d-flex align-items-center gap-1"
                            title="Direct Document Upload from Browser"
                          >
                            <Upload size={14} />
                            <span>Document Upload</span>
                          </button>
                          <Link to={`/campaigns/${c._id}`} className="btn btn-sm btn-outline-secondary py-1 px-3 fw-semibold">
                            View Live
                          </Link>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mfms-progress-wrapper mb-2">
                        <div className="mfms-progress-bar" style={{ width: `${percent}%` }} />
                      </div>
                      <div className="d-flex justify-content-between small text-muted mb-3">
                        <span><strong>${(c.raisedAmount || 0).toLocaleString()}</strong> of ${(c.fundingGoal || 0).toLocaleString()}</span>
                        <span>{percent}% funded ({c.donorsCount || 0} donors)</span>
                      </div>

                      {/* Uploaded Documents Section */}
                      <div className="bg-light rounded-3 p-3 mb-3 border">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-mfms-navy small d-flex align-items-center gap-1">
                            <FileCheck size={16} className="text-primary" />
                            <span>Uploaded Medical Documents ({docs.length})</span>
                          </span>
                          <button
                            onClick={() => triggerDocUpload(c._id)}
                            className="btn btn-sm btn-link text-primary text-decoration-none p-0 fw-semibold small"
                          >
                            + Add Another Doc
                          </button>
                        </div>

                        {docs.length === 0 ? (
                          <div className="text-muted small fst-italic">
                            No medical records uploaded yet. Click "Document Upload" above to choose files from your device.
                          </div>
                        ) : (
                          <div className="d-flex flex-wrap gap-2">
                            {docs.map((doc, idx) => (
                              <div key={idx} className="bg-white border rounded p-2 small d-flex align-items-center gap-2 shadow-xs">
                                <FileText size={14} className="text-info shrink-0" />
                                <span className="fw-medium text-dark text-truncate" style={{ maxWidth: '180px' }}>
                                  {doc.name}
                                </span>
                                <span className="badge bg-success-subtle text-success small">✓ Verified</span>
                                {doc.url && (
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary"
                                    title="View document"
                                  >
                                    <ExternalLink size={12} />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* UPI & QR Code Summary */}
                      <div className="row g-2 align-items-center small bg-light rounded-3 p-2 border">
                        <div className="col-12 col-md-6 d-flex align-items-center gap-2">
                          <QrCode size={16} className="text-mfms-blue shrink-0" />
                          <div className="text-truncate">
                            <span className="text-muted">UPI ID: </span>
                            <strong>{upi}</strong>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 d-flex justify-content-md-end align-items-center gap-2">
                          {qr ? (
                            <span className="badge bg-success-subtle text-success d-flex align-items-center gap-1">
                              ✓ QR Code Linked
                            </span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-muted">No custom QR</span>
                          )}
                          <button
                            onClick={() => triggerQrUpload(c._id)}
                            className="btn btn-sm btn-outline-secondary py-0 px-2"
                            style={{ fontSize: '0.75rem' }}
                          >
                            Upload QR
                          </button>
                        </div>
                      </div>

                      {/* Hospital Verification Status */}
                      <div className="d-flex gap-3 pt-2 mt-2 border-top small" style={{ fontSize: '0.75rem' }}>
                        <span className={c.verifiedByHospital ? 'text-success fw-semibold' : 'text-warning'}>
                          {c.verifiedByHospital ? '✓ Hospital Records Verified (Audited)' : '⏳ Hospital Verification In Review'}
                        </span>
                        <span className="text-muted">
                          Funds Released to Hospital: <strong>${(c.fundsReleased || 0).toLocaleString()}</strong>
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: UPI & QR Code Settings & Quick Actions */}
        <div className="col-12 col-xl-4">
          
          {/* Quick Actions Card */}
          <div className="mfms-card p-4 mb-4">
            <h6 className="fw-bold text-mfms-navy mb-3">Direct Browser Actions</h6>
            <div className="d-flex flex-column gap-2">
              <button
                onClick={() => triggerDocUpload(campaigns[0]?._id)}
                className="btn btn-outline-primary btn-sm py-2 text-start d-flex align-items-center gap-2"
                disabled={uploadingDoc}
              >
                <Upload size={16} className="text-primary" />
                <span>{uploadingDoc ? 'Uploading from device...' : 'Document Upload (Browser File Picker)'}</span>
              </button>
              <button
                onClick={() => triggerQrUpload(campaigns[0]?._id)}
                className="btn btn-outline-secondary btn-sm py-2 text-start d-flex align-items-center gap-2"
                disabled={uploadingQr}
              >
                <QrCode size={16} className="text-info" />
                <span>{uploadingQr ? 'Uploading QR...' : 'Upload Donation QR Code Image'}</span>
              </button>
              <Link to="/patient/updates" className="btn btn-outline-secondary btn-sm py-2 text-start d-flex align-items-center gap-2">
                <Activity size={16} className="text-success" />
                <span>Post Clinical Recovery Update</span>
              </Link>
            </div>
          </div>

          {/* Personal Direct Payment UPI & QR Card */}
          <div className="mfms-card p-4 mb-4 text-center">
            <h6 className="fw-bold text-mfms-navy mb-2 d-flex align-items-center justify-content-center gap-1">
              <QrCode size={18} className="text-primary" />
              <span>Patient Donation QR & UPI ID</span>
            </h6>
            <p className="text-muted small mb-3">
              Saved in database and synced to Donor & NGO dashboards.
            </p>

            {/* QR Image Preview */}
            <div className="bg-white p-2 d-inline-block rounded-3 border shadow-xs mb-3">
              <img
                src={campaigns[0]?.qrCodeUrl || data?.patientProfile?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${encodeURIComponent(upiInput || 'patient@medifund')}&pn=${encodeURIComponent(data?.patientProfile?.fullName || 'Patient')}&am=100`}
                alt="Patient Payment QR"
                style={{ width: '130px', height: '130px', objectFit: 'contain' }}
              />
            </div>

            {/* UPI ID display & update */}
            <div className="mb-3 text-start bg-light p-2 rounded border">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-semibold">Patient UPI ID:</span>
                {!editingUpi && (
                  <button
                    onClick={() => setEditingUpi(true)}
                    className="btn btn-sm btn-link p-0 text-primary small text-decoration-none"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editingUpi ? (
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="name@okaxis"
                    value={upiInput}
                    onChange={(e) => setUpiInput(e.target.value)}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => handleSaveUpi(campaigns[0]?._id)}
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <div className="fw-bold text-dark small text-truncate">
                  {campaigns[0]?.upiId || upiInput || 'No UPI ID set'}
                </div>
              )}
            </div>

            <button
              onClick={() => triggerQrUpload(campaigns[0]?._id)}
              className="btn btn-sm btn-outline-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-1"
              disabled={uploadingQr}
            >
              <Upload size={14} />
              <span>{uploadingQr ? 'Uploading QR...' : 'Upload New QR Code Image'}</span>
            </button>
          </div>

          {/* Clinical Updates Feed */}
          <div className="mfms-card p-4">
            <h6 className="fw-bold text-mfms-navy mb-3">Recent Clinical Milestones</h6>
            {recentUpdates.length === 0 ? (
              <p className="text-muted small mb-0">No updates posted yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {recentUpdates.map((u) => (
                  <div key={u._id} className="border-bottom pb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-primary-subtle text-primary small">{u.stage}</span>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="fw-bold text-dark small">{u.title}</div>
                    <p className="text-muted small mb-0 text-truncate">{u.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default PatientDashboard;
