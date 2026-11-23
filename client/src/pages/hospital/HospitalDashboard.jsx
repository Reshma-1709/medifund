import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatINR } from '../../utils/currency';
import { 
  Building2, 
  FileCheck, 
  Stethoscope, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const HospitalDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModalCase, setReviewModalCase] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [estimate, setEstimate] = useState(45000);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/hospitals/dashboard');
      if (data.success) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAction = async (action) => {
    if (!reviewModalCase) return;
    setActionLoading(true);
    try {
      const { data } = await api.post(`/hospitals/verifications/${reviewModalCase._id}`, {
        action,
        hospitalReviewNotes: doctorNotes,
        hospitalEstimate: Number(estimate)
      });
      if (data.success) {
        toast.success(`Case successfully marked as ${action.toUpperCase()}`);
        setReviewModalCase(null);
        fetchDashboard();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification action error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const metrics = dashboardData?.metrics || {};
  const pendingRequests = dashboardData?.pendingRequests || [];
  const verifiedPatients = dashboardData?.verifiedPatients || [];

  return (
    <div className="container-fluid py-2">
      
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-mfms-navy mb-1">Hospital Clinical Verification Hub</h2>
          <p className="text-muted small mb-0">
            {dashboardData?.hospital?.hospitalName || 'Accredited Medical Center'} • JCI & NABH Certified Desk
          </p>
        </div>
        <Link to="/hospital/post-update" className="btn btn-mfms-primary fw-semibold d-flex align-items-center gap-2">
          <Activity size={18} />
          <span>Publish Surgical / ICU Milestone</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="mfms-card p-4">
            <span className="text-muted small fw-bold text-uppercase">Pending Clinical Audits</span>
            <h3 className="fw-bold text-warning mt-1 mb-0">{metrics.pendingRequestsCount || 0}</h3>
            <small className="text-muted mt-1 d-block">Requires doctor verification</small>
          </div>
        </div>

        <div className="col-12 col-sm-4">
          <div className="mfms-card p-4">
            <span className="text-muted small fw-bold text-uppercase">Admitted Verified Patients</span>
            <h3 className="fw-bold text-success mt-1 mb-0">{metrics.verifiedPatientsCount || 0}</h3>
            <small className="text-muted mt-1 d-block">Medical credentials active</small>
          </div>
        </div>

        <div className="col-12 col-sm-4">
          <div className="mfms-card p-4">
            <span className="text-muted small fw-bold text-uppercase">Total Surgical Estimates</span>
            <h3 className="fw-bold text-mfms-blue mt-1 mb-0">
              {formatINR(metrics.totalEstimateProvided || 0)}
            </h3>
            <small className="text-muted mt-1 d-block">Authenticated clinical budgets</small>
          </div>
        </div>
      </div>

      {/* Verification Queue Section */}
      <div className="mfms-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold text-mfms-navy mb-0">Verification Queue: Incoming Patient Cases</h5>
            <small className="text-muted">Authenticate medical records before campaigns launch publicly.</small>
          </div>
          <Link to="/hospital/verifications" className="small text-mfms-blue fw-semibold text-decoration-none">
            View All ({pendingRequests.length})
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-4 text-muted small bg-light rounded-3">
            <CheckCircle size={32} className="text-success mx-auto mb-2" />
            <p className="mb-0">All patient medical verification requests have been audited!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-uppercase">
                  <th>Patient Name</th>
                  <th>Diagnosis / Condition</th>
                  <th>Category</th>
                  <th>Urgency</th>
                  <th>Goal</th>
                  <th className="text-end">Review Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req) => (
                  <tr key={req._id} className="small">
                    <td>
                      <div className="fw-bold text-dark">{req.patientName}</div>
                      <small className="text-muted">{req.patientAge} yrs, {req.patientGender}</small>
                    </td>
                    <td>{req.description?.substring(0, 50)}...</td>
                    <td><span className="badge bg-light text-primary border">{req.category}</span></td>
                    <td>
                      <span className={`badge ${req.urgency === 'critical' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {req.urgency.toUpperCase()}
                      </span>
                    </td>
                    <td><strong className="text-mfms-blue">${req.fundingGoal.toLocaleString()}</strong></td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-mfms-primary py-1 px-3 fw-semibold"
                        onClick={() => {
                          setReviewModalCase(req);
                          setEstimate(req.fundingGoal);
                          setDoctorNotes(req.hospitalReviewNotes || 'Verified: Medical diagnosis matches hospital admission records.');
                        }}
                      >
                        Audit & Certify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verified Patients Roster */}
      <div className="mfms-card p-4">
        <h5 className="fw-bold text-mfms-navy mb-3">Accredited Active Cases in Care</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th>Patient</th>
                <th>Procedure Headline</th>
                <th>Funding Progress</th>
                <th>Treatment Stage</th>
                <th>Funds Disbursed to Hospital</th>
              </tr>
            </thead>
            <tbody>
              {verifiedPatients.map((vp) => {
                const pct = Math.min(100, Math.round(((vp.raisedAmount || 0) / (vp.fundingGoal || 1)) * 100));
                return (
                  <tr key={vp._id} className="small">
                    <td><strong>{vp.patientName}</strong></td>
                    <td>
                      <Link to={`/campaigns/${vp._id}`} className="text-dark text-decoration-none fw-semibold">
                        {vp.title}
                      </Link>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="mfms-progress-wrapper flex-grow-1" style={{ width: '80px' }}>
                          <div className="mfms-progress-bar" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-muted">{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary small">
                        {vp.treatmentStage || 'In Treatment'}
                      </span>
                    </td>
                    <td>
                      <strong className="text-success">{formatINR(vp.fundsReleased || 0)}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Modal */}
      {reviewModalCase && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header bg-light border-bottom px-4">
                <h5 className="modal-title fw-bold text-mfms-navy">
                  Clinical Case Audit: {reviewModalCase.patientName}
                </h5>
                <button type="button" className="btn-close" onClick={() => setReviewModalCase(null)} />
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-light border mb-3 small">
                  <strong>Patient Condition:</strong> {reviewModalCase.description}
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Doctor Surgery Cost Estimate (₹ INR)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={estimate}
                      onChange={(e) => setEstimate(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Clinical Priority</label>
                    <input type="text" className="form-control bg-light" value={reviewModalCase.urgency.toUpperCase()} disabled />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Reviewer Physician / Hospital Notes</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <button
                    className="btn btn-outline-danger btn-sm px-3"
                    onClick={() => handleAction('reject')}
                    disabled={actionLoading}
                  >
                    Reject Case
                  </button>
                  <button
                    className="btn btn-outline-warning btn-sm px-3"
                    onClick={() => handleAction('request_info')}
                    disabled={actionLoading}
                  >
                    Request Diagnostic Scans
                  </button>
                  <button
                    className="btn btn-success btn-sm px-4 fw-bold"
                    onClick={() => handleAction('approve')}
                    disabled={actionLoading}
                  >
                    ✓ Approve & Certify Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HospitalDashboard;
