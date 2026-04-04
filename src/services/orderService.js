// src/api/services/orderService.js
import apiClient from '../utils/axiosInstance';

export const orderService = {
  // GET /orders?status=new&page=1
  getAll: async (filters = {}) => {
    const { data } = await apiClient.get('/orders', { params: filters });
    return data;   // { data: Order[], total, page, lastPage }
  },

  // GET /orders/:id
  getById: async (id) => {
    const { data } = await apiClient.get(`/orders/${id}`);
    return data;
  },

  // POST /orders
  create: async (payload) => {
    const { data } = await apiClient.post('/orders', payload);
    return data;
  },

  // PATCH /orders/:id/status  { status: 'preparing' | 'ready' | 'delivered' }
  updateStatus: async ({ id, status }) => {
    const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
    return data;
  },

  // DELETE /orders/:id
  cancel: async (id) => {
    await apiClient.delete(`/orders/${id}`);
  },
};