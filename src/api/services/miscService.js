import api from '../axios';

export const miscService = {
  getBlogs: () => api.get('/blogs'),

  getOffers: () => api.get('/offers'),

  contactUs: (data) => api.post('/contact-us', data),

  getShippingReturnPolicy: () => api.get('/shipping-return-policy'),
};
