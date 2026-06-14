import api from '../axios';

export const authService = {
  register: (data) => api.post('/add-user', data),
  
  login: (data) => api.post('/login', data),
  
  forgotPassword: (email) =>
    api.get(`/forgot-password?email=${email}`),
  
  getProfile: () => api.get('/my-profile'),
  
  updateProfile: (data) => api.put('/edit-profile-data', data),
  
  submitProfileData: (data) => api.post('/profile-data', data),
};