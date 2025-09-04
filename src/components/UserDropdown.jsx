import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { logout } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    logout(); // Calls our auth utility logout function
    navigate("/login"); // Redirect to login page
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          {!imageLoaded && (
            <UserIcon className="h-5 w-5 text-gray-600" />
          )}
          {user?.employee.profile_image && (
            <img 
              src={user.employee.profile_image} 
              alt="profile" 
              onLoad={handleImageLoad}
              className={`${!imageLoaded ? 'hidden' : 'block'}`}
            />
          )}
        </div>
        {/* <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} /> */}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
          <div className="border-b border-gray-100">
            <div className="flex items-center px-4 py-2 gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-2">
                {!imageLoaded && (
                  <UserIcon className="h-5 w-5 text-gray-600" />
                )}
                {user?.employee.profile_image && (
                  <img 
                    src={user.employee.profile_image} 
                    alt="profile" 
                    onLoad={handleImageLoad}
                    className={`${!imageLoaded ? 'hidden' : 'block'}`}
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user?.employee.name}
                </span>
                <small className="text-gray-600">{user?.employee.email}</small>
              </div>
            </div>
          </div>
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
            Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-500" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;