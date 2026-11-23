# 🏥 MediFund / HealFund — Medical Funding Management System (MFMS)
> *Together for Better Health*

A complete, production-ready, clinical-grade **MERN (MongoDB, Express.js, React, Node.js)** full-stack web application for verified healthcare crowdfunding, hospital audit oversight, humanitarian NGO fund allocations, and donor philanthropy.

---

## 🌟 Key Highlights & Architecture

- **100% Hospital Verification Ecosystem**: Every campaign requires hospital admission documentation, signed clinical summaries by licensed physicians, and diagnostic scans before public listing.
- **Direct Hospital Bill Disbursements**: Donated funds are deposited into medical escrow and disbursed directly to treating hospital billing departments to prevent misuse.
- **Multi-Stakeholder Architecture with 5 Role-Specific Dashboards**:
  1. 🏥 **Patient Dashboard**: Multi-step campaign creation wizard, medical report uploads, verification status tracking, treatment milestone logs, funding overview cards.
  2. ❤️ **Donor Dashboard**: Philanthropy tracker, giving ledger, instant 80G / 501(c)(3) tax receipts, refund requests, saved campaigns.
  3. 🩺 **Hospital Dashboard**: Verification queue for incoming patient claims, clinical document review, doctor surgery estimates, treatment & recovery updates publishing.
  4. 🤝 **NGO Dashboard**: Humanitarian fund pool management, direct hospital bill settlements, inter-NGO case shortfall transfers, certified financial statements.
  5. 🛡️ **Admin Dashboard**: System governance, user directory (activate/deactivate), campaign approvals, hospital & NGO accreditation, refund oversight, system audit logs, and analytics with interactive Recharts.
- **Interactive Simulated Payment Sandbox**: Real-time order generation, simulated card/UPI/netbanking verification, instant database updates, and printable tax-deductible receipts.
- **1-Click Demo Role Switcher**: Instant evaluation of all 5 stakeholder roles without manual registration.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Bootstrap 5, Custom CSS Design System, Lucide React Icons, Recharts, React Hot Toast, Axios |
| **Backend** | Node.js, Express.js, Mongoose ODM, JWT Authentication, bcryptjs, Multer for file uploads, Helmet, CORS, Morgan, Express Rate Limit |
| **Database** | MongoDB Atlas / Local MongoDB (Collections: Users, Patients, Hospitals, NGOs, Campaigns, Donations, TreatmentUpdates, FundAllocations, CaseTransfers, RefundRequests, Notifications, AuditLogs) |
| **Deployment** | Vercel (Frontend with `vercel.json`), Render (Backend with `render.yaml`), MongoDB Atlas |

---

## 🔐 Demo Credentials (Password for all: `password123`)

| Role | Demo Email | Password | Primary Purpose |
|---|---|---|---|
| 🛡️ **SuperAdmin** | `admin@medifund.org` | `password123` | Complete system governance, audit trail, campaign & refund approvals |
| 🩺 **Hospital** | `hospital@medifund.org` | `password123` | Audit patient claims, provide surgery estimates, post recovery stages |
| 🤝 **NGO** | `ngo@medifund.org` | `password123` | Manage fund pool, settle hospital invoices, transfer shortfall cases |
| 🏥 **Patient** | `patient@medifund.org` | `password123` | Submit medical cases via wizard, track funding & hospital clearance |
| ❤️ **Donor** | `donor@medifund.org` | `password123` | Browse campaigns, donate via sandbox, download official 80G tax receipts |

*Note: You can also use the **"Demo Login"** button on the top navbar or login page to switch between roles with a single click.*

---

## 🚀 Quick Start Guide (Local Development)

### Prerequisites
- **Node.js** (v18+ or v20+)
- **MongoDB** running locally on port 27017 or a **MongoDB Atlas URI**

### 1. Configure Backend Environment
Navigate to the `server/` directory and check `.env`:
```bash
cd server
```
The `.env` file is pre-configured for local development:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/medifund
JWT_SECRET=medifund_super_secret_jwt_key_2026_secure
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 2. Seed Database with Realistic Data
Run the comprehensive database seeder to populate realistic patient records, hospital audits, campaigns, donations, and demo accounts:
```bash
npm run seed
```

### 3. Start Backend Server
```bash
npm start
```
The backend server runs on `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`).

### 4. Start Frontend Client
In a new terminal window:
```bash
cd client
npm run dev
```
Open your browser and visit **`http://localhost:5173`**.

---

## 📡 Backend API Reference Summary

### Authentication (`/api/auth`)
- `POST /register`: Register user with role (patient, donor, hospital, ngo)
- `POST /login`: JWT authentication
- `POST /demo-login`: 1-click login as demo role
- `GET /me`: Authenticated user profile and role details
- `PUT /profile`: Update profile information

### Campaigns (`/api/campaigns`)
- `GET /`: Browse campaigns with filters (category, urgency, search, sort, pagination)
- `GET /featured`: Homepage featured urgent campaigns
- `GET /:id`: Detailed campaign data with hospital and NGO references
- `POST /`: Multi-step patient campaign creation
- `PUT /:id/hospital-review`: Hospital approves/rejects/updates surgical cost estimate
- `PUT /:id/status`: Admin approval/suspension

### Donations (`/api/donations`)
- `POST /create-order`: Create payment order intent
- `POST /verify-payment`: Verify transaction, update campaign totals, issue receipt
- `GET /my-donations`: Donor's giving history
- `GET /receipt/:id`: Official 80G / 501(c)(3) tax receipt details
- `POST /refund-request`: Submit donation refund request

### Treatment Updates (`/api/treatment`)
- `GET /:id/updates`: Clinical timeline of procedure and recovery milestones
- `POST /:id/updates`: Publish milestone (Surgery, ICU, Recovery, Discharge)

### Hospital Portal (`/api/hospitals`)
- `GET /dashboard`: Verification queue count, admitted patients, surgical estimates
- `POST /verifications/:campaignId`: Audit and certify incoming cases
- `GET /patients`: Admitted patient medical roster

### NGO Relief Portal (`/api/ngos`)
- `GET /directory`: Public directory of accredited NGOs
- `GET /dashboard`: Fund pool metrics, liquid balance, allocations
- `POST /allocations`: Direct wire payment to hospital billing department
- `POST /transfer-case`: Inter-NGO shortfall case transfer

### Admin Command (`/api/admin`)
- `GET /dashboard`: System metrics and chart data
- `GET /users` & `PUT /users/:id/toggle-status`: User management
- `GET /refunds` & `PUT /refunds/:id`: Manage donation refund inquiries
- `GET /audit-logs`: Immutable system audit trail
- `GET /organizations` & `PUT /organizations/:type/:id`: Organization accreditation

---

## 📦 Production Deployment

### Frontend (Vercel)
1. Push project to GitHub.
2. In Vercel, set Root Directory to `client`.
3. Set Build Command to `npm run build` and Output Directory to `dist`.
4. `client/vercel.json` ensures client-side routing.

### Backend (Render)
1. In Render, select Web Service with Root Directory `server`.
2. Set Build Command to `npm install` and Start Command to `npm start`.
3. Set environment variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`).
4. Pre-configured `server/render.yaml` is provided for automatic infrastructure.

---

© 2026 MediFund / HealFund. Together for Better Health.
