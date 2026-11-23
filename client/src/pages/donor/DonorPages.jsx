import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ReceiptModal from '../../components/common/ReceiptModal';
import { formatINR } from '../../utils/currency';
import { Receipt, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReceiptId, setActiveReceiptId] = useState(null);

  const fetchDonations = async () => {
    try {
      const { data } = await api.get('/donations/my-donations');
      if (data.success) {
        setDonations(data.donations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleRefund = async (id) => {
    if (!window.confirm('Submit refund request for this donation?')) return;
    try {
      const { data } = await api.post('/donations/refund-request', {
        donationId: id,
        reason: 'Requested by donor'
      });
      if (data.success) {
        toast.success('Refund request submitted to administrator oversight.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Refund error');
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">My Medical Giving Records</h3>
        <p className="text-muted small">Complete ledger of your donations, payment providers, and tax receipts.</p>
      </div>

      <div className="mfms-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : donations.length === 0 ? (
          <p className="text-muted text-center py-4">No donation transactions recorded.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-uppercase">
                  <th>Date</th>
                  <th>Campaign Title</th>
                  <th>Payment Method</th>
                  <th>Amount (INR)</th>
                  <th>Receipt #</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id} className="small">
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '280px' }}>
                        {d.campaignId ? d.campaignId.title : 'Medical Relief Case'}
                      </div>
                    </td>
                    <td>{d.paymentMethod || 'Credit/Debit Card'}</td>
                    <td><span className="fw-bold text-mfms-blue">{formatINR(d.amount)}</span></td>
                    <td><span className="font-monospace text-secondary">{d.receiptNumber}</span></td>
                    <td>
                      <span className={`badge ${
                        d.transactionStatus === 'completed' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                      }`}>
                        {d.transactionStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary py-1 px-2"
                          onClick={() => setActiveReceiptId(d._id)}
                        >
                          <Receipt size={14} className="me-1" />
                          <span>Receipt</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary py-1 px-2"
                          onClick={() => handleRefund(d._id)}
                          title="Request Refund"
                        >
                          <RotateCcw size={14} />
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

      {activeReceiptId && (
        <ReceiptModal donationId={activeReceiptId} onClose={() => setActiveReceiptId(null)} />
      )}
    </div>
  );
};

export const TaxReceiptsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReceiptId, setActiveReceiptId] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const { data } = await api.get('/donations/my-donations');
        if (data.success) {
          setDonations(data.donations || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const totalDeductible = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Tax Exemption Certificates (Section 80G / 501(c)(3))</h3>
        <p className="text-muted small">Download printable tax certificates for your medical charity contributions.</p>
      </div>

      <div className="card bg-mfms-light border-primary border-opacity-25 rounded-4 p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <div>
            <h5 className="fw-bold text-mfms-navy mb-1">Fiscal Year Total Tax-Deductible Value</h5>
            <p className="text-muted small mb-0">Eligible under Indian IT Act Section 80G and US IRC 501(c)(3)</p>
          </div>
          <h2 className="fw-bold text-mfms-blue mb-0">{formatINR(totalDeductible)}</h2>
        </div>
      </div>

      <div className="mfms-card p-4">
        <h5 className="fw-bold text-mfms-navy mb-3">Issued Digital Receipts</h5>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : donations.length === 0 ? (
          <p className="text-muted small text-center py-4">No receipts generated yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-uppercase">
                  <th>Receipt #</th>
                  <th>Issue Date</th>
                  <th>Exemption Section</th>
                  <th>Amount</th>
                  <th className="text-end">Download / Print</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id} className="small">
                    <td><span className="font-monospace fw-bold text-mfms-navy">{d.receiptNumber}</span></td>
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td><span className="badge bg-success-subtle text-success">Section 80G / 501(c)(3)</span></td>
                    <td><span className="fw-bold text-mfms-blue">${d.amount.toLocaleString()}</span></td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary py-1 px-3 fw-semibold"
                        onClick={() => setActiveReceiptId(d._id)}
                      >
                        View Official Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeReceiptId && (
        <ReceiptModal donationId={activeReceiptId} onClose={() => setActiveReceiptId(null)} />
      )}
    </div>
  );
};

export const SavedCampaignsPage = () => {
  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Tracked Medical Cases</h3>
        <p className="text-muted small">Campaigns bookmarked for recovery updates and future contributions.</p>
      </div>
      <div className="mfms-card p-5 text-center">
        <p className="text-muted small mb-0">You are currently monitoring active campaigns directly from your philanthropy feed.</p>
      </div>
    </div>
  );
};
