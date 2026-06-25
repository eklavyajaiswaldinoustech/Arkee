// src/components/home/NewLaunchSection.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { productService } from '../../api/services/productService';
import ProductCard from '../ui/ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';

const NewLaunchSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewLaunches = async () => {
      setLoading(true);
      try {
        const res = await productService.getNewLaunchProducts();
        const allProducts = Array.isArray(res?.data) ? res.data : [];
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching new launches:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewLaunches();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SparklesIcon className="w-5 h-5 text-amber-500" />
              <span className="text-amber-500 font-medium text-sm uppercase tracking-widest">
                New Launches
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800">
              Latest{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-blush-500">
                Arrivals
              </span>
            </h2>
          </div>
          <Link
            to="/products?filter=newLaunch"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors group"
          >
            View All
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
                badge={
                  product.newLaunchExpiresAt && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                      New
                    </div>
                  )
                }
              />
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/products?filter=newLaunch"
            className="inline-flex items-center gap-2 btn-primary text-sm"
          >
            View All New Launches
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewLaunchSection;
