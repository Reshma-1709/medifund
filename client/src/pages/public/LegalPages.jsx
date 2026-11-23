import React from 'react';

export const TermsPage = () => (
  <div className="py-5 bg-light min-vh-100">
    <div className="container max-w-3xl">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h1 className="fw-bold text-mfms-navy mb-3">Terms & Conditions</h1>
        <p className="text-muted small mb-4">Last Updated: October 2026</p>

        <h5 className="fw-bold text-mfms-navy mt-4 mb-2">1. Platform Nature & Scope</h5>
        <p className="text-secondary small leading-relaxed">
          Medifund operates as a clinical medical crowdfunding intermediary platform facilitating verified connections between patients, accredited healthcare providers, non-governmental charitable organizations, and donors.
        </p>

        <h5 className="fw-bold text-mfms-navy mt-4 mb-2">2. Clinical Document Authenticity</h5>
        <p className="text-secondary small leading-relaxed">
          All campaign organizers warrant that submitted medical reports, diagnosis histories, and cost estimates are accurate and unadulterated. Providing forged or deceptive documents will result in immediate campaign termination and referral to medical regulatory authorities.
        </p>

        <h5 className="fw-bold text-mfms-navy mt-4 mb-2">3. Direct Hospital Fund Disbursements</h5>
        <p className="text-secondary small leading-relaxed">
          Donated funds are disbursed exclusively to treating hospitals upon generation of official medical invoices. MediFund does not transfer surgical funds to unverified personal checking accounts.
        </p>

        <h5 className="fw-bold text-mfms-navy mt-4 mb-2">4. Limitation of Liability</h5>
        <p className="text-secondary small leading-relaxed">
          MediFund does not practice medicine and bears no responsibility for surgical outcomes, physician choices, or hospital treatment protocols.
        </p>
      </div>
    </div>
  </div>
);

export const PrivacyPage = () => (
  <div className="py-5 bg-light min-vh-100">
    <div className="container max-w-3xl">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h1 className="fw-bold text-mfms-navy mb-3">Privacy & Health Data Policy</h1>
        <p className="text-muted small mb-4">HIPAA & GDPR Aligned Health Privacy - Last Updated: October 2026</p>

        <h5 className="fw-bold text-mfms-navy mt-4 mb-2">1. Medical Information Security</h5>
        <p className="text-secondary small leading-relaxed">
          Patient diagnostic records, MRI scans, and pathology reports uploaded to MediFund are stored in 256-bit encrypted private vaults accessible only by licensed hospital reviewers and authorized NGO auditing officers.
        </p>

        <h5 className="fw-bold text-mfms-navy mt-4 mb-2">2. Donor Privacy & Anonymity</h5>
        <p className="text-secondary small leading-relaxed">
          Donors may opt for complete anonymity on public campaign walls. Your payment credentials are never stored on MediFund servers; all payment transactions are tokenized through certified PCI-DSS Level 1 payment gateways.
        </p>

        <h5 className="fw-bold text-mfms-navy mt-4 mb-2">3. Data Sharing Restrictions</h5>
        <p className="text-secondary small leading-relaxed">
          We never sell, rent, or monetize patient or donor data with third-party pharmaceutical or marketing entities.
        </p>
      </div>
    </div>
  </div>
);

export const RefundPolicyPage = () => (
  <div className="py-5 bg-light min-vh-100">
    <div className="container max-w-3xl">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h1 className="fw-bold text-mfms-navy mb-3">Donation Refund Policy</h1>
        <p className="text-muted small mb-4">Transparent Giving Protection - Last Updated: October 2026</p>

        <h5 className="fw-bold text-mfms-navy mt-4 mb-2">1. Refund Eligibility Window</h5>
        <p className="text-secondary small leading-relaxed">
          Donors may request a full refund of their contribution within 7 calendar days of transaction completion, provided that the funds have not yet been disbursed to the hospital operating theatre or medical billing department.
        </p>

        <h5 className="fw-bold text-mfms-navy mt-4 mb-2">2. How to Request a Refund</h5>
        <p className="text-secondary small leading-relaxed">
          Logged-in donors can request refunds directly from the <strong>Donor Dashboard &gt; My Donations</strong> view by clicking the "Request Refund" option next to their transaction. Alternatively, contact <code>refunds@medifund.org</code> with your Receipt Number.
        </p>

        <h5 className="fw-bold text-mfms-navy mt-4 mb-2">3. Processing & Reversal</h5>
        <p className="text-secondary small leading-relaxed">
          Approved refunds are returned to the original payment source (credit card, UPI, bank account) within 3-5 business days. Once a donation is refunded, the corresponding tax-deductible receipt is automatically invalidated.
        </p>
      </div>
    </div>
  </div>
);
