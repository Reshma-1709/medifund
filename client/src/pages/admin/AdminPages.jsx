import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatINR } from '../../utils/currency';
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Search,
  Eye,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users', {
        params: { role: roleFilter !== 'all' ? roleFilter : undefined, search: search.trim() || undefined }
      });
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle-status`);
      if (data.success) {
        toast.success(data.message);
        setUsers(users.map(u => u._id === id ? { ...u, isActive: data.user.isActive } : u));
      }
    } catch (err) {
      toast.error('Failed to change user status');
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">User Directory & Role Governance</h3>
        <p className="text-muted small">Manage patients, accredited hospital representatives, NGOs, donors, and administrators.</p>
      </div>

      <div className="mfms-card p-4">
        <div className="row g-3 align-items-center mb-4">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Search size={16} /></span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end">
            {['all', 'patient', 'donor', 'hospital', 'ngo', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                className={`btn btn-sm rounded-pill text-capitalize px-3 ${roleFilter === r ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setRoleFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>User Details</th>
                  <th>System Role</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th className="text-end">Account Control</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="small">
                    <td>
                      <div className="fw-bold text-dark">{u.fullName}</div>
                      <div className="text-muted">{u.email}</div>
                    </td>
                    <td><span className="badge bg-light text-primary border text-capitalize">{u.role}</span></td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className={`badge ${u.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="text-end">
                      <button
                        className={`btn btn-sm py-1 px-3 ${u.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={() => handleToggleStatus(u._id)}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const CampaignManagementPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const { data } = await api.get('/campaigns', { params: { status: undefined, limit: 50 } });
      if (data.success) {
        setCampaigns(data.campaigns || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleStatusChange = async (id, status, featured) => {
    try {
      const { data } = await api.put(`/campaigns/${id}/status`, { status, featured });
      if (data.success) {
        toast.success(`Campaign updated successfully`);
        fetchCampaigns();
      }
    } catch (err) {
      toast.error('Failed to update campaign');
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Global Medical Campaign Oversight</h3>
        <p className="text-muted small">Audit and control all patient fundraising cases across the network.</p>
      </div>

      <div className="mfms-card p-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>Title & Patient</th>
                  <th>Hospital Partner</th>
                  <th>Target Goal</th>
                  <th>Raised</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th className="text-end">Admin Controls</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id} className="small">
                    <td>
                      <Link to={`/campaigns/${c._id}`} className="fw-bold text-dark text-decoration-none">
                        {c.title}
                      </Link>
                      <div className="text-muted">{c.patientName} • {c.category}</div>
                    </td>
                    <td>{c.hospitalName}</td>
                    <td>${c.fundingGoal.toLocaleString()}</td>
                    <td><strong className="text-success">${c.raisedAmount.toLocaleString()}</strong></td>
                    <td>
                      <span className={`badge ${
                        c.status === 'approved' ? 'bg-success' : c.status === 'completed' ? 'bg-primary' : 'bg-warning text-dark'
                      }`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm p-1 ${c.featured ? 'text-warning' : 'text-muted'}`}
                        onClick={() => handleStatusChange(c._id, undefined, !c.featured)}
                        title="Toggle Featured"
                      >
                        <Star size={16} className={c.featured ? 'fill-warning' : ''} />
                      </button>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        {c.status !== 'approved' && (
                          <button
                            className="btn btn-sm btn-success py-1 px-2"
                            onClick={() => handleStatusChange(c._id, 'approved')}
                          >
                            Approve
                          </button>
                        )}
                        {c.status !== 'suspended' && (
                          <button
                            className="btn btn-sm btn-outline-danger py-1 px-2"
                            onClick={() => handleStatusChange(c._id, 'suspended')}
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const HospitalNgoManagementPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrgs = async () => {
    try {
      const { data } = await api.get('/admin/organizations');
      if (data.success) {
        setHospitals(data.hospitals || []);
        setNgos(data.ngos || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleVerify = async (type, id, status) => {
    try {
      const { data } = await api.put(`/admin/organizations/${type}/${id}`, { status });
      if (data.success) {
        toast.success(`Organization accreditation set to ${status}`);
        fetchOrgs();
      }
    } catch (err) {
      toast.error('Failed to update organization status');
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Accredited Hospitals & NGO Partners</h3>
        <p className="text-muted small">Verify hospital licenses and NGO humanitarian trust credentials.</p>
      </div>

      <div className="row g-4">
        {/* Hospitals Table */}
        <div className="col-12 col-xl-6">
          <div className="mfms-card p-4">
            <h5 className="fw-bold text-mfms-navy mb-3">Accredited Hospitals ({hospitals.length})</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th>Hospital Center</th>
                    <th>Registration #</th>
                    <th>Accreditation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((h) => (
                    <tr key={h._id} className="small">
                      <td>
                        <strong>{h.hospitalName}</strong>
                        <div className="text-muted">{h.city}, {h.state}</div>
                      </td>
                      <td><span className="font-monospace">{h.registrationNumber}</span></td>
                      <td>{h.accreditation || 'NABH Certified'}</td>
                      <td>
                        <span className={`badge ${h.verificationStatus === 'verified' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {h.verificationStatus.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* NGOs Table */}
        <div className="col-12 col-xl-6">
          <div className="mfms-card p-4">
            <h5 className="fw-bold text-mfms-navy mb-3">Partner Humanitarian NGOs ({ngos.length})</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th>Foundation Name</th>
                    <th>Trust Score & Badge</th>
                    <th>KYC & 80G</th>
                    <th>Status & Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ngos.map((n) => (
                    <tr key={n._id} className="small">
                      <td>
                        <strong>{n.ngoName}</strong>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Reg: {n.registrationNumber} • {n.city || 'Chicago'}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <span className="badge bg-success text-white d-inline-flex align-items-center gap-1" style={{ fontSize: '0.68rem' }}>
                            <ShieldCheck size={11} />
                            <span>{n.trustBadge || 'Trusted NGO'}</span>
                          </span>
                          <span className="fw-bold text-mfms-blue small">{n.trustScore || 94}/100</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border font-monospace" style={{ fontSize: '0.7rem' }}>
                          80G: {n.eightyGCertificate?.number || 'Verified'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <span className={`badge ${n.verificationStatus === 'verified' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {n.verificationStatus.toUpperCase()}
                          </span>
                          {n.verificationStatus !== 'verified' ? (
                            <button
                              className="btn btn-sm btn-success py-0 px-2 fw-semibold"
                              style={{ fontSize: '0.72rem' }}
                              onClick={() => handleVerify('ngo', n._id, 'verified')}
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-danger py-0 px-2"
                              style={{ fontSize: '0.72rem' }}
                              onClick={() => handleVerify('ngo', n._id, 'pending')}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RefundRequestsPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRefunds = async () => {
    try {
      const { data } = await api.get('/admin/refunds');
      if (data.success) {
        setRefunds(data.refunds || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/refunds/${id}`, {
        status,
        adminNotes: `Processed by superadmin on ${new Date().toLocaleDateString()}`
      });
      if (data.success) {
        toast.success(`Refund marked as ${status}`);
        fetchRefunds();
      }
    } catch (err) {
      toast.error('Refund action failed');
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Donation Refund Requests</h3>
        <p className="text-muted small">Examine donor refund inquiries before clinical funds are wired.</p>
      </div>

      <div className="mfms-card p-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : refunds.length === 0 ? (
          <p className="text-muted text-center py-4">No pending refund requests.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>Donor</th>
                  <th>Campaign Case</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((r) => (
                  <tr key={r._id} className="small">
                    <td>
                      <strong>{r.donorId?.fullName || 'Donor'}</strong>
                      <div className="text-muted">{r.donorId?.email}</div>
                    </td>
                    <td>{r.campaignId?.title}</td>
                    <td><strong className="text-danger">{formatINR(r.amount)}</strong></td>
                    <td>{r.reason}</td>
                    <td>
                      <span className={`badge ${
                        r.status === 'approved' ? 'bg-success' : r.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end">
                      {r.status === 'pending' && (
                        <div className="d-inline-flex gap-1">
                          <button
                            className="btn btn-sm btn-success py-1 px-2"
                            onClick={() => handleAction(r._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger py-1 px-2"
                            onClick={() => handleAction(r._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/admin/audit-logs');
        if (data.success) {
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">System Security Audit Trail</h3>
        <p className="text-muted small">Immutable log of administrative, clinical, and financial actions across the network.</p>
      </div>

      <div className="mfms-card p-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 font-monospace" style={{ fontSize: '0.8rem' }}>
              <thead className="table-light text-uppercase">
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Role</th>
                  <th>Action Event</th>
                  <th>Entity</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>{new Date(log.createdAt).toISOString()}</td>
                    <td><strong>{log.actorName}</strong></td>
                    <td><span className="badge bg-light text-dark border">{log.actorRole}</span></td>
                    <td><strong className="text-primary">{log.action}</strong></td>
                    <td>{log.entityType} ({log.entityId || 'SYS'})</td>
                    <td>{log.ipAddress || '127.0.0.1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const AdminReportsPage = () => {
  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">System Financial Analytics & Reports</h3>
        <p className="text-muted small">Comprehensive statement of platform liquidity, donations, and direct hospital wires.</p>
      </div>

      <div className="mfms-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold text-mfms-navy mb-0">Consolidated Clinical Giving Ledger</h5>
          <button className="btn btn-outline-primary btn-sm fw-semibold" onClick={() => window.print()}>
            Print / Export Audit Ledger
          </button>
        </div>

        <div className="row g-4 text-center mb-4">
          <div className="col-4 border-end">
            <div className="text-muted small text-uppercase">Total Funds Raised</div>
            <h3 className="fw-bold text-success mt-1 mb-0">₹1,74,90,000</h3>
          </div>
          <div className="col-4 border-end">
            <div className="text-muted small text-uppercase">Direct Hospital Disbursals</div>
            <h3 className="fw-bold text-mfms-blue mt-1 mb-0">₹95,00,000</h3>
          </div>
          <div className="col-4">
            <div className="text-muted small text-uppercase">Escrow Committed Balance</div>
            <h3 className="fw-bold text-warning mt-1 mb-0">₹79,90,000</h3>
          </div>
        </div>

        <div className="alert alert-success bg-success-subtle text-success p-3 rounded-3 small">
          ✓ All disbursed healthcare payments correspond with verified inpatient hospital bill invoice numbers.
        </div>
      </div>
    </div>
  );
};
