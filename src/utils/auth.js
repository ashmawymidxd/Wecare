import config from "../config";

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Decode JWT token to get payload
export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Check if token is expired or will expire soon (within 5 minutes)
export const isTokenExpiring = (token, bufferMinutes = 5) => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  const expirationTime = decoded.exp;
  const bufferTime = bufferMinutes * 60; // Convert minutes to seconds

  return expirationTime - currentTime <= bufferTime;
};

export const authHeader = () => {
  const token = getAuthToken();

  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const refreshToken = async () => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No token available for refresh");
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();

    // Update the stored token
    localStorage.setItem("authToken", data.access_token);

    return data.access_token;
  } catch (error) {
    // If refresh fails, clear the token and redirect to login
    localStorage.removeItem("authToken");
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  // Redirect to login page with full page reload to clear all state
  window.location.href = "/login";
};
