import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-cream-50 to-blush-50 flex items-center justify-center px-6 animate-fade-in">
      <div className="text-center max-w-lg">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="text-[120px] md:text-[160px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-rose-200 to-blush-300 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center">
              <span className="text-5xl">💎</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-3">
          Oops! Page not found
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          The page you're looking for seems to have wandered off like a lost
          earring. Let's get you back on track!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary justify-center py-3 px-6"
          >
            ← Go Back
          </button>
          <Link to="/" className="btn-primary justify-center py-3 px-6">
            Back to Home
          </Link>
          <Link
            to="/products"
            className="btn-gold justify-center py-3 px-6"
          >
            Shop Now ✨
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-10 pt-8 border-t border-rose-100">
          <p className="text-xs text-gray-400 mb-4">
            Popular pages you might be looking for:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Earrings', path: '/products?category=earrings' },
              { label: 'Necklaces', path: '/products?category=necklaces' },
              { label: 'New Arrivals', path: '/products?type=new' },
              { label: 'Offers', path: '/offers' },
              { label: 'Contact', path: '/contact' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-xs text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full border border-rose-100 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;