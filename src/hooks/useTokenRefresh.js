import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { refreshToken as refreshTokenUtil } from "../utils/auth";

export const useTokenRefresh = () => {
  const { setUser, setError } = useAuth();

  const refreshToken = useCallback(async () => {
    try {
      const newToken = await refreshTokenUtil();
      return newToken;
    } catch (error) {
      setUser(null);
      setError("Session expired. Please login again.");
      throw error;
    }
  }, [setUser, setError]);

  return { refreshToken };
};
