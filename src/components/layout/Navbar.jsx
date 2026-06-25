// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  TruckIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import toast from 'react-hot-toast';
import ProfessionalSearch from './ProfessionalSearch';
import logo from '../../assets/logo.png';

// ─── NAV STYLES ───────────────────────────────────────────────────────────────
const navStyles = `
  @keyframes navSlideDown {
    from { opacity: 0; transform: perspective(800px) translateY(-20px) rotateX(8deg); filter: blur(4px); }
    to   { opacity: 1; transform: perspective(800px) translateY(0) rotateX(0deg); filter: blur(0); }
  }
  @keyframes navDropdownIn {
    from { opacity: 0; transform: perspective(600px) translateY(-12px) rotateX(6deg) scale(0.96); filter: blur(3px); }
    to   { opacity: 1; transform: perspective(600px) translateY(0) rotateX(0deg) scale(1); filter: blur(0); }
  }
  @keyframes navMobileSlide {
    from { opacity: 0; transform: translateX(100%); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes navItemStagger {
    from { opacity: 0; transform: perspective(600px) translateX(-15px) rotateY(8deg); filter: blur(2px); }
    to   { opacity: 1; transform: perspective(600px) translateX(0) rotateY(0deg); filter: blur(0); }
  }
  @keyframes navBadgePop {
    0%   { transform: scale(0) rotate(-30deg); }
    60%  { transform: scale(1.2) rotate(5deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  @keyframes navShimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes navGlowPulse {
    0%, 100% { box-shadow: 0 0 8px rgba(212,175,55,0.15), 0 0 20px rgba(244,163,187,0.08); }
    50%      { box-shadow: 0 0 16px rgba(212,175,55,0.3), 0 0 35px rgba(244,163,187,0.15); }
  }
  @keyframes navFloatSoft {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-3px); }
  }
  @keyframes navProfileGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.3); }
    50%      { box-shadow: 0 0 0 6px rgba(212,175,55,0); }
  }
  @keyframes navCardReveal {
    from { opacity: 0; transform: perspective(800px) translateZ(-30px) rotateX(5deg); }
    to   { opacity: 1; transform: perspective(800px) translateZ(0) rotateX(0deg); }
  }
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes navUnderlineGrow {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }
  @keyframes iconPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.1); opacity: 0.85; }
  }

  /* ── Utility Classes ── */
  .nav-slide-down    { animation: navSlideDown 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .nav-dropdown      { animation: navDropdownIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards; transform-origin: top center; }
  .nav-mobile-menu   { animation: navMobileSlide 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
  .nav-item-stagger  { animation: navItemStagger 0.35s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
  .nav-badge-pop     { animation: navBadgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .nav-glow-pulse    { animation: navGlowPulse 3s ease-in-out infinite; }
  .nav-float-soft    { animation: navFloatSoft 3s ease-in-out infinite; }
  .nav-profile-glow  { animation: navProfileGlow 2.5s ease-in-out infinite; }
  .nav-card-reveal   { animation: navCardReveal 0.35s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
  .nav-marquee       { animation: marquee 30s linear infinite; }
  .nav-icon-pulse    { animation: iconPulse 2s ease-in-out infinite; }

  .nav-shimmer-text {
    background: linear-gradient(90deg, #f5d5c0 0%, #d4af37 25%, #fff8e7 50%, #d4af37 75%, #f5d5c0 100%);
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: navShimmer 4s linear infinite;
  }

  /* ── 3D Link Hover ── */
  .nav-link-3d {
    position: relative;
    transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
    transform-style: preserve-3d;
  }
  .nav-link-3d::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 100%; height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
    border-radius: 2px;
    transition: transform 0.35s cubic-bezier(0.23,1,0.32,1);
    transform-origin: center;
  }
  .nav-link-3d:hover::after, .nav-link-3d.active::after {
    transform: translateX(-50%) scaleX(0.6);
  }
  .nav-link-3d:hover { transform: perspective(600px) translateZ(5px); }

  /* ── Icon Button 3D ── */
  .nav-icon-btn {
    transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
    transform-style: preserve-3d;
    position: relative;
  }
  .nav-icon-btn::before {
    content: '';
    position: absolute; inset: -2px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(244,163,187,0.15));
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: scale(0.8); z-index: -1;
  }
  .nav-icon-btn:hover { transform: perspective(600px) translateZ(8px) rotateX(-3deg); }
  .nav-icon-btn:hover::before { opacity: 1; transform: scale(1.1); }
  .nav-icon-btn:active { transform: perspective(600px) translateZ(2px) scale(0.95); }

  /* ── CTA Button 3D ── */
  .nav-cta-3d {
    position: relative; overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
    transform-style: preserve-3d;
  }
  .nav-cta-3d::before {
    content: '';
    position: absolute; top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.15); border-radius: 50%;
    transform: translate(-50%,-50%);
    transition: width 0.5s ease, height 0.5s ease;
  }
  .nav-cta-3d:hover {
    transform: perspective(800px) translateY(-2px) rotateX(4deg) scale(1.03);
    box-shadow: 0 10px 25px rgba(212,175,55,0.25), 0 4px 10px rgba(0,0,0,0.08);
  }
  .nav-cta-3d:hover::before { width: 200px; height: 200px; }
  .nav-cta-3d:active { transform: perspective(800px) translateY(0) rotateX(1deg) scale(0.98); }

  /* ── Dropdown item hover ── */
  .nav-more-item {
    transition: all 0.25s cubic-bezier(0.23,1,0.32,1);
    transform-style: preserve-3d;
  }
  .nav-more-item:hover {
    transform: perspective(600px) translateX(3px) translateZ(4px);
    background: linear-gradient(135deg, rgba(251,243,230,0.7), rgba(255,255,255,0.95));
  }

  /* ── Mobile item ── */
  .nav-mobile-item { transition: all 0.3s cubic-bezier(0.23,1,0.32,1); transform-style: preserve-3d; }
  .nav-mobile-item:active { transform: perspective(600px) scale(0.97) rotateX(2deg); }

  /* ── Search bar ── */
  .nav-search-bar {
    transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
  }
  .nav-search-bar:hover {
    background: rgba(255,251,235,0.6);
    border-color: rgba(217,119,6,0.35);
    box-shadow: 0 0 0 3px rgba(217,119,6,0.06);
    transform: perspective(600px) translateZ(3px);
  }

  /* ── Glass Effects ── */
  .nav-glass      { backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); }
  .nav-glass-dark { backdrop-filter: blur(16px) saturate(150%); -webkit-backdrop-filter: blur(16px) saturate(150%); }

  /* ── Scrolled / Default ── */
  .nav-scrolled {
    background: rgba(255,255,255,0.94);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 4px 30px rgba(212,175,55,0.08), 0 1px 3px rgba(0,0,0,0.04);
  }
  .nav-default { background: rgba(255,255,255,0.98); box-shadow: 0 1px 2px rgba(0,0,0,0.03); }

  .preserve-3d { transform-style: preserve-3d; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ─── DATA: MORE DROPDOWN ──────────────────────────────────────────────────────
const moreItems = [
  {
    label: 'Contact Us',
    desc: 'Get in touch with our team',
    path: '/contact',
    Icon: ChatBubbleLeftRightIcon,
    iconClass: 'text-sky-500',
    iconBgClass: 'from-sky-50 to-blue-50',
    iconBorderClass: 'border-sky-100',
    tag: 'Reach Out',
    tagClasses: 'bg-sky-50 border-sky-200 text-sky-600',
  },
  {
    label: 'Bestsellers',
    desc: 'Loved by thousands of women',
    path: '/products?category=bestsellers',
    Icon: FireIcon,
    iconClass: 'text-orange-500',
    iconBgClass: 'from-orange-50 to-amber-50',
    iconBorderClass: 'border-orange-100',
    tag: 'Popular',
    tagClasses: 'bg-orange-50 border-orange-200 text-orange-600',
  },
  {
    label: 'Bridal',
    desc: 'Curated for your special day',
    path: '/products?category=bridal',
    Icon: SparklesIcon,
    iconClass: 'text-rose-500',
    iconBgClass: 'from-rose-50 to-pink-50',
    iconBorderClass: 'border-rose-100',
    tag: 'Exclusive',
    tagClasses: 'bg-rose-50 border-rose-200 text-rose-600',
  },
  {
    label: 'New Arrivals',
    desc: 'Perfect for every occasion',
    path: '/products?category=new-arrivals',
    Icon: StarIcon,
    iconClass: 'text-violet-500',
    iconBgClass: 'from-violet-50 to-purple-50',
    iconBorderClass: 'border-violet-100',
    tag: 'NewArrivals',
    tagClasses: 'bg-violet-50 border-violet-200 text-violet-600',
  },
  {
    label: 'Sale',
    desc: 'Up to 40% off select pieces',
    path: '/products?category=sale',
    Icon: TagIcon,
    iconClass: 'text-emerald-500',
    iconBgClass: 'from-emerald-50 to-teal-50',
    iconBorderClass: 'border-emerald-100',
    tag: 'Limited',
    tagClasses: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  },
];

// ─── DATA: NAV LINKS ─────────────────────────────────────────────────────────
const navLinks = [
  { label: 'Home',         path: '/' },
  { label: 'Categories',   path: '/products' },
  { label: 'Journal',      path: '/blogs' },
  { label: 'Gift Sets',    path: '/gift-sets'},
];

// ─── DATA: ANNOUNCEMENTS ─────────────────────────────────────────────────────
const announcements = [
  { Icon: TruckIcon,       text: 'Free shipping above ₹999'         },
  { Icon: TagIcon,         text: 'Code ARKEE10 — exclusive discount' },
  { Icon: SparklesIcon,    text: 'New arrivals every Friday'         },
  { Icon: CheckBadgeIcon,  text: '100% Handcrafted with Love'       },
  { Icon: ArrowPathIcon,   text: 'Easy 7-day returns'               },
  { Icon: LockClosedIcon,  text: 'Secure & safe payments'           },
];

// ─── DATA: PROFILE MENU ──────────────────────────────────────────────────────
const profileMenuItems = [
  { label: 'My Profile',  path: '/profile',   Icon: UserCircleIcon,            iconClass: 'text-amber-500',  bgClass: 'bg-amber-50'  },
  { label: 'My Orders',   path: '/my-orders', Icon: ClipboardDocumentListIcon, iconClass: 'text-blue-500',   bgClass: 'bg-blue-50'   },
  { label: 'Saved Items', path: '/wishlist',  Icon: HeartIcon,                 iconClass: 'text-rose-500',   bgClass: 'bg-rose-50'   },
  { label: 'My Bank Details',    path: '/bank-details',  Icon: CreditCardIcon,             iconClass: 'text-gray-400',   bgClass: 'bg-gray-100'  },
];

// ═════════════════════════════════════════════════════════════════════════════
//  NAVBAR COMPONENT
// ══════════════════════════════
const Navbar = () => {
  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [isScrolled,   setIsScrolled]    = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen]  = useState(false);
  const [isMoreOpen,   setIsMoreOpen]    = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems: cartItems }     = useCartStore();
  const { totalItems: wishlistItems } = useWishlistStore();

  const navigate   = useNavigate();
  const location   = useLocation();
  const profileRef = useRef(null);
  const moreRef    = useRef(null);
  const moreTOut   = useRef(null);

  // ── Scroll detection ──
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setIsScrolled(window.scrollY > 30); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Close everything on route change ──
  useEffect(() => {
    setIsMenuOpen(false); setIsProfileOpen(false);
    setIsSearchOpen(false); setIsMoreOpen(false);
  }, [location.pathname]);

  // ── Click outside ──
  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
      if (moreRef.current    && !moreRef.current.contains(e.target))    setIsMoreOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ── Escape key ──
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false); setIsMenuOpen(false);
        setIsMoreOpen(false); setIsProfileOpen(false);
      }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  // ── Keyboard shortcut Ctrl/Cmd+K for search ──
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsSearchOpen(true); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  // ── Lock scroll on mobile menu ──
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // ── More dropdown with hover delay ──
  const openMore  = useCallback(() => { clearTimeout(moreTOut.current); setIsMoreOpen(true);  }, []);
  const closeMore = useCallback(() => { moreTOut.current = setTimeout(() => setIsMoreOpen(false), 150); }, []);

  const handleLogout = () => { logout(); toast.success('Logged out successfully'); navigate('/'); };
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path.split('?')[0]);

  return (
    <>
      <style>{navStyles}</style>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ANNOUNCEMENT BAR                                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="relative bg-gradient-to-r from-[#1a0a14] via-[#2d1020] to-[#1a0a14] text-white py-[9px] overflow-hidden">
        {/* Sparkle dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400/25 nav-float-soft"
              style={{ left: `${18 + i * 22}%`, top: `${25 + (i % 2) * 45}%`, animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>

        {/* Scrolling marquee */}
        <div className="flex overflow-hidden select-none">
          <div className="nav-marquee flex items-center whitespace-nowrap">
            {[...announcements, ...announcements].map((item, i) => {
              const AIcon = item.Icon;
              return (
                <span key={i} className="inline-flex items-center gap-2 px-6 text-[10px] sm:text-[11px] font-light tracking-[0.18em] uppercase">
                  <AIcon className="w-3 h-3 text-amber-400/70 flex-shrink-0" />
                  <span className="text-amber-100/80">{item.text}</span>
                  <span className="text-amber-600/35 text-[5px] ml-2">✦</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MAIN NAVBAR                                                     */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'nav-scrolled' : 'nav-default'}`}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">

            {/* ─── LOGO ─────────────────────────────────────────────── */}
            <Link to="/" className="flex-shrink-0 group relative inline-flex items-center justify-center" aria-label="Arkee Home">
              <span className="absolute inset-0 rounded-2xl blur-2xl pointer-events-none transition-all duration-500 bg-amber-200/20 group-hover:bg-amber-300/35 scale-110" />
              <span className="absolute inset-0 rounded-xl blur-md pointer-events-none transition-all duration-500 bg-yellow-100/15 group-hover:bg-yellow-200/30" />
              <img
                src={logo} alt="Arkee"
                className="relative h-12 sm:h-14 md:h-16 w-auto object-contain
                           group-hover:scale-105 transition-transform duration-400
                           drop-shadow-sm group-hover:drop-shadow-md"
                loading="eager" draggable={false}
              />
            </Link>

            {/* ─── DESKTOP NAV LINKS ────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link, i) => (
                <React.Fragment key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link-3d relative inline-flex items-center gap-1.5 px-4 xl:px-5 py-2
                               text-[11px] font-sans tracking-[0.18em] uppercase ${
                      isActive(link.path)
                        ? 'text-amber-800 font-semibold active'
                        : 'text-gray-500 hover:text-amber-700'
                    }`}
                  >
                    {link.label}
                    {link.badge && (
                      <span className="text-[7px] font-bold tracking-wider text-white bg-rose-500 px-1.5 py-[3px] rounded-full uppercase leading-none">
                        {link.badge}
                      </span>
                    )}
                    {isActive(link.path) && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500 nav-glow-pulse" />
                    )}
                  </Link>
                  {i < navLinks.length - 1 && (
                    <span className="text-amber-200/50 text-[5px] select-none mx-0.5">●</span>
                  )}
                </React.Fragment>
              ))}

              <span className="text-amber-200/50 text-[5px] select-none mx-0.5">●</span>

              {/* ── MORE DROPDOWN ── */}
              <div className="relative" ref={moreRef} onMouseEnter={openMore} onMouseLeave={closeMore}>
                <button
                  className={`nav-link-3d relative flex items-center gap-1 px-4 xl:px-5 py-2
                             text-[11px] font-sans tracking-[0.18em] uppercase group ${
                    isMoreOpen ? 'text-amber-800 font-semibold active' : 'text-gray-500 hover:text-amber-700'
                  }`}
                  aria-expanded={isMoreOpen}
                  aria-haspopup="true"
                >
                  More
                  <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${isMoreOpen ? 'rotate-180 text-amber-600' : 'group-hover:text-amber-600'}`} />
                </button>

                {/* ── DROPDOWN PANEL ── */}
                {isMoreOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[330px] z-50 nav-dropdown">
                    {/* Arrow */}
                    <div className="relative w-full flex justify-center -mb-1.5 z-10">
                      <div className="w-3 h-3 rotate-45 bg-white border-l border-t border-amber-100/70 shadow-sm" />
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl shadow-amber-900/10 border border-amber-100/60 overflow-hidden">
                      {/* Dropdown Header */}
                      <div className="relative bg-gradient-to-r from-[#1a0a14] via-[#2d1020] to-[#1a0a14] px-5 py-3.5 overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-amber-400/30 nav-float-soft"
                              style={{ left: `${22 + i * 28}%`, top: `${30 + (i % 2) * 35}%`, animationDelay: `${i * 0.4}s` }} />
                          ))}
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-2">
                            <SparklesIcon className="w-3.5 h-3.5 text-amber-400 nav-icon-pulse" />
                            <p className="text-[10px] tracking-[0.22em] uppercase text-amber-200/80 font-sans font-medium">
                              Shop by Collection
                            </p>
                          </div>
                          <span className="text-[9px] text-amber-400/60 font-light tracking-wide">{moreItems.length} collections</span>
                        </div>
                      </div>

                      {/* Dropdown Items */}
                      <ul className="py-2">
                        {moreItems.map((item, idx) => {
                          const ItemIcon = item.Icon;
                          return (
                            <li key={item.label} className="nav-card-reveal" style={{ animationDelay: `${idx * 45}ms` }}>
                              <Link
                                to={item.path}
                                onClick={() => setIsMoreOpen(false)}
                                className="nav-more-item flex items-center gap-3.5 px-4 py-3 group/row"
                              >
                                {/* Colored icon container */}
                                <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.iconBgClass} border ${item.iconBorderClass}
                                               flex items-center justify-center flex-shrink-0 shadow-sm
                                               group-hover/row:scale-110 group-hover/row:shadow-md transition-all duration-300`}>
                                  <ItemIcon className={`w-5 h-5 ${item.iconClass}`} strokeWidth={1.5} />
                                </span>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-[12.5px] font-semibold text-gray-700 group-hover/row:text-amber-800 tracking-wide transition-colors leading-none">
                                    {item.label}
                                  </p>
                                  <p className="text-[10.5px] text-gray-400 font-light mt-1.5 leading-none">
                                    {item.desc}
                                  </p>
                                </div>

                                {/* Colored tag */}
                                <span className={`flex-shrink-0 text-[8px] font-bold tracking-widest uppercase px-2.5 py-[3px] rounded-full border ${item.tagClasses}`}>
                                  {item.tag}
                                </span>
                              </Link>
                              {idx < moreItems.length - 1 && (
                                <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
                              )}
                            </li>
                          );
                        })}
                      </ul>

                      {/* Dropdown Footer */}
                      <div className="border-t border-amber-100/50 px-5 py-3 flex items-center justify-between bg-gradient-to-r from-amber-50/40 to-rose-50/25">
                        <p className="text-[10px] text-gray-400 font-light flex items-center gap-1.5 italic">
                          <SparklesIcon className="w-3 h-3 text-rose-300 flex-shrink-0" />
                          New drops every Friday
                        </p>
                        <Link
                          to="/products"
                          onClick={() => setIsMoreOpen(false)}
                          className="text-[10px] font-bold tracking-widest uppercase text-amber-700 hover:text-amber-900
                                     flex items-center gap-0.5 transition-colors group/link"
                        >
                          View All
                          <ChevronRightIcon className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ─── RIGHT ICONS ──────────────────────────────────────── */}
            <div className="flex items-center gap-0.5 sm:gap-1">

              {/* Desktop Search Bar (styled like an input) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="nav-search-bar hidden lg:flex items-center gap-2.5 px-3.5 py-2 mr-1
                           rounded-xl border border-gray-200 text-gray-400 group cursor-text"
                aria-label="Search"
                title="Search products (⌘K)"
              >
                <MagnifyingGlassIcon className="w-4 h-4 group-hover:text-amber-600 transition-colors flex-shrink-0" />
                <span className="text-[11px] font-light text-gray-400 group-hover:text-amber-600 transition-colors whitespace-nowrap">
                  Search jewellery...
                </span>
                <kbd className="ml-1 flex items-center gap-0.5 text-[9px] font-mono bg-gray-100 text-gray-400
                               px-1.5 py-0.5 rounded border border-gray-200
                               group-hover:bg-amber-50 group-hover:border-amber-200 group-hover:text-amber-600
                               transition-all">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden nav-icon-btn p-2.5 rounded-full text-gray-500 hover:text-amber-700"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-[18px] h-[18px]" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="nav-icon-btn relative p-2.5 rounded-full text-gray-500 hover:text-rose-500"
                aria-label={`Wishlist${wishlistItems > 0 ? ` (${wishlistItems})` : ''}`}
              >
                <HeartIcon className="w-[18px] h-[18px] sm:w-5 sm:h-5" strokeWidth={1.6} />
                {wishlistItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 nav-badge-pop bg-gradient-to-br from-rose-500 to-pink-500
                                   text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center
                                   font-bold shadow-md shadow-rose-500/30">
                    {wishlistItems > 9 ? '9+' : wishlistItems}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="nav-icon-btn relative p-2.5 rounded-full text-gray-500 hover:text-amber-700"
                aria-label={`Cart${cartItems > 0 ? ` (${cartItems} items)` : ''}`}
              >
                <ShoppingBagIcon className="w-[18px] h-[18px] sm:w-5 sm:h-5" strokeWidth={1.6} />
                {cartItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 nav-badge-pop bg-gradient-to-br from-amber-500 to-yellow-500
                                   text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center
                                   font-bold shadow-md shadow-amber-500/30">
                    {cartItems > 9 ? '9+' : cartItems}
                  </span>
                )}
              </Link>

              {/* ── Profile / Sign In ── */}
              {isAuthenticated ? (
                <div className="relative ml-0.5 sm:ml-1" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="nav-icon-btn flex items-center gap-1.5 p-1 rounded-full"
                    aria-label="Account menu"
                    aria-expanded={isProfileOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-400
                                    flex items-center justify-center text-white font-semibold text-xs
                                    shadow-md nav-profile-glow">
                      {user?.firstname?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDownIcon className={`w-3 h-3 text-gray-400 hidden md:block transition-transform duration-250 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 z-50 nav-dropdown">
                      <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden">

                        {/* User info header */}
                        <div className="px-5 py-4 bg-gradient-to-br from-amber-50/80 via-white to-rose-50/60 border-b border-amber-100/40">
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-rose-400
                                              flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {user?.firstname?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-semibold text-gray-900 truncate leading-none">
                                {user?.firstname} {user?.lastname}
                              </p>
                              <p className="text-[11px] text-gray-400 truncate mt-1.5 leading-none">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1.5">
                          {profileMenuItems.map((item, i) => {
                            const ItemIcon = item.Icon;
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                className="nav-card-reveal nav-more-item flex items-center gap-3 px-4 py-2.5 group/item"
                                style={{ animationDelay: `${i * 40}ms` }}
                              >
                                <span className={`w-7 h-7 rounded-lg ${item.bgClass} flex items-center justify-center flex-shrink-0`}>
                                  <ItemIcon className={`w-[15px] h-[15px] ${item.iconClass}`} strokeWidth={1.6} />
                                </span>
                                <span className="text-[12.5px] text-gray-600 group-hover/item:text-amber-800 font-medium transition-colors flex-1 leading-none">
                                  {item.label}
                                </span>
                                <ChevronRightIcon className="w-3 h-3 text-gray-300 group-hover/item:text-amber-400 group-hover/item:translate-x-0.5 transition-all flex-shrink-0" />
                              </Link>
                            );
                          })}
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-gray-100 p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12.5px]
                                       text-red-500 hover:bg-red-50 transition-all duration-200 font-medium group/out"
                          >
                            <span className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover/out:bg-red-100 transition-colors">
                              <ArrowRightOnRectangleIcon className="w-[15px] h-[15px] text-red-400" strokeWidth={1.6} />
                            </span>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 ml-1.5 sm:ml-2 nav-cta-3d
                             bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500
                             text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full
                             text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] uppercase
                             shadow-lg shadow-amber-500/20"
                >
                  <UserIcon className="w-3.5 h-3.5" strokeWidth={2} />
                  Sign In
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden nav-icon-btn p-2.5 rounded-full ml-0.5"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                <div className="relative w-5 h-5">
                  <span className={`absolute left-0 h-[1.5px] w-5 bg-gray-700 rounded-full transition-all duration-300 ${isMenuOpen ? 'top-[9px] rotate-45' : 'top-[3px]'}`} />
                  <span className={`absolute left-0 top-[9px] h-[1.5px] w-5 bg-gray-700 rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
                  <span className={`absolute left-0 h-[1.5px] w-5 bg-gray-700 rounded-full transition-all duration-300 ${isMenuOpen ? 'top-[9px] -rotate-45' : 'top-[15px]'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom accent line (visible when scrolled) */}
        <div className={`absolute bottom-0 left-0 w-full h-px transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-full bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MOBILE MENU OVERLAY                                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/35 nav-glass-dark"
            onClick={() => setIsMenuOpen(false)}
            style={{ animation: 'navSlideDown 0.2s ease-out' }}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 z-50 w-[85vw] max-w-[380px] h-full bg-white shadow-2xl shadow-black/20 nav-mobile-menu overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white/95 nav-glass border-b border-amber-100/40">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <img src={logo} alt="Arkee" className="h-10 w-auto object-contain" loading="eager" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="nav-icon-btn w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-4 h-4 text-gray-600" strokeWidth={2} />
              </button>
            </div>

            <div className="px-5 py-5 space-y-1.5">
              {/* Main Nav Links */}
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`nav-item-stagger nav-mobile-item flex items-center justify-between
                             px-4 py-3.5 rounded-2xl text-[13px] font-sans tracking-wide uppercase
                             transition-all duration-250 ${
                    isActive(link.path)
                      ? 'text-amber-900 bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/60 font-semibold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50/80 border border-transparent'
                  }`}
                  style={{ animationDelay: `${i * 55}ms` }}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[7px] font-bold tracking-wider text-white bg-rose-500 px-1.5 py-0.5 rounded-full uppercase">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Divider */}
              <div className="pt-4 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0" />
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-200/60 to-transparent" />
                </div>
              </div>

              {/* Collections Label */}
              <p className="text-[10px] tracking-[0.22em] uppercase text-amber-500/80 font-sans font-semibold px-4 pt-1 pb-0.5">
                Collections
              </p>

              {/* More Items */}
              {moreItems.map((item, i) => {
                const ItemIcon = item.Icon;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="nav-item-stagger nav-mobile-item flex items-center gap-3.5 px-4 py-3 rounded-2xl group/mob"
                    style={{ animationDelay: `${(navLinks.length + i) * 55}ms` }}
                  >
                    <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.iconBgClass} border ${item.iconBorderClass}
                                   flex items-center justify-center flex-shrink-0 shadow-sm
                                   group-hover/mob:scale-110 transition-transform`}>
                      <ItemIcon className={`w-[18px] h-[18px] ${item.iconClass}`} strokeWidth={1.5} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-gray-700 font-medium tracking-wide group-hover/mob:text-amber-800 transition-colors leading-none">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-gray-400 font-light mt-1.5 leading-none">
                        {item.desc}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 text-[8px] font-bold tracking-widest uppercase px-2 py-[3px] rounded-full border ${item.tagClasses}`}>
                      {item.tag}
                    </span>
                  </Link>
                );
              })}

              {/* Auth Buttons (unauthenticated) */}
              {!isAuthenticated && (
                <div className="pt-5 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
                    <SparklesIcon className="w-3 h-3 text-rose-300/80 flex-shrink-0" />
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-200/60 to-transparent" />
                  </div>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="nav-cta-3d flex items-center justify-center gap-2 w-full py-3.5
                               bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400
                               text-white rounded-2xl text-[13px] font-semibold tracking-wide
                               shadow-lg shadow-amber-500/25"
                  >
                    <UserIcon className="w-4 h-4" strokeWidth={2} />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3.5 bg-gray-100
                               text-gray-700 rounded-2xl text-[13px] font-medium
                               hover:bg-gray-200 transition-colors tracking-wide"
                  >
                    Create Account
                  </Link>
                </div>
              )}

              {/* Profile (authenticated) */}
              {isAuthenticated && (
                <div className="pt-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
                    <SparklesIcon className="w-3 h-3 text-rose-300/80 flex-shrink-0" />
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-200/60 to-transparent" />
                  </div>

                  {/* User Card */}
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-amber-50/80 to-rose-50/60 border border-amber-100/40 mb-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-rose-400
                                      flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {user?.firstname?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate leading-none">
                        {user?.firstname} {user?.lastname}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate mt-1.5 leading-none">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Links */}
                  <div className="space-y-1">
                    {profileMenuItems.slice(0, 3).map((item) => {
                      const ItemIcon = item.Icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="nav-mobile-item flex items-center gap-3 px-4 py-2.5 rounded-xl
                                     text-[13px] text-gray-600 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                        >
                          <span className={`w-7 h-7 rounded-lg ${item.bgClass} flex items-center justify-center flex-shrink-0`}>
                            <ItemIcon className={`w-[15px] h-[15px] ${item.iconClass}`} strokeWidth={1.6} />
                          </span>
                          {item.label}
                        </Link>
                      );
                    })}

                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <ArrowRightOnRectangleIcon className="w-[15px] h-[15px] text-red-400" strokeWidth={1.6} />
                      </span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Footer */}
            <div className="sticky bottom-0 px-5 py-4 mt-auto bg-white/95 nav-glass border-t border-amber-100/30">
              <p className="text-[10px] text-gray-400 text-center tracking-wide font-light">
                <span className="nav-shimmer-text font-medium">✦ Arkee Jewellery</span>
                <span className="mx-1.5 text-gray-300">·</span>
                Crafted with love since 2020
              </p>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SEARCH MODAL                                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <ProfessionalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;