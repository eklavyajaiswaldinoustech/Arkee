import api from '../axios';
import { IMAGE_BASE_URL } from '../axios';

const toAbsoluteImage = (value) => {
  if (!value) return value;
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return value;
  if (value.startsWith('/')) return `${IMAGE_BASE_URL}${value}`;
  return `${IMAGE_BASE_URL}/${value}`;
};

const normalizeImages = (product) => {
  const rawImages = product?.images ?? product?.image ?? [];
  const images = Array.isArray(rawImages)
    ? rawImages.map(toAbsoluteImage).filter(Boolean)
    : rawImages
      ? [toAbsoluteImage(rawImages)].filter(Boolean)
      : [];

  return {
    ...product,
    images,
    image: images,
    category: product?.category || product?.type || '',
    type: product?.type || '',
    name: product?.name || '',
  };
};

const normalizeProductList = (payload) => {
  if (!Array.isArray(payload)) return payload;
  return payload.map(normalizeImages);
};

const pickArray = (...candidates) => {
  const match = candidates.find((candidate) => Array.isArray(candidate));
  return match || [];
};

export const productService = {
  getAllProducts: async (params) => {
    const res = await api.get('/products', { params });
    const data = pickArray(res?.data, res?.products, res?.data?.products);
    return {
      ...res,
      data: normalizeProductList(data),
    };
  },

  getProductDetails: async (id) => {
    const res = await api.get(`/product-details/${id}`);
    const product = res?.product ? normalizeImages(res.product) : res?.data ? normalizeImages(res.data) : null;
    return {
      ...res,
      product,
      data: product,
    };
  },

  getLatestProducts: async () => {
    const res = await api.get('/latest-products');
    const data = pickArray(res?.data, res?.products, res?.data?.products);
    return {
      ...res,
      data: normalizeProductList(data),
    };
  },

  getRelatedProducts: async (id) => {
    const res = await api.get(`/related-products/${id}`);
    const related = normalizeProductList(
      pickArray(res?.relatedProducts, res?.data?.relatedProducts, res?.data)
    );
    return {
      ...res,
      relatedProducts: related,
      data: related,
    };
  },

  getBestByUs: async () => {
    const res = await api.get('/best-by-us');
    const data = pickArray(res?.data, res?.products);
    return {
      ...res,
      data: normalizeProductList(data),
    };
  },

  getBanner: () => api.get('/banner'),

  getTypeAndCategory: () => api.get('/get-type-and-category'),

  getMaterialList: () => api.get('/get-material-list'),

  getProductsByMaterial: async (material) => {
    const res = await api.get(`/shop-by-material/${material}`);
    const data = pickArray(res?.data, res?.products);
    return {
      ...res,
      data: normalizeProductList(data),
    };
  },

  getNewLaunchProducts: async (params) => {
    const res = await api.get('/get-new-launch-products', { params });
    const data = pickArray(res?.data, res?.products);
    return {
      ...res,
      data: normalizeProductList(data),
    };
  },

  getBestSellerProducts: async (params) => {
    const res = await api.get('/get-best-seller-products', { params });
    const data = pickArray(res?.data, res?.products);
    return {
      ...res,
      data: normalizeProductList(data),
    };
  },

  getProductsByOccasion: async (occasion) => {
    const res = await api.get('/get-products-by-occasion', {
      params: { occasion },
    });
    const data = pickArray(res?.data, res?.products);
    return {
      ...res,
      data: normalizeProductList(data),
    };
  },

  getNewLaunches: async () => productService.getNewLaunchProducts(),

  getProductMeta: async () => productService.getTypeAndCategory(),
};
