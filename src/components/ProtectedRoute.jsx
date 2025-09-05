import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, isTokenExpiring, getAuthToken } from "../utils/auth";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { user, loading, checkAndRefreshToken } = useAuth();
  const location = useLocation();

  // Check and refresh token on route change if needed
  useEffect(() => {
    const token = getAuthToken();
    if (token && isTokenExpiring(token)) {
      checkAndRefreshToken();
    }
  }, [location.pathname, checkAndRefreshToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="p-6 flex justify-center items-center ">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
          <p className="mt-2 text-lg font-medium text-gray-700">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthenticated()) {
    // Redirect to login page, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
