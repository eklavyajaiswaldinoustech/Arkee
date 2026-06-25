import api from '../axios';

const normalizeCategory = (category) => ({
  ...category,
  name: category?.name || category?.type || '',
  type: category?.type || category?.name || '',
});

export const categoryService = {
  getAllCategories: async (id) => {
    const res = await api.get('/get-all-Category', id ? { params: { id } } : {});
    const categories = Array.isArray(res?.data) ? res.data : Array.isArray(res?.categories) ? res.categories : [];
    return {
      ...res,
      data: categories.map(normalizeCategory),
      categories: categories.map(normalizeCategory),
    };
  },

  getAllSubcategories: async (categoryId) => {
    const res = await api.get('/get-all-Subcategory', { params: { categoryId } });
    const subcategories = Array.isArray(res?.data) ? res.data : Array.isArray(res?.subcategories) ? res.subcategories : [];
    return {
      ...res,
      data: subcategories,
      subcategories,
    };
  },
};
