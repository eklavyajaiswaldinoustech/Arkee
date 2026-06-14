import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../api/services/categoryService';

const fallbackCategories = [
  { _id: '1', name: 'Earrings', emoji: '✨', color: 'from-rose-100 to-pink-200', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop' },
  { _id: '2', name: 'Necklaces', emoji: '💎', color: 'from-amber-100 to-yellow-200', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&auto=format&fit=crop' },
  { _id: '3', name: 'Bangles', emoji: '🌸', color: 'from-pink-100 to-purple-200', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&auto=format&fit=crop' },
  { _id: '4', name: 'Rings', emoji: '💍', color: 'from-blue-100 to-indigo-200', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&auto=format&fit=crop' },
  { _id: '5', name: 'Anklets', emoji: '🦋', color: 'from-green-100 to-teal-200', image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=300&auto=format&fit=crop' },
  { _id: '6', name: 'Maang Tikka', emoji: '🌺', color: 'from-orange-100 to-rose-200', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=300&auto=format&fit=crop' },
];

const CategorySection = () => {
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        const cats = res?.data || res?.categories || [];
        if (cats.length > 0) {
          setCategories(cats.map((cat, i) => ({
            ...cat,
            emoji: fallbackCategories[i % fallbackCategories.length]?.emoji || '💎',
            color: fallbackCategories[i % fallbackCategories.length]?.color || 'from-rose-100 to-pink-200',
          })));
        }
      } catch {
        // use fallback
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-rose-400 font-medium text-sm uppercase tracking-widest">Browse By</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            Shop by <span className="text-rose-500">Category</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat, i) => (
              <Link
                key={cat._id || i}
                to={`/products?category=${cat.name?.toLowerCase()}`}
                className="group flex flex-col items-center"
              >
                <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${cat.color} overflow-hidden relative shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1`}>
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl drop-shadow-md">{cat.emoji}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-700 group-hover:text-rose-500 transition-colors text-center">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/products" className="btn-secondary text-sm">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;