import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatINR } from '../../utils/currency';
import { Stethoscope, CheckCircle, Eye, Activity, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VerificationRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/hospitals/dashboard');
        if (data.success) {
          setRequests(data.pendingRequests || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleQuickApprove = async (id) => {
    try {
      const { data } = await api.post(`/hospitals/verifications/${id}`, {
        action: 'approve',
        hospitalReviewNotes: 'Verified: Medical documents and clinical necessity authenticated by Chief Physician.'
      });
      if (data.success) {
        toast.success('Patient campaign verified and made public!');
        setRequests(requests.filter(r => r._id !== id));
      }
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Medical Verification Queue</h3>
        <p className="text-muted small">Review incoming clinical admission requests, diagnostic tests, and treatment costs.</p>
      </div>

      <div className="mfms-card p-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : requests.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <CheckCircle size={40} className="text-success mx-auto mb-2" />
            <p>Verification queue is clear! All medical claims have been reviewed.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>Patient</th>
                  <th>Clinical Condition</th>
                  <th>Goal</th>
                  <th>Urgency</th>
                  <th className="text-end">Verification Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r._id} className="small">
                    <td>
                      <div className="fw-bold text-dark">{r.patientName}</div>
                      <small className="text-muted">{r.patientAge}y, {r.patientGender}</small>
                    </td>
                    <td>{r.title}</td>
                    <td><strong className="text-mfms-blue">${r.fundingGoal.toLocaleString()}</strong></td>
                    <td><span className="badge bg-warning text-dark">{r.urgency.toUpperCase()}</span></td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <Link to={`/campaigns/${r._id}`} className="btn btn-sm btn-outline-secondary">
                          View Scans
                        </Link>
                        <button
                          className="btn btn-sm btn-success fw-semibold"
                          onClick={() => handleQuickApprove(r._id)}
                        >
                          Approve Case
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const HospitalPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get('/hospitals/patients');
        if (data.success) {
          setPatients(data.patients || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Admitted Patient Medical Records</h3>
        <p className="text-muted small">Registered in-patients and verified clinical candidates receiving care.</p>
      </div>

      <div className="mfms-card p-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>Patient Name</th>
                  <th>Medical Specialty</th>
                  <th>Current Treatment Stage</th>
                  <th>Hospital Disbursed</th>
                  <th>Bed / Case Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id} className="small">
                    <td>
                      <div className="fw-bold text-dark">{p.patientName}</div>
                      <small className="text-muted">Admitted: {p.patientGender}, {p.patientAge} yrs</small>
                    </td>
                    <td><span className="badge bg-light text-primary border">{p.category}</span></td>
                    <td><span className="badge bg-primary-subtle text-primary">{p.treatmentStage || 'In Ward'}</span></td>
                    <td><strong className="text-success">{formatINR(p.fundsReleased || 0)}</strong></td>
                    <td><span className="badge bg-success-subtle text-success">✓ Verified Clinical File</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const PostTreatmentUpdatePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState('');
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState('Surgery / Procedure');
  const [description, setDescription] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [recoveryPercentage, setRecoveryPercentage] = useState(70);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchC = async () => {
      try {
        const { data } = await api.get('/hospitals/patients');
        if (data.success && data.patients?.length > 0) {
          setCampaigns(data.patients);
          setCampaignId(data.patients[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchC();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campaignId || !title || !description) {
      toast.error('Please fill required fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/treatment/${campaignId}/updates`, {
        title,
        stage,
        description,
        doctorNotes,
        recoveryPercentage: Number(recoveryPercentage)
      });
      if (data.success) {
        toast.success('Clinical milestone published to patient wall!');
        setTitle('');
        setDescription('');
        setDoctorNotes('');
      }
    } catch (err) {
      toast.error('Failed to post treatment update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2" style={{ maxWidth: '800px' }}>
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Post Official Hospital Treatment Update</h3>
        <p className="text-muted small">Publish surgical milestones, ICU status, or patient discharge reports.</p>
      </div>

      <div className="mfms-card p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Select Admitted Patient Case</label>
            <select
              className="form-select bg-light"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              required
            >
              {campaigns.map((c) => (
                <option key={c._id} value={c._id}>{c.patientName} — {c.title}</option>
              ))}
            </select>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Clinical Milestone Stage</label>
              <select
                className="form-select bg-light"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option value="Diagnosis & Admission">Diagnosis & Admission</option>
                <option value="Treatment Plan & Tests">Treatment Plan & Tests</option>
                <option value="Surgery / Procedure">Surgery / Procedure</option>
                <option value="ICU Care">ICU Care</option>
                <option value="Post-Op Recovery">Post-Op Recovery</option>
                <option value="Discharged & Follow-up">Discharged & Follow-up</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Recovery Progress: {recoveryPercentage}%</label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="100"
                value={recoveryPercentage}
                onChange={(e) => setRecoveryPercentage(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Update Headline</label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g. Cardiopulmonary Bypass Surgery Successfully Concluded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Procedure Summary for Donors & Family</label>
            <textarea
              rows="3"
              className="form-control bg-light"
              placeholder="Detail operative outcomes, hemodynamic stability, ICU transition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Attending Physician Clinical Notes</label>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="e.g. Vitals normal. Extubated. Inotropes weaned off."
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-mfms-primary w-100 py-3 fw-bold" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Official Treatment Milestone'}
          </button>
        </form>
      </div>
    </div>
  );
};
