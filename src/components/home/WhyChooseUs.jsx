import React from 'react';

const features = [
  { icon: '✋', title: 'Handcrafted', description: 'Every piece is lovingly handmade by skilled artisans with years of experience.', color: 'bg-rose-50 border-rose-100', iconBg: 'bg-rose-100' },
  { icon: '🌿', title: 'Ethically Sourced', description: 'We use only responsibly sourced materials for our jewellery collections.', color: 'bg-green-50 border-green-100', iconBg: 'bg-green-100' },
  { icon: '🚚', title: 'Free Shipping', description: 'Enjoy free delivery on all orders above ₹999 across India.', color: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100' },
  { icon: '🔄', title: 'Easy Returns', description: '7-day hassle-free return policy. Not satisfied? We\'ll make it right.', color: 'bg-amber-50 border-amber-100', iconBg: 'bg-amber-100' },
  { icon: '🔒', title: 'Secure Payment', description: '100% secure checkout with multiple trusted payment options.', color: 'bg-purple-50 border-purple-100', iconBg: 'bg-purple-100' },
  { icon: '💬', title: '24/7 Support', description: 'Our friendly team is always here to help you with any queries.', color: 'bg-pink-50 border-pink-100', iconBg: 'bg-pink-100' },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-rose-400 font-medium text-sm uppercase tracking-widest">Our Promise</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            Why Choose <span className="text-rose-500">Arkee?</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            We believe every woman deserves jewellery that's as unique and beautiful as she is.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className={`${feature.color} border rounded-2xl p-6 flex gap-4 items-start hover:shadow-md transition-all duration-300 group`}>
              <div className={`${feature.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;