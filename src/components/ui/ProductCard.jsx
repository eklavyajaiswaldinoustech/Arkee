// src/components/ui/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingBagIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import useWishlist from '../../hooks/useWishlist';
import useCart from '../../hooks/useCart';
import useCartStore from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';

const getProductId = (item) =>
  item?.productId?._id ||
  item?.productId ||
  item?.productid?._id ||
  item?.productid ||
  item?._id ||
  null;

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingCart, setIsAddingCart] = useState(false);

  const { addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);

  // Removed: useAuth() - not defined, and user variable was never used in JSX

  if (!product) return null;

  const {
    _id,
    name,
    price,
    discountPrice,
    images = [],
    category,
    rating,
    totalReviews,
  } = product;
  const productInCart = cartItems.find(
    (item) => getProductId(item)?.toString() === _id?.toString()
  );

  const discount =
    price && discountPrice
      ? Math.round(((price - discountPrice) / price) * 100)
      : null;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (isWishlisted) {
      await removeFromWishlist(_id);
    } else {
      await addToWishlist(_id);
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (productInCart) {
      navigate(`/cart?highlight=${encodeURIComponent(_id)}`);
      return;
    }
    setIsAddingCart(true);
    await addToCart(_id, 1);
    setIsAddingCart(false);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Image Container */}
      <Link to={`/product/${_id}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-cream-100 relative">
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer rounded-t-2xl" />
          )}
          <img
            src={images[0] || 'https://placehold.co/400x400/fce7f3/be185d?text=Arkee'}
            alt={name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Link
              to={`/product/${_id}`}
              className="bg-white text-gray-700 p-2.5 rounded-full shadow-lg hover:bg-rose-50 hover:text-rose-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <EyeIcon className="w-4 h-4" />
            </Link>
          <button
            onClick={handleAddToCart}
            disabled={isAddingCart}
            className="bg-rose-500 text-white p-2.5 rounded-full shadow-lg hover:bg-rose-600 transition-colors disabled:opacity-70"
            title={productInCart ? 'View in cart' : 'Add to cart'}
          >
            <ShoppingBagIcon className="w-4 h-4" />
          </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && discount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-gold-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                NEW
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
          >
            {isWishlisted ? (
              <HeartSolid className="w-4 h-4 text-rose-500" />
            ) : (
              <HeartIcon className="w-4 h-4 text-gray-400 hover:text-rose-500 transition-colors" />
            )}
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {category && (
          <p className="text-xs text-rose-400 font-medium uppercase tracking-wider mb-1">
            {category}
          </p>
        )}
        <Link to={`/product/${_id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-rose-500 transition-colors leading-snug">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(rating)
                      ? 'text-gold-400 fill-gold-400'
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">({totalReviews || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-gray-900">
            ₹{(discountPrice || price || 0).toLocaleString()}
          </span>
          {discount && discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ₹{(price || 0).toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingCart}
          className="w-full mt-3 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-200 hover:border-rose-500 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <ShoppingBagIcon className="w-4 h-4" />
          {isAddingCart
            ? 'Adding...'
            : productInCart
            ? 'View in Cart'
            : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
