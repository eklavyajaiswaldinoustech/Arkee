import { useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const useCart = () => {
  const { setCart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await cartService.viewCart();
      setCart(res?.data?.items || res?.items || []);
    } catch (err) {
      console.error('Fetch cart error:', err);
    }
  }, [isAuthenticated, setCart]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isAuthenticated) {
        toast.error('Please login to add to cart');
        return false;
      }
      try {
        await cartService.addToCart({ productId, quantity });
        await fetchCart();
        toast.success('Added to cart! 🛒');
        return true;
      } catch (err) {
        toast.error(err?.message || 'Failed to add to cart');
        return false;
      }
    },
    [isAuthenticated, fetchCart]
  );

  const removeFromCart = useCallback(
    async (productId, quantity = 1) => {
      try {
        await cartService.removeFromCart({ productId, quantity });
        await fetchCart();
        toast.success('Removed from cart');
      } catch (err) {
        toast.error('Failed to remove from cart');
      }
    },
    [fetchCart]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      try {
        await cartService.updateCartQuantity({ productId, quantity });
        await fetchCart();
      } catch (err) {
        toast.error('Failed to update quantity');
      }
    },
    [fetchCart]
  );

  return { fetchCart, addToCart, removeFromCart, updateQuantity };
};

export default useCart;