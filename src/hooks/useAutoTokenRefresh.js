import { useEffect, useCallback, useRef } from "react";
import { getAuthToken, isTokenExpiring, refreshToken } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

export const useAutoTokenRefresh = () => {
  const { logout } = useAuth();
  const intervalRef = useRef(null);

  const checkAndRefreshToken = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    if (isTokenExpiring(token)) {
      try {
        await refreshToken();
        console.log("Token refreshed automatically");
      } catch (error) {
        console.error("Failed to refresh token:", error);
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    // Check immediately on mount
    checkAndRefreshToken();

    // Set up interval to check every 4 minutes
    intervalRef.current = setInterval(checkAndRefreshToken, 4 * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkAndRefreshToken]);

  return { checkAndRefreshToken };
};
