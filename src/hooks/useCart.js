import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../api/services/cartService';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const MAX_CART_QTY = 4;

const getProductId = (item) =>
  item?.productId?._id ||
  item?.productId ||
  item?.productid?._id ||
  item?.productid ||
  item?._id ||
  null;

const normalizeCartItems = (items) =>
  (Array.isArray(items) ? items : []).map((item) => {
    const productId = getProductId(item);
    const price =
      Number(
        item?.productId?.discountPrice ??
          item?.productId?.price ??
          item?.discountPrice ??
          item?.price ??
          item?.current_price ??
          item?.price_at_addition ??
          0
      ) || 0;

    return {
      ...item,
      productId:
        typeof item?.productId === 'object'
          ? {
              ...item.productId,
              _id: productId,
              images: item?.productId?.images || item?.images || [],
              price: Number(item?.productId?.price ?? item?.current_price ?? item?.price_at_addition ?? price),
              discountPrice: Number(
                item?.productId?.discountPrice ?? item?.price_at_addition ?? item?.current_price ?? price
              ),
            }
          : {
              _id: productId,
              name: item?.name || '',
              images: item?.images || [],
              price: Number(item?.current_price ?? item?.price_at_addition ?? price),
              discountPrice: Number(item?.price_at_addition ?? item?.current_price ?? price),
              category: item?.category || '',
            },
      quantity: Math.min(Number(item?.quantity || 1), MAX_CART_QTY),
      price,
      unitPrice: price,
      currentPrice: Number(item?.current_price ?? price),
      priceAtAddition: Number(item?.price_at_addition ?? price),
    };
  });

const useCart = () => {
  const cartStore = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // DEBUG: Log store structure on mount
  console.log('[Cart Debug] Store keys:', Object.keys(cartStore || {}));
  console.log('[Cart Debug] Store cart value:', cartStore?.cart);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return [];
    try {
      const res = await cartService.viewCart();
      const items = normalizeCartItems(res?.data || res?.items || []);
      
      // Check if setCart exists
      if (typeof cartStore?.setCart === 'function') {
        cartStore.setCart(items);
      } else {
        console.error('[Cart Error] cartStore.setCart is not a function', cartStore);
      }
      
      return items;
    } catch (err) {
      console.error('[Cart Error] Fetch cart failed:', err);
      return [];
    }
  }, [isAuthenticated, cartStore]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isAuthenticated) {
        toast.error('Please login to add to cart');
        navigate('/login', { state: { from: 'cart' } });
        return false;
      }

      try {
        const normalizedQty = Math.max(1, Number(quantity) || 1);
        
        // SAFE: Handle undefined or non-array cart
        const cartArray = Array.isArray(cartStore?.cart) ? cartStore.cart : [];
        console.log('[Cart Debug] Current cart array:', cartArray);
        
        const currentItem = cartArray.find((item) => getProductId(item) === productId);
        const currentQty = currentItem?.quantity || 0;
        const nextQty = Math.min(MAX_CART_QTY, currentQty + normalizedQty);

        console.log('[Cart Debug] Add to cart:', { productId, currentQty, nextQty });

        // Check max limit BEFORE API call
        if (currentQty >= MAX_CART_QTY) {
          toast.error('You can only add up to 4 of the same item.');
          return { success: false, alreadyInCart: true, quantity: currentQty };
        }

        // Make API call
        if (currentQty > 0) {
          await cartService.updateCartQuantity({
            productId,
            quantity: nextQty,
          });
        } else {
          await cartService.addToCart({
            productId,
            quantity: Math.min(MAX_CART_QTY, normalizedQty),
          });
        }

        // CRITICAL: Refresh cart from server to ensure sync
        const updatedCart = await fetchCart();
        
        console.log('[Cart Debug] Updated cart after add:', updatedCart);

        // Show success message
        const newItem = updatedCart.find((item) => getProductId(item) === productId);
        toast.success(
          currentQty > 0
            ? `Updated cart quantity to ${newItem?.quantity || nextQty}.`
            : 'Added to cart! 🛒'
        );

        return {
          success: true,
          quantity: newItem?.quantity || nextQty,
          alreadyInCart: currentQty > 0,
        };
      } catch (err) {
        console.error('[Cart Error] Add to cart failed:', err);
        toast.error(err?.message || 'Failed to add to cart');
        return { success: false };
      }
    },
    [isAuthenticated, cartStore, fetchCart, navigate]
  );

  const removeFromCart = useCallback(
    async (productId, quantity = 1) => {
      try {
        await cartService.removeFromCart({ productId, quantity });
        // Refresh immediately after removal
        await fetchCart();
        toast.success('Removed from cart');
      } catch (err) {
        console.error('[Cart Error] Remove from cart failed:', err);
        toast.error('Failed to remove from cart');
      }
    },
    [fetchCart]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      try {
        const nextQty = Math.max(1, Math.min(MAX_CART_QTY, Number(quantity) || 1));
        
        if (nextQty <= 0) {
          await removeFromCart(productId, 1);
          return;
        }

        await cartService.updateCartQuantity({ productId, quantity: nextQty });
        await fetchCart();
        
        if (Number(quantity) > MAX_CART_QTY) {
          toast.error('Maximum quantity for a single item is 4.');
        }
      } catch (err) {
        console.error('[Cart Error] Update quantity failed:', err);
        toast.error('Failed to update quantity');
      }
    },
    [fetchCart, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart?.();
      if (typeof cartStore?.setCart === 'function') {
        cartStore.setCart([]);
      }
      toast.success('Cart cleared');
    } catch (err) {
      console.error('[Cart Error] Clear cart failed:', err);
    }
  }, [cartStore]);

  const goToCartItem = useCallback(
    (productId) => {
      navigate(`/cart?highlight=${encodeURIComponent(productId)}`);
    },
    [navigate]
  );

  return { 
    fetchCart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    goToCartItem 
  };
};

export default useCart;