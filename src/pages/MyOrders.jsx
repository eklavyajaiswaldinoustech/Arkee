import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { orderService } from '../api/services/orderService';
import EmptyState from '../components/ui/EmptyState';
import AddReviewModal from '../components/product/AddReviewModal';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    icon: ClockIcon,
    dot: 'bg-yellow-400',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    icon: CheckCircleIcon,
    dot: 'bg-blue-400',
  },
  processing: {
    label: 'Processing',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    icon: ArrowPathIcon,
    dot: 'bg-purple-400',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    icon: TruckIcon,
    dot: 'bg-indigo-400',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-50 text-green-600 border-green-200',
    icon: CheckCircleIcon,
    dot: 'bg-green-400',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-600 border-red-200',
    icon: XCircleIcon,
    dot: 'bg-red-400',
  },
  returned: {
    label: 'Returned',
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    icon: ArrowPathIcon,
    dot: 'bg-orange-400',
  },
};

const OrderTimeline = ({ status }) => {
  const steps = ['confirmed', 'processing', 'shipped', 'delivered'];
  const currentIdx = steps.indexOf(status?.toLowerCase());
  const isCancelled = status?.toLowerCase() === 'cancelled';

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-4 px-4 py-3 bg-red-50 rounded-xl border border-red-100">
        <XCircleIcon className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-600 font-medium">
          This order has been cancelled
        </span>
      </div>
    );
  }

  return (
    <div className="mt-5 px-2">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-gray-200 z-0">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-green-400 transition-all duration-500"
            style={{
              width:
                currentIdx >= 0
                  ? `${(currentIdx / (steps.length - 1)) * 100}%`
                  : '0%',
            }}
          />
        </div>

        {steps.map((step, i) => {
          const isDone = currentIdx >= i;
          const isCurrent = currentIdx === i;
          const cfg = STATUS_CONFIG[step];
          const Icon = cfg?.icon || CheckCircleIcon;
          return (
            <div
              key={step}
              className="flex flex-col items-center gap-1.5 z-10"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-green-500 shadow-md shadow-green-200'
                    : 'bg-gray-200'
                } ${isCurrent ? 'ring-2 ring-green-300 ring-offset-2' : ''}`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isDone ? 'text-white' : 'text-gray-400'
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium text-center capitalize leading-tight ${
                  isDone ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const [reviewProductId, setReviewProductId] = useState(null);

  const statusKey = order?.status?.toLowerCase() || 'pending';
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  const items = order?.items || order?.products || [];
  const totalItems = items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex flex-wrap items-start justify-between gap-3">
          {/* Left Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-gray-400 font-mono">
                Order #{order?._id?.slice(-8)?.toUpperCase() || 'XXXXXXXX'}
              </p>
              <span className="text-gray-300">·</span>
              <p className="text-xs text-gray-400">{formattedDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                <StatusIcon className="w-3 h-3" />
                {cfg.label}
              </span>
              <span className="text-xs text-gray-400">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Right: Price & Toggle */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Order Total</p>
              <p className="text-lg font-bold text-gray-800">
                ₹{(order?.totalAmount || order?.total || 0).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-xl border border-gray-200 hover:border-rose-300 hover:text-rose-500 transition-all"
            >
              {expanded ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Items Preview (always shown) */}
      <div className="p-5">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {items.slice(0, 4).map((item, i) => {
            const product = item.productId || item.product || item;
            const img =
              product?.images?.[0] ||
              'https://placehold.co/80x80/fce7f3/be185d?text=A';
            return (
              <div key={i} className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-cream-50">
                  <img
                    src={img}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {item.quantity > 1 && (
                  <p className="text-xs text-center text-gray-400 mt-0.5">
                    x{item.quantity}
                  </p>
                )}
              </div>
            );
          })}
          {items.length > 4 && (
            <div className="flex-shrink-0 w-16 h-16 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400 font-medium">
              +{items.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 animate-fade-in">
          {/* Order Timeline */}
          <div className="px-5 py-4 border-b border-gray-50">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Order Progress
            </h4>
            <OrderTimeline status={order?.status} />
          </div>

          {/* Detailed Items */}
          <div className="p-5 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">
              Order Items
            </h4>
            {items.map((item, i) => {
              const product = item.productId || item.product || item;
              const productId = product?._id;
              const img =
                product?.images?.[0] ||
                'https://placehold.co/80x80/fce7f3/be185d?text=A';
              const price =
                item.price ||
                product?.discountPrice ||
                product?.price ||
                0;
              const isDelivered =
                order?.status?.toLowerCase() === 'delivered';

              return (
                <div
                  key={i}
                  className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                    <img
                      src={img}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${productId}`}
                      className="text-sm font-semibold text-gray-800 hover:text-rose-500 transition-colors line-clamp-1"
                    >
                      {product?.name || 'Product'}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Qty: {item.quantity || 1}
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      ₹{(price * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                  {isDelivered && productId && (
                    <button
                      onClick={() => setReviewProductId(productId)}
                      className="flex-shrink-0 flex items-center gap-1 text-xs text-gold-600 bg-gold-50 hover:bg-gold-100 border border-gold-200 px-3 py-1.5 rounded-lg transition-all self-center"
                    >
                      <StarIcon className="w-3.5 h-3.5" />
                      Review
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="px-5 pb-5">
            <div className="bg-gradient-to-br from-rose-50 to-cream-50 rounded-2xl p-5 border border-rose-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Order Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    ₹
                    {(
                      order?.subtotal ||
                      order?.totalAmount ||
                      0
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span
                    className={
                      (order?.shippingCharge || 0) === 0
                        ? 'text-green-500 font-medium'
                        : ''
                    }
                  >
                    {(order?.shippingCharge || 0) === 0
                      ? 'FREE'
                      : `₹${order?.shippingCharge}`}
                  </span>
                </div>
                {order?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-rose-200 mt-2">
                  <span>Total Paid</span>
                  <span className="text-rose-500">
                    ₹
                    {(order?.totalAmount || order?.total || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              {order?.address && (
                <div className="mt-4 pt-4 border-t border-rose-100">
                  <p className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                    <TruckIcon className="w-3.5 h-3.5 text-rose-400" />
                    Delivered To
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="font-medium text-gray-700">
                      {order.address.name}
                    </span>
                    <br />
                    {order.address.address}, {order.address.city},{' '}
                    {order.address.state} — {order.address.pincode}
                    <br />
                    {order.address.mobile}
                  </p>
                </div>
              )}

              {/* Payment Method */}
              {order?.paymentMethod && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Payment:</span>
                  <span className="text-xs font-medium text-gray-600 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                    {order.paymentMethod}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewProductId && (
        <AddReviewModal
          isOpen={!!reviewProductId}
          onClose={() => setReviewProductId(null)}
          productId={reviewProductId}
          onSuccess={() => setReviewProductId(null)}
        />
      )}
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders();
      setOrders(res?.data?.orders || res?.orders || res?.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTabs = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === 'all' ||
      order?.status?.toLowerCase() === activeFilter;
    const matchesSearch =
      !searchQuery ||
      order?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.items?.some((item) =>
        (item.productId?.name || item.product?.name || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Link to="/" className="hover:text-rose-500">
                Home
              </Link>
              <span>/</span>
              <Link to="/profile" className="hover:text-rose-500">
                Account
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">My Orders</span>
            </nav>
            <h1 className="font-serif text-3xl font-bold text-gray-800">
              My Orders
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </div>
          <Link to="/products" className="btn-primary text-sm py-2.5">
            <ShoppingBagIcon className="w-4 h-4" />
            Shop More
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID or product name..."
            className="input-field pl-11 text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
          {filterTabs.map((tab) => {
            const count =
              tab.value === 'all'
                ? orders.length
                : orders.filter(
                    (o) => o?.status?.toLowerCase() === tab.value
                  ).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === tab.value
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300 hover:text-rose-500'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      activeFilter === tab.value
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
              >
                <div className="flex justify-between mb-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-32" />
                    <div className="h-5 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded-xl w-20" />
                </div>
                <div className="flex gap-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div
                      key={j}
                      className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBagIcon className="w-12 h-12 text-rose-300" />}
            title={
              activeFilter === 'all'
                ? "You haven't placed any orders yet"
                : `No ${activeFilter} orders`
            }
            description={
              activeFilter === 'all'
                ? 'Start exploring our beautiful jewellery collections and place your first order!'
                : `You don't have any ${activeFilter} orders at the moment.`
            }
            actionLabel="Start Shopping"
            actionPath="/products"
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, i) => (
              <OrderCard key={order._id || i} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;