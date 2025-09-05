import { useEffect } from "react";
import PropTypes from "prop-types";
import { DashboardContext } from "./dashboardContextUtils";
import { useDashboardPrefetch } from "../hooks/useDashboard";

const DashboardProvider = ({ children }) => {
  const { prefetch } = useDashboardPrefetch();

  // Prefetch dashboard data when the provider mounts
  useEffect(() => {
    const prefetchData = async () => {
      try {
        await prefetch();
        console.log("Dashboard data prefetched successfully");
      } catch (error) {
        console.warn("Dashboard prefetch failed:", error);
      }
    };

    prefetchData();
  }, [prefetch]);

  // Prefetch data when user returns to the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        prefetch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [prefetch]);

  const value = {
    prefetch,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardProvider;
