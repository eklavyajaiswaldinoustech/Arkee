import React, { useState } from 'react';
import { maskAccountNumber } from '../../utils/encryption';

const BankCardPreview = ({ bankDetails, accountNumber, holderName, accountType }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  // ✅ REMOVED: const [showFull, setShowFull] = useState(false); — was never used

  if (!bankDetails) return null;

  return (
    <div
      style={{
        perspective: '1000px',
        width: '100%',
        maxWidth: '420px',
        height: '240px',
        margin: '20px auto',
        cursor: 'pointer'
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
      }}>
        {/* Front of Card */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          borderRadius: '20px',
          background: bankDetails.bankGradient || 'linear-gradient(135deg, #1a1a2e, #16213e)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          color: '#ffffff'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)
            `,
            pointerEvents: 'none'
          }} />

          {/* Top Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
            <div>
              <span style={{ fontSize: '28px' }}>{bankDetails.bankLogo}</span>
              <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '4px', letterSpacing: '0.5px' }}>
                {bankDetails.bankName}
              </div>
            </div>
            <div style={{
              padding: '4px 12px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {accountType || 'Savings'}
            </div>
          </div>

          {/* Chip */}
          <div style={{ zIndex: 1 }}>
            <div style={{
              width: '48px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ffd700, #daa520)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '30px',
                height: '22px',
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #ffecb3, #ffd54f)'
              }} />
            </div>
            {/* ✅ Always use maskAccountNumber - removed showFull toggle */}
            <div style={{
              fontSize: '20px',
              fontWeight: '500',
              letterSpacing: '3px',
              fontFamily: '"Courier New", monospace'
            }}>
              {maskAccountNumber(accountNumber)}
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
            <div>
              <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '2px' }}>
                Account Holder
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {holderName || '●●●●●● ●●●●●'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '2px' }}>
                Type
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600' }}>
                {bankDetails.bankType}
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '20px',
          background: bankDetails.bankGradient || 'linear-gradient(135deg, #16213e, #1a1a2e)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          color: '#ffffff'
        }}>
          {/* Magnetic Strip */}
          <div style={{
            position: 'absolute',
            top: '30px',
            left: 0,
            right: 0,
            height: '40px',
            background: 'rgba(0,0,0,0.6)'
          }} />

          <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>🏦 Branch</span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{bankDetails.branchName || '●●●●●'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>📍 City</span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{bankDetails.city || '●●●●●'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>🔐 MICR</span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{bankDetails.micr || '●●●●●●●●●'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>✅ Status</span>
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#4caf50'
              }}>
                Verified
              </span>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: '10px',
            opacity: 0.5,
            marginTop: '8px'
          }}>
            🔒 Tap to flip • Data encrypted with AES-256
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankCardPreview;