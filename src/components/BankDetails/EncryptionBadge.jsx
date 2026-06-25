import React from 'react';

const EncryptionBadge = () => {
  const badges = [
    { icon: '🔒', label: 'SSL/TLS', desc: '256-bit' },
    { icon: '🛡️', label: 'AES-256', desc: 'Encrypted' },
    { icon: '🔐', label: 'End-to-End', desc: 'Protected' },
    { icon: '✅', label: 'PCI DSS', desc: 'Compliant' },
    { icon: '🏛️', label: 'RBI', desc: 'Guidelines' },
    { icon: '🔍', label: 'Zero', desc: 'Data Logs' }
  ];

  return (
    <div className="bank-encryption-row">
      {badges.map((badge, idx) => (
        <div key={idx} className="bank-encrypt-badge">
          <span className="bank-encrypt-badge-icon">{badge.icon}</span>
          <span className="bank-encrypt-badge-label">{badge.label}</span>
          <span className="bank-encrypt-badge-desc">{badge.desc}</span>
        </div>
      ))}
    </div>
  );
};

export default EncryptionBadge;