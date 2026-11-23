import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const { user, login, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already authenticated, redirect directly to their dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'donor') {
        navigate('/donor/dashboard');
      } else {
        navigate(getDashboardPath(user.role));
      }
    }
  }, [user, navigate, getDashboardPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      // Role-based authentication redirect:
      // Admins -> Admin Dashboard
      // Donors / Users -> User Dashboard
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'donor') {
        navigate('/donor/dashboard');
      } else {
        navigate(getDashboardPath(res.user.role));
      }
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            
            {/* Back to Home Button */}
            <div className="mb-3">
              <Link 
                to="/" 
                className="btn btn-sm btn-link text-decoration-none text-muted d-inline-flex align-items-center gap-1.5 px-0 fw-semibold"
              >
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Login Card */}
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
              
              {/* Brand Logo & Generic Healthcare Header */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="#1769E0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="#FFFFFF" className="position-absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -58%)' }}>
                    <path d="M19 10.5h-5.5V5c0-.55-.45-1-1-1s-1 .45-1 1v5.5H6c-.55 0-1 .45-1 1s.45 1 1 1h5.5V18c0 .55.45 1 1 1s1-.45 1-1v-5.5H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
                  </svg>
                </div>
                <h3 className="fw-bold text-mfms-navy mb-1">Please sign in to continue.</h3>
                <p className="text-muted small mb-0">Enter your credentials to access your account.</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Mail size={16} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 bg-light"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold mb-0">Password</label>
                    <Link to="/forgot-password" className="small text-decoration-none text-mfms-blue fw-medium">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Lock size={16} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0 bg-light"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-mfms-primary w-100 py-2.5 fw-bold mb-3 shadow-sm rounded-3"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="text-center pt-3 border-top small text-muted">
                Don't have an account yet?{' '}
                <Link to="/register" className="fw-bold text-mfms-blue text-decoration-none">
                  Create Account
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-4 pt-2 text-center text-muted d-flex align-items-center justify-content-center gap-1.5" style={{ fontSize: '0.73rem' }}>
                <ShieldCheck size={14} className="text-success" />
                <span>256-Bit SSL Encrypted Healthcare Portal</span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
