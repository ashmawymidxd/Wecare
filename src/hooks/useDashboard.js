import { useCachedQuery } from "./useCache";
import dashboardService from "../services/dashboardService";

/**
 * Hook for dashboard statistics with caching
 */
export const useDashboardStats = (options = {}) => {
  return useCachedQuery("dashboard-stats", () => dashboardService.getStats(), {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    ...options,
  });
};

/**
 * Hook for revenue statistics with caching
 */
export const useRevenueStats = (options = {}) => {
  return useCachedQuery(
    "revenue-stats",
    () => dashboardService.getRevenueStats(),
    {
      staleTime: 3 * 60 * 1000, // 3 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      refetchOnWindowFocus: true,
      refetchInterval: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      ...options,
    }
  );
};

/**
 * Hook for sources activity data with caching
 */
export const useSourcesActivity = (options = {}) => {
  return useCachedQuery(
    "sources-activity",
    () => dashboardService.getSourcesActivity(),
    {
      staleTime: 3 * 60 * 1000, // 3 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      refetchOnWindowFocus: true,
      refetchInterval: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      ...options,
    }
  );
};

/**
 * Hook for occupancy data with caching
 */
export const useOccupancyData = (options = {}) => {
  return useCachedQuery(
    "occupancy-data",
    () => dashboardService.getOccupancyData(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 20 * 60 * 1000, // 20 minutes
      refetchOnWindowFocus: true,
      refetchInterval: 15 * 60 * 1000, // 15 minutes
      retry: 3,
      ...options,
    }
  );
};

/**
 * Hook for expiring contracts with caching
 */
export const useExpiringContracts = (options = {}) => {
  return useCachedQuery(
    "expiring-contracts",
    () => dashboardService.getExpiringContracts(),
    {
      staleTime: 1 * 60 * 1000, // 1 minute (more frequently updated)
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchInterval: 3 * 60 * 1000, // 3 minutes
      retry: 3,
      ...options,
    }
  );
};

/**
 * Hook for account managers performance with caching
 */
export const useAccountManagersPerformance = (options = {}) => {
  return useCachedQuery(
    "account-managers-performance",
    () => dashboardService.getAccountManagersPerformance(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 20 * 60 * 1000, // 20 minutes
      refetchOnWindowFocus: true,
      refetchInterval: 15 * 60 * 1000, // 15 minutes
      retry: 3,
      ...options,
    }
  );
};

/**
 * Hook for all dashboard data with optimized batching
 */
export const useAllDashboardData = (options = {}) => {
  return useCachedQuery(
    "all-dashboard-data",
    () => dashboardService.getAllDashboardData(),
    {
      staleTime: 1 * 60 * 1000, // 1 minute
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      refetchInterval: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      ...options,
    }
  );
};

/**
 * Hook for prefetching dashboard data
 */
export const useDashboardPrefetch = () => {
  return {
    prefetch: () => dashboardService.prefetchDashboardData(),
  };
};
