import {
  InformationCircleIcon,
  UserPlusIcon,
  UsersIcon,
  Square2StackIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import config from "../../config";
import { useEffect, useState } from "react";

const ReportStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${config.apiBaseUrl}api/orderClients`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white overflow-hidden border border-gray-200 rounded-lg p-5"
          >
            <div className="text-red-500">Error: {error}</div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats && !loading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white overflow-hidden border border-gray-200 rounded-lg p-5"
          >
            <div>No stats available</div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      id: 1,
      name: "Total Clients",
      value: stats?.total_clients?.total || 0,
      icon: UsersIcon,
      change: stats?.total_clients?.percentage_change || "0%",
      bgColor: "#fcfcfc",
    },
    {
      id: 2,
      name: "New Customers",
      value: stats?.new_clients?.count || 0,
      icon: UserPlusIcon,
      change: stats?.new_clients?.percentage_change || "0%",
      bgColor: "#fcfcfc",
    },
    {
      id: 3,
      name: "New Orders",
      value: stats?.new_orders?.count || 0,
      icon: Square2StackIcon,
      change: stats?.new_orders?.percentage_change || "0%",
      bgColor: "#ecf3fa",
    },
    {
      id: 4,
      name: "Pending Orders",
      value: stats?.pending_orders?.count || 0,
      icon: CurrencyDollarIcon,
      change: stats?.pending_orders?.percentage_change || "0%",
      bgColor: "#e8f7e8",
    },
    {
      id: 5,
      name: "New Sources",
      value: stats?.new_sources?.count || 0,
      icon: ArrowPathIcon,
      change: stats?.new_sources?.percentage_change || "0%",
      bgColor: "#e0f3fb",
    },
    {
      id: 6,
      name: "Enquiries",
      value: stats?.enquiries?.count || 0,
      icon: InformationCircleIcon,
      change: stats?.enquiries?.percentage_change || "0%",
      bgColor: "#fbe0e0",
    },
  ];

  return (
    <div className="mt-5">
      <h3 className="font-semibold text-lg">Orders & Clients</h3>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [...Array(6)].map((_, i) => (
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
                className="bg-white overflow-hidden border border-gray-200 rounded-lg"
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

export default ReportStats;
