import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Password reset email dispatched.');
    } catch (err) {
      toast.error('Unable to send reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white text-center">
              
              <div className="bg-mfms-blue text-white p-3 rounded-circle d-inline-flex mb-3 shadow-sm mx-auto">
                <Activity size={28} className="text-white" />
              </div>

              {submitted ? (
                <div>
                  <div className="bg-success text-white rounded-circle p-2 d-inline-flex mb-2">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="fw-bold text-mfms-navy mb-2">Reset Link Sent</h4>
                  <p className="text-muted small mb-4">
                    If an account matches <strong>{email}</strong>, you will receive password reset instructions shortly.
                  </p>
                  <Link to="/login" className="btn btn-outline-primary w-100 fw-semibold">
                    Return to Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h4 className="fw-bold text-mfms-navy mb-1">Reset Password</h4>
                  <p className="text-muted small mb-4">
                    Enter your email to receive recovery instructions
                  </p>

                  <div className="mb-4 text-start">
                    <label className="form-label small fw-semibold">Account Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={16} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 bg-light"
                        placeholder="name@medifund.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-mfms-primary w-100 py-3 fw-bold mb-3 shadow-sm"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Instructions'}
                  </button>

                  <Link to="/login" className="small text-muted text-decoration-none d-flex align-items-center justify-content-center gap-1">
                    <ArrowLeft size={14} />
                    <span>Back to Login</span>
                  </Link>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
