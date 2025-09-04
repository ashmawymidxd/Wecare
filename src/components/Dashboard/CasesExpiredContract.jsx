import { Table, Typography, Avatar, Button } from "antd";
import {  ArrowRightCircleIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import config from "../../config";

const { Text } = Typography;

export default function CasesExpiredContract({ showViewMore }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [formattedData, setFormattedData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get pathname without Next.js router
  const pathname = window.location.pathname;

  // Show "View More" button logic
  const shouldShowViewMore =
    showViewMore !== undefined
      ? showViewMore
      : !pathname.includes("/dashboard");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(
          `${config.apiBaseUrl}api/contract`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        const contracts = result?.employee_expird_contracts?.data || [];

        // Normalize format
        const transformed = contracts.map((item, index) => ({
          id: item.employee_id || `contract-${index}`,
          client: item.employee_name,
          avatar: item.profile_image,
          expirationDate: item.total_expired_contracts,
          openedCases: item.opened_cases,
        }));

        setFormattedData(transformed);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = [
    {
      title: "Manger",
      dataIndex: "client",
      key: "client",
      width: "40%",
      render: (text, record) => (
        <div className="flex items-center gap-1 md:gap-3">
          <Avatar
            key={`avatar-${record.id}`}
            size={isSmallScreen ? 24 : 36}
            src={record.avatar}
            alt={text}
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex flex-col">
            <span className="font-medium text-[14px] text-[var(--text-primary-color)] truncate">
              {text}
            </span>
            <span className="text-xs text-[var(--secondary-text-color)] mt-0.5 truncate">
              {/* {record.accManager} */}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: isSmallScreen ? "Exp.Date" : "Expired Contracts",
      dataIndex: "expirationDate",
      key: "expirationDate",
      width: "30%",
      align: "center",
      render: (text) => (
        <Text
          style={{ color: "#A12121" }}
          className="font-semibold whitespace-nowrap"
        >
          {text}
        </Text>
      ),
    },
    {
      title: isSmallScreen ? null : "Opened Cases",
    dataIndex: "openedCases",
      key: "openedCases",
      width: "30%",
      align: "center",
      render: (text) => (
        <Text
          style={{ color: "#A12121" }}
          className="font-semibold whitespace-nowrap"
        >
          {text}
        </Text>
      ),
    },
  ];

  // Determine which data to show based on expanded state
  const displayData = expanded ? formattedData : formattedData.slice(0, 3);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Cases & Expired Contract</h2>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-3 w-full">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <Table
              dataSource={displayData}
              columns={columns}
              pagination={false}
              className="custom-table [&_.ant-table-thead_.ant-table-cell]:!bg-white [&_.ant-table-thead_.ant-table-cell]:!p-2 [&_.ant-table-thead_.ant-table-cell]:!border-b-0 [&_.ant-table-row_.ant-table-cell]:!py-3 [&_.ant-table-row]:border-b [&_.ant-table-row]:border-gray-100 [&_.ant-table-row:last-child]:!border-b-0"
              size={isSmallScreen ? "small" : "middle"}
              scroll={{ x: undefined }}
              rowKey={(record) => record.id}
              rowClassName={(record, index) =>
                index === displayData.length - 1 ? "no-border-bottom" : ""
              }
            />
          </div>

          {shouldShowViewMore && formattedData.length > 3 && (
            <div className="mt-4 text-center">
              <Button
                type="text"
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-center mx-auto text-primary"
                icon={expanded ? (
                  <ArrowLeftCircleIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowRightCircleIcon className="h-4 w-4 mr-1" />
                )}
              >
                {expanded ? "Show Less" : "View More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}