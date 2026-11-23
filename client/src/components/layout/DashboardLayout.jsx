import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Activity,
  History,
  Receipt,
  Bookmark,
  CheckCircle2,
  Users,
  DollarSign,
  ArrowRightLeft,
  FileCheck,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Building2,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role based navigation links
  const getNavItems = () => {
    switch (user?.role) {
      case 'patient':
        return [
          { to: '/patient/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: '/patient/create-campaign', label: 'Start Campaign', icon: PlusCircle },
          { to: '/patient/my-campaigns', label: 'My Campaigns', icon: FileText },
          { to: '/patient/documents', label: 'Medical Documents', icon: FileText },
          { to: '/patient/updates', label: 'Recovery Updates', icon: Activity }
        ];

      case 'donor':
        return [
          { to: '/donor/dashboard', label: 'Donor Overview', icon: LayoutDashboard },
          { to: '/campaigns', label: 'Browse Campaigns', icon: Activity },
          { to: '/donor/donations', label: 'My Donations', icon: History },
          { to: '/donor/receipts', label: 'Tax Receipts (80G)', icon: Receipt },
          { to: '/donor/saved', label: 'Saved Campaigns', icon: Bookmark }
        ];

      case 'hospital':
        return [
          { to: '/hospital/dashboard', label: 'Hospital Hub', icon: LayoutDashboard },
          { to: '/hospital/verifications', label: 'Verification Queue', icon: FileCheck },
          { to: '/hospital/patients', label: 'Patient Medical Records', icon: Stethoscope },
          { to: '/hospital/post-update', label: 'Post Clinical Update', icon: Activity }
        ];

      case 'ngo':
        return [
          { to: '/ngo/dashboard', label: 'NGO Relief Hub', icon: LayoutDashboard },
          { to: '/ngo/allocations', label: 'Fund Allocations', icon: DollarSign },
          { to: '/ngo/transfers', label: 'Case Transfers', icon: ArrowRightLeft },
          { to: '/ngo/reports', label: 'Financial Reports', icon: FileText }
        ];

      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Patient Campaigns', icon: ShieldCheck },
          { to: '/admin/users', label: 'User Directory', icon: Users },
          { to: '/admin/organizations', label: 'Hospitals & NGOs', icon: Building2 }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'patient': return { label: 'Patient Account', bg: 'bg-primary' };
      case 'donor': return { label: 'Active Donor', bg: 'bg-success' };
      case 'hospital': return { label: 'Accredited Hospital', bg: 'bg-info text-dark' };
      case 'ngo': return { label: 'Verified NGO Partner', bg: 'bg-warning text-dark' };
      case 'admin': return { label: 'System SuperAdmin', bg: 'bg-danger' };
      default: return { label: 'User', bg: 'bg-secondary' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      
      {/* Top Mobile Bar for Sidebar Toggle */}
      <div className="d-lg-none bg-white border-bottom px-3 py-2 d-flex justify-content-between align-items-center">
        <button 
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          <span>Dashboard Menu</span>
        </button>
        <span className={`badge ${roleBadge.bg} rounded-pill`}>{roleBadge.label}</span>
      </div>

      <div className="d-flex flex-grow-1">
        
        {/* Sidebar */}
        <aside className={`mfms-sidebar py-3 ${sidebarOpen ? 'd-flex position-fixed z-3 shadow bg-white h-100' : 'd-none d-lg-flex'}`}>
          <div className="px-3 pb-3 mb-2 border-bottom">
            <div className="d-flex align-items-center gap-2 mb-2">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user?.fullName} 
                  className="rounded-circle border"
                  style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-mfms-blue text-white d-flex align-items-center justify-content-center fw-bold shadow-xs shrink-0"
                  style={{ width: '42px', height: '42px', fontSize: '1.1rem' }}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="overflow-hidden">
                <div className="fw-bold text-truncate small">{user?.fullName}</div>
                <span className={`badge ${roleBadge.bg} rounded-pill`} style={{ fontSize: '0.65rem' }}>
                  {roleBadge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow-1 d-flex flex-column gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to.endsWith('dashboard')}
                  className={({ isActive }) => `mfms-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Sign Out Button in Sidebar */}
          <div className="p-3 border-top mt-auto">
            <button 
              onClick={logout} 
              className="btn btn-outline-danger w-100 btn-sm d-flex align-items-center justify-content-center gap-2"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Dashboard Content Container */}
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
