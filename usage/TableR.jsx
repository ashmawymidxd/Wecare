import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Avatar, Input, Tabs } from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  SyncOutlined,
  PlusCircleOutlined,
  FilterOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

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
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `KD–14163${i + 3}`,
    name: `Customer ${i + 1}`,
    phone: "+971550000000",
    company: "Company X",
    office: `CID–24${i}`,
    manager: "Manager X",
    status: i % 3 === 0 ? "New" : i % 3 === 1 ? "Active" : "Inactive",
    avatar: "https://via.placeholder.com/40",
  })),
];

function Sources() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredData = customersData.filter((c) => {
    const matchTab = activeTab === "All" || c.status === activeTab;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const columns = [
    {
      title: (
        <span className="flex items-center gap-1">
          <IdcardOutlined />
          <span className="text-gray-500">ID</span>
        </span>
      ),
      dataIndex: "id",
      key: "id",
    },
    {
      title: (
        <span className="flex items-center gap-1">
          <UserOutlined />
          <span className="text-gray-500">Client</span>
        </span>
      ),
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.avatar} />
          <div>
            <div>{record.name}</div>
            <div className="text-gray-400 text-xs">{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-1">
          <ApartmentOutlined />
          <span className="text-gray-500">Company</span>
        </span>
      ),
      dataIndex: "company",
      key: "company",
    },
    {
      title: (
        <span className="flex items-center gap-1">
          <EnvironmentOutlined />
          <span className="text-gray-500">Office No.</span>
        </span>
      ),
      dataIndex: "office",
      key: "office",
    },
    {
      title: (
        <span className="flex items-center gap-1">
          <TeamOutlined />
          <span className="text-gray-500">Manager</span>
        </span>
      ),
      dataIndex: "manager",
      key: "manager",
    },
    {
      title: (
        <span className="flex items-center gap-1">
          <SyncOutlined />
          <span className="text-gray-500">Status</span>
        </span>
      ),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Active" ? "green" : status === "New" ? "gold" : "red";
        return <span style={{ color }}>{status}</span>;
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:bg-gray-100 p-1 rounded-md">
          Home
        </Link>
        / Customers
      </div>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="All"
        onChange={(key) => setActiveTab(key)}
        activeKey={activeTab}
        items={tabs.map((tab) => ({
          key: tab,
          label: (
            <span
              className={`${
                activeTab === tab ? "text-yellow-500" : "text-gray-500"
              } font-medium`}
            >
              {tab} (
              {tab === "All"
                ? customersData.length
                : customersData.filter((c) => c.status === tab).length}
              )
            </span>
          ),
        }))}
        tabBarStyle={{
          borderBottom: "1px solid #f0f0f0",
          marginBottom: "16px",
        }}
      />

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        <div className="flex gap-2">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-md flex items-center gap-1">
            <PlusCircleOutlined />
            Add Customer
          </button>
          <button className="border  hover:bg-yellow-50 px-4 py-1.5 rounded-md flex items-center gap-1">
            <FilterOutlined />
            Filter
          </button>
          <button className="border  hover:bg-yellow-50 px-4 py-1.5 rounded-md flex items-center gap-1">
            <DownloadOutlined />
            Export
          </button>
        </div>
      </div>

      {/* Table with Pagination */}
      <div className="border">
        <Table
          rowKey="id"
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowSelection={{ type: "checkbox" }}
          onRow={(record) => ({
            onClick: () => navigate(`/customer/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
}

export default Sources;
