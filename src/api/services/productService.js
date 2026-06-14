import api from '../axios';

export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),

  getProductDetails: (id) => api.get(`/product-details/${id}`),

  getLatestProducts: () => api.get('/latest-products'),

  getRelatedProducts: (id) => api.get(`/related-products/${id}`),

  getBestByUs: () => api.get('/best-by-us'),

  getBanner: () => api.get('/banner'),

  getTypeAndCategory: () => api.get('/get-type-and-category'),

  getMaterialList: () => api.get('/get-material-list'),

  getProductsByMaterial: (material) =>
    api.get(`/shop-by-material/${material}`),
};