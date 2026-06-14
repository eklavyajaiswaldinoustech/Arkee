import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { authService } from '../../api/services/authService';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user || res?.data;
      if (token) {
        setAuth(user, token);
        toast.success(`Welcome back, ${user?.firstname || 'Beautiful'}! ✨`);
        navigate(from, { replace: true });
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (err) {
      toast.error(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-cream-50 to-blush-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* ─── Left Panel ─── */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-rose-400 via-blush-500 to-rose-600 p-12 text-white relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -bottom-20 -left-16 w-72 h-72 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 -right-8 w-40 h-40 bg-white/5 rounded-full" />

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
            <p className="text-rose-100 text-sm tracking-widest uppercase">
              Fine Jewellery
            </p>
          </div>

          {/* Center Content */}
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-1 bg-white/40 rounded-full" />
            <h2 className="font-display text-4xl font-bold leading-tight">
              Welcome back,
              <br />
              <span className="text-rose-200">Beautiful.</span>
            </h2>
            <p className="text-rose-100 leading-relaxed text-sm">
              Sign in to access your wishlist, orders, and exclusive member
              offers curated just for you.
            </p>

            {/* Feature List */}
            <div className="space-y-3 mt-6">
              {[
                '✨ Exclusive member-only offers',
                '💎 Track your orders in real-time',
                '🛍️ Save items to wishlist',
                '🎁 Early access to new collections',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-rose-100">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="relative z-10">
            <p className="text-rose-200 text-sm italic">
              "Jewellery is not just decoration. It's a story." ✦
            </p>
          </div>
        </div>

        {/* ─── Right Panel ─── */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-blush-500 flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-display font-bold text-gray-800">
              Ark<span className="text-rose-500">ee</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">
              Sign In
            </h1>
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-rose-500 font-semibold hover:text-rose-600 transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input-field pl-11 ${
                    errors.email ? 'border-rose-400 focus:ring-rose-300' : ''
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`input-field pl-11 pr-11 ${
                    errors.password ? 'border-rose-400 focus:ring-rose-300' : ''
                  }`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 5,
                      message: 'Password must be at least 5 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-rose-500 border-gray-300 rounded focus:ring-rose-400 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3.5 text-base shadow-lg shadow-rose-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
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
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Sign In to Arkee
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  name: 'Google',
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  ),
                },
                {
                  name: 'Facebook',
                  icon: (
                    <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <button
                  key={social.name}
                  type="button"
                  className="flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  {social.icon}
                  {social.name}
                </button>
              ))}
            </div>
          </form>

          {/* Footer Note */}
          <p className="text-xs text-gray-400 text-center mt-6">
            By signing in, you agree to our{' '}
            <Link to="/shipping-policy" className="text-rose-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/shipping-policy" className="text-rose-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;