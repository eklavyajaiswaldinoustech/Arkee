import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../api/services/productService';

const fallbackMaterials = [
  { name: 'Silver', description: 'Pure & elegant', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop', gradient: 'from-gray-600/60 to-gray-900/60' },
  { name: 'Gold', description: 'Timeless luxury', image: 'https://images.unsplash.com/photo-1601821765780-754fa98637be?w=500&auto=format&fit=crop', gradient: 'from-amber-600/60 to-amber-900/60' },
  { name: 'Oxidised', description: 'Bohemian spirit', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop', gradient: 'from-gray-800/60 to-gray-950/60' },
  { name: 'Rose Gold', description: 'Romantic & chic', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop', gradient: 'from-rose-600/60 to-rose-900/60' },
];

const MaterialSection = () => {
  const [materials, setMaterials] = useState(fallbackMaterials);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await productService.getMaterialList();
        const list = res?.data || res?.materials || [];
        if (list.length > 0) {
          setMaterials(list.map((m, i) => ({
            name: typeof m === 'string' ? m : m.name,
            description: m.description || 'Explore collection',
            image: m.image || fallbackMaterials[i % fallbackMaterials.length]?.image,
            gradient: fallbackMaterials[i % fallbackMaterials.length]?.gradient,
          })));
        }
      } catch {
        // use fallback
      }
    };
    fetchMaterials();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-amber-400 font-medium text-sm uppercase tracking-widest">Explore</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-2">
            Shop by <span className="text-rose-300">Material</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {materials.map((mat, i) => (
            <Link
              key={i}
              to={`/shop-by-material/${mat.name?.toLowerCase()}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              <img
                src={mat.image}
                alt={mat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${mat.gradient}`} />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="text-white/70 text-xs font-medium mb-1">{mat.description}</p>
                <h3 className="text-white text-xl font-serif font-bold">{mat.name}</h3>
                <span className="mt-2 text-white/80 text-xs group-hover:text-white">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaterialSection;