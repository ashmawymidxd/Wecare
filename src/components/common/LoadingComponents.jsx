import PropTypes from "prop-types";

/**
 * Skeleton loader for dashboard stats cards
 */
export const StatsCardSkeleton = () => (
  <div className="bg-white overflow-hidden border border-gray-200 rounded-lg animate-pulse">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="mt-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

/**
 * Skeleton loader for chart components
 */
export const ChartSkeleton = ({ title, icon: Icon }) => (
  <div className="flex flex-col p-6 h-full bg-white rounded-2xl border border-gray-200">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="rounded-full w-[40px] h-[40px] bg-gray-100 flex items-center justify-center">
          <Icon className="h-7 w-7 text-gray-400" />
        </div>
      )}
      <h3 className="text-[20px] font-medium text-gray-400">{title}</h3>
    </div>
    <div className="mt-4 h-[200px] w-full bg-gray-100 rounded-lg animate-pulse"></div>
  </div>
);

ChartSkeleton.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
};

/**
 * Error component with retry functionality
 */
export const ErrorComponent = ({
  error,
  onRetry,
  title = "Error",
  icon: Icon,
  isRetrying = false,
}) => (
  <div className="flex flex-col p-6 h-full bg-white rounded-2xl border border-red-200">
    <div className="flex items-center gap-3 mb-4">
      {Icon && (
        <div className="rounded-full w-[40px] h-[40px] bg-red-100 flex items-center justify-center">
          <Icon className="h-7 w-7 text-red-500" />
        </div>
      )}
      <h3 className="text-[20px] font-medium text-gray-900">{title}</h3>
    </div>
    <div className="flex-1 flex flex-col justify-center items-center text-center">
      <div className="text-red-500 mb-3">{error}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {isRetrying ? "Retrying..." : "Try Again"}
        </button>
      )}
    </div>
  </div>
);

ErrorComponent.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  title: PropTypes.string,
  icon: PropTypes.elementType,
  isRetrying: PropTypes.bool,
};

/**
 * No data component
 */
export const NoDataComponent = ({
  message = "No data available",
  onRefresh,
  title = "No Data",
  icon: Icon,
}) => (
  <div className="flex flex-col p-6 h-full bg-white rounded-2xl border border-gray-200">
    <div className="flex items-center gap-3 mb-4">
      {Icon && (
        <div className="rounded-full w-[40px] h-[40px] bg-gray-100 flex items-center justify-center">
          <Icon className="h-7 w-7 text-gray-400" />
        </div>
      )}
      <h3 className="text-[20px] font-medium text-gray-900">{title}</h3>
    </div>
    <div className="flex-1 flex flex-col justify-center items-center text-center">
      <div className="text-gray-500 mb-3">{message}</div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      )}
    </div>
  </div>
);

NoDataComponent.propTypes = {
  message: PropTypes.string,
  onRefresh: PropTypes.func,
  title: PropTypes.string,
  icon: PropTypes.elementType,
};

/**
 * Loading overlay for components that are refreshing
 */
export const LoadingOverlay = ({ isVisible, children }) => (
  <div className={`relative ${isVisible ? "opacity-75" : ""}`}>
    {children}
    {isVisible && (
      <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )}
  </div>
);

LoadingOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
