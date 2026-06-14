import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { authService } from '../../api/services/authService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your email 📩');
    } catch (err) {
      toast.error(err?.message || 'Email not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-cream-50 to-blush-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden">
          {/* Top Decoration */}
          <div className="h-2 bg-gradient-to-r from-rose-400 via-blush-500 to-gold-400" />

          <div className="p-8 sm:p-10">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-gold-400 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">
                  A
                </span>
              </div>
              <span className="text-xl font-display font-bold text-gray-800 tracking-wider">
                Ark<span className="text-rose-500">ee</span>
              </span>
            </div>

            {!sent ? (
              <>
                {/* Heading */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
                    <EnvelopeIcon className="w-8 h-8 text-rose-400" />
                  </div>
                  <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                    Forgot your password?
                  </h1>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    No worries! Enter your registered email and we'll send you a
                    link to reset your password.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Registered Email
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        placeholder="you@example.com"
                        className={`input-field pl-11 ${
                          error
                            ? 'border-rose-400 ring-1 ring-rose-300'
                            : ''
                        }`}
                        autoFocus
                      />
                    </div>
                    {error && (
                      <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary justify-center py-3.5 text-base disabled:opacity-70 shadow-lg shadow-rose-200"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
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
                        Sending link...
                      </span>
                    ) : (
                      <>
                        <EnvelopeIcon className="w-5 h-5" />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-600 leading-relaxed">
                    💡 <strong>Tip:</strong> Check your spam/junk folder if
                    you don't see the email within 5 minutes. The reset link
                    expires in 1 hour.
                  </p>
                </div>
              </>
            ) : (
              /* ── Success State ── */
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
                  <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">
                  Check your inbox! 📩
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-2">
                  We've sent a password reset link to:
                </p>
                <p className="text-rose-500 font-semibold text-base mb-6">
                  {email}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-8">
                  Click the link in the email to reset your password. The link
                  expires in 1 hour. If you don't see it, check your spam
                  folder.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSent(false);
                      setEmail('');
                    }}
                    className="w-full btn-secondary justify-center py-3 text-sm"
                  >
                    Try a different email
                  </button>
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-rose-500 transition-colors py-2"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}

            {/* Back to Login (shown when form visible) */}
            {!sent && (
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Your data is safe and encrypted with us
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;