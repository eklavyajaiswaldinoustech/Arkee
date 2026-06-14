import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-gold-400 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xl">A</span>
              </div>
              <div>
                <span className="text-2xl font-display font-bold text-white tracking-wider">
                  Ark<span className="text-rose-400">ee</span>
                </span>
                <p className="text-xs text-gray-500 tracking-widest -mt-1">
                  FINE JEWELLERY
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Crafting timeless pieces that celebrate every woman's unique
              elegance. From traditional to contemporary, discover jewellery
              that tells your story.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {['facebook', 'instagram', 'pinterest', 'twitter'].map((s) => (
                <a
                  key={s}
                  href={`https://${s}.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-rose-500 flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-xs capitalize text-white font-bold">
                    {s.charAt(0).toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-rose-400 -bottom-2"></span>
            </h4>
            <ul className="space-y-3 mt-4">
              {[
                { label: 'Home', path: '/' },
                { label: 'Shop All', path: '/products' },
                { label: 'New Arrivals', path: '/products?type=new' },
                { label: 'Best Sellers', path: '/products?type=best' },
                { label: 'Offers & Deals', path: '/offers' },
                { label: 'Blogs', path: '/blogs' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-rose-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 relative">
              Customer Care
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-rose-400 -bottom-2"></span>
            </h4>
            <ul className="space-y-3 mt-4">
              {[
                { label: 'My Account', path: '/profile' },
                { label: 'My Orders', path: '/my-orders' },
                { label: 'Shipping Policy', path: '/shipping-policy' },
                { label: 'Return Policy', path: '/shipping-policy' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-rose-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 relative">
              Get In Touch
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-rose-400 -bottom-2"></span>
            </h4>
            <ul className="space-y-4 mt-4">
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  Jaipur, Rajasthan, India 302001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a
                  href="tel:+917734984892"
                  className="text-sm text-gray-400 hover:text-rose-400 transition-colors"
                >
                  +91 77349 84892
                </a>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a
                  href="mailto:hello@arkee.in"
                  className="text-sm text-gray-400 hover:text-rose-400 transition-colors"
                >
                  hello@arkee.in
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">
                Subscribe for exclusive offers:
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                />
                <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            © 2025 Arkee Fine Jewellery. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with{' '}
            <HeartIcon className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />{' '}
            for women who shine
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;