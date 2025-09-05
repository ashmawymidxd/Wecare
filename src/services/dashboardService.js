import apiClient from "../utils/apiClient";
import performanceMonitor from "../utils/performanceMonitor";
import { withRetry } from "../utils/apiHelpers";

/**
 * Dashboard API service with optimized endpoints and error handling
 */
class DashboardService {
  constructor() {
    this.baseEndpoint = "/api";
  }

  /**
   * Fetch dashboard statistics
   */
  async getStats() {
    return withRetry(
      performanceMonitor.wrapApiCall(async () => {
        const response = await apiClient.get(`${this.baseEndpoint}/dashboard`);
        return response.data;
      }, "dashboard-stats"),
      {
        maxRetries: 3,
        onRetry: (error, attempt) => {
          console.log(
            `Retrying dashboard stats fetch, attempt ${attempt}:`,
            error.message
          );
        },
      }
    );
  }

  /**
   * Fetch chart data for dashboard
   */
  async getChartData() {
    return withRetry(
      performanceMonitor.wrapApiCall(async () => {
        const response = await apiClient.get(
          `${this.baseEndpoint}/dashboardCharts`
        );
        return response.data;
      }, "dashboard-charts"),
      {
        maxRetries: 3,
        onRetry: (error, attempt) => {
          console.log(
            `Retrying chart data fetch, attempt ${attempt}:`,
            error.message
          );
        },
      }
    );
  }

  /**
   * Fetch revenue statistics
   */
  async getRevenueStats() {
    return withRetry(
      performanceMonitor.wrapApiCall(async () => {
        const response = await apiClient.get(
          `${this.baseEndpoint}/dashboardCharts`
        );
        return response.data.revenue_stats;
      }, "revenue-stats"),
      {
        maxRetries: 2,
        onRetry: (error, attempt) => {
          console.log(
            `Retrying revenue stats fetch, attempt ${attempt}:`,
            error.message
          );
        },
      }
    );
  }

  /**
   * Fetch sources activity data
   */
  async getSourcesActivity() {
    return withRetry(
      performanceMonitor.wrapApiCall(async () => {
        const response = await apiClient.get(
          `${this.baseEndpoint}/dashboardCharts`
        );
        return response.data.sources_activity;
      }, "sources-activity"),
      {
        maxRetries: 2,
        onRetry: (error, attempt) => {
          console.log(
            `Retrying sources activity fetch, attempt ${attempt}:`,
            error.message
          );
        },
      }
    );
  }

  /**
   * Fetch occupancy data
   */
  async getOccupancyData() {
    return withRetry(
      performanceMonitor.wrapApiCall(async () => {
        const response = await apiClient.get(
          `${this.baseEndpoint}/dashboardCharts`
        );
        return response.data.occupancy_stats;
      }, "occupancy-data"),
      {
        maxRetries: 2,
        onRetry: (error, attempt) => {
          console.log(
            `Retrying occupancy data fetch, attempt ${attempt}:`,
            error.message
          );
        },
      }
    );
  }

  /**
   * Fetch expiring contracts
   */
  async getExpiringContracts() {
    return withRetry(
      performanceMonitor.wrapApiCall(async () => {
        const response = await apiClient.get(
          `${this.baseEndpoint}/dashboard/expiring-contracts`
        );
        return response.data;
      }, "expiring-contracts"),
      {
        maxRetries: 2,
        onRetry: (error, attempt) => {
          console.log(
            `Retrying expiring contracts fetch, attempt ${attempt}:`,
            error.message
          );
        },
      }
    );
  }

  /**
   * Fetch account managers performance
   */
  async getAccountManagersPerformance() {
    return withRetry(
      performanceMonitor.wrapApiCall(async () => {
        const response = await apiClient.get(
          `${this.baseEndpoint}/dashboard/account-managers`
        );
        return response.data;
      }, "account-managers-performance"),
      {
        maxRetries: 2,
        onRetry: (error, attempt) => {
          console.log(
            `Retrying account managers performance fetch, attempt ${attempt}:`,
            error.message
          );
        },
      }
    );
  }

  /**
   * Fetch all dashboard data in a single optimized call
   */
  async getAllDashboardData() {
    return withRetry(
      performanceMonitor.wrapApiCall(async () => {
        const [stats, charts] = await Promise.all([
          this.getStats(),
          this.getChartData(),
        ]);

        return {
          stats,
          charts,
          timestamp: Date.now(),
        };
      }, "all-dashboard-data"),
      {
        maxRetries: 2,
        onRetry: (error, attempt) => {
          console.log(
            `Retrying all dashboard data fetch, attempt ${attempt}:`,
            error.message
          );
        },
      }
    );
  }

  /**
   * Prefetch dashboard data for better performance
   */
  async prefetchDashboardData() {
    try {
      // Prefetch in background without throwing errors
      await this.getAllDashboardData();
    } catch (error) {
      console.warn("Prefetch failed:", error);
    }
  }
}

// Export singleton instance
export default new DashboardService();
