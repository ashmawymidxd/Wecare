import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { refreshToken, getAuthToken, isTokenExpiring } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  const fetchUser = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get("api/auth/me");
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user data");
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle token refresh
  const handleRefreshToken = async () => {
    try {
      const newToken = await refreshToken();
      return newToken;
    } catch (error) {
      setUser(null);
      setError("Session expired. Please login again.");
      throw error;
    }
  };

  // Check and refresh token if needed
  const checkAndRefreshToken = async () => {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    if (isTokenExpiring(token)) {
      try {
        await handleRefreshToken();
        console.log("Token refreshed automatically");
      } catch (error) {
        console.error("Failed to refresh token:", error);
        logout();
      }
    }
  };

  // Login function
  const login = async (token) => {
    localStorage.setItem("authToken", token);
    await fetchUser();
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  // Check for user on initial load and setup auto refresh
  useEffect(() => {
    fetchUser();

    // Set up interval to check and refresh token every 4 minutes
    const interval = setInterval(checkAndRefreshToken, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        fetchUser,
        handleRefreshToken,
        checkAndRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
