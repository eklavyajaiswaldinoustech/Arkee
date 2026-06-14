import axios from 'axios';

const BASE_URL = 'http://localhost:8100/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== CATEGORY APIs ====================
export const categoryAPI = {
  getAllCategories: () => api.get('/get-all-Category?id=684a956573ec6be3e07fb9e8'),
  getSubcategories: (categoryId) => api.get(`/get-all-Subcategory?categoryId=${categoryId}`),
};

// ==================== PRODUCT APIs ====================
export const productAPI = {
  getMaterialList: () => api.get('/get-material-list'),
  getProductsByMaterial: (material) => api.get(`/shop-by-material/${material}`),
};

// ==================== WISHLIST APIs ====================
export const wishlistAPI = {
  addToWishlist: (productId) => api.post(`/add-to-wishlist?productId=${productId}`),
  viewWishlist: () => api.get('/view-wishlist'),
  removeFromWishlist: (productId) => api.delete(`/remove-from-wishlist?productId=${productId}`),
  checkInWishlist: (productId) => api.get(`/check-in-wishlist?productId=${productId}`),
  updateWishlistItem: (productId) => api.put(`/update-wishlist-item?productId=${productId}`),
};

// ==================== CART APIs ====================
export const cartAPI = {
  updateCartQuantity: (productId, quantity) =>
    api.put('/updateCartQuantity', { productId, quantity }),
};

// ==================== ADDRESS APIs ====================
export const addressAPI = {
  addAddress: (addressData) => api.post('/userAddress', addressData),
  editAddress: (addressId, addressData) => api.put(`/editUserAddress/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/deleteUserAddress/${addressId}`),
};

// ==================== USER PROFILE APIs ====================
export const userAPI = {
  editProfile: (profileData) => api.put('/edit-profile-data', profileData),
};

// ==================== ORDER APIs ====================
export const orderAPI = {
  getMyOrders: () => api.get('/my-order'),
};

// ==================== CONTENT APIs ====================
export const contentAPI = {
  getBlogs: () => api.get('/blogs'),
  getShippingPolicy: () => api.get('/shipping-return-policy'),
};

export default api;