// src/api/services/contactService.js
import api from '../axios';

export const contactService = {
  // POST /contact-us
  // Body: { name, email, mobile, subject, message }
  // Response: { status: true, message: "Contact form submitted successfully" }
  submitContact: (data) => api.post('/contact-us/', data),
};