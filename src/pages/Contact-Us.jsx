import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { miscService } from '../api/services/miscService';
// ─── Contact Info Card ────────────────────────────────────────────────────────
const ContactInfoCard = ({ icon: Icon, title, lines, color }) => (
  <div className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all duration-300">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
      {lines.map((line, i) => (
        <p key={i} className="text-gray-500 text-sm leading-relaxed">
          {line}
        </p>
      ))}
    </div>
  </div>
);

// ─── Success State ────────────────────────────────────────────────────────────
const SuccessState = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
    <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6 shadow-lg">
      <CheckCircleIcon className="w-12 h-12 text-green-500" />
    </div>
    <h3 className="font-serif text-2xl font-bold text-gray-800 mb-3">
      Message Sent! 🎉
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
      Thank you for reaching out! Our team will get back to you within
      24 hours.
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onReset}
        className="btn-secondary text-sm py-2.5 px-6 justify-center"
      >
        Send Another Message
      </button>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await miscService.contactUs(data);
      // Backend returns { status: true, message: "Contact form submitted successfully" }
      if (res?.data?.status === true || res?.status === true) {
        setSubmitted(true);
        reset();
      } else {
        setServerError(
          res?.data?.message || 'Something went wrong. Please try again.'
        );
      }
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          'Failed to send message. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setServerError('');
  };

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      lines: ['support@arkee.in', 'We reply within 24 hours'],
      color: 'bg-rose-50 text-rose-500',
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      lines: ['+91 98765 43210', 'Mon–Sat, 10am – 6pm IST'],
      color: 'bg-blue-50 text-blue-500',
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      lines: ['123, Jewellery Lane,', 'Jaipur, Rajasthan – 302001'],
      color: 'bg-green-50 text-green-500',
    },
    {
      icon: ClockIcon,
      title: 'Working Hours',
      lines: ['Monday – Saturday', '10:00 AM – 6:00 PM IST'],
      color: 'bg-gold-50 text-gold-500',
    },
  ];

  const faqs = [
    {
      q: 'How long does delivery take?',
      a: 'Standard delivery takes 5–7 business days. Express delivery is available at checkout.',
    },
    {
      q: 'Can I return or exchange a product?',
      a: 'Yes! We offer hassle-free returns within 7 days of delivery. See our shipping policy for details.',
    },
    {
      q: 'Are your products genuine?',
      a: 'Absolutely. Every piece is 100% authentic, handcrafted by verified artisans.',
    },
    {
      q: 'Do you offer customisation?',
      a: 'Yes, we offer custom orders. Reach out to us via this form with your requirements.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-gray-900 via-rose-950 to-blush-900 text-white py-16 md:py-20 relative overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-gold-300"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-gold-300 font-medium text-sm uppercase tracking-widest mb-4">
            💌 Get In Touch
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 leading-tight">
            We'd Love To{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-rose-300">
              Hear From You
            </span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, or just want to say hello? Our team
            is here for you — always.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ── Contact Info Cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {contactInfo.map((info) => (
            <ContactInfoCard key={info.title} {...info} />
          ))}
        </div>

        {/* ── Form + Map ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-rose-500 to-blush-500 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">
                    Send Us a Message
                  </h2>
                  <p className="text-white/75 text-xs mt-0.5">
                    We'll get back to you within 24 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            {submitted ? (
              <SuccessState onReset={handleReset} />
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-8 space-y-5"
              >
                {/* Server Error */}
                {serverError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                    {serverError}
                  </div>
                )}

                {/* Name + Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                      })}
                      placeholder="Priya Sharma"
                      className={`input-field text-sm ${
                        errors.name ? 'border-rose-400' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-rose-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email address',
                        },
                      })}
                      placeholder="you@example.com"
                      className={`input-field text-sm ${
                        errors.email ? 'border-rose-400' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-rose-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone', {
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Enter valid 10-digit phone number',
                      },
                    })}
                    placeholder="8383746473"
                    className={`input-field text-sm ${
                      errors.phone ? 'border-rose-400' : ''
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    {...register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters',
                      },
                    })}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    className={`input-field text-sm resize-none ${
                      errors.message ? 'border-rose-400' : ''
                    }`}
                  />
                  {errors.message && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary justify-center py-3.5 text-sm disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
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
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <PaperAirplaneIcon className="w-4 h-4" />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Side */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Map Placeholder */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[280px]">
              <iframe
                title="Arkee Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.0!2d75.7873!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzQ0LjYiTiA3NcKwNDcnMTQuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '280px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-serif font-bold text-gray-800 text-lg mb-4">
                Follow Us
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    name: 'Instagram',
                    handle: '@arkee.jewels',
                    color: 'bg-gradient-to-br from-purple-500 to-rose-500',
                    emoji: '📸',
                  },
                  {
                    name: 'Facebook',
                    handle: 'Arkee Jewellery',
                    color: 'bg-blue-500',
                    emoji: '👥',
                  },
                  {
                    name: 'WhatsApp',
                    handle: '+91 98765 43210',
                    color: 'bg-green-500',
                    emoji: '💬',
                  },
                  {
                    name: 'Pinterest',
                    handle: '@arkeejewels',
                    color: 'bg-red-500',
                    emoji: '📌',
                  },
                ].map((social) => (
                  <button
                    key={social.name}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 hover:border-rose-200 hover:shadow-sm transition-all text-left group"
                  >
                    <div
                      className={`w-9 h-9 ${social.color} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}
                    >
                      {social.emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-700 group-hover:text-rose-500 transition-colors">
                        {social.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {social.handle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ Section ─────────────────────────────────────────────────── */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-rose-500 font-medium text-sm uppercase tracking-widest">
              FAQ
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-blush-500">
                Questions
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-rose-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-rose-500 text-xs font-bold">Q</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-2">
                      {faq.q}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-rose-500 to-blush-600 rounded-3xl p-10 text-center text-white">
          <span className="text-3xl block mb-3">🌸</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
            Still Have Questions?
          </h2>
          <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
            Our support team is just a message away. We're here Monday to
            Saturday, 10am–6pm IST.
          </p>
          <a
            href="mailto:support@arkee.in"
            className="inline-flex items-center gap-2 bg-white text-rose-500 font-semibold px-8 py-3.5 rounded-2xl hover:bg-rose-50 transition-colors shadow-lg text-sm"
          >
            <EnvelopeIcon className="w-4 h-4" />
            Email Us Directly
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;