import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_CART_QTY = 4;

const getProductId = (item) =>
  item?.productId?._id ||
  item?.productId ||
  item?.productid?._id ||
  item?.productid ||
  item?._id ||
  null;

const getDisplayPrice = (item) =>
  Number(
    item?.productId?.discountPrice ??
      item?.productId?.price ??
      item?.discountPrice ??
      item?.price ??
      item?.current_price ??
      item?.price_at_addition ??
      0
  );

const normalizeCartItem = (item) => {
  const productId = getProductId(item);
  const images = Array.isArray(item?.productId?.images)
    ? item.productId.images
    : Array.isArray(item?.images)
      ? item.images
      : Array.isArray(item?.product?.images)
        ? item.product.images
        : [];
  const price = getDisplayPrice(item);
  const quantity = Math.min(Number(item?.quantity || 1), MAX_CART_QTY);

  return {
    ...item,
    productId:
      typeof item?.productId === 'object'
        ? {
            ...item.productId,
            _id: productId,
            images,
            price: Number(item?.productId?.price ?? item?.current_price ?? item?.price_at_addition ?? price),
            discountPrice: Number(
              item?.productId?.discountPrice ?? item?.price_at_addition ?? item?.current_price ?? price
            ),
          }
        : {
            _id: productId,
            name: item?.name || item?.product?.name || '',
            images,
            price: Number(item?.current_price ?? item?.price_at_addition ?? price),
            discountPrice: Number(item?.price_at_addition ?? item?.current_price ?? price),
            category: item?.category || item?.product?.category || '',
          },
    product:
      item?.product ||
      (typeof item?.productId === 'object' ? item.productId : null),
    quantity,
    price,
    unitPrice: price,
    currentPrice: Number(item?.current_price ?? price),
    priceAtAddition: Number(item?.price_at_addition ?? price),
  };
};

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      setCart: (items) => {
        const normalizedItems = (Array.isArray(items) ? items : []).map(
          normalizeCartItem
        );
        const totalItems = normalizedItems.reduce(
          (sum, i) => sum + Number(i.quantity || 0),
          0
        );
        const totalPrice = normalizedItems.reduce(
          (sum, i) => sum + getDisplayPrice(i) * Number(i.quantity || 0),
          0
        );
        set({ items: normalizedItems, totalItems, totalPrice });
      },

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),

      getItemByProductId: (productId) =>
        get().items.find(
          (item) => getProductId(item)?.toString() === productId?.toString()
        ),

      getItemQuantity: (productId) => {
        const item = get().items.find(
          (cartItem) => getProductId(cartItem)?.toString() === productId?.toString()
        );
        return Number(item?.quantity || 0);
      },

      maxCartQty: MAX_CART_QTY,
    }),
    {
      name: 'arkee_cart',
    }
  )
);

export default useCartStore;
