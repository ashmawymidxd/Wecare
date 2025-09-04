import { useState } from "react";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import LanguageSelector from "../LanguageSelector";
import UserDropdown from "../UserDropdown";
import NotificationDropdown from "../NotificationDropdown";
import { useAuth } from "../../context/AuthContext";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();
  return (
    <header className="bg-white border-b border-gray-100 z-20">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Middle section - User name */}
        <div className="hidden md:flex items-center gap-5">
          {/* Additional toggle button for desktop when sidebar is collapsed */}
          <button
            type="button"
            className="menu-toggle-button hidden md:block p-2 text-gray-900 rounded-md ml-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="">
            <p className="text-gray-700">Hey,</p>
            <span className="text-gray-900 font-bold">
              {user?.employee.name} 👋
            </span>
          </div>
        </div>
        {/* Left section */}
        <div className="flex items-center">
          <button
            type="button"
            className="menu-toggle-button p-2 text-gray-500 rounded-md md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Search bar - hidden on mobile unless clicked */}
          <div className={`${searchOpen ? "block" : "hidden"} md:block ml-4`}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full md:w-80 pl-10 pr-4 py-2 rounded-xl border-gray-300 focus:outline-none bg-gray-50"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Search button for mobile */}
          <button
            className="md:hidden p-2 text-gray-500 rounded-md"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>

          {/* Language selector */}
          <LanguageSelector />

          {/* Notifications */}
          <NotificationDropdown />

          {/* User dropdown */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
