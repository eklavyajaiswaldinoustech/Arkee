import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      setWishlist: (items) =>
        set({ items, totalItems: items.length }),

      clearWishlist: () => set({ items: [], totalItems: 0 }),
    }),
    { name: 'arkee_wishlist' }
  )
);

export default useWishlistStore;