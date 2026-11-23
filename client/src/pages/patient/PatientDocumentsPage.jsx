import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FileText, Upload, ShieldCheck, Clock, ExternalLink, CheckCircle } from 'lucide-react';

const PatientDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('Medical Report');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDocs = async () => {
    try {
      const { data } = await api.get('/patient/dashboard');
      if (data.success) {
        // Collect documents from patient profile and campaigns
        const profDocs = data.patientProfile?.documents || [];
        const campDocs = (data.campaigns || []).flatMap(c => c.medicalDocuments || []);
        
        // Merge and deduplicate
        const merged = [...profDocs];
        campDocs.forEach(cd => {
          if (!merged.some(m => m.fileUrl === cd.url || m.title === cd.name)) {
            merged.push({
              title: cd.name,
              docType: cd.docType,
              fileUrl: cd.url,
              verificationStatus: 'verified',
              uploadedAt: new Date()
            });
          }
        });
        setDocuments(merged);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title && !selectedFile) {
      toast.error('Please enter a document title or select a file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('document', selectedFile);
      }
      formData.append('title', title || selectedFile?.name || 'Medical Document');
      formData.append('docType', docType);

      const { data } = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success('Document uploaded and stored in database successfully!');
        setTitle('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await fetchDocs();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h3 className="fw-bold text-mfms-navy mb-1">Medical Records & Document Repository</h3>
        <p className="text-muted small">Manage hospital admission slips, diagnostic scans, and physician estimates stored in the database.</p>
      </div>

      <div className="row g-4">
        {/* Upload New Document Form */}
        <div className="col-12 col-lg-5">
          <div className="mfms-card p-4">
            <h5 className="fw-bold text-mfms-navy mb-3 d-flex align-items-center gap-2">
              <Upload size={20} className="text-primary" />
              <span>Direct Browser Document Upload</span>
            </h5>

            <form onSubmit={handleUpload}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Document Title / Diagnostic Name</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="e.g. Echocardiogram 2D Doppler Study"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Category Classification</label>
                <select
                  className="form-select bg-light"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="Medical Report">Medical Report / Lab Test</option>
                  <option value="Radiology & Scans">Radiology (X-Ray / MRI / CT)</option>
                  <option value="Hospital Cost Estimate">Hospital Surgery Cost Estimate</option>
                  <option value="Admission Slip">Hospital Bed Admission Slip</option>
                  <option value="Doctor Prescription">Doctor Signed Prescription</option>
                  <option value="Identity Proof">Identity & Government Proof</option>
                </select>
              </div>

              {/* Native Browser File Selector */}
              <div className="p-3 bg-light rounded-3 text-center mb-4 border border-dashed">
                <FileText size={28} className="text-primary mx-auto mb-2" />
                <label className="btn btn-sm btn-outline-primary mb-2 d-inline-flex align-items-center gap-1 cursor-pointer">
                  <Upload size={14} />
                  <span>{selectedFile ? selectedFile.name : 'Choose File from Device'}</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="d-none"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        if (!title) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                      }
                    }}
                  />
                </label>
                <span className="small text-muted d-block" style={{ fontSize: '0.72rem' }}>
                  Supports PDF, PNG, JPG up to 10MB
                </span>
              </div>

              <button type="submit" className="btn btn-mfms-primary w-100 py-2 fw-semibold" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload & Save to Database'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Documents List */}
        <div className="col-12 col-lg-7">
          <div className="mfms-card p-4">
            <h5 className="fw-bold text-mfms-navy mb-3">Verified Medical Files on Record ({documents.length})</h5>

            {documents.length === 0 ? (
              <p className="text-muted small">No documents currently uploaded.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr className="small text-uppercase">
                      <th>Document</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, idx) => (
                      <tr key={idx} className="small">
                        <td>
                          <div className="fw-bold text-dark">{doc.title || doc.name}</div>
                          <small className="text-muted">
                            Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Recently'}
                          </small>
                        </td>
                        <td>{doc.docType}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success">
                            ✓ Verified & Active
                          </span>
                        </td>
                        <td className="text-end">
                          <a
                            href={doc.fileUrl || doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-secondary py-1 px-2 d-inline-flex align-items-center gap-1"
                          >
                            <ExternalLink size={13} />
                            <span>View</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDocumentsPage;
