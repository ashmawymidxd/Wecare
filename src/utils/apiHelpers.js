/**
 * Enhanced error handling utilities for API calls
 */

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const isNetworkError = (error) => {
  return (
    !error.status || error.status === 0 || error.message === "Network Error"
  );
};

export const isAuthError = (error) => {
  return error.status === 401;
};

export const isServerError = (error) => {
  return error.status >= 500;
};

export const getErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return "Network connection failed. Please check your internet connection.";
  }

  if (isAuthError(error)) {
    return "Authentication failed. Please log in again.";
  }

  if (isServerError(error)) {
    return "Server error occurred. Please try again later.";
  }

  return error.message || "An unexpected error occurred.";
};

export const shouldRetry = (error, attemptNumber, maxRetries = 3) => {
  if (attemptNumber >= maxRetries) {
    return false;
  }

  // Don't retry auth errors
  if (isAuthError(error)) {
    return false;
  }

  // Retry network errors and server errors
  return isNetworkError(error) || isServerError(error);
};

export const getRetryDelay = (attemptNumber, baseDelay = 1000) => {
  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attemptNumber - 1);
  const jitter = Math.random() * 0.1 * exponentialDelay;
  return exponentialDelay + jitter;
};

/**
 * Wrapper for API calls with automatic retry logic
 */
export const withRetry = async (apiCall, options = {}) => {
  const { maxRetries = 3, baseDelay = 1000, onRetry } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      if (!shouldRetry(error, attempt, maxRetries)) {
        break;
      }

      if (onRetry) {
        onRetry(error, attempt, maxRetries);
      }

      const delay = getRetryDelay(attempt, baseDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Debounce function for API calls
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for API calls
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
