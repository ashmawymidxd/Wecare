# Dashboard API and Caching Layer Enhancements

## Overview

This document outlines the comprehensive enhancements made to the dashboard page API calls and caching layer to improve performance, reliability, and user experience.

## Key Enhancements

### 1. Enhanced Caching System (`src/hooks/useCache.js`)

- **Multi-layered caching**: In-memory cache with localStorage fallback
- **Configurable TTL**: Different cache times for different data types
- **Stale-while-revalidate**: Shows cached data while fetching fresh data in background
- **Auto-cleanup**: Automatically removes expired cache entries
- **Memory management**: Prevents memory leaks with proper cleanup

### 2. Local Storage Cache (`src/utils/localStorageCache.js`)

- **Size management**: 5MB limit with automatic cleanup
- **Expiration handling**: Built-in TTL support
- **Storage optimization**: Removes oldest entries when space is needed
- **Statistics tracking**: Monitor cache usage and performance
- **Error resilience**: Handles corrupted cache entries gracefully

### 3. Specialized Dashboard Hooks (`src/hooks/useDashboard.js`)

- **useDashboardStats**: Cache stats for 2 minutes, refresh every 5 minutes
- **useRevenueStats**: Cache revenue data for 3 minutes, refresh every 10 minutes
- **useSourcesActivity**: Cache sources data for 3 minutes
- **useOccupancyData**: Cache occupancy data for 5 minutes
- **useExpiringContracts**: Cache for 1 minute (frequently updated)
- **useAccountManagersPerformance**: Cache for 5 minutes
- **useAllDashboardData**: Optimized batch fetching

### 4. Enhanced API Service Layer (`src/services/dashboardService.js`)

- **Automatic retry logic**: 3 retries with exponential backoff
- **Performance monitoring**: Track API call duration
- **Error handling**: Standardized error messages
- **Batch operations**: Fetch multiple data sources efficiently
- **Background prefetching**: Preload data for better UX

### 5. Advanced Error Handling (`src/utils/apiHelpers.js`)

- **Network error detection**: Handle offline scenarios
- **Auth error handling**: Automatic token refresh integration
- **Server error retry**: Retry on 5xx errors
- **Exponential backoff**: Prevent server overload
- **Jitter**: Add randomness to retry timing

### 6. Performance Monitoring (`src/utils/performanceMonitor.js`)

- **API call timing**: Track slow operations
- **Component render monitoring**: Detect performance bottlenecks
- **Metrics collection**: Generate performance reports
- **Cleanup strategies**: Prevent memory growth
- **Development insights**: Console warnings for slow operations

### 7. Enhanced UI Components

- **Loading states**: Skeleton loaders for better perceived performance
- **Error boundaries**: Graceful error handling with retry options
- **Refresh controls**: Manual refresh buttons with loading indicators
- **Background refresh**: Visual indicators when data is being updated
- **Optimistic updates**: Show cached data while fetching fresh data

### 8. Dashboard Context Provider (`src/context/DashboardContext.jsx`)

- **Global state management**: Centralized dashboard state
- **Prefetching strategy**: Load data before user needs it
- **Visibility change handling**: Refresh when user returns to tab
- **Resource cleanup**: Proper memory management

## Performance Improvements

### Caching Strategy

- **Dashboard Stats**: 2-minute cache, 5-minute refresh interval
- **Charts Data**: 3-5 minute cache, 10-15 minute refresh intervals
- **Critical Data**: 1-minute cache for frequently changing data
- **Background Refresh**: Data updates without blocking UI

### API Optimization

- **Parallel Requests**: Fetch multiple data sources simultaneously
- **Request Deduplication**: Prevent duplicate API calls
- **Retry Logic**: Automatic recovery from temporary failures
- **Connection Pooling**: Reuse HTTP connections via axios

### Memory Management

- **Cache Size Limits**: Prevent unlimited memory growth
- **Automatic Cleanup**: Remove expired entries
- **Timer Management**: Proper cleanup on component unmount
- **localStorage Fallback**: Persistent cache across sessions

## User Experience Improvements

### Loading States

- **Skeleton Loaders**: Better perceived performance
- **Progressive Loading**: Show cached data first, update with fresh data
- **Loading Indicators**: Clear feedback during operations
- **Error Recovery**: Easy retry mechanisms

### Data Freshness

- **Stale-While-Revalidate**: Always show something to the user
- **Background Updates**: Refresh data without interrupting workflow
- **Manual Refresh**: User-controlled data updates
- **Visual Indicators**: Show when data is being refreshed

### Error Handling

- **Graceful Degradation**: Continue working with cached data
- **Clear Error Messages**: User-friendly error descriptions
- **Retry Options**: Easy recovery from errors
- **Offline Support**: Work with cached data when offline

## Implementation Details

### Cache Configuration

```javascript
// Dashboard Stats: Fast refresh for critical data
staleTime: 2 * 60 * 1000,     // 2 minutes
cacheTime: 10 * 60 * 1000,    // 10 minutes
refetchInterval: 5 * 60 * 1000 // 5 minutes

// Chart Data: Moderate refresh for visual data
staleTime: 3 * 60 * 1000,      // 3 minutes
cacheTime: 15 * 60 * 1000,     // 15 minutes
refetchInterval: 10 * 60 * 1000 // 10 minutes
```

### Retry Strategy

```javascript
maxRetries: 3,
baseDelay: 1000,
exponentialBackoff: true,
jitter: true
```

### Performance Thresholds

- **Slow Operation Warning**: > 1 second
- **Cache Size Limit**: 5MB
- **Memory Cache Cleanup**: > 100 entries
- **localStorage Cleanup**: 80% of size limit

## Best Practices Implemented

1. **Separation of Concerns**: API logic separated from UI components
2. **Error Boundaries**: Prevent entire app crashes
3. **Performance Monitoring**: Track and optimize slow operations
4. **Memory Management**: Prevent memory leaks
5. **User Experience**: Always show something to the user
6. **Resilience**: Handle network issues gracefully
7. **Maintainability**: Clean, documented code structure

## Usage Example

```javascript
// In a dashboard component
const {
  data: stats,
  loading,
  error,
  isRefetching,
  refetch,
} = useDashboardStats({
  onError: (error) => console.error("Stats error:", error),
  onSuccess: () => console.log("Stats loaded"),
});

// Manual refresh
const handleRefresh = () => refetch();

// Show loading state while maintaining UX
if (loading) return <StatsCardSkeleton />;
if (error) return <ErrorComponent error={error} onRetry={refetch} />;

// Show data with refresh indicator
return (
  <div className={isRefetching ? "opacity-75" : ""}>
    <StatsCards data={stats} />
  </div>
);
```

## Monitoring and Debugging

### Performance Metrics

- Access via `performanceMonitor.getMetrics()`
- Generate reports with `performanceMonitor.generateReport()`
- Monitor cache stats with `localStorageCache.getStats()`

### Development Tools

- Console warnings for slow operations
- Cache hit/miss logging
- Retry attempt logging
- Performance timing in dev tools

## Future Enhancements

1. **Service Worker**: Offline caching strategy
2. **WebSocket Integration**: Real-time data updates
3. **Intelligent Prefetching**: ML-based data prediction
4. **Compression**: Gzip/Brotli for large datasets
5. **CDN Integration**: Cache static chart data
6. **A/B Testing**: Optimize cache timings based on usage patterns
