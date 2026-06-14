import api from '../axios';

export const wishlistService = {
  addToWishlist: (productId) =>
    api.post(`/add-to-wishlist?productId=${productId}`),

  viewWishlist: () => api.get('/view-wishlist'),

  removeFromWishlist: (productId) =>
    api.delete(`/remove-from-wishlist?productId=${productId}`),

  checkInWishlist: (productId) =>
    api.get(`/check-in-wishlist?productId=${productId}`),

  updateWishlistItem: (productId) =>
    api.put(`/update-wishlist-item?productId=${productId}`),
};