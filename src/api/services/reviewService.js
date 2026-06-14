import api from '../axios';

export const reviewService = {
  getUserReviews: () => api.get('/user-reviews'),

  addReview: (formData) =>
    api.post('/add-review', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getProductReviews: (productId) =>
    api.get(`/product-reviews/${productId}`),

  editReview: (reviewId, data) =>
    api.put(`/edit-review/${reviewId}`, data),

  deleteReview: (reviewId) =>
    api.delete(`/delete-review/${reviewId}`),
};