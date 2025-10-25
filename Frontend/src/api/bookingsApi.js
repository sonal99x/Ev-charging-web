import axios from './axios';

export const bookingsApi = {
  // Get all bookings
  getAllBookings: async () => {
    const response = await axios.get('/Bookings');
    return response.data;
  },

  // Get all bookings (alias)
  getAll: async () => {
    const response = await axios.get('/Bookings');
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await axios.get(`/Bookings/${id}`);
    return response.data;
  },

  // Get booking by ID (alias)
  getById: async (id) => {
    const response = await axios.get(`/Bookings/${id}`);
    return response.data;
  },

  // Get user's bookings
  getBookingsByUserId: async (userId) => {
    const response = await axios.get(`/Bookings/user/${userId}`);
    return response.data;
  },

  // Get user's bookings (alias)
  getByUserId: async (userId) => {
    const response = await axios.get(`/Bookings/user/${userId}`);
    return response.data;
  },

  // Get bookings by status
  getBookingsByStatus: async (status) => {
    const response = await axios.get(`/Bookings/status/${status}`);
    return response.data;
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await axios.post('/Bookings', bookingData);
    return response.data;
  },

  // Create new booking (alias)
  create: async (bookingData) => {
    const response = await axios.post('/Bookings', bookingData);
    return response.data;
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    const response = await axios.put(`/Bookings/${id}`, bookingData);
    return response.data;
  },

  // Update booking (alias)
  update: async (id, bookingData) => {
    const response = await axios.put(`/Bookings/${id}`, bookingData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await axios.delete(`/Bookings/${id}`);
    return response.data;
  },

  // Cancel booking (alias)
  cancel: async (id) => {
    const response = await axios.delete(`/Bookings/${id}`);
    return response.data;
  },

  // Delete booking (alias for cancel)
  deleteBooking: async (id) => {
    const response = await axios.delete(`/Bookings/${id}`);
    return response.data;
  },

  // Check if booking can be modified
  canModifyBooking: async (id) => {
    const response = await axios.get(`/Bookings/${id}/canmodify`);
    return response.data;
  },
};