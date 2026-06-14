import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  ShoppingBagIcon,
  ShareIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolid,
  StarIcon as StarSolid,
} from '@heroicons/react/24/solid';
import { productService } from '../api/services/productService';
import { reviewService } from '../api/services/reviewService';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import AddReviewModal from '../components/product/AddReviewModal';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductDetails(id);
        const data = res?.data || res?.product || res;
        setProduct(data);
        setSelectedImage(0);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (!id) return;
    const fetchRelated = async () => {
      try {
        const res = await productService.getRelatedProducts(id);
        setRelatedProducts(
          res?.data?.products || res?.products || res?.data || []
        );
      } catch {
        setRelatedProducts([]);
      }
    };
    fetchRelated();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await reviewService.getProductReviews(id);
        setReviews(res?.data?.reviews || res?.reviews || res?.data || []);
      } catch {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const handleAddToCart = async () => {
    setIsAddingCart(true);
    await addToCart(product._id, quantity);
    setIsAddingCart(false);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    setIsBuyingNow(true);
    const success = await addToCart(product._id, quantity);
    setIsBuyingNow(false);
    if (success) navigate('/cart');
  };

  const handleWishlist = async () => {
    if (isWishlisted) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const prevImage = () =>
    setSelectedImage((prev) =>
      prev === 0 ? (product?.images?.length || 1) - 1 : prev - 1
    );

  const nextImage = () =>
    setSelectedImage((prev) =>
      prev === (product?.images?.length || 1) - 1 ? 0 : prev + 1
    );

  const discount =
    product?.price && product?.discountPrice
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : null;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : product?.rating || 0;

  // Loading Skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-3xl" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-32 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images =
    product.images?.length > 0
      ? product.images
      : ['https://placehold.co/600x600/fce7f3/be185d?text=Arkee'];

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link to="/" className="hover:text-rose-500 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-rose-500 transition-colors"
          >
            Products
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                to={`/products?category=${product.category?.toLowerCase()}`}
                className="hover:text-rose-500 transition-colors capitalize"
              >
                {product.category}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">
            {product.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* ─── LEFT: Image Gallery ─── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-3xl overflow-hidden aspect-square shadow-sm border border-gray-100 group">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  imageZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setImageZoomed(!imageZoomed)}
              />

              {/* Nav Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRightIcon className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount && discount > 0 && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    -{discount}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-gold-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    NEW
                  </span>
                )}
              </div>

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleWishlist}
                  className="bg-white p-2.5 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  {isWishlisted ? (
                    <HeartSolid className="w-5 h-5 text-rose-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="bg-white p-2.5 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <ShareIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? 'border-rose-400 shadow-md scale-105'
                        : 'border-transparent hover:border-rose-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── RIGHT: Product Info ─── */}
          <div className="flex flex-col gap-6">
            {/* Category & Title */}
            <div>
              {product.category && (
                <Link
                  to={`/products?category=${product.category?.toLowerCase()}`}
                  className="text-rose-400 text-sm font-medium uppercase tracking-widest hover:text-rose-500 transition-colors"
                >
                  {product.category}
                </Link>
              )}
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-2 leading-tight">
                {product.name}
              </h1>

              {/* Rating Row */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarSolid
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(avgRating)
                          ? 'text-gold-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  ({reviews.length} reviews)
                </span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-rose-500 text-sm hover:underline"
                >
                  Write a review
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 pb-5 border-b border-gray-100">
              <span className="text-4xl font-bold text-gray-900">
                ₹
                {(
                  product.discountPrice || product.price || 0
                ).toLocaleString()}
              </span>
              {discount && discount > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ₹{(product.price || 0).toLocaleString()}
                  </span>
                  <span className="bg-green-50 text-green-600 text-sm font-semibold px-3 py-1 rounded-full border border-green-200">
                    Save ₹
                    {(
                      (product.price || 0) - (product.discountPrice || 0)
                    ).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="px-5 py-2.5 font-semibold text-gray-800 min-w-[3rem] text-center border-x-2 border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2.5 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              {product.stock && (
                <span className="text-xs text-gray-400">
                  {product.stock > 10
                    ? `${product.stock} in stock`
                    : `Only ${product.stock} left!`}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddingCart}
                className="flex-1 btn-secondary justify-center py-3.5 text-base disabled:opacity-70"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {isAddingCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                className="flex-1 btn-primary justify-center py-3.5 text-base disabled:opacity-70 shadow-lg shadow-rose-200"
              >
                {isBuyingNow ? 'Processing...' : 'Buy Now'}
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                isWishlisted
                  ? 'border-rose-400 bg-rose-50 text-rose-500'
                  : 'border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500'
              }`}
            >
              {isWishlisted ? (
                <HeartSolid className="w-4 h-4 text-rose-500" />
              ) : (
                <HeartIcon className="w-4 h-4" />
              )}
              {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Delivery & Returns Info */}
            <div className="bg-gradient-to-br from-rose-50 to-cream-50 rounded-2xl p-5 space-y-3 border border-rose-100">
              {[
                {
                  icon: <TruckIcon className="w-4 h-4 text-rose-500" />,
                  title: 'Free Delivery',
                  desc: 'On orders above ₹999 · 3-5 business days',
                },
                {
                  icon: <ArrowPathIcon className="w-4 h-4 text-rose-500" />,
                  title: 'Easy Returns',
                  desc: '7-day hassle-free return policy',
                },
                {
                  icon: (
                    <ShieldCheckIcon className="w-4 h-4 text-rose-500" />
                  ),
                  title: 'Secure Payment',
                  desc: '100% safe & encrypted checkout',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm flex-shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Material', value: product.material },
                { label: 'Weight', value: product.weight },
                { label: 'SKU', value: product.sku },
                { label: 'Availability', value: product.stock > 0 ? 'In Stock ✓' : 'Out of Stock' },
              ]
                .filter((m) => m.value)
                .map((meta) => (
                  <div key={meta.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-0.5">
                      {meta.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {meta.value}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ─── Tabs Section ─── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-16 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {[
              { key: 'description', label: 'Description' },
              { key: 'details', label: 'Product Details' },
              { key: 'reviews', label: `Reviews (${reviews.length})` },
              { key: 'shipping', label: 'Shipping & Returns' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.key
                    ? 'border-rose-500 text-rose-500 bg-rose-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Description */}
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p className="text-gray-400 italic">
                    No description available for this product.
                  </p>
                )}
              </div>
            )}

            {/* Details */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Product Name', value: product.name },
                  { label: 'Category', value: product.category },
                  { label: 'Subcategory', value: product.subcategory },
                  { label: 'Material', value: product.material },
                  { label: 'Weight', value: product.weight },
                  { label: 'Dimensions', value: product.dimensions },
                  { label: 'Color', value: product.color },
                  { label: 'SKU', value: product.sku },
                ]
                  .filter((d) => d.value)
                  .map((detail) => (
                    <div
                      key={detail.label}
                      className="flex gap-3 py-3 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm text-gray-500 w-32 flex-shrink-0">
                        {detail.label}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {detail.value}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <ReviewsTab
                reviews={reviews}
                reviewsLoading={reviewsLoading}
                avgRating={avgRating}
                productId={id}
                isAuthenticated={isAuthenticated}
                onOpenReviewModal={() => setIsReviewModalOpen(true)}
                onReviewAdded={() => {
                  reviewService
                    .getProductReviews(id)
                    .then((res) =>
                      setReviews(
                        res?.data?.reviews || res?.reviews || []
                      )
                    );
                }}
              />
            )}

            {/* Shipping */}
            {activeTab === 'shipping' && (
              <ShippingTab />
            )}
          </div>
        </div>

        {/* ─── Related Products ─── */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-rose-400 font-medium text-sm uppercase tracking-widest">
                  You May Also Like
                </span>
                <h2 className="section-title mt-1">
                  Related <span className="gradient-text">Products</span>
                </h2>
              </div>
              <Link
                to="/products"
                className="text-rose-500 text-sm font-medium hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={id}
        onSuccess={() => {
          setIsReviewModalOpen(false);
          reviewService
            .getProductReviews(id)
            .then((res) =>
              setReviews(res?.data?.reviews || res?.reviews || [])
            );
        }}
      />
    </div>
  );
};

/* ─── Reviews Tab Sub-Component ─── */
const ReviewsTab = ({
  reviews,
  reviewsLoading,
  avgRating,
  isAuthenticated,
  onOpenReviewModal,
}) => {
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div>
      {/* Rating Overview */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8 p-6 bg-gradient-to-br from-rose-50 to-cream-50 rounded-2xl border border-rose-100">
        {/* Average */}
        <div className="text-center flex-shrink-0">
          <p className="text-6xl font-bold text-gray-800">
            {avgRating.toFixed(1)}
          </p>
          <div className="flex justify-center gap-0.5 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarSolid
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(avgRating)
                    ? 'text-gold-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {reviews.length} reviews
          </p>
        </div>

        {/* Bar Chart */}
        <div className="flex-1 space-y-2">
          {ratingCounts.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-3">{star}</span>
              <StarSolid className="w-3 h-3 text-gold-400 flex-shrink-0" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-400 rounded-full transition-all duration-500"
                  style={{
                    width:
                      reviews.length > 0
                        ? `${(count / reviews.length) * 100}%`
                        : '0%',
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 w-6">{count}</span>
            </div>
          ))}
        </div>

        {/* Write Review CTA */}
        <div className="flex-shrink-0 flex items-center">
          <button
            onClick={onOpenReviewModal}
            className="btn-primary text-sm py-2.5 px-5"
          >
            <StarIcon className="w-4 h-4" />
            Write a Review
          </button>
        </div>
      </div>

      {/* Review List */}
      {reviewsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse p-5 border border-gray-100 rounded-2xl">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/6" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <StarIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          {isAuthenticated && (
            <button
              onClick={onOpenReviewModal}
              className="btn-primary mt-4 text-sm"
            >
              Write First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review, i) => (
            <div
              key={review._id || i}
              className="p-5 border border-gray-100 rounded-2xl hover:border-rose-100 hover:bg-rose-50/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-blush-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {review.userId?.firstname?.charAt(0)?.toUpperCase() ||
                      review.name?.charAt(0)?.toUpperCase() ||
                      'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {`${review.userId?.firstname || review.name || 'Customer'} ${
                        review.userId?.lastname || ''
                      }`.trim()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                        : ''}
                      {' · '}
                      <span className="text-green-500 font-medium">
                        Verified Buyer ✓
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <StarSolid
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s < review.rating ? 'text-gold-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {review.title && (
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {review.title}
                </p>
              )}
              <p className="text-sm text-gray-600 leading-relaxed">
                {review.comment}
              </p>

              {/* Review Images */}
              {review.images?.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Shipping Tab Sub-Component ─── */
const ShippingTab = () => (
  <div className="space-y-6">
    {[
      {
        icon: '🚚',
        title: 'Free Shipping',
        content:
          'Enjoy free standard shipping on all orders above ₹999. Orders below ₹999 have a flat shipping fee of ₹99.',
      },
      {
        icon: '⏱️',
        title: 'Delivery Time',
        content:
          'Standard delivery: 3-5 business days. Express delivery: 1-2 business days (additional charges apply). Delivery times may vary based on location.',
      },
      {
        icon: '🔄',
        title: 'Return Policy',
        content:
          'We offer a 7-day hassle-free return policy. Items must be in original condition with tags attached. Custom or personalised items are non-returnable.',
      },
      {
        icon: '🔒',
        title: 'Secure Packaging',
        content:
          'All jewellery is carefully packaged in our signature Arkee gift box to ensure it reaches you in perfect condition.',
      },
    ].map((item, i) => (
      <div
        key={i}
        className="flex gap-4 p-5 bg-rose-50 rounded-2xl border border-rose-100"
      >
        <span className="text-3xl flex-shrink-0">{item.icon}</span>
        <div>
          <h4 className="font-semibold text-gray-800 mb-1.5">{item.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
        </div>
      </div>
    ))}
    <div className="text-center pt-2">
      <Link
        to="/shipping-policy"
        className="text-rose-500 text-sm font-medium hover:underline"
      >
        Read Full Shipping & Return Policy →
      </Link>
    </div>
  </div>
);

export default ProductDetail;