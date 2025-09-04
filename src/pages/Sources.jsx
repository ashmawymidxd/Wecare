import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  BuildingOffice2Icon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import config from "../config";
const tabs = [
  "All",
  "Tasheel",
  "Typing Center",
  "PRO",
  "Social Media",
  "Referral",
  "Inactive",
];

function Sources() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sources, setSources] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSources, setSelectedSources] = useState([]);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSources = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${config.apiBaseUrl}api/sources`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sources");
        }

        const data = await response.json();
        setSources(data.data);
        setMeta(data.meta);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, []);

  const filteredData = sources.filter((s) => {
    const matchTab = activeTab === "All" || s.source_type === activeTab;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
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

  const handleCheckboxChange = (sourceId, isChecked) => {
    if (isChecked) {
      setSelectedSources([...selectedSources, sourceId]);
    } else {
      setSelectedSources(selectedSources.filter((id) => id !== sourceId));
    }
  };

  const handleRowClick = (sourceId) => {
    navigate(`/sources/${sourceId}`);
  };

  const handleExport = () => {
    // Prepare data for export
    const dataToExport =
      selectedSources.length > 0
        ? sources.filter((source) => selectedSources.includes(source.id))
        : sources;

    // Convert to CSV
    const headers = [
      "ID",
      "Name",
      "Source Type",
      "Clients Count",
      "Account Manager",
      "Last Connect",
    ];
    const csvRows = [
      headers.join(","),
      ...dataToExport.map((source) =>
        [
          source.id,
          `"${source.name}"`,
          source.source_type,
          source.clients_count,
          source.account_manager || "N/A",
          source.last_connect_date || "N/A",
        ].join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sources_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Breadcrumb Placeholder */}
        <div className="text-sm text-gray-500">
          <span className="inline-block h-4 w-20 bg-gray-200 rounded animate-pulse"></span>
          /{" "}
          <span className="inline-block h-4 w-16 bg-gray-200 rounded animate-pulse"></span>
        </div>

        {/* Tabs Placeholder */}
        <div className="flex gap-4 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <div key={tab} className="pb-2 border-b-2 border-transparent">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Search and Actions Placeholder */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="relative w-full md:w-1/3">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Table Placeholder */}
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
                {[...Array(4)].map((_, i) => (
                  <th key={i} className="p-2 text-left">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="p-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  {[...Array(4)].map((_, j) => (
                    <td key={j} className="p-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Placeholder */}
          <div className="flex justify-end p-3 border-t">
            <div className="flex items-center space-x-1">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">Error loading sources: {error}</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:bg-gray-100 p-1 rounded-md">
          Home
        </Link>
        / Sources
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`pb-2 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "border-yellow-400 text-yellow-600"
                : "border-transparent text-gray-600"
            }`}
          >
            {tab} ({meta.source_type_counts?.[tab] || 0})
          </button>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="relative w-full md:w-1/3">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name"
            className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border focus:border-yellow-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex gap-2">
          <Link to={'/createSource'} className="flex items-center gap-1 px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
            <PlusCircleIcon className="h-5 w-5" />
            Add Source
          </Link>
          <button className="flex items-center gap-1 px-4 py-1 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <FunnelIcon className="h-5 w-5" />
            Filter
          </button>
          <button
            className="flex items-center gap-1 px-4 py-1 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={handleExport}
            disabled={selectedSources.length === 0 && sources.length === 0}
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
                <input
                  type="checkbox"
                  checked={
                    selectedSources.length === paginatedData.length &&
                    paginatedData.length > 0
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSources(
                        paginatedData.map((source) => source.id)
                      );
                    } else {
                      setSelectedSources([]);
                    }
                  }}
                />
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <BuildingOffice2Icon className="w-4 h-5" />
                  Name
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <UserIcon className="w-4 h-5" />
                  Clients
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <ClockIcon className="w-4 h-5" />
                  Last Connect
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 font-normal text-gray-400">
                  <UserCircleIcon className="w-4 h-5" />
                  Account Manager
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {paginatedData.length > 0 ? (
              paginatedData.map((source) => (
                <tr
                  key={source.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(source.id)}
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source.id)}
                      onChange={(e) =>
                        handleCheckboxChange(source.id, e.target.checked)
                      }
                    />
                  </td>
                  <td className="p-3">{source.name}</td>
                  <td className="p-3">{source.clients_count}</td>
                  <td className="p-3">{source.last_connect_date || "N/A"}</td>
                  <td className="p-3">{source.account_manager || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No sources found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {paginatedData.length > 0 && (
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

export default Sources;
