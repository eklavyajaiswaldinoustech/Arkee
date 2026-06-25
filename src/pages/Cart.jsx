import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShoppingBagIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { cartService } from '../api/services/cartService';
import useCartStore from '../store/cartStore';
import useCart from '../hooks/useCart';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const COUPON_CODES = {
  ARKEE10: { discount: 10, type: 'percent', label: '10% off' },
  FIRST50: { discount: 50, type: 'flat', label: '₹50 off' },
  SAVE100: { discount: 100, type: 'flat', label: '₹100 off' },
};

const FREE_SHIPPING_THRESHOLD = 999;
const MAX_CART_QTY = 4;

const getProductId = (item) =>
  item?.productId?._id ||
  item?.productId ||
  item?.productid?._id ||
  item?.productid ||
  item?._id ||
  null;

const getItemPrice = (item) =>
  Number(
    item?.productId?.discountPrice ??
      item?.productId?.price ??
      item?.discountPrice ??
      item?.price ??
      item?.current_price ??
      item?.price_at_addition ??
      0
  );

const normalizeCartItem = (item) => {
  const productId = getProductId(item);
  const image =
    item?.productId?.images?.[0] ||
    item?.images?.[0] ||
    item?.product?.images?.[0] ||
    'https://placehold.co/200x200/fce7f3/be185d?text=Arkee';
  const price = getItemPrice(item);

  return {
    ...item,
    productId:
      typeof item?.productId === 'object'
        ? {
            ...item.productId,
            _id: productId,
            images: item?.productId?.images || item?.images || [],
            price: Number(item?.productId?.price ?? item?.current_price ?? item?.price_at_addition ?? price),
            discountPrice: Number(
              item?.productId?.discountPrice ?? item?.price_at_addition ?? item?.current_price ?? price
            ),
          }
        : {
            _id: productId,
            name: item?.name || '',
            images: item?.images || [],
            price: Number(item?.current_price ?? item?.price_at_addition ?? price),
            discountPrice: Number(item?.price_at_addition ?? item?.current_price ?? price),
            category: item?.category || '',
          },
    image,
    price,
    unitPrice: price,
    quantity: Math.min(Number(item?.quantity || 1), MAX_CART_QTY),
  };
};

const Cart = () => {
  const [searchParams] = useSearchParams();
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();
  const { setCart: setStoreCart } = useCartStore();
  const { removeFromCart, updateQuantity, fetchCart } = useCart();

  // Fetch cart on mount
  useEffect(() => {
    fetchCartData();
  }, []);

  // Highlight item from query params
  useEffect(() => {
    const highlight = searchParams.get('highlight');
    if (!highlight || loading || cartData.length === 0) return;
    const el = document.getElementById(`cart-item-${highlight}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-rose-400', 'ring-offset-4');
      const timer = setTimeout(() => {
        el.classList.remove('ring-2', 'ring-rose-400', 'ring-offset-4');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, loading, cartData]);

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const res = await cartService.viewCart();
      const items = normalizeCartItemArray(res?.data || res?.items || []);
      setCartData(items);
      setStoreCart(items);
    } catch (err) {
      console.error('Fetch cart error:', err);
      setCartData([]);
    } finally {
      setLoading(false);
    }
  };

  const normalizeCartItemArray = (items) =>
    (Array.isArray(items) ? items : []).map(normalizeCartItem);

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    if (newQty > MAX_CART_QTY) {
      toast.error('You can only select up to 4 of the same product.');
      return;
    }
    
    setUpdatingId(productId);
    try {
      await updateQuantity(productId, newQty);
      // Update local state optimistically
      setCartData((prev) =>
        prev.map((item) =>
          getProductId(item) === productId
            ? { ...item, quantity: newQty }
            : item
        )
      );
    } catch (err) {
      console.error('Quantity update error:', err);
      // Refetch on error to sync state
      await fetchCartData();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId, name, quantity) => {
    setUpdatingId(productId);
    try {
      // Remove entire product with all its quantity
      await removeFromCart(productId, quantity);
      setCartData((prev) =>
        prev.filter((item) => getProductId(item) !== productId)
      );
      toast.success(`${name || 'Item'} removed from cart`);
    } catch (err) {
      console.error('Remove error:', err);
      await fetchCartData();
    } finally {
      setUpdatingId(null);
    }
  };

  const applyCoupon = async () => {
    setCouponError('');
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setCouponLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const code = couponInput.trim().toUpperCase();
    if (COUPON_CODES[code]) {
      setAppliedCoupon({ code, ...COUPON_CODES[code] });
      toast.success(`Coupon "${code}" applied! 🎉`);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Please try again.');
    }
    setCouponLoading(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  // ── Price Calculations ──
  const subtotal = cartData.reduce((sum, item) => {
    const price = getItemPrice(item);
    return sum + price * Number(item.quantity || 1);
  }, 0);

  const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round((subtotal * appliedCoupon.discount) / 100)
      : appliedCoupon.discount
    : 0;

  const total = subtotal + shippingCharge - couponDiscount;
  const savings = cartData.reduce((sum, item) => {
    const orig = Number(item.productId?.price || item.current_price || item.price_at_addition || 0);
    const disc = Number(item.productId?.discountPrice || item.price || orig);
    return sum + Math.max(0, orig - disc) * Number(item.quantity || 1);
  }, 0);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-8 bg-gray-200 rounded w-40 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 flex gap-4 animate-pulse"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 animate-pulse h-80" />
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart
  if (!loading && cartData.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <EmptyState
          icon={
            <ShoppingBagIcon className="w-12 h-12 text-rose-300" />
          }
          title="Your cart is empty"
          description="Looks like you haven't added any jewellery yet. Start exploring our beautiful collections!"
          actionLabel="Start Shopping"
          actionPath="/products"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-800">
              Shopping Cart
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {cartData.length} item{cartData.length !== 1 ? 's' : ''} in your
              cart
            </p>
          </div>
          <Link
            to="/products"
            className="text-rose-500 text-sm font-medium hover:text-rose-600 flex items-center gap-1.5 group"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Free Shipping Progress Bar */}
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <div className="bg-white rounded-2xl p-4 mb-6 border border-rose-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                <TruckIcon className="w-4 h-4 inline mr-1 text-rose-400" />
                Add{' '}
                <span className="font-semibold text-rose-500">
                  ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()}
                </span>{' '}
                more for free shipping!
              </p>
              <span className="text-xs text-gray-400">
                ₹{subtotal.toLocaleString()} / ₹
                {FREE_SHIPPING_THRESHOLD.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-gold-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {subtotal >= FREE_SHIPPING_THRESHOLD && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <TruckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700 font-medium">
              🎉 Yay! You've unlocked FREE shipping on this order!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            {cartData.map((item, index) => {
              const product = item.productId || item.product || item;
              const productId = getProductId(item);
              const name = product?.name || 'Product';
              const image = product?.images?.[0] || item.image || 'https://placehold.co/200x200/fce7f3/be185d?text=Arkee';
              const price = getItemPrice(item);
              const originalPrice = Number(product?.price || item.current_price || item.price_at_addition || 0);
              const quantity = item.quantity || 1;
              const discount =
                originalPrice && price < originalPrice
                  ? Math.round(
                      ((originalPrice - price) / originalPrice) * 100
                    )
                  : null;
              const isUpdating = updatingId === productId;

              return (
                <div
                  key={productId || index}
                  id={`cart-item-${productId}`}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm transition-all duration-300 ${
                    isUpdating ? 'opacity-60' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      to={`/product/${productId}`}
                      className="flex-shrink-0"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cream-100 border border-gray-100">
                        <img
                          src={image}
                          alt={name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {product?.category && (
                            <p className="text-xs text-rose-400 font-medium uppercase tracking-wider mb-1">
                              {product.category}
                            </p>
                          )}
                          <Link to={`/product/${productId}`}>
                            <h3 className="text-sm sm:text-base font-semibold text-gray-800 hover:text-rose-500 transition-colors line-clamp-2">
                              {name}
                            </h3>
                          </Link>
                          {product?.material && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Material: {product.material}
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(productId, name, quantity)}
                          disabled={isUpdating}
                          className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                          title="Remove item"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price & Quantity Row */}
                      <div className="flex items-end justify-between mt-3 gap-3 flex-wrap">
                        {/* Price */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{(price * quantity).toLocaleString()}
                            </span>
                            {discount && (
                              <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 font-medium">
                                -{discount}%
                              </span>
                            )}
                          </div>
                          {discount && (
                            <p className="text-xs text-gray-400 line-through">
                              ₹{(originalPrice * quantity).toLocaleString()}
                            </p>
                          )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                          <button
                            onClick={() =>
                              handleQuantityChange(productId, quantity - 1)
                            }
                            disabled={quantity <= 1 || isUpdating}
                            className="px-3 py-2 hover:bg-rose-50 hover:text-rose-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <MinusIcon className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-4 py-2 text-sm font-semibold text-gray-800 min-w-[2.5rem] text-center border-x border-gray-200">
                            {isUpdating ? (
                              <svg
                                className="animate-spin w-3.5 h-3.5 mx-auto text-rose-400"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                                />
                              </svg>
                            ) : (
                              quantity
                            )}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(productId, quantity + 1)
                            }
                            disabled={isUpdating || quantity >= MAX_CART_QTY}
                            className="px-3 py-2 hover:bg-rose-50 hover:text-rose-500 transition-colors disabled:opacity-40"
                          >
                            <PlusIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {quantity >= MAX_CART_QTY && (
                          <p className="text-xs text-amber-600 mt-2 text-right">
                            Max 4 per product
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Coupon Section */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <TagIcon className="w-4 h-4 text-rose-400" />
                Apply Coupon Code
              </h3>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-lg">🎉</span>
                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-xs text-green-600">
                        {appliedCoupon.label} applied!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-500 hover:text-red-600 font-medium underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder="Enter coupon code"
                      className="input-field flex-1 uppercase tracking-widest text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="btn-primary px-5 py-2.5 text-sm disabled:opacity-70 whitespace-nowrap"
                    >
                      {couponLoading ? (
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                          />
                        </svg>
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-rose-500 text-xs flex items-center gap-1">
                      <span>⚠</span> {couponError}
                    </p>
                  )}
                  {/* Available Coupons Hint */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(COUPON_CODES).map(([code, val]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setCouponInput(code);
                          setCouponError('');
                        }}
                        className="text-xs bg-rose-50 text-rose-500 px-3 py-1.5 rounded-full border border-rose-100 hover:bg-rose-100 transition-colors font-medium"
                      >
                        {code} — {val.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h2 className="font-serif text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Subtotal ({cartData.length} item
                    {cartData.length !== 1 ? 's' : ''})
                  </span>
                  <span className="font-medium text-gray-800">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">You're saving</span>
                    <span className="text-green-600 font-medium">
                      -₹{savings.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <TruckIcon className="w-3.5 h-3.5" />
                    Shipping
                  </span>
                  <span
                    className={`font-medium ${
                      shippingCharge === 0
                        ? 'text-green-600'
                        : 'text-gray-800'
                    }`}
                  >
                    {shippingCharge === 0
                      ? 'FREE'
                      : `₹${shippingCharge}`}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 flex items-center gap-1">
                      <TagIcon className="w-3.5 h-3.5" />
                      Coupon ({appliedCoupon.code})
                    </span>
                    <span className="text-green-600 font-medium">
                      -₹{couponDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t-2 border-dashed border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-base">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-2xl">
                      ₹{total.toLocaleString()}
                    </span>
                    {(savings > 0 || couponDiscount > 0) && (
                      <p className="text-xs text-green-500 font-medium mt-0.5">
                        Total savings: ₹
                        {(savings + couponDiscount).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary justify-center py-4 text-base shadow-lg shadow-rose-200 mb-3"
              >
                Proceed to Checkout
                <ArrowRightIcon className="w-5 h-5" />
              </button>

              <Link
                to="/products"
                className="w-full btn-secondary justify-center py-3 text-sm"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-gray-100">
                {[
                  { icon: '🔒', label: 'Secure' },
                  { icon: '🚚', label: 'Fast Ship' },
                  { icon: '🔄', label: 'Easy Return' },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-xs text-gray-400">{badge.label}</span>
                  </div>
                ))}
              </div>

              {/* Payment Icons */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center mb-2">
                  We accept
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {['Visa', 'UPI', 'Paytm', 'GPay', 'NetBank'].map((p) => (
                    <span
                      key={p}
                      className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-2.5 py-1 rounded-lg font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed / Recommendations */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-gray-800 mb-2">
            You might also love
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Handpicked just for you ✨
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Link
                key={i}
                to="/products"
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="aspect-square bg-gradient-to-br from-rose-50 to-blush-50 flex items-center justify-center">
                  <span className="text-4xl opacity-40">💎</span>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 font-medium">
                    Explore More
                  </p>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-rose-500 transition-colors">
                    View Collection
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;