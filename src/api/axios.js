import axios from 'axios';

const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : {};
const nodeEnv = typeof process !== 'undefined' ? process.env : {};

export const API_BASE_URL =
  viteEnv?.VITE_API_URL ||
  nodeEnv.REACT_APP_API_URL ||
  'http://localhost:8100/api';

export const IMAGE_BASE_URL =
  viteEnv?.VITE_IMAGE_BASE_URL ||
  nodeEnv.REACT_APP_IMAGE_BASE_URL ||
  API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('arkee_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const guestId = localStorage.getItem('arkee_guest_id');
    if (guestId) {
      config.headers['x-guest-id'] = guestId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const hadToken = !!localStorage.getItem('arkee_token');
    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem('arkee_token');
      localStorage.removeItem('arkee_user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Generate guest ID if not present
if (!localStorage.getItem('arkee_guest_id')) {
  localStorage.setItem(
    'arkee_guest_id',
    'guest_' + Math.random().toString(36).substr(2, 9)
  );
}

export default api;
