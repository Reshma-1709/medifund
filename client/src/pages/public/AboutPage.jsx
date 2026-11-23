import React from 'react';
import { ShieldCheck, Activity, Users, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        
        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-mfms-blue fw-bold text-uppercase small tracking-wider">
            Our Mission & Impact
          </span>
          <h1 className="display-5 fw-bold text-mfms-navy mt-1">Together for a Healthier Tomorrow</h1>
          <p className="lead text-muted fs-6">
            Medifund was born from a simple belief: no human life should be lost because of an inability to pay for immediate hospital surgical care.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-6">
              <h3 className="fw-bold text-mfms-navy mb-3">Redefining Medical Crowdfunding Integrity</h3>
              <p className="text-secondary leading-relaxed mb-3">
                Traditional crowdfunding platforms are plagued by doubts about authenticity, delayed disbursements, and funds diverted away from hospitals. MediFund replaces ambiguity with a closed-loop clinical verification network.
              </p>
              <p className="text-secondary leading-relaxed mb-4">
                Before any campaign goes live, our medical auditing engine validates patient admission records with partner hospitals. When donors contribute, funds are wired directly into hospital billing departments to cover operating room fees, medications, and ICU care.
              </p>

              <div className="d-flex flex-column gap-2">
                {[
                  '100% Doctor-Verified Clinical Reports',
                  'Zero Direct-to-Individual Diversion Risk',
                  'Accredited Hospital Network in 12+ States',
                  'Transparent Post-Op Recovery Updates for Donors'
                ].map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-2">
                    <CheckCircle size={18} className="text-success shrink-0" />
                    <span className="fw-semibold text-dark small">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
                alt="Healthcare workers"
                className="rounded-4 shadow-sm w-100"
                style={{ maxHeight: '380px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Key Pillars Grid */}
        <div className="row g-4 mb-5">
          {[
            {
              title: 'Clinical Accountability',
              desc: 'Hospital committees approve each case with realistic cost estimations, ensuring donors know precisely how funds are deployed.',
              icon: ShieldCheck
            },
            {
              title: 'Collaborative NGO Alliance',
              desc: 'Our registered NGO partners manage fund allocation pools, absorb shortfall costs, and transfer critical cases if needed.',
              icon: Users
            },
            {
              title: 'Tax-Deductible Philanthropy',
              desc: 'Every donor receives automated, legally binding Section 80G and 501(c)(3) tax receipts instantly upon payment confirmation.',
              icon: Award
            }
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="col-12 col-md-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 bg-white">
                  <div className="bg-mfms-light text-mfms-blue p-3 rounded-3 d-inline-flex mb-3">
                    <Icon size={24} />
                  </div>
                  <h5 className="fw-bold text-mfms-navy mb-2">{pillar.title}</h5>
                  <p className="text-muted small mb-0 leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="bg-mfms-blue text-white rounded-4 p-5 text-center shadow">
          <h3 className="fw-bold mb-2">Want to Partner with MediFund?</h3>
          <p className="text-light opacity-90 small mb-4 max-w-lg mx-auto">
            We onboard accredited healthcare providers, charitable trusts, and corporate CSR programs committed to transparent medical aid.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/contact" className="btn btn-warning text-dark fw-bold px-4 py-2">
              Contact Hospital Onboarding
            </Link>
            <Link to="/campaigns" className="btn btn-outline-light fw-bold px-4 py-2">
              Explore Active Cases
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
