import api from '../axios';

export const categoryService = {
  getAllCategories: (id) =>
    api.get('/get-all-Category', id ? { params: { id } } : {}),

  getAllSubcategories: (categoryId) =>
    api.get('/get-all-Subcategory', { params: { categoryId } }),
};