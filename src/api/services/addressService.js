import api from '../axios';

export const addressService = {
  getAddresses: () => api.get('/getuseraddress'),

  addAddress: (data) => api.post('/userAddress', data),

  editAddress: (id, data) => api.put(`/editUserAddress/${id}`, data),

  deleteAddress: (id) => api.delete(`/deleteUserAddress/${id}`),
};