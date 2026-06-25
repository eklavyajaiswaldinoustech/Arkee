// src/components/checkout/ReviewStep.jsx
import React from 'react';
import {
  MapPinIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const ReviewStep = ({
  selectedAddress,
  paymentDetails,
  cartItems,
  subtotal,
  shippingCharge,
  tax,
  total,
  onBack,
  onPlaceOrder,
  processing,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-serif text-xl font-bold text-gray-800">
          Review Your Order
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Please verify all details before placing the order
        </p>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-rose-400" />
            Delivery Address
          </h3>
          <span className="text-xs bg-rose-50 text-rose-500 px-2.5 py-1 rounded-full border border-rose-100 font-medium capitalize">
            {selectedAddress?.type}
          </span>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="font-semibold text-gray-800 text-sm">
            {selectedAddress?.fullName}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {selectedAddress?.addressLine1}
            {selectedAddress?.addressLine2 &&
              `, ${selectedAddress.addressLine2}`}
          </p>
          {selectedAddress?.landmark && (
            <p className="text-sm text-gray-500">
              Near {selectedAddress.landmark}
            </p>
          )}
          <p className="text-sm text-gray-500">
            {selectedAddress?.city}, {selectedAddress?.state} -{' '}
            {selectedAddress?.pincode}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            📞 +91 {selectedAddress?.phone}
          </p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <CreditCardIcon className="w-4 h-4 text-rose-400" />
          Payment Method
        </h3>
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
            <ShieldCheckIcon className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm capitalize">
              {paymentDetails?.method?.replace('_', ' ')}
            </p>
            <p className="text-xs text-gray-500">
              {paymentDetails?.displayInfo}
            </p>
          </div>
          <span className="ml-auto text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-100 font-medium">
            🔒 Encrypted
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
          <TagIcon className="w-4 h-4 text-rose-400" />
          Order Items ({cartItems.length})
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {cartItems.map((item, idx) => {
            const product = item.productId || item.product || item;
            const name = product?.name || 'Product';
            const image =
              product?.images?.[0] ||
              'https://placehold.co/80x80/fce7f3/be185d?text=A';
            const price =
              product?.discountPrice || product?.price || item.price || 0;
            const qty = item.quantity || 1;

            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <img
                  src={image}
                  alt={name}
                  className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                    {name}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {qty}</p>
                </div>
                <p className="font-semibold text-gray-800 text-sm">
                  ₹{(price * qty).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Price Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-800 font-medium">
              ₹{subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              <TruckIcon className="w-3.5 h-3.5" />
              Shipping
            </span>
            <span
              className={`font-medium ${
                shippingCharge === 0 ? 'text-green-600' : 'text-gray-800'
              }`}
            >
              {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax (GST 3%)</span>
            <span className="text-gray-800 font-medium">
              ₹{tax.toLocaleString()}
            </span>
          </div>
          {paymentDetails?.method === 'cod' && (
            <div className="flex justify-between text-sm">
              <span className="text-amber-600">COD Charge</span>
              <span className="text-amber-600 font-medium">₹40</span>
            </div>
          )}
          <div className="border-t-2 border-dashed border-gray-100 pt-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800 text-base">
                Total Amount
              </span>
              <span className="font-bold text-gray-900 text-2xl">
                ₹
                {(
                  total + (paymentDetails?.method === 'cod' ? 40 : 0)
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Delivery */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 flex items-center gap-3">
        <TruckIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Estimated Delivery
          </p>
          <p className="text-xs text-blue-600">
            {new Date(
              Date.now() + 5 * 24 * 60 * 60 * 1000
            ).toLocaleDateString('en-IN', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}{' '}
            —{' '}
            {new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString('en-IN', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={processing}
          className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={processing}
          className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-base hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {processing ? (
            <>
              <svg
                className="animate-spin w-5 h-5"
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
              Processing Payment...
            </>
          ) : (
            <>
              🔒 Place Order — ₹
              {(
                total + (paymentDetails?.method === 'cod' ? 40 : 0)
              ).toLocaleString()}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;