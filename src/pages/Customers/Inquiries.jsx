import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config";
import {
  UserIcon,
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";

const tabs = ["All", "Active", "Inactive"];

function Inquiries() {
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${config.apiBaseUrl}api/inquiries`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Transform the API data to match our expected format
        const transformedData = data.map((item) => ({
          id: item.id,
          name: item.client.name,
          phone: item.client.phone,
          company: item.companyName,
          expectedContractAmount: item.expectedContractAmount,
          expectedDiscount: item.expectedDiscount,
          joiningDate: item.joiningDate,
          status: item.status,
          avatar: item.client.avatar || "https://via.placeholder.com/40",
        }));

        setCustomersData(transformedData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredData = customersData.filter((c) => {
    const matchTab = activeTab === "All" || c.status === activeTab;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = [
      "ID",
      "Name",
      "Phone",
      "Company",
      "expected Contract Amount",
      "expected Discount",
      "joining Date",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((customer) =>
        [
          customer.id,
          `"${customer.name}"`,
          customer.phone,
          `"${customer.company}"`,
          customer.office,
          `"${customer.manager}"`,
          customer.status,
        ].join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "customers.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      // Process the imported file here
      console.log("Imported file content:", event.target.result);
      // You would typically parse the file and update state or make API calls
      alert("File imported successfully. Processing would happen here.");
    };
    reader.readAsText(file);
  };

  const handleCheckboxClick = (customerId) => {
    navigate(`/inquirie/${customerId}`);
  };

  const handleAddCustomer = () => {
    navigate("/createInquiries");
  };

  if (error) {
    return (
      <div className="p-6 text-red-500">Error loading customers: {error}</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:bg-gray-50 p-1 rounded-md text-gray-400">
          Home
        </Link>{" "}
        /
        <Link
          to="/customers"
          className="hover:bg-gray-50 p-1 rounded-md text-gray-400"
        >
          Customers
        </Link>
        / <span className="text-gray-900">inquiries</span>
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
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1); // reset page when tab changes
              }}
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
            className="w-full border rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page when search changes
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddCustomer}
            className="flex items-center gap-1 px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Add Inquiries
          </button>
          <button className="flex items-center gap-1 px-4 py-1 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <FunnelIcon className="h-5 w-5" />
            Filter
          </button>
          <div className="relative">
            <button
              onClick={handleExport}
              className="flex items-center gap-1 px-4 py-1 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export
            </button>
            <input
              type="file"
              id="import-file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleImport}
            />
          </div>
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
                  <CurrencyDollarIcon className="w-4 h-4" />
                  expected Contract Amount
                </div>
              </th>
              <th className="p-2 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <PresentationChartBarIcon className="w-4 h-4" />
                  expected Discount
                </div>
              </th>
              <th className="p-2 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <CalendarDaysIcon className="w-4 h-4" />
                  joining Date
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {loading ? (
              // Placeholder rows while loading
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`placeholder-${index}`}>
                  <td className="p-2">
                    <input type="checkbox" disabled />
                  </td>
                  <td className="p-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="p-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((customer) => (
                <tr key={customer.id}>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      onClick={() => handleCheckboxClick(customer.id)}
                      className="cursor-pointer"
                    />
                  </td>
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
                  <td className="p-2">{customer.expectedContractAmount}</td>
                  <td className="p-2">{customer.expectedDiscount}</td>
                  <td className="p-2">{customer.joiningDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && paginatedData.length > 0 && (
          <div className="flex justify-end p-3 border-t">
            <div className="flex items-center space-x-1 text-sm">
              <button
                className="px-2 py-1 border rounded bg-white text-gray-600"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-2 py-1 border rounded bg-white text-gray-600"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inquiries;
