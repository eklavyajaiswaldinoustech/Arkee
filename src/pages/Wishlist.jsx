import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
  ShareIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { wishlistService } from '../api/services/wishlistService';
import useWishlistStore from '../store/wishlistStore';
import useCart from '../hooks/useCart';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const WishlistCard = ({ item, onRemove, onMoveToCart, isMoving }) => {
  const product = item.productId || item.product || item;
  const productId = product?._id || item.productId;
  const name = product?.name || 'Product';
  const image =
    product?.images?.[0] ||
    'https://placehold.co/300x300/fce7f3/be185d?text=Arkee';
  const price = product?.discountPrice || product?.price || 0;
  const originalPrice = product?.price || 0;
  const discount =
    originalPrice && price < originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const handleShare = () => {
    const url = `${window.location.origin}/product/${productId}`;
    if (navigator.share) {
      navigator.share({ title: name, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Product link copied!');
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-50">
        <Link to={`/product/${productId}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              -{discount}%
            </span>
          )}
          {product?.isNew && (
            <span className="bg-gold-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              NEW
            </span>
          )}
        </div>

        {/* Action Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all"
            title="Share"
          >
            <ShareIcon className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {/* Remove from Wishlist */}
          <button
            onClick={() => onRemove(productId, name)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-rose-50 hover:scale-110 transition-all"
            title="Remove from wishlist"
          >
            <HeartSolid className="w-3.5 h-3.5 text-rose-500" />
          </button>
        </div>

        {/* Out of Stock overlay */}
        {product?.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {product?.category && (
          <p className="text-xs text-rose-400 font-medium uppercase tracking-wider mb-1">
            {product.category}
          </p>
        )}

        <Link to={`/product/${productId}`}>
          <h3 className="text-sm font-semibold text-gray-800 hover:text-rose-500 transition-colors line-clamp-2 mb-2 leading-snug">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {product?.rating && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(product.rating)
                    ? 'text-gold-400 fill-gold-400'
                    : 'text-gray-200 fill-gray-200'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-400 ml-0.5">
              ({product.totalReviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">
            ₹{price.toLocaleString()}
          </span>
          {discount && (
            <span className="text-xs text-gray-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Move to Cart */}
        <button
          onClick={() => onMoveToCart(productId, name)}
          disabled={isMoving || product?.stock === 0}
          className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-200 hover:border-rose-500 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMoving ? (
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
          ) : (
            <ShoppingBagIcon className="w-4 h-4" />
          )}
          {product?.stock === 0
            ? 'Out of Stock'
            : isMoving
            ? 'Adding...'
            : 'Move to Cart'}
        </button>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [filterBy, setFilterBy] = useState('all');
  const { setWishlist } = useWishlistStore();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await wishlistService.viewWishlist();
      const items = res?.data?.items || res?.items || res?.data || [];
      setWishlistData(items);
      setWishlist(items);
    } catch {
      setWishlistData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId, name) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlistData((prev) =>
        prev.filter(
          (item) =>
            (item.productId?._id || item.productId) !== productId
        )
      );
      setWishlist(
        wishlistData.filter(
          (item) =>
            (item.productId?._id || item.productId) !== productId
        )
      );
      toast.success(`${name} removed from wishlist`);
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (productId, name) => {
    setMovingId(productId);
    try {
      const success = await addToCart(productId, 1);
      if (success) {
        await wishlistService.removeFromWishlist(productId);
        setWishlistData((prev) =>
          prev.filter(
            (item) =>
              (item.productId?._id || item.productId) !== productId
          )
        );
        toast.success(`${name} moved to cart! 🛒`);
      }
    } catch {
      toast.error('Failed to move to cart');
    } finally {
      setMovingId(null);
    }
  };

  const handleMoveAllToCart = async () => {
    const inStockItems = wishlistData.filter(
      (item) => (item.productId || item)?.stock !== 0
    );
    if (inStockItems.length === 0) {
      toast.error('No in-stock items to move');
      return;
    }
    let successCount = 0;
    for (const item of inStockItems) {
      const productId = item.productId?._id || item.productId;
      try {
        await addToCart(productId, 1);
        await wishlistService.removeFromWishlist(productId);
        successCount++;
      } catch {}
    }
    if (successCount > 0) {
      toast.success(
        `${successCount} item${successCount > 1 ? 's' : ''} moved to cart! 🛒`
      );
      fetchWishlist();
    }
  };

  // Sort & Filter
  const getSortedFiltered = () => {
    let items = [...wishlistData];

    // Filter
    if (filterBy === 'instock') {
      items = items.filter(
        (item) => (item.productId || item)?.stock !== 0
      );
    } else if (filterBy === 'discounted') {
      items = items.filter((item) => {
        const p = item.productId || item;
        return p?.discountPrice && p.discountPrice < p.price;
      });
    }

    // Sort
    if (sortBy === 'price_asc') {
      items.sort((a, b) => {
        const pa = a.productId?.discountPrice || a.productId?.price || 0;
        const pb = b.productId?.discountPrice || b.productId?.price || 0;
        return pa - pb;
      });
    } else if (sortBy === 'price_desc') {
      items.sort((a, b) => {
        const pa = a.productId?.discountPrice || a.productId?.price || 0;
        const pb = b.productId?.discountPrice || b.productId?.price || 0;
        return pb - pa;
      });
    } else if (sortBy === 'name') {
      items.sort((a, b) =>
        (a.productId?.name || '').localeCompare(b.productId?.name || '')
      );
    }

    return items;
  };

  const displayItems = getSortedFiltered();

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-10 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty Wishlist
  if (!loading && wishlistData.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <EmptyState
          icon={<HeartIcon className="w-12 h-12 text-rose-300" />}
          title="Your wishlist is empty"
          description="Save your favourite pieces here! Tap the heart icon on any product to add it to your wishlist."
          actionLabel="Explore Products"
          actionPath="/products"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-800 flex items-center gap-3">
              <HeartSolid className="w-8 h-8 text-rose-500" />
              My Wishlist
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {wishlistData.length} saved item
              {wishlistData.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Move All to Cart */}
          {wishlistData.length > 0 && (
            <button
              onClick={handleMoveAllToCart}
              className="btn-primary text-sm py-2.5 px-5"
            >
              <ShoppingBagIcon className="w-4 h-4" />
              Move All to Cart
            </button>
          )}
        </div>

        {/* Sort & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <AdjustmentsHorizontalIcon className="w-4 h-4 text-rose-400" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All' },
              { value: 'instock', label: 'In Stock' },
              { value: 'discounted', label: 'On Sale' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterBy(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filterBy === f.value
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white text-gray-700 cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* No results after filter */}
        {displayItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <HeartIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No items match your filter.</p>
            <button
              onClick={() => setFilterBy('all')}
              className="text-rose-500 text-sm font-medium mt-2 hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {displayItems.map((item, i) => (
                <WishlistCard
                  key={
                    item.productId?._id || item.productId || i
                  }
                  item={item}
                  onRemove={handleRemove}
                  onMoveToCart={handleMoveToCart}
                  isMoving={
                    movingId ===
                    (item.productId?._id || item.productId)
                  }
                />
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Total wishlist value:{' '}
                  <span className="text-rose-500 text-lg">
                    ₹
                    {wishlistData
                      .reduce((sum, item) => {
                        const p = item.productId || item;
                        return (
                          sum +
                          (p?.discountPrice || p?.price || 0)
                        );
                      }, 0)
                      .toLocaleString()}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Based on current prices
                </p>
              </div>

              <div className="flex gap-3">
                <Link to="/products" className="btn-secondary text-sm py-2.5">
                  Continue Shopping
                </Link>
                <button
                  onClick={handleMoveAllToCart}
                  className="btn-primary text-sm py-2.5"
                >
                  <ShoppingBagIcon className="w-4 h-4" />
                  Add All to Cart
                </button>
              </div>
            </div>

            {/* Share Wishlist */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Wishlist link copied! Share with friends 💌');
                }}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500 transition-colors"
              >
                <ShareIcon className="w-4 h-4" />
                Share my wishlist with friends
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;