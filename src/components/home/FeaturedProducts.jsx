// src/components/home/FeaturedProducts.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, FireIcon } from '@heroicons/react/24/outline';
import { productService } from '../../api/services/productService';
import ProductCard from '../ui/ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await productService.getBestByUs();
        setProducts(res?.data?.products || res?.products || res?.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FireIcon className="w-5 h-5 text-rose-500" />
              <span className="text-rose-500 font-medium text-sm uppercase tracking-widest">
                Best Sellers
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800">
              Featured{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-blush-500">
                Products
              </span>
            </h2>
          </div>
          <Link
            to="/products"
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
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 btn-primary text-sm"
          >
            View All Products
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;