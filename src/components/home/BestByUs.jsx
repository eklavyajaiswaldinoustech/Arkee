import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../api/services/productService';
import ProductCard from '../ui/ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';

const BestByUs = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBest = async () => {
      try {
        const res = await productService.getBestByUs();
        const list = res?.data?.products || res?.products || res?.data || [];
        setProducts(list.slice(0, 4));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBest();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-rose-400 font-medium text-sm uppercase tracking-widest">Editor's Pick</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            Best <span className="text-rose-500">By Us</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
            Handpicked favourites loved by thousands of women
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Promo Banner */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden min-h-64">
            <img
              src="https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&auto=format&fit=crop"
              alt="Best by Arkee"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h3 className="text-white font-serif text-3xl font-bold mb-3">
                Crafted with <br /><span className="text-amber-300">passion</span>
              </h3>
              <Link
                to="/products?filter=bestSeller"
                className="inline-flex items-center gap-2 bg-white text-rose-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-50 transition-colors w-fit"
              >
                Explore All →
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product) => <ProductCard key={product._id} product={product} />)
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestByUs;
