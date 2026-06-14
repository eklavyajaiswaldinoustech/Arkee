import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ClockIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { miscService } from '../api/services/miscService';

const sections = [
  {
    id: 'shipping',
    icon: TruckIcon,
    title: 'Shipping Policy',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    content: [
      {
        subtitle: 'Free Shipping',
        text: 'We offer FREE standard shipping on all orders above ₹999 across India. For orders below ₹999, a flat shipping fee of ₹99 is charged.',
      },
      {
        subtitle: 'Standard Delivery',
        text: 'Standard delivery takes 3–5 business days from the date of dispatch. Orders placed before 2 PM IST on weekdays are dispatched the same day.',
      },
      {
        subtitle: 'Express Delivery',
        text: 'Express delivery (1–2 business days) is available for select pincodes at an additional charge of ₹149. Available at checkout if your pincode is eligible.',
      },
      {
        subtitle: 'Dispatch Time',
        text: 'All in-stock items are dispatched within 24 hours of order confirmation. Custom or personalised orders may take 3–7 additional business days.',
      },
      {
        subtitle: 'Tracking',
        text: 'Once your order is dispatched, you will receive a tracking link via SMS and email. You can also track your order from the "My Orders" section.',
      },
      {
        subtitle: 'International Shipping',
        text: 'Currently, we only ship within India. International shipping is coming soon — stay tuned!',
      },
    ],
  },
  {
    id: 'returns',
    icon: ArrowPathIcon,
    title: 'Return & Exchange Policy',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    content: [
      {
        subtitle: '7-Day Return Window',
        text: 'We accept returns within 7 days of delivery. Items must be unused, in original condition, with all tags and packaging intact.',
      },
      {
        subtitle: 'How to Initiate a Return',
        text: 'To initiate a return, contact us at hello@arkee.in or WhatsApp us with your order ID and reason for return. Our team will guide you through the process.',
      },
      {
        subtitle: 'Non-Returnable Items',
        text: 'The following items cannot be returned: customised/personalised jewellery, items damaged due to misuse, items without original packaging, and items marked as "Final Sale".',
      },
      {
        subtitle: 'Exchange Policy',
        text: 'Exchanges are accepted within 7 days for size or design changes. The replacement item will be shipped once we receive and verify the returned product.',
      },
      {
        subtitle: 'Return Shipping',
        text: 'For defective or wrong items, return shipping is borne by Arkee. For change-of-mind returns, the customer bears the return shipping cost (₹99 deducted from refund).',
      },
    ],
  },
  {
    id: 'refunds',
    icon: CreditCardIcon,
    title: 'Refund Policy',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    content: [
      {
        subtitle: 'Refund Timeline',
        text: 'Approved refunds are processed within 5–7 business days after we receive and inspect the returned item.',
      },
      {
        subtitle: 'Refund Methods',
        text: 'Refunds are credited back to the original payment method. UPI and card payments are refunded within 5–7 days. Bank transfers may take 7–10 business days.',
      },
      {
        subtitle: 'Store Credit',
        text: 'You may choose to receive your refund as Arkee store credit, which is available instantly and can be used on your next purchase.',
      },
      {
        subtitle: 'Partial Refunds',
        text: 'In cases where items show signs of use or missing accessories, a partial refund may be issued at our discretion.',
      },
      {
        subtitle: 'Cancellation Refunds',
        text: 'Orders cancelled before dispatch receive a full refund. Orders cancelled after dispatch will be processed once the item is returned.',
      },
    ],
  },
  {
    id: 'quality',
    icon: ShieldCheckIcon,
    title: 'Quality Assurance',
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    content: [
      {
        subtitle: 'Handcrafted with Care',
        text: 'Every Arkee piece is handcrafted by skilled artisans and undergoes a thorough quality check before dispatch.',
      },
      {
        subtitle: 'Hallmarking',
        text: 'All gold and silver jewellery comes with proper BIS hallmarking as per Government of India standards, ensuring purity and quality.',
      },
      {
        subtitle: 'Defective Items',
        text: 'In the rare case that you receive a defective item, please contact us within 48 hours with photos. We will arrange an immediate replacement or full refund.',
      },
      {
        subtitle: 'Colour Disclaimer',
        text: 'Due to variations in screen settings, actual product colour may slightly differ from images. This does not qualify as a defect.',
      },
    ],
  },
];

const ShippingPolicy = () => {
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('shipping');

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await miscService.getShippingReturnPolicy();
        setPolicyData(res?.data || null);
      } catch {
        // use static content
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-950 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-gold-500" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <TruckIcon className="w-7 h-7 text-rose-300" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Shipping &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-gold-300">
              Returns
            </span>
          </h1>
          <p className="text-white/70 text-sm max-w-lg mx-auto leading-relaxed">
            Everything you need to know about delivery, returns, refunds and
            our quality promise.
          </p>
          <p className="text-white/40 text-xs mt-3">
            Last updated: June 2025
          </p>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs text-gray-600">
            {[
              { icon: '🚚', text: 'Free shipping on ₹999+' },
              { icon: '⏱️', text: '3-5 day delivery' },
              { icon: '🔄', text: '7-day easy returns' },
              { icon: '💰', text: 'Refund in 5-7 days' },
              { icon: '🔒', text: '100% secure payments' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span>{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                Quick Navigation
              </p>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        document
                          .getElementById(section.id)
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                        activeSection === section.id
                          ? `${section.bgColor} ${section.color}`
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>

              {/* Contact Support */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-3">
                  Need Help?
                </p>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 text-rose-500 text-xs font-medium hover:text-rose-600 transition-colors"
                >
                  <QuestionMarkCircleIcon className="w-4 h-4" />
                  Contact Support
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-24"
                >
                  {/* Section Header */}
                  <div
                    className={`flex items-center gap-4 p-6 border-b border-gray-100 ${section.bgColor}`}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm`}
                    >
                      <Icon className={`w-5 h-5 ${section.color}`} />
                    </div>
                    <h2
                      className={`font-serif text-xl font-bold text-gray-800`}
                    >
                      {section.title}
                    </h2>
                  </div>

                  {/* Section Content */}
                  <div className="p-6 space-y-5">
                    {section.content.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 pb-5 border-b border-gray-50 last:border-0 last:pb-0"
                      >
                        <div
                          className={`w-7 h-7 rounded-full ${section.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${section.color}`}
                        >
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1.5">
                            {item.subtitle}
                          </h4>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Delivery Timeframes Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-gold-50">
                <ClockIcon className="w-5 h-5 text-gold-600" />
                <h2 className="font-serif text-xl font-bold text-gray-800">
                  Delivery Timeframes
                </h2>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 rounded-xl">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 rounded-l-xl">
                        Delivery Type
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                        Timeframe
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                        Charge
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 rounded-r-xl">
                        Availability
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      {
                        type: 'Standard Shipping',
                        time: '3–5 Business Days',
                        charge: 'FREE on ₹999+ / ₹99 below',
                        availability: 'Pan India',
                        highlight: false,
                      },
                      {
                        type: 'Express Delivery',
                        time: '1–2 Business Days',
                        charge: '₹149',
                        availability: 'Select Pincodes',
                        highlight: false,
                      },
                      {
                        type: 'Same Day Delivery',
                        time: 'Same Day',
                        charge: '₹299',
                        availability: 'Jaipur Only',
                        highlight: false,
                      },
                      {
                        type: 'Custom / Personalised Orders',
                        time: '7–14 Business Days',
                        charge: 'FREE on ₹999+',
                        availability: 'Pan India',
                        highlight: true,
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className={`${
                          row.highlight ? 'bg-rose-50/50' : 'hover:bg-gray-50'
                        } transition-colors`}
                      >
                        <td className="px-4 py-3.5 font-medium text-gray-800">
                          {row.type}
                        </td>
                        <td className="px-4 py-3.5 text-gray-600">
                          {row.time}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`font-semibold ${
                              row.charge.includes('FREE')
                                ? 'text-green-600'
                                : 'text-gray-800'
                            }`}
                          >
                            {row.charge}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500">
                          {row.availability}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contact Banner */}
            <div className="bg-gradient-to-br from-rose-500 to-blush-600 rounded-3xl p-8 text-white text-center">
              <QuestionMarkCircleIcon className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <h3 className="font-serif text-xl font-bold mb-2">
                Still have questions?
              </h3>
              <p className="text-white/80 text-sm mb-5 max-w-sm mx-auto">
                Our friendly customer support team is ready to help you with
                any questions about shipping or returns.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/contact"
                  className="bg-white text-rose-500 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-rose-50 transition-colors"
                >
                  Contact Us
                </Link>
                <a
                  href="https://wa.me/917734984892"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-white/30 transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;