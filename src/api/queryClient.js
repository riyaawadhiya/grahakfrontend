// src/api/queryClient.js
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Alert } from 'react-native';

function onError(error) {
  if (!(error instanceof AxiosError)) {
    Alert.alert('Error', 'An unexpected error occurred.');
    return;
  }

  const status  = error.response?.status;
  const message = error.response?.data?.message ?? error.message ?? 'Something went wrong';

  if (status === 401) return;           // handled by axios interceptor
  if (status === 403) { Alert.alert('Access Denied', 'You don\'t have permission.'); return; }
  if (status >= 500)  { Alert.alert('Server Error', `(${status}) ${message}`);       return; }

  Alert.alert('Error', message);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            1000 * 60 * 5,   // 5 min
      gcTime:               1000 * 60 * 10,  // 10 min
      retry: (count, error) => {
        if (error instanceof AxiosError && error.response) {
          const s = error.response.status;
          if (s >= 400 && s < 500) return false; // never retry 4xx
        }
        return count < 2;
      },
      retryDelay:           (n) => Math.min(1000 * 2 ** n, 30_000),
      refetchOnWindowFocus: false,   // not useful on mobile
      refetchOnReconnect:   true,
    },
    mutations: { retry: false },
  },
  queryCache:    new QueryCache({ onError }),
  mutationCache: new MutationCache({ onError }),
});