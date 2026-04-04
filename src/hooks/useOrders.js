// src/hooks/useOrders.js
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { queryKeys } from '../api/queryKeys';
import { orderService } from '../services/orderService';

// ── Fetch orders list ─────────────────────────────────────────────────────────
export function useOrders(filters = {}) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn:  () => orderService.getAll(filters),
    placeholderData: keepPreviousData,
  });
}

// ── Fetch single order ────────────────────────────────────────────────────────
export function useOrder(id) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn:  () => orderService.getById(id),
    enabled:  !!id,
  });
}

// ── Accept order (status → preparing) ────────────────────────────────────────
export function useAcceptOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => orderService.updateStatus({ id, status: 'preparing' }),

    // Optimistic update — instant UI feedback
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.orders.lists() });
      const snapshot = qc.getQueriesData({ queryKey: queryKeys.orders.lists() });
      qc.setQueriesData({ queryKey: queryKeys.orders.lists() }, (old) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.map((o) => o.id === id ? { ...o, status: 'preparing' } : o) };
      });
      return { snapshot };
    },
    onError: (_err, _id, ctx) => {
      ctx?.snapshot?.forEach(([key, val]) => qc.setQueryData(key, val));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.orders.lists() }),
  });
}

// ── Advance status (preparing → ready → delivered) ────────────────────────────
export function useAdvanceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateStatus({ id, status }),

    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: queryKeys.orders.lists() });
      const snapshot = qc.getQueriesData({ queryKey: queryKeys.orders.lists() });
      qc.setQueriesData({ queryKey: queryKeys.orders.lists() }, (old) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.map((o) => o.id === id ? { ...o, status } : o) };
      });
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshot?.forEach(([key, val]) => qc.setQueryData(key, val));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.orders.lists() }),
  });
}

// ── Decline / cancel order ────────────────────────────────────────────────────
export function useDeclineOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => orderService.cancel(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.orders.lists() });
      const snapshot = qc.getQueriesData({ queryKey: queryKeys.orders.lists() });
      qc.setQueriesData({ queryKey: queryKeys.orders.lists() }, (old) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.filter((o) => o.id !== id) };
      });
      return { snapshot };
    },
    onError: (_err, _id, ctx) => {
      ctx?.snapshot?.forEach(([key, val]) => qc.setQueryData(key, val));
      Alert.alert('Error', 'Could not decline order. Please try again.');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.orders.lists() }),
  });
}