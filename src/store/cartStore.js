import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      setCart: (items) => {
        const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
        const totalPrice = items.reduce(
          (sum, i) => sum + (i.product?.price || 0) * i.quantity,
          0
        );
        set({ items, totalItems, totalPrice });
      },

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'arkee_cart',
    }
  )
);

export default useCartStore;