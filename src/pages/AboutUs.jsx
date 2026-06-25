import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  StarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { miscService } from '../api/services/miscService';

// ─── Fallback Data ────────────────────────────────────────────────────────────
const fallbackData = {
  title: 'About Arkee',
  tagline: 'Crafting Stories Through Jewellery',
  description:
    'Arkee was born from a deep love for handcrafted jewellery and a desire to make artisanal pieces accessible to every woman. Each piece in our collection tells a story — of skilled artisans, timeless traditions, and modern elegance.',
  mission:
    'Our mission is to celebrate the art of jewellery-making by connecting passionate artisans with women who appreciate beauty, craftsmanship, and authenticity.',
  vision:
    'To become India\'s most loved jewellery brand — where every woman finds a piece that feels like it was made just for her.',
  foundedYear: '2020',
  teamSize: '50+',
  happyCustomers: '10,000+',
  productsCount: '500+',
  founderName: 'Priya Sharma',
  founderMessage:
    'I started Arkee with a simple dream — to bring the magic of handcrafted jewellery to every home. Every piece we create carries the soul of the artisan who made it.',
  founderImage: '',
  heroImage: '',
  values: [
    {
      title: 'Authenticity',
      description: 'Every piece is genuine, handcrafted with love and care.',
      icon: 'shield',
    },
    {
      title: 'Craftsmanship',
      description: 'We work with skilled artisans who pour their heart into every detail.',
      icon: 'sparkles',
    },
    {
      title: 'Sustainability',
      description: 'We source responsibly and package eco-consciously.',
      icon: 'globe',
    },
    {
      title: 'Community',
      description: 'We uplift artisan communities across India.',
      icon: 'users',
    },
  ],
};

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const iconMap = {
  shield: ShieldCheckIcon,
  sparkles: SparklesIcon,
  globe: GlobeAltIcon,
  users: UserGroupIcon,
  heart: HeartIcon,
  star: StarIcon,
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ value, label, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-rose-100 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-3">
      <Icon className="w-6 h-6 text-rose-400" />
    </div>
    <p className="text-3xl font-bold font-serif text-gray-800">{value}</p>
    <p className="text-sm text-gray-500 mt-1 text-center">{label}</p>
  </div>
);

// ─── Value Card ───────────────────────────────────────────────────────────────
const ValueCard = ({ title, description, iconKey }) => {
  const Icon = iconMap[iconKey] || SparklesIcon;
  return (
    <div className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-blush-100 flex items-center justify-center mb-4 group-hover:from-rose-200 group-hover:to-blush-200 transition-all">
        <Icon className="w-6 h-6 text-rose-500" />
      </div>
      <h3 className="font-serif font-bold text-gray-800 text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const AboutSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-80 bg-gray-200 rounded-3xl" />
    <div className="max-w-2xl mx-auto space-y-4 text-center">
      <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
      <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto" />
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-36 bg-gray-200 rounded-2xl" />
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AboutUs = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await miscService.getAboutUs();
        const about = res?.data?.data || res?.data || null;
        setData(about || fallbackData);
      } catch {
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const about = data || fallbackData;

  const stats = [
    {
      value: about.foundedYear || '2020',
      label: 'Founded',
      icon: StarIcon,
    },
    {
      value: about.happyCustomers || '10,000+',
      label: 'Happy Customers',
      icon: HeartIcon,
    },
    {
      value: about.productsCount || '500+',
      label: 'Unique Products',
      icon: SparklesIcon,
    },
    {
      value: about.teamSize || '50+',
      label: 'Team Members',
      icon: UserGroupIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-gray-900 via-rose-950 to-blush-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gold-300"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random(),
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <span className="inline-block text-gold-300 font-medium text-sm uppercase tracking-widest mb-4">
            ✨ Our Story
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {about.tagline || 'Crafting Stories'}{' '}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-rose-300 to-blush-300">
              Through Jewellery
            </span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {about.description}
          </p>

          {/* Scroll Indicator */}
          <div className="mt-12 flex justify-center">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
              <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {loading ? (
          <div className="py-16">
            <AboutSkeleton />
          </div>
        ) : (
          <>
            {/* ── Stats ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-10 relative z-10 mb-16">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* ── Mission & Vision ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {/* Mission */}
              <div className="bg-gradient-to-br from-rose-500 to-blush-600 text-white rounded-3xl p-8 md:p-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-4">
                  Our Mission
                </h2>
                <p className="text-white/85 leading-relaxed text-sm md:text-base">
                  {about.mission}
                </p>
              </div>

              {/* Vision */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl p-8 md:p-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                  <GlobeAltIcon className="w-6 h-6 text-gold-300" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-4">
                  Our Vision
                </h2>
                <p className="text-white/85 leading-relaxed text-sm md:text-base">
                  {about.vision}
                </p>
              </div>
            </div>

            {/* ── Values ─────────────────────────────────────────────────── */}
            <div className="mb-16">
              <div className="text-center mb-10">
                <span className="text-rose-500 font-medium text-sm uppercase tracking-widest">
                  What We Stand For
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                  Our Core{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-blush-500">
                    Values
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(about.values || fallbackData.values).map((value, i) => (
                  <ValueCard
                    key={i}
                    title={value.title}
                    description={value.description}
                    iconKey={value.icon}
                  />
                ))}
              </div>
            </div>

            {/* ── Founder Section ────────────────────────────────────────── */}
            {about.founderName && (
              <div className="mb-16 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Founder Image */}
                  <div className="relative bg-gradient-to-br from-rose-100 to-blush-100 min-h-[300px] flex items-center justify-center">
                    {about.founderImage ? (
                      <img
                        src={about.founderImage}
                        alt={about.founderName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 py-12">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-400 to-blush-500 flex items-center justify-center shadow-xl">
                          <span className="text-5xl font-bold text-white font-serif">
                            {about.founderName?.charAt(0)}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="font-serif font-bold text-gray-800 text-xl">
                            {about.founderName}
                          </p>
                          <p className="text-rose-500 text-sm font-medium mt-1">
                            Founder & CEO
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Founder Message */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <span className="text-rose-500 font-medium text-sm uppercase tracking-widest mb-3">
                      A Word From Our Founder
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                      Built With Love,{' '}
                      <span className="text-rose-500">For You</span>
                    </h2>
                    <blockquote className="relative">
                      <span className="absolute -top-4 -left-2 text-6xl text-rose-200 font-serif leading-none">
                        "
                      </span>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base pl-6 italic">
                        {about.founderMessage}
                      </p>
                      <span className="text-6xl text-rose-200 font-serif leading-none float-right -mt-4">
                        "
                      </span>
                    </blockquote>
                    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-blush-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {about.founderName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {about.founderName}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Founder & CEO, Arkee
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Why Choose Us ──────────────────────────────────────────── */}
            <div className="mb-16">
              <div className="text-center mb-10">
                <span className="text-rose-500 font-medium text-sm uppercase tracking-widest">
                  Why Arkee
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                  The Arkee{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-blush-500">
                    Difference
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: ShieldCheckIcon,
                    title: '100% Authentic',
                    description:
                      'Every piece is certified authentic and quality-checked before reaching you.',
                    color: 'from-blue-500 to-indigo-500',
                    bg: 'bg-blue-50',
                    text: 'text-blue-500',
                  },
                  {
                    icon: TruckIcon,
                    title: 'Fast Delivery',
                    description:
                      'Free shipping on orders above ₹999. Delivered safely to your doorstep.',
                    color: 'from-green-500 to-emerald-500',
                    bg: 'bg-green-50',
                    text: 'text-green-500',
                  },
                  {
                    icon: HeartIcon,
                    title: 'Made With Love',
                    description:
                      'Each jewellery piece is handcrafted by skilled artisans across India.',
                    color: 'from-rose-500 to-blush-500',
                    bg: 'bg-rose-50',
                    text: 'text-rose-500',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="text-center p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div
                      className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className={`w-8 h-8 ${item.text}`} />
                    </div>
                    <h3 className="font-serif font-bold text-gray-800 text-xl mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CTA ────────────────────────────────────────────────────── */}
            <div className="mb-16 bg-gradient-to-br from-rose-500 via-blush-500 to-gold-500 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <span className="text-4xl block mb-4">💎</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Find Your Perfect Piece
                </h2>
                <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                  Explore our handpicked collection of jewellery — crafted with
                  love, designed for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 bg-white text-rose-500 font-semibold px-8 py-3.5 rounded-2xl hover:bg-rose-50 transition-colors shadow-lg text-sm"
                  >
                    Shop Now
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/30 transition-colors text-sm"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AboutUs;