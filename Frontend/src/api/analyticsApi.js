import axios from './axios';

export const analyticsApi = {
  // Get overall statistics
  getAnalytics: async () => {
    const response = await axios.get('/Analytics/stats');
    return response.data;
  },

  // Get overall statistics (alias)
  getStats: async () => {
    const response = await axios.get('/Analytics/stats');
    return response.data;
  },

  // Get overview/dashboard stats
  getOverview: async () => {
    const response = await axios.get('/Analytics/stats');
    return response.data;
  },

  // Get statistics by date range
  getStatsByDateRange: async (startDate, endDate) => {
    const response = await axios.get('/Analytics/stats/daterange', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get revenue by station
  getRevenueByStation: async () => {
    const response = await axios.get('/Analytics/revenue/station');
    return response.data;
  },

  // Get revenue analytics
  getRevenueAnalytics: async () => {
    const response = await axios.get('/Analytics/revenue/station');
    return response.data;
  },

  // Get booking analytics
  getBookingAnalytics: async () => {
    const response = await axios.get('/Analytics/stats');
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async () => {
    const response = await axios.get('/Analytics/stats');
    return response.data;
  },
};