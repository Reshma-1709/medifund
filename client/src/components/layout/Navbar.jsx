import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  Menu,
  X,
  Search
} from 'lucide-react';
import api from '../../services/api';

const Navbar = () => {
  const { user, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const { data } = await api.get('/notifications');
          if (data.success) {
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
          }
        } catch (err) {
          // ignore
        }
      };
      fetchNotifications();
    }
  }, [user, location.pathname]);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      // ignore
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      setSearchModalOpen(false);
      navigate(`/campaigns?search=${encodeURIComponent(navSearchQuery.trim())}`);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/campaigns', label: 'Campaigns' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <header className="mfms-navbar py-2 px-3 px-lg-4 bg-white border-bottom sticky-top shadow-xs">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Brand Logo: Blue Heart + Medical Cross Icon */}
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none me-3">
          <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            {/* Blue Heart Shape */}
            <svg viewBox="0 0 24 24" width="40" height="40" fill="#1769E0" xmlns="http://www.w3.org/2000/svg" className="filter-drop-shadow">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {/* White Medical Cross Inside Heart */}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF" className="position-absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -58%)' }}>
              <path d="M19 10.5h-5.5V5c0-.55-.45-1-1-1s-1 .45-1 1v5.5H6c-.55 0-1 .45-1 1s.45 1 1 1h5.5V18c0 .55.45 1 1 1s1-.45 1-1v-5.5H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
            </svg>
          </div>
          <div>
            <span className="fs-4 fw-bold text-mfms-navy letter-spacing-tight">
              Medi<span className="text-mfms-blue">Fund</span>
            </span>
            <small className="d-block text-muted fw-medium" style={{ fontSize: '0.68rem', marginTop: '-3px' }}>
              Together for a Healthier Tomorrow
            </small>
          </div>
        </Link>

        {/* Desktop Navigation Links: Home, About, Campaigns, How It Works, Blog, Contact */}
        <nav className="d-none d-lg-flex align-items-center gap-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-decoration-none fw-semibold transition-all ${
                  isActive ? 'text-mfms-blue fw-bold' : 'text-secondary hover-primary'
                }`}
                style={{ fontSize: '0.92rem' }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions: Search, Login, Sign Up / Dashboard */}
        <div className="d-flex align-items-center gap-2 gap-md-3">

          {/* Search Trigger Button */}
          <button
            className="btn btn-light rounded-circle p-2 text-secondary hover-primary border-0 shadow-xs"
            onClick={() => setSearchModalOpen(true)}
            title="Search Campaigns"
          >
            <Search size={18} />
          </button>

          {/* User Logged In Items */}
          {user ? (
            <>
              {/* Notification Bell */}
              <div className="position-relative">
                <button 
                  className="btn btn-light rounded-circle p-2 position-relative"
                  onClick={() => setNotifOpen(!notifOpen)}
                >
                  <Bell size={18} className="text-secondary" />
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div 
                    className="dropdown-menu dropdown-menu-end show shadow-lg border-0 rounded-3 p-2 mt-2" 
                    style={{ width: '320px', maxHeight: '400px', overflowY: 'auto', position: 'absolute', right: 0, zIndex: 1050 }}
                  >
                    <div className="d-flex justify-content-between align-items-center px-2 py-1 border-bottom mb-2">
                      <span className="fw-bold small">Notifications ({unreadCount} new)</span>
                      {unreadCount > 0 && (
                        <button className="btn btn-link btn-sm p-0 text-decoration-none small" onClick={handleMarkAllRead}>
                          Mark all read
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-muted small text-center py-3 my-0">No notifications yet</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} className={`p-2 mb-1 rounded-2 small ${n.isRead ? 'bg-white' : 'bg-mfms-light'}`}>
                          <div className="fw-semibold text-mfms-navy">{n.title}</div>
                          <div className="text-muted text-truncate" style={{ fontSize: '0.78rem' }}>{n.message}</div>
                          <small className="text-secondary" style={{ fontSize: '0.68rem' }}>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="d-flex align-items-center gap-2">
                <Link 
                  to={getDashboardPath()} 
                  className="btn btn-sm btn-mfms-primary py-1 px-3 d-flex align-items-center gap-1 rounded-pill"
                >
                  <LayoutDashboard size={15} />
                  <span className="d-none d-md-inline">Dashboard</span>
                </Link>

                <button 
                  onClick={logout} 
                  className="btn btn-sm btn-outline-danger py-1 px-2 rounded-circle" 
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-sm btn-outline-primary px-3 py-1 fw-semibold rounded-pill">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-mfms-primary px-3 py-1 fw-semibold rounded-pill">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="btn btn-light d-lg-none p-1 rounded-circle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="d-lg-none border-top mt-2 pt-2 px-3 pb-3 bg-white">
          <nav className="d-flex flex-column gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="py-2 text-decoration-none text-dark fw-medium border-bottom border-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="d-flex gap-2 pt-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm w-50 rounded-pill" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-mfms-primary btn-sm w-50 rounded-pill" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-bottom py-3">
                <h6 className="modal-title fw-bold text-mfms-navy d-flex align-items-center gap-2">
                  <Search size={18} className="text-primary" />
                  Search Medical Campaigns
                </h6>
                <button type="button" className="btn-close" onClick={() => setSearchModalOpen(false)} />
              </div>
              <form onSubmit={handleSearchSubmit}>
                <div className="modal-body p-4">
                  <div className="position-relative">
                    <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5 rounded-pill"
                      placeholder="Search patient, surgery, hospital..."
                      value={navSearchQuery}
                      onChange={(e) => setNavSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    <small className="text-muted w-100 mb-1">Popular searches:</small>
                    {['Cardiology', 'Pediatric ICU', 'Cancer Treatment', 'Apollo', 'Organ Transplant'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        className="btn btn-sm btn-light border rounded-pill py-1 px-3 text-secondary"
                        onClick={() => {
                          setNavSearchQuery(term);
                          navigate(`/campaigns?search=${encodeURIComponent(term)}`);
                          setSearchModalOpen(false);
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="modal-footer border-top p-3">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setSearchModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-mfms-primary rounded-pill px-4 fw-bold">
                    Search Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
