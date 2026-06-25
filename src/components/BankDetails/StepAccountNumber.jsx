import React from 'react';

const HashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d4af37">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e8607a">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
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

const StepAccountNumber = ({
  formData, formErrors, onInputChange, onNext, onBack, preventCopyPaste,
  showAccount, setShowAccount, showConfirm, setShowConfirm
}) => {
  const accountsMatch = formData.accountNumber.length > 0 &&
    formData.confirmAccountNumber.length > 0 &&
    formData.accountNumber === formData.confirmAccountNumber;

  const accountsMismatch = formData.confirmAccountNumber.length > 0 &&
    formData.accountNumber !== formData.confirmAccountNumber;

  const canProceed = formData.accountNumber.length >= 9 && accountsMatch;

  return (
    <div className="bd-step-card">
      <div className="bd-step-header">
        <div className="bd-step-header-icon"><HashIcon /></div>
        <div className="bd-step-header-text">
          <h2>Account Number</h2>
          <p>Enter and confirm your bank account number</p>
        </div>
      </div>

      <div className="bd-step-body">
        {/* Account Number */}
        <div className="bd-field">
          <label className="bd-label">
            <LockIcon />
            <span>Account Number</span>
            <span className="bd-label-badge">{formData.accountNumber.length}/18</span>
          </label>
          <div className="bd-input-wrap">
            <span className="bd-input-icon"><HashIcon /></span>
            <input
              type={showAccount ? 'text' : 'password'}
              className={`bd-input sensitive-data ${formErrors.accountNumber ? 'error' : ''} ${formData.accountNumber.length >= 9 ? 'verified' : ''}`}
              value={formData.accountNumber}
              onChange={(e) => onInputChange('accountNumber', e.target.value)}
              onCopy={preventCopyPaste}
              onCut={preventCopyPaste}
              placeholder="Enter your account number"
              autoComplete="off"
              data-lpignore="true"
              inputMode="numeric"
              maxLength={18}
            />
            <button
              type="button"
              onClick={() => setShowAccount(!showAccount)}
              className={`bd-input-action ${formData.accountNumber.length >= 9 ? 'shifted' : ''}`}
            >
              {showAccount ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
            {formData.accountNumber.length >= 9 && (
              <span className="bd-input-status"><CheckCircleIcon /></span>
            )}
          </div>
          {formErrors.accountNumber && (
            <div className="bd-hint error"><span>Account number must be at least 9 digits</span></div>
          )}
          <div className="bd-hint">
            <ShieldCheckIcon />
            <span>Encrypted with AES-256 — never stored in plain text</span>
          </div>
        </div>

        {/* Confirm */}
        <div className="bd-field">
          <label className="bd-label">
            <LockIcon />
            <span>Confirm Account Number</span>
          </label>
          <div className="bd-input-wrap">
            <span className="bd-input-icon"><HashIcon /></span>
            <input
              type={showConfirm ? 'text' : 'password'}
              className={`bd-input sensitive-data ${accountsMismatch ? 'error' : ''} ${accountsMatch ? 'verified' : ''}`}
              value={formData.confirmAccountNumber}
              onChange={(e) => onInputChange('confirmAccountNumber', e.target.value)}
              onPaste={preventCopyPaste}
              onCopy={preventCopyPaste}
              onCut={preventCopyPaste}
              placeholder="Re-enter account number"
              autoComplete="off"
              data-lpignore="true"
              inputMode="numeric"
              maxLength={18}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className={`bd-input-action ${accountsMatch || accountsMismatch ? 'shifted' : ''}`}
            >
              {showConfirm ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
            {accountsMatch && <span className="bd-input-status"><CheckCircleIcon /></span>}
            {accountsMismatch && <span className="bd-input-status"><XCircleIcon /></span>}
          </div>
          {accountsMismatch && <div className="bd-hint error">Account numbers do not match</div>}
          {accountsMatch && <div className="bd-hint success">Account numbers match</div>}
        </div>
      </div>

      <div className="bd-step-actions">
        <button type="button" className="bd-btn-secondary" onClick={onBack}>
          <ArrowLeftIcon />
          <span>Back</span>
        </button>
        <button type="button" className="bd-btn-primary" disabled={!canProceed} onClick={onNext}>
          <span>Continue</span>
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default StepAccountNumber;