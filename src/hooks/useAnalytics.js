// src/hooks/useAnalytics.js
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { analyticsService } from '../services/analyticsService';

export function useAnalytics(period = 'month') {
  return useQuery({
    queryKey: queryKeys.analytics.period(period),
    queryFn:  () => analyticsService.getSummary(period),
    staleTime: 1000 * 60 * 2,   // analytics data — refresh every 2 min
    placeholderData: (prev) => prev,   // keep previous period data while new loads
  });
}