import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  HomeIcon,
  UsersIcon,
  UserIcon,
  UserCircleIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  LinkIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ClockIcon,
  CogIcon,
  InformationCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [customersOpen, setCustomersOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only run this on small screens (mobile)
      if (window.innerWidth < 768) {
        if (
          sidebarOpen &&
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target)
        ) {
          // Check if the click is not on the toggle button (menu icon)
          const menuIcon = document.querySelector(".menu-toggle-button");
          if (!menuIcon || !menuIcon.contains(event.target)) {
            setSidebarOpen(false);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, setSidebarOpen]);

  const navItems = [
    {
      name: "Dashboard",
      icon: HomeIcon,
      path: "/",
      current: location.pathname === "/",
    },
    {
      name: "Customers",
      icon: UsersIcon,
      path: "/customers",
      current: location.pathname === "/customers",
      subItems: [
        {
          name: "Customers",
          path: "/customers",
          current: location.pathname === "/customers",
          icon: UserIcon,
        },
        {
          name: "Inquiries",
          path: "/inquiries",
          current: location.pathname === "/inquiries",
          icon: UserCircleIcon,
        },
      ],
    },
    {
      name: "Contracts",
      icon: DocumentTextIcon,
      path: "/contracts",
      current: location.pathname === "/contracts",
    },
    {
      name: "Branches",
      icon: BuildingOfficeIcon,
      path: "/branches",
      current: location.pathname === "/branches",
    },
    {
      name: "Sources",
      icon: LinkIcon,
      path: "/sources",
      current: location.pathname === "/sources",
    },
    {
      name: "Employees",
      icon: BriefcaseIcon,
      path: "/employees",
      current: location.pathname === "/employees",
    },
    {
      name: "Reports",
      icon: ChartBarIcon,
      path: "/reports",
      current: location.pathname === "/reports",
    },
    {
      name: "Activity Log",
      icon: ClockIcon,
      path: "/activity-log",
      current: location.pathname === "/activity-log",
    },
    {
      name: "Settings",
      icon: CogIcon,
      path: "/settings",
      class: true,
      current: location.pathname === "/settings",
    },
  ];

  const bottomNavItems = [
    {
      name: "Info",
      icon: InformationCircleIcon,
      path: "/info",
      current: location.pathname === "/info",
      iconColor: "text-red-500",
    },
    {
      name: "Logout",
      icon: ArrowLeftOnRectangleIcon,
      path: "/login",
      current: location.pathname === "/login",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`${
        sidebarOpen
          ? "translate-x-0 w-64"
          : "-translate-x-full md:translate-x-0 md:w-20"
      } 
      transform fixed md:relative inset-y-0 left-0 bg-[#eee] 
      transition-all duration-200 ease-in-out z-30 border-r border-gray-100`}
    >
      <div className="flex items-center justify-start h-16 px-4 border-gray-200">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" width={30} height={30} />
          {sidebarOpen && (
            <span className="text-xl font-bold text-gray-800">WeCare</span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <div
            key={item.name}
            className="relative"
            onMouseEnter={() => !sidebarOpen && setHoveredItem(item.name)}
            onMouseLeave={() => !sidebarOpen && setHoveredItem(null)}
          >
            {item.subItems ? (
              <>
                <button
                  onClick={() => setCustomersOpen(!customersOpen)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md 
                    ${
                      item.current
                        ? "bg-gray-200 text-gray-600"
                        : "text-gray-600 hover:bg-gray-200"
                    }
                    ${!sidebarOpen ? "justify-center" : ""}`}
                >
                  <item.icon
                    className={`flex-shrink-0 w-6 h-6 ${
                      sidebarOpen ? "mr-3" : ""
                    }`}
                  />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      <svg
                        className={`h-5 w-5 transform ${
                          customersOpen ? "rotate-90" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </>
                  )}
                </button>

                {/* Expanded submenu (when sidebar is open) */}
                {sidebarOpen && customersOpen && (
                  <div className="text-center bg-gray-200 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className={`block px-3 py-2 text-sm font-medium rounded-md
                          ${
                            subItem.current
                              ? "bg-white text-gray-600"
                              : "text-gray-600 hover:bg-white"
                          }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <subItem.icon className="w-6 h-6" />
                          {subItem.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Tooltip submenu (when sidebar is collapsed) */}
                {!sidebarOpen && hoveredItem === item.name && (
                  <div className="absolute left-full ml-2 top-0 w-48 py-1 bg-white rounded-md shadow-lg z-50">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  item.class ? "mt-10" : ""
                }
                  ${
                    item.current
                      ? "bg-white text-gray-600"
                      : "text-gray-600 hover:bg-white"
                  }
                  ${!sidebarOpen ? "justify-center" : ""}`}
              >
                <item.icon className={`w-6 h-6 ${sidebarOpen ? "mr-3" : ""}`} />
                {sidebarOpen && <span>{item.name}</span>}
                {/* Tooltip for main items when collapsed */}
                {!sidebarOpen && hoveredItem === item.name && (
                  <div className="absolute left-full ml-2 px-3 py-1 bg-white rounded-md shadow-lg text-sm text-gray-700 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            )}
          </div>
        ))}

        {/* Bottom section with mt-10 and HR before logout */}
        <div>
          <hr className="border-gray-300 my-2" />
          {bottomNavItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => !sidebarOpen && setHoveredItem(item.name)}
              onMouseLeave={() => !sidebarOpen && setHoveredItem(null)}
            >
              <Link
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md 
                  ${
                    item.current
                      ? "bg-white text-gray-600"
                      : "text-gray-600 hover:bg-white"
                  }
                  ${!sidebarOpen ? "justify-center" : ""}`}
              >
                <item.icon
                  className={`w-6 h-6 ${sidebarOpen ? "mr-3" : ""} ${
                    item.iconColor
                  }`}
                />
                {sidebarOpen && <span>{item.name}</span>}
                {/* Tooltip for main items when collapsed */}
                {!sidebarOpen && hoveredItem === item.name && (
                  <div className="absolute left-full ml-2 px-3 py-1 bg-white rounded-md shadow-lg text-sm text-gray-700 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
