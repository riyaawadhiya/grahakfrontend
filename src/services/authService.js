// src/api/services/authService.js
import apiClient, { TokenStorage } from '../utils/axiosInstance';

export const authService = {
  login: async ({ email, password }) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    // Persist tokens right after login
    await TokenStorage.setTokens(data.access_token, data.refresh_token);
    return data;          // { access_token, refresh_token, user }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await TokenStorage.clear();
    }
  },

  me: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;          // current user object
  },
};