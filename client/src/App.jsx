import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import BrowseCampaignsPage from './pages/public/BrowseCampaignsPage';
import CampaignDetailPage from './pages/public/CampaignDetailPage';
import AboutPage from './pages/public/AboutPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import NgoDirectoryPage from './pages/public/NgoDirectoryPage';
import ContactPage from './pages/public/ContactPage';
import BlogPage from './pages/public/BlogPage';
import FAQPage from './pages/public/FAQPage';
import { TermsPage, PrivacyPage, RefundPolicyPage } from './pages/public/LegalPages';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import CreateCampaignWizard from './pages/patient/CreateCampaignWizard';
import MyCampaignsPage from './pages/patient/MyCampaignsPage';
import PatientUpdatesPage from './pages/patient/PatientUpdatesPage';
import PatientDocumentsPage from './pages/patient/PatientDocumentsPage';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import { MyDonationsPage, TaxReceiptsPage, SavedCampaignsPage } from './pages/donor/DonorPages';

// Hospital Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import { VerificationRequestsPage, HospitalPatientsPage, PostTreatmentUpdatePage } from './pages/hospital/HospitalPages';

// NGO Pages
import NgoDashboard from './pages/ngo/NgoDashboard';
import { FundAllocationsPage, CaseTransfersPage, NgoFinancialReportsPage } from './pages/ngo/NgoPages';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import { 
  UserManagementPage, 
  CampaignManagementPage, 
  HospitalNgoManagementPage, 
  RefundRequestsPage, 
  AuditLogsPage, 
  AdminReportsPage 
} from './pages/admin/AdminPages';

// Public Layout Wrapper with Navbar & Footer
const PublicLayout = ({ children }) => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <div className="flex-grow-1">{children}</div>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/campaigns" element={<PublicLayout><BrowseCampaignsPage /></PublicLayout>} />
      <Route path="/campaigns/:id" element={<PublicLayout><CampaignDetailPage /></PublicLayout>} />
      <Route path="/campaigns/create" element={<Navigate to="/patient/create-campaign" replace />} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
      <Route path="/ngos" element={<PublicLayout><NgoDirectoryPage /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
      <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
      <Route path="/refund-policy" element={<PublicLayout><RefundPolicyPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />

      {/* Patient Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['patient', 'admin']} />}>
        <Route element={<><Navbar /><DashboardLayout /></>}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/create-campaign" element={<CreateCampaignWizard />} />
          <Route path="/patient/my-campaigns" element={<MyCampaignsPage />} />
          <Route path="/patient/updates" element={<PatientUpdatesPage />} />
          <Route path="/patient/documents" element={<PatientDocumentsPage />} />
        </Route>
      </Route>

      {/* Donor Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['donor', 'admin']} />}>
        <Route element={<><Navbar /><DashboardLayout /></>}>
          <Route path="/donor/dashboard" element={<DonorDashboard />} />
          <Route path="/donor/donations" element={<MyDonationsPage />} />
          <Route path="/donor/receipts" element={<TaxReceiptsPage />} />
          <Route path="/donor/saved" element={<SavedCampaignsPage />} />
        </Route>
      </Route>

      {/* Hospital Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['hospital', 'admin']} />}>
        <Route element={<><Navbar /><DashboardLayout /></>}>
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          <Route path="/hospital/verifications" element={<VerificationRequestsPage />} />
          <Route path="/hospital/patients" element={<HospitalPatientsPage />} />
          <Route path="/hospital/post-update" element={<PostTreatmentUpdatePage />} />
        </Route>
      </Route>

      {/* NGO Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ngo', 'admin']} />}>
        <Route element={<><Navbar /><DashboardLayout /></>}>
          <Route path="/ngo/dashboard" element={<NgoDashboard />} />
          <Route path="/ngo/allocations" element={<FundAllocationsPage />} />
          <Route path="/ngo/transfers" element={<CaseTransfersPage />} />
          <Route path="/ngo/reports" element={<NgoFinancialReportsPage />} />
        </Route>
      </Route>

      {/* Admin Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<><Navbar /><DashboardLayout /></>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/campaigns" element={<CampaignManagementPage />} />
          <Route path="/admin/organizations" element={<HospitalNgoManagementPage />} />
          <Route path="/admin/refunds" element={<RefundRequestsPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
