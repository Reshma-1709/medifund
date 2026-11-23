import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CampaignCard from '../../components/common/CampaignCard';
import DonationModal from '../../components/common/DonationModal';
import ReceiptModal from '../../components/common/ReceiptModal';
import { Search, Filter, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Cardiology',
  'Oncology',
  'Organ Transplant',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'Emergency Care'
];

const URGENCIES = [
  { label: 'All Urgencies', value: 'All' },
  { label: '🚨 Critical Emergency', value: 'critical' },
  { label: '⚠️ Urgent Need', value: 'urgent' },
  { label: 'Standard Case', value: 'normal' }
];

const BrowseCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState(null);
  const [activeReceiptId, setActiveReceiptId] = useState(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = {
        search: search.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        urgency: selectedUrgency !== 'All' ? selectedUrgency : undefined,
        verifiedOnly: verifiedOnly ? 'true' : undefined,
        sort,
        page,
        limit: 9
      };

      const { data } = await api.get('/campaigns', { params });
      if (data.success) {
        setCampaigns(data.campaigns);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (error) {
      console.error('Failed to load campaigns', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategory, selectedUrgency, verifiedOnly, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCampaigns();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedUrgency('All');
    setVerifiedOnly(false);
    setSort('newest');
    setPage(1);
  };

  const handleDonationSuccess = (donation, updatedCampaign) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c._id === donation.campaignId
          ? {
              ...c,
              raisedAmount: updatedCampaign.raisedAmount,
              donorsCount: updatedCampaign.donorsCount
            }
          : c
      )
    );
  };

  return (
    <div className="py-4 py-md-5 bg-light min-vh-100">
      <div className="container">
        
        {/* Page Header */}
        <div className="mb-4 text-center text-md-start">
          <span className="text-mfms-blue fw-bold text-uppercase small tracking-wider">
            Medical Crowdfunding
          </span>
          <h1 className="fw-bold text-mfms-navy mb-1">Browse Verified Medical Campaigns</h1>
          <p className="text-muted small">
            Find and support patients battling critical health conditions. Every campaign has been authenticated with hospital medical records.
          </p>
        </div>

        {/* Search & Main Filter Controls Card */}
        <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-4 bg-white">
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
            
            {/* Search Input */}
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 bg-light"
                  placeholder="Search by diagnosis, patient name, hospital..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Urgency Filter */}
            <div className="col-6 col-md-3">
              <select
                className="form-select bg-light"
                value={selectedUrgency}
                onChange={(e) => {
                  setSelectedUrgency(e.target.value);
                  setPage(1);
                }}
              >
                {URGENCIES.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="col-6 col-md-2">
              <select
                className="form-select bg-light"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="newest">Newest Cases</option>
                <option value="urgent">Most Urgent</option>
                <option value="most_funded">Most Funded</option>
                <option value="goal_high">Goal: High to Low</option>
                <option value="goal_low">Goal: Low to High</option>
              </select>
            </div>

            {/* Submit & Reset Button */}
            <div className="col-12 col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-mfms-primary flex-grow-1 fw-semibold py-2">
                Search
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary py-2"
                title="Reset filters"
                onClick={handleResetFilters}
              >
                <RefreshCw size={16} />
              </button>
            </div>

          </form>

          {/* Category Pills & Verified Checkbox */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
            
            {/* Category Pills */}
            <div className="d-flex flex-wrap gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 fw-medium ${
                    selectedCategory === cat
                      ? 'btn-primary'
                      : 'btn-outline-secondary border-0 bg-light'
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Hospital Verified Checkbox */}
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="verifiedSwitch"
                checked={verifiedOnly}
                onChange={(e) => {
                  setVerifiedOnly(e.target.checked);
                  setPage(1);
                }}
              />
              <label className="form-check-label small fw-semibold text-secondary d-flex align-items-center gap-1" htmlFor="verifiedSwitch">
                <ShieldCheck size={16} className="text-success" />
                <span>Hospital Verified Only</span>
              </label>
            </div>

          </div>

        </div>

        {/* Results Counter */}
        <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
          <span>Found <strong>{totalCount}</strong> active medical campaigns</span>
          {page > 1 && <span>Page {page} of {totalPages}</span>}
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2 text-muted small">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
            <AlertCircle size={48} className="text-warning mx-auto mb-3" />
            <h4 className="fw-bold text-mfms-navy">No campaigns matched your filters</h4>
            <p className="text-muted small mb-4">
              Try adjusting your search criteria, category selection, or urgency level.
            </p>
            <div>
              <button className="btn btn-mfms-primary px-4" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="col-12 col-md-6 col-lg-4">
                <CampaignCard
                  campaign={campaign}
                  onDonateClick={(c) => setSelectedCampaignForDonation(c)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
            <button
              className="btn btn-outline-secondary btn-sm px-3"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="small text-muted px-2">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              className="btn btn-outline-secondary btn-sm px-3"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* Donation Modal */}
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

export default BrowseCampaignsPage;
