import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserIcon,
  IdentificationIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const tabs = ["All", "New", "Active", "Inactive"];

const customersData = [
  {
    id: "KD–141629",
    name: "Talal Mohammed Ahmadini",
    phone: "+971553767199",
    company: "Louis Vuitton",
    office: "CID–230",
    manager: "Hessa Khalfan",
    status: "New",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "KD–141630",
    name: "Sara Ali",
    phone: "+971555000000",
    company: "Apple Inc",
    office: "CID–231",
    manager: "Mohammed Khaled",
    status: "Active",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "KD–141631",
    name: "Omar Fathi",
    phone: "+971554444444",
    company: "Google LLC",
    office: "CID–232",
    manager: "Layla Noor",
    status: "Inactive",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "KD–141632",
    name: "Huda Nabil",
    phone: "+971553333333",
    company: "Tesla Inc",
    office: "CID–233",
    manager: "Aisha Youssef",
    status: "Active",
    avatar: "https://via.placeholder.com/40",
  },
];

function Customers() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filteredData = customersData.filter((c) => {
    const matchTab = activeTab === "All" || c.status === activeTab;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const getStatusIcon = (status) => {
    if (status === "Active")
      return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
    if (status === "New")
      return <ExclamationCircleIcon className="w-4 h-4 text-yellow-500" />;
    if (status === "Inactive")
      return <XCircleIcon className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:bg-gray-100 p-1 rounded-md">
            Home
          </Link>/ Customers
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {tabs.map((tab) => {
          const count = customersData.filter((c) =>
            tab === "All" ? true : c.status === tab
          ).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? "border-yellow-400 text-yellow-600"
                  : "border-transparent text-gray-600"
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="relative w-full md:w-1/3">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert("Add customer")}
            className="flex items-center gap-1 px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Add Customer
          </button>
          <button
            onClick={() => alert("Filter clicked")}
            className="flex items-center gap-1 px-4 py-1 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            Filter
          </button>
          <button
            onClick={() => alert("Exporting...")}
            className="flex items-center gap-1 px-4 py-1 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">
                <input type="checkbox" />
              </th>
              <th className="p-2 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <IdentificationIcon className="w-4 h-4" />
                  ID
                </div>
              </th>
              <th className="p-2 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <UserIcon className="w-4 h-4" />
                  Client
                </div>
              </th>
              <th className="p-2 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <BuildingOffice2Icon className="w-4 h-4" />
                  Company Name
                </div>
              </th>
              <th className="p-2 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <MapPinIcon className="w-4 h-4" />
                  Office No.
                </div>
              </th>
              <th className="p-2 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <UserCircleIcon className="w-4 h-4" />
                  Account Manager
                </div>
              </th>
              <th className="p-2 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <ArrowPathIcon className="w-4 h-4" />
                  Status
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y">
            {filteredData.map((customer) => (
              <tr key={customer.id}>
                <td className="p-2">
                  <input type="checkbox" />
                </td>
                <td className="p-2">{customer.id}</td>
                <td className="p-2 flex items-center gap-2">
                  <img
                    src={customer.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-gray-500 text-xs">
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="p-2">{customer.company}</td>
                <td className="p-2">{customer.office}</td>
                <td className="p-2">{customer.manager}</td>
                <td className="p-2 flex items-center gap-1 font-normal text-gray-400">
                  {getStatusIcon(customer.status)}
                  <span>{customer.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end p-3 border-t">
          <div className="flex items-center space-x-1 text-sm">
            <button className="px-2 py-1 border rounded bg-white text-gray-600">
              &lt;
            </button>
            <span className="px-3 py-1 border rounded bg-blue-50 text-blue-600">
              1
            </span>
            <button className="px-2 py-1 border rounded bg-white text-gray-600">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
