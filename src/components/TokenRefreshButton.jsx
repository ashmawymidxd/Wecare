import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const TokenRefreshButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");
  const { handleRefreshToken } = useAuth();

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage("");

    try {
      await handleRefreshToken();
      setRefreshMessage("Token refreshed successfully!");
    } catch (error) {
      setRefreshMessage("Failed to refresh token. Please login again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <button
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRefreshing ? "Refreshing..." : "Refresh Token"}
      </button>
      {refreshMessage && (
        <p
          className={`text-sm ${
            refreshMessage.includes("successfully")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {refreshMessage}
        </p>
      )}
    </div>
  );
};

export default TokenRefreshButton;
