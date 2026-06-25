import React, { useState, useEffect } from 'react';

const SecurityShield = ({ level = 'high' }) => {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(i);
  }, []);

  const levels = {
    low:     { color: '#e8607a', label: 'Basic',      bars: 1 },
    medium:  { color: '#d4af37', label: 'Moderate',   bars: 2 },
    high:    { color: '#f4a3bb', label: 'Strong',     bars: 3 },
    maximum: { color: '#d4af37', label: 'Bank-Grade', bars: 4 }
  };
  const c = levels[level] || levels.high;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '8px 16px', borderRadius: '20px',
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)',
      transition: 'all 0.4s ease', transform: pulse ? 'scale(1.02)' : 'scale(1)'
    }}>
      <div style={{ position: 'relative' }}>
        <span style={{ fontSize: '18px', filter: 'drop-shadow(0 2px 8px rgba(244,163,187,0.3))' }}>🛡️</span>
        <span style={{
          position: 'absolute', top: '-2px', right: '-5px',
          width: '8px', height: '8px', borderRadius: '50%',
          backgroundColor: c.color,
          boxShadow: `0 0 8px ${c.color}`,
          animation: 'pulseDot 2s infinite'
        }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span style={{
          fontSize: '10px', fontWeight: '700', color: c.color,
          textTransform: 'uppercase', letterSpacing: '0.8px', lineHeight: 1
        }}>{c.label}</span>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{
              width: '14px', height: '3px', borderRadius: '2px',
              background: i <= c.bars
                ? 'linear-gradient(90deg, #f4a3bb, #d4af37)'
                : 'rgba(255,255,255,0.1)',
              transition: 'all 0.4s ease', transitionDelay: `${i*50}ms`
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityShield;