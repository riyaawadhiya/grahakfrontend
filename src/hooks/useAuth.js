// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { queryKeys } from '../api/queryKeys';
import { authService } from '../services/authService';

// ── Current session ───────────────────────────────────────────────────────────
export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn:  authService.me,
    staleTime: Infinity,   // user object doesn't change mid-session
    retry: false,          // if 401 → not logged in, no point retrying
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────
export function useLogin() {
  const qc     = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Seed the session cache so useMe() resolves immediately
      qc.setQueryData(queryKeys.auth.session(), data.user);
      router.replace('/(tabs)/home');
    },
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────
export function useLogout() {
  const qc     = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      qc.clear();                        // wipe all cached data
      router.replace('/(auth)/login');
    },
  });
}