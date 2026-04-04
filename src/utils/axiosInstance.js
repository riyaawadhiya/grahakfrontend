// src/api/axiosInstance.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL =  'https://api.yourapp.com/v1';

// ─── Token helpers (SecureStore is safer than AsyncStorage for tokens) ────────
export const TokenStorage = {
  getAccess:   ()           => SecureStore.getItemAsync('access_token'),
  getRefresh:  ()           => SecureStore.getItemAsync('refresh_token'),
  setTokens:   (a, r)       => Promise.all([
    SecureStore.setItemAsync('access_token', a),
    SecureStore.setItemAsync('refresh_token', r),
  ]),
  clear:       ()           => Promise.all([
    SecureStore.deleteItemAsync('access_token'),
    SecureStore.deleteItemAsync('refresh_token'),
  ]),
};

// ─── Base instance ────────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor — attach Bearer token ────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    const token = await TokenStorage.getAccess();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Token refresh queue ──────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  failedQueue = [];
};

// ─── Response interceptor — handle 401 + token refresh ───────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }

      original._retry = true;
      isRefreshing    = true;

      try {
        const refreshToken = await TokenStorage.getRefresh();
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        await TokenStorage.setTokens(data.access_token, data.refresh_token);
        processQueue(null, data.access_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(original);
      } catch (err) {
        processQueue(err, null);
        await TokenStorage.clear();
        // Let your auth context/router handle redirect
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;