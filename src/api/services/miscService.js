// src/api/services/miscService.js
import api from '../axios';

export const miscService = {
  getBlogs: () => api.get('/blogs'),
  getOffers: () => api.get('/offers'),

  // POST /contact-us
  // Body: { name, email, mobile, subject, message }
  // Response: { status: true, message: "Contact form submitted successfully" }
  contactUs: (data) => api.post('/contact-us', data),

  getShippingReturnPolicy: () => api.get('/shipping-return-policy'),
  getAboutUs: () => api.get('/about-us'),
};