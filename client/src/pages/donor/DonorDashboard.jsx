import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ReceiptModal from '../../components/common/ReceiptModal';
import DonationModal from '../../components/common/DonationModal';
import CampaignCard from '../../components/common/CampaignCard';
import { formatINR } from '../../utils/currency';
import { 
  Activity, 
  Receipt, 
  History, 
  IndianRupee, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  RotateCcw,
  HeartPulse,
  QrCode,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReceiptId, setActiveReceiptId] = useState(null);
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [updatesError, setUpdatesError] = useState('');

  const fetchDonations = async () => {
    try {
      const { data } = await api.get('/donations/my-donations');
      if (data.success) {
        setDonations(data.donations || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data } = await api.get('/campaigns?limit=20');
      if (data.success) {
        setCampaigns(data.campaigns || []);
      }
    } catch (err) {
      console.error('Error fetching campaigns in donor dashboard', err);
    }
  };

  const fetchUpdates = async () => {
    try {
      const { data } = await api.get('/donations/my-updates');
      if (!data.success) throw new Error(data.message || 'Could not load patient updates.');
      setUpdates(data.updates || []);
      setUpdatesError('');
    } catch (err) {
      setUpdatesError(err.response?.data?.message || err.message || 'Could not load patient updates.');
    } finally {
      setUpdatesLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.allSettled([fetchDonations(), fetchCampaigns(), fetchUpdates()]);
      setLoading(false);
    };
    initData();

    const refreshTimer = window.setInterval(() => {
      fetchUpdates();
      fetchCampaigns();
    }, 30000);
    window.addEventListener('focus', fetchUpdates);
    return () => {
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', fetchUpdates);
    };
  }, []);

  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalCampaignsSupported = new Set(donations.map((d) => d.campaignId?._id)).size;

  const handleRequestRefund = async (donationId) => {
    if (!window.confirm('Are you sure you want to request a refund for this contribution?')) return;
    try {
      const { data } = await api.post('/donations/refund-request', {
        donationId,
        reason: 'Requested by donor from portal'
      });
      if (data.success) {
        toast.success('Refund request submitted to administrator oversight.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Refund request error');
    }
  };

  const handleDonationSuccess = (newDonation, updatedCampaign) => {
    toast.success(`Donation of ${formatINR(newDonation.amount)} received successfully!`);
    fetchDonations();
    fetchCampaigns();
    if (newDonation._id) {
      setActiveReceiptId(newDonation._id);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-2">
      
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-mfms-navy mb-1">Donor Philanthropy Hub</h2>
          <p className="text-muted small mb-0">
            Track your medical sponsorships, download official tax deduction receipts, and monitor patient healing.
          </p>
        </div>
        <Link to="/campaigns" className="btn btn-mfms-primary fw-semibold d-flex align-items-center gap-2">
          <Activity size={18} />
          <span>Explore All Medical Cases</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="mfms-card p-4">
            <span className="text-muted small fw-bold text-uppercase">Total Contributed</span>
            <h3 className="fw-bold text-mfms-blue mt-1 mb-0">{formatINR(totalDonated)}</h3>
            <small className="text-success mt-1 d-block">100% Hospital Directed</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="mfms-card p-4">
            <span className="text-muted small fw-bold text-uppercase">Patients Supported</span>
            <h3 className="fw-bold text-mfms-navy mt-1 mb-0">{totalCampaignsSupported}</h3>
            <small className="text-muted mt-1 d-block">Critical cases aided</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="mfms-card p-4">
            <span className="text-muted small fw-bold text-uppercase">Tax Deductible Balance</span>
            <h3 className="fw-bold text-success mt-1 mb-0">${totalDonated.toLocaleString()}</h3>
            <small className="text-muted mt-1 d-block">Section 80G Certified</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="mfms-card p-4">
            <span className="text-muted small fw-bold text-uppercase">Tax Receipts Issued</span>
            <h3 className="fw-bold text-warning mt-1 mb-0">{donations.length}</h3>
            <small className="text-muted mt-1 d-block">Instant digital PDF receipts</small>
          </div>
        </div>
      </div>

      {/* Auto-Synced Patient Campaigns Feed */}
      <div className="mfms-card p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="fw-bold text-mfms-navy mb-0">Verified Patient Campaigns (Auto-Synced)</h5>
              <span className="badge bg-success-subtle text-success small">Live Feed</span>
            </div>
            <p className="text-muted small mb-0">Direct from hospital admission wards. Donate via card or QR/UPI directly to patient case.</p>
          </div>
          <Link to="/campaigns" className="small text-mfms-blue fw-semibold text-decoration-none">
            Browse All ({campaigns.length})
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            No active medical campaigns available currently.
          </div>
        ) : (
          <div className="row g-3">
            {campaigns.slice(0, 3).map((camp) => (
              <div key={camp._id} className="col-12 col-md-4">
                <CampaignCard
                  campaign={camp}
                  onDonateClick={(c) => setSelectedCampaignForDonation(c)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clinical Updates Feed */}
      <div className="mfms-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold text-mfms-navy mb-1">Updates from your campaigns</h5>
            <p className="text-muted small mb-0">Treatment and recovery updates for campaigns you have donated to.</p>
          </div>
          <button className="btn btn-sm btn-outline-primary" onClick={fetchUpdates} disabled={updatesLoading}>
            {updatesLoading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        {updatesLoading ? (
          <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" role="status" /></div>
        ) : updatesError ? (
          <div className="alert alert-danger py-2 mb-0" role="alert">{updatesError}</div>
        ) : updates.length === 0 ? (
          <div className="text-center py-4">
            <HeartPulse size={30} className="text-muted opacity-50 mb-2" />
            <p className="text-muted small mb-0">No patient updates have been posted for campaigns you supported yet.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {updates.map((update) => (
              <article key={update._id} className="border rounded-3 p-3 bg-light">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                  <div className="fw-bold text-mfms-navy">{update.campaignId?.title || 'Patient campaign'}</div>
                  <span className="badge bg-primary-subtle text-primary">{update.kind === 'recovery' ? 'Recovery update' : 'Treatment update'}</span>
                </div>
                <p className="text-secondary small mb-2">{update.text}</p>
                <small className="text-muted">{update.createdAt ? new Date(update.createdAt).toLocaleString() : ''}</small>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Recent Donations Table */}
      <div className="mfms-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-mfms-navy mb-0">Recent Giving History</h5>
          <Link to="/donor/donations" className="small text-mfms-blue fw-semibold text-decoration-none">
            View All Transactions
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-5">
            <Activity size={40} className="text-muted opacity-50 mb-2" />
            <p className="text-muted small mb-3">You have not made any medical contributions yet.</p>
            <Link to="/campaigns" className="btn btn-sm btn-mfms-primary">
              Support a Patient Today
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-uppercase">
                  <th>Date</th>
                  <th>Patient Case</th>
                  <th>Amount</th>
                  <th>Receipt #</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 5).map((d) => (
                  <tr key={d._id} className="small">
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '280px' }}>
                        {d.campaignId ? d.campaignId.title : 'Medical Relief Case'}
                      </div>
                      <small className="text-muted">
                        Hospital: {d.campaignId?.hospitalName || 'Verified Medical Center'}
                      </small>
                    </td>
                    <td>
                      <span className="fw-bold text-mfms-blue fs-6">{formatINR(d.amount)}</span>
                    </td>
                    <td>
                      <span className="font-monospace text-secondary">{d.receiptNumber}</span>
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success">
                        {d.transactionStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary py-1 px-2 d-flex align-items-center gap-1"
                          onClick={() => setActiveReceiptId(d._id)}
                          title="View Tax Receipt"
                        >
                          <Receipt size={14} />
                          <span>Receipt</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary py-1 px-2"
                          onClick={() => handleRequestRefund(d._id)}
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

      {/* Donation Modal for instant contribution */}
      {selectedCampaignForDonation && (
        <DonationModal
          campaign={selectedCampaignForDonation}
          onClose={() => setSelectedCampaignForDonation(null)}
          onDonationSuccess={handleDonationSuccess}
          onOpenReceipt={(receiptId) => {
            setSelectedCampaignForDonation(null);
            setActiveReceiptId(receiptId);
          }}
        />
      )}

      {/* Tax Receipt Modal */}
      {activeReceiptId && (
        <ReceiptModal
          donationId={activeReceiptId}
          onClose={() => setActiveReceiptId(null)}
        />
      )}

    </div>
  );
};

export default DonorDashboard;
