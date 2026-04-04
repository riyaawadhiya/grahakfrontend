// src/hooks/useProfile.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { profileService } from '../services/profileService';

// ── Fetch profile ─────────────────────────────────────────────────────────────
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn:  profileService.getMe,
    staleTime: 1000 * 60 * 10,
  });
}

// ── Update profile ────────────────────────────────────────────────────────────
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => profileService.update(payload),

    // Optimistic update
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: queryKeys.profile.me() });
      const previous = qc.getQueryData(queryKeys.profile.me());
      qc.setQueryData(queryKeys.profile.me(), (old) => ({ ...old, ...payload }));
      return { previous };
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.profile.me(), ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.profile.me() }),
  });
}

// ── Toggle notifications ──────────────────────────────────────────────────────
export function useUpdateNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enabled) => profileService.updateNotifications(enabled),
    onMutate: async (enabled) => {
      await qc.cancelQueries({ queryKey: queryKeys.profile.me() });
      const previous = qc.getQueryData(queryKeys.profile.me());
      qc.setQueryData(queryKeys.profile.me(), (old) => ({ ...old, notificationsOn: enabled }));
      return { previous };
    },
    onError: (_err, _enabled, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.profile.me(), ctx.previous);
    },
  });
}