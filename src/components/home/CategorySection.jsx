import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../api/services/categoryService';

const fallbackCategories = [
  {
    _id: 'silver',
    name: 'Silver',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop',
    emoji: '🩶',
    color: 'from-slate-100 to-slate-300',
  },
  {
    _id: 'gold',
    name: 'Gold',
    image: 'https://images.unsplash.com/photo-1601821765780-754fa98637be?w=500&auto=format&fit=crop',
    emoji: '✨',
    color: 'from-amber-100 to-amber-300',
  },
  {
    _id: 'oxidised',
    name: 'Oxidised',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop',
    emoji: '🖤',
    color: 'from-gray-200 to-gray-400',
  },
  {
    _id: 'rose-gold',
    name: 'Rose Gold',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop',
    emoji: '🌹',
    color: 'from-rose-100 to-pink-200',
  },
];

const normalizeCategory = (category, index) => ({
  ...category,
  name: category?.name || category?.type || `Category ${index + 1}`,
  image: category?.image || fallbackCategories[index % fallbackCategories.length]?.image,
  emoji: fallbackCategories[index % fallbackCategories.length]?.emoji || '💎',
  color: fallbackCategories[index % fallbackCategories.length]?.color || 'from-rose-100 to-pink-200',
});

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        const cats = res?.data || res?.categories || [];
        if (cats.length > 0) {
          setCategories(cats.map(normalizeCategory));
        } else {
          setCategories(fallbackCategories);
        }
      } catch {
        setCategories(fallbackCategories);
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
                to={`/products?category=${encodeURIComponent((cat.name || '').toLowerCase())}`}
                className="group flex flex-col items-center"
              >
                <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${cat.color} overflow-hidden relative shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1`}>
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl drop-shadow-md">{cat.emoji}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-700 group-hover:text-rose-500 transition-colors text-center">
                  {cat.name || cat.type}
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
