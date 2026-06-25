// src/components/checkout/PaymentStep.jsx
import React, { useState } from 'react';
import {
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Card3D from './Card3D';
import {
  encryptPaymentData,
  validateCardNumber,
  detectCardType,
  formatCardNumber,
  formatExpiry,
  validateUPIId,
  maskUPIId,
} from '../../utils/encryption';

// UPI App configurations with real-ish logos
const UPI_APPS = [
  {
    id: 'phonepe',
    name: 'PhonePe',
    color: '#5f259f',
    gradient: 'from-purple-600 to-indigo-700',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    logo: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect width="40" height="40" rx="10" fill="#5f259f" />
        <path
          d="M12 20l6-8v6h4l-6 8v-6h-4z"
          fill="white"
          strokeWidth="0"
        />
      </svg>
    ),
  },
  {
    id: 'googlepay',
    name: 'Google Pay',
    color: '#4285f4',
    gradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    logo: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect width="40" height="40" rx="10" fill="#4285f4" />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
        >
          G
        </text>
      </svg>
    ),
  },
  {
    id: 'paytm',
    name: 'Paytm',
    color: '#00baf2',
    gradient: 'from-sky-400 to-cyan-500',
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
    logo: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect width="40" height="40" rx="10" fill="#00baf2" />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          Ptm
        </text>
      </svg>
    ),
  },
  {
    id: 'bhim',
    name: 'BHIM',
    color: '#00796b',
    gradient: 'from-teal-600 to-emerald-700',
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    logo: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect width="40" height="40" rx="10" fill="#00796b" />
        <text
          x="20"
          y="16"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontWeight="bold"
        >
          BHIM
        </text>
        <text
          x="20"
          y="28"
          textAnchor="middle"
          fill="#ffab40"
          fontSize="10"
          fontWeight="bold"
        >
          UPI
        </text>
      </svg>
    ),
  },
  {
    id: 'amazonpay',
    name: 'Amazon Pay',
    color: '#ff9900',
    gradient: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    logo: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect width="40" height="40" rx="10" fill="#232f3e" />
        <path
          d="M10 24c6 4 14 4 20 0"
          stroke="#ff9900"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M26 22l4 2-2 3"
          stroke="#ff9900"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Pay',
    color: '#25d366',
    gradient: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    logo: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect width="40" height="40" rx="10" fill="#25d366" />
        <path
          d="M20 8a12 12 0 00-10.4 18L8 32l6.2-1.6A12 12 0 1020 8z"
          fill="white"
          fillOpacity="0.3"
        />
        <text
          x="20"
          y="25"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
        >
          W
        </text>
      </svg>
    ),
  },
];

const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'PhonePe, GPay, Paytm & more',
    icon: DevicePhoneMobileIcon,
    recommended: true,
    discount: '5% cashback',
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCardIcon,
    recommended: false,
    discount: null,
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All Indian banks',
    icon: BuildingLibraryIcon,
    recommended: false,
    discount: null,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when delivered',
    icon: BanknotesIcon,
    recommended: false,
    discount: null,
    extra: '₹40 COD charge',
  },
];

const POPULAR_BANKS = [
  { id: 'sbi', name: 'State Bank of India', short: 'SBI' },
  { id: 'hdfc', name: 'HDFC Bank', short: 'HDFC' },
  { id: 'icici', name: 'ICICI Bank', short: 'ICICI' },
  { id: 'axis', name: 'Axis Bank', short: 'Axis' },
  { id: 'kotak', name: 'Kotak Mahindra', short: 'Kotak' },
  { id: 'bob', name: 'Bank of Baroda', short: 'BoB' },
  { id: 'pnb', name: 'Punjab National Bank', short: 'PNB' },
  { id: 'canara', name: 'Canara Bank', short: 'Canara' },
];

const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  paymentDetails,
  setPaymentDetails,
  onNext,
  onBack,
  total,
}) => {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [cardFlipped, setCardFlipped] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [errors, setErrors] = useState({});
  const [encrypting, setEncrypting] = useState(false);

  const handleCardChange = (field, value) => {
    let formatted = value;
    if (field === 'number') formatted = formatCardNumber(value);
    if (field === 'expiry') formatted = formatExpiry(value);
    if (field === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 4);

    setCardData((prev) => ({ ...prev, [field]: formatted }));
    setErrors((prev) => ({ ...prev, [field]: '' }));

    if (field === 'cvv') setCardFlipped(true);
    else setCardFlipped(false);
  };

  const validatePayment = () => {
    const errs = {};

    if (paymentMethod === 'card') {
      if (
        !cardData.number ||
        !validateCardNumber(cardData.number.replace(/\s/g, ''))
      ) {
        errs.number = 'Invalid card number';
      }
      if (!cardData.name.trim()) errs.name = 'Card holder name required';
      if (!cardData.expiry || !/^\d{2}\/\d{2}$/.test(cardData.expiry))
        errs.expiry = 'Invalid expiry (MM/YY)';
      if (!cardData.cvv || cardData.cvv.length < 3)
        errs.cvv = 'Invalid CVV';
    }

    if (paymentMethod === 'upi' && !selectedUpiApp) {
      if (!upiId || !validateUPIId(upiId)) {
        errs.upi = 'Enter a valid UPI ID (e.g. name@paytm)';
      }
    }

    if (paymentMethod === 'netbanking' && !selectedBank) {
      errs.bank = 'Please select a bank';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceed = async () => {
    if (!paymentMethod) {
      setErrors({ method: 'Please select a payment method' });
      return;
    }
    if (!validatePayment()) return;

    setEncrypting(true);

    // Encrypt payment data
    let encryptedData = {};
    try {
      if (paymentMethod === 'card') {
        encryptedData = encryptPaymentData({
          type: 'card',
          cardType: detectCardType(cardData.number),
          lastFour: cardData.number.replace(/\s/g, '').slice(-4),
          // Never send full card details in real app
        });
      } else if (paymentMethod === 'upi') {
        encryptedData = encryptPaymentData({
          type: 'upi',
          app: selectedUpiApp?.name,
          maskedId: upiId ? maskUPIId(upiId) : 'app-payment',
        });
      } else if (paymentMethod === 'netbanking') {
        encryptedData = encryptPaymentData({
          type: 'netbanking',
          bank: selectedBank?.name,
        });
      } else {
        encryptedData = { type: 'cod' };
      }

      await new Promise((r) => setTimeout(r, 1000)); // Simulate encryption time

      setPaymentDetails({
        method: paymentMethod,
        encrypted: encryptedData,
        displayInfo:
          paymentMethod === 'card'
            ? `${detectCardType(cardData.number).toUpperCase()} ending ${cardData.number.replace(/\s/g, '').slice(-4)}`
            : paymentMethod === 'upi'
              ? selectedUpiApp?.name || maskUPIId(upiId)
              : paymentMethod === 'netbanking'
                ? selectedBank?.name
                : 'Cash on Delivery',
      });

      onNext();
    } catch {
      setErrors({ method: 'Encryption failed. Please try again.' });
    } finally {
      setEncrypting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-serif text-xl font-bold text-gray-800">
          Payment Method
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          All transactions are secure and encrypted 🔒
        </p>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
        <ShieldCheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-green-700">
            256-bit SSL Encrypted
          </p>
          <p className="text-xs text-green-600">
            Your payment information is securely encrypted
          </p>
        </div>
        <LockClosedIcon className="w-4 h-4 text-green-400 ml-auto" />
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <div key={method.id}>
            <button
              onClick={() => {
                setPaymentMethod(method.id);
                setErrors({});
              }}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                paymentMethod === method.id
                  ? 'border-rose-400 bg-rose-50/50 shadow-md ring-1 ring-rose-200'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Radio */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    paymentMethod === method.id
                      ? 'border-rose-500'
                      : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === method.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-scale-in" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    paymentMethod === method.id
                      ? 'bg-rose-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <method.icon
                    className={`w-5 h-5 ${
                      paymentMethod === method.id
                        ? 'text-rose-500'
                        : 'text-gray-500'
                    }`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 text-sm">
                      {method.name}
                    </p>
                    {method.recommended && (
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-bold uppercase tracking-wider">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {method.description}
                  </p>
                </div>

                {/* Discount / Extra */}
                {method.discount && (
                  <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100 font-medium flex-shrink-0">
                    {method.discount}
                  </span>
                )}
                {method.extra && (
                  <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-100 font-medium flex-shrink-0">
                    {method.extra}
                  </span>
                )}
              </div>
            </button>

            {/* ── UPI Expanded ── */}
            {paymentMethod === 'upi' && method.id === 'upi' && (
              <div className="mt-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm animate-slide-down space-y-5">
                {/* UPI Apps Grid */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Pay using UPI App
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {UPI_APPS.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => {
                          setSelectedUpiApp(app);
                          setUpiId('');
                          setErrors({});
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-center flex flex-col items-center gap-2 ${
                          selectedUpiApp?.id === app.id
                            ? `${app.borderColor} ${app.bgLight} shadow-md`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {app.logo}
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">
                          {app.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">
                    OR
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* UPI ID Input */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Enter UPI ID
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value.toLowerCase());
                        setSelectedUpiApp(null);
                        setErrors({});
                      }}
                      placeholder="yourname@paytm"
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
                        errors.upi
                          ? 'border-red-300 bg-red-50 focus:border-red-400'
                          : 'border-gray-200 focus:border-rose-400'
                      }`}
                    />
                    {upiId && validateUPIId(upiId) && (
                      <div className="flex items-center px-3">
                        <svg
                          className="w-5 h-5 text-green-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.upi && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <ExclamationCircleIcon className="w-3.5 h-3.5" />
                      {errors.upi}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── Card Expanded ── */}
            {paymentMethod === 'card' && method.id === 'card' && (
              <div className="mt-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm animate-slide-down space-y-6">
                {/* 3D Card Preview */}
                <Card3D
                  cardData={cardData}
                  isFlipped={cardFlipped}
                  onFlipToggle={() => setCardFlipped(!cardFlipped)}
                />

                {/* Card Form */}
                <div className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) =>
                          handleCardChange('number', e.target.value)
                        }
                        maxLength={23}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full pl-4 pr-12 py-3 rounded-xl border-2 text-sm font-mono tracking-wider focus:outline-none transition-colors ${
                          errors.number
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 focus:border-rose-400'
                        }`}
                        onFocus={() => setCardFlipped(false)}
                      />
                      {/* Card type indicator */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {cardData.number.length > 1 && (
                          <span className="text-xs font-bold text-gray-400 uppercase">
                            {detectCardType(cardData.number)}
                          </span>
                        )}
                      </div>
                    </div>
                    {errors.number && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.number}
                      </p>
                    )}
                  </div>

                  {/* Card Holder */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) =>
                        handleCardChange(
                          'name',
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="JOHN DOE"
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm uppercase tracking-wider focus:outline-none transition-colors ${
                        errors.name
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 focus:border-rose-400'
                      }`}
                      onFocus={() => setCardFlipped(false)}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) =>
                          handleCardChange('expiry', e.target.value)
                        }
                        maxLength={5}
                        placeholder="MM/YY"
                        className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-mono tracking-wider focus:outline-none transition-colors ${
                          errors.expiry
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 focus:border-rose-400'
                        }`}
                        onFocus={() => setCardFlipped(false)}
                      />
                      {errors.expiry && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.expiry}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardData.cvv}
                        onChange={(e) =>
                          handleCardChange('cvv', e.target.value)
                        }
                        maxLength={4}
                        placeholder="•••"
                        className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-mono tracking-wider focus:outline-none transition-colors ${
                          errors.cvv
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 focus:border-rose-400'
                        }`}
                        onFocus={() => setCardFlipped(true)}
                        onBlur={() => setCardFlipped(false)}
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Net Banking Expanded ── */}
            {paymentMethod === 'netbanking' && method.id === 'netbanking' && (
              <div className="mt-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm animate-slide-down">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Popular Banks
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {POPULAR_BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => {
                        setSelectedBank(bank);
                        setErrors({});
                      }}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        selectedBank?.id === bank.id
                          ? 'border-rose-400 bg-rose-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {bank.short}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 line-clamp-1">
                        {bank.name}
                      </p>
                    </button>
                  ))}
                </div>
                {errors.bank && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <ExclamationCircleIcon className="w-3.5 h-3.5" />
                    {errors.bank}
                  </p>
                )}
              </div>
            )}

            {/* ── COD Expanded ── */}
            {paymentMethod === 'cod' && method.id === 'cod' && (
              <div className="mt-3 p-5 bg-amber-50 rounded-2xl border border-amber-200 animate-slide-down">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      An additional ₹40 will be charged for COD orders.
                      Please keep exact change ready at the time of delivery.
                    </p>
                    <p className="text-xs text-amber-600 mt-2 font-medium">
                      Total payable: ₹{(total + 40).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {errors.method && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <ExclamationCircleIcon className="w-4 h-4" />
          {errors.method}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleProceed}
          disabled={encrypting || !paymentMethod}
          className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-base hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {encrypting ? (
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
              Securing Payment...
            </>
          ) : (
            <>
              <LockClosedIcon className="w-5 h-5" />
              Review Order
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;