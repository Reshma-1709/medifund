import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Stethoscope, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Activity, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      step: '01',
      title: 'Patient creates campaign (uploads medical docs)',
      desc: 'The patient or their family registers and creates a campaign request. They upload official clinical admission summaries, diagnostic scans, and surgeon cost estimates.',
      icon: FileText,
      color: 'primary',
      role: 'Patient / Family'
    },
    {
      step: '02',
      title: 'Hospital verifies documents',
      desc: 'Attending physicians and hospital administrators review patient bed admissions, medical condition veracity, and clinical urgency before endorsing the case.',
      icon: Stethoscope,
      color: 'info',
      role: 'Treating Hospital'
    },
    {
      step: '03',
      title: 'Admin approves campaign',
      desc: 'System SuperAdmins perform clinical record audits and fraud detection checks. Once approved, the campaign goes live for public contributions.',
      icon: ShieldCheck,
      color: 'warning',
      role: 'Medifund Admin'
    },
    {
      step: '04',
      title: 'Donors contribute securely',
      desc: 'Empathetic donors worldwide contribute through 256-bit encrypted gateways (Cards, NetBanking, or UPI QR code). Instant official 80G tax receipts are generated.',
      icon: CreditCard,
      color: 'success',
      role: 'Global Donors'
    },
    {
      step: '05',
      title: 'NGO manages treatment funds',
      desc: 'Partner humanitarian NGOs oversee relief fund pools and transfer treatment disbursements directly to hospital billing desks to clear invoices.',
      icon: Building2,
      color: 'primary',
      role: 'Partner NGO'
    },
    {
      step: '06',
      title: 'Treatment and recovery tracking with updates',
      desc: 'Surgeons and patients publish milestone clinical updates (Surgery, ICU, Rehabilitation, Discharge). Donors receive alerts and track real patient recovery.',
      icon: Activity,
      color: 'info',
      role: 'Clinical Team & Donors'
    }
  ];

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-mfms-blue fw-bold text-uppercase small tracking-wider">
            Operational Blueprint
          </span>
          <h1 className="display-5 fw-bold text-mfms-navy mt-1">How Medifund Works</h1>
          <p className="lead text-muted fs-6">
            A transparent 6-step medical funding and verification lifecycle ensuring every dollar saves lives directly.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="row g-4 mb-5">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 bg-white position-relative overflow-hidden">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="bg-mfms-light text-mfms-blue p-3 rounded-3">
                      <Icon size={24} />
                    </div>
                    <span className="fs-2 fw-extrabold text-muted opacity-25">
                      {item.step}
                    </span>
                  </div>

                  <span className="badge bg-light text-primary border mb-2 align-self-start small">
                    {item.role}
                  </span>

                  <h5 className="fw-bold text-mfms-navy mb-2" style={{ minHeight: '3.2rem', lineHeight: '1.3' }}>
                    {item.title}
                  </h5>

                  <p className="text-muted small mb-0 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Actions Bar */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-center">
          <h4 className="fw-bold text-mfms-navy mb-2">Ready to Make an Impact or Seek Medical Aid?</h4>
          <p className="text-muted small max-w-lg mx-auto mb-4">
            Join thousands of patients, doctors, humanitarian organizations, and donors united together for a healthier tomorrow.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <Link to="/campaigns" className="btn btn-mfms-primary fw-bold px-4 py-2">
              Browse Active Campaigns
            </Link>
            <Link to="/campaigns/create" className="btn btn-outline-secondary fw-semibold px-4 py-2">
              Start a Campaign
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorksPage;
