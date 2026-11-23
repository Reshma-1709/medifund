import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatINR } from '../../utils/currency';
import { DollarSign, ArrowRightLeft, FileText, CheckCircle2 } from 'lucide-react';

export const FundAllocationsPage = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchA = async () => {
      try {
        const { data } = await api.get('/ngos/dashboard');
        if (data.success) {
          setAllocations(data.allocations || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchA();
  }, []);

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Fund Allocation & Hospital Bill Settlements</h3>
        <p className="text-muted small">Direct banking disbursements made to accredited medical provider accounts.</p>
      </div>

      <div className="mfms-card p-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : allocations.length === 0 ? (
          <p className="text-muted text-center py-4">No fund allocations recorded.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>Release Date</th>
                  <th>Patient Case</th>
                  <th>Hospital Partner</th>
                  <th>Bill Invoice Number</th>
                  <th>Clinical Purpose</th>
                  <th>Settlement Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((a) => (
                  <tr key={a._id} className="small">
                    <td>{new Date(a.releaseDate || a.createdAt).toLocaleDateString()}</td>
                    <td><strong>{a.campaignId?.patientName || 'Patient Case'}</strong></td>
                    <td>{a.hospitalId?.hospitalName || 'Admitted Hospital'}</td>
                    <td><span className="font-monospace text-secondary">{a.billInvoiceNumber}</span></td>
                    <td>{a.purpose}</td>
                    <td><strong className="text-success">{formatINR(a.amount)}</strong></td>
                    <td><span className="badge bg-success-subtle text-success">✓ Cleared Direct</span></td>
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

export const CaseTransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [otherNgos, setOtherNgos] = useState([]);
  const [campaignId, setCampaignId] = useState('');
  const [toNgoId, setToNgoId] = useState('');
  const [reason, setReason] = useState('Medical specialty grant matching program');
  const [amountNeeded, setAmountNeeded] = useState(10000);
  const [loading, setLoading] = useState(true);

  const fetchTransfers = async () => {
    try {
      const { data } = await api.get('/ngos/dashboard');
      if (data.success) {
        setTransfers(data.caseTransfers || []);
        setCampaigns(data.supportedCampaigns || []);
        if (data.supportedCampaigns?.length > 0) setCampaignId(data.supportedCampaigns[0]._id);
        setOtherNgos(data.otherNgos || []);
        if (data.otherNgos?.length > 0) setToNgoId(data.otherNgos[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleInitiateTransfer = async (e) => {
    e.preventDefault();
    if (!campaignId || !toNgoId) {
      toast.error('Select campaign and destination partner NGO');
      return;
    }

    try {
      const { data } = await api.post('/ngos/transfer-case', {
        campaignId,
        toNgoId,
        reason,
        amountNeeded: Number(amountNeeded)
      });
      if (data.success) {
        toast.success('Case transfer request dispatched to partner foundation!');
        fetchTransfers();
      }
    } catch (err) {
      toast.error('Failed to initiate transfer');
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Inter-NGO Case Transfer Coalition</h3>
        <p className="text-muted small">Collaborate with partner humanitarian funds when emergency cases face shortfalls.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-5">
          <div className="mfms-card p-4">
            <h5 className="fw-bold text-mfms-navy mb-3">Initiate Case Co-Sponsorship</h5>
            <form onSubmit={handleInitiateTransfer}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Shortfall Patient Case</label>
                <select className="form-select bg-light" value={campaignId} onChange={(e) => setCampaignId(e.target.value)}>
                  {campaigns.map((c) => (
                    <option key={c._id} value={c._id}>{c.patientName} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Transfer To Partner Foundation</label>
                <select className="form-select bg-light" value={toNgoId} onChange={(e) => setToNgoId(e.target.value)}>
                  {otherNgos.map((n) => (
                    <option key={n._id} value={n._id}>{n.ngoName}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Shortfall Amount Needed (₹ INR)</label>
                <input
                  type="number"
                  className="form-control bg-light"
                  value={amountNeeded}
                  onChange={(e) => setAmountNeeded(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Transfer Rationale</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-mfms-primary w-100 py-2 fw-semibold">
                Dispatch Case Transfer Request
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="mfms-card p-4">
            <h5 className="fw-bold text-mfms-navy mb-3">Transferred Cases History</h5>
            {transfers.length === 0 ? (
              <p className="text-muted small">No case transfers recorded.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-uppercase">
                    <tr>
                      <th>Patient Case</th>
                      <th>From NGO</th>
                      <th>To NGO</th>
                      <th>Shortfall</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.map((t) => (
                      <tr key={t._id} className="small">
                        <td><strong>{t.campaignId?.patientName || 'Medical Case'}</strong></td>
                        <td>{t.fromNgoId?.ngoName}</td>
                        <td>{t.toNgoId?.ngoName}</td>
                        <td><strong className="text-primary">${t.amountNeeded.toLocaleString()}</strong></td>
                        <td><span className="badge bg-success-subtle text-success">{t.status.toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NgoFinancialReportsPage = () => {
  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Humanitarian Financial Reports</h3>
        <p className="text-muted small">Audited balance sheet and hospital aid disbursements report.</p>
      </div>

      <div className="mfms-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold text-mfms-navy mb-0">Annual Medical Grant Audit Statement</h5>
            <small className="text-muted">Generated for Compliance & Regulatory Reporting</small>
          </div>
          <button className="btn btn-outline-primary btn-sm fw-semibold" onClick={() => window.print()}>
            Print / Export PDF Statement
          </button>
        </div>

        <div className="row g-3 text-center mb-4">
          <div className="col-4 border-end">
            <span className="text-muted small text-uppercase">Total Grants Released</span>
            <h4 className="fw-bold text-success mt-1 mb-0">₹38,50,000</h4>
          </div>
          <div className="col-4 border-end">
            <span className="text-muted small text-uppercase">Hospitals Compensated</span>
            <h4 className="fw-bold text-mfms-blue mt-1 mb-0">14 Centers</h4>
          </div>
          <div className="col-4">
            <span className="text-muted small text-uppercase">Overhead Deduction Rate</span>
            <h4 className="fw-bold text-dark mt-1 mb-0">0.00% (Direct Pass)</h4>
          </div>
        </div>

        <p className="text-muted small mb-0 text-center">
          Every allocated rupee is verified with hospital GST/PAN authentication and clinical discharge certifications.
        </p>
      </div>
    </div>
  );
};
