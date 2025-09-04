import { Square2StackIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import config from "../../config"
export default function OccupancyChart({
  title = "Occupancy",
  label = "Of Private Offices Rented",
  color = "#DBA32C",
  bgColor,
  // Optional props to override API data
  value: propValue,
  loading: propLoading,
  error: propError,
}) {
  const [occupancyData, setOccupancyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iconBgColor = bgColor || `${color}20`;

  // Fetch data from API
  useEffect(() => {
    const fetchOccupancyData = async () => {
      try {
        // Skip API call if value is provided via props
        if (propValue !== undefined) return;

        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `${config.apiBaseUrl}api/dashboardCharts`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch occupancy data");
        }

        const data = await response.json();
        setOccupancyData(data.occupancy_rate);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOccupancyData();
  }, [propValue]);

  // Determine the value to display
  const getDisplayValue = () => {
    // Use prop value if provided
    if (propValue !== undefined) return propValue;
    // Use API data if available
    if (occupancyData) return occupancyData.value;
    // Default fallback
    return 0;
  };

  const value = getDisplayValue();
  const percentage = value / 100;
  const isLoading = propLoading !== undefined ? propLoading : loading;
  const hasError = propError !== undefined ? propError : error;

  if (isLoading) {
    return (
      <div className="flex flex-col p-4 sm:p-6 h-full bg-white rounded-2xl border border-gray-200 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-full max-w-[160px] h-[80px] bg-gray-100 rounded"></div>
          <div className="mt-4 space-y-2 text-center">
            <div className="h-6 w-16 bg-gray-200 mx-auto rounded"></div>
            <div className="h-4 w-32 bg-gray-100 mx-auto rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col p-4 sm:p-6 h-full bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-[20px] font-medium text-[var(--text-primary-color)]">
            {title}
          </h2>
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 text-red-500">
          <p>Error: {hasError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 sm:p-6 h-full bg-white rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-[20px] font-medium text-[var(--text-primary-color)]">
          {title}
        </h2>
        <div className="flex space-x-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <div className="relative w-full flex justify-center">
          <svg
            className="w-full max-w-[160px] h-auto"
            viewBox="0 0 210 110"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background track */}
            <path
              d="M 25 100 A 80 80 0 0 1 185 100"
              fill="none"
              stroke="#EAEAEA"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Colored track */}
            <path
              d="M 25 100 A 80 80 0 0 1 185 100"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 252} 252`}
            />
          </svg>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[20%] flex items-center justify-center">
            <div
              className="w-8 h-8 sm:w-[36px] sm:h-[36px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: iconBgColor }}
            >
              <Square2StackIcon className="h-7 w-7 text-red-300" />
            </div>
          </div>
        </div>

        <div className="text-center mt-3 sm:mt-4">
          <div className="text-xl sm:text-2xl font-bold" style={{ color }}>
            {value}%
          </div>
          <div className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
            {label}
          </div>
          <div className="mt-2 sm:mt-3">
            <button className="text-sm font-medium" style={{ color }}>
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

OccupancyChart.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  // Optional props to override API data
  value: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

OccupancyChart.defaultProps = {
  title: "Occupancy",
  label: "Of Private Offices Rented",
  color: "#DBA32C",
};
