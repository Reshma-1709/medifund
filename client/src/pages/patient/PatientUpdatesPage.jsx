import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Activity, PlusCircle, CheckCircle2 } from 'lucide-react';

const PatientUpdatesPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recoveryPercentage, setRecoveryPercentage] = useState(50);
  const [stage, setStage] = useState('Post-Op Recovery');
  const [loading, setLoading] = useState(false);
  const [pastUpdates, setPastUpdates] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await api.get('/patient/dashboard');
        if (data.success) {
          setCampaigns(data.campaigns || []);
          if (data.campaigns?.length > 0) {
            setSelectedCampaignId(data.campaigns[0]._id);
          }
          setPastUpdates(data.recentUpdates || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!selectedCampaignId || !title || !description) {
      toast.error('Please select campaign and provide title & description');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/treatment/${selectedCampaignId}/updates`, {
        title,
        description,
        stage,
        recoveryPercentage: Number(recoveryPercentage)
      });

      if (data.success) {
        toast.success('Recovery progress update published successfully!');
        setPastUpdates([data.update, ...pastUpdates]);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Post Patient Recovery Update</h3>
        <p className="text-muted small">Keep empathetic donors informed about medical healing milestones.</p>
      </div>

      <div className="row g-4">
        {/* Update Form */}
        <div className="col-12 col-lg-6">
          <div className="mfms-card p-4">
            <h5 className="fw-bold text-mfms-navy mb-3 d-flex align-items-center gap-2">
              <Activity size={20} className="text-primary" />
              <span>Share Treatment Milestone</span>
            </h5>

            <form onSubmit={handlePostUpdate}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Select Case Campaign</label>
                <select
                  className="form-select bg-light"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  required
                >
                  {campaigns.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Treatment Stage</label>
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

              <div className="mb-3">
                <label className="form-label small fw-semibold">Update Headline</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="e.g. Surgery Complete! Michael is resting comfortably in step-down care."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Estimated Recovery Progress: {recoveryPercentage}%</label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  value={recoveryPercentage}
                  onChange={(e) => setRecoveryPercentage(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Detailed Description</label>
                <textarea
                  rows="4"
                  className="form-control bg-light"
                  placeholder="Share details on vitals, doctor visits, pain reduction, discharge timeline..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-mfms-primary w-100 py-2 fw-semibold" disabled={loading}>
                {loading ? 'Publishing...' : 'Publish Update to Campaign Wall'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Updates List */}
        <div className="col-12 col-lg-6">
          <div className="mfms-card p-4">
            <h5 className="fw-bold text-mfms-navy mb-3">Published Updates Feed</h5>
            {pastUpdates.length === 0 ? (
              <p className="text-muted small">No recovery updates posted yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {pastUpdates.map((u) => (
                  <div key={u._id} className="card border p-3 rounded-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-primary-subtle text-primary small">{u.stage}</span>
                      <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="fw-bold text-dark small mb-1">{u.title}</div>
                    <p className="text-secondary small mb-2">{u.description}</p>
                    <div className="small text-success fw-semibold">
                      Recovery progress: {u.recoveryPercentage}%
                    </div>
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

export default PatientUpdatesPage;
