import { useEffect, useState } from "react";
import config from "../../config";

function SourcesActivity() {
  const [sourceData, setSourceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${config.apiBaseUrl}api/contract`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSourceData(data.source[0]);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching source data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSourceData();
  }, []);

  // Function to get appropriate icon based on source type
  const getSourceIcon = (sourceType) => {
    switch (sourceType) {
      case "Tasheel":
        return "/sources/tasheel.png";
      case "Typing Center":
        return "/sources/typing-center.png";
      case "PRO":
        return "/sources/pros.png";
      case "Social Media":
        return "/sources/social-media.png";
      case "Referral":
        return "/sources/referral.png";
      case "Inactive":
        return "/sources/inactive.png";
      default:
         return "/sources/pros.png";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col p-5 mt-6 h-[300px] overflow-y-scroll">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">Sources Activity</h2>
        <select name="" id="">
          <option value="">March</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-3 mt-5">
        <h2 className="font-semibold">Source</h2>
        <h2 className="font-semibold">New Clients</h2>
        <h2 className="font-semibold">New Contracts</h2>
      </div>

      {error && (
        <div className="text-red-500 p-3">Error loading data: {error}</div>
      )}

      {loading
        ? // Skeleton loading placeholders
          [...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b p-3"
            >
              <div className="flex items-center gap-2 w-full">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-6"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-6"></div>
            </div>
          ))
        : // Actual data
          sourceData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b p-3 hover:bg-gray-100 duration-300"
            >
              <div className="flex items-center gap-2  w-1/3">
                <div className="w-8 h-8 bg-slate-100 rounded-full">
                  <img
                    src={getSourceIcon(item.source_type)}
                    alt={item.source_type || "Unknown source"}
                    className="w-6 h-6 mx-auto mt-1"
                  />
                </div>
                <p>{item.source_type || "Unknown"}</p>
              </div>
              <p className="w-1/3 text-center">+{item.customer_count}</p>
              <p className="w-1/3 text-end">{item.contract_count}</p>
            </div>
          ))}
    </div>
  );
}

export default SourcesActivity;
