import axios from './axios';

export const authApi = {
  // Register new user
  register: async (userData) => {
    const response = await axios.post('/Auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axios.post('/Auth/login', credentials);
    return response.data;
  },

  // Logout user (client-side)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};