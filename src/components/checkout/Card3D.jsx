// src/components/checkout/Card3D.jsx
import React, { useState, useRef } from 'react';
import { maskCardNumber, detectCardType } from '../../utils/encryption';

const CARD_GRADIENTS = {
  visa: 'from-blue-600 via-blue-700 to-indigo-800',
  mastercard: 'from-red-500 via-orange-500 to-yellow-500',
  amex: 'from-gray-600 via-gray-700 to-gray-900',
  rupay: 'from-emerald-500 via-teal-600 to-cyan-700',
  maestro: 'from-blue-400 via-red-500 to-blue-600',
  unknown: 'from-gray-700 via-gray-800 to-gray-900',
};

const CARD_LOGOS = {
  visa: (
    <svg viewBox="0 0 48 32" className="w-16 h-10">
      <rect width="48" height="32" rx="4" fill="white" fillOpacity="0.2" />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="bold"
        fontStyle="italic"
      >
        VISA
      </text>
    </svg>
  ),
  mastercard: (
    <svg viewBox="0 0 48 32" className="w-16 h-10">
      <circle cx="18" cy="16" r="10" fill="#EB001B" fillOpacity="0.8" />
      <circle cx="30" cy="16" r="10" fill="#F79E1B" fillOpacity="0.8" />
    </svg>
  ),
  rupay: (
    <svg viewBox="0 0 60 32" className="w-16 h-10">
      <rect width="60" height="32" rx="4" fill="white" fillOpacity="0.2" />
      <text
        x="30"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        RuPay
      </text>
    </svg>
  ),
  amex: (
    <svg viewBox="0 0 48 32" className="w-16 h-10">
      <rect width="48" height="32" rx="4" fill="white" fillOpacity="0.2" />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        AMEX
      </text>
    </svg>
  ),
  unknown: (
    <svg viewBox="0 0 48 32" className="w-16 h-10">
      <rect width="48" height="32" rx="4" fill="white" fillOpacity="0.15" />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        CARD
      </text>
    </svg>
  ),
  maestro: (
    <svg viewBox="0 0 48 32" className="w-16 h-10">
      <circle cx="18" cy="16" r="10" fill="#0099DF" fillOpacity="0.8" />
      <circle cx="30" cy="16" r="10" fill="#ED0006" fillOpacity="0.8" />
    </svg>
  ),
};

const Card3D = ({ cardData = {}, isFlipped = false, onFlipToggle }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const cardType = detectCardType(cardData.number || '');
  const gradient = CARD_GRADIENTS[cardType];
  const logo = CARD_LOGOS[cardType];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -10;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 10;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const displayNumber = cardData.number
    ? maskCardNumber(cardData.number)
    : '•••• •••• •••• ••••';
  const displayName = cardData.name || 'YOUR NAME';
  const displayExpiry = cardData.expiry || 'MM/YY';

  return (
    <div
      className="w-full max-w-sm mx-auto"
      style={{ perspective: '1200px' }}
    >
      <div
        ref={cardRef}
        className="relative w-full cursor-pointer"
        style={{
          aspectRatio: '1.586/1',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: `
            rotateX(${isFlipped ? 0 : rotation.x}deg) 
            rotateY(${isFlipped ? 180 : rotation.y}deg)
            ${isHovering ? 'translateZ(20px)' : 'translateZ(0)'}
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onFlipToggle}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} p-6 flex flex-col justify-between text-white overflow-hidden shadow-2xl`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Holographic overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                linear-gradient(
                  ${45 + rotation.y * 2}deg,
                  transparent 20%,
                  rgba(255,255,255,0.3) 30%,
                  transparent 40%,
                  rgba(255,255,255,0.2) 60%,
                  transparent 70%
                )
              `,
            }}
          />

          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-12 w-40 h-40 rounded-full bg-white/5" />

          {/* Top row */}
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2">
              {/* Chip */}
              <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300/80 to-yellow-600/80 border border-yellow-400/30 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-px w-6 h-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-yellow-800/30 rounded-sm"
                    />
                  ))}
                </div>
              </div>
              {/* Contactless icon */}
              <svg
                className="w-6 h-6 opacity-60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8.5 16.5a5 5 0 010-9" />
                <path d="M12 19a8 8 0 010-14" />
                <path d="M15.5 21.5a11 11 0 010-19" />
              </svg>
            </div>
            {logo}
          </div>

          {/* Card Number */}
          <div className="relative z-10">
            <p
              className="text-xl sm:text-2xl tracking-[0.2em] font-mono"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              {displayNumber}
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-60 mb-0.5">
                Card Holder
              </p>
              <p className="text-sm font-semibold tracking-wider uppercase">
                {displayName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest opacity-60 mb-0.5">
                Expires
              </p>
              <p className="text-sm font-semibold tracking-wider">
                {displayExpiry}
              </p>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} overflow-hidden shadow-2xl`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Magnetic strip */}
          <div className="w-full h-12 bg-gray-900/70 mt-6" />

          {/* CVV area */}
          <div className="px-6 mt-4">
            <div className="bg-white/90 rounded-md px-4 py-2 flex items-center justify-end">
              <p className="text-gray-800 font-mono text-lg tracking-widest">
                {cardData.cvv
                  ? '•'.repeat(cardData.cvv.length)
                  : '•••'}
              </p>
            </div>
            <p className="text-right text-[10px] text-white/60 mt-1 tracking-wider uppercase">
              CVV / CVC
            </p>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-white/40 max-w-[200px] leading-tight">
                This card is property of Arkee Jewellery. Encrypted and
                secured with 256-bit SSL.
              </p>
              <svg
                className="w-8 h-8 text-white/30"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-3 animate-pulse">
        {isFlipped ? 'Click to see front' : 'Click to see back'}
      </p>
    </div>
  );
};

export default Card3D;