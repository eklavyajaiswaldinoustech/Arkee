import React, { useState, useRef, useEffect, useCallback } from 'react';

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const DevicePhoneMobileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
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

const ExclamationTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const OTP_LENGTH = 6;
const OTP_TIMEOUT = 120; // 2 minutes

const StepVerification = ({ formData, bankDetails, onNext, onBack, isVerifying, isVerified, verificationError, onVerify }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(OTP_TIMEOUT);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (!otpSent || timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const sendOtp = useCallback(async () => {
    // First verify bank account
    if (!isVerified) {
      await onVerify();
    }

    /*
     * TODO: Backend API call to send OTP
     * POST /api/bank/send-otp
     * Body: { accountNumber: encrypted, ifsc: encrypted, phone: userPhone }
     * Response: { success: true, message: 'OTP sent to ●●●●●●7890' }
     */
    setOtpSent(true);
    setTimer(OTP_TIMEOUT);
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [isVerified, onVerify]);

  const handleOtpChange = useCallback((index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleOtpKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleOtpPaste = useCallback((e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasteData.length === OTP_LENGTH) {
      setOtp(pasteData.split(''));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  }, []);

  const verifyOtp = useCallback(async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== OTP_LENGTH) {
      setOtpError('Please enter complete OTP');
      return;
    }

    setVerifyingOtp(true);

    /*
     * TODO: Backend API call to verify OTP
     * POST /api/bank/verify-otp
     * Body: { otp: encrypted, verificationId: bankDetails._securityMeta.verificationId }
     * Response: { verified: true }
     */

    // Simulate verification
    await new Promise(r => setTimeout(r, 1500));

    // Simulated: accept any 6-digit OTP for demo
    if (otpValue.length === OTP_LENGTH) {
      setOtpVerified(true);
      setVerifyingOtp(false);
    } else {
      setOtpError('Invalid OTP. Please try again.');
      setVerifyingOtp(false);
    }
  }, [otp]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const otpFilled = otp.every(d => d !== '');
  const canProceed = otpVerified && isVerified;

  return (
    <div className="bd-step-card">
      <div className="bd-step-header">
        <div className="bd-step-header-icon"><ShieldCheckIcon /></div>
        <div className="bd-step-header-text">
          <h2>Verify Your Account</h2>
          <p>We'll verify your bank account and send an OTP</p>
        </div>
      </div>

      <div className="bd-step-body" style={{ textAlign: 'center' }}>

        {verificationError && (
          <div className="bd-alert error">
            <ExclamationTriangleIcon />
            <span>{verificationError}</span>
          </div>
        )}

        {/* Bank verification status */}
        {!isVerified && !isVerifying && (
          <div style={{ padding: '20px 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(244,163,187,0.1), rgba(212,175,55,0.08))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <ShieldCheckIcon />
            </div>
            <p style={{ fontSize: '14px', color: 'var(--bd-text-secondary)', marginBottom: '20px' }}>
              Click below to verify your bank account and receive OTP
            </p>
            <button type="button" className="bd-btn-verify" onClick={sendOtp}>
              <ShieldCheckIcon />
              <span>Send Verification OTP</span>
            </button>
          </div>
        )}

        {isVerifying && (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <div className="bd-spinner rose" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderWidth: '3px' }} />
            <p style={{ fontSize: '14px', color: 'var(--bd-text-secondary)' }}>Verifying with bank...</p>
          </div>
        )}

        {/* Bank verified + OTP section */}
        {isVerified && bankDetails && (
          <>
            {/* Verified badge */}
            <div className="bd-alert success" style={{ textAlign: 'left' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d4af37" style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              <div>
                <strong>{bankDetails.bankName}</strong> — Account verified
                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
                  {bankDetails.branchName} · {bankDetails.bankType}
                </div>
              </div>
            </div>

            {!otpSent && (
              <div style={{ padding: '16px 0' }}>
                <button type="button" className="bd-btn-verify" onClick={sendOtp}>
                  <DevicePhoneMobileIcon />
                  <span>Send OTP to Registered Mobile</span>
                </button>
              </div>
            )}

            {/* OTP Input */}
            {otpSent && !otpVerified && (
              <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(244,163,187,0.1), rgba(212,175,55,0.08))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <DevicePhoneMobileIcon />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--bd-text-secondary)', marginBottom: '4px' }}>
                  Enter the 6-digit OTP sent to your registered mobile
                </p>
                <p style={{ fontSize: '11px', color: 'var(--bd-text-muted)', marginBottom: '24px' }}>
                  OTP sent to ●●●●●●7890
                </p>

                <div className="bd-otp-container" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`bd-otp-input ${digit ? 'filled' : ''} ${otpError ? 'error' : ''}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>

                {otpError && (
                  <div className="bd-hint error" style={{ justifyContent: 'center', marginBottom: '16px' }}>
                    <ExclamationTriangleIcon />
                    <span>{otpError}</span>
                  </div>
                )}

                {/* Timer */}
                <div className="bd-otp-timer">
                  <div style={{ fontSize: '14px', fontWeight: '600', color: timer > 0 ? 'var(--bd-text)' : 'var(--bd-text-muted)' }}>
                    {timer > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'Expired'}
                  </div>
                  <div className="bd-otp-resend">
                    {timer <= 0 ? (
                      <button type="button" onClick={sendOtp}>Resend OTP</button>
                    ) : (
                      <span>Resend in {minutes}:{seconds.toString().padStart(2, '0')}</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="bd-btn-verify"
                  disabled={!otpFilled || verifyingOtp}
                  onClick={verifyOtp}
                  style={{ marginTop: '8px' }}
                >
                  {verifyingOtp ? (
                    <><div className="bd-spinner" style={{ width: '18px', height: '18px' }} /><span>Verifying...</span></>
                  ) : (
                    <><ShieldCheckIcon /><span>Verify OTP</span></>
                  )}
                </button>
              </div>
            )}

            {/* OTP Verified */}
            {otpVerified && (
              <div style={{ padding: '20px 0', animation: 'scaleIn 0.5s ease-out' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(244,163,187,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', animation: 'glow-breathe 3s ease-in-out infinite'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d4af37" style={{ width: '36px', height: '36px' }}>
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--bd-text)', marginBottom: '4px' }}>
                  Verification Complete
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--bd-text-muted)' }}>
                  Your bank account has been successfully verified
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bd-step-actions">
        <button type="button" className="bd-btn-secondary" onClick={onBack}>
          <ArrowLeftIcon /><span>Back</span>
        </button>
        <button type="button" className="bd-btn-primary" disabled={!canProceed} onClick={onNext}>
          <span>Review Details</span><ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default StepVerification;