// src/api/services/analyticsService.js
import apiClient from '../utils/axiosInstance';

export const analyticsService = {
  // GET /analytics?period=week|month|year
  getSummary: async (period = 'month') => {
    const { data } = await apiClient.get('/analytics', { params: { period } });
    return data;
    // Expected shape:
    // {
    //   kpi:        { revenue, online, sales },
    //   chartData:  [{ l: 'Mon', v: 320 }, ...],
    //   categories: [{ name, value, color }, ...],
    //   topItems:   [{ name, sales, color }, ...],
    // }
  },
};