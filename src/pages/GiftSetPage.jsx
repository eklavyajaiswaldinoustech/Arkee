import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  ShoppingBagIcon,
  GiftIcon,
  SparklesIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolid,
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

// ── Use your existing axios instance ──
import api from '../api/axios'; // adjust path to your axios file

// ─── API CALLS (matching your backend productService exactly) ──────────────────

/**
 * GET /products?gender=Female|Male|Unisex
 * Matches: productService.products() → accepts gender query parameter
 */
const fetchProductsByGender = async (gender) => {
  try {
    const res = await api.get('/products', {
      params: {
        gender,
      },
    });
    // Backend returns: { status: true, message, data: [...] }
    const products = res?.data?.data || [];
    return Array.isArray(products) ? products : [];
  } catch (err) {
    console.error(`Failed to fetch products for gender=${gender}:`, err);
    return [];
  }
};

/**
 * GET /get-new-launch-products?days=30
 * Matches: productService.getNewLaunchProducts()
 * Returns: { status: true, message, data: [...] }
 */
const fetchNewLaunchProducts = async () => {
  try {
    const res = await api.get('/get-new-launch-products', {
      params: { days: 30 },
    });
    const products = res?.data?.data || [];
    return Array.isArray(products) ? products : [];
  } catch (err) {
    console.error('Failed to fetch new launch products:', err);
    return [];
  }
};

/**
 * GET /get-best-seller-products?limit=20
 * Matches: productService.getBestSellerProducts()
 * Returns: { status: true, message, data: [...] }
 */
const fetchBestSellerProducts = async () => {
  try {
    const res = await api.get('/get-best-seller-products', {
      params: { limit: 20 },
    });
    const products = res?.data?.data || [];
    return Array.isArray(products) ? products : [];
  } catch (err) {
    console.error('Failed to fetch best seller products:', err);
    return [];
  }
};

// ─── THEME SYSTEM ──────────────────────────────────────────────────────────────
const themes = {
  her: {
    id: 'her',
    label: 'Gift for Her',
    icon: HeartIcon,
    gender: 'Female',
    tagline: 'Enchanting gifts she will adore',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    gradientSoft: 'from-rose-50 via-pink-50 to-fuchsia-50',
    accent: 'text-rose-600',
    accentBg: 'bg-rose-600',
    accentLight: 'bg-rose-50',
    accentBorder: 'border-rose-200',
    accentRing: 'ring-rose-200',
    badgeBg: 'bg-rose-600 text-white',
    tagBg: 'bg-rose-50 text-rose-700 border-rose-100',
    filterActive: 'bg-rose-600 text-white shadow-lg shadow-rose-200/50',
    filterInactive: 'bg-white text-gray-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200',
    priceTxt: 'text-rose-600',
    starFill: 'text-rose-400',
    sectionBg: 'bg-rose-50/60',
    shadowHover: 'hover:shadow-rose-100/60',
    btnPrimary: 'bg-rose-600 hover:bg-rose-700 text-white',
    btnOutline: 'border-rose-300 text-rose-600 hover:bg-rose-50',
    wishlistActive: 'text-rose-500',
    headingFont: 'font-serif',
    heroCta: 'Curated with Love',
    pageBg: 'from-rose-50/40 via-white to-pink-50/30',
    emptyIcon: HeartIcon,
    ctaTitle: "Can't find the perfect gift?",
    ctaDesc: 'Let us curate a bespoke gift box tailored just for her — every detail personalised with love and care.',
    heroTitle: (
      <>
        Gifts She'll{' '}
        <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
          Cherish
        </span>{' '}
        Forever
      </>
    ),
    heroDesc: 'Hand-picked luxury collections that speak the language of love — from romantic jewellery to enchanting fragrances and timeless accessories.',
  },
  him: {
    id: 'him',
    label: 'Gift for Him',
    icon: SparklesIcon,
    gender: 'Male',
    tagline: 'Premium gifts for the modern man',
    gradient: 'from-slate-800 via-slate-700 to-blue-900',
    gradientSoft: 'from-slate-50 via-gray-50 to-blue-50',
    accent: 'text-slate-800',
    accentBg: 'bg-slate-800',
    accentLight: 'bg-slate-50',
    accentBorder: 'border-slate-200',
    accentRing: 'ring-slate-200',
    badgeBg: 'bg-slate-800 text-white',
    tagBg: 'bg-slate-100 text-slate-700 border-slate-200',
    filterActive: 'bg-slate-800 text-white shadow-lg shadow-slate-300/50',
    filterInactive: 'bg-white text-gray-600 hover:bg-slate-50 border border-gray-200 hover:border-slate-300',
    priceTxt: 'text-slate-800',
    starFill: 'text-amber-400',
    sectionBg: 'bg-slate-50/60',
    shadowHover: 'hover:shadow-slate-100/60',
    btnPrimary: 'bg-slate-800 hover:bg-slate-900 text-white',
    btnOutline: 'border-slate-400 text-slate-700 hover:bg-slate-50',
    wishlistActive: 'text-blue-600',
    headingFont: 'font-sans',
    heroCta: 'Crafted for Excellence',
    pageBg: 'from-slate-50/40 via-white to-blue-50/30',
    emptyIcon: GiftIcon,
    ctaTitle: 'Looking for something exclusive?',
    ctaDesc: 'Our experts will hand-craft a premium bundle tailored to his taste, style, and personality.',
    heroTitle: (
      <>
        Premium Gifts for{' '}
        <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-blue-900 bg-clip-text text-transparent">
          the Modern Man
        </span>
      </>
    ),
    heroDesc: 'Meticulously selected premium collections designed for the discerning man — from executive accessories to bold fragrances and lifestyle essentials.',
  },
};

// ─── ANIMATION VARIANTS ────────────────────────────────────────────────────────
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const cardAnim = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeSlide = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.18 } },
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const formatPrice = (n) => {
  if (!n && n !== 0) return '₹0';
  return `₹${Number(n).toLocaleString('en-IN')}`;
};

const getDiscount = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

const getDisplayPrice = (p) => {
  if (p?.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price)
    return p.discountPrice;
  return p?.price || 0;
};

const getBadge = (product) => {
  if (product?.isBestSeller) return 'Bestseller';
  if (product?.isNewLaunch) return 'New Launch';
  if (product?.isFeatured) return 'Featured';
  const stockQty = product?.stock ?? product?.quantity ?? product?.totalQuantity ?? 0;
  if (stockQty > 0 && stockQty <= (product?.lowStockThreshold || 5)) return 'Few Left';
  return null;
};

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * Normalize product image field:
 * Backend returns either product.image[] or product.images[]
 * Images are already full URLs (backend prepends BASE_URL)
 */
const getProductImage = (product) => {
  if (product?.images?.length > 0) return product.images[0];
  if (product?.image?.length > 0) return product.image[0];
  return '/placeholder.jpg';
};

// ─── SKELETON ──────────────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-56 bg-gray-100" />
    <div className="p-4 space-y-3">
      <div className="flex gap-2">
        <div className="h-4 w-14 bg-gray-100 rounded-full" />
        <div className="h-4 w-14 bg-gray-100 rounded-full" />
      </div>
      <div className="h-4 w-3/4 bg-gray-100 rounded" />
      <div className="h-3 w-1/2 bg-gray-100 rounded" />
      <div className="h-16 bg-gray-50 rounded-xl" />
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="h-6 w-20 bg-gray-100 rounded" />
        <div className="h-10 w-10 bg-gray-100 rounded-xl" />
      </div>
    </div>
  </div>
);

const GridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
  </div>
);

// ─── GIFT CARD ──────────────────────────────────────────────────────────────────
const GiftCard = ({ product, theme }) => {
  const [wished, setWished] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const displayPrice = getDisplayPrice(product);
  const discount = getDiscount(product?.price, product?.discountPrice);
  const badge = getBadge(product);
  const description = stripHtml(product?.description);
  const mainImage = getProductImage(product);

  // stock value — backend uses: stock, quantity, or totalQuantity
  const stockQty = product?.stock ?? product?.quantity ?? product?.totalQuantity ?? 0;
  const isOutOfStock = stockQty <= 0;
  const isLowStock = !isOutOfStock && stockQty <= (product?.lowStockThreshold || 5);

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }
    setBusy(true);
    try {
      /*
       * TODO: Wire to your cart API
       * await api.post('/addCart', { productId: product._id, quantity: 1 });
       */
      await new Promise((r) => setTimeout(r, 500));
      toast.success(`${product?.name} added to bag`, {
        style: { borderRadius: 14, fontWeight: 600, fontSize: 13 },
        iconTheme: { primary: '#16a34a', secondary: '#fff' },
      });
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setBusy(false);
    }
  };

  const toggleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWished((w) => !w);
    toast(wished ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: wished ? '💔' : '❤️',
      style: { borderRadius: 14, fontWeight: 600, fontSize: 13 },
    });
  };

  const goToProduct = () => {
    navigate(`/product/${product?.slug || product?._id}`);
  };

  return (
    <motion.div
      variants={cardAnim}
      whileHover={{ y: -5 }}
      className="group relative cursor-pointer"
      onClick={goToProduct}
    >
      <div className={`relative bg-white rounded-2xl overflow-hidden border border-gray-100
        shadow-sm transition-all duration-300 hover:shadow-xl ${theme.shadowHover}
        hover:ring-1 ${theme.accentRing}`}
      >
        {/* ── Image ── */}
        <div className={`relative h-56 sm:h-60 overflow-hidden bg-gradient-to-br ${theme.gradientSoft}`}>
          <img
            src={mainImage}
            alt={product?.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-110"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

          {/* Badge */}
          {badge && (
            <div className={`absolute top-3 left-3 z-10 ${theme.badgeBg} text-[10px] tracking-wider
              uppercase font-bold px-3 py-1 rounded-full shadow-md`}>
              {badge}
            </div>
          )}

          {/* Discount */}
          {discount > 0 && (
            <div className="absolute top-3 right-12 z-10 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              −{discount}%
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={toggleWish}
            className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 backdrop-blur rounded-full
              shadow-md flex items-center justify-center transition-colors"
          >
            {wished
              ? <HeartSolid className={`w-4 h-4 ${theme.wishlistActive}`} />
              : <HeartIcon className="w-4 h-4 text-gray-400" />
            }
          </motion.button>

          {/* Hover CTA */}
          {!isOutOfStock && (
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0
              transition-transform duration-300 ease-out z-10">
              <div className="flex gap-2">
                <motion.button
                  onClick={addToCart}
                  disabled={busy}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${theme.btnPrimary}
                    shadow-lg flex items-center justify-center gap-1.5 transition-colors`}
                >
                  {busy ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                      className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <><ShoppingBagIcon className="w-3.5 h-3.5" />Add to Bag</>
                  )}
                </motion.button>
                <button
                  onClick={(e) => { e.stopPropagation(); goToProduct(); }}
                  className="w-10 flex items-center justify-center bg-white/90 backdrop-blur
                    rounded-xl shadow-lg text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Status flags */}
          <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
            {product?.isNewLaunch && (
              <span className="bg-white/90 backdrop-blur text-emerald-700 text-[9px] font-bold
                uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-100">
                New
              </span>
            )}
            {product?.isBestSeller && (
              <span className="bg-white/90 backdrop-blur text-orange-700 text-[9px] font-bold
                uppercase tracking-wider px-2 py-0.5 rounded-full border border-orange-100">
                Popular
              </span>
            )}
            {isLowStock && (
              <span className="bg-white/90 backdrop-blur text-red-700 text-[9px] font-bold
                uppercase tracking-wider px-2 py-0.5 rounded-full border border-red-100">
                Few Left
              </span>
            )}
          </div>
        </div>

        {/* ── Card Body ── */}
        <div className="p-4">
          {/* Tags */}
          <div className="flex gap-1.5 mb-2 flex-wrap">
            {product?.category && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${theme.tagBg}`}>
                {product.category}
              </span>
            )}
            {product?.subcategory && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${theme.tagBg}`}>
                {product.subcategory}
              </span>
            )}
            {product?.type && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize bg-gray-50 text-gray-600 border-gray-200">
                {product.type}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className={`text-sm font-bold text-gray-900 leading-snug line-clamp-1 ${theme.headingFont}`}>
            {product?.name}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{description}</p>
          )}

          {/* Occasion tags */}
          {product?.occasion?.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {product.occasion.slice(0, 3).map((occ) => (
                <span key={occ} className="text-[9px] font-semibold px-2 py-0.5 rounded-full
                  bg-amber-50 text-amber-700 border border-amber-100">
                  {occ}
                </span>
              ))}
            </div>
          )}

          {/* Product Details Box */}
          <div className={`mt-3 p-2.5 rounded-xl ${theme.sectionBg} border ${theme.accentBorder}`}>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-1.5">
              Product Details
            </p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              {product?.metal_type && (
                <div className="flex items-center gap-1 min-w-0">
                  <CheckCircleIcon className={`w-3 h-3 flex-shrink-0 ${theme.accent}`} />
                  <span className="text-[10px] text-gray-600 truncate capitalize">{product.metal_type}</span>
                </div>
              )}
              {product?.karat > 0 && (
                <div className="flex items-center gap-1 min-w-0">
                  <CheckCircleIcon className={`w-3 h-3 flex-shrink-0 ${theme.accent}`} />
                  <span className="text-[10px] text-gray-600 truncate">{product.karat}K Gold</span>
                </div>
              )}
              {product?.diamond_quality && (
                <div className="flex items-center gap-1 min-w-0">
                  <CheckCircleIcon className={`w-3 h-3 flex-shrink-0 ${theme.accent}`} />
                  <span className="text-[10px] text-gray-600 truncate">{product.diamond_quality}</span>
                </div>
              )}
              {product?.certificate_type && (
                <div className="flex items-center gap-1 min-w-0">
                  <CheckCircleIcon className={`w-3 h-3 flex-shrink-0 ${theme.accent}`} />
                  <span className="text-[10px] text-gray-600 truncate">{product.certificate_type} Cert</span>
                </div>
              )}
              {product?.Weight && (
                <div className="flex items-center gap-1 min-w-0">
                  <CheckCircleIcon className={`w-3 h-3 flex-shrink-0 ${theme.accent}`} />
                  <span className="text-[10px] text-gray-600 truncate">{product.Weight}</span>
                </div>
              )}
              {product?.warranty_description && (
                <div className="flex items-center gap-1 min-w-0 col-span-2">
                  <ShieldCheckIcon className={`w-3 h-3 flex-shrink-0 ${theme.accent}`} />
                  <span className="text-[10px] text-gray-600 truncate">{product.warranty_description}</span>
                </div>
              )}
              {/* Fallback if no jewellery details */}
              {!product?.metal_type && !product?.karat && !product?.diamond_quality && !product?.Weight && (
                <>
                  <div className="flex items-center gap-1 min-w-0">
                    <CheckCircleIcon className={`w-3 h-3 flex-shrink-0 ${theme.accent}`} />
                    <span className="text-[10px] text-gray-600 truncate capitalize">
                      {product?.category || 'Premium'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <GiftIcon className={`w-3 h-3 flex-shrink-0 ${theme.accent}`} />
                    <span className="text-[10px] text-gray-600">Gift Ready</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Low Stock Bar */}
          {isLowStock && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${Math.min((stockQty / (product?.lowStockThreshold || 5)) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[9px] font-bold text-red-600">Only {stockQty} left</span>
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-lg font-extrabold tracking-tight ${theme.priceTxt}`}>
                  {formatPrice(displayPrice)}
                </span>
                {discount > 0 && (
                  <span className="text-xs text-gray-400 line-through">{formatPrice(product?.price)}</span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Save {formatPrice(product?.price - displayPrice)}
                </p>
              )}
              {product?.gst_percentage > 0 && (
                <p className="text-[9px] text-gray-400 mt-0.5">Incl. {product.gst_percentage}% GST</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={addToCart}
              disabled={busy || isOutOfStock}
              className={`w-10 h-10 rounded-xl shadow-md flex items-center justify-center
                transition-colors ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : theme.btnPrimary}`}
            >
              {busy ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                  className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <ShoppingBagIcon className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── HERO BANNER ───────────────────────────────────────────────────────────────
const HeroBanner = ({ theme, tab, productCount }) => (
  <motion.section
    key={`hero-${tab}`}
    variants={fadeSlide}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={`relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br ${theme.gradientSoft}`}
  >
    <div className={`absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-30 ${tab === 'her' ? 'bg-rose-200' : 'bg-blue-200'}`} />
    <div className={`absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-3xl opacity-30 ${tab === 'her' ? 'bg-pink-200' : 'bg-slate-200'}`} />

    <div className="relative z-10 px-6 sm:px-10 py-10 md:py-14 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 text-center md:text-left">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase
            tracking-[0.12em] ${theme.accent} bg-white/70 backdrop-blur px-3 py-1 rounded-full shadow-sm mb-4`}
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          {theme.heroCta}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight
            text-gray-900 ${theme.headingFont}`}
        >
          {theme.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg"
        >
          {theme.heroDesc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start"
        >
          {[
            { Icon: GiftIcon, label: 'Free Gift Wrapping' },
            { Icon: TruckIcon, label: 'Express Delivery' },
            { Icon: ShieldCheckIcon, label: '100% Authentic' },
          ].map(({ Icon, label }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold
                bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm ${theme.accent}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
        className="relative flex-shrink-0"
      >
        <div className={`w-40 h-40 md:w-52 md:h-52 rounded-3xl bg-gradient-to-br ${theme.gradient}
          shadow-2xl flex items-center justify-center rotate-3`}>
          <GiftIcon className="w-20 h-20 md:w-28 md:h-28 text-white/90" strokeWidth={1} />
        </div>
        <motion.div
          animate={{ y: [-4, 4, -4], rotate: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -top-3 -right-3 w-12 h-12 rounded-2xl ${theme.accentBg}
            shadow-lg flex items-center justify-center`}
        >
          <SparklesIcon className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className={`absolute -bottom-2 -left-2 w-10 h-10 rounded-xl bg-white shadow-lg
            flex items-center justify-center ${theme.accent}`}
        >
          {productCount > 0
            ? <span className="text-xs font-extrabold">{productCount}</span>
            : <HeartIcon className="w-5 h-5" />
          }
        </motion.div>
      </motion.div>
    </div>

    <div className={`h-1 bg-gradient-to-r ${theme.gradient} opacity-60`} />
  </motion.section>
);

// ─── FILTER BAR ────────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Bestseller', 'New Launch', 'Under ₹5000', 'Premium', 'Low Stock'];

const FilterBar = ({ theme, active, onChange, counts }) => (
  <div className="flex gap-2 flex-wrap">
    {FILTERS.map((f) => (
      <motion.button
        key={f}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onChange(f)}
        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
          active === f ? theme.filterActive : theme.filterInactive
        }`}
      >
        {f}
        {counts?.[f] !== undefined && (
          <span className="ml-1 opacity-70">({counts[f]})</span>
        )}
      </motion.button>
    ))}
  </div>
);

// ─── BOTTOM CTA ────────────────────────────────────────────────────────────────
const BottomCta = ({ theme }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55 }}
    className={`mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-r ${theme.gradient}
      p-8 md:p-14 text-center shadow-2xl`}
  >
    <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
    <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
    <div className="relative z-10 max-w-2xl mx-auto">
      <GiftIcon className="w-12 h-12 text-white/80 mx-auto mb-4" strokeWidth={1.2} />
      <h3 className={`text-2xl md:text-3xl font-extrabold text-white leading-tight ${theme.headingFont}`}>
        {theme.ctaTitle}
      </h3>
      <p className="text-white/70 mt-3 text-sm max-w-md mx-auto leading-relaxed">{theme.ctaDesc}</p>
      <motion.button
        whileHover={{ scale: 1.04, boxShadow: '0 16px 48px rgba(0,0,0,0.18)' }}
        whileTap={{ scale: 0.97 }}
        className="mt-7 inline-flex items-center gap-2 bg-white text-gray-900 font-bold
          px-8 py-3.5 rounded-2xl shadow-xl text-sm tracking-tight transition-all"
      >
        Build a Custom Gift Box
        <ArrowRightIcon className="w-4 h-4" />
      </motion.button>
    </div>
  </motion.div>
);

// ─── EMPTY / ERROR STATES ───────────────────────────────────────────────────────
const EmptyState = ({ theme, onReset, isFiltered }) => {
  const Icon = theme.emptyIcon;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
      <div className={`w-20 h-20 rounded-full ${theme.accentLight} flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-10 h-10 ${theme.accent} opacity-50`} />
      </div>
      <p className="text-gray-700 font-semibold text-sm">
        {isFiltered ? 'No gifts match this filter' : 'No products available right now'}
      </p>
      <p className="text-gray-400 text-xs mt-1">
        {isFiltered ? 'Try adjusting your filters.' : 'We are adding new products soon. Check back later!'}
      </p>
      {isFiltered && (
        <button
          onClick={onReset}
          className={`mt-4 inline-flex items-center gap-1.5 text-xs font-bold ${theme.accent} hover:underline`}
        >
          <ArrowPathIcon className="w-3.5 h-3.5" />
          Clear filters
        </button>
      )}
    </motion.div>
  );
};

const ErrorState = ({ onRetry }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
      <XMarkIcon className="w-10 h-10 text-red-400" />
    </div>
    <p className="text-gray-700 font-semibold text-sm">Something went wrong</p>
    <p className="text-gray-400 text-xs mt-1">We couldn't load the products. Please try again.</p>
    <button
      onClick={onRetry}
      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline"
    >
      <ArrowPathIcon className="w-3.5 h-3.5" />
      Try Again
    </button>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const GiftSetPage = () => {
  const [activeTab, setActiveTab] = useState('her');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('trending');

  /**
   * Data shape per tab:
   * {
   *   her: { gender: [], newLaunch: [], bestSeller: [] },
   *   him: { gender: [], newLaunch: [], bestSeller: [] }
   * }
   *
   * We fetch gender-filtered products from /products?gender=Female|Male|Unisex
   * New launch from /get-new-launch-products
   * Best sellers from /get-best-seller-products
   * All three are merged + deduped per tab
   */
  const [products, setProducts] = useState({ her: [], him: [] });
  const [loading, setLoading] = useState({ her: true, him: true });
  const [errors, setErrors] = useState({ her: false, him: false });

  const headerRef = useRef(null);
  const { scrollY } = useScroll();
  const headerShadow = useTransform(scrollY, [0, 60], [0, 1]);

  const theme = themes[activeTab];

  // ── Load products for both tabs on mount ──
  useEffect(() => {
    loadTabProducts('her');
    loadTabProducts('him');
  }, []);

  const loadTabProducts = useCallback(async (tab) => {
    const gender = themes[tab].gender; // 'Female' or 'Male'

    setLoading((prev) => ({ ...prev, [tab]: true }));
    setErrors((prev) => ({ ...prev, [tab]: false }));

    try {
      /**
       * Parallel fetch all 3 sources:
       * 1. Gender-filtered products      → /products?gender=Female|Male
       * 2. Unisex products               → /products?gender=Unisex
       * 3. New launch products           → /get-new-launch-products?days=30
       * 4. Best seller products          → /get-best-seller-products?limit=20
       *
       * Backend productService.products() uses req.query filters
       * Backend productService.getNewLaunchProducts() filters by isNewLaunch + createdAt
       * Backend productService.getBestSellerProducts() aggregates from orders
       */
      const [genderData, unisexData, newLaunchData, bestSellerData] = await Promise.allSettled([
        fetchProductsByGender(gender),
        fetchProductsByGender('Unisex'),
        fetchNewLaunchProducts(),
        fetchBestSellerProducts(),
      ]);

      // Extract values (Promise.allSettled won't throw)
      const genderProducts = genderData.status === 'fulfilled' ? genderData.value : [];
      const unisexProducts = unisexData.status === 'fulfilled' ? unisexData.value : [];
      const newLaunch = newLaunchData.status === 'fulfilled' ? newLaunchData.value : [];
      const bestSeller = bestSellerData.status === 'fulfilled' ? bestSellerData.value : [];

      // Merge all sources
      const combined = [...genderProducts, ...unisexProducts, ...newLaunch, ...bestSeller];

      // Deduplicate by _id
      const uniqueMap = new Map();
      combined.forEach((p) => {
        if (p?._id && !uniqueMap.has(String(p._id))) {
          uniqueMap.set(String(p._id), p);
        }
      });

      /**
       * Filter: show only products with stock
       * Backend already filters stock > 0 in the products() endpoint
       * For new-launch and best-seller: they may include isActive/isDeleted checks
       * Apply a unified client-side safety filter here
       */
      const allProducts = Array.from(uniqueMap.values()).filter((p) => {
        // Check stock — backend uses: stock, quantity, or totalQuantity
        const hasStock = (p?.stock ?? p?.quantity ?? p?.totalQuantity ?? 0) > 0;
        // isActive/isDeleted checks — some products may not have these fields
        const isActive = p?.isActive !== false; // default true if field missing
        const isNotDeleted = p?.isDeleted !== true;
        return hasStock && isActive && isNotDeleted;
      });

      setProducts((prev) => ({ ...prev, [tab]: allProducts }));
    } catch (err) {
      console.error(`Error loading products for tab=${tab}:`, err);
      setErrors((prev) => ({ ...prev, [tab]: true }));
    } finally {
      setLoading((prev) => ({ ...prev, [tab]: false }));
    }
  }, []);

  // ── Derived: current tab's products ──
  const currentProducts = products[activeTab] || [];
  const isLoading = loading[activeTab];
  const hasError = errors[activeTab];

  // ── Filter counts ──
  const filterCounts = useMemo(() => {
    const list = currentProducts;
    const stockQty = (p) => p?.stock ?? p?.quantity ?? p?.totalQuantity ?? 0;
    return {
      All: list.length,
      Bestseller: list.filter((p) => p.isBestSeller).length,
      'New Launch': list.filter((p) => p.isNewLaunch).length,
      'Under ₹5000': list.filter((p) => getDisplayPrice(p) < 5000).length,
      Premium: list.filter((p) => getDisplayPrice(p) >= 5000).length,
      'Low Stock': list.filter((p) => {
        const qty = stockQty(p);
        return qty > 0 && qty <= (p?.lowStockThreshold || 5);
      }).length,
    };
  }, [currentProducts]);

  // ── Filter + Sort ──
  const filtered = useMemo(() => {
    const stockQty = (p) => p?.stock ?? p?.quantity ?? p?.totalQuantity ?? 0;
    let list = [...currentProducts];

    switch (activeFilter) {
      case 'Bestseller':
        list = list.filter((p) => p.isBestSeller);
        break;
      case 'New Launch':
        list = list.filter((p) => p.isNewLaunch);
        break;
      case 'Under ₹5000':
        list = list.filter((p) => getDisplayPrice(p) < 5000);
        break;
      case 'Premium':
        list = list.filter((p) => getDisplayPrice(p) >= 5000);
        break;
      case 'Low Stock':
        list = list.filter((p) => {
          const qty = stockQty(p);
          return qty > 0 && qty <= (p?.lowStockThreshold || 5);
        });
        break;
      default:
        break; // 'All' — no filter
    }

    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
        break;
      case 'price-high':
        list.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'trending':
      default:
        // Best sellers first, then featured, then by total sold
        list.sort(
          (a, b) =>
            Number(b.isBestSeller || false) - Number(a.isBestSeller || false) ||
            Number(b.isFeatured || false) - Number(a.isFeatured || false) ||
            (b.totalSold || 0) - (a.totalSold || 0)
        );
        break;
    }

    return list;
  }, [currentProducts, activeFilter, sortBy]);

  const switchTab = (t) => {
    setActiveTab(t);
    setActiveFilter('All');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-gradient-to-b ${theme.pageBg}`}>

      {/* ─── STICKY HEADER ─── */}
      <motion.header
        ref={headerRef}
        style={{
          boxShadow: useTransform(
            headerShadow,
            (v) => v > 0.5 ? '0 1px 12px rgba(0,0,0,0.06)' : 'none'
          ),
        }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Title */}
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${theme.accentLight}`}>
                <GiftIcon className={`w-4 h-4 ${theme.accent}`} />
              </div>
              <span className={`text-sm font-bold text-gray-800 hidden sm:block tracking-tight ${theme.headingFont}`}>
                Gift Sets
              </span>
            </div>

            {/* Tab Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              {Object.values(themes).map((t) => {
                const TabIcon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => switchTab(t.id)}
                    className={`relative flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs
                      font-bold transition-colors ${
                        isActive ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="giftTab"
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${t.gradient}`}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <TabIcon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10 hidden sm:inline">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold border border-gray-200 rounded-xl px-3 py-2
                  bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200
                  cursor-pointer hidden sm:block"
              >
                <option value="trending">Trending</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ─── MAIN ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-xs text-gray-400 mb-8"
        >
          <Link to="/" className="hover:text-gray-600 transition-colors font-medium">Home</Link>
          <ChevronRightIcon className="w-3 h-3" />
          <span className="text-gray-500 font-medium">Gift Sets</span>
          <ChevronRightIcon className="w-3 h-3" />
          <span className={`font-semibold ${theme.accent}`}>{theme.label}</span>
        </motion.nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Hero */}
            <HeroBanner theme={theme} tab={activeTab} productCount={currentProducts.length} />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <FilterBar
                theme={theme}
                active={activeFilter}
                onChange={setActiveFilter}
                counts={filterCounts}
              />
              <div className="flex items-center gap-3">
                <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <TagIcon className="w-3.5 h-3.5" />
                  {filtered.length} gift{filtered.length !== 1 ? 's' : ''} found
                </p>
                {/* Mobile sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold border border-gray-200 rounded-xl px-3 py-2
                    bg-white text-gray-600 focus:outline-none sm:hidden"
                >
                  <option value="trending">Trending</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <GridSkeleton />
            ) : hasError ? (
              <ErrorState onRetry={() => loadTabProducts(activeTab)} />
            ) : (
              <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                  <EmptyState
                    key="empty"
                    theme={theme}
                    isFiltered={activeFilter !== 'All'}
                    onReset={() => setActiveFilter('All')}
                  />
                ) : (
                  <motion.div
                    key={activeFilter + sortBy}
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filtered.map((p) => (
                      <GiftCard key={p._id} product={p} theme={theme} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Bottom CTA */}
            {!isLoading && !hasError && <BottomCta theme={theme} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default GiftSetPage;