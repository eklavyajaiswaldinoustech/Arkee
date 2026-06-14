import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TagIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  SparklesIcon,
  GiftIcon,
  TruckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { miscService } from '../api/services/miscService';
import toast from 'react-hot-toast';

const fallbackOffers = [
  {
    _id: '1',
    code: 'ARKEE10',
    title: '10% Off Your First Order',
    description:
      'Get 10% off on your first purchase. Valid on all products across all categories.',
    discount: '10%',
    type: 'percent',
    minOrder: 499,
    validTill: '2025-12-31',
    color: 'from-rose-400 to-pink-600',
    bgColor: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    icon: '🌸',
    category: 'Welcome Offer',
    isNew: true,
  },
  {
    _id: '2',
    code: 'FIRST50',
    title: '₹50 Flat Off',
    description:
      'Save ₹50 on orders above ₹599. Perfect for trying out our new arrivals collection.',
    discount: '₹50',
    type: 'flat',
    minOrder: 599,
    validTill: '2025-08-31',
    color: 'from-gold-400 to-orange-500',
    bgColor: 'from-gold-50 to-orange-50',
    borderColor: 'border-gold-200',
    icon: '💛',
    category: 'Flat Discount',
    isNew: false,
  },
  {
    _id: '3',
    code: 'SAVE100',
    title: '₹100 Off on ₹999+',
    description:
      'Save ₹100 on orders above ₹999. Stack your cart with favourites and save big!',
    discount: '₹100',
    type: 'flat',
    minOrder: 999,
    validTill: '2025-09-30',
    color: 'from-blush-400 to-purple-600',
    bgColor: 'from-blush-50 to-purple-50',
    borderColor: 'border-blush-200',
    icon: '💜',
    category: 'Big Saver',
    isNew: false,
  },
  {
    _id: '4',
    code: 'FREESHIP',
    title: 'Free Shipping Always',
    description:
      'Enjoy free delivery on all orders above ₹999. No code needed — automatically applied at checkout.',
    discount: 'FREE',
    type: 'shipping',
    minOrder: 999,
    validTill: '2025-12-31',
    color: 'from-green-400 to-teal-500',
    bgColor: 'from-green-50 to-teal-50',
    borderColor: 'border-green-200',
    icon: '🚚',
    category: 'Shipping Offer',
    isNew: false,
    noCode: true,
  },
  {
    _id: '5',
    code: 'BIRTHDAY20',
    title: '20% Birthday Discount',
    description:
      'Celebrate your special day with 20% off! Apply on your birthday month for maximum savings.',
    discount: '20%',
    type: 'percent',
    minOrder: 299,
    validTill: '2025-12-31',
    color: 'from-blue-400 to-indigo-600',
    bgColor: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    icon: '🎂',
    category: 'Special Occasion',
    isNew: true,
  },
  {
    _id: '6',
    code: 'REFER15',
    title: '15% Referral Reward',
    description:
      'Refer a friend and both of you get 15% off on your next purchase. Share the love!',
    discount: '15%',
    type: 'percent',
    minOrder: 399,
    validTill: '2025-12-31',
    color: 'from-orange-400 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
    borderColor: 'border-orange-200',
    icon: '🤝',
    category: 'Referral',
    isNew: false,
  },
];

const CountdownTimer = ({ validTill }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(validTill) - new Date();
      if (diff <= 0) return setTimeLeft({ expired: true });
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days, hours, minutes });
    };
    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [validTill]);

  if (timeLeft.expired) {
    return (
      <span className="text-xs text-red-500 font-medium flex items-center gap-1">
        <ClockIcon className="w-3.5 h-3.5" />
        Expired
      </span>
    );
  }

  return (
    <span className="text-xs text-gray-500 flex items-center gap-1">
      <ClockIcon className="w-3.5 h-3.5 text-rose-400" />
      {timeLeft.days > 0 && `${timeLeft.days}d `}
      {timeLeft.hours}h {timeLeft.minutes}m left
    </span>
  );
};

const CouponCard = ({ offer }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (offer.noCode) return;
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    toast.success(`Code "${offer.code}" copied! 🎉`);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      className={`relative bg-gradient-to-br ${offer.bgColor} rounded-2xl border-2 ${offer.borderColor} overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* New Badge */}
      {offer.isNew && (
        <div className="absolute top-3 right-3">
          <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
            NEW
          </span>
        </div>
      )}

      {/* Top Section */}
      <div className={`bg-gradient-to-r ${offer.color} p-5 text-white`}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{offer.icon}</span>
          <div className="flex-1">
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">
              {offer.category}
            </span>
            <h3 className="font-serif font-bold text-lg leading-tight mt-0.5">
              {offer.title}
            </h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">{offer.discount}</span>
              <span className="text-white/70 text-sm ml-1">
                {offer.type === 'percent' ? 'off' : offer.type === 'flat' ? 'off' : 'delivery'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="relative border-t-2 border-dashed border-white/60 mx-4">
        <div className="absolute -left-6 -top-3.5 w-7 h-7 rounded-full bg-cream-50 border-2 border-white/60" />
        <div className="absolute -right-6 -top-3.5 w-7 h-7 rounded-full bg-cream-50 border-2 border-white/60" />
      </div>

      {/* Bottom Section */}
      <div className="p-5">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {offer.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <TagIcon className="w-3.5 h-3.5 text-rose-400" />
            Min. order: ₹{offer.minOrder?.toLocaleString()}
          </span>
          <CountdownTimer validTill={offer.validTill} />
        </div>

        {/* Coupon Code */}
        {offer.noCode ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
            <CheckIcon className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              Auto-applied at checkout
            </span>
          </div>
        ) : (
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-between bg-white border-2 border-dashed rounded-xl px-4 py-3 transition-all group ${
              copied
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-rose-400'
            }`}
          >
            <span
              className={`font-mono font-bold text-base tracking-widest ${
                copied ? 'text-green-600' : 'text-gray-800'
              }`}
            >
              {offer.code}
            </span>
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                copied
                  ? 'text-green-600 bg-green-100'
                  : 'text-rose-500 bg-rose-50 group-hover:bg-rose-100'
              }`}
            >
              {copied ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </div>
          </button>
        )}

        {/* Shop Now Link */}
        <Link
          to="/products"
          className="mt-3 flex items-center justify-center gap-1.5 text-xs text-rose-500 font-semibold hover:gap-2.5 transition-all"
        >
          Shop Now
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

const Offers = () => {
  const [offers, setOffers] = useState(fallbackOffers);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await miscService.getOffers();
        const list = res?.data?.offers || res?.offers || res?.data || [];
        if (list.length > 0) {
          const mapped = list.map((o, i) => ({
            ...fallbackOffers[i % fallbackOffers.length],
            ...o,
          }));
          setOffers(mapped);
        }
      } catch {
        // use fallback
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const filterTabs = ['All', 'Welcome Offer', 'Flat Discount', 'Big Saver', 'Shipping Offer', 'Special Occasion', 'Referral'];

  const filteredOffers =
    activeFilter === 'All'
      ? offers
      : offers.filter((o) => o.category === activeFilter);

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-500 via-blush-600 to-gold-500 text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gold-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-5 py-2 mb-6">
            <SparklesIcon className="w-4 h-4 text-gold-200" />
            <span className="text-sm font-medium">Exclusive Member Deals</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Offers &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-white">
              Deals
            </span>
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Save more on every sparkle ✨ Exclusive discounts, seasonal sales
            and special offers — only at Arkee.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            {[
              { icon: '🎁', value: `${offers.length}+`, label: 'Active Offers' },
              { icon: '💸', value: 'Up to 20%', label: 'Max Savings' },
              { icon: '🚚', value: 'FREE', label: 'Shipping on ₹999+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl block mb-1">{stat.icon}</span>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-white/70 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-10 pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === tab
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300 hover:text-rose-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-36 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🎁</span>
            <h3 className="font-serif text-xl font-bold text-gray-700 mb-2">
              No offers in this category
            </h3>
            <button
              onClick={() => setActiveFilter('All')}
              className="btn-primary mt-4 text-sm"
            >
              View All Offers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <CouponCard key={offer._id} offer={offer} />
            ))}
          </div>
        )}

        {/* How to Use Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10">
            How to Use Coupon Codes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: '🛍️',
                title: 'Shop Your Favourites',
                desc: 'Browse our collection and add items to your cart',
              },
              {
                step: '02',
                icon: '📋',
                title: 'Copy the Code',
                desc: 'Click "Copy" on any coupon above to copy the code',
              },
              {
                step: '03',
                icon: '💳',
                title: 'Apply at Checkout',
                desc: 'Paste the code in the coupon field at checkout',
              },
              {
                step: '04',
                icon: '✨',
                title: 'Enjoy Your Savings!',
                desc: 'Watch the discount apply and save on your order',
              },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-dashed border-t-2 border-dashed border-rose-200 z-0 -translate-x-4" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-rose-50 border-2 border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-rose-400 mb-1 block">
                    STEP {item.step}
                  </span>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="btn-primary">
              <SparklesIcon className="w-4 h-4" />
              Start Shopping Now
            </Link>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-rose-400" />
            Terms & Conditions
          </h4>
          <ul className="space-y-1.5 text-xs text-gray-500">
            {[
              'Coupon codes are valid for a single use per account unless stated otherwise.',
              'Minimum order amount must be met before the discount is applied.',
              'Offers cannot be combined with other promotional codes.',
              'Arkee reserves the right to modify or cancel offers at any time.',
              'Free shipping is auto-applied on qualifying orders — no code required.',
              'Birthday discount valid only during the registered birthday month.',
            ].map((term, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5 flex-shrink-0">•</span>
                {term}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Offers;