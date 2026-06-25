// src/pages/Home.jsx
import React, { Suspense, lazy, useEffect, useRef, useState, useCallback } from 'react';

// ─── LAZY IMPORTS ─────────────────────────────────────────────────────────────
const HeroSection      = lazy(() => import('../components/home/HeroSection'));
const OffersStrip      = lazy(() => import('../components/home/OffersStrip'));
const CategorySection  = lazy(() => import('../components/home/CategorySection'));
const FeaturedProducts = lazy(() => import('../components/home/NewLaunceSection'));
const WhyChooseUs      = lazy(() => import('../components/home/WhyChooseUs'));
const LatestProducts   = lazy(() => import('../components/home/LatestProducts'));
const MaterialSection  = lazy(() => import('../components/home/MaterialSection'));
const BestByUs         = lazy(() => import('../components/home/BestByUs'));
const TestimonialsSection = lazy(() => import('../components/home/TestimonialsSection'));
const BlogPreview      = lazy(() => import('../components/home/BlogPreview'));


// ─── ALL PAGE STYLES ──────────────────────────────────────────────────────────
const styles = `
  /* ── ANIMATIONS ── */
  @keyframes shimmer-rose {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes glow-breathe {
    0%,100% {
      box-shadow: 0 0 20px rgba(244,163,187,0.2), 0 0 40px rgba(212,175,55,0.1);
      filter: brightness(1);
    }
    50% {
      box-shadow: 0 0 40px rgba(244,163,187,0.4), 0 0 80px rgba(212,175,55,0.2);
      filter: brightness(1.05);
    }
  }
  @keyframes float-elegant {
    0%,100% { transform: translateY(0px)   rotateY(0deg); }
    25%      { transform: translateY(-15px) rotateY(5deg); }
    50%      { transform: translateY(-25px) rotateY(0deg); }
    75%      { transform: translateY(-10px) rotateY(-5deg); }
  }
  @keyframes rotate-gem {
    0%   { transform: perspective(800px) rotateX(0deg)  rotateY(0deg)   rotateZ(0deg); }
    25%  { transform: perspective(800px) rotateX(5deg)  rotateY(90deg)  rotateZ(2deg); }
    50%  { transform: perspective(800px) rotateX(-3deg) rotateY(180deg) rotateZ(-1deg); }
    75%  { transform: perspective(800px) rotateX(4deg)  rotateY(270deg) rotateZ(3deg); }
    100% { transform: perspective(800px) rotateX(0deg)  rotateY(360deg) rotateZ(0deg); }
  }
  @keyframes reveal-up {
    from {
      opacity: 0;
      transform: perspective(1000px) translateY(60px) rotateX(10deg);
      filter: blur(4px);
    }
    to {
      opacity: 1;
      transform: perspective(1000px) translateY(0) rotateX(0deg);
      filter: blur(0);
    }
  }
  @keyframes sparkle-float {
    0%,100% { opacity: 0; transform: translateY(0)      scale(0)   rotate(0deg);   }
    10%      { opacity: 1; transform: translateY(-10px)  scale(1)   rotate(45deg);  }
    50%      { opacity: 0.8; transform: translateY(-60px) scale(0.8) rotate(180deg); }
    90%      { opacity: 0.2; transform: translateY(-120px) scale(0.3) rotate(360deg); }
  }
  @keyframes petal-fall {
    0%   { transform: translateY(-10%)  translateX(0)    rotate(0deg)   scale(0.8); opacity: 0; }
    10%  { opacity: 0.5; }
    50%  { transform: translateY(50vh)  translateX(25px) rotate(180deg) scale(1);   opacity: 0.3; }
    100% { transform: translateY(110vh) translateX(-15px) rotate(360deg) scale(0.5); opacity: 0; }
  }
  @keyframes diamond-spin {
    0%   { transform: perspective(600px) rotateY(0deg)   rotateZ(45deg) scale(1);   }
    50%  { transform: perspective(600px) rotateY(180deg) rotateZ(45deg) scale(1.1); }
    100% { transform: perspective(600px) rotateY(360deg) rotateZ(45deg) scale(1);   }
  }
  @keyframes text-glow {
    0%,100% { text-shadow: 0 0 10px rgba(212,175,55,0.3); }
    50%      { text-shadow: 0 0 30px rgba(212,175,55,0.6), 0 0 60px rgba(244,163,187,0.3); }
  }
  @keyframes morph-blob {
    0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
    50%      { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
  }
  @keyframes particle-rise {
    0%   { transform: translateY(100vh) translateX(0) rotate(0deg) scale(0); opacity: 0; }
    5%   { opacity: 0.5; transform: translateY(90vh) scale(1); }
    95%  { opacity: 0.2; }
    100% { transform: translateY(-10vh) translateX(30px) rotate(360deg) scale(0); opacity: 0; }
  }

  /* ── UTILITY CLASSES ── */
  .shimmer-rose-text {
    background: linear-gradient(
      90deg, #be8a6e 0%, #d4af37 25%, #f4a3bb 50%, #d4af37 75%, #be8a6e 100%
    );
    background-size: 400% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer-rose 4s linear infinite;
  }
  .glow-breathe        { animation: glow-breathe 4s ease-in-out infinite; }
  .float-elegant       { animation: float-elegant  8s ease-in-out infinite; }
  .float-elegant-d1    { animation: float-elegant  8s ease-in-out 2s infinite; }
  .float-elegant-slow  { animation: float-elegant 12s ease-in-out 1s infinite; }
  .rotate-gem-anim     { animation: rotate-gem 10s ease-in-out infinite; }
  .text-glow-anim      { animation: text-glow  3s ease-in-out infinite; }
  .diamond-spin        { animation: diamond-spin 6s ease-in-out infinite; display: inline-block; }
  .morph-blob          { animation: morph-blob 14s ease-in-out infinite; }

  .sparkle-particle {
    position: absolute;
    width: 5px; height: 5px;
    background: radial-gradient(circle, #d4af37, transparent);
    border-radius: 50%;
    pointer-events: none;
    animation: sparkle-float 3s ease-in-out infinite;
  }
  .petal {
    position: absolute;
    background: radial-gradient(ellipse, rgba(244,163,187,0.55), transparent);
    border-radius: 50% 0 50% 0;
    pointer-events: none;
    animation: petal-fall linear infinite;
  }
  .page-particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    animation: particle-rise linear infinite;
  }

  /* ── GLASS STYLES ── */
  .glass-card {
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.3);
  }
  .glass-dark {
    background: rgba(15,10,30,0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.07);
  }

  /* ── HOVER EFFECTS ── */
  .hover-3d-card {
    transition: all 0.5s cubic-bezier(0.23,1,0.320,1);
    transform-style: preserve-3d;
  }
  .hover-3d-card:hover {
    transform: perspective(1000px) rotateY(5deg) rotateX(-3deg) translateY(-8px) scale(1.02);
    box-shadow:
      0 25px 50px rgba(244,163,187,0.14),
      0 10px 20px rgba(212,175,55,0.08);
  }
  .hover-glow-rose { transition: all 0.4s ease; }
  .hover-glow-rose:hover {
    box-shadow: 0 0 28px rgba(244,163,187,0.28), 0 0 55px rgba(212,175,55,0.14);
  }

  .btn-3d-rose {
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23,1,0.320,1);
    transform-style: preserve-3d;
  }
  .btn-3d-rose::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.18);
    border-radius: 50%;
    transform: translate(-50%,-50%);
    transition: width 0.55s ease, height 0.55s ease;
  }
  .btn-3d-rose:hover {
    transform: perspective(800px) translateY(-4px) rotateX(5deg);
    box-shadow: 0 15px 32px rgba(244,163,187,0.28), 0 5px 14px rgba(0,0,0,0.1);
  }
  .btn-3d-rose:hover::after { width: 280px; height: 280px; }
  .btn-3d-rose:active { transform: perspective(800px) translateY(-1px) rotateX(2deg); }

  /* ── 3D PRESERVE ── */
  .preserve-3d { transform-style: preserve-3d; }
  .perspective-container { perspective: 1200px; perspective-origin: 50% 50%; }

  html { scroll-behavior: smooth; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ─── HOOKS ────────────────────────────────────────────────────────────────────
const useScrollReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// ─── SPARKLE FIELD ────────────────────────────────────────────────────────────
const SparkleField = ({ count = 8 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="sparkle-particle"
        style={{
          left:              `${10 + Math.random() * 80}%`,
          top:               `${10 + Math.random() * 80}%`,
          animationDelay:    `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }}
      />
    ))}
  </div>
);

// ─── FLOATING PETALS ─────────────────────────────────────────────────────────
const FloatingPetals = ({ count = 5 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="petal"
        style={{
          left:              `${Math.random() * 100}%`,
          width:             `${8 + Math.random() * 10}px`,
          height:            `${8 + Math.random() * 10}px`,
          opacity:            0.2 + Math.random() * 0.25,
          animationDelay:    `${Math.random() * 8}s`,
          animationDuration: `${9 + Math.random() * 6}s`,
        }}
      />
    ))}
  </div>
);

// ─── SECTION LOADERS ─────────────────────────────────────────────────────────
const HeroLoader = () => (
  <div
    className="w-full bg-gradient-to-br from-[#1a0a14] via-[#2d1020] to-[#0f0a1a] relative overflow-hidden"
    style={{ height: '100svh', minHeight: '560px', maxHeight: '1100px' }}
  >
    <FloatingPetals count={3} />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5">
          <div className="absolute inset-0 border-2 border-rose-300/25 border-t-rose-300 rounded-full animate-spin" />
          <div
            className="absolute inset-2 border-2 border-amber-300/25 border-b-amber-300 rounded-full animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg diamond-spin">💎</span>
          </div>
        </div>
        <p className="text-rose-300/50 text-[10px] tracking-[0.4em] uppercase font-medium">
          Preparing Elegance
        </p>
      </div>
    </div>
  </div>
);

const SectionLoader = () => (
  <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-20">
    <div className="flex flex-col items-center mb-10">
      <div className="h-1 w-14 bg-gradient-to-r from-rose-300 to-amber-300 rounded-full mb-4 animate-pulse" />
      <div className="h-7 w-44 bg-gradient-to-r from-rose-100 to-amber-100 rounded-xl animate-pulse mb-3" />
      <div className="h-4 w-60 bg-rose-50 rounded-lg animate-pulse" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-64 sm:h-72 bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl animate-pulse"
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}
    </div>
  </div>
);

const StripLoader = () => (
  <div className="h-12 sm:h-14 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 animate-pulse" />
);

// ─── ELEGANT DIVIDER ─────────────────────────────────────────────────────────
const ElegantDivider = ({ variant = 'gems' }) => {
  const [ref, isVisible] = useScrollReveal(0.5);

  if (variant === 'gems') {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-center py-8 sm:py-10 transition-all duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="h-px w-20 sm:w-28 bg-gradient-to-r from-transparent via-rose-300 to-rose-400" />
        <div className="mx-5 sm:mx-6 flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-300 glow-breathe" />
          <div className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-amber-300 to-rose-300 shadow-sm diamond-spin" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-300 glow-breathe" style={{ animationDelay: '1s' }} />
        </div>
        <div className="h-px w-20 sm:w-28 bg-gradient-to-l from-transparent via-amber-300 to-amber-400" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`py-5 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-[200px] mx-auto flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rose-200" />
        <span className="text-rose-300 text-base">✿</span>
        <span className="text-amber-300 text-xs">✦</span>
        <span className="text-rose-300 text-base">✿</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-rose-200" />
      </div>
    </div>
  );
};

// ─── SCROLL REVEAL WRAPPER ────────────────────────────────────────────────────
const ScrollReveal = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const [ref, isVisible] = useScrollReveal();

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'left':  return 'perspective(1000px) translateX(-55px) rotateY(10deg)';
        case 'right': return 'perspective(1000px) translateX(55px) rotateY(-10deg)';
        case 'scale': return 'perspective(1000px) scale3d(0.88,0.88,0.88) rotateY(-8deg)';
        default:      return 'perspective(1000px) translateY(48px) rotateX(6deg)';
      }
    }
    return 'perspective(1000px) translateY(0) translateX(0) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    isVisible ? 1 : 0,
        transform:  getTransform(),
        filter:     isVisible ? 'blur(0px)' : 'blur(3px)',
        transition: `all 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ─── PARALLAX LAYER ───────────────────────────────────────────────────────────
const ParallaxLayer = ({ children, speed = 0.3, className = '' }) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            const rect   = ref.current.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            setOffset((center - window.innerHeight / 2) * speed);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)`, willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

// ─── 3D TILT ─────────────────────────────────────────────────────────────────
const Tilt3D = ({ children, className = '', intensity = 10 }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const onMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width;
    const y    = (e.clientY - rect.top)  / rect.height;
    setStyle({
      transform:  `perspective(1000px) rotateX(${(0.5 - y) * intensity}deg) rotateY(${(x - 0.5) * intensity}deg) scale3d(1.02,1.02,1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  }, [intensity]);

  const onLeave = useCallback(() => {
    setStyle({
      transform:  'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} preserve-3d`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
//  HOME PAGE
// ═════════════════════════════════════════════════════════════════════════════
const Home = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // ─── FIX 1: Scroll to top on every mount (page load / refresh / navigation) ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ─── Mouse parallax tracker ───────────────────────────────────────────────
  useEffect(() => {
    let ticking = false;
    const onMouse = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePos({
            x: (e.clientX / window.innerWidth  - 0.5) * 18,
            y: (e.clientY / window.innerHeight - 0.5) * 18,
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/15 to-white overflow-x-hidden">
      <style>{styles}</style>

      {/* ══════════════════════════════════════════════ */}
      {/* HERO — uses your existing HeroSection component */}
      {/* ══════════════════════════════════════════════ */}
      <Suspense fallback={<HeroLoader />}>
        <HeroSection />
      </Suspense>

      {/* ══════════════════════════════════════════════ */}
      {/* OFFERS STRIP                                  */}
      {/* ══════════════════════════════════════════════ */}
      <Suspense fallback={<StripLoader />}>
        <OffersStrip />
      </Suspense>

      {/* ══════════════════════════════════════════════ */}
      {/* WELCOME SECTION                               */}
      {/* ══════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <FloatingPetals count={4} />

        {/* Background orbs */}
        <ParallaxLayer speed={0.12}>
          <div
            className="absolute -top-24 -right-24 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px]
                       bg-gradient-to-br from-rose-100/35 to-amber-100/25
                       rounded-full blur-3xl morph-blob pointer-events-none"
            style={{ transform: `translate(${mousePos.x * 0.4}px,${mousePos.y * 0.4}px)` }}
          />
        </ParallaxLayer>
        <ParallaxLayer speed={-0.08}>
          <div
            className="absolute -bottom-24 -left-24 w-[350px] sm:w-[420px] h-[350px] sm:h-[420px]
                       bg-gradient-to-tr from-amber-100/25 to-pink-100/25
                       rounded-full blur-3xl morph-blob pointer-events-none"
            style={{ animationDelay: '5s', transform: `translate(${mousePos.x * -0.25}px,${mousePos.y * -0.25}px)` }}
          />
        </ParallaxLayer>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Label */}
          <ScrollReveal>
            <div className="inline-flex items-center gap-3 mb-6 sm:mb-8">
              <div className="h-px w-12 sm:w-14 bg-gradient-to-r from-transparent to-rose-400" />
              <span className="text-rose-500 text-[10px] sm:text-[11px] font-semibold tracking-[0.35em] uppercase">
                Welcome to Arkee
              </span>
              <div className="h-px w-12 sm:w-14 bg-gradient-to-l from-transparent to-rose-400" />
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal delay={150}>
            <h2
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900
                         mb-6 sm:mb-8 leading-[1.1] tracking-tight"
            >
              Where Every Piece
              <span className="block mt-2 sm:mt-3 shimmer-rose-text font-bold">
                Tells a Story
              </span>
            </h2>
          </ScrollReveal>

          {/* Body */}
          <ScrollReveal delay={300}>
            <p className="text-gray-500 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
              Discover handcrafted jewellery that blends timeless tradition with contemporary elegance —
              each piece thoughtfully designed to celebrate your unique beauty.
            </p>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal delay={450}>
            <button className="mt-8 sm:mt-10 px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 text-white font-semibold rounded-full btn-3d-rose text-base sm:text-lg shadow-lg shadow-rose-200/50">
              Explore Collection <span className="ml-1">→</span>
            </button>
          </ScrollReveal>
        </div>
      </section>

      <ElegantDivider variant="gems" />

      {/* ══════════════════════════════════════════════ */}
      {/* CATEGORIES                                    */}
      {/* ══════════════════════════════════════════════ */}
      <Suspense fallback={<SectionLoader />}>
        <ScrollReveal>
          <div className="bg-white py-16 sm:py-20">
            <CategorySection />
          </div>
        </ScrollReveal>
      </Suspense>

      <ElegantDivider variant="rose" />

      {/* ══════════════════════════════════════════════ */}
      {/* FEATURED / NEW LAUNCHES                       */}
      {/* ══════════════════════════════════════════════ */}
      <Suspense fallback={<SectionLoader />}>
        <ScrollReveal>
          <div className="bg-gradient-to-b from-white via-rose-50/8 to-white py-16 sm:py-20">
            <FeaturedProducts />
          </div>
        </ScrollReveal>
      </Suspense>

      {/* ══════════════════════════════════════════════ */}
      {/* CRAFTSMANSHIP BANNER                          */}
      {/* ══════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Dark BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a1e] via-[#12071a] to-[#0f0a1a]" />
        <SparkleField count={10} />
        <FloatingPetals count={3} />

        <ParallaxLayer speed={0.18}>
          <div className="absolute top-10 left-[8%] w-52 h-52 sm:w-64 sm:h-64 bg-rose-500/4 rounded-full blur-3xl pointer-events-none" />
        </ParallaxLayer>
        <ParallaxLayer speed={-0.12}>
          <div className="absolute bottom-10 right-[8%] w-64 h-64 sm:w-80 sm:h-80 bg-amber-500/4 rounded-full blur-3xl pointer-events-none" />
        </ParallaxLayer>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16 md:gap-20 items-center">

            {/* Left – Text */}
            <div className="text-white">
              <ScrollReveal direction="left">
                <span className="text-rose-300 text-[10px] sm:text-[11px] tracking-[0.4em] uppercase font-medium block mb-4 sm:mb-5">
                  Our Craftsmanship
                </span>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={150}>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-8 sm:mb-10 leading-[1.15] tracking-tight">
                  Handmade with
                  <span className="block mt-2 sm:mt-3 shimmer-rose-text font-bold">
                    Passion &amp; Grace
                  </span>
                </h2>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={300}>
                <p className="text-white/48 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 font-light">
                  Every jewellery piece is meticulously crafted by skilled artisans
                  using premium materials and time-honoured techniques.
                </p>
              </ScrollReveal>

              <div className="space-y-4 sm:space-y-5">
                {[
                  { icon: '✦', title: 'Artisan Crafted',   desc: 'Each piece handmade with precision & love',   color: 'from-rose-400 to-pink-400'   },
                  { icon: '◇', title: 'Premium Materials',  desc: 'Ethically sourced gems & finest metals',       color: 'from-amber-400 to-yellow-300' },
                  { icon: '❋', title: 'Timeless Design',   desc: 'Contemporary elegance meets tradition',         color: 'from-pink-300 to-rose-300'   },
                ].map((item, i) => (
                  <ScrollReveal key={i} direction="left" delay={400 + i * 120}>
                    <Tilt3D intensity={5}>
                      <div className="flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl glass-dark hover-glow-rose cursor-default group transition-all duration-300">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${item.color}
                                     flex items-center justify-center text-white text-base sm:text-xl
                                     flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm sm:text-[15px]">{item.title}</p>
                          <p className="text-white/38 text-xs sm:text-sm mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    </Tilt3D>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Right – 3D Floating Elements (desktop only) */}
            <div className="hidden md:block perspective-container">
              <ScrollReveal direction="right" delay={200}>
                <div className="relative w-full h-[400px] lg:h-[450px]">

                  <Tilt3D intensity={14} className="absolute top-[12%] left-[12%]">
                    <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-3xl bg-gradient-to-br from-rose-300/88 to-pink-200/88 float-elegant glow-breathe shadow-2xl border border-rose-200/25 flex items-center justify-center">
                      <span className="text-5xl lg:text-6xl rotate-gem-anim">💎</span>
                    </div>
                  </Tilt3D>

                  <Tilt3D intensity={11} className="absolute bottom-[12%] right-[8%]">
                    <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-3xl bg-gradient-to-br from-amber-200/88 to-yellow-100/88 float-elegant-d1 glow-breathe shadow-xl border border-amber-200/25 flex items-center justify-center">
                      <span className="text-4xl lg:text-5xl rotate-gem-anim" style={{ animationDelay: '3s', animationDuration: '8s' }}>✨</span>
                    </div>
                  </Tilt3D>

                  <Tilt3D intensity={8} className="absolute top-[52%] left-[3%]">
                    <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-pink-200/80 to-rose-100/80 float-elegant-slow glow-breathe shadow-lg border border-pink-200/18 flex items-center justify-center">
                      <span className="text-3xl lg:text-4xl rotate-gem-anim" style={{ animationDelay: '5s', animationDuration: '12s' }}>🌸</span>
                    </div>
                  </Tilt3D>

                  {/* Small accent */}
                  <div
                    className="absolute top-[6%] right-[18%] w-14 h-14 rounded-xl bg-gradient-to-br from-amber-300/55 to-rose-200/55 float-elegant shadow-md border border-white/18 flex items-center justify-center"
                    style={{ animationDelay: '1s' }}
                  >
                    <span className="text-xl diamond-spin">♡</span>
                  </div>

                  {/* Connecting lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" viewBox="0 0 400 450">
                    <defs>
                      <linearGradient id="lineGrad">
                        <stop offset="0%"   stopColor="#f4a3bb" />
                        <stop offset="100%" stopColor="#d4af37" />
                      </linearGradient>
                    </defs>
                    <line x1="120" y1="120" x2="290" y2="310" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="120" y1="270" x2="290" y2="310" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ */}
      {/* WHY CHOOSE US                                 */}
      {/* ══════════════════════════════════════════════ */}
      <Suspense fallback={<SectionLoader />}>
        <ScrollReveal>
          <div className="bg-white py-16 sm:py-20">
            <WhyChooseUs />
          </div>
        </ScrollReveal>
      </Suspense>

      <ElegantDivider variant="gems" />

      {/* ══════════════════════════════════════════════ */}
      {/* LATEST PRODUCTS                               */}
      {/* ══════════════════════════════════════════════ */}
      <Suspense fallback={<SectionLoader />}>
        <ScrollReveal>
          <div className="bg-gradient-to-b from-white to-rose-50/18 py-16 sm:py-20">
            <LatestProducts />
          </div>
        </ScrollReveal>
      </Suspense>

      {/* ══════════════════════════════════════════════ */}
      {/* MATERIALS                                     */}
      {/* ══════════════════════════════════════════════ */}
      <Suspense fallback={<SectionLoader />}>
        <ScrollReveal>
          <MaterialSection />
        </ScrollReveal>
      </Suspense>

      {/* ══════════════════════════════════════════════ */}
      {/* NEWSLETTER CTA                                */}
      {/* ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500" />
        <SparkleField count={8} />
        <FloatingPetals count={5} />

        <ParallaxLayer speed={0.12}>
          <div className="absolute -top-28 -right-28 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] bg-white/4 rounded-full blur-3xl morph-blob pointer-events-none" />
        </ParallaxLayer>
        <ParallaxLayer speed={-0.08}>
          <div className="absolute -bottom-28 -left-28 w-[320px] sm:w-[400px] h-[320px] sm:h-[400px] bg-white/4 rounded-full blur-3xl morph-blob pointer-events-none" style={{ animationDelay: '7s' }} />
        </ParallaxLayer>

        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6 sm:mb-8 glow-breathe">
              <span className="text-2xl sm:text-3xl">💌</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-3 sm:mb-4 tracking-tight leading-tight">
              Get{' '}
              <span className="font-bold text-amber-100 text-glow-anim">20% Off</span>
              <br />
              Your First Order
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <p className="text-white/75 text-base sm:text-lg mb-8 sm:mb-10 max-w-sm mx-auto font-light leading-relaxed">
              Join our community of jewellery lovers for exclusive access to new collections &amp; styling tips.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={450}>
            <Tilt3D intensity={5} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3.5 sm:px-6 sm:py-4 rounded-full
                             bg-white/14 backdrop-blur-md border-2 border-white/28
                             text-white placeholder-white/45 focus:outline-none
                             focus:border-white/65 focus:bg-white/22
                             transition-all duration-300 text-sm sm:text-[15px]"
                />
                <button className="px-7 py-3.5 sm:px-8 sm:py-4 bg-white text-rose-500 font-bold rounded-full btn-3d-rose shadow-xl text-sm sm:text-[15px] whitespace-nowrap">
                  Subscribe ✨
                </button>
              </div>
            </Tilt3D>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <p className="text-white/40 text-xs sm:text-sm mt-5 font-light">
              No spam ever · Unsubscribe anytime
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ */}
      {/* BEST BY US                                    */}
      {/* ══════════════════════════════════════════════ */}
      <Suspense fallback={<SectionLoader />}>
        <ScrollReveal>
          <div className="bg-white py-16 sm:py-20">
            <BestByUs />
          </div>
        </ScrollReveal>
      </Suspense>

      <ElegantDivider variant="rose" />

      {/* ══════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                  */}
      {/* ══════════════════════════════════════════════ */}
      <Suspense fallback={<SectionLoader />}>
        <ScrollReveal>
          <div className="bg-gradient-to-b from-rose-50/18 to-white py-16 sm:py-20">
            <TestimonialsSection />
          </div>
        </ScrollReveal>
      </Suspense>

      {/* ══════════════════════════════════════════════ */}
      {/* BLOG PREVIEW                                  */}
      {/* ══════════════════════════════════════════════ */}
      <Suspense fallback={<SectionLoader />}>
        <ScrollReveal>
          <div className="bg-gradient-to-b from-white to-rose-50/10 py-16 sm:py-20">
            <BlogPreview />
          </div>
        </ScrollReveal>
      </Suspense>

      {/* ══════════════════════════════════════════════ */}
      {/* TRUST INDICATORS                              */}
      {/* ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0a1e] via-[#12071a] to-[#0f0a1a] py-14 sm:py-16">
        <SparkleField count={5} />
        <ParallaxLayer speed={0.08}>
          <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/3 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/3 rounded-full blur-3xl pointer-events-none" />
        </ParallaxLayer>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {[
              { icon: '🎀', title: 'Free Shipping',  desc: 'On orders above ₹999',     color: 'from-rose-400/18 to-pink-400/18'   },
              { icon: '🔄', title: 'Easy Returns',   desc: '7-day hassle-free returns', color: 'from-amber-400/18 to-yellow-400/18' },
              { icon: '🛡️', title: 'Secure Payment', desc: '100% secure checkout',      color: 'from-pink-400/18 to-rose-400/18'   },
              { icon: '💬', title: '24/7 Support',   desc: "We're always here for you", color: 'from-rose-300/18 to-amber-300/18'   },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 90}>
                <Tilt3D intensity={7}>
                  <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 rounded-2xl glass-dark hover-glow-rose transition-all duration-300 cursor-default group">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${item.color}
                                 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0
                                 float-elegant group-hover:scale-110 transition-transform duration-300`}
                      style={{ animationDelay: `${i * 0.5}s` }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-[15px]">{item.title}</p>
                      <p className="text-white/38 text-xs sm:text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </Tilt3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ */}
      {/* FOOTER ACCENT                                 */}
      {/* ══════════════════════════════════════════════ */}
      <footer className="bg-white border-t border-rose-100/45 py-7 sm:py-8 text-center">
        <ScrollReveal>
          <p className="text-gray-400 text-xs sm:text-sm font-light tracking-wide">
            <span className="shimmer-rose-text font-medium">✦ Arkee Jewellery</span>
            <span className="mx-2 text-gray-300">·</span>
            Crafted with love since 2020
          </p>
        </ScrollReveal>
      </footer>
    </div>
  );
};

export default Home;