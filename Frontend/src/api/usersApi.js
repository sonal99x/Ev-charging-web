import axios from './axios';

export const usersApi = {
  // Get all users
  getAllUsers: async () => {
    const response = await axios.get('/Users');
    return response.data;
  },

  // Get all users (alias for compatibility)
  getAll: async () => {
    const response = await axios.get('/Users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await axios.get(`/Users/${id}`);
    return response.data;
  },

  // Get user by ID (alias)
  getById: async (id) => {
    const response = await axios.get(`/Users/${id}`);
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role) => {
    const response = await axios.get(`/Users/role/${role}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await axios.post('/Users', userData);
    return response.data;
  },

  // Create new user (alias)
  create: async (userData) => {
    const response = await axios.post('/Users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await axios.put(`/Users/${id}`, userData);
    return response.data;
  },

  // Update user (alias)
  update: async (id, userData) => {
    const response = await axios.put(`/Users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await axios.delete(`/Users/${id}`);
    return response.data;
  },

  // Delete user (alias)
  delete: async (id) => {
    const response = await axios.delete(`/Users/${id}`);
    return response.data;
  },

  // Toggle user active status
  toggleUserStatus: async (id, isActive) => {
    const response = await axios.patch(`/Users/${id}/status`, { isActive });
    return response.data;
  },

  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    const response = await axios.patch(`/Users/${userId}/password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  },
};