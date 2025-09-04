import {
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  BellIcon,
  LinkIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import config from "../config";
function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [tabs, setTabs] = useState([
    { name: "All", count: 0 },
    { name: "Employees", count: 0 },
    { name: "Contracts", count: 0 },
    { name: "Sources", count: 0 },
    { name: "Customers", count: 0 },
  ]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${config.apiBaseUrl}api/logs`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setActivities(data);

        // Dynamically compute tab counts
        const updatedTabs = [
          { name: "All", count: data.length },
          { name: "Employees", count: data.filter((a) => a.type === "Employees").length },
          { name: "Contracts", count: data.filter((a) => a.type === "Contracts").length },
          { name: "Sources", count: data.filter((a) => a.type === "Sources").length },
          { name: "Customers", count: data.filter((a) => a.type === "Customers").length },
        ];

        setTabs(updatedTabs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const matchesTab = activeTab === "All" || activity.type === activeTab;
    const matchesSearch = activity.message
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getIconForType = (type) => {
    switch (type) {
      case "Contracts":
        return { icon: ClockIcon, color: "bg-yellow-100 text-yellow-600" };
      case "Employees":
        return { icon: CheckCircleIcon, color: "bg-green-100 text-green-600" };
      case "Sources":
        return { icon: BellIcon, color: "bg-blue-100 text-blue-600" };
      case "Customers":
        return { icon: LinkIcon, color: "bg-purple-100 text-purple-600" };
      default:
        return {
          icon: CloudArrowUpIcon,
          color: "bg-indigo-100 text-indigo-600",
        };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const SkeletonLoader = () => {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-start p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-6 mx-auto">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:bg-gray-100 p-1 rounded-md text-gray-400">
          Home
        </Link>
        / <span className="text-gray-900">Activity Log</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 my-6">Activity Log</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === tab.name
                ? "border-yellow-500 text-yellow-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.name}
            {loading ? (
              <span className="ml-2 inline-block h-4 w-4 bg-gray-200 rounded-full animate-pulse"></span>
            ) : (
              <span className="ml-2 text-gray-600">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
          placeholder="Search activities"
          disabled={loading}
        />
      </div>

      {/* Activity List */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => {
              const { icon: IconComponent, color } = getIconForType(
                activity.type
              );
              return (
                <div
                  key={activity.id}
                  className="flex items-start p-4 bg-white rounded-lg"
                >
                  <div
                    className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${color}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No activities found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ActivityLog;
