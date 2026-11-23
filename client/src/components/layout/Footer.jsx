import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-mfms-navy text-white pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-5">
          
          {/* Brand Info */}
          <div className="col-12 col-md-4">
            <Link to="/" className="d-flex align-items-center gap-2 mb-3 text-decoration-none">
              <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="#1769E0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#FFFFFF" className="position-absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -58%)' }}>
                  <path d="M19 10.5h-5.5V5c0-.55-.45-1-1-1s-1 .45-1 1v5.5H6c-.55 0-1 .45-1 1s.45 1 1 1h5.5V18c0 .55.45 1 1 1s1-.45 1-1v-5.5H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
                </svg>
              </div>
              <div>
                <span className="fs-4 fw-bold text-white letter-spacing-tight">
                  Medi<span className="text-mfms-blue">Fund</span>
                </span>
                <small className="d-block text-light opacity-75" style={{ fontSize: '0.68rem', marginTop: '-3px' }}>
                  Together for a Healthier Tomorrow
                </small>
              </div>
            </Link>

            <p className="text-light opacity-75 small leading-relaxed pe-lg-4">
              A transparent, hospital-verified healthcare crowdfunding platform uniting patients, accredited hospitals, humanitarian NGOs, and global donors to save lives without delay.
            </p>
            <div className="d-flex align-items-center gap-2 text-light opacity-75 small">
              <ShieldCheck size={18} className="text-success" />
              <span>100% Hospital Verified Clinical Claims</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 text-uppercase text-light opacity-90 small tracking-wider">Navigation</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/" className="text-light opacity-75 text-decoration-none hover-white">Home</Link></li>
              <li><Link to="/about" className="text-light opacity-75 text-decoration-none hover-white">About Us</Link></li>
              <li><Link to="/campaigns" className="text-light opacity-75 text-decoration-none hover-white">Campaigns</Link></li>
              <li><Link to="/how-it-works" className="text-light opacity-75 text-decoration-none hover-white">How It Works</Link></li>
              <li><Link to="/blog" className="text-light opacity-75 text-decoration-none hover-white">Blog & Stories</Link></li>
              <li><Link to="/contact" className="text-light opacity-75 text-decoration-none hover-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 text-uppercase text-light opacity-90 small tracking-wider">Trust & Safety</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/ngos" className="text-light opacity-75 text-decoration-none hover-white">NGO Directory</Link></li>
              <li><Link to="/faq" className="text-light opacity-75 text-decoration-none hover-white">FAQs</Link></li>
              <li><Link to="/privacy-policy" className="text-light opacity-75 text-decoration-none hover-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-light opacity-75 text-decoration-none hover-white">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="text-light opacity-75 text-decoration-none hover-white">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact & 80G */}
          <div className="col-12 col-md-4">
            <h6 className="fw-bold mb-3 text-uppercase text-light opacity-90 small tracking-wider">Emergency Aid Helpdesk</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-light opacity-75 mb-3">
              <li className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-mfms-blue shrink-0" />
                <span>MediFund Global Foundation, New York & International</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-mfms-blue shrink-0" />
                <span>+1 (800) 482-HEAL (Toll Free 24/7)</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-mfms-blue shrink-0" />
                <span>support@medifund.org / claims@medifund.org</span>
              </li>
            </ul>

            <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 small">
              <div className="fw-semibold text-white d-flex align-items-center gap-1 mb-1">
                <span>Tax Exemption Benefits</span>
              </div>
              <p className="mb-0 text-light opacity-75" style={{ fontSize: '0.78rem' }}>
                All donations qualify for 501(c)(3) & Section 80G tax deductions with instant digital receipts.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-top border-white border-opacity-10 pt-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-light opacity-60">
          <div>© {new Date().getFullYear()} MediFund. All rights reserved. Together for a Healthier Tomorrow.</div>
          <div className="d-flex gap-3">
            <Link to="/privacy-policy" className="text-light opacity-75 text-decoration-none">Privacy</Link>
            <Link to="/terms" className="text-light opacity-75 text-decoration-none">Terms</Link>
            <Link to="/refund-policy" className="text-light opacity-75 text-decoration-none">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
