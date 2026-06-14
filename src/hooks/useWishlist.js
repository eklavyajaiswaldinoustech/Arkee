import { useCallback } from 'react';
import { wishlistService } from '../api/services/wishlistService';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const useWishlist = () => {
  const { setWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await wishlistService.viewWishlist();
      setWishlist(res?.data?.items || res?.items || []);
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    }
  }, [isAuthenticated, setWishlist]);

  const addToWishlist = useCallback(
    async (productId) => {
      if (!isAuthenticated) {
        toast.error('Please login to add to wishlist');
        return false;
      }
      try {
        await wishlistService.addToWishlist(productId);
        await fetchWishlist();
        toast.success('Added to wishlist! ♡');
        return true;
      } catch (err) {
        toast.error(err?.message || 'Failed to add to wishlist');
        return false;
      }
    },
    [isAuthenticated, fetchWishlist]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      try {
        await wishlistService.removeFromWishlist(productId);
        await fetchWishlist();
        toast.success('Removed from wishlist');
      } catch (err) {
        toast.error('Failed to remove from wishlist');
      }
    },
    [fetchWishlist]
  );

  return { fetchWishlist, addToWishlist, removeFromWishlist };
};

export default useWishlist;