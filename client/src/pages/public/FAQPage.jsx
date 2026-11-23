import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'How does MediFund verify that patient campaigns are authentic?',
    a: 'Every campaign requires hospital admission documentation, signed clinical summaries by licensed physicians, and diagnostic scans. Our medical desk directly confirms bed registration with the hospital’s administration before approving the case for public funding.'
  },
  {
    q: 'Where do donor funds go when a campaign is supported?',
    a: 'Donations are deposited into a protected medical escrow account and disbursed directly to the treating hospital’s verified billing department to cover surgery, anesthesia, ICU hospitalization, and medicines. Funds are never wired to personal unmonitored accounts.'
  },
  {
    q: 'Are donations on MediFund eligible for tax exemptions?',
    a: 'Yes. All donations processed through MediFund qualify for tax deductions under Section 80G (in India) and Section 501(c)(3) (US/International) through our registered NGO trust partners. Digital official tax receipts are generated immediately upon donation completion.'
  },
  {
    q: 'What happens if a campaign does not reach 100% of its funding goal?',
    a: 'MediFund operates an emergency NGO shortfall transfer system. If a critical patient faces an urgent surgical deadline without reaching the full goal, partner NGOs allocate emergency relief funds from their pool or transfer the case to co-sponsors to ensure the procedure goes forward without disruption.'
  },
  {
    q: 'Can a donor request a refund if they made a mistaken contribution?',
    a: 'Yes. We provide a transparent refund request system accessible right within the Donor Dashboard. Donors can request a refund within 7 days of donation as long as the funds have not already been disbursed to the hospital operating theatre.'
  },
  {
    q: 'How can our hospital join the MediFund network?',
    a: 'Accredited healthcare centers (NABH, JCI, or government-registered) can apply through our Hospital Onboarding desk. We provide access to the Hospital Verification Hub within 24 hours of credential review.'
  }
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-mfms-blue fw-bold text-uppercase small tracking-wider">
            Knowledge Center
          </span>
          <h1 className="display-5 fw-bold text-mfms-navy mt-1">Frequently Asked Questions</h1>
          <p className="lead text-muted fs-6">
            Everything you need to know about medical verification, fund safety, tax exemptions, and patient care on MediFund.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto mb-5">
          <div className="d-flex flex-column gap-3">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                  <button
                    type="button"
                    className="card-header bg-white border-0 p-4 text-start d-flex justify-content-between align-items-center w-100"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="fw-bold text-mfms-navy fs-6 pe-3">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={20} className="text-mfms-blue shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-secondary shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="card-body px-4 pb-4 pt-0 text-secondary leading-relaxed border-top pt-3 small">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Banner */}
        <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white max-w-lg mx-auto">
          <HelpCircle size={32} className="text-mfms-blue mx-auto mb-2" />
          <h5 className="fw-bold text-mfms-navy mb-1">Still have questions?</h5>
          <p className="text-muted small mb-3">Our medical care advisors are on standby 24/7 to help you.</p>
          <div>
            <Link to="/contact" className="btn btn-mfms-primary px-4 py-2 small fw-semibold">
              Contact 24/7 Helpdesk
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
