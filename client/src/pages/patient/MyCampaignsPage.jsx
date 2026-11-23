import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FileText, PlusCircle, ArrowRight, Eye, Upload, QrCode, ShieldCheck } from 'lucide-react';

const MyCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampId, setSelectedCampId] = useState(null);
  const fileInputRef = useRef(null);

  const fetchCampaigns = async () => {
    try {
      const { data } = await api.get('/patient/dashboard');
      if (data.success) {
        setCampaigns(data.campaigns || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleTriggerUpload = (campId) => {
    setSelectedCampId(campId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
    formData.append('docType', 'Medical Report');
    if (selectedCampId) {
      formData.append('campaignId', selectedCampId);
    }

    try {
      const { data } = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        toast.success('Document uploaded and stored in database successfully!');
        await fetchCampaigns();
      }
    } catch (err) {
      toast.error('Failed to upload document');
    }
  };

  return (
    <div className="container-fluid py-2">
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.png,.jpg,.jpeg"
        className="d-none"
        onChange={handleFileChange}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-mfms-navy mb-1">My Medical Campaigns</h3>
          <p className="text-muted small mb-0">Manage your active fundraising cases, uploaded documents, and hospital records.</p>
        </div>
        <Link to="/patient/create-campaign" className="btn btn-mfms-primary btn-sm d-flex align-items-center gap-1">
          <PlusCircle size={16} />
          <span>New Campaign</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="mfms-card p-5 text-center">
          <FileText size={48} className="text-muted opacity-50 mb-3 mx-auto" />
          <h5 className="fw-bold text-dark">No campaigns registered</h5>
          <p className="text-muted small mb-3">Submit your patient case to begin receiving hospital-verified support.</p>
          <Link to="/patient/create-campaign" className="btn btn-mfms-primary">Start Campaign</Link>
        </div>
      ) : (
        <div className="row g-4">
          {campaigns.map((c) => {
            const percent = Math.min(100, Math.round(((c.raisedAmount || 0) / (c.fundingGoal || 1)) * 100));
            const docs = c.medicalDocuments || [];

            return (
              <div key={c._id} className="col-12 col-md-6 col-xl-4">
                <div className="mfms-card h-100 p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary rounded-pill small">{c.category}</span>
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
                  </div>

                  <h5 className="fw-bold text-mfms-navy mb-2 line-clamp-2">{c.title}</h5>

                  {c.status === 'rejected' && (
                    <div className="alert alert-danger py-2 px-2 small mb-2" style={{ fontSize: '0.75rem' }}>
                      <strong>Rejection Note:</strong> {c.rejectionReason || 'Campaign was rejected because documents were not genuine.'}
                    </div>
                  )}

                  <p className="text-muted small mb-3 line-clamp-2">{c.description}</p>

                  {/* Uploaded Docs + UPI Details */}
                  <div className="bg-light border rounded-3 p-2 mb-3 small">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="d-flex align-items-center gap-1 text-dark fw-semibold" style={{ fontSize: '0.72rem' }}>
                        <FileText size={13} className="text-primary" />
                        <span>{docs.length} Uploaded Docs</span>
                      </span>
                      <button
                        onClick={() => handleTriggerUpload(c._id)}
                        className="btn btn-sm btn-link p-0 text-primary small text-decoration-none"
                        style={{ fontSize: '0.72rem' }}
                      >
                        + Upload Doc
                      </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-muted" style={{ fontSize: '0.7rem' }}>
                      <span className="d-flex align-items-center gap-1 text-truncate" style={{ maxWidth: '140px' }}>
                        <QrCode size={12} className="text-mfms-blue shrink-0" />
                        <span className="text-truncate">{c.upiId || 'No UPI'}</span>
                      </span>
                      {c.qrCodeUrl && (
                        <span className="text-success fw-semibold">✓ QR Saved</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="mfms-progress-wrapper mb-2">
                      <div className="mfms-progress-bar" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="d-flex justify-content-between small text-muted mb-3">
                      <span>${(c.raisedAmount || 0).toLocaleString()} raised</span>
                      <span>Goal: ${(c.fundingGoal || 0).toLocaleString()}</span>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleTriggerUpload(c._id)}
                        className="btn btn-sm btn-outline-secondary flex-grow-1 fw-semibold d-flex align-items-center justify-content-center gap-1"
                      >
                        <Upload size={14} />
                        <span>Document Upload</span>
                      </button>
                      <Link
                        to={`/campaigns/${c._id}`}
                        className="btn btn-sm btn-mfms-primary px-3 fw-semibold d-flex align-items-center justify-content-center gap-1"
                      >
                        <Eye size={14} />
                        <span>Live Page</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCampaignsPage;
