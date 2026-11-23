import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Printer, Download, CheckCircle, ShieldCheck, Activity, X } from 'lucide-react';
import { formatINR } from '../../utils/currency';

const ReceiptModal = ({ donationId, onClose }) => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (donationId) {
      const fetchReceipt = async () => {
        try {
          const { data } = await api.get(`/donations/receipt/${donationId}`);
          if (data.success) {
            setReceipt(data.receipt);
          }
        } catch (error) {
          console.error('Failed to load receipt', error);
        } finally {
          setLoading(false);
        }
      };
      fetchReceipt();
    }
  }, [donationId]);

  if (!donationId) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="modal show d-block" 
      style={{ backgroundColor: 'rgba(16, 24, 40, 0.75)', zIndex: 1060 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="modal-header bg-light border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
            <h5 className="modal-title fw-bold text-mfms-navy mb-0 d-flex align-items-center gap-2">
              <ShieldCheck className="text-success" size={22} />
              <span>Official Medical Donation Tax Receipt</span>
            </h5>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onClick={handlePrint}>
                <Printer size={16} />
                <span>Print / Save PDF</span>
              </button>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
          </div>

          <div className="modal-body p-4 p-md-5">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 text-muted small">Generating official receipt...</p>
              </div>
            ) : receipt ? (
              <div className="printable-receipt border rounded-4 p-4 p-md-5 bg-white shadow-sm">
                
                {/* Receipt Brand Header */}
                <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <div className="bg-mfms-blue text-white p-2 rounded-3">
                        <Activity size={20} className="text-white" />
                      </div>
                      <span className="fs-3 fw-bold text-mfms-navy">Medi<span className="text-mfms-blue">fund</span></span>
                    </div>
                    <small className="text-muted d-block">{receipt.ngoName}</small>
                    <small className="text-muted">Registered Charitable Healthcare Trust</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fs-6 rounded-pill">
                      PAID & VERIFIED
                    </span>
                    <div className="fw-bold font-monospace text-mfms-navy mt-2 fs-5">
                      {receipt.receiptNumber}
                    </div>
                    <small className="text-muted">Issued: {new Date(receipt.date).toLocaleDateString()}</small>
                  </div>
                </div>

                {/* Tax Exemption Banner */}
                <div className="alert alert-primary bg-mfms-light border-primary border-opacity-25 py-2 px-3 mb-4 rounded-3 small">
                  <strong>Tax Exemption Certificate:</strong> This donation qualifies for income tax deduction under <strong>{receipt.taxDeductibleSection}</strong>. Tax ID / Registration: <code>{receipt.taxId}</code>.
                </div>

                {/* Donor & Campaign Details Table */}
                <div className="row g-4 mb-4">
                  <div className="col-6">
                    <h6 className="text-uppercase text-secondary small fw-bold tracking-wider mb-2">Donor Information</h6>
                    <div className="fw-bold fs-6 text-dark">{receipt.donorName}</div>
                    <div className="text-muted small">{receipt.donorEmail}</div>
                    <div className="text-muted small mt-1 font-monospace">Txn ID: {receipt.transactionId}</div>
                  </div>
                  <div className="col-6">
                    <h6 className="text-uppercase text-secondary small fw-bold tracking-wider mb-2">Beneficiary Case</h6>
                    <div className="fw-bold text-dark">{receipt.campaignTitle}</div>
                    <div className="text-muted small">Admitted Hospital: {receipt.hospitalName}</div>
                  </div>
                </div>

                {/* Financial Breakdown Table */}
                <div className="table-responsive mb-4">
                  <table className="table table-bordered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Item Description</th>
                        <th className="text-end" style={{ width: '180px' }}>Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Direct Medical Patient Care Sponsorship</strong>
                          <div className="text-muted small">Allocated directly for surgery, medications, and ICU hospitalization.</div>
                        </td>
                        <td className="text-end fw-bold">{formatINR(receipt.donationAmount)}</td>
                      </tr>
                      {receipt.tipAmount > 0 && (
                        <tr>
                          <td>
                            <strong>MediFund Platform Operational Grant</strong>
                            <div className="text-muted small">100% voluntary platform maintenance contribution.</div>
                          </td>
                          <td className="text-end text-muted">{formatINR(receipt.tipAmount)}</td>
                        </tr>
                      )}
                      <tr className="table-light fs-6">
                        <td className="fw-bold text-mfms-navy">Total Tax-Deductible Contribution (80G)</td>
                        <td className="text-end fw-bold text-mfms-blue fs-5">{formatINR(receipt.totalAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Signatures & Verification seal */}
                <div className="d-flex justify-content-between align-items-end pt-3 border-top text-muted small">
                  <div>
                    <p className="mb-1">Authorized Digital Signature</p>
                    <div className="fw-bold text-dark font-cursive fs-5" style={{ fontFamily: 'Georgia, serif' }}>
                      Sarah Jenkins, Auditor
                    </div>
                    <small>MediFund Medical Oversight Council</small>
                  </div>
                  <div className="text-end">
                    <div className="d-inline-flex align-items-center gap-1 text-success fw-semibold">
                      <CheckCircle size={16} />
                      <span>Tamper-Proof Blockchain Validated</span>
                    </div>
                    <p className="mb-0 text-muted" style={{ fontSize: '0.72rem' }}>
                      Questions? Contact: finance@medifund.org
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-danger text-center">Unable to load receipt</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
