import {
  InformationCircleIcon,
  UserPlusIcon,
  Square2StackIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useDashboardStats } from "../../hooks/useDashboard";

const DashboardStats = () => {
  const {
    data: stats,
    loading,
    error,
    isRefetching,
    refetch,
  } = useDashboardStats({
    onError: (error) => {
      console.error("Dashboard stats error:", error);
    },
    onSuccess: () => {
      console.log("Dashboard stats loaded successfully");
    },
  });

  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Dashboard Statistics
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loading || isRefetching}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-4 w-4 mr-1 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white overflow-hidden border border-gray-200 rounded-lg p-5"
            >
              <div className="text-red-500">Error: {error}</div>
              <button
                onClick={handleRefresh}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                Try again
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats && !loading) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Dashboard Statistics
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loading || isRefetching}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-4 w-4 mr-1 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white overflow-hidden border border-gray-200 rounded-lg p-5"
            >
              <div>No stats available</div>
              <button
                onClick={handleRefresh}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                Retry
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      id: 1,
      name: "New Customers",
      value: stats?.new_customers?.count || 0,
      icon: UserPlusIcon,
      change: `${stats?.new_customers?.percentage_change >= 0 ? "+" : ""}${
        stats?.new_customers?.percentage_change || 0
      }%`,
      bgColor: "#fcfcfc",
    },
    {
      id: 2,
      name: "New Contracts",
      value: stats?.new_contracts?.count || 0,
      icon: Square2StackIcon,
      change: `${stats?.new_contracts?.percentage_change >= 0 ? "+" : ""}${
        stats?.new_contracts?.percentage_change || 0
      }%`,
      bgColor: "#ecf3fa",
    },
    {
      id: 3,
      name: "Income",
      value: `${stats?.income_stats?.amount || 0} AED`,
      icon: CurrencyDollarIcon,
      change: `${stats?.income_stats?.percentage_change >= 0 ? "+" : ""}${
        stats?.income_stats?.percentage_change || 0
      }%`,
      bgColor: "#e8f7e8",
    },
    {
      id: 4,
      name: "Renew Customers",
      value: `${stats?.renew_castomers?.count || 0} Customers`,
      icon: ArrowPathIcon,
      change: `${stats?.renew_castomers?.percentage_change >= 0 ? "+" : ""}${
        stats?.renew_castomers?.percentage_change || 0
      }%`,
      bgColor: "#e0f3fb",
    },
    {
      id: 5,
      name: "Expiring Contracts",
      value: `${stats?.expiring_contracts?.count || 0} Contracts`,
      icon: InformationCircleIcon,
      change: `${stats?.expiring_contracts?.percentage_change >= 0 ? "+" : ""}${
        stats?.expiring_contracts?.percentage_change || 0
      }%`,
      bgColor: "#fbe0e0",
    },
  ];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Dashboard Statistics
        </h2>
        <button
          onClick={handleRefresh}
          disabled={loading || isRefetching}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <ArrowPathIcon
            className={`h-4 w-4 mr-1 ${isRefetching ? "animate-spin" : ""}`}
          />
          {isRefetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white overflow-hidden border border-gray-200 rounded-lg animate-pulse"
              >
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
            ))
          : statCards.map((stat) => (
              <div
                key={stat.id}
                className={`bg-white overflow-hidden border border-gray-200 rounded-lg ${
                  isRefetching ? "opacity-75" : ""
                }`}
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon
                        className="h-10 w-10 text-gray-400 rounded-full p-2"
                        style={{ backgroundColor: stat.bgColor }}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <div className="text-xl font-medium text-gray-900 truncate">
                          {stat.name}
                        </div>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-3xl font-medium text-gray-900">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm mt-3">
                    <span
                      className={`font-medium px-2 py-1 rounded-md ${
                        stat.change.startsWith("+")
                          ? "text-[#10AE12] bg-[#c3eac3]"
                          : "text-[#FF0000] bg-[#fbe0e0]"
                      }`}
                    >
                      {stat.change}
                    </span>{" "}
                    <span className="text-gray-500">vs Last Month</span>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default DashboardStats;
