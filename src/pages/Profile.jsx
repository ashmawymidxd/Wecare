import { useState } from "react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Button, Input, Select } from "antd";
import { useAuth } from "../context/AuthContext";
const tabs = [
  { label: "Profile", icon: <UserCircleIcon className="w-5 h-5" /> },
  { label: "General Settings", icon: <Cog6ToothIcon className="w-5 h-5" /> },
  { label: "Roles", icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
  { label: "Notifications", icon: <BellIcon className="w-5 h-5" /> },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  return (
    <div>
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:bg-gray-100 p-1 rounded-md text-gray-400">
          Home
        </Link>
        / <span className="text-gray-900">Settings</span>
      </div>

      <div className="flex justify-between items-center my-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Settings
        </h1>
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      <p className="text-gray-500 mb-6">Key Responsibilities and Duties</p>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Mobile Menu Button */}

        {/* Sidebar - Now responsive */}
        <div
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } md:block w-full md:w-1/4 lg:w-1/5 mb-4 md:mb-0`}
        >
          <div className="flex flex-col gap-2 bg-white md:bg-transparent p-2 md:p-0 rounded-lg shadow-md md:shadow-none">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.label);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-md text-left ${
                  activeTab === tab.label
                    ? "bg-yellow-50 text-yellow-500 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical divider - hidden on mobile */}
        <div className="hidden md:block border-l border-gray-200"></div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "Profile" && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Profile</h2>
              <p className="text-gray-500 mb-4 md:mb-6">
                A Quick Look at Your Profile and What You Do
              </p>
              <h2 className="text-lg font-semibold mb-1">Profile Picture</h2>

              {/* Profile Picture */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <img
                  src={user?.employee.profile_image}
                  alt="Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                />
                <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
                  <Button type="primary" className="bg-yellow-500 border-none">
                    Change Picture
                  </Button>
                  <Button className="hidden sm:inline-block">
                    Delete Picture
                  </Button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-1">Basic Info</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Your Personal Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col items-start gap-3">
                    <label className="font-semibold text-sm">Name</label>
                    <Input placeholder={user?.employee.name} />
                  </div>
                  <div className="flex flex-col items-start gap-3 w-100">
                    <label className="font-semibold text-sm">Nationality</label>
                    <Input placeholder={user?.employee.nationality} />
                  </div>
                  <div className="flex flex-col items-start gap-3 w-100">
                    <label className="font-semibold text-sm">
                      Preferred Language
                    </label>
                    <Input
                      placeholder={user?.employee.preferred_language}
                      readOnly
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <div className="flex flex-col items-start gap-3 w-100">
                      <label className="font-semibold text-sm">Mobile</label>
                      <Input
                        addonBefore={
                          <Select
                            defaultValue="Co."
                            options={[{ value: "Co.", label: "Co." }]}
                            className="w-20"
                          />
                        }
                        placeholder={user?.employee.mobile}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 w-100">
                    <label className="font-semibold text-sm">Email</label>
                    <Input placeholder={user?.employee.email} />
                  </div>
                  <div className="flex flex-col items-start gap-3 w-100">
                    <label className="font-semibold text-sm">Address</label>
                    <Input placeholder={user?.employee.address} />
                  </div>
                </div>
              </div>

              {/* Contract Info */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-1">
                  Contract & Financial Info
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  Contract and Financial Details
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col items-start gap-3">
                  <label className="font-semibold text-sm">
                    Contract Start Date
                  </label>
                  <Input placeholder={user?.employee.contract_start_date} />
                </div>
                <div className="flex flex-col items-start gap-3">
                  <label className="font-semibold text-sm">
                    Contract End Date
                  </label>
                  <Input placeholder={user?.employee.contract_end_date} />
                </div>
                <div className="flex flex-col items-start gap-3">
                  <label className="font-semibold text-sm">Salary</label>
                  <Input placeholder={user?.employee.salary + "AED"} />
                </div>
                <div className="flex flex-col items-start gap-3">
                  <label className="font-semibold text-sm">Role</label>
                  <Input placeholder={user?.employee.role.name} readOnly />
                </div>
              </div>
              <h3 className="font-medium text-gray-700 mb-1 mt-10">Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  htmlFor="client_id_document"
                  className="bg-gray-50 p-3 flex items-center justify-center rounded-md border border-dashed border-gray-200 cursor-pointer"
                >
                  <DocumentTextIcon className="w-5 h-5" /> Client ID*
                </label>
                <div className="hidden">
                  <input
                    type="file"
                    name="client_id_document"
                    id="client_id_document"
                    className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx"
                  />
                </div>

                <label
                  htmlFor="company_license_document"
                  className="bg-gray-50 p-3 flex items-center justify-center rounded-md border border-dashed border-gray-200 cursor-pointer"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  Company License*
                </label>
                <div className="hidden">
                  <input
                    type="file"
                    name="company_license_document"
                    id="company_license_document"
                    className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx"
                  />
                </div>
                <label
                  htmlFor="other_documents"
                  className="bg-gray-50 p-3 flex items-center justify-center rounded-md border border-dashed border-gray-200 cursor-pointer"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  Other Documents*
                </label>

                <div className="hidden">
                  <input
                    type="file"
                    name="other_documents"
                    id="other_documents"
                    className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "General Settings" && (
            <div>
              <h2 className="text-lg font-semibold">General Settings</h2>
              <p className="text-gray-500">
                Coming soon or add your content here.
              </p>
            </div>
          )}

          {activeTab === "Roles" && (
            <div>
              <h2 className="text-lg font-semibold">Roles</h2>
              <p className="text-gray-500">
                User roles and permissions settings.
              </p>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="text-gray-500">
                Manage your notification preferences.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
