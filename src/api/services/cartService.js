import api from '../axios';

export const cartService = {
  addToCart: (data) => api.post('/addCart', data),

  viewCart: () => api.get('/viewCart'),

  removeFromCart: (data) => api.post('/removeFromCart', data),

  updateCartQuantity: (data) => api.put('/updateCartQuantity', data),
};