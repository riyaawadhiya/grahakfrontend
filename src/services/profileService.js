// src/api/services/profileService.js
import apiClient from '../utils/axiosInstance';

export const profileService = {
  // GET /profile/me
  getMe: async () => {
    const { data } = await apiClient.get('/profile/me');
    return data;
    // { name, storeName, email, phone, location, stats: { orders, rating, growth } }
  },

  // PATCH /profile/me
  update: async (payload) => {
    const { data } = await apiClient.patch('/profile/me', payload);
    return data;
  },

  // PATCH /profile/notifications
  updateNotifications: async (enabled) => {
    const { data } = await apiClient.patch('/profile/notifications', { enabled });
    return data;
  },
};