import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building2, ShieldCheck, Mail, Phone, MapPin, DollarSign } from 'lucide-react';

const NgoDirectoryPage = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const { data } = await api.get('/ngos/directory');
        if (data.success) {
          setNgos(data.ngos || []);
        }
      } catch (error) {
        console.error('Failed to load NGOs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-mfms-blue fw-bold text-uppercase small tracking-wider">
            Verified Humanitarian Partners
          </span>
          <h1 className="display-5 fw-bold text-mfms-navy mt-1">Partner NGO Directory</h1>
          <p className="lead text-muted fs-6">
            Meet the accredited non-profit trusts and humanitarian foundations collaborating with MediFund to manage fund pools and sponsor patient medical interventions.
          </p>
        </div>

        {/* NGOs Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2 text-muted small">Loading verified NGOs...</p>
          </div>
        ) : ngos.length === 0 ? (
          <p className="text-center text-muted">No NGOs registered yet.</p>
        ) : (
          <div className="row g-4">
            {ngos.map((ngo) => (
              <div key={ngo._id} className="col-12 col-md-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 bg-white d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-mfms-light text-mfms-blue p-3 rounded-circle">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h5 className="fw-bold text-mfms-navy mb-0">{ngo.ngoName}</h5>
                          <span className="badge bg-success text-white d-inline-flex align-items-center gap-1 small py-1 px-2 rounded-pill">
                            <ShieldCheck size={12} />
                            <span>{ngo.trustBadge || 'Trusted NGO'}</span>
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <small className="text-muted font-monospace">{ngo.registrationNumber}</small>
                          <span className="badge bg-light text-primary border fw-semibold">
                            Trust Score: {ngo.trustScore || 94}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-secondary small mb-4 leading-relaxed flex-grow-1">
                    {ngo.mission}
                  </p>

                  {/* Fund stats */}
                  <div className="row g-2 bg-light p-3 rounded-3 mb-3 text-center">
                    <div className="col-6 border-end">
                      <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.68rem' }}>Active Fund Pool</small>
                      <span className="fw-bold text-mfms-blue fs-6">
                        ${(ngo.totalFundPool || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.68rem' }}>Disbursed to Hospitals</small>
                      <span className="fw-bold text-success fs-6">
                        ${(ngo.allocatedFunds || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-2 border-top d-flex flex-column gap-1 small text-muted">
                    {ngo.address && (
                      <div className="d-flex align-items-center gap-2">
                        <MapPin size={14} className="text-secondary shrink-0" />
                        <span className="text-truncate">{ngo.address}</span>
                      </div>
                    )}
                    {ngo.contactEmail && (
                      <div className="d-flex align-items-center gap-2">
                        <Mail size={14} className="text-secondary shrink-0" />
                        <span>{ngo.contactEmail}</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default NgoDirectoryPage;
