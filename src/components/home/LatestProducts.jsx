import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { productService } from '../../api/services/productService';
import ProductCard from '../ui/ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await productService.getLatestProducts();
        const list = res?.data?.products || res?.products || res?.data || [];
        setProducts(list);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-rose-400 font-medium text-sm uppercase tracking-widest">Fresh Drops</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Latest <span className="text-rose-500">Arrivals</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="p-2.5 rounded-full bg-white border border-gray-200 hover:border-rose-300 hover:text-rose-500 transition-all shadow-sm">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')} className="p-2.5 rounded-full bg-white border border-gray-200 hover:border-rose-300 hover:text-rose-500 transition-all shadow-sm">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-56 sm:w-64"><ProductCardSkeleton /></div>
              ))
            : products.map((product) => (
                <div key={product._id} className="flex-shrink-0 w-56 sm:w-64">
                  <ProductCard product={product} />
                </div>
              ))
          }
        </div>

        <div className="text-center mt-8">
          <Link to="/products?filter=newLaunch" className="btn-primary">View All New Arrivals</Link>
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
