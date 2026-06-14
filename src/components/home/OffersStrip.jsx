import React from 'react';
import { Link } from 'react-router-dom';

const offers = [
  '🎁 Use code ARKEE10 — Get 10% off on your first order',
  '🚚 Free shipping on all orders above ₹999',
  '💎 New arrivals every Friday — Stay Stylish',
  '🌸 Handcrafted jewellery · Made with love in India',
];

const OffersStrip = () => {
  return (
    <div className="bg-rose-50 border-y border-rose-100 py-3 overflow-hidden">
      <div className="flex gap-16 overflow-x-auto scrollbar-hide px-6">
        {[...offers, ...offers].map((offer, i) => (
          <Link
            key={i}
            to="/offers"
            className="flex-shrink-0 text-sm text-rose-600 font-medium hover:text-rose-700 transition-colors whitespace-nowrap"
          >
            {offer}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OffersStrip;