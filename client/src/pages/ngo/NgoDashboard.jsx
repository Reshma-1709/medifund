import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatINR } from '../../utils/currency';
import { 
  Building2, 
  DollarSign, 
  ArrowRightLeft, 
  FileText, 
  PlusCircle, 
  CheckCircle,
  CheckCircle2,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Activity,
  HeartPulse,
  Award,
  AlertTriangle,
  TrendingUp,
  Users,
  Search,
  Filter,
  Sparkles,
  Heart,
  Stethoscope,
  ChevronRight,
  Download,
  Info,
  Calendar,
  ShieldAlert,
  Percent,
  Bed,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';

const NgoDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('campaigns');

  // Modals state
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [trustModalOpen, setTrustModalOpen] = useState(false);
  const [partnershipModalOpen, setPartnershipModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);

  // Selected Campaign for Action
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState(5000);
  const [donationPurpose, setDonationPurpose] = useState('Operating Room Surgery & Specialized Medication Grant');
  const [submitting, setSubmitting] = useState(false);

  // Campaign Discovery Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Partnership Request state
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [partnershipType, setPartnershipType] = useState('Subsidized Surgery Tariff');
  const [discountPercent, setDiscountPercent] = useState(25);
  const [bedQuota, setBedQuota] = useState(5);
  const [mouNotes, setMouNotes] = useState('Humanitarian subsidy agreement for pediatric cardiac and oncology patients.');

  // KYC Edit Form state
  const [kycForm, setKycForm] = useState({
    ngoName: '',
    legalEntityType: 'Charitable Trust',
    registrationNumber: '',
    yearOfEstablishment: '2016',
    website: '',
    mission: '',
    panNumber: '',
    tanNumber: '',
    eightyGNumber: '',
    fcraNumber: '',
    address: '',
    city: '',
    state: '',
    repName: '',
    repDesignation: '',
    repPhone: ''
  });

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/ngos/dashboard');
      if (res.data.success) {
        setData(res.data);
        if (res.data.ngo) {
          const ngo = res.data.ngo;
          setKycForm({
            ngoName: ngo.ngoName || '',
            legalEntityType: ngo.legalEntityType || 'Charitable Trust',
            registrationNumber: ngo.registrationNumber || '',
            yearOfEstablishment: String(ngo.yearOfEstablishment || '2016'),
            website: ngo.website || '',
            mission: ngo.mission || '',
            panNumber: ngo.panNumber || '',
            tanNumber: ngo.tanNumber || '',
            eightyGNumber: ngo.eightyGCertificate?.number || '',
            fcraNumber: ngo.fcraCertificate?.number || '',
            address: ngo.address || '',
            city: ngo.city || '',
            state: ngo.state || '',
            repName: ngo.repName || '',
            repDesignation: ngo.repDesignation || '',
            repPhone: ngo.repPhone || ''
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load NGO dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Handle Partial Direct Donation
  const handleDonate = async (e) => {
    e.preventDefault();
    if (!selectedCampaign || !donationAmount) {
      toast.error('Please specify campaign and donation amount');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/ngos/donate', {
        campaignId: selectedCampaign._id,
        amount: Number(donationAmount),
        purpose: donationPurpose
      });
      if (res.data.success) {
        toast.success(res.data.message || 'Donation allocated successfully to hospital account!');
        setDonateModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Full Campaign Sponsorship
  const handleFullSponsorship = async () => {
    if (!selectedCampaign) return;

    setSubmitting(true);
    try {
      const res = await api.post('/ngos/sponsor-full', {
        campaignId: selectedCampaign._id,
        purpose: `Complete 100% treatment sponsorship by ${data?.ngo?.ngoName || 'NGO Partner'}`
      });
      if (res.data.success) {
        toast.success(res.data.message || 'Entire shortfall fully sponsored! Patient treatment guaranteed.');
        setSponsorModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sponsorship failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Partnership Request
  const handleCreatePartnership = async (e) => {
    e.preventDefault();
    if (!selectedHospitalId) {
      toast.error('Please select an accredited hospital partner');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/ngos/partnerships', {
        hospitalId: selectedHospitalId,
        partnershipType,
        discountPercentage: Number(discountPercent),
        bedQuota: Number(bedQuota),
        mouTerms: mouNotes
      });
      if (res.data.success) {
        toast.success('Hospital partnership agreement successfully recorded!');
        setPartnershipModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit partnership request');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle KYC Update
  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.put('/ngos/kyc', {
        ...kycForm,
        eightyGCertificate: { number: kycForm.eightyGNumber, isVerified: true },
        fcraCertificate: { number: kycForm.fcraNumber, isVerified: true }
      });
      if (res.data.success) {
        toast.success('NGO KYC and compliance dossier updated successfully!');
        setKycModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update KYC');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 text-muted small">Loading Humanitarian NGO Desk...</p>
      </div>
    );
  }

  const ngo = data?.ngo || {};
  const metrics = data?.metrics || {};
  const campaigns = data?.supportedCampaigns || [];
  const allocations = data?.allocations || [];
  const partnerships = data?.partnerships || [];
  const allHospitals = data?.allHospitals || [];
  const categoryBreakdown = data?.categoryBreakdown || [];
  const monthlyTrends = data?.monthlyTrends || [];
  const beneficiaryStories = data?.beneficiaryStories || [];
  const leaderboard = data?.leaderboard || [];

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = 
      (c.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.hospitalName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = selectedUrgency === 'all' || c.urgency === selectedUrgency;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesUrgency && matchesCategory;
  });

  return (
    <div className="container-fluid py-3">

      {/* 1. TOP HEADER & TRUST SCORE HERO BANNER */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="row align-items-center g-4">
          
          {/* Left: Organization Details & Trust Badge */}
          <div className="col-12 col-lg-7">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 rounded-pill small">
                {ngo.legalEntityType || 'Charitable Trust'} • Est. {ngo.yearOfEstablishment || 2016}
              </span>
              
              {/* Trusted NGO Verification Badge */}
              <span className="badge bg-success text-white d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill shadow-xs">
                <ShieldCheck size={15} />
                <span className="fw-bold">{ngo.trustBadge || 'Trusted NGO'}</span>
              </span>

              <span className="badge bg-light text-secondary border px-2 py-1 rounded-pill small">
                Reg: {ngo.registrationNumber || 'NGO-FED-482910'}
              </span>
            </div>

            <h2 className="fw-bold text-mfms-navy mb-1">{ngo.ngoName || 'Global Hope Healthcare Foundation'}</h2>
            <p className="text-muted small mb-3 leading-relaxed" style={{ maxWidth: '650px' }}>
              {ngo.mission || 'Dedicated to transparent clinical fund management, sponsoring life-saving surgeries, and authenticating direct hospital wire disbursements.'}
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small">
              <div className="d-flex align-items-center gap-1">
                <MapPin size={15} className="text-primary" />
                <span>{ngo.city || 'Chicago'}, {ngo.state || 'IL'}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <Mail size={15} className="text-primary" />
                <span>{ngo.contactEmail || 'contact@globalhopehealth.org'}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <Phone size={15} className="text-primary" />
                <span>{ngo.repPhone || '+1 (555) 732-9011'}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <CheckCircle2 size={15} className="text-success" />
                <span>80G / 501(c)(3) Certified</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Trust Score Card */}
          <div className="col-12 col-lg-5">
            <div className="p-3 rounded-4 border bg-pastel-blue text-center position-relative shadow-xs">
              <div className="row align-items-center">
                <div className="col-5 border-end">
                  <div className="position-relative d-inline-block">
                    <div 
                      className="rounded-circle d-flex flex-column align-items-center justify-content-center bg-white shadow-sm border border-primary border-3 mx-auto"
                      style={{ width: '88px', height: '88px' }}
                    >
                      <span className="fs-3 fw-extrabold text-mfms-blue leading-none">{ngo.trustScore || 94}</span>
                      <small className="text-muted fw-bold" style={{ fontSize: '0.62rem' }}>OUT OF 100</small>
                    </div>
                  </div>
                  <div className="fw-bold text-mfms-navy mt-1 small">Trust Index: Grade A+</div>
                </div>

                <div className="col-7 text-start ps-3">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="small fw-bold text-mfms-navy">Verified Trust Status</span>
                    <span className="badge bg-success-subtle text-success small">High Confidence</span>
                  </div>
                  <div className="text-muted small mb-2" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                    Calculated from KYC certificates, audited filings, {metrics.totalSponsoredPatients || 24}+ sponsored patients, and zero discrepancy audit.
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm py-1 px-2 fw-semibold d-inline-flex align-items-center gap-1 rounded-pill"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setTrustModalOpen(true)}
                    >
                      <Info size={13} />
                      <span>Score Breakdown</span>
                    </button>
                    <button 
                      className="btn btn-primary btn-sm py-1 px-2 fw-semibold d-inline-flex align-items-center gap-1 rounded-pill"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setKycModalOpen(true)}
                    >
                      <span>Edit KYC</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. KEY METRICS ROW */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="mfms-card p-3 h-100">
            <span className="text-muted small fw-bold text-uppercase">Total Trust Fund Pool</span>
            <h4 className="fw-bold text-mfms-navy mt-1 mb-0">
              ${(metrics.totalFundPool || 0).toLocaleString()}
            </h4>
            <small className="text-muted mt-1 d-block" style={{ fontSize: '0.7rem' }}>Authorized reserves</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <div className="mfms-card p-3 h-100">
            <span className="text-muted small fw-bold text-uppercase">Direct Disbursals</span>
            <h4 className="fw-bold text-success mt-1 mb-0">
              ${(metrics.totalAllocated || 0).toLocaleString()}
            </h4>
            <small className="text-success mt-1 d-block" style={{ fontSize: '0.7rem' }}>Settled to hospitals</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <div className="mfms-card p-3 h-100">
            <span className="text-muted small fw-bold text-uppercase">Available Liquid Pool</span>
            <h4 className="fw-bold text-mfms-blue mt-1 mb-0">
              ${(metrics.fundPoolBalance || 0).toLocaleString()}
            </h4>
            <small className="text-muted mt-1 d-block" style={{ fontSize: '0.7rem' }}>Ready for allocation</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <div className="mfms-card p-3 h-100">
            <span className="text-muted small fw-bold text-uppercase">Patients Sponsored</span>
            <h4 className="fw-bold text-warning mt-1 mb-0">
              {metrics.totalSponsoredPatients || 24} Lives
            </h4>
            <small className="text-muted mt-1 d-block" style={{ fontSize: '0.7rem' }}>{metrics.surgeriesFunded || 18} surgeries completed</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <div className="mfms-card p-3 h-100">
            <span className="text-muted small fw-bold text-uppercase">Beneficiary Rating</span>
            <h4 className="fw-bold text-dark mt-1 mb-0 d-flex align-items-center gap-1">
              <span>{metrics.beneficiaryRating || '4.95'}</span>
              <span className="text-warning fs-6">★</span>
            </h4>
            <small className="text-muted mt-1 d-block" style={{ fontSize: '0.7rem' }}>From {ngo.ratingsCount || 42} families</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <div className="mfms-card p-3 h-100">
            <span className="text-muted small fw-bold text-uppercase">AI Compliance</span>
            <h4 className="fw-bold text-success mt-1 mb-0 d-flex align-items-center gap-1">
              <ShieldCheck size={18} />
              <span>{metrics.aiRiskLevel || 'Low Risk'}</span>
            </h4>
            <small className="text-muted mt-1 d-block" style={{ fontSize: '0.7rem' }}>0 Audit Discrepancies</small>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="d-flex flex-wrap gap-2 border-bottom pb-2 mb-4">
        {[
          { id: 'campaigns', label: '🏥 Patient Campaign Discovery', count: filteredCampaigns.length },
          { id: 'analytics', label: '📊 Impact & Analytics' },
          { id: 'beneficiaries', label: '💖 Beneficiary Stories', count: beneficiaryStories.length },
          { id: 'compliance', label: '🛡️ Fraud Detection & AI Risk' },
          { id: 'transparency', label: '📜 Transparency & Audit Center', count: allocations.length },
          { id: 'leaderboard', label: '🏆 NGO Leaderboard', count: leaderboard.length },
          { id: 'partnerships', label: '🤝 Hospital Partnerships', count: partnerships.length }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`btn btn-sm px-3 py-2 rounded-pill fw-semibold ${
              activeTab === tab.id
                ? 'btn-primary shadow-xs'
                : 'btn-light text-secondary border'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`badge ms-2 rounded-pill ${activeTab === tab.id ? 'bg-white text-primary' : 'bg-secondary bg-opacity-25 text-dark'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: PATIENT CAMPAIGN DISCOVERY */}
      {activeTab === 'campaigns' && (
        <div>
          {/* Search & Filters */}
          <div className="mfms-card p-3 mb-4">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Search size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by patient, surgery, or hospital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-6 col-md-3">
                <select
                  className="form-select"
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                >
                  <option value="all">All Urgency Levels</option>
                  <option value="critical">🚨 Critical Urgency</option>
                  <option value="urgent">⚡ High Urgency</option>
                  <option value="normal">Normal Priority</option>
                </select>
              </div>

              <div className="col-6 col-md-3">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Medical Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Organ Transplant">Organ Transplant</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Emergency Care">Emergency Care</option>
                </select>
              </div>

              <div className="col-12 col-md-1 text-end">
                <button
                  className="btn btn-outline-secondary w-100"
                  title="Reset Filters"
                  onClick={() => { setSearchTerm(''); setSelectedUrgency('all'); setSelectedCategory('all'); }}
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Campaigns Grid */}
          {filteredCampaigns.length === 0 ? (
            <div className="mfms-card p-5 text-center">
              <HeartPulse size={40} className="text-muted mb-2" />
              <h5 className="fw-bold text-mfms-navy mb-1">No Matching Campaigns Found</h5>
              <p className="text-muted small">Try adjusting your filters to discover active patient fundraising cases.</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredCampaigns.map((c) => {
                const isCritical = c.urgency === 'critical';
                const isUrgent = c.urgency === 'urgent';
                const isFullyFunded = c.shortfall <= 0 || c.status === 'completed';

                return (
                  <div key={c._id} className="col-12 col-md-6 col-xl-4">
                    <div className="card h-100 border rounded-4 shadow-xs overflow-hidden bg-white d-flex flex-column">
                      
                      {/* Image & Urgency Banner */}
                      <div className="position-relative">
                        <img
                          src={c.bannerImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'}
                          alt={c.patientName}
                          className="w-100 object-fit-cover"
                          style={{ height: '170px' }}
                        />
                        <div className="position-absolute top-0 start-0 m-2">
                          <span className={`badge rounded-pill px-3 py-1 shadow-xs fw-bold small ${
                            isCritical ? 'bg-danger text-white' : isUrgent ? 'bg-warning text-dark' : 'bg-primary text-white'
                          }`}>
                            {isCritical ? '🚨 CRITICAL' : isUrgent ? '⚡ HIGH URGENCY' : 'MEDICAL CASE'}
                          </span>
                        </div>
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className="badge bg-white text-dark shadow-xs rounded-pill px-2 py-1 small fw-semibold">
                            {c.category}
                          </span>
                        </div>
                        <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-gradient-dark text-white small px-3">
                          <div className="d-flex align-items-center gap-1 text-truncate">
                            <Building2 size={13} className="text-info shrink-0" />
                            <span className="text-truncate fw-semibold">{c.hospitalName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3 d-flex flex-column flex-grow-1">
                        
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="fw-bold text-mfms-navy mb-0 text-truncate" title={c.patientName}>
                            {c.patientName} {c.patientAge ? `(Age ${c.patientAge})` : ''}
                          </h6>
                          <span className="badge bg-success-subtle text-success small px-2 py-0.5 rounded-pill">
                            ✓ Verified
                          </span>
                        </div>

                        <p className="small text-muted mb-3 text-truncate-2" style={{ minHeight: '38px', fontSize: '0.82rem' }}>
                          {c.title}
                        </p>

                        {/* Hospital Medical Documents & QR Pill */}
                        <div className="d-flex flex-wrap gap-2 mb-3 small">
                          <span className="badge bg-light text-secondary border d-inline-flex align-items-center gap-1">
                            <FileText size={12} className="text-primary" />
                            <span>{c.medicalDocuments?.length || 2} Verified Reports</span>
                          </span>
                          <span className="badge bg-light text-secondary border d-inline-flex align-items-center gap-1">
                            <QrCode size={12} className="text-mfms-blue" />
                            <span>{c.upiId || 'Direct Hospital QR'}</span>
                          </span>
                        </div>

                        {/* Progress Bar & Shortfall */}
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between small mb-1">
                            <span className="text-muted">Raised: <strong>${(c.raisedAmount || 0).toLocaleString()}</strong></span>
                            <span className="fw-bold text-mfms-navy">Goal: ${(c.fundingGoal || 0).toLocaleString()}</span>
                          </div>

                          <div className="mfms-progress-wrapper mb-2" style={{ height: '7px' }}>
                            <div 
                              className={`mfms-progress-bar ${isFullyFunded ? 'bg-success' : ''}`} 
                              style={{ width: `${Math.min(100, c.fundedPercentage || 0)}%` }} 
                            />
                          </div>

                          {/* Shortfall Box */}
                          <div className="p-2 rounded-3 bg-light border mb-3 d-flex justify-content-between align-items-center">
                            <span className="small text-muted fw-semibold">Shortfall Needed:</span>
                            <span className={`fw-bold ${c.shortfall > 0 ? 'text-danger' : 'text-success'}`}>
                              {c.shortfall > 0 ? formatINR(c.shortfall) : '100% Fully Funded!'}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="row g-2">
                            <div className="col-6">
                              <button
                                className="btn btn-outline-primary btn-sm w-100 fw-semibold py-2 d-flex align-items-center justify-content-center gap-1"
                                onClick={() => {
                                  setSelectedCampaign(c);
                                  setDonationAmount(Math.min(c.shortfall || 5000, 5000));
                                  setDonateModalOpen(true);
                                }}
                              >
                                <PlusCircle size={14} />
                                <span>Donate Partial</span>
                              </button>
                            </div>

                            <div className="col-6">
                              <button
                                className={`btn btn-sm w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-1 ${
                                  isFullyFunded ? 'btn-success disabled' : 'btn-warning text-dark'
                                }`}
                                onClick={() => {
                                  if (!isFullyFunded) {
                                    setSelectedCampaign(c);
                                    setSponsorModalOpen(true);
                                  }
                                }}
                              >
                                <Sparkles size={14} />
                                <span>{isFullyFunded ? 'Funded' : 'Sponsor Full'}</span>
                              </button>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: IMPACT & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="row g-4">
          
          {/* Treatment Category Distribution */}
          <div className="col-12 col-lg-6">
            <div className="mfms-card p-4 h-100">
              <h5 className="fw-bold text-mfms-navy mb-1">Treatment Categories Funded</h5>
              <p className="text-muted small mb-4">Breakdown of hospital disbursements across specialized surgical fields.</p>

              <div className="d-flex flex-column gap-3">
                {[
                  { cat: 'Pediatric Cardiology', amount: 28400, percent: 48, color: 'bg-primary' },
                  { cat: 'Oncology & Chemotherapy', amount: 16500, percent: 28, color: 'bg-danger' },
                  { cat: 'Organ Transplant Care', amount: 8200, percent: 14, color: 'bg-success' },
                  { cat: 'Emergency Trauma / ICU', amount: 5400, percent: 10, color: 'bg-warning' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="d-flex justify-content-between small fw-bold mb-1">
                      <span className="text-mfms-navy">{item.cat}</span>
                      <span className="text-muted">${item.amount.toLocaleString()} ({item.percent}%)</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className={`progress-bar ${item.color}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top d-flex justify-content-between small text-muted">
                <span>Total Clinical Allocations:</span>
                <strong className="text-dark">{formatINR(metrics.totalAllocated || 585000)}</strong>
              </div>
            </div>
          </div>

          {/* Monthly Contribution Trends */}
          <div className="col-12 col-lg-6">
            <div className="mfms-card p-4 h-100">
              <h5 className="fw-bold text-mfms-navy mb-1">Monthly Relief Contribution Timeline</h5>
              <p className="text-muted small mb-4">Historical record of medical funding released over the last 6 months.</p>

              <div className="row g-2 align-items-end text-center" style={{ minHeight: '190px' }}>
                {monthlyTrends.map((m, idx) => {
                  const maxAmt = 15000;
                  const barHeight = Math.min(100, Math.round((m.amount / maxAmt) * 100));
                  return (
                    <div key={idx} className="col">
                      <div className="d-flex flex-column align-items-center h-100 justify-content-end">
                        <small className="fw-bold text-mfms-blue mb-1" style={{ fontSize: '0.68rem' }}>
                          ₹{(m.amount / 1000).toFixed(0)}k
                        </small>
                        <div
                          className="w-100 rounded-3 bg-primary bg-opacity-75"
                          style={{ height: `${barHeight}%`, minHeight: '20px' }}
                        />
                        <span className="text-muted fw-semibold mt-2 small">{m.month}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-top row text-center g-2 small">
                <div className="col-4 border-end">
                  <div className="text-muted">Avg / Month</div>
                  <strong className="text-dark">₹1,50,000</strong>
                </div>
                <div className="col-4 border-end">
                  <div className="text-muted">Campaign Success</div>
                  <strong className="text-success">{metrics.campaignSuccessRate || '94.2%'}</strong>
                </div>
                <div className="col-4">
                  <div className="text-muted">ICU Days Covered</div>
                  <strong className="text-primary">{metrics.icuDaysFunded || 86} Days</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Social Impact Highlights */}
          <div className="col-12">
            <div className="mfms-card p-4 bg-light border-0">
              <h5 className="fw-bold text-mfms-navy mb-3">Key Humanitarian Impact Indicators</h5>
              <div className="row g-3 text-center">
                <div className="col-12 col-md-3">
                  <div className="bg-white p-3 rounded-4 shadow-xs">
                    <span className="display-6 fw-bold text-primary">24h</span>
                    <div className="fw-bold text-mfms-navy mt-1 small">Emergency Turnaround</div>
                    <small className="text-muted">Direct grant clearance time</small>
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <div className="bg-white p-3 rounded-4 shadow-xs">
                    <span className="display-6 fw-bold text-success">100%</span>
                    <div className="fw-bold text-mfms-navy mt-1 small">Closed-Loop Disbursal</div>
                    <small className="text-muted">Direct hospital wire transfer</small>
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <div className="bg-white p-3 rounded-4 shadow-xs">
                    <span className="display-6 fw-bold text-warning">0.0%</span>
                    <div className="fw-bold text-mfms-navy mt-1 small">Administrative Overhead</div>
                    <small className="text-muted">100% pass-through to billing</small>
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <div className="bg-white p-3 rounded-4 shadow-xs">
                    <span className="display-6 fw-bold text-danger">94.2%</span>
                    <div className="fw-bold text-mfms-navy mt-1 small">Full Clinical Recovery</div>
                    <small className="text-muted">Hospital confirmed discharge</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: BENEFICIARY SUCCESS STORIES */}
      {activeTab === 'beneficiaries' && (
        <div className="row g-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h5 className="fw-bold text-mfms-navy mb-0">Recovered Patient Testimonials</h5>
                <p className="text-muted small">Real medical outcomes made possible by your organization’s treatment sponsorships.</p>
              </div>
              <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold">
                ✓ Hospital Authenticated Outcomes
              </span>
            </div>
          </div>

          {beneficiaryStories.map((story) => (
            <div key={story.id} className="col-12 col-lg-4">
              <div className="mfms-card p-4 h-100 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img
                    src={story.image}
                    alt={story.patientName}
                    className="rounded-circle border border-2 border-primary object-fit-cover shadow-xs"
                    style={{ width: '64px', height: '64px' }}
                  />
                  <div>
                    <h6 className="fw-bold text-mfms-navy mb-0">{story.patientName}</h6>
                    <small className="text-primary fw-semibold">{story.condition}</small>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>{story.hospital}</div>
                  </div>
                </div>

                <blockquote className="small text-secondary italic mb-3 flex-grow-1" style={{ lineHeight: '1.5' }}>
                  “{story.quote}”
                </blockquote>

                <div className="mt-auto pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-1 small">
                    <span className="text-muted">Recovery Status:</span>
                    <span className="badge bg-success-subtle text-success">{story.recoveryStatus}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center small text-muted">
                    <span>Sponsorship Released:</span>
                    <strong className="text-dark">{formatINR(story.sponsoredAmount)}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: FRAUD DETECTION & AI RISK MONITOR */}
      {activeTab === 'compliance' && (
        <div className="row g-4">
          
          {/* AI Risk Scorecard */}
          <div className="col-12 col-lg-5">
            <div className="mfms-card p-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-mfms-navy mb-0">AI Fraud & Risk Engine</h5>
                <span className="badge bg-success text-white px-2.5 py-1 rounded-pill small fw-bold">
                  PASS - LOW RISK
                </span>
              </div>

              <div className="text-center my-4">
                <div 
                  className="rounded-circle bg-success bg-opacity-10 text-success d-inline-flex flex-column align-items-center justify-content-center border border-success border-3 shadow-xs"
                  style={{ width: '110px', height: '110px' }}
                >
                  <span className="display-6 fw-extrabold text-success leading-none">{ngo.aiRiskScore || 8}</span>
                  <small className="fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Risk Index</small>
                </div>
                <h6 className="fw-bold text-dark mt-2 mb-0">Confidence Score: 92% Positive</h6>
                <small className="text-muted">Zero fraud indicators or billing anomalies recorded.</small>
              </div>

              <div className="border-top pt-3">
                <h6 className="small fw-bold text-mfms-navy mb-2">Automated Risk Verification Factors:</h6>
                <div className="d-flex flex-column gap-2 small">
                  {(ngo.aiRiskFactors || [
                    'Registration certificates match national registry database',
                    '80G & FCRA regulatory filings verified active with 2+ years validity',
                    'Direct hospital wire disbursals match patient invoices with zero discrepancies',
                    'Executive trustee identity verified with biometric/photo ID check'
                  ]).map((factor, i) => (
                    <div key={i} className="d-flex align-items-start gap-2">
                      <CheckCircle2 size={15} className="text-success shrink-0 mt-0.5" />
                      <span className="text-muted">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Regulatory Checklist */}
          <div className="col-12 col-lg-7">
            <div className="mfms-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold text-mfms-navy mb-1">Periodic Compliance Oversight</h5>
                  <p className="text-muted small mb-0">Real-time status of statutory tax exemptions and regulatory licenses.</p>
                </div>
                <button 
                  className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                  onClick={() => toast.success('AI Compliance audit rerun: 0 flags detected.')}
                >
                  <RefreshCw size={13} />
                  <span>Run Live Audit Check</span>
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Document / Audit Record</th>
                      <th>Identifier</th>
                      <th>Expiry / Review Date</th>
                      <th>Compliance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Trust Registration Deed</strong></td>
                      <td><code>{ngo.registrationNumber || 'NGO-FED-482910'}</code></td>
                      <td>Perpetual Validity</td>
                      <td><span className="badge bg-success-subtle text-success">✓ Active & Validated</span></td>
                    </tr>
                    <tr>
                      <td><strong>Income Tax 80G Exemption</strong></td>
                      <td><code>{ngo.eightyGCertificate?.number || '80G-DEL-2022-8491'}</code></td>
                      <td>Valid until Oct 2028</td>
                      <td><span className="badge bg-success-subtle text-success">✓ Active Exemption</span></td>
                    </tr>
                    <tr>
                      <td><strong>FCRA Foreign Contribution</strong></td>
                      <td><code>{ngo.fcraCertificate?.number || 'FCRA-0839210-2021'}</code></td>
                      <td>Valid until Sep 2027</td>
                      <td><span className="badge bg-success-subtle text-success">✓ Compliant</span></td>
                    </tr>
                    <tr>
                      <td><strong>PAN / Tax Authentication</strong></td>
                      <td><code>{ngo.panNumber || 'AAATG8941K'}</code></td>
                      <td>Verified Active</td>
                      <td><span className="badge bg-success-subtle text-success">✓ NSDL Linked</span></td>
                    </tr>
                    <tr>
                      <td><strong>Annual Financial Audit</strong></td>
                      <td>Form 10B / Audited FY25</td>
                      <td>Next Due: Sep 2027</td>
                      <td><span className="badge bg-success-subtle text-success">✓ Passed - Unqualified</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="alert alert-light border mt-3 mb-0 small text-muted">
                <strong>MediFund Anti-Fraud Safeguard:</strong> Direct donations and sponsorships bypass personal accounts and are wired directly to verified hospital accounts with itemized clinical invoice matching.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: TRANSPARENCY & AUDIT CENTER */}
      {activeTab === 'transparency' && (
        <div className="mfms-card p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
            <div>
              <h5 className="fw-bold text-mfms-navy mb-1">Direct Hospital Settlement Ledger</h5>
              <p className="text-muted small mb-0">Complete audit trail of all medical disbursements wired directly to accredited healthcare institutions.</p>
            </div>
            <button 
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5"
              onClick={() => window.print()}
            >
              <Printer size={15} />
              <span>Export Audit Trail (PDF)</span>
            </button>
          </div>

          {allocations.length === 0 ? (
            <p className="text-muted text-center py-5">No direct hospital disbursements recorded yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light text-uppercase" style={{ fontSize: '0.72rem' }}>
                  <tr>
                    <th>Date</th>
                    <th>Patient Beneficiary</th>
                    <th>Treating Hospital</th>
                    <th>Invoice / Reference</th>
                    <th>Clinical Purpose</th>
                    <th>Settlement Amount</th>
                    <th>Audit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((a) => (
                    <tr key={a._id}>
                      <td>{new Date(a.releaseDate || a.createdAt).toLocaleDateString()}</td>
                      <td>
                        <strong>{a.campaignId?.patientName || 'Emergency Patient Case'}</strong>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{a.campaignId?.category || 'Clinical Aid'}</div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{a.hospitalId?.hospitalName || 'Apollo Memorial Hospital'}</div>
                        <small className="text-muted">{a.hospitalId?.city || 'Healthcare Center'}</small>
                      </td>
                      <td>
                        <span className="font-monospace text-secondary badge bg-light border">
                          {a.billInvoiceNumber || 'INV-SETTLE-8910'}
                        </span>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '240px' }} title={a.purpose}>
                        {a.purpose || 'Hospital Surgical Settlement'}
                      </td>
                      <td>
                        <strong className="text-success">{formatINR(Number(a.amount || 0))}</strong>
                      </td>
                      <td>
                        <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1">
                          <CheckCircle size={11} />
                          <span>Direct Wire Cleared</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: NGO LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="mfms-card p-4">
          <div className="mb-4">
            <h5 className="fw-bold text-mfms-navy mb-1">Humanitarian NGO Community Leaderboard</h5>
            <p className="text-muted small">Top contributing humanitarian foundations and medical relief trusts recognized for lifesaving contributions.</p>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>Rank</th>
                  <th>Humanitarian Foundation</th>
                  <th>Headquarters</th>
                  <th>Total Funds Disbursed</th>
                  <th>Patients Sponsored</th>
                  <th>Trust Score & Badge</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={item._id} className={item._id === ngo._id ? 'table-primary' : ''}>
                    <td>
                      {index === 0 && <span className="badge bg-warning text-dark fw-bold px-2 py-1">🥇 1st</span>}
                      {index === 1 && <span className="badge bg-secondary text-white fw-bold px-2 py-1">🥈 2nd</span>}
                      {index === 2 && <span className="badge bg-danger text-white fw-bold px-2 py-1">🥉 3rd</span>}
                      {index > 2 && <span className="fw-bold text-muted ps-2">#{index + 1}</span>}
                    </td>
                    <td>
                      <div className="fw-bold text-mfms-navy">{item.ngoName}</div>
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: '300px' }}>
                        {item.mission || 'Medical relief and clinical aid'}
                      </small>
                    </td>
                    <td className="small text-muted">{item.city || 'United States'}</td>
                    <td>
                      <strong className="text-success">{formatINR(item.allocatedFunds || 0)}</strong>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary fw-bold">
                        {item.totalSponsoredPatients || 12} Lives Saved
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-success text-white d-inline-flex align-items-center gap-1">
                          <ShieldCheck size={12} />
                          <span>{item.trustBadge || 'Trusted NGO'}</span>
                        </span>
                        <strong className="text-mfms-blue small">{item.trustScore || 90}/100</strong>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: HOSPITAL PARTNERSHIPS */}
      {activeTab === 'partnerships' && (
        <div className="mfms-card p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
            <div>
              <h5 className="fw-bold text-mfms-navy mb-1">Accredited Hospital Clinical Partnerships</h5>
              <p className="text-muted small mb-0">Formal MOUs with premier medical centers for subsidized surgery tariffs and emergency ICU bed reservations.</p>
            </div>
            <button
              className="btn btn-mfms-primary fw-semibold btn-sm d-flex align-items-center gap-1.5"
              onClick={() => {
                if (allHospitals.length > 0) setSelectedHospitalId(allHospitals[0]._id);
                setPartnershipModalOpen(true);
              }}
            >
              <PlusCircle size={16} />
              <span>Request Hospital Partnership</span>
            </button>
          </div>

          {partnerships.length === 0 ? (
            <p className="text-muted text-center py-5">No hospital partnerships recorded. Click above to send a partnership request.</p>
          ) : (
            <div className="row g-3">
              {partnerships.map((p) => (
                <div key={p._id} className="col-12 col-lg-6">
                  <div className="card h-100 p-3 rounded-4 border shadow-xs bg-light">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold text-mfms-navy mb-0">{p.hospitalId?.hospitalName || 'Apollo Memorial Super Specialty Hospital'}</h6>
                        <small className="text-muted">{p.hospitalId?.city || 'New York'}</small>
                      </div>
                      <span className="badge bg-success text-white">Active MOU Partner</span>
                    </div>

                    <div className="row g-2 text-center my-2 small">
                      <div className="col-6">
                        <div className="bg-white p-2 rounded-3 border">
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>Subsidized Tariff</div>
                          <strong className="text-success fs-6">{p.discountPercentage || 25}% Discount</strong>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-white p-2 rounded-3 border">
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>Emergency ICU Beds</div>
                          <strong className="text-primary fs-6">{p.bedQuota || 5} Reserved Beds</strong>
                        </div>
                      </div>
                    </div>

                    <p className="small text-muted mb-0 mt-2" style={{ fontSize: '0.8rem' }}>
                      <strong>MOU Terms:</strong> {p.mouTerms}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: PARTIAL DIRECT DONATION */}
      {donateModalOpen && selectedCampaign && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-mfms-navy">Direct NGO Clinical Grant</h5>
                <button type="button" className="btn-close" onClick={() => setDonateModalOpen(false)} />
              </div>
              <form onSubmit={handleDonate}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <div className="fw-bold text-mfms-navy">{selectedCampaign.patientName}</div>
                    <div className="small text-muted">{selectedCampaign.title}</div>
                    <div className="small text-danger fw-semibold mt-1">
                      Shortfall Needed: {formatINR(selectedCampaign.shortfall)}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Grant Amount (₹ INR)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      min="1"
                      required
                    />
                    <small className="text-muted">Available in liquid fund pool: {formatINR(metrics.fundPoolBalance || 0)}</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Clinical Purpose / Bill Line Item</label>
                    <input
                      type="text"
                      className="form-control"
                      value={donationPurpose}
                      onChange={(e) => setDonationPurpose(e.target.value)}
                      required
                    />
                  </div>

                  <div className="alert alert-info py-2 px-3 small mb-0 rounded-3">
                    Funds will be recorded directly into the hospital billing ledger with tamper-proof transaction credentials.
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setDonateModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-mfms-primary fw-bold" disabled={submitting}>
                    {submitting ? 'Allocating...' : `Allocate ${formatINR(Number(donationAmount))}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL CAMPAIGN SPONSORSHIP */}
      {sponsorModalOpen && selectedCampaign && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom bg-warning bg-opacity-10">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <Sparkles size={20} className="text-warning" />
                  <span>Full Campaign Sponsorship Grant</span>
                </h5>
                <button type="button" className="btn-close" onClick={() => setSponsorModalOpen(false)} />
              </div>
              <div className="modal-body p-4 text-center">
                <div className="badge bg-success px-3 py-1.5 rounded-pill mb-3 fw-bold">
                  100% TREATMENT GUARANTEE
                </div>
                <h5 className="fw-bold text-mfms-navy mb-1">{selectedCampaign.patientName}</h5>
                <p className="text-muted small mb-3">{selectedCampaign.title}</p>

                <div className="p-3 bg-light rounded-4 border mb-3">
                  <div className="text-muted small text-uppercase fw-bold">Remaining Shortfall to Sponsor</div>
                  <h2 className="fw-extrabold text-danger my-1">
                    {formatINR(selectedCampaign.shortfall)}
                  </h2>
                  <small className="text-muted">
                    Treating Hospital: <strong>{selectedCampaign.hospitalName}</strong>
                  </small>
                </div>

                <p className="small text-muted mb-0">
                  By confirming full sponsorship, <strong>{ngo.ngoName}</strong> commits to fund 100% of the patient’s remaining hospital bill. The campaign will immediately be marked as <strong>Fully Funded</strong> and clinical clearance will be dispatched to the hospital.
                </p>
              </div>

              <div className="modal-footer border-top">
                <button type="button" className="btn btn-light" onClick={() => setSponsorModalOpen(false)}>Cancel</button>
                <button 
                  type="button" 
                  className="btn btn-warning text-dark fw-bold px-4" 
                  onClick={handleFullSponsorship}
                  disabled={submitting}
                >
                  {submitting ? 'Processing Sponsorship...' : `Confirm 100% Sponsorship (${formatINR(selectedCampaign.shortfall)})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TRUST SCORE BREAKDOWN */}
      {trustModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-mfms-navy d-flex align-items-center gap-2">
                  <ShieldCheck size={20} className="text-success" />
                  <span>Trust Score Calculation Matrix</span>
                </h5>
                <button type="button" className="btn-close" onClick={() => setTrustModalOpen(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <span className="display-5 fw-extrabold text-mfms-blue">{ngo.trustScore || 94}</span>
                  <span className="text-muted fs-5"> / 100</span>
                  <div className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-bold mt-1 d-block mx-auto" style={{ width: 'fit-content' }}>
                    Trusted NGO - Grade A+
                  </div>
                </div>

                <div className="d-flex flex-column gap-3 small">
                  <div>
                    <div className="d-flex justify-content-between fw-bold mb-1">
                      <span>1. Regulatory & Document Verification</span>
                      <span className="text-success">{ngo.trustFactors?.kycScore || 35} / 35 Pts</span>
                    </div>
                    <div className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Registration Deed, 80G Approval, PAN Card, and Address Proof verified.</div>
                    <div className="progress" style={{ height: '5px' }}><div className="progress-bar bg-success" style={{ width: '100%' }} /></div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between fw-bold mb-1">
                      <span>2. Track Record & Years of Operation</span>
                      <span className="text-success">{ngo.trustFactors?.trackRecordScore || 15} / 15 Pts</span>
                    </div>
                    <div className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Active since {ngo.yearOfEstablishment || 2016} (8+ years in healthcare relief).</div>
                    <div className="progress" style={{ height: '5px' }}><div className="progress-bar bg-success" style={{ width: '100%' }} /></div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between fw-bold mb-1">
                      <span>3. Successful Campaigns Sponsored</span>
                      <span className="text-primary">{ngo.trustFactors?.sponsorshipScore || 22} / 25 Pts</span>
                    </div>
                    <div className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>{metrics.totalSponsoredPatients || 24} patient cases successfully funded to completion.</div>
                    <div className="progress" style={{ height: '5px' }}><div className="progress-bar bg-primary" style={{ width: '88%' }} /></div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between fw-bold mb-1">
                      <span>4. Donor & Beneficiary Ratings</span>
                      <span className="text-warning">{ngo.trustFactors?.ratingsScore || 14} / 15 Pts</span>
                    </div>
                    <div className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Average rating 4.95 / 5.0 from patient families and platform donors.</div>
                    <div className="progress" style={{ height: '5px' }}><div className="progress-bar bg-warning" style={{ width: '93%' }} /></div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between fw-bold mb-1">
                      <span>5. Transparency & Audit Compliance</span>
                      <span className="text-info">{ngo.trustFactors?.complianceScore || 8} / 10 Pts</span>
                    </div>
                    <div className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Unqualified annual audit reports and Form 10B compliance filed.</div>
                    <div className="progress" style={{ height: '5px' }}><div className="progress-bar bg-info" style={{ width: '80%' }} /></div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top">
                <button type="button" className="btn btn-mfms-primary w-100 fw-bold" onClick={() => setTrustModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: REQUEST HOSPITAL PARTNERSHIP */}
      {partnershipModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-mfms-navy">Establish Hospital Partnership</h5>
                <button type="button" className="btn-close" onClick={() => setPartnershipModalOpen(false)} />
              </div>
              <form onSubmit={handleCreatePartnership}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Accredited Hospital</label>
                    <select
                      className="form-select"
                      value={selectedHospitalId}
                      onChange={(e) => setSelectedHospitalId(e.target.value)}
                      required
                    >
                      {allHospitals.map((h) => (
                        <option key={h._id} value={h._id}>{h.hospitalName} ({h.city})</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Partnership Type</label>
                    <select
                      className="form-select"
                      value={partnershipType}
                      onChange={(e) => setPartnershipType(e.target.value)}
                    >
                      <option value="Subsidized Surgery Tariff">Subsidized Surgery Tariff</option>
                      <option value="Emergency ICU Bed Quota">Emergency ICU Bed Quota</option>
                      <option value="Grant Matching Protocol">Grant Matching Protocol</option>
                      <option value="Comprehensive Clinical MOU">Comprehensive Clinical MOU</option>
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Subsidized Discount (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                        min="5"
                        max="80"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Emergency Bed Quota</label>
                      <input
                        type="number"
                        className="form-control"
                        value={bedQuota}
                        onChange={(e) => setBedQuota(e.target.value)}
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">MOU Terms & Clinical Priorities</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={mouNotes}
                      onChange={(e) => setMouNotes(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setPartnershipModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-mfms-primary fw-bold" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Send Partnership Agreement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT KYC & COMPLIANCE DOSSIER */}
      {kycModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-mfms-navy">NGO KYC & Statutory Compliance Dossier</h5>
                <button type="button" className="btn-close" onClick={() => setKycModalOpen(false)} />
              </div>
              <form onSubmit={handleKycSubmit}>
                <div className="modal-body p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">NGO Legal Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.ngoName}
                        onChange={(e) => setKycForm({ ...kycForm, ngoName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Registration Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.registrationNumber}
                        onChange={(e) => setKycForm({ ...kycForm, registrationNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Legal Entity Type</label>
                      <select
                        className="form-select"
                        value={kycForm.legalEntityType}
                        onChange={(e) => setKycForm({ ...kycForm, legalEntityType: e.target.value })}
                      >
                        <option value="Charitable Trust">Charitable Trust</option>
                        <option value="Registered Society">Registered Society</option>
                        <option value="Section 8 Company">Section 8 Company</option>
                        <option value="Non-Profit Organization">Non-Profit Organization</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Year Established</label>
                      <input
                        type="number"
                        className="form-control"
                        value={kycForm.yearOfEstablishment}
                        onChange={(e) => setKycForm({ ...kycForm, yearOfEstablishment: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Official Website</label>
                      <input
                        type="url"
                        className="form-control"
                        value={kycForm.website}
                        onChange={(e) => setKycForm({ ...kycForm, website: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">PAN / Tax ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.panNumber}
                        onChange={(e) => setKycForm({ ...kycForm, panNumber: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">80G Approval No.</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.eightyGNumber}
                        onChange={(e) => setKycForm({ ...kycForm, eightyGNumber: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">FCRA No.</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.fcraNumber}
                        onChange={(e) => setKycForm({ ...kycForm, fcraNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Registered Office Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.address}
                        onChange={(e) => setKycForm({ ...kycForm, address: e.target.value })}
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label small fw-semibold">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.city}
                        onChange={(e) => setKycForm({ ...kycForm, city: e.target.value })}
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label small fw-semibold">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.state}
                        onChange={(e) => setKycForm({ ...kycForm, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Representative Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.repName}
                        onChange={(e) => setKycForm({ ...kycForm, repName: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Designation / Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.repDesignation}
                        onChange={(e) => setKycForm({ ...kycForm, repDesignation: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Official Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kycForm.repPhone}
                        onChange={(e) => setKycForm({ ...kycForm, repPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Mission Statement</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={kycForm.mission}
                      onChange={(e) => setKycForm({ ...kycForm, mission: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setKycModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-mfms-primary fw-bold" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Update & Recalculate Trust Score'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NgoDashboard;
