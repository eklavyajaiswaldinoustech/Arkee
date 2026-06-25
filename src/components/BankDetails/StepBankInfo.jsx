import React from 'react';

const BuildingLibraryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d4af37">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const StepBankInfo = ({
  formData, formErrors, onInputChange, onNext, onBack,
  autoDetectedBank
}) => {
  const ifscValid = formData.ifscCode.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode);
  const holderValid = formData.holderName.trim().length >= 2;
  const canProceed = ifscValid && holderValid;

  return (
    <div className="bd-step-card">
      <div className="bd-step-header">
        <div className="bd-step-header-icon"><BuildingLibraryIcon /></div>
        <div className="bd-step-header-text">
          <h2>Bank & Holder Details</h2>
          <p>Enter your IFSC code, bank will be auto-detected</p>
        </div>
      </div>

      <div className="bd-step-body">
        {/* IFSC & Bank Name */}
        <div className="bd-row">
          <div className="bd-field">
            <label className="bd-label">
              <MapPinIcon />
              <span>IFSC Code</span>
              <span className="bd-label-badge">{formData.ifscCode.length}/11</span>
            </label>
            <div className="bd-input-wrap">
              <span className="bd-input-icon"><BuildingLibraryIcon /></span>
              <input
                type="text"
                className={`bd-input ${formErrors.ifscCode ? 'error' : ''} ${ifscValid ? 'verified' : ''}`}
                value={formData.ifscCode}
                onChange={(e) => onInputChange('ifscCode', e.target.value)}
                placeholder="SBIN0001234"
                autoComplete="off"
                maxLength={11}
                style={{ textTransform: 'uppercase', letterSpacing: '2px', fontFamily: '"Courier New", monospace' }}
              />
              {ifscValid && <span className="bd-input-status"><CheckCircleIcon /></span>}
            </div>
            {formErrors.ifscCode && <div className="bd-hint error">{formErrors.ifscCode}</div>}
          </div>

          <div className="bd-field">
            <label className="bd-label">
              <BuildingLibraryIcon />
              <span>Bank Name</span>
              {autoDetectedBank && <span className="bd-label-badge">Auto-detected</span>}
            </label>
            <div className="bd-input-wrap">
              <span className="bd-input-icon"><BuildingLibraryIcon /></span>
              <input
                type="text"
                className="bd-input"
                value={formData.bankName}
                onChange={(e) => onInputChange('bankName', e.target.value)}
                placeholder="Auto-detected from IFSC"
                readOnly={!!autoDetectedBank}
                style={{
                  background: autoDetectedBank ? 'rgba(212,175,55,0.04)' : undefined,
                  cursor: autoDetectedBank ? 'default' : 'text'
                }}
              />
            </div>
          </div>
        </div>

        {/* Bank badge */}
        {autoDetectedBank && (
          <div className="bd-bank-badge" style={{
            background: `${autoDetectedBank.color}08`,
            border: `1px solid ${autoDetectedBank.color}22`,
            color: autoDetectedBank.color
          }}>
            <span style={{ fontSize: '20px' }}>{autoDetectedBank.logo}</span>
            <span style={{ fontWeight: '700' }}>{autoDetectedBank.name}</span>
            <span style={{
              padding: '2px 8px', borderRadius: '8px', fontSize: '10px',
              fontWeight: '700', background: `${autoDetectedBank.color}10`,
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              {autoDetectedBank.type}
            </span>
          </div>
        )}

        {/* Holder Name & Branch */}
        <div className="bd-row">
          <div className="bd-field">
            <label className="bd-label">
              <UserIcon />
              <span>Account Holder Name</span>
              <span className="bd-label-badge" style={{ background: 'rgba(212,175,55,0.06)', color: '#a88a3a' }}>As per bank</span>
            </label>
            <div className="bd-input-wrap">
              <span className="bd-input-icon"><UserIcon /></span>
              <input
                type="text"
                className={`bd-input ${formErrors.holderName ? 'error' : ''}`}
                value={formData.holderName}
                onChange={(e) => onInputChange('holderName', e.target.value)}
                placeholder="Name as per bank records"
                autoComplete="off"
                maxLength={100}
                style={{ textTransform: 'uppercase' }}
              />
              {holderValid && <span className="bd-input-status"><CheckCircleIcon /></span>}
            </div>
            {formErrors.holderName && <div className="bd-hint error">{formErrors.holderName}</div>}
          </div>

          <div className="bd-field">
            <label className="bd-label">
              <MapPinIcon />
              <span>Branch Name</span>
              <span className="bd-label-badge" style={{ background: 'rgba(0,0,0,0.02)', color: '#a89aa8' }}>Optional</span>
            </label>
            <div className="bd-input-wrap">
              <span className="bd-input-icon"><MapPinIcon /></span>
              <input
                type="text"
                className="bd-input"
                value={formData.branchName}
                onChange={(e) => onInputChange('branchName', e.target.value)}
                placeholder="Branch name"
                autoComplete="off"
                maxLength={200}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bd-step-actions">
        <button type="button" className="bd-btn-secondary" onClick={onBack}>
          <ArrowLeftIcon /><span>Back</span>
        </button>
        <button type="button" className="bd-btn-primary" disabled={!canProceed} onClick={onNext}>
          <span>Verify Account</span><ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default StepBankInfo;