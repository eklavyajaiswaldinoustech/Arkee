import api from '../axios';

export const orderService = {
  getMyOrders: () => api.get('/my-order'),
};