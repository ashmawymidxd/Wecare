import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Layouts/Sidebar";
import Header from "./components/Layouts/Header";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Customer from "./pages/Customer";
import Createcustomer from "./pages/Createcustomer";
import CreateInquiries from "./pages/CreateInquiries";
import CreateSource from "./pages/CreateSource";
import Inquiries from "./pages/Customers/Inquiries";
import Inquirie from "./pages/Customers/Inquirie";
import Contracts from "./pages/Contracts";
import Branches from "./pages/Branches";
import Sources from "./pages/Sources";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";
import Info from "./pages/Info";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound"; 
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Define routes where header and sidebar should be hidden
  const hideLayoutRoutes = ["/login"];

  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar - only show if not on login page and user is authenticated */}
        {!shouldHideLayout && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - only show if not on login page and user is authenticated */}
          {!shouldHideLayout && (
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}

          {/* Main content */}
          <main
            className={`flex-1 p-2 rounded-xl overflow-x-hidden overflow-y-auto ${
              shouldHideLayout ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div
              className={`${
                shouldHideLayout ? "" : "container mx-auto px-4 py-6"
              }`}
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customer/:id" element={<Customer />} />
                  <Route path="/createcustomer" element={<Createcustomer />} />
                  <Route path="/createInquiries" element={<CreateInquiries />} />
                  <Route path="/createSource" element={<CreateSource />} />
                  <Route path="/inquiries" element={<Inquiries />} />
                  <Route path="/inquirie/:id" element={<Inquirie />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/branches" element={<Branches />} />
                  <Route path="/sources" element={<Sources />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/activity-log" element={<ActivityLog />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/info" element={<Info />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/notifications" element={<Notifications />} />
                </Route>
                <Route path="*" element={<NotFound />} /> {/* ✅ This line */}
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
