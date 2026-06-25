// src/components/home/HeroSection.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import API from '../../api/axios';

const fallbackSlides = [
  {
            "_id": "6a0c085050fcd170c2a9274a",
            "heading": "testttttttttttttttttttt",
            "subheading": "wewewewewewew",
            "image": "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1779363292795.png",
            "link": "deedededeed",
            "description": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            "createdAt": "2026-05-19T06:50:56.701Z",
            "updatedAt": "2026-05-21T11:34:53.243Z",
            "__v": 0
        },
        {
            "_id": "6a0c0bdd42287070fb4bc415",
            "heading": "testing",
            "subheading": "sub testing ",
            "image": "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1779360641363.jpeg",
            "link": "hdssusd",
            "description": "testing testing testing testing testing tttttttttttt",
            "createdAt": "2026-05-19T07:06:05.371Z",
            "updatedAt": "2026-05-21T10:50:41.582Z",
            "__v": 0
        },
        {
            "_id": "6a0c15e3805e39075224719b",
            "heading": "cdckdjcndknc",
            "subheading": "vfvfvfv",
            "link": "",
            "description": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            "createdAt": "2026-05-19T07:48:51.563Z",
            "updatedAt": "2026-05-21T10:51:05.263Z",
            "__v": 0,
            "image": "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1779360665054.jpeg"
        }
];

const heroStyles = `
  @keyframes hero3dZoomIn {
    0%   { transform: scale(1)    translate3d(0,0,0); }
    50%  { transform: scale(1.08) translate3d(-1%,-0.5%,0); }
    100% { transform: scale(1)    translate3d(0,0,0); }
  }
  @keyframes hero3dZoomOut {
    0%   { transform: scale(1.1) translate3d(1%,0.5%,0); }
    50%  { transform: scale(1)   translate3d(-0.5%,-1%,0); }
    100% { transform: scale(1.1) translate3d(1%,0.5%,0); }
  }
  @keyframes hero3dZoomAlt {
    0%   { transform: scale(1)    translate3d(-0.5%,1%,0); }
    50%  { transform: scale(1.12) translate3d(1%,-0.5%,0); }
    100% { transform: scale(1)    translate3d(-0.5%,1%,0); }
  }
  @keyframes heroSlideUp {
    from {
      opacity: 0;
      transform: perspective(1000px) translateY(60px) rotateX(12deg);
      filter: blur(6px);
    }
    to {
      opacity: 1;
      transform: perspective(1000px) translateY(0) rotateX(0deg);
      filter: blur(0);
    }
  }
  @keyframes heroSlideLeft {
    from {
      opacity: 0;
      transform: perspective(1000px) translateX(-60px) rotateY(15deg);
      filter: blur(5px);
    }
    to {
      opacity: 1;
      transform: perspective(1000px) translateX(0) rotateY(0deg);
      filter: blur(0);
    }
  }
  @keyframes heroFadeScale {
    from {
      opacity: 0;
      transform: perspective(800px) scale(0.85) rotateX(8deg);
    }
    to {
      opacity: 1;
      transform: perspective(800px) scale(1) rotateX(0deg);
    }
  }
  @keyframes heroBadgePop {
    0%   { transform: perspective(600px) scale(0) rotateY(-90deg); opacity: 0; }
    60%  { transform: perspective(600px) scale(1.08) rotateY(6deg); opacity: 1; }
    100% { transform: perspective(600px) scale(1) rotateY(0deg); opacity: 1; }
  }
  @keyframes heroShimmerGold {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  @keyframes heroGlowPulse {
    0%,100% {
      box-shadow:
        0 0 20px rgba(244,163,187,0.25),
        0 0 40px rgba(212,175,55,0.12),
        inset 0 0 15px rgba(255,255,255,0.04);
    }
    50% {
      box-shadow:
        0 0 35px rgba(244,163,187,0.45),
        0 0 70px rgba(212,175,55,0.25),
        inset 0 0 25px rgba(255,255,255,0.08);
    }
  }
  @keyframes heroFloatGem {
    0%,100% { transform: perspective(600px) translateY(0)    rotateY(0deg)  rotateX(0deg); }
    25%     { transform: perspective(600px) translateY(-15px) rotateY(6deg)  rotateX(3deg); }
    50%     { transform: perspective(600px) translateY(-25px) rotateY(0deg)  rotateX(-3deg); }
    75%     { transform: perspective(600px) translateY(-10px) rotateY(-6deg) rotateX(2deg); }
  }
  @keyframes heroRingPulse {
    0%   { transform: scale(0.85); opacity: 0.5; }
    100% { transform: scale(2);    opacity: 0; }
  }
  @keyframes heroMorph {
    0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
    50%     { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
  }
  @keyframes heroParticleRise {
    0%   { transform: translateY(100vh) translateX(0) rotate(0deg) scale(0); opacity: 0; }
    5%   { opacity: 0.5; transform: translateY(90vh) scale(1); }
    95%  { opacity: 0.2; }
    100% { transform: translateY(-10vh) translateX(30px) rotate(360deg) scale(0); opacity: 0; }
  }
  @keyframes heroStarSpin {
    0%   { transform: rotate(0deg)   scale(1); }
    50%  { transform: rotate(180deg) scale(1.15); }
    100% { transform: rotate(360deg) scale(1); }
  }
  @keyframes heroScrollBounce {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(6px); }
  }
  @keyframes heroProgressFill {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes heroSpinSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes heroSpinReverse {
    from { transform: rotate(360deg); }
    to   { transform: rotate(0deg); }
  }
  @keyframes heroPetalDrift {
    0%   { transform: translateY(-10%) translateX(0) rotate(0deg) scale(0.7); opacity: 0; }
    10%  { opacity: 0.5; }
    50%  { transform: translateY(50vh) translateX(25px) rotate(180deg) scale(1); opacity: 0.3; }
    100% { transform: translateY(110vh) translateX(-15px) rotate(360deg) scale(0.5); opacity: 0; }
  }

  .hero-zoom-1 { animation: hero3dZoomIn  16s ease-in-out infinite; }
  .hero-zoom-2 { animation: hero3dZoomOut 18s ease-in-out infinite; }
  .hero-zoom-3 { animation: hero3dZoomAlt 14s ease-in-out infinite; }

  .hero-anim-up {
    animation: heroSlideUp 0.85s cubic-bezier(0.16,1,0.3,1) forwards;
    opacity: 0;
  }
  .hero-anim-left {
    animation: heroSlideLeft 0.85s cubic-bezier(0.16,1,0.3,1) forwards;
    opacity: 0;
  }
  .hero-anim-scale {
    animation: heroFadeScale 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
    opacity: 0;
  }
  .hero-badge-anim {
    animation: heroBadgePop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
    opacity: 0;
  }

  .hero-shimmer-text {
    background: linear-gradient(
      90deg,#f5d5c0 0%,#d4af37 18%,#fff8e7 36%,#d4af37 54%,#f4a3bb 72%,#d4af37 100%
    );
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: heroShimmerGold 5s linear infinite;
  }

  .hero-float        { animation: heroFloatGem 7s ease-in-out infinite; }
  .hero-float-d1     { animation: heroFloatGem 9s ease-in-out 1.2s infinite; }
  .hero-float-d2     { animation: heroFloatGem 11s ease-in-out 2.5s infinite; }
  .hero-glow-pulse   { animation: heroGlowPulse 3.5s ease-in-out infinite; }
  .hero-morph         { animation: heroMorph 14s ease-in-out infinite; }
  .hero-star-spin     { animation: heroStarSpin 6s linear infinite; }
  .hero-scroll-bounce { animation: heroScrollBounce 1.5s ease-in-out infinite; }
  .hero-spin-slow     { animation: heroSpinSlow 30s linear infinite; }
  .hero-spin-reverse  { animation: heroSpinReverse 25s linear infinite; }
  .hero-ring-pulse    { animation: heroRingPulse 2.5s cubic-bezier(0.25,0.46,0.45,0.94) infinite; }

  .hero-particle {
    position: absolute;
    pointer-events: none;
    animation: heroParticleRise linear infinite;
  }
  .hero-petal {
    position: absolute;
    pointer-events: none;
    background: radial-gradient(ellipse, rgba(244,163,187,0.5), transparent);
    border-radius: 50% 0 50% 0;
    animation: heroPetalDrift linear infinite;
  }

  .hero-tilt-container {
    transition: transform 0.12s ease-out;
    transform-style: preserve-3d;
    will-change: transform;
  }

  .hero-btn-3d {
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
    transform-style: preserve-3d;
  }
  .hero-btn-3d::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    transform: translate(-50%,-50%);
    transition: width 0.5s ease, height 0.5s ease;
  }
  .hero-btn-3d:hover {
    transform: perspective(800px) translateY(-4px) rotateX(6deg) scale(1.03);
    box-shadow: 0 18px 36px rgba(212,175,55,0.3), 0 6px 14px rgba(0,0,0,0.12);
  }
  .hero-btn-3d:hover::before { width: 350px; height: 350px; }
  .hero-btn-3d:active { transform: perspective(800px) translateY(-1px) rotateX(2deg) scale(0.99); }

  .hero-btn-glass {
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
    transform-style: preserve-3d;
  }
  .hero-btn-glass:hover {
    transform: perspective(800px) translateY(-3px) rotateX(4deg);
    box-shadow: 0 12px 28px rgba(255,255,255,0.08);
  }

  .hero-stat-3d {
    transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
    transform-style: preserve-3d;
  }
  .hero-stat-3d:hover {
    transform: perspective(600px) rotateX(-4deg) rotateY(4deg) translateZ(8px);
    box-shadow: 6px 6px 25px rgba(212,175,55,0.12), -3px -3px 18px rgba(244,163,187,0.08);
  }

  .hero-dot {
    transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
    cursor: pointer;
  }
  .hero-dot:hover {
    transform: perspective(400px) translateZ(6px) scale(1.25);
  }

  .hero-nav-btn {
    transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
    transform-style: preserve-3d;
  }
  .hero-nav-btn:hover {
    transform: perspective(600px) scale(1.12) translateZ(5px);
    box-shadow: 0 8px 20px rgba(212,175,55,0.15);
  }
  .hero-nav-btn:active {
    transform: perspective(600px) scale(0.95);
  }

  .hero-magnetic-arrow {
    transition: transform 0.3s cubic-bezier(0.23,1,0.32,1);
  }
  .hero-btn-3d:hover .hero-magnetic-arrow {
    transform: translateX(5px) rotate(-12deg);
  }

  .hero-card-3d {
    transition: all 0.5s cubic-bezier(0.23,1,0.32,1);
    transform-style: preserve-3d;
  }
  .hero-card-3d:hover {
    transform: perspective(800px) rotateY(4deg) rotateX(-3deg) translateY(-6px) scale(1.02);
    box-shadow:
      0 20px 40px rgba(244,163,187,0.12),
      0 8px 18px rgba(212,175,55,0.08);
  }

  .hero-fullscreen {
    height: 100svh;
    min-height: 560px;
    max-height: 1100px;
  }
  @media (max-width: 640px) {
    .hero-fullscreen {
      min-height: 520px;
    }
  }
  @media (min-height: 900px) {
    .hero-fullscreen {
      max-height: 100svh;
    }
  }
`;

const HeroParticles = ({ count = 10 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="hero-particle"
        style={{
          left: `${5 + Math.random() * 90}%`,
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          background: `radial-gradient(circle, ${i % 2 === 0 ? '#d4af37' : '#f4a3bb'}, transparent)`,
          borderRadius: '50%',
          animationDelay: `${Math.random() * 12}s`,
          animationDuration: `${8 + Math.random() * 8}s`,
          opacity: 0.3 + Math.random() * 0.4,
        }}
      />
    ))}
  </div>
);

const HeroPetals = ({ count = 5 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="hero-petal"
        style={{
          left: `${Math.random() * 100}%`,
          width: `${8 + Math.random() * 10}px`,
          height: `${8 + Math.random() * 10}px`,
          opacity: 0.2 + Math.random() * 0.25,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${10 + Math.random() * 8}s`,
        }}
      />
    ))}
  </div>
);

const HeroSection = () => {
  const [slides, setSlides] = useState(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('right');
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tiltStyle, setTiltStyle] = useState({});
  const [animKey, setAnimKey] = useState(0);

  const heroRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const currentRef = useRef(0);
  const slidesRef = useRef(fallbackSlides);

  const SLIDE_DURATION = 5000;

  // Keep refs in sync with state
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  // ── Fetch banners ──
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await API.get('/banner');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const formatted = res.data.map((b) => ({
            _id: b._id || crypto.randomUUID(),
            title: b.title || b.heading || 'Premium Collection',
            subtitle: b.subtitle || b.subheading || 'Exclusive Designs',
            description: b.description || 'Discover our amazing collection',
            cta: b.cta || 'Shop Now',
            ctaLink: b.ctaLink || b.link || '/products',
            image: b.image || b.imageUrl || '',
            badge: b.badge || 'Featured',
            overlayColor:
              b.overlayColor || 'from-rose-950 via-rose-900 to-pink-800',
          }));
          setSlides(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch banners:', err.message);
      } finally {
        setTimeout(() => setIsLoaded(true), 150);
      }
    };
    fetchBanners();
  }, []);

  // ── Go to slide ──
  const goTo = useCallback(
    (index, dir = 'right') => {
      if (isTransitioning || index === currentRef.current || index < 0 || index >= slidesRef.current.length)
        return;
      setDirection(dir);
      setIsTransitioning(true);
      setProgress(0);
      setAnimKey((k) => k + 1);
      setTimeout(() => {
        setCurrent(index);
        setTimeout(() => setIsTransitioning(false), 650);
      }, 50);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    goTo((currentRef.current + 1) % slidesRef.current.length, 'right');
  }, [goTo]);

  const goPrev = useCallback(() => {
    goTo((currentRef.current - 1 + slidesRef.current.length) % slidesRef.current.length, 'left');
  }, [goTo]);

  // ── ROBUST AUTO-ADVANCE: Always runs, never pauses ──
  useEffect(() => {
    const scheduleNext = () => {
      timerRef.current = setTimeout(() => {
        goNext();
      }, SLIDE_DURATION);
    };

    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [goNext]);

  // ── Progress bar animation ──
  useEffect(() => {
    setProgress(0);
    let start = null;

    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
      if (elapsed < SLIDE_DURATION) {
        progressRef.current = requestAnimationFrame(animate);
      }
    };

    progressRef.current = requestAnimationFrame(animate);

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [current]);

  // ── Mouse tilt (desktop only — does NOT pause slides) ──
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTiltStyle({
        transform: `perspective(1200px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`,
        transition: 'transform 0.12s ease-out',
      });
    };
    const onLeave = () =>
      setTiltStyle({
        transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
      });
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // ── Keyboard nav ──
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  // ── Touch handlers ──
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    const threshold = 60;
    if (touchStart - touchEnd > threshold) goNext();
    if (touchEnd - touchStart > threshold) goPrev();
  };

  // ── Safety ──
  if (!slides || slides.length === 0) {
    return (
      <section className="relative w-full hero-fullscreen bg-black flex items-center justify-center">
        <p className="text-white/50 text-sm">No slides available</p>
      </section>
    );
  }

  const slide = slides[current] || slides[0];
  const zoomClasses = ['hero-zoom-1', 'hero-zoom-2', 'hero-zoom-3'];
  const defaultGradients = [
    'from-rose-950 via-rose-900 to-pink-800',
    'from-gray-950 via-slate-900 to-zinc-800',
    'from-amber-950 via-orange-900 to-yellow-800',
  ];
  const overlayColor =
    slide.overlayColor || defaultGradients[current % defaultGradients.length];

  return (
    <>
      <style>{heroStyles}</style>

      <section
        ref={heroRef}
        className="relative w-full hero-fullscreen overflow-hidden bg-black"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Hero banner carousel"
      >
        {/* ── BACKGROUND IMAGES WITH 3D ZOOM ── */}
        <div className="absolute inset-0 z-0 hero-tilt-container" style={tiltStyle}>
          {slides.map((s, i) => (
            <div
              key={s._id}
              className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${
                i === current ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {s.image ? (
                <img
                  src={s.image}
                  alt={s.title}
                  className={`w-full h-full object-cover ${zoomClasses[i % zoomClasses.length]}`}
                  loading={i === current ? 'eager' : 'lazy'}
                  draggable={false}
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${
                    s.overlayColor || overlayColor
                  } ${zoomClasses[i % zoomClasses.length]}`}
                />
              )}

              <div
                className="absolute -top-[10%] -right-[5%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full blur-3xl hero-morph opacity-40"
                style={{
                  background: `radial-gradient(circle, ${
                    i % 2 === 0
                      ? 'rgba(244,163,187,0.15)'
                      : 'rgba(212,175,55,0.12)'
                  }, transparent 70%)`,
                }}
              />
              <div
                className="absolute -bottom-[15%] -left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full blur-3xl hero-morph opacity-30"
                style={{
                  animationDelay: '7s',
                  background: `radial-gradient(circle, ${
                    i % 2 === 0
                      ? 'rgba(212,175,55,0.12)'
                      : 'rgba(244,163,187,0.1)'
                  }, transparent 70%)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* ── OVERLAY GRADIENTS ── */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10 z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 z-[2]" />

        {/* ── SUBTLE GRID ── */}
        <div
          className="absolute inset-0 opacity-[0.025] z-[3] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.5) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* ── PARTICLES & PETALS ── */}
        <HeroParticles count={8} />
        <HeroPetals count={4} />

        {/* ── CORNER ORNAMENTS ── */}
        <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

          {[
            { pos: 'top-4 left-4 sm:top-6 sm:left-6', d: 'M0 0 L30 0 L30 4 L4 4 L4 30 L0 30 Z' },
            { pos: 'top-4 right-4 sm:top-6 sm:right-6', d: 'M100 0 L70 0 L70 4 L96 4 L96 30 L100 30 Z' },
            { pos: 'bottom-4 left-4 sm:bottom-6 sm:left-6', d: 'M0 100 L30 100 L30 96 L4 96 L4 70 L0 70 Z' },
            { pos: 'bottom-4 right-4 sm:bottom-6 sm:right-6', d: 'M100 100 L70 100 L70 96 L96 96 L96 70 L100 70 Z' },
          ].map(({ pos, d }, i) => (
            <svg
              key={i}
              className={`absolute ${pos} w-10 h-10 sm:w-14 sm:h-14 text-amber-400/15`}
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d={d} />
            </svg>
          ))}
        </div>

        {/* ── FLOATING GEM (top-right) ── */}
        <div className="absolute top-[8%] right-[3%] sm:top-[10%] sm:right-[6%] md:top-[12%] md:right-[8%] z-[7] pointer-events-none">
          <div className="hero-float hero-glow-pulse">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(244,163,187,0.12))',
                border: '1px solid rgba(212,175,55,0.25)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="text-xl sm:text-2xl md:text-3xl">💎</span>
            </div>
          </div>
          <div
            className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl hero-ring-pulse opacity-0"
            style={{ border: '1px solid rgba(212,175,55,0.3)' }}
          />
          <div
            className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl hero-ring-pulse opacity-0"
            style={{
              border: '1px solid rgba(212,175,55,0.2)',
              animationDelay: '0.8s',
            }}
          />
        </div>

        {/* ── SMALL FLOATING ACCENTS ── */}
        <div className="absolute bottom-[20%] right-[10%] sm:right-[14%] z-[7] pointer-events-none hero-float-d1 hidden sm:block">
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(244,163,187,0.15), transparent)',
              border: '1px solid rgba(244,163,187,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="text-base sm:text-lg">🌸</span>
          </div>
        </div>
        <div className="absolute top-[45%] left-[2%] z-[7] pointer-events-none hero-float-d2 hidden lg:block">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.12), transparent)',
              border: '1px solid rgba(212,175,55,0.18)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span className="text-sm">✨</span>
          </div>
        </div>

        {/* ── ROTATING STAR ── */}
        <div className="absolute top-[22%] right-[18%] sm:right-[22%] md:right-[28%] z-[7] pointer-events-none hero-star-spin opacity-30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4af37">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* ── MAIN CONTENT ─────────────────────────────── */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* ── LEFT: TEXT CONTENT ── */}
              <div className="lg:col-span-7 xl:col-span-6">
                <div
                  className={`transition-all duration-700 ease-out ${
                    isTransitioning
                      ? `opacity-0 ${
                          direction === 'right'
                            ? '-translate-x-10'
                            : 'translate-x-10'
                        } scale-[0.97]`
                      : 'opacity-100 translate-x-0 scale-100'
                  }`}
                >
                  {/* Badge */}
                  {slide.badge && (
                    <div
                      key={`badge-${animKey}`}
                      className="hero-badge-anim inline-flex items-center gap-2 mb-5 sm:mb-6"
                      style={{ animationDelay: '0.1s' }}
                    >
                      <span className="relative flex items-center">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-25 animate-ping" />
                        <span
                          className="relative inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold px-4 py-1.5 sm:px-5 sm:py-2 rounded-full tracking-[0.15em] uppercase"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(244,163,187,0.1))',
                            border: '1px solid rgba(212,175,55,0.3)',
                            color: '#fbd38d',
                            backdropFilter: 'blur(12px)',
                          }}
                        >
                          <span className="hero-star-spin text-[10px]">✦</span>
                          {slide.badge}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Subtitle */}
                  {slide.subtitle && (
                    <div key={`subtitle-${animKey}`} className="overflow-hidden mb-2 sm:mb-3">
                      <span
                        className="block text-white/55 text-[11px] sm:text-xs md:text-sm font-light tracking-[0.3em] uppercase font-sans hero-anim-left"
                        style={{ animationDelay: '0.2s' }}
                      >
                        {slide.subtitle}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  {slide.title && (
                    <div key={`title-${animKey}`} className="overflow-hidden mb-4 sm:mb-5">
                      <h1
                        className="hero-anim-up"
                        style={{ animationDelay: '0.3s' }}
                      >
                        <span
                          className="block font-serif font-bold leading-[1.08] tracking-tight hero-shimmer-text"
                          style={{
                            fontSize: 'clamp(2rem, 7.5vw, 5rem)',
                          }}
                        >
                          {slide.title}
                        </span>
                      </h1>
                    </div>
                  )}

                  {/* Decorative Divider */}
                  <div
                    key={`divider-${animKey}`}
                    className="flex items-center gap-3 my-4 sm:my-5 hero-anim-scale"
                    style={{ animationDelay: '0.45s' }}
                  >
                    <div className="h-px w-10 sm:w-14 bg-gradient-to-r from-amber-400 to-transparent" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full hero-glow-pulse" />
                    <div className="h-px w-16 sm:w-20 bg-gradient-to-r from-amber-400/80 to-transparent" />
                  </div>

                  {/* Description */}
                  {slide.description && (
                    <p
                      key={`desc-${animKey}`}
                      className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mb-6 sm:mb-8 font-light hero-anim-left"
                      style={{ animationDelay: '0.55s' }}
                    >
                      {slide.description}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div
                    key={`cta-${animKey}`}
                    className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10 hero-anim-up"
                    style={{ animationDelay: '0.65s' }}
                  >
                    <Link
                      to={slide.ctaLink || '/products'}
                      className="hero-btn-3d group inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg shadow-amber-500/25 text-sm sm:text-base"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-full" />
                      <span className="relative">{slide.cta || 'Shop Now'}</span>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 relative hero-magnetic-arrow"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>

                    <Link
                      to="/products"
                      className="hero-btn-glass group inline-flex items-center gap-2.5 text-white font-medium px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-base"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      <span>View Collections</span>
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/8 group-hover:bg-amber-400/15 flex items-center justify-center transition-all">
                        <svg
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </Link>
                  </div>

                  {/* Stats */}
                  <div
                    key={`stats-${animKey}`}
                    className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 hero-anim-scale"
                    style={{ animationDelay: '0.8s' }}
                  >
                    {[
                      { value: '500+', label: 'Unique Designs', icon: '💎' },
                      { value: '10K+', label: 'Happy Customers', icon: '❤️' },
                      { value: '4.9★', label: 'Avg Rating', icon: '⭐' },
                    ].map((stat, i) => (
                      <div
                        key={stat.label}
                        className="hero-stat-3d px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl cursor-default"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          backdropFilter: 'blur(10px)',
                          transitionDelay: `${i * 80}ms`,
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs sm:text-sm" aria-hidden="true">
                            {stat.icon}
                          </span>
                          <p className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-100">
                            {stat.value}
                          </p>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-white/35 font-medium tracking-wider uppercase">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── RIGHT: FLOATING PRODUCT SHOWCASE ── */}
              <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 justify-center items-center">
                <div
                  className={`relative transition-all duration-700 ease-out ${
                    isTransitioning
                      ? 'opacity-0 scale-[0.88] rotate-3'
                      : 'opacity-100 scale-100 rotate-0'
                  }`}
                >
                  {/* Decorative Spinning Rings */}
                  <div
                    className="absolute -inset-8 border border-amber-400/8 rounded-full hero-spin-slow"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -inset-16 border border-amber-400/4 rounded-full hero-spin-reverse"
                    aria-hidden="true"
                  />

                  {/* Main Circle Image */}
                  {slide.image ? (
                    <div className="relative w-56 h-56 md:w-72 md:h-72 xl:w-[22rem] xl:h-[22rem]">
                      <div
                        className="absolute inset-0 rounded-full blur-3xl hero-glow-pulse"
                        style={{
                          background:
                            'radial-gradient(circle, rgba(212,175,55,0.15), rgba(244,163,187,0.1), transparent 70%)',
                        }}
                        aria-hidden="true"
                      />

                      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-400/25 shadow-2xl shadow-amber-900/25 hero-card-3d">
                        <img
                          src={slide.image}
                          alt={slide.title || 'Product showcase'}
                          className={`w-full h-full object-cover ${
                            zoomClasses[current % zoomClasses.length]
                          }`}
                          draggable={false}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"
                          aria-hidden="true"
                        />
                      </div>

                      {/* Floating Info Cards */}
                      <div className="absolute -top-5 -left-5 xl:-top-6 xl:-left-6 hero-float hero-card-3d">
                        <div
                          className="px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-2xl"
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm">
                              💎
                            </div>
                            <div>
                              <p className="text-[9px] text-white/45 uppercase tracking-wider">
                                Free Shipping
                              </p>
                              <p className="text-xs sm:text-sm font-bold text-white">
                                Above ₹999
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute -bottom-4 -right-5 xl:-bottom-5 xl:-right-6 hero-float-d1 hero-card-3d">
                        <div
                          className="px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-2xl"
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-sm">
                              🌸
                            </div>
                            <div>
                              <p className="text-[9px] text-white/45 uppercase tracking-wider">
                                Handcrafted
                              </p>
                              <p className="text-xs sm:text-sm font-bold text-white">
                                With Love
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-1/2 -right-8 xl:-right-10 -translate-y-1/2 hero-float-d2 hero-card-3d">
                        <div
                          className="px-2.5 py-2 rounded-xl shadow-xl"
                          style={{
                            background: 'rgba(255,255,255,0.07)',
                            backdropFilter: 'blur(14px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">✨</span>
                            <div>
                              <p className="text-[8px] text-white/40 uppercase tracking-wider">
                                Pure
                              </p>
                              <p className="text-[11px] font-bold text-white">
                                925 Silver
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-56 h-56 md:w-72 md:h-72 xl:w-[22rem] xl:h-[22rem]">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/8 to-rose-400/8 border border-amber-400/15 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-5xl md:text-6xl" aria-hidden="true">
                            💍
                          </span>
                          <p className="text-amber-300/50 text-xs mt-2 font-serif italic">
                            Exquisite Collection
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* ── BOTTOM CONTROLS ──────────────────────────── */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 pb-5 sm:pb-7 md:pb-8">
          <div className="max-w-[1440px] mx-auto flex items-end justify-between gap-3">

            {/* Left: Progress + Dots + Arrows */}
            <div className="flex flex-col gap-2.5">
              {/* Progress Bar */}
              <div
                className="w-28 sm:w-40 md:w-48 h-[2px] rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background:
                      'linear-gradient(90deg, #d4af37, rgba(212,175,55,0.5))',
                    transition: 'width 0.1s linear',
                  }}
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>

              {/* Dots + Arrows */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={goPrev}
                  className="hero-nav-btn w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                  aria-label="Previous slide"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60" />
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2" role="tablist">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i, i > current ? 'right' : 'left')}
                      className="hero-dot rounded-full focus:outline-none"
                      role="tab"
                      aria-selected={i === current}
                      aria-label={`Slide ${i + 1}`}
                      style={{
                        width: i === current ? '24px' : '7px',
                        height: '7px',
                        background:
                          i === current
                            ? 'linear-gradient(90deg, #d4af37, rgba(212,175,55,0.6))'
                            : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={goNext}
                  className="hero-nav-btn w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                  aria-label="Next slide"
                >
                  <ChevronRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60" />
                </button>

                {/* Slide counter (sm+) */}
                <span
                  className="ml-1.5 text-white/25 text-xs font-mono hidden sm:block"
                  aria-live="polite"
                >
                  <span className="text-amber-400/70 font-bold">
                    {String(current + 1).padStart(2, '0')}
                  </span>
                  <span className="mx-0.5 text-white/15">/</span>
                  {String(slides.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Right: Scroll Indicator */}
            <div className="flex flex-col items-center gap-1.5 hero-scroll-bounce pb-0.5">
              <span className="text-white/20 text-[9px] tracking-[0.25em] uppercase hidden sm:block">
                Scroll
              </span>
              <div
                className="w-4 h-7 sm:w-5 sm:h-8 rounded-full border border-white/12 flex items-start justify-center pt-1.5"
                style={{ backdropFilter: 'blur(4px)' }}
              >
                <div
                  className="w-0.5 sm:w-1 h-1.5 sm:h-2 rounded-full"
                  style={{
                    background:
                      'linear-gradient(180deg, #d4af37, transparent)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── WATERMARK SLIDE NUMBER ── */}
        <div
          className="absolute bottom-[10%] right-[3%] sm:right-[5%] md:bottom-[14%] z-[8] pointer-events-none select-none hidden sm:block"
          style={{
            fontSize: 'clamp(4rem, 14vw, 11rem)',
            fontFamily: 'serif',
            fontWeight: 900,
            color: 'rgba(212,175,55,0.04)',
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          0{current + 1}
        </div>
      </section>
    </>
  );
};

export default HeroSection;