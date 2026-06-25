// src/components/checkout/OrderSuccess.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TruckIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

// ── Custom Canvas Confetti ──────────────────────────────────────────────────
const ConfettiCanvas = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = [
      '#f43f5e',
      '#ec4899',
      '#a855f7',
      '#3b82f6',
      '#fbbf24',
      '#10b981',
      '#f97316',
      '#06b6d4',
    ];

    const pieces = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 12 + 4,
      h: Math.random() * 6 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      opacity: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vy += 0.05; // gravity

        if (frame > 120) {
          p.opacity = Math.max(0, p.opacity - 0.008);
        }

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.opacity = frame > 120 ? 0 : 1;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stop after 5 seconds
    const stopTimer = setTimeout(() => {
      cancelAnimationFrame(animRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(stopTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ position: 'fixed', top: 0, left: 0 }}
    />
  );
};

// ── Animated Check SVG ──────────────────────────────────────────────────────
const AnimatedCheck = () => (
  <svg
    className="w-12 h-12 text-white"
    viewBox="0 0 52 52"
    fill="none"
  >
    <circle
      cx="26"
      cy="26"
      r="25"
      fill="none"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="2"
    />
    <path
      d="M14 27l8 8 16-16"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        strokeDasharray: 48,
        strokeDashoffset: 48,
        animation: 'drawCheck 0.6s ease-out 0.4s forwards',
      }}
    />
  </svg>
);

// ── Order Steps Timeline ────────────────────────────────────────────────────
const ORDER_STEPS = [
  { label: 'Order Confirmed', done: true, icon: '✅' },
  { label: 'Processing', done: true, icon: '⚙️' },
  { label: 'Shipped', done: false, icon: '📦' },
  { label: 'Out for Delivery', done: false, icon: '🚚' },
  { label: 'Delivered', done: false, icon: '🏠' },
];

// ── Main Component ──────────────────────────────────────────────────────────
const OrderSuccess = ({ orderId, email, total }) => {
  const [copied, setCopied] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowTimeline(true), 800);
    return () => clearTimeout(t);
  }, []);

  const copyOrderId = () => {
    navigator.clipboard
      .writeText(orderId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  const estimatedDelivery = new Date(
    Date.now() + 6 * 24 * 60 * 60 * 1000
  ).toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
      {/* Confetti */}
      <ConfettiCanvas />

      {/* Animated CSS */}
      <style>{`
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes successPop {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.1) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .anim-pop {
          animation: successPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .anim-slide-1 { animation: slideUpFade 0.5s ease-out 0.2s both; }
        .anim-slide-2 { animation: slideUpFade 0.5s ease-out 0.35s both; }
        .anim-slide-3 { animation: slideUpFade 0.5s ease-out 0.5s both; }
        .anim-slide-4 { animation: slideUpFade 0.5s ease-out 0.65s both; }
        .anim-slide-5 { animation: slideUpFade 0.5s ease-out 0.8s both; }
        .pulse-ring {
          animation: pulseRing 1.4s ease-out infinite;
        }
        .float-up {
          animation: floatUp 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-lg w-full relative z-10">
        {/* ── Main Success Card ── */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header gradient */}
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 p-8 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute top-4 right-8 w-20 h-20 rounded-full bg-white/5" />

            {/* Check Icon */}
            <div className="anim-pop relative inline-block mb-4">
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full bg-white/20 pulse-ring" />
              <div
                className="absolute inset-0 rounded-full bg-white/15 pulse-ring"
                style={{ animationDelay: '0.5s' }}
              />

              <div className="relative w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mx-auto backdrop-blur-sm">
                <AnimatedCheck />
              </div>
            </div>

            <div className="anim-slide-1 relative">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
                Order Confirmed! 🎉
              </h1>
              <p className="text-rose-100 text-sm">
                Thank you for shopping with Arkee Jewellery
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* ── Order ID ── */}
            <div className="anim-slide-2">
              <div className="bg-gradient-to-r from-gray-50 to-rose-50/30 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-2">
                  Order ID
                </p>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-xl font-mono font-bold text-gray-800 tracking-widest">
                    {orderId}
                  </p>
                  <button
                    onClick={copyOrderId}
                    className={`p-2 rounded-xl transition-all ${
                      copied
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    title="Copy Order ID"
                  >
                    {copied ? (
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <ClipboardDocumentCheckIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-center text-xs text-green-500 mt-1 animate-pulse">
                    Copied!
                  </p>
                )}
              </div>
            </div>

            {/* ── Info Cards ── */}
            <div className="anim-slide-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Email */}
              <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-700">
                    Email Sent
                  </p>
                  <p
                    className="text-[10px] text-blue-500 truncate max-w-[100px]"
                    title={email}
                  >
                    {email || 'your email'}
                  </p>
                </div>
              </div>

              {/* Delivery */}
              <div className="flex flex-col items-center gap-2 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-700">
                    Delivery by
                  </p>
                  <p className="text-[10px] text-amber-500 line-clamp-2">
                    {estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-2xl border border-green-100 text-center">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700">
                    Amount Paid
                  </p>
                  <p className="text-xs text-green-600 font-bold">
                    ₹{total?.toLocaleString('en-IN') ?? '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Order Timeline ── */}
            {showTimeline && (
              <div className="anim-slide-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Order Journey
                </h3>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

                  <div className="space-y-4">
                    {ORDER_STEPS.map((step, idx) => (
                      <div
                        key={step.label}
                        className="flex items-center gap-4 relative"
                        style={{
                          animation: `slideUpFade 0.4s ease-out ${0.1 * idx}s both`,
                        }}
                      >
                        {/* Step dot */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10 border-2 ${
                            step.done
                              ? 'bg-green-50 border-green-300'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span
                            className={
                              step.done ? 'opacity-100' : 'opacity-30'
                            }
                          >
                            {step.icon}
                          </span>
                        </div>

                        <div className="flex-1">
                          <p
                            className={`text-sm font-semibold ${
                              step.done
                                ? 'text-green-700'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.done && idx === 0 && (
                            <p className="text-xs text-green-500">
                              Just now
                            </p>
                          )}
                          {step.done && idx === 1 && (
                            <p className="text-xs text-green-500">
                              In progress
                            </p>
                          )}
                          {!step.done && (
                            <p className="text-xs text-gray-300">
                              Pending
                            </p>
                          )}
                        </div>

                        {step.done && (
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <svg
                              className="w-3.5 h-3.5 text-green-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Floating Jewel ── */}
            <div className="flex justify-center py-2">
              <span className="text-5xl float-up select-none">💎</span>
            </div>

            {/* ── Action Buttons ── */}
            <div className="anim-slide-5 space-y-3 pt-2">
              <Link
                to="/my-orders"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                </svg>
                Track My Order
              </Link>

              <Link
                to="/products"
                className="w-full py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                </svg>
                Continue Shopping ✨
              </Link>
            </div>

            {/* ── Support Link ── */}
            <div className="text-center pt-2 pb-1">
              <p className="text-xs text-gray-400">
                Questions about your order?{' '}
                <Link
                  to="/contact"
                  className="text-rose-500 hover:text-rose-600 font-semibold underline underline-offset-2"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* ── Social Share ── */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 mb-2">
            Share your Arkee experience 💕
          </p>
          <div className="flex items-center justify-center gap-3">
            {[
              { icon: '📸', label: 'Instagram' },
              { icon: '🐦', label: 'Twitter' },
              { icon: '💬', label: 'WhatsApp' },
            ].map((s) => (
              <button
                key={s.label}
                className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-xs text-gray-600 font-medium hover:-translate-y-0.5"
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;