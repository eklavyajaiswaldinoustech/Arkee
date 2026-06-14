import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { authService } from '../../api/services/authService';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 5 characters', test: password?.length >= 5 },
    { label: 'Contains a number', test: /\d/.test(password) },
    { label: 'Contains a letter', test: /[a-zA-Z]/.test(password) },
  ];
  const passed = checks.filter((c) => c.test).length;
  const strength = ['', 'Weak', 'Fair', 'Strong'][passed];
  const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-400'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= passed ? colors[passed] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${passed === 3 ? 'text-green-500' : passed === 2 ? 'text-yellow-500' : 'text-red-400'}`}>
        {strength} password
      </p>
      <div className="space-y-1">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={`w-3 h-3 rounded-full flex items-center justify-center ${
                check.test ? 'bg-green-400' : 'bg-gray-200'
              }`}
            >
              {check.test && (
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`text-xs ${check.test ? 'text-green-500' : 'text-gray-400'}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const InputField = ({ label, icon, error, children, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      {children}
    </div>
    {error && (
      <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const password = watch('password');
  const firstname = watch('firstname');

  const goToStep2 = async () => {
    const valid = await trigger(['firstname', 'lastname', 'email', 'mobile']);
    if (valid) setStep(2);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const res = await authService.register(payload);
      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user || res?.data;

      if (token) {
        setAuth(user, token);
        toast.success('Welcome to Arkee! 🎉 Account created successfully!');
        navigate('/');
      } else {
        toast.success('Account created! Please login.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-cream-50 to-blush-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* ─── Left Panel ─── */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blush-500 via-rose-400 to-gold-500 p-12 text-white relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -bottom-20 -right-16 w-72 h-72 bg-white/10 rounded-full" />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-display font-bold tracking-wider">
                Arkee
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-5">
            <div className="w-16 h-1 bg-white/40 rounded-full" />
            <h2 className="font-display text-4xl font-bold leading-tight">
              Join the
              <br />
              <span className="text-rose-200">Arkee Family</span>
            </h2>
            <p className="text-rose-100 text-sm leading-relaxed">
              Become part of a community that celebrates beauty, elegance and
              the art of jewellery.
            </p>

            {/* Steps Progress */}
            <div className="space-y-4 mt-6">
              <p className="text-sm font-medium text-rose-200 uppercase tracking-wider">
                Quick 2-Step Registration
              </p>
              {[
                { num: 1, label: 'Personal Information', active: step >= 1 },
                { num: 2, label: 'Set Your Password', active: step >= 2 },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      s.active ? 'bg-white text-rose-500' : 'bg-white/20 text-white'
                    }`}
                  >
                    {step > s.num ? (
                      <CheckCircleIcon className="w-5 h-5 text-rose-500" />
                    ) : (
                      s.num
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      s.active ? 'text-white font-medium' : 'text-rose-200'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Perks */}
            <div className="space-y-2 mt-4 border-t border-white/20 pt-4">
              {[
                '🎁 Get ₹100 off your first order',
                '💌 Personalised style recommendations',
                '⚡ Early access to flash sales',
              ].map((perk, i) => (
                <p key={i} className="text-xs text-rose-100">
                  {perk}
                </p>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-rose-200 text-sm italic">
              "Style is a way of saying who you are." ✦
            </p>
          </div>
        </div>

        {/* ─── Right Panel ─── */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-blush-500 flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-display font-bold text-gray-800">
              Ark<span className="text-rose-500">ee</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-bold text-gray-800 mb-1">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-rose-500 font-semibold hover:text-rose-600"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Step Indicator (Mobile) */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                <span className={`text-xs ${step >= s ? 'text-rose-500 font-medium' : 'text-gray-400'}`}>
                  {s === 1 ? 'Personal Info' : 'Security'}
                </span>
                {s < 2 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="First Name"
                    required
                    error={errors.firstname?.message}
                    icon={<UserIcon className="w-4 h-4 text-gray-400" />}
                  >
                    <input
                      type="text"
                      placeholder="Priya"
                      className={`input-field pl-11 ${errors.firstname ? 'border-rose-400' : ''}`}
                      {...register('firstname', {
                        required: 'First name required',
                        minLength: { value: 2, message: 'Too short' },
                      })}
                    />
                  </InputField>

                  <InputField
                    label="Last Name"
                    required
                    error={errors.lastname?.message}
                  >
                    <input
                      type="text"
                      placeholder="Sharma"
                      className={`input-field ${errors.lastname ? 'border-rose-400' : ''}`}
                      {...register('lastname', {
                        required: 'Last name required',
                        minLength: { value: 2, message: 'Too short' },
                      })}
                    />
                  </InputField>
                </div>

                {/* Email */}
                <InputField
                  label="Email Address"
                  required
                  error={errors.email?.message}
                  icon={<EnvelopeIcon className="w-4 h-4 text-gray-400" />}
                >
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`input-field pl-11 ${errors.email ? 'border-rose-400' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Enter a valid email',
                      },
                    })}
                  />
                </InputField>

                {/* Mobile */}
                <InputField
                  label="Mobile Number"
                  required
                  error={errors.mobile?.message}
                  icon={<PhoneIcon className="w-4 h-4 text-gray-400" />}
                >
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    className={`input-field pl-11 ${errors.mobile ? 'border-rose-400' : ''}`}
                    {...register('mobile', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter a valid 10-digit mobile number',
                      },
                    })}
                  />
                </InputField>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={goToStep2}
                  className="w-full btn-primary justify-center py-3.5 text-base shadow-lg shadow-rose-200"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                {/* Welcome Note */}
                {firstname && (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">👋</span>
                    <p className="text-sm text-rose-700">
                      Almost there, <strong>{firstname}</strong>! Just set your password.
                    </p>
                  </div>
                )}

                {/* Password */}
                <InputField
                  label="Create Password"
                  required
                  error={errors.password?.message}
                  icon={<LockClosedIcon className="w-4 h-4 text-gray-400" />}
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 5 characters"
                    className={`input-field pl-11 pr-11 ${errors.password ? 'border-rose-400' : ''}`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 5,
                        message: 'Minimum 5 characters',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </InputField>

                {/* Password Strength */}
                <PasswordStrength password={password} />

                {/* Confirm Password */}
                <InputField
                  label="Confirm Password"
                  required
                  error={errors.confirmPassword?.message}
                  icon={<LockClosedIcon className="w-4 h-4 text-gray-400" />}
                >
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    className={`input-field pl-11 pr-11 ${errors.confirmPassword ? 'border-rose-400' : ''}`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (val) =>
                        val === password || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
                  >
                    {showConfirm ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </InputField>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 text-rose-500 border-gray-300 rounded focus:ring-rose-400 mt-0.5 cursor-pointer flex-shrink-0"
                    {...register('terms', {
                      required: 'Please accept the terms',
                    })}
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                    I agree to Arkee's{' '}
                    <Link to="/shipping-policy" className="text-rose-500 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/shipping-policy" className="text-rose-500 hover:underline">
                      Privacy Policy
                    </Link>
                    . I'd also love to receive style tips and exclusive offers!
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-rose-500 text-xs">{errors.terms.message}</p>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary px-5 py-3"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary justify-center py-3 shadow-lg shadow-rose-200 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      '🎉 Create Account'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;