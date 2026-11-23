import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Your message has been dispatched to MediFund support.');
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-mfms-blue fw-bold text-uppercase small tracking-wider">
            Get in Touch
          </span>
          <h1 className="display-5 fw-bold text-mfms-navy mt-1">Contact MediFund Support</h1>
          <p className="lead text-muted fs-6">
            Have questions about patient verification, hospital partnership onboarding, or donation tax receipts? Our team is here to assist 24/7.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          
          {/* Contact Details Card */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-mfms-navy text-white h-100 d-flex flex-column justify-content-between">
              <div>
                <h4 className="fw-bold mb-4">Contact Information</h4>
                
                <div className="d-flex flex-column gap-4 mb-5">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-white bg-opacity-10 p-2 rounded-3">
                      <Phone size={20} className="text-warning" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Emergency 24/7 Helpline</h6>
                      <p className="text-light opacity-80 small mb-0">+1 (800) 482-HEAL (Toll Free)</p>
                      <p className="text-light opacity-80 small mb-0">+1 (555) 019-2834 (Hospital Desk)</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-white bg-opacity-10 p-2 rounded-3">
                      <Mail size={20} className="text-warning" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Email Inquiries</h6>
                      <p className="text-light opacity-80 small mb-0">support@medifund.org</p>
                      <p className="text-light opacity-80 small mb-0">hospitals@medifund.org</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-white bg-opacity-10 p-2 rounded-3">
                      <MapPin size={20} className="text-warning" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Headquarters</h6>
                      <p className="text-light opacity-80 small mb-0">
                        MediFund Humanitarian Relief Center<br />
                        450 Healthcare Blvd, Suite 800<br />
                        New York, NY 10016
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white bg-opacity-10 rounded-3 small">
                <span className="fw-bold text-warning d-block mb-1">Are you an accredited hospital?</span>
                <span className="text-light opacity-80">
                  Contact our partner desk directly for API verification integration.
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              {submitted ? (
                <div className="text-center py-5">
                  <div className="bg-success text-white rounded-circle p-3 d-inline-flex mb-3">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="fw-bold text-mfms-navy mb-2">Message Dispatched!</h4>
                  <p className="text-muted small mb-4">
                    Thank you for reaching out. A healthcare support representative will respond to your email within 4 hours.
                  </p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h4 className="fw-bold text-mfms-navy mb-4">Send Us a Direct Message</h4>
                  
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Your Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Dr. Arthur Bennett"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. arthur@hospital.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Subject Matter</label>
                    <select
                      className="form-select"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="General Inquiry">General Platform Inquiry</option>
                      <option value="Patient Case Verification">Patient Case Verification Assistance</option>
                      <option value="Hospital Onboarding">Hospital Onboarding & Accreditation</option>
                      <option value="Donation Receipt Assistance">Donation Receipt / 80G Tax Exemption</option>
                      <option value="NGO Partnership">NGO Coalition Partnership</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Your Message or Case Reference</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Please write your query or provide the patient case ID..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-mfms-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                    <Send size={18} />
                    <span>Send Message to Support</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
