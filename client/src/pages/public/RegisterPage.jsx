import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, User, Mail, Lock, Phone, Building2, ShieldCheck, FileText, CheckCircle2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // NGO specific fields
    orgName: '',
    legalEntityType: 'Charitable Trust',
    regNumber: '',
    yearOfEstablishment: '2018',
    website: '',
    mission: '',
    panNumber: '',
    tanNumber: '',
    eightyGNumber: '',
    fcraNumber: '',
    address: '',
    city: '',
    state: '',
    repDesignation: 'Executive Managing Trustee',
    repIdProofType: 'Passport / National Identity Card',
    repIdProofNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role,
      organizationDetails: {
        orgName: formData.orgName,
        legalEntityType: formData.legalEntityType,
        regNumber: formData.regNumber,
        yearOfEstablishment: formData.yearOfEstablishment,
        website: formData.website,
        mission: formData.mission,
        panNumber: formData.panNumber,
        tanNumber: formData.tanNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        repDesignation: formData.repDesignation,
        repIdProofType: formData.repIdProofType,
        repIdProofNumber: formData.repIdProofNumber
      }
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      toast.success(role === 'ngo' ? 'NGO registered successfully! Welcome to the humanitarian desk.' : 'Account created successfully!');
      navigate(getDashboardPath(res.user.role));
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-11 col-lg-8">
            
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
              
              <div className="text-center mb-4">
                <div className="position-relative d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="#1769E0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="#FFFFFF" className="position-absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -58%)' }}>
                    <path d="M19 10.5h-5.5V5c0-.55-.45-1-1-1s-1 .45-1 1v5.5H6c-.55 0-1 .45-1 1s.45 1 1 1h5.5V18c0 .55.45 1 1 1s1-.45 1-1v-5.5H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
                  </svg>
                </div>
                <h3 className="fw-bold text-mfms-navy mb-1">Create Your MediFund Account</h3>
                <p className="text-muted small">Join MediFund to seek medical aid, donate, or manage humanitarian relief</p>
              </div>

              {/* Role Selection Tabs */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase text-secondary mb-2">
                  Select Your Account Role
                </label>
                <div className="row g-2">
                  {[
                    { id: 'patient', label: '🏥 Patient / Family', desc: 'Raise funds for surgery' },
                    { id: 'donor', label: '🛡️ Donor', desc: 'Fund medical emergencies' },
                    { id: 'ngo', label: '🤝 NGO Partner', desc: 'Verified trust & sponsorships' }
                  ].map((r) => (
                    <div key={r.id} className="col-12 col-md-4">
                      <button
                        type="button"
                        className={`btn w-100 p-2 text-start h-100 rounded-3 border ${
                          role === r.id
                            ? 'btn-primary border-primary shadow-xs'
                            : 'btn-outline-light text-dark bg-light'
                        }`}
                        onClick={() => setRole(r.id)}
                      >
                        <div className="fw-bold small">{r.label}</div>
                        <div className="text-truncate opacity-75" style={{ fontSize: '0.68rem' }}>
                          {r.desc}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* NGO Trust Notice */}
              {role === 'ngo' && (
                <div className="alert alert-info py-2 px-3 mb-4 rounded-3 d-flex align-items-center gap-2 small">
                  <ShieldCheck size={18} className="text-info shrink-0" />
                  <span>
                    <strong>Trust Verification Note:</strong> Registered NGOs undergo our KYC compliance audit. Upon verification, your organization receives the <strong>"Trusted NGO"</strong> badge and can directly sponsor critical patient treatments.
                  </span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      {role === 'ngo' ? 'Authorized Representative Name' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      placeholder="e.g. Elena Rostova"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Official Email</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      placeholder="e.g. name@medifund.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Official Contact Phone</label>
                    <input
                      type="tel"
                      className="form-control bg-light"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  {/* NGO Organization Specific Fields */}
                  {role === 'ngo' ? (
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">
                        NGO Trust / Organization Legal Name
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        placeholder="Global Hope Healthcare Foundation"
                        value={formData.orgName}
                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                        required
                      />
                    </div>
                  ) : null}
                </div>

                {/* Additional NGO Regulatory & KYC Section */}
                {role === 'ngo' && (
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <h6 className="fw-bold text-mfms-navy mb-3 d-flex align-items-center gap-2">
                      <FileText size={16} className="text-primary" />
                      <span>NGO Regulatory & KYC Verification Details</span>
                    </h6>

                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-4">
                        <label className="form-label small fw-semibold">Legal Entity Type</label>
                        <select
                          className="form-select bg-white"
                          value={formData.legalEntityType}
                          onChange={(e) => setFormData({ ...formData, legalEntityType: e.target.value })}
                        >
                          <option value="Charitable Trust">Charitable Trust</option>
                          <option value="Registered Society">Registered Society</option>
                          <option value="Section 8 Company">Section 8 Company</option>
                          <option value="Non-Profit Organization">Non-Profit Organization</option>
                        </select>
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label small fw-semibold">Registration Number</label>
                        <input
                          type="text"
                          className="form-control bg-white"
                          placeholder="e.g. NGO-FED-89410"
                          value={formData.regNumber}
                          onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label small fw-semibold">Year Established</label>
                        <input
                          type="number"
                          className="form-control bg-white"
                          placeholder="2016"
                          value={formData.yearOfEstablishment}
                          onChange={(e) => setFormData({ ...formData, yearOfEstablishment: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-4">
                        <label className="form-label small fw-semibold">PAN / Tax ID</label>
                        <input
                          type="text"
                          className="form-control bg-white"
                          placeholder="AAATG8941K"
                          value={formData.panNumber}
                          onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                        />
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label small fw-semibold">80G / Tax Exemption No.</label>
                        <input
                          type="text"
                          className="form-control bg-white"
                          placeholder="80G-DEL-2022-8491"
                          value={formData.eightyGNumber}
                          onChange={(e) => setFormData({ ...formData, eightyGNumber: e.target.value })}
                        />
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label small fw-semibold">FCRA No. (if applicable)</label>
                        <input
                          type="text"
                          className="form-control bg-white"
                          placeholder="FCRA-0839210-2021"
                          value={formData.fcraNumber}
                          onChange={(e) => setFormData({ ...formData, fcraNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Official Website</label>
                        <input
                          type="url"
                          className="form-control bg-white"
                          placeholder="https://globalhopehealth.org"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Registered Office Address</label>
                        <input
                          type="text"
                          className="form-control bg-white"
                          placeholder="120 Humanitarian Way, Suite 400"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Representative Designation</label>
                        <input
                          type="text"
                          className="form-control bg-white"
                          placeholder="Executive Managing Trustee"
                          value={formData.repDesignation}
                          onChange={(e) => setFormData({ ...formData, repDesignation: e.target.value })}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Mission Statement</label>
                        <input
                          type="text"
                          className="form-control bg-white"
                          placeholder="Saving lives through medical funding..."
                          value={formData.mission}
                          onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control bg-light"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control bg-light"
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-mfms-primary w-100 py-3 fw-bold mb-3 shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Submitting Registration...' : `Register as ${role.toUpperCase()}`}
                </button>
              </form>

              <div className="text-center pt-3 border-top small text-muted">
                Already registered?{' '}
                <Link to="/login" className="fw-bold text-mfms-blue text-decoration-none">
                  Sign In
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
