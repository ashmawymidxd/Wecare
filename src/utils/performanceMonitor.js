/**
 * Performance monitoring utility for dashboard components
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.enabled = true;
  }

  /**
   * Start timing an operation
   */
  startTiming(key) {
    if (!this.enabled) return;

    this.metrics.set(key, {
      startTime: performance.now(),
      endTime: null,
      duration: null,
      timestamp: Date.now(),
    });
  }

  /**
   * End timing an operation
   */
  endTiming(key) {
    if (!this.enabled) return;

    const metric = this.metrics.get(key);
    if (!metric) return;

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    this.metrics.set(key, metric);

    // Log slow operations
    if (metric.duration > 1000) {
      // Over 1 second
      console.warn(
        `Slow operation detected: ${key} took ${metric.duration.toFixed(2)}ms`
      );
    }

    return metric.duration;
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const results = {};

    this.metrics.forEach((metric, key) => {
      if (metric.duration !== null) {
        results[key] = {
          duration: metric.duration,
          timestamp: metric.timestamp,
          formatted: `${metric.duration.toFixed(2)}ms`,
        };
      }
    });

    return results;
  }

  /**
   * Clear old metrics (keep last 100)
   */
  cleanup() {
    if (this.metrics.size > 100) {
      const entries = Array.from(this.metrics.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);

      this.metrics.clear();
      entries.slice(0, 100).forEach(([key, value]) => {
        this.metrics.set(key, value);
      });
    }
  }

  /**
   * Get average duration for an operation
   */
  getAverageDuration(operationPrefix) {
    const relevantMetrics = [];

    this.metrics.forEach((metric, key) => {
      if (key.startsWith(operationPrefix) && metric.duration !== null) {
        relevantMetrics.push(metric.duration);
      }
    });

    if (relevantMetrics.length === 0) return null;

    const sum = relevantMetrics.reduce((acc, duration) => acc + duration, 0);
    return sum / relevantMetrics.length;
  }

  /**
   * Monitor React component render performance
   * Note: This method should be implemented in a .jsx file if needed
   */
  measureComponentRender(componentName) {
    this.startTiming(`${componentName}-render`);
    return () => {
      this.endTiming(`${componentName}-render`);
    };
  }  /**
   * Monitor API call performance
   */
  wrapApiCall(apiFunction, operationName) {
    return async (...args) => {
      this.startTiming(`api-${operationName}`);

      try {
        const result = await apiFunction(...args);
        this.endTiming(`api-${operationName}`);
        return result;
      } catch (error) {
        this.endTiming(`api-${operationName}`);
        throw error;
      }
    };
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const metrics = this.getMetrics();
    const report = {
      totalOperations: Object.keys(metrics).length,
      apiCalls: {},
      components: {},
      slowOperations: [],
    };

    Object.entries(metrics).forEach(([key, metric]) => {
      if (key.startsWith("api-")) {
        const apiName = key.replace("api-", "");
        report.apiCalls[apiName] = metric;
      } else if (key.endsWith("-render")) {
        const componentName = key.replace("-render", "");
        report.components[componentName] = metric;
      }

      if (metric.duration > 1000) {
        report.slowOperations.push({ operation: key, ...metric });
      }
    });

    return report;
  }
}

// Export singleton instance
const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for using performance monitor
 */
export const usePerformanceMonitor = () => {
  return performanceMonitor;
};

/**
 * Utility for measuring component render performance
 * Usage: const cleanup = measureComponentPerformance('ComponentName');
 * Call cleanup() when component unmounts
 */
export const measureComponentPerformance = (componentName) => {
  return performanceMonitor.measureComponentRender(componentName);
};

export default performanceMonitor;
