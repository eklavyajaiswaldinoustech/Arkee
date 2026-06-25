import React from 'react';

const DocumentCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
  </svg>
);

const BanknotesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

const BuildingLibraryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const HashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const LockClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const maskAccount = (num) => {
  if (!num || num.length < 4) return '••••';
  return '•••• •••• ' + num.slice(-4);
};

const StepReview = ({ formData, bankDetails, consentGiven, setConsentGiven, consentError, isSubmitting, onSubmit, onBack }) => {
  const reviewItems = [
    { icon: <BanknotesIcon />, label: 'Account Type', value: formData.accountType.charAt(0).toUpperCase() + formData.accountType.slice(1), bg: 'rgba(244,163,187,0.06)' },
    { icon: <HashIcon />, label: 'Account Number', value: maskAccount(formData.accountNumber), bg: 'rgba(212,175,55,0.06)', masked: true },
    { icon: <BuildingLibraryIcon />, label: 'Bank', value: formData.bankName || '—', bg: 'rgba(244,163,187,0.06)' },
    { icon: <BuildingLibraryIcon />, label: 'IFSC Code', value: formData.ifscCode, bg: 'rgba(212,175,55,0.06)' },
    { icon: <UserIcon />, label: 'Account Holder', value: formData.holderName.toUpperCase() || '—', bg: 'rgba(244,163,187,0.06)' },
    { icon: <ShieldCheckIcon />, label: 'Status', value: 'Verified', bg: 'rgba(212,175,55,0.06)' }
  ];

  return (
    <div className="bd-step-card">
      <div className="bd-step-header">
        <div className="bd-step-header-icon"><DocumentCheckIcon /></div>
        <div className="bd-step-header-text">
          <h2>Review & Confirm</h2>
          <p>Please review your bank details before saving</p>
        </div>
      </div>

      <div className="bd-step-body">
        {/* Bank Card Preview */}
        {bankDetails && (
          <div style={{
            padding: '20px', borderRadius: '16px',
            background: bankDetails.bankGradient || 'linear-gradient(135deg, #1a0a1e, #2d1020)',
            color: '#fff', marginBottom: '24px', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
              <div>
                <span style={{ fontSize: '20px' }}>{bankDetails.bankLogo}</span>
                <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px', opacity: 0.9 }}>{bankDetails.bankName}</div>
              </div>
              <div style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {formData.accountType}
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', letterSpacing: '3px', fontFamily: '"Courier New", monospace', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
              {maskAccount(formData.accountNumber)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5 }}>Holder</div>
                <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '2px', textTransform: 'uppercase' }}>{formData.holderName || '—'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5 }}>IFSC</div>
                <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '2px', fontFamily: '"Courier New", monospace' }}>{formData.ifscCode}</div>
              </div>
            </div>
          </div>
        )}

        {/* Review Items */}
        <div className="bd-review-grid">
          {reviewItems.map((item, idx) => (
            <div key={idx} className="bd-review-item" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="bd-review-item-icon" style={{ background: item.bg }}>
                {item.icon}
              </div>
              <div>
                <div className="bd-review-item-label">{item.label}</div>
                <div className={`bd-review-item-value ${item.masked ? 'masked' : ''}`}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Consent */}
        <div style={{ marginTop: '24px' }}>
          <div
            className={`bd-consent ${consentGiven ? 'checked' : ''} ${consentError ? 'error' : ''}`}
            onClick={() => setConsentGiven(!consentGiven)}
          >
            <div className="bd-consent-check">
              <CheckIcon />
            </div>
            <div className="bd-consent-text">
              <strong style={{ color: 'var(--bd-text)' }}>I confirm</strong> that the bank details provided
              are accurate. My data will be <strong style={{ color: 'var(--bd-rose-deep)' }}>encrypted with AES-256</strong> and
              only accessible by authorized administrators.
            </div>
          </div>
          {consentError && <div className="bd-hint error" style={{ marginTop: '-12px', marginBottom: '8px' }}>Please agree to continue</div>}
        </div>
      </div>

      <div className="bd-step-actions">
        <button type="button" className="bd-btn-secondary" onClick={onBack}>
          <ArrowLeftIcon /><span>Back</span>
        </button>
        <button
          type="button"
          className="bd-btn-primary"
          disabled={isSubmitting || !consentGiven}
          onClick={onSubmit}
          style={{ minWidth: '200px' }}
        >
          {isSubmitting ? (
            <><div className="bd-spinner" /><span>Encrypting & Saving...</span></>
          ) : (
            <><LockClosedIcon /><span>Save Securely</span></>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepReview;