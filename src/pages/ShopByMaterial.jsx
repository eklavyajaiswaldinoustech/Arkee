import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../api/services/productService';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const materials = ['silver', 'gold', 'oxidised', 'rose gold', 'copper'];

const ShopByMaterial = () => {
  const { material } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMaterial, setActiveMaterial] = useState(material || materials[0]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductsByMaterial(activeMaterial);
        setProducts(res?.data?.products || res?.products || res?.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeMaterial]);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold-400 font-medium text-sm uppercase tracking-widest">
            Explore by Material
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-3 capitalize">
            {activeMaterial}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-rose-300">
              Jewellery
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-8 pb-2">
          {materials.map((mat) => (
            <button
              key={mat}
              onClick={() => setActiveMaterial(mat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all capitalize ${
                activeMaterial === mat
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title={`No ${activeMaterial} products found`}
            description="Check back soon — we're always adding new pieces!"
            actionLabel="Browse All Products"
            actionPath="/products"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopByMaterial;