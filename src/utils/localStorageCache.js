/**
 * Enhanced local storage cache utility with expiration and compression
 */

class LocalStorageCache {
  constructor(prefix = "wecare_cache_") {
    this.prefix = prefix;
    this.maxSize = 5 * 1024 * 1024; // 5MB limit
  }

  /**
   * Generate cache key with prefix
   */
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Set cache item with expiration
   */
  set(key, data, ttl = 5 * 60 * 1000) {
    // Default 5 minutes
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl,
        size: JSON.stringify(data).length,
      };

      const serialized = JSON.stringify(item);

      // Check if we're exceeding storage limits
      if (this.getStorageSize() + serialized.length > this.maxSize) {
        this.cleanup();
      }

      localStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (error) {
      console.warn("Failed to cache data:", error);
      return false;
    }
  }

  /**
   * Get cache item if not expired
   */
  get(key) {
    try {
      const serialized = localStorage.getItem(this.getKey(key));
      if (!serialized) return null;

      const item = JSON.parse(serialized);
      const isExpired = Date.now() - item.timestamp > item.ttl;

      if (isExpired) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn("Failed to retrieve cached data:", error);
      this.remove(key);
      return null;
    }
  }

  /**
   * Check if cache item exists and is not stale
   */
  isStale(key, staleTime = 30 * 1000) {
    // Default 30 seconds
    try {
      const serialized = localStorage.getItem(this.getKey(key));
      if (!serialized) return true;

      const item = JSON.parse(serialized);
      return Date.now() - item.timestamp > staleTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Remove cache item
   */
  remove(key) {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.warn("Failed to remove cached data:", error);
      return false;
    }
  }

  /**
   * Clear all cache items with our prefix
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.warn("Failed to clear cache:", error);
      return false;
    }
  }

  /**
   * Get current storage size used by cache
   */
  getStorageSize() {
    try {
      const keys = Object.keys(localStorage);
      let size = 0;

      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          size += localStorage.getItem(key).length;
        }
      });

      return size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Cleanup expired items and enforce size limits
   */
  cleanup() {
    try {
      const keys = Object.keys(localStorage);
      const cacheItems = [];

      // Collect all cache items with metadata
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            const isExpired = Date.now() - item.timestamp > item.ttl;

            if (isExpired) {
              localStorage.removeItem(key);
            } else {
              cacheItems.push({
                key,
                timestamp: item.timestamp,
                size: item.size || 0,
              });
            }
          } catch (error) {
            // Remove corrupted items
            localStorage.removeItem(key);
          }
        }
      });

      // If still over limit, remove oldest items
      if (this.getStorageSize() > this.maxSize) {
        cacheItems.sort((a, b) => a.timestamp - b.timestamp);

        while (
          this.getStorageSize() > this.maxSize * 0.8 &&
          cacheItems.length > 0
        ) {
          const oldest = cacheItems.shift();
          localStorage.removeItem(oldest.key);
        }
      }
    } catch (error) {
      console.warn("Cache cleanup failed:", error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    try {
      const keys = Object.keys(localStorage);
      let count = 0;
      let size = 0;
      let expired = 0;

      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          count++;
          const itemSize = localStorage.getItem(key).length;
          size += itemSize;

          try {
            const item = JSON.parse(localStorage.getItem(key));
            const isExpired = Date.now() - item.timestamp > item.ttl;
            if (isExpired) expired++;
          } catch (error) {
            expired++;
          }
        }
      });

      return {
        count,
        size,
        expired,
        sizeFormatted: this.formatBytes(size),
      };
    } catch (error) {
      return { count: 0, size: 0, expired: 0, sizeFormatted: "0 B" };
    }
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Export singleton instance
export default new LocalStorageCache();
