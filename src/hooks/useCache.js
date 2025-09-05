import { useState, useEffect, useCallback, useRef } from "react";
import localStorageCache from "../utils/localStorageCache";

/**
 * Enhanced caching hook with configurable TTL, refresh strategies, and error handling
 */
export const useCache = () => {
  const cache = useRef(new Map());
  const timers = useRef(new Map());

  const set = useCallback((key, data, ttl = 5 * 60 * 1000) => {
    // Default 5 minutes TTL
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Set in memory cache
    cache.current.set(key, item);

    // Set in localStorage as backup
    localStorageCache.set(key, data, ttl);

    // Clear existing timer
    if (timers.current.has(key)) {
      clearTimeout(timers.current.get(key));
    }

    // Set new timer for expiration
    const timer = setTimeout(() => {
      cache.current.delete(key);
      timers.current.delete(key);
      localStorageCache.remove(key);
    }, ttl);

    timers.current.set(key, timer);
  }, []);

  const get = useCallback(
    (key) => {
      // Try memory cache first
      const memoryItem = cache.current.get(key);
      if (memoryItem) {
        const isExpired = Date.now() - memoryItem.timestamp > memoryItem.ttl;
        if (!isExpired) {
          return memoryItem.data;
        } else {
          cache.current.delete(key);
          if (timers.current.has(key)) {
            clearTimeout(timers.current.get(key));
            timers.current.delete(key);
          }
        }
      }

      // Fallback to localStorage
      const localData = localStorageCache.get(key);
      if (localData) {
        // Restore to memory cache
        const ttl = 5 * 60 * 1000; // Default TTL for restored items
        set(key, localData, ttl);
        return localData;
      }

      return null;
    },
    [set]
  );

  const invalidate = useCallback((key) => {
    cache.current.delete(key);
    localStorageCache.remove(key);
    if (timers.current.has(key)) {
      clearTimeout(timers.current.get(key));
      timers.current.delete(key);
    }
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
    localStorageCache.clear();
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current.clear();
  }, []);

  const isStale = useCallback((key, staleTime = 30 * 1000) => {
    // Default 30 seconds stale time
    // Check memory cache
    const item = cache.current.get(key);
    if (item) {
      return Date.now() - item.timestamp > staleTime;
    }

    // Check localStorage
    return localStorageCache.isStale(key, staleTime);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const currentTimers = timers.current;
    return () => {
      currentTimers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return { set, get, invalidate, clear, isStale };
};

/**
 * Enhanced query hook with caching, background refresh, and optimized state management
 */
export const useCachedQuery = (key, queryFn, options = {}) => {
  const {
    staleTime = 30 * 1000, // 30 seconds
    cacheTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = true,
    refetchInterval = false,
    retry = 3,
    retryDelay = 1000,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const cache = useCache();
  const retryCount = useRef(0);
  const isFirstLoad = useRef(true);

  const executeQuery = useCallback(
    async (isBackground = false) => {
      if (!enabled) return;

      try {
        if (!isBackground && isFirstLoad.current) {
          setLoading(true);
        } else if (isBackground) {
          setIsRefetching(true);
        }

        setError(null);

        const result = await queryFn();

        // Cache the result
        cache.set(key, result, cacheTime);
        setData(result);
        retryCount.current = 0;

        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err) {
        console.error(`Query error for ${key}:`, err);

        if (retryCount.current < retry) {
          retryCount.current++;
          setTimeout(() => {
            executeQuery(isBackground);
          }, retryDelay * retryCount.current);
          return;
        }

        setError(err.message || "An error occurred");
        if (onError) {
          onError(err);
        }
      } finally {
        setLoading(false);
        setIsRefetching(false);
        isFirstLoad.current = false;
      }
    },
    [
      key,
      queryFn,
      enabled,
      cache,
      cacheTime,
      retry,
      retryDelay,
      onSuccess,
      onError,
    ]
  );

  const refetch = useCallback(() => {
    cache.invalidate(key);
    return executeQuery(false);
  }, [key, cache, executeQuery]);

  const prefetch = useCallback(() => {
    if (!cache.get(key)) {
      executeQuery(true);
    }
  }, [key, cache, executeQuery]);

  // Initial load
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Check cache first
    const cachedData = cache.get(key);
    if (cachedData) {
      setData(cachedData);
      setLoading(false);

      // Check if data is stale and refetch in background
      if (cache.isStale(key, staleTime)) {
        executeQuery(true);
      }
    } else {
      executeQuery(false);
    }
  }, [key, enabled, cache, staleTime, executeQuery]);

  // Refetch interval
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(() => {
      if (cache.isStale(key, staleTime)) {
        executeQuery(true);
      }
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, enabled, key, cache, staleTime, executeQuery]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleFocus = () => {
      if (cache.isStale(key, staleTime)) {
        executeQuery(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetchOnWindowFocus, enabled, key, cache, staleTime, executeQuery]);

  return {
    data,
    loading,
    error,
    isRefetching,
    refetch,
    prefetch,
  };
};
