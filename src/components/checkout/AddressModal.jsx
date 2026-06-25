// src/components/checkout/AddressModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  XMarkIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import { INDIAN_STATES, POPULAR_CITIES } from '../../data/states';

// ── Helpers ──────────────────────────────────────────────────────────────────
/** Always returns a trimmed string, even if value is number / null / undefined */
const toStr = (val) => (val == null ? '' : String(val).trim());

const ADDRESS_TYPES = [
  { type: 'home',   label: 'Home',   icon: HomeIcon },
  { type: 'office', label: 'Office', icon: BuildingOfficeIcon },
  { type: 'other',  label: 'Other',  icon: BuildingStorefrontIcon },
];

const EMPTY_FORM = {
  fullName:     '',
  phone:        '',
  email:        '',
  addressLine1: '',
  addressLine2: '',
  landmark:     '',
  city:         '',
  state:        '',
  pincode:      '',
  type:         'home',
  isDefault:    false,
  label:        '',
};

const AddressModal = ({
  isOpen,
  onClose,
  onSave,
  editData = null,
  userData = {},
}) => {
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [errors, setErrors]               = useState({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);

  // ── Initialise form when modal opens ────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    if (editData) {
      // Normalise every field to string so .trim() never fails
      setForm({
        ...EMPTY_FORM,
        ...editData,
        fullName:     toStr(editData.fullName),
        phone:        toStr(editData.phone),
        email:        toStr(editData.email),
        addressLine1: toStr(editData.addressLine1),
        addressLine2: toStr(editData.addressLine2),
        landmark:     toStr(editData.landmark),
        city:         toStr(editData.city),
        state:        toStr(editData.state),
        pincode:      toStr(editData.pincode),
        label:        toStr(editData.label),
      });
    } else {
      // Pre-fill from logged-in user — userData.phone may be a number
      setForm({
        ...EMPTY_FORM,
        fullName: toStr(userData.name),
        email:    toStr(userData.email),
        phone:    toStr(userData.phone), // ← toStr handles number → string
      });
    }

    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editData]);
  // userData intentionally omitted — we only want the snapshot on open

  // ── City suggestions based on selected state ─────────────────────────────
  useEffect(() => {
    if (form.state) {
      const stateObj = INDIAN_STATES.find((s) => s.name === form.state);
      setCitySuggestions(
        stateObj && POPULAR_CITIES[stateObj.code]
          ? POPULAR_CITIES[stateObj.code]
          : []
      );
    } else {
      setCitySuggestions([]);
    }
  }, [form.state]);

  // ── Field updater ────────────────────────────────────────────────────────
  const setField = useCallback((key, value) => {
    // Always store strings for text fields
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }, []);

  // ── PIN Code auto-fill ───────────────────────────────────────────────────
  const handlePincodeChange = async (pincode) => {
    // pincode is already a string from the input handler below
    setField('pincode', pincode);

    if (pincode.length === 6) {
      setPincodeLoading(true);
      try {
        const res  = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await res.json();
        if (
          data[0]?.Status === 'Success' &&
          data[0]?.PostOffice?.length > 0
        ) {
          const po = data[0].PostOffice[0];
          setForm((prev) => ({
            ...prev,
            city:  po.District || prev.city,
            state: po.State    || prev.state,
          }));
        }
      } catch {
        /* silent – user can fill manually */
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};

    // Safe string coercion before every .trim() / regex test
    const fullName     = toStr(form.fullName);
    const phone        = toStr(form.phone);
    const addressLine1 = toStr(form.addressLine1);
    const city         = toStr(form.city);
    const state        = toStr(form.state);
    const pincode      = toStr(form.pincode);

    if (!fullName)
      errs.fullName = 'Name is required';

    if (!phone || !/^\d{10}$/.test(phone))
      errs.phone = 'Enter a valid 10-digit phone number';

    if (!addressLine1)
      errs.addressLine1 = 'Address is required';

    if (!city)
      errs.city = 'City is required';

    if (!state)
      errs.state = 'Please select a state';

    if (!pincode || !/^\d{6}$/.test(pincode))
      errs.pincode = 'Enter a valid 6-digit PIN code';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Sanitise the whole form before saving
    onSave({
      ...form,
      fullName:     toStr(form.fullName),
      phone:        toStr(form.phone),
      email:        toStr(form.email),
      addressLine1: toStr(form.addressLine1),
      addressLine2: toStr(form.addressLine2),
      landmark:     toStr(form.landmark),
      city:         toStr(form.city),
      state:        toStr(form.state),
      pincode:      toStr(form.pincode),
      label:        toStr(form.label),
    });
    onClose();
  };

  if (!isOpen) return null;

  // ── Reusable input class ─────────────────────────────────────────────────
  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
      errors[field]
        ? 'border-red-300 bg-red-50 focus:border-red-400'
        : 'border-gray-200 focus:border-rose-400'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* ── Header ── */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl border-b border-gray-100 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-800">
                {editData ? 'Edit Address' : 'Add New Address'}
              </h2>
              <p className="text-xs text-gray-400">
                Fill in your delivery details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* ── Address Type ── */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Address Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ADDRESS_TYPES.map((at) => (
                <button
                  key={at.type}
                  type="button"
                  onClick={() => setField('type', at.type)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    form.type === at.type
                      ? 'border-rose-400 bg-rose-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <at.icon
                    className={`w-5 h-5 mx-auto mb-1.5 ${
                      form.type === at.type ? 'text-rose-500' : 'text-gray-400'
                    }`}
                  />
                  <p
                    className={`text-xs font-semibold ${
                      form.type === at.type ? 'text-rose-600' : 'text-gray-600'
                    }`}
                  >
                    {at.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Name, Phone & Email */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Full Name */}
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
      Full Name *
    </label>
    <input
      type="text"
      value={form.fullName}
      onChange={(e) =>
        setForm({ ...form, fullName: e.target.value })
      }
      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-sm focus:outline-none ${
        errors.fullName
          ? "border-red-300 focus:border-red-400 bg-red-50"
          : "border-gray-200 focus:border-rose-400"
      }`}
      placeholder="John Doe"
    />
    {errors.fullName && (
      <p className="text-red-500 text-xs mt-1">
        {errors.fullName}
      </p>
    )}
  </div>

  {/* Phone */}
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
      Phone Number *
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        +91
      </span>
      <input
        type="tel"
        value={form.phone}
        onChange={(e) =>
          setForm({
            ...form,
            phone: e.target.value.replace(/\D/g, "").slice(0, 10),
          })
        }
        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors text-sm focus:outline-none ${
          errors.phone
            ? "border-red-300 focus:border-red-400 bg-red-50"
            : "border-gray-200 focus:border-rose-400"
        }`}
        placeholder="9876543210"
      />
    </div>
    {errors.phone && (
      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
    )}
  </div>

  {/* Email */}
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
      Email Address *
    </label>
    <input
      type="email"
      value={form.email}
      onChange={(e) =>
        setForm({ ...form, email: e.target.value })
      }
      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-sm focus:outline-none ${
        errors.email
          ? "border-red-300 focus:border-red-400 bg-red-50"
          : "border-gray-200 focus:border-rose-400"
      }`}
      placeholder="you@example.com"
    />
    {errors.email && (
      <p className="text-red-500 text-xs mt-1">
        {errors.email}
      </p>
    )}
  </div>
</div>
          {/* ── Address Line 1 ── */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Address Line 1 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.addressLine1}
              onChange={(e) => setField('addressLine1', e.target.value)}
              className={inputCls('addressLine1')}
              placeholder="House No., Building, Street"
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
            )}
          </div>

          {/* ── Address Line 2 ── */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Address Line 2
            </label>
            <input
              type="text"
              value={form.addressLine2}
              onChange={(e) => setField('addressLine2', e.target.value)}
              className={inputCls('addressLine2')}
              placeholder="Area, Colony (Optional)"
            />
          </div>

          {/* ── Landmark ── */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Landmark
            </label>
            <input
              type="text"
              value={form.landmark}
              onChange={(e) => setField('landmark', e.target.value)}
              className={inputCls('landmark')}
              placeholder="Near hospital, temple, etc. (Optional)"
            />
          </div>

          {/* ── PIN / City / State ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* PIN Code */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                PIN Code <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) =>
                    handlePincodeChange(
                      // ensure string output from the start
                      e.target.value.replace(/\D/g, '').slice(0, 6)
                    )
                  }
                  className={inputCls('pincode')}
                  placeholder="400001"
                />
                {pincodeLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="animate-spin w-4 h-4 text-rose-400"
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
                  </div>
                )}
              </div>
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setField('city', e.target.value)}
                list="city-suggestions"
                className={inputCls('city')}
                placeholder="Mumbai"
              />
              <datalist id="city-suggestions">
                {citySuggestions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                State <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.state}
                onChange={(e) => setField('state', e.target.value)}
                className={`${inputCls('state')} appearance-none bg-white`}
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          {/* ── Custom Label (type = other) ── */}
          {form.type === 'other' && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Address Label
              </label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setField('label', e.target.value)}
                className={inputCls('label')}
                placeholder="e.g. Parent's House, Gym, etc."
              />
            </div>
          )}

          {/* ── Default Checkbox ── */}
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={!!form.isDefault}
                onChange={(e) => setField('isDefault', e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                  form.isDefault
                    ? 'bg-rose-500 border-rose-500'
                    : 'border-gray-300 group-hover:border-rose-300'
                }`}
              >
                {form.isDefault && (
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600">
              Set as default address
            </span>
          </label>

          {/* ── Action Buttons ── */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium text-sm hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200"
            >
              {editData ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;