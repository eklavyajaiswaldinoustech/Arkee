import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { miscService } from '../api/services/miscService';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await miscService.contactUs(data);
      setSubmitted(true);
      reset();
      toast.success('Message sent! We\'ll get back to you soon 💌');
    } catch (err) {
      toast.error(err?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Call Us',
      detail: '+91 77349 84892',
      subDetail: 'Mon–Sat, 10am – 6pm IST',
      action: 'tel:+917734984892',
      color: 'bg-rose-50 text-rose-500',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      detail: 'hello@arkee.in',
      subDetail: 'We reply within 24 hours',
      action: 'mailto:hello@arkee.in',
      color: 'bg-blush-50 text-blush-500',
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      detail: 'Jaipur, Rajasthan',
      subDetail: 'India — 302001',
      action: 'https://maps.google.com',
      color: 'bg-gold-50 text-gold-600',
    },
    {
      icon: ClockIcon,
      title: 'Working Hours',
      detail: 'Mon – Saturday',
      subDetail: '10:00 AM – 6:00 PM IST',
      action: null,
      color: 'bg-green-50 text-green-600',
    },
  ];

  const faqs = [
    {
      q: 'How long does delivery take?',
      a: 'Standard delivery takes 3–5 business days across India. Express delivery is available at additional charges.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 7-day hassle-free return policy. Items must be in original condition with tags intact.',
    },
    {
      q: 'Are your jewellery pieces hallmarked?',
      a: 'Yes! All our gold and silver pieces come with proper hallmarking and quality certifications.',
    },
    {
      q: 'Do you offer gift wrapping?',
      a: 'Absolutely! All Arkee orders are packed in our signature gift box. Additional gift wrapping is available at checkout.',
    },
    {
      q: 'Can I customise a jewellery piece?',
      a: 'Yes, we do take customisation orders. Please contact us with your requirements and our team will assist you.',
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-rose-950 to-blush-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-56 h-56 rounded-full bg-rose-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-gold-400 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/20">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-rose-300" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Get in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-gold-300">
              Touch
            </span>
          </h1>
          <p className="text-white/70 text-base max-w-lg mx-auto leading-relaxed">
            Have a question, need help with an order, or want to share
            feedback? We'd love to hear from you!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactInfo.map((info, i) => {
            const Icon = info.icon;
            const content = (
              <div
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-center h-full"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {info.title}
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {info.detail}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {info.subDetail}
                </p>
              </div>
            );

            return info.action ? (
              <a
                key={i}
                href={info.action}
                target={info.action.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="block"
              >
                {content}
              </a>
            ) : (
              <div key={i}>{content}</div>
            );
          })}
        </div>

        {/* Main Content: Form + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              {!submitted ? (
                <>
                  <div className="mb-8">
                    <h2 className="font-serif text-2xl font-bold text-gray-800 mb-1">
                      Send us a Message
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Fill out the form and we'll get back to you within 24
                      hours.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name{' '}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Priya Sharma"
                        className={`input-field ${
                          errors.name ? 'border-rose-400' : ''
                        }`}
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Min 2 characters',
                          },
                        })}
                      />
                      {errors.name && (
                        <p className="text-rose-500 text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email & Phone Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address{' '}
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          className={`input-field ${
                            errors.email ? 'border-rose-400' : ''
                          }`}
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Invalid email',
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="text-rose-500 text-xs mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="9876543210"
                          className={`input-field ${
                            errors.phone ? 'border-rose-400' : ''
                          }`}
                          {...register('phone', {
                            pattern: {
                              value: /^[6-9]\d{9}$/,
                              message: 'Invalid phone number',
                            },
                          })}
                        />
                        {errors.phone && (
                          <p className="text-rose-500 text-xs mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Subject
                      </label>
                      <select
                        className="input-field"
                        {...register('subject')}
                      >
                        <option value="">Select a topic</option>
                        <option value="order">Order Related</option>
                        <option value="product">Product Enquiry</option>
                        <option value="return">Return / Exchange</option>
                        <option value="payment">Payment Issue</option>
                        <option value="customisation">Customisation Request</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message{' '}
                        <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        className={`input-field resize-none ${
                          errors.message ? 'border-rose-400' : ''
                        }`}
                        {...register('message', {
                          required: 'Message is required',
                          minLength: {
                            value: 20,
                            message: 'Please write at least 20 characters',
                          },
                        })}
                      />
                      {errors.message && (
                        <p className="text-rose-500 text-xs mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary justify-center py-4 text-base shadow-lg shadow-rose-200 disabled:opacity-70"
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
                          Sending...
                        </span>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Success State */
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-green-200">
                    <svg
                      className="w-10 h-10 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                    Message Sent! 💌
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
                    Thank you for reaching out! Our team will get back to you
                    within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary text-sm py-2.5"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Map + Social */}
          <div className="lg:col-span-2 space-y-5">
            {/* Map Placeholder */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-56 bg-gradient-to-br from-rose-100 to-blush-100 relative flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">
                    Jaipur, Rajasthan
                  </p>
                  <p className="text-xs text-gray-400">India — 302001</p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 right-4 bg-white text-rose-500 text-xs font-medium px-3 py-1.5 rounded-full shadow-md hover:bg-rose-50 transition-colors"
                >
                  Open in Maps →
                </a>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">
                  Arkee Fine Jewellery
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Jaipur, Rajasthan, India 302001
                  <br />
                  Mon–Sat: 10am – 6pm IST
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h4 className="font-semibold text-gray-800 text-sm mb-4">
                Follow Us
              </h4>
              <div className="space-y-3">
                {[
                  {
                    name: 'Instagram',
                    handle: '@arkee.jewellery',
                    icon: '📸',
                    color: 'from-rose-400 to-blush-600',
                    url: 'https://instagram.com',
                  },
                  {
                    name: 'Facebook',
                    handle: '/ArkeeJewellery',
                    icon: '👥',
                    color: 'from-blue-400 to-blue-600',
                    url: 'https://facebook.com',
                  },
                  {
                    name: 'Pinterest',
                    handle: '/arkee',
                    icon: '📌',
                    color: 'from-red-400 to-rose-600',
                    url: 'https://pinterest.com',
                  },
                  {
                    name: 'WhatsApp',
                    handle: '+91 77349 84892',
                    icon: '💬',
                    color: 'from-green-400 to-teal-600',
                    url: 'https://wa.me/917734984892',
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center text-base flex-shrink-0`}
                    >
                      {social.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-rose-500 transition-colors">
                        {social.name}
                      </p>
                      <p className="text-xs text-gray-400">{social.handle}</p>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-gray-300 ml-auto group-hover:text-rose-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-sm">
              Quick answers to common questions
            </p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-800 pr-4">
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      openFaq === i
                        ? 'border-rose-500 bg-rose-500 text-white rotate-180'
                        : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;