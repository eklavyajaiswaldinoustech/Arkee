// src/pages/Checkout.jsx
import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  CreditCardIcon,
  ClipboardDocumentCheckIcon,
  ChevronLeftIcon,
  LockClosedIcon,
  ShoppingBagIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import useCheckout from '../hooks/useCheckout';
import useAuthStore from '../store/authStore';
import AddressStep from '../components/checkout/AddressStep';
import PaymentStep from '../components/checkout/PaymentStep';
import ReviewStep from '../components/checkout/ReviewStep';
import OrderSuccess from '../components/checkout/OrderSuccess';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 0, label: 'Address', icon: MapPinIcon, shortLabel: 'Address' },
  { id: 1, label: 'Payment', icon: CreditCardIcon, shortLabel: 'Payment' },
  {
    id: 2,
    label: 'Review',
    icon: ClipboardDocumentCheckIcon,
    shortLabel: 'Review',
  },
];

// ─── Helper: extract product fields from any cart-item shape ───────────────
const extractProduct = (item) => {
  const product = item?.productId || item?.product || item || {};

  const name =
    product?.name ||
    item?.name ||
    'Product';

  // Support arrays of images or a single string
  const rawImage =
    product?.images?.[0] ||
    product?.image ||
    item?.image ||
    null;
  const image = rawImage || 'https://placehold.co/80x80/fce7f3/be185d?text=✦';

  const price =
    product?.discountPrice ||
    product?.salePrice ||
    product?.price ||
    item?.price ||
    item?.discountPrice ||
    0;

  const originalPrice =
    product?.price ||
    item?.price ||
    price;

  const qty = item?.quantity || 1;

  const category =
    product?.category ||
    item?.category ||
    null;

  const sku =
    product?.sku ||
    item?.sku ||
    null;

  return { name, image, price, originalPrice, qty, category, sku };
};

// ─── Mini Cart Item Card ───────────────────────────────────────────────────
const CartItemCard = ({ item, index }) => {
  const { name, image, price, originalPrice, qty, category } =
    extractProduct(item);

  const hasDiscount =
    originalPrice > price && originalPrice !== price;

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div
      className="flex gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-rose-50/40 
                 border border-gray-100 hover:border-rose-100 transition-all duration-200 group"
    >
      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 
                        shadow-sm group-hover:shadow-md transition-shadow">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                'https://placehold.co/80x80/fce7f3/be185d?text=✦';
            }}
          />
        </div>
        {/* Quantity Badge */}
        <div
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full 
                      bg-gradient-to-br from-rose-500 to-pink-500 
                      text-white text-[10px] font-bold 
                      flex items-center justify-center shadow-sm"
        >
          {qty}
        </div>
        {/* Discount Badge */}
        {hasDiscount && (
          <div
            className="absolute -bottom-1 -left-1 px-1 py-0.5 rounded 
                        bg-green-500 text-white text-[9px] font-bold"
          >
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">
          {name}
        </p>
        {category && (
          <p className="text-[10px] text-gray-400 mb-1.5 flex items-center gap-1">
            <TagIcon className="w-2.5 h-2.5" />
            {category}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount && (
              <p className="text-[10px] text-gray-400 line-through leading-none">
                ₹{(originalPrice * qty).toLocaleString()}
              </p>
            )}
            <p className="text-sm font-bold text-gray-900">
              ₹{(price * qty).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400">
              ₹{price.toLocaleString()} × {qty}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Order Summary Sidebar ─────────────────────────────────────────────────
const OrderSummary = ({
  cartItems,
  subtotal,
  shippingCharge,
  tax,
  total,
  paymentMethod,
}) => {
  const itemCount = cartItems.reduce(
    (sum, item) => sum + (item?.quantity || 1),
    0
  );

  const grandTotal = total + (paymentMethod === 'cod' ? 40 : 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 border-b border-rose-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
              <ShoppingBagIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-gray-800">
                Order Summary
              </h2>
              <p className="text-[11px] text-gray-500">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
              </p>
            </div>
          </div>
          <div
            className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-600 
                        text-xs font-bold"
          >
            {cartItems.length} {cartItems.length === 1 ? 'product' : 'products'}
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* ── Product List ── */}
        <div
          className="space-y-2.5 mb-5 overflow-y-auto custom-scrollbar pr-1"
          style={{ maxHeight: cartItems.length > 2 ? '280px' : 'none' }}
        >
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBagIcon className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No items in cart</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <CartItemCard key={item?._id || item?.id || idx} item={item} index={idx} />
            ))
          )}
        </div>

        {/* ── Savings Banner (if applicable) ── */}
        {(() => {
          const totalOriginal = cartItems.reduce((sum, item) => {
            const { price, originalPrice, qty } = extractProduct(item);
            return sum + originalPrice * qty;
          }, 0);
          const savings = totalOriginal - subtotal;
          return savings > 0 ? (
            <div className="mb-4 px-3 py-2 rounded-lg bg-green-50 border border-green-100 flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-xs text-green-700 font-medium">
                You're saving{' '}
                <span className="font-bold">
                  ₹{savings.toLocaleString()}
                </span>{' '}
                on this order!
              </p>
            </div>
          ) : null;
        })()}

        {/* ── Price Breakdown ── */}
        <div className="space-y-2.5 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
            <span className="text-gray-700 font-semibold">
              ₹{subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Shipping</span>
            <div className="flex items-center gap-1.5">
              {shippingCharge === 0 ? (
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  FREE
                </span>
              ) : (
                <span className="text-gray-700 font-semibold">
                  ₹{shippingCharge.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Tax (3% GST)</span>
            <span className="text-gray-700 font-semibold">
              ₹{tax.toLocaleString()}
            </span>
          </div>

          {paymentMethod === 'cod' && (
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-amber-600 font-medium">COD Charge</span>
                <p className="text-[10px] text-amber-400">Cash on delivery fee</p>
              </div>
              <span className="text-amber-600 font-semibold">₹40</span>
            </div>
          )}
        </div>

        {/* ── Grand Total ── */}
        <div
          className="mt-4 p-4 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 
                      text-white"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs">Grand Total</p>
              <p className="text-white font-bold text-lg">
                ₹{grandTotal.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-[10px]">Incl. all taxes</p>
              {shippingCharge === 0 && (
                <p className="text-green-400 text-[10px] font-medium">
                  + Free Shipping
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Trust Signals ── */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider font-medium mb-3">
            Safe & Secure Shopping
          </p>
          <div className="space-y-2.5">
            {[
              {
                emoji: '🔒',
                text: '256-bit SSL Encryption',
                sub: 'Bank-level security',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                emoji: '📦',
                text: 'Free Returns',
                sub: '7-day easy return policy',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
              },
              {
                emoji: '💎',
                text: 'Authenticity Guaranteed',
                sub: 'Certified jewellery',
                color: 'text-rose-600',
                bg: 'bg-rose-50',
              },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 
                           transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${item.bg} flex items-center 
                              justify-center flex-shrink-0 text-base`}
                >
                  {item.emoji}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${item.color}`}>
                    {item.text}
                  </p>
                  <p className="text-[10px] text-gray-400">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Need Help ── */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">Need assistance?</p>
          <Link
            to="/contact"
            className="text-xs text-rose-500 hover:text-rose-600 font-semibold 
                       flex items-center gap-1 transition-colors"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Main Checkout Component ───────────────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    currentStep,
    selectedAddress,
    setSelectedAddress,
    savedAddresses,
    paymentMethod,
    setPaymentMethod,
    paymentDetails,
    setPaymentDetails,
    orderPlaced,
    orderId,
    processing,
    getUserData,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    editAddress,
    subtotal,
    shippingCharge,
    tax,
    total,
    cartItems,
    nextStep,
    prevStep,
    goToStep,
    placeOrder,
  } = useCheckout();

  const userData = useMemo(() => getUserData(), [getUserData]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      // toast.error('Your cart is empty!');
      // navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Handle place order
  const handlePlaceOrder = async () => {
    try {
      await placeOrder();
      toast.success('Order placed successfully! 🎉');
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <OrderSuccess
        orderId={orderId}
        email={userData.email}
        total={total + (paymentDetails?.method === 'cod' ? 40 : 0)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50/30">
      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  currentStep === 0 ? navigate('/cart') : prevStep()
                }
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="font-serif text-xl font-bold text-gray-800">
                  Secure Checkout
                </h1>
                {userData?.name && (
                  <p className="text-xs text-gray-400">
                    Welcome back, {userData.name} 👋
                  </p>
                )}
              </div>
            </div>

            {/* Security Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
              <LockClosedIcon className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-700">
                100% Secure Checkout
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Step Progress Bar ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const StepIcon = step.icon;

              return (
                <React.Fragment key={step.id}>
                  {/* Step Circle */}
                  <button
                    onClick={() => {
                      if (isCompleted) goToStep(step.id);
                    }}
                    disabled={!isCompleted && !isActive}
                    className={`flex flex-col items-center gap-2 transition-all 
                                ${isCompleted ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div
                      className={`relative w-12 h-12 rounded-2xl flex items-center 
                                  justify-center transition-all duration-500 
                                  ${
                                    isActive
                                      ? 'bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-200 scale-110'
                                      : isCompleted
                                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200'
                                        : 'bg-gray-100 border-2 border-dashed border-gray-200'
                                  }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-6 h-6 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <StepIcon
                          className={`w-5 h-5 ${
                            isActive ? 'text-white' : 'text-gray-400'
                          }`}
                        />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl bg-rose-400 animate-ping opacity-20" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold transition-colors 
                                  ${
                                    isActive
                                      ? 'text-rose-500'
                                      : isCompleted
                                        ? 'text-green-600'
                                        : 'text-gray-400'
                                  }`}
                    >
                      {step.shortLabel}
                    </span>
                  </button>

                  {/* Connector Line */}
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 mx-3 mb-6">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out 
                                      ${
                                        currentStep > index
                                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-full'
                                          : currentStep === index
                                            ? 'bg-gradient-to-r from-rose-400 to-rose-300 w-1/2'
                                            : 'w-0'
                                      }`}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Step Content */}
          <div className="lg:col-span-2 animate-fade-in">
            {currentStep === 0 && (
              <AddressStep
                savedAddresses={savedAddresses}
                selectedAddress={selectedAddress}
                onSelectAddress={setSelectedAddress}
                onSaveAddress={saveAddress}
                onDeleteAddress={deleteAddress}
                onSetDefault={setDefaultAddress}
                onEditAddress={editAddress}
                userData={userData}
                onNext={nextStep}
              />
            )}

            {currentStep === 1 && (
              <PaymentStep
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                paymentDetails={paymentDetails}
                setPaymentDetails={setPaymentDetails}
                onNext={nextStep}
                onBack={prevStep}
                total={total}
              />
            )}

            {currentStep === 2 && (
              <ReviewStep
                selectedAddress={selectedAddress}
                paymentDetails={paymentDetails}
                cartItems={cartItems}
                subtotal={subtotal}
                shippingCharge={shippingCharge}
                tax={tax}
                total={total}
                onBack={prevStep}
                onPlaceOrder={handlePlaceOrder}
                processing={processing}
              />
            )}
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shippingCharge={shippingCharge}
              tax={tax}
              total={total}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>

      {/* ── Animations & Scrollbar ── */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scale-in {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
        @keyframes draw-check {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0; }
        }
        .animate-fade-in  { animation: fade-in  0.4s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16,1,0.3,1); }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .animate-draw-check path {
          stroke-dasharray: 24;
          animation: draw-check 0.6s ease-out 0.3s forwards;
          stroke-dashoffset: 24;
        }
        .custom-scrollbar::-webkit-scrollbar       { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track  { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb  { background: #f3d0d7; border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #fda4af; }
      `}</style>
    </div>
  );
};

export default Checkout;