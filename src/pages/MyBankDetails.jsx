import React, { useState, useEffect, useCallback, useMemo } from 'react';
import StepProgress from '../components/BankDetails/StepProgress';
import StepAccountType from '../components/BankDetails/StepAccountType';
import StepAccountNumber from '../components/BankDetails/StepAccountNumber';
import StepBankInfo from '../components/BankDetails/StepBankInfo';
import StepVerification from '../components/BankDetails/StepVerification';
import StepReview from '../components/BankDetails/StepReview';
import useBankVerification from '../hooks/useBankVerification';
import { encryptData, generateSessionToken } from '../utils/encryption';
import '../styles/bankDetails.css';

// ── Inline SVGs ──
const BankIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
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

const CheckCircleSolid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d4af37" style={{ width: '48px', height: '48px' }}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const SparkleField = ({ count = 5 }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bd-sparkle" style={{
        left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`,
        animationDelay: `${Math.random() * 3}s`, animationDuration: `${2 + Math.random() * 3}s`,
      }} />
    ))}
  </div>
);

const FloatingPetals = ({ count = 3 }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bd-petal" style={{
        left: `${Math.random() * 100}%`, width: `${8 + Math.random() * 8}px`, height: `${8 + Math.random() * 8}px`,
        opacity: 0.15 + Math.random() * 0.15, animationDelay: `${Math.random() * 8}s`, animationDuration: `${9 + Math.random() * 6}s`,
      }} />
    ))}
  </div>
);

const MyBankDetails = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    accountNumber: '', confirmAccountNumber: '', ifscCode: '',
    accountType: 'savings', holderName: '', branchName: '', bankName: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showAccount, setShowAccount] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [autoDetectedBank, setAutoDetectedBank] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sessionToken] = useState(() => generateSessionToken());
  const [pageLoadTime] = useState(Date.now());

  const {
    isVerifying, isVerified, bankDetails, error: verificationError,
    verifyAccount, resetVerification, getBankFromIFSC
  } = useBankVerification();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  // Auto-scroll to top when step changes
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentStep]);

  const preventCopyPaste = useCallback((e) => { e.preventDefault(); }, []);

  const handleInputChange = useCallback((field, value) => {
    let v = value;
    switch (field) {
      case 'accountNumber': case 'confirmAccountNumber': v = value.replace(/\D/g, '').slice(0, 18); break;
      case 'ifscCode': v = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 11); break;
      case 'holderName': v = value.replace(/[^A-Za-z\s.]/g, '').slice(0, 100); break;
      default: v = value.slice(0, 200);
    }
    setFormData(prev => ({ ...prev, [field]: v }));
    setFormErrors(prev => ({ ...prev, [field]: null }));

    if (field === 'ifscCode' && v.length >= 4) {
      const bank = getBankFromIFSC(v);
      setAutoDetectedBank(bank);
      if (bank) setFormData(prev => ({ ...prev, bankName: bank.name }));
    } else if (field === 'ifscCode' && v.length < 4) {
      setAutoDetectedBank(null);
    }
  }, [getBankFromIFSC]);

  useEffect(() => {
    if (bankDetails && isVerified) {
      setFormData(prev => ({ ...prev, bankName: bankDetails.bankName, branchName: bankDetails.branchName || prev.branchName }));
    }
  }, [bankDetails, isVerified]);

  const handleVerify = useCallback(async () => {
    resetVerification();
    await verifyAccount(formData.accountNumber, formData.ifscCode);
  }, [formData.accountNumber, formData.ifscCode, verifyAccount, resetVerification]);

  const handleSubmit = useCallback(async () => {
    if (!consentGiven) { setConsentError(true); return; }
    setConsentError(false);
    setIsSubmitting(true);

    try {
      const payload = {
        accountNumber: await encryptData(formData.accountNumber),
        ifscCode: await encryptData(formData.ifscCode),
        accountType: formData.accountType,
        holderName: await encryptData(formData.holderName),
        bankName: formData.bankName, branchName: formData.branchName,
        sessionToken, timestamp: Date.now(),
        pageLoadDuration: Date.now() - pageLoadTime,
        verificationId: bankDetails?._securityMeta?.verificationId
      };

      /* TODO: API CALL → POST /api/user/bank-details */
      await new Promise(r => setTimeout(r, 2000));
      console.log('Encrypted payload:', { ...payload, accountNumber: '[ENC]', ifscCode: '[ENC]', holderName: '[ENC]' });

      setIsSubmitting(false);
      setShowSuccess(true);
    } catch (error) {
      setIsSubmitting(false);
      setFormErrors(prev => ({ ...prev, submit: error.message || 'Failed to save.' }));
    }
  }, [formData, consentGiven, sessionToken, pageLoadTime, bankDetails]);

  const completedSteps = useMemo(() => {
    const c = [];
    if (formData.accountType) c.push(1);
    if (formData.accountNumber.length >= 9 && formData.accountNumber === formData.confirmAccountNumber) c.push(2);
    if (formData.ifscCode.length === 11 && formData.holderName.trim().length >= 2) c.push(3);
    if (isVerified) c.push(4);
    return c;
  }, [formData, isVerified]);

  const formProgress = Math.round((completedSteps.length / 5) * 100);

  // ═══ SUCCESS SCREEN ═══
  if (showSuccess) {
    return (
      <div className="bd-success-container">
        <SparkleField count={12} />
        <FloatingPetals count={5} />
        <div className="bd-success-card">
          <div className="bd-success-icon"><CheckCircleSolid /></div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
            <span className="shimmer-rose-text">Details Saved!</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '32px' }}>
            Your bank details have been securely encrypted and saved.
          </p>

          <div className="glass-dark" style={{ padding: '24px', borderRadius: '20px', textAlign: 'left', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <span style={{ fontSize: '24px' }}>{bankDetails?.bankLogo || '🏦'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{formData.bankName}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>•••• •••• {formData.accountNumber.slice(-4)}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['AES-256', 'Verified', 'Encrypted'].map((t, i) => (
                <span key={i} style={{
                  padding: '3px 10px', borderRadius: '8px',
                  background: 'rgba(244,163,187,0.06)', border: '1px solid rgba(244,163,187,0.1)',
                  fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.5)'
                }}>{t}</span>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
            Only authorized administrators can access your bank details.
          </p>

          <button onClick={() => {
            setShowSuccess(false); setCurrentStep(1);
            setFormData({ accountNumber: '', confirmAccountNumber: '', ifscCode: '', accountType: 'savings', holderName: '', branchName: '', bankName: '' });
            resetVerification(); setConsentGiven(false); setAutoDetectedBank(null); setFormErrors({});
          }} className="bd-btn-secondary" style={{
            marginTop: '24px', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)'
          }}>
            <span>Update Bank Details</span>
          </button>
        </div>
      </div>
    );
  }

  // ═══ STEP RENDERER ═══
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepAccountType formData={formData} onInputChange={handleInputChange} onNext={() => setCurrentStep(2)} />;
      case 2:
        return <StepAccountNumber formData={formData} formErrors={formErrors} onInputChange={handleInputChange}
          onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} preventCopyPaste={preventCopyPaste}
          showAccount={showAccount} setShowAccount={setShowAccount} showConfirm={showConfirm} setShowConfirm={setShowConfirm} />;
      case 3:
        return <StepBankInfo formData={formData} formErrors={formErrors} onInputChange={handleInputChange}
          onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} autoDetectedBank={autoDetectedBank} />;
      case 4:
        return <StepVerification formData={formData} bankDetails={bankDetails}
          onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)}
          isVerifying={isVerifying} isVerified={isVerified} verificationError={verificationError} onVerify={handleVerify} />;
      case 5:
        return <StepReview formData={formData} bankDetails={bankDetails}
          consentGiven={consentGiven} setConsentGiven={setConsentGiven} consentError={consentError}
          isSubmitting={isSubmitting} onSubmit={handleSubmit} onBack={() => setCurrentStep(4)} />;
      default:
        return null;
    }
  };

  return (
    <div className="bd-container">
      {/* ═══ HERO ═══ */}
      <div className="bd-hero">
        <SparkleField count={6} />
        <FloatingPetals count={3} />

        <div className="bd-hero-inner">
          <div className="bd-hero-icon"><BankIcon /></div>
          <h1 className="bd-hero-title"><span className="shimmer-rose-text">Bank Details</span></h1>
          <p className="bd-hero-subtitle">Secure & Encrypted</p>

          <StepProgress currentStep={currentStep} completedSteps={completedSteps} />

          <div className="bd-hero-progress" style={{ marginTop: '28px' }}>
            <div className="bd-hero-progress-bar">
              <div className="bd-hero-progress-fill" style={{ width: `${formProgress}%` }} />
            </div>
            <div className="bd-hero-progress-label">
              <span>{formProgress}% Complete</span>
              <span>Step {currentStep} of 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ STEP CONTENT ═══ */}
      <div className="bd-main">
        {renderStep()}
      </div>

      {/* ═══ SECURITY FOOTER ═══ */}
      <div className="bd-security-footer">
        <div className="bd-security-badges">
          {[
            { icon: <LockClosedIcon />, text: 'AES-256 Encrypted' },
            { icon: <ShieldCheckIcon />, text: 'PCI DSS Compliant' },
            { icon: <BankIcon />, text: 'RBI Guidelines' },
            { icon: <LockClosedIcon />, text: 'End-to-End Secure' }
          ].map((b, i) => (
            <div key={i} className="bd-sec-badge">
              {b.icon}
              <span>{b.text}</span>
            </div>
          ))}
        </div>
        <div className="bd-footer-text">
          <LockClosedIcon />
          <span>256-bit SSL/TLS · Admin-only access · Auto session timeout</span>
        </div>
      </div>
    </div>
  );
};

export default MyBankDetails;