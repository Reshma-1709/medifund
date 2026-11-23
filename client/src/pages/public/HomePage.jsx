import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import CampaignCard from '../../components/common/CampaignCard';
import DonationModal from '../../components/common/DonationModal';
import ReceiptModal from '../../components/common/ReceiptModal';
import { 
  Activity, 
  ShieldCheck, 
  Building2, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Stethoscope, 
  Heart,
  HandHeart,
  UserCheck
} from 'lucide-react';

const HomePage = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    patientsHelped: '1,450+',
    donors: '3,820+',
    ngos: '45+',
    secureTransactions: '100% Direct'
  });
  const [loading, setLoading] = useState(true);
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState(null);
  const [activeReceiptId, setActiveReceiptId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, statsRes] = await Promise.allSettled([
          api.get('/campaigns/featured'),
          api.get('/stats')
        ]);
        if (featuredRes.status === 'fulfilled' && featuredRes.value.data.success) {
          setFeaturedCampaigns(featuredRes.value.data.campaigns);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
          setPlatformStats(statsRes.value.data.stats);
        }
      } catch (error) {
        console.error('Failed to load homepage data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDonationSuccess = (donation, updatedCampaign) => {
    setFeaturedCampaigns((prev) =>
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
    <div className="homepage-wrapper">
      
      {/* 1. HERO SECTION (Matching User Mockup) */}
      <section className="py-4 py-lg-5 bg-light">
        <div className="container">
          <div className="hero-mockup-banner">
            <div className="row align-items-center g-4 g-lg-5">
              
              {/* Left Column: Headline & Action Buttons */}
              <div className="col-12 col-lg-5 text-center text-lg-start">
                <div className="mb-2">
                  <span className="text-mfms-blue fw-bold text-uppercase" style={{ letterSpacing: '2px', fontSize: '0.85rem' }}>
                    MEDIFUND
                  </span>
                </div>
                <h1 className="hero-mockup-title mb-3">
                  <span className="text-mfms-navy d-block">Together We Can</span>
                  <span className="text-mfms-blue d-block">Make a Difference</span>
                </h1>
                <p className="text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
                  Help patients get the medical treatment they need. Support real people. Save lives.
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-3">
                  <Link to="/campaigns" className="btn-hero-solid">
                    <Heart size={16} fill="#FFFFFF" />
                    <span>Donate Now</span>
                  </Link>
                  <Link to="/patient/create-campaign" className="btn-hero-outline">
                    <span>Start a Campaign</span>
                  </Link>
                </div>
              </div>

              {/* Middle Column: Child receiving treatment with caregiver support */}
              <div className="col-12 col-md-7 col-lg-4 text-center">
                <img
                  src="/hero-child-caregiver.png"
                  alt="Child receiving treatment with caregiver support"
                  className="hero-center-img"
                />
              </div>

              {/* Right Column: Handwritten Quote in Blue */}
              <div className="col-12 col-md-5 col-lg-3 text-center text-lg-start">
                <div className="hero-quote-cursive">
                  <div>Small help creates</div>
                  <div>big hope</div>
                </div>
                <div className="d-inline-flex align-items-center gap-2 mt-2">
                  <span style={{ width: '28px', height: '1.5px', backgroundColor: '#1769E0', display: 'inline-block' }}></span>
                  <Heart size={14} fill="#1769E0" color="#1769E0" />
                  <span style={{ width: '28px', height: '1.5px', backgroundColor: '#1769E0', display: 'inline-block' }}></span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. USER CATEGORIES SECTION (5 Categories with Circular Pastel Icons) */}
      <section className="py-4 py-lg-5 bg-white border-bottom">
        <div className="container">
          <div className="row g-3 g-lg-4">
            {/* 1. For Patients */}
            <div className="col-12 col-sm-6 col-lg">
              <div className="card h-100 border-0 shadow-xs p-4 text-center category-card bg-white">
                <div className="category-icon-bubble bg-pastel-blue text-primary mx-auto mb-3">
                  <UserCheck size={26} />
                </div>
                <h5 className="fw-bold text-mfms-navy mb-2 fs-6">For Patients</h5>
                <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                  Create campaigns & upload medical documents
                </p>
              </div>
            </div>

            {/* 2. For Donors */}
            <div className="col-12 col-sm-6 col-lg">
              <div className="card h-100 border-0 shadow-xs p-4 text-center category-card bg-white">
                <div className="category-icon-bubble bg-pastel-green text-success mx-auto mb-3">
                  <HandHeart size={26} />
                </div>
                <h5 className="fw-bold text-mfms-navy mb-2 fs-6">For Donors</h5>
                <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                  Browse verified campaigns and donate securely
                </p>
              </div>
            </div>

            {/* 3. For Hospitals */}
            <div className="col-12 col-sm-6 col-lg">
              <div className="card h-100 border-0 shadow-xs p-4 text-center category-card bg-white">
                <div className="category-icon-bubble bg-pastel-purple text-primary mx-auto mb-3">
                  <Building2 size={26} />
                </div>
                <h5 className="fw-bold text-mfms-navy mb-2 fs-6">For Hospitals</h5>
                <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                  Verify patient details & medical documents
                </p>
              </div>
            </div>

            {/* 4. For NGOs */}
            <div className="col-12 col-sm-6 col-lg">
              <div className="card h-100 border-0 shadow-xs p-4 text-center category-card bg-white">
                <div className="category-icon-bubble bg-pastel-pink text-danger mx-auto mb-3">
                  <Users size={26} />
                </div>
                <h5 className="fw-bold text-mfms-navy mb-2 fs-6">For NGOs</h5>
                <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                  Manage donations & allocate treatment funds
                </p>
              </div>
            </div>

            {/* 5. For a Better Tomorrow */}
            <div className="col-12 col-sm-6 col-lg">
              <div className="card h-100 border-0 shadow-xs p-4 text-center category-card bg-white">
                <div className="category-icon-bubble bg-pastel-amber text-warning mx-auto mb-3">
                  <ShieldCheck size={26} />
                </div>
                <h5 className="fw-bold text-mfms-navy mb-2 fs-6">For a Better Tomorrow</h5>
                <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                  Transparent, Secure, Impactful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE STATISTICS SECTION */}
      <section className="bg-light py-4 border-bottom shadow-xs">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3 border-end-md">
              <div className="display-6 fw-bold text-mfms-blue mb-1">{platformStats.patientsHelped || '1,450+'}</div>
              <div className="text-muted small fw-bold text-uppercase">Patients Helped</div>
            </div>
            <div className="col-6 col-md-3 border-end-md">
              <div className="display-6 fw-bold text-mfms-navy mb-1">{platformStats.donorsCount || platformStats.donors || '3,820+'}</div>
              <div className="text-muted small fw-bold text-uppercase">Active Donors</div>
            </div>
            <div className="col-6 col-md-3 border-end-md">
              <div className="display-6 fw-bold text-success mb-1">{platformStats.ngosCount || platformStats.ngos || '45+'}</div>
              <div className="text-muted small fw-bold text-uppercase">Partner NGOs & Trusts</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="display-6 fw-bold text-warning mb-1">{platformStats.secureTransactions || '100% Direct'}</div>
              <div className="text-muted small fw-bold text-uppercase">Secure Transactions</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PATIENT CAMPAIGNS SECTION (Auto-Synced from Database) */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <div className="text-mfms-blue fw-bold text-uppercase small tracking-wider mb-1">
                Hospital Verified Medical Cases
              </div>
              <h2 className="fw-bold text-mfms-navy mb-0">Urgent Campaigns Needing Your Help</h2>
            </div>
            <Link to="/campaigns" className="btn btn-outline-primary fw-semibold mt-3 mt-md-0 d-inline-flex align-items-center gap-1 rounded-pill">
              <span>View All Campaigns</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2 text-muted small">Loading verified campaigns...</p>
            </div>
          ) : featuredCampaigns.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border p-5">
              <h5 className="fw-bold text-mfms-navy mb-2">No active campaigns yet</h5>
              <p className="text-muted small mb-3">Be the first to create a campaign and save a life today.</p>
              <Link to="/patient/create-campaign" className="btn btn-mfms-primary fw-semibold px-4 py-2 rounded-pill">
                Start a Campaign
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {featuredCampaigns.map((campaign) => (
                <div key={campaign._id} className="col-12 col-md-6 col-lg-4">
                  <CampaignCard
                    campaign={campaign}
                    onDonateClick={(c) => setSelectedCampaignForDonation(c)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="text-mfms-blue fw-bold text-uppercase small tracking-wider">
              Transparent Ecosystem
            </span>
            <h2 className="fw-bold text-mfms-navy mt-1">How MediFund Protects & Disburses Aid</h2>
            <p className="text-muted small">
              Unlike ordinary crowdfunding, every campaign on MediFund is authenticated directly with attending hospital records and humanitarian NGO oversight before aid is disbursed.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                step: '01',
                title: 'Patient Creates Request',
                desc: 'Patient or family submits medical admission summary, diagnostic scans, and attending doctor details.',
                icon: Activity
              },
              {
                step: '02',
                title: 'Hospital Verification',
                desc: 'Accredited hospital audits clinical necessity, verifies bed admission, and inputs surgical cost estimates.',
                icon: Stethoscope
              },
              {
                step: '03',
                title: 'NGO Backing & Donors Fund',
                desc: 'Partner NGOs match grants while global donors contribute securely with instant 80G tax receipts.',
                icon: Users
              },
              {
                step: '04',
                title: 'Direct Hospital Disbursement',
                desc: 'Funds are transferred directly into verified hospital accounts to settle invoices. Donors track recovery updates.',
                icon: ShieldCheck
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="col-12 col-md-6 col-lg-3">
                  <div className="card p-4 h-100 rounded-4 border shadow-xs border-top border-primary border-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="bg-pastel-blue text-mfms-blue p-3 rounded-circle">
                        <Icon size={24} />
                      </div>
                      <span className="fs-3 fw-bold text-muted opacity-25">{item.step}</span>
                    </div>
                    <h5 className="fw-bold text-mfms-navy mb-2">{item.title}</h5>
                    <p className="text-muted small mb-0 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. WHY TRUST MEDIFUND */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <span className="text-mfms-blue fw-bold text-uppercase small tracking-wider">
                Built For Integrity
              </span>
              <h2 className="fw-bold text-mfms-navy mb-3">
                Why Doctors, NGOs & Donors Trust MediFund
              </h2>
              <div className="d-flex flex-column gap-3">
                {[
                  {
                    title: 'Zero Fraud Policy',
                    desc: 'Campaigns cannot go live without verified medical stamps and doctor license validation.'
                  },
                  {
                    title: 'Closed-Loop Hospital Wire Disbursals',
                    desc: 'Funds are wired directly to hospital accounts for surgery bills, preventing misuse of patient aid.'
                  },
                  {
                    title: 'Live Treatment & Recovery Milestones',
                    desc: 'Hospitals post clinical milestones (Surgery, ICU, Recovery, Discharge) so donors witness real outcomes.'
                  },
                  {
                    title: '100% Tax Deductible (80G & 501(c)(3))',
                    desc: 'Instant official digital tax receipts with tamper-proof transaction credentials.'
                  }
                ].map((pill, i) => (
                  <div key={i} className="d-flex align-items-start gap-3">
                    <div className="bg-success text-white rounded-circle p-1 mt-1 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-1">{pill.title}</h6>
                      <p className="text-muted small mb-0">{pill.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80"
                  alt="Doctor with patient"
                  className="rounded-4 shadow-lg w-100"
                  style={{ maxHeight: '420px', objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 start-0 m-3 p-3 bg-white rounded-3 shadow-sm border small" style={{ maxWidth: '320px' }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <ShieldCheck className="text-success" size={18} />
                    <span className="fw-bold text-mfms-navy">Hospital Committee Verified</span>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: '0.78rem' }}>
                    Over ₹3.8 Crore in critical surgeries funded with zero fraudulent claims recorded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA BANNER */}
      <section className="bg-mfms-navy py-5 text-white text-center">
        <div className="container py-3">
          <h2 className="display-6 fw-bold text-white mb-3">
            Every Second Counts in Critical Care.
          </h2>
          <p className="lead text-light opacity-80 mb-4 max-w-xl mx-auto">
            Whether you are a patient in need of urgent surgery, an accredited medical center, or a donor wanting to create an impact—join the MediFund network today.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <Link to="/campaigns" className="btn btn-warning text-dark fw-bold px-4 py-3 rounded-pill shadow-xs">
              Browse Active Campaigns
            </Link>
            <Link to="/patient/create-campaign" className="btn btn-outline-light fw-bold px-4 py-3 rounded-pill">
              Submit Medical Case
            </Link>
          </div>
        </div>
      </section>

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

export default HomePage;
