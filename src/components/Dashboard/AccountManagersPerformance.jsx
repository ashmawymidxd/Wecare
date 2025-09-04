import { Table, Avatar, Button } from "antd";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import config from "../../config";
export default function AccountManagersPerformance() {
  const [data, setData] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(
          `${config.apiBaseUrl}api/dashboardStatistice`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        const report = result?.get_employee_performance_report?.data || [];

        setData(report);
      } catch (error) {
        console.error("Failed to fetch performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = [
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      render: (text, record) => (
        <div className="flex items-center gap-1 md:gap-3">
          <Avatar
            key={`avatar-${record.key}`}
            size={isSmallScreen ? 20 : 36}
            className="flex-shrink-0 flex items-center justify-center"
            src={record.avatar}
          />
          <span className="font-medium text-[14px] text-[var(--text-primary-color)] truncate">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: isSmallScreen ? "Cust." : "Customers /Month",
      dataIndex: "customers",
      key: "customers",
      render: (text, record) => (
        <div>
          <div className="font-medium text-green-600 text-sm whitespace-nowrap">
            +{text}
          </div>
          <div className="text-xs text-[var(--secondary-text-color)] truncate">
            Target {record.target}
          </div>
        </div>
      ),
    },
    {
      title: "Renewals",
      dataIndex: "renewals",
      key: "renewals",
      render: (text, record) => (
        <div>
          <div className="font-medium text-sm">{text}%</div>
          <div className="text-xs text-[var(--secondary-text-color)] truncate">
            Target {record.renewalTarget}%
          </div>
        </div>
      ),
    },
  ];

  // Determine which data to show based on expanded state
  const displayData = expanded ? data : data.slice(0, 3);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">
        Account Managers Performance
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border-b border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div>
            <Table
              dataSource={displayData}
              columns={columns}
              pagination={false}
              className="custom-table [&_.ant-table-thead_.ant-table-cell]:!bg-white [&_.ant-table-thead_.ant-table-cell]:!p-2 [&_.ant-table-thead_.ant-table-cell]:!border-b-0 [&_.ant-table-row]:border-b [&_.ant-table-row]:border-gray-100 [&_.ant-table-row:last-child]:!border-b-0"
              size={isSmallScreen ? "small" : "middle"}
              scroll={{ x: undefined }}
              rowKey={(record) => record.key}
              style={{
                borderSpacing: "0 4px",
                borderCollapse: "separate",
              }}
              rowClassName={(record, index) => {
                return index === displayData.length - 1
                  ? "no-border-bottom"
                  : "";
              }}
            />
          </div>

          {data.length > 3 && (
            <div className="mt-4 text-center">
              <Button
                type="text"
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-center mx-auto text-primary"
                icon={
                  expanded ? (
                    <ArrowLeftCircleIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowRightCircleIcon className="h-4 w-4 mr-1" />
                  )
                }
              >
                {expanded ? "Show Less" : "View More"}
              </Button>
            </div>
          )}
        </>
      )}

      <style jsx="true" global="true">{`
        .no-border-bottom {
          border-bottom: none !important;
        }
        .ant-table-tbody > tr.no-border-bottom > td {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
}
