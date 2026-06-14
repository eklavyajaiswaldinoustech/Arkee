import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const slides = [
  {
    id: 1,
    title: 'Timeless Elegance',
    subtitle: 'Crafted For You',
    description: 'Discover our handcrafted jewellery collection — where tradition meets modern artistry.',
    cta: 'Shop Now',
    ctaLink: '/products',
    secondaryCta: 'View Collections',
    secondaryLink: '/products?type=collection',
    bg: 'from-rose-100 via-pink-50 to-amber-50',
    accent: 'text-rose-500',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop',
    badge: '✨ New Arrivals',
  },
  {
    id: 2,
    title: 'Oxidised Silver',
    subtitle: 'Bohemian Soul',
    description: 'Bold, artistic and deeply beautiful — our oxidised range speaks to the free-spirited woman.',
    cta: 'Explore Range',
    ctaLink: '/products?type=oxidized',
    secondaryCta: 'View Lookbook',
    secondaryLink: '/blogs',
    bg: 'from-gray-100 via-rose-50 to-pink-50',
    accent: 'text-pink-600',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop',
    badge: '🔥 Trending',
  },
  {
    id: 3,
    title: 'Festival Season',
    subtitle: 'Shine Brighter',
    description: 'Celebrate every occasion with stunning jewellery that makes you the centre of attention.',
    cta: 'Shop Festive',
    ctaLink: '/products?type=festive',
    secondaryCta: 'See Offers',
    secondaryLink: '/offers',
    bg: 'from-amber-50 via-rose-50 to-pink-50',
    accent: 'text-amber-600',
    image: 'https://images.unsplash.com/photo-1601821765780-754fa98637be?w=800&auto=format&fit=crop',
    badge: '🎉 Festival Special',
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      <div className={`bg-gradient-to-br ${slide.bg} min-h-[500px] md:min-h-[580px] relative transition-all duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[400px]">
            {/* Left */}
            <div className="order-2 lg:order-1">
              <span className="inline-block bg-white/80 backdrop-blur-sm border border-rose-200 text-rose-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm">
                {slide.badge}
              </span>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-3">
                {slide.title}
                <br />
                <span className={`${slide.accent} italic`}>{slide.subtitle}</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md mb-8">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={slide.ctaLink} className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-rose-200">
                  {slide.cta}
                </Link>
                <Link to={slide.secondaryLink} className="btn-secondary text-base px-8 py-3.5">
                  {slide.secondaryCta}
                </Link>
              </div>
              <div className="flex gap-8 mt-10">
                {[
                  { value: '500+', label: 'Designs' },
                  { value: '10K+', label: 'Happy Customers' },
                  { value: '4.9★', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
                  <span className="text-2xl">💎</span>
                  <div>
                    <p className="text-xs text-gray-500">Free Shipping</p>
                    <p className="text-sm font-bold text-gray-800">Above ₹999</p>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
                  <span className="text-2xl">🌸</span>
                  <div>
                    <p className="text-xs text-gray-500">Handcrafted</p>
                    <p className="text-sm font-bold text-gray-800">With Love</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'w-6 h-2.5 bg-rose-500' : 'w-2.5 h-2.5 bg-rose-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2.5 rounded-full shadow-md transition-all"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2.5 rounded-full shadow-md transition-all"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;