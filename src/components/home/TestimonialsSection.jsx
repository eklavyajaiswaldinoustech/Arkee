import React from 'react';

const reviews = [
  { name: 'Priya Sharma', location: 'Mumbai', rating: 5, comment: 'Absolutely love my Arkee earrings! The quality is outstanding and I got so many compliments.', avatar: 'P', product: 'Oxidised Jhumkas' },
  { name: 'Ananya Verma', location: 'Delhi', rating: 5, comment: 'Fast delivery, beautiful packaging, and the necklace is even more stunning in person!', avatar: 'A', product: 'Gold Layered Necklace' },
  { name: 'Kavitha Nair', location: 'Bangalore', rating: 5, comment: 'I ordered the bangle set and it\'s perfect. Great craftsmanship and very affordable.', avatar: 'K', product: 'Silver Bangle Set' },
  { name: 'Meera Patel', location: 'Ahmedabad', rating: 5, comment: 'The customer service is exceptional! Beautiful piece and exactly as described.', avatar: 'M', product: 'Rose Gold Ring' },
];

const avatarColors = [
  'from-rose-400 to-pink-500',
  'from-pink-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-green-400 to-teal-500',
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-rose-400 font-medium text-sm uppercase tracking-widest">Happy Customers</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            What Women <span className="text-rose-500">Say About Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-rose-50 rounded-2xl p-6 border border-rose-100 hover:shadow-lg transition-all duration-300">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{review.comment}"</p>
              {review.product && (
                <span className="inline-block bg-white text-rose-500 text-xs px-3 py-1 rounded-full border border-rose-100 mb-4">
                  {review.product}
                </span>
              )}
              <div className="flex items-center gap-3 pt-3 border-t border-rose-100">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.location} · Verified Buyer ✓</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;