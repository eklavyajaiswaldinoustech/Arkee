// src/components/ui/Skeleton.jsx
import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-4/5" />
      <div className="h-3 bg-gray-200 rounded w-2/5" />
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-10 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

export const BannerSkeleton = () => (
  <div className="w-full h-64 md:h-96 bg-gray-200 rounded-2xl animate-pulse" />
);

export const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-gray-200 rounded ${
          i === lines - 1 ? 'w-3/5' : 'w-full'
        }`}
      />
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-gray-200" />
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-12 bg-gray-200 rounded-xl" />
    ))}
  </div>
);

// Add default export
export default {
  ProductCardSkeleton,
  BannerSkeleton,
  TextSkeleton,
  ProfileSkeleton,
};