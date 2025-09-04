// src/components/Dashboard/RevenueChart.jsx
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { 
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import config from "../../config"
const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${config.apiBaseUrl}api/dashboardCharts`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch revenue data');
        }

        const data = await response.json();
        setRevenueData(data.revenue_stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col p-6 h-full bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="rounded-full w-[40px] h-[40px] bg-[#fcf6ea] flex items-center justify-center text-amber-500">
            <CurrencyDollarIcon className="h-7 w-7" />
          </div>
          <h3 className="text-[20px] font-medium">Revenue</h3>
        </div>
        <div className="mt-4 h-[200px] w-full bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col p-6 h-full bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="rounded-full w-[40px] h-[40px] bg-[#fcf6ea] flex items-center justify-center text-amber-500">
            <CurrencyDollarIcon className="h-7 w-7" />
          </div>
          <h3 className="text-[20px] font-medium">Revenue</h3>
        </div>
        <div className="mt-4 text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div className="flex flex-col p-6 h-full bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="rounded-full w-[40px] h-[40px] bg-[#fcf6ea] flex items-center justify-center text-amber-500">
            <CurrencyDollarIcon className="h-7 w-7" />
          </div>
          <h3 className="text-[20px] font-medium">Revenue</h3>
        </div>
        <div className="mt-4">No revenue data available</div>
      </div>
    );
  }

  const isPositive = revenueData.percentage_change >= 0;
  const chartData = revenueData.last_8_months.map(item => ({
    name: item.name,
    value: parseFloat(item.value) || 0 // Ensure numeric values and handle zeros
  }));

  return (
    <div className="flex flex-col p-6 h-full bg-white rounded-2xl border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="rounded-full w-[40px] h-[40px] bg-[#fcf6ea] flex items-center justify-center text-amber-500">
          <CurrencyDollarIcon className="h-7 w-7" />
        </div>
        <h3 className="text-[20px] font-medium">Revenue</h3>
      </div>

      <div className="mt-4">
        <h2 className="text-[32px] font-bold text-gray-800">
          {parseFloat(revenueData.current_revenue).toLocaleString()} AED
        </h2>
        <div className="flex items-center mt-1.5">
          <span
            className={`text-sm font-medium rounded-full px-2.5 py-1 ${
              isPositive
                ? "bg-green-100 text-green-600"
                : "bg-[#eac3c3] text-[#AE1010]"
            }`}
          >
            {revenueData.percentage_change > 0 ? "+" : ""}
            {revenueData.percentage_change}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs Last Month</span>
        </div>
      </div>

      <div className="h-[200px] w-full mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5A93D" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#E5A93D" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#888" }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis hide={true} />
            <Tooltip
              formatter={(value) => [`${parseFloat(value).toLocaleString()} AED`, "Revenue"]}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#E5A93D"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              dot={false}
              activeDot={{
                r: 4,
                stroke: "#E5A93D",
                strokeWidth: 2,
                fill: "white",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;