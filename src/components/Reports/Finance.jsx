import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#F97316", "#EC4899", "#3B82F6"];
import config from "../../config";
function Finance() {
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${config.apiBaseUrl}api/finance`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFinanceData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  // Helper function to determine color class based on percentage change
  const getPercentageClass = (percentage) => {
    if (percentage.startsWith("+")) {
      return "text-[#10AE12] bg-[#c3eac3]";
    } else if (percentage.startsWith("-")) {
      return "text-[#FF0000] bg-[#ffcccc]";
    }
    return "text-gray-500 bg-gray-200";
  };

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* finance_profit skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col animate-pulse">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-28 bg-gray-200 rounded-md"></div>
            </div>
            <div className="my-5">
              <div className="h-10 w-36 bg-gray-200 rounded"></div>
              <div className="mt-3">
                <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center justify-between border-t border-gray-200">
            <div className="p-5">
              <div className="h-5 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-28 bg-gray-200 rounded mt-2"></div>
              <div className="mt-3">
                <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="border-l border-gray-200 p-5">
              <div className="h-5 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-28 bg-gray-200 rounded mt-2"></div>
              <div className="mt-3">
                <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* finance_sales skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col animate-pulse">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-28 bg-gray-200 rounded-md"></div>
            </div>
            <div className="my-5">
              <div className="h-10 w-36 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex gap-3 items-center justify-between border-t border-gray-200 mt-5">
            <div className="p-5 w-full">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-8 w-28 bg-gray-200 rounded mt-4"></div>
              <div className="mt-1">
                <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="border-l border-gray-200 p-5 w-full">
              <div className="h-5 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-28 bg-gray-200 rounded mt-4"></div>
              <div className="mt-1">
                <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full mt-1"></div>
            </div>
          </div>
        </div>

        {/* payment_methods skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 sm:p-6 h-full flex flex-col animate-pulse">
          <div className="h-8 w-40 bg-gray-200 rounded"></div>
          <div className="mt-5 flex items-center justify-between gap-5">
            <div>
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex flex-col items-start mt-5">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-200"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 w-12 bg-gray-200 rounded mt-1"></div>
                </div>
              ))}
            </div>
            <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!financeData) {
    return <div className="text-center py-10">No data available</div>;
  }

  // Prepare data for pie chart
  const paymentMethodsData = [
    { name: "Cash", value: financeData.payment_methods.cash_contracts },
    { name: "Cheque", value: financeData.payment_methods.cheque_contracts },
    { name: "Transfer", value: financeData.payment_methods.bank_transfer_contracts },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {/* finance_profit */}
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-500">Profit</h2>
            {/* Dropdown Month */}
            <select className="border bg-gray-100 border-gray-300 rounded-md p-1 text-sm">
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
            </select>
          </div>
          <div className="my-5">
            <h2 className="text-3xl font-semibold">
              {financeData.finance_profit.profit.value.toLocaleString()} AED
            </h2>
            <div className="text-sm mt-3">
              <span className={`font-medium px-2 py-1 rounded-full ${getPercentageClass(financeData.finance_profit.profit.percentage_change)}`}>
                {financeData.finance_profit.profit.percentage_change}
              </span>{" "}
              <span className="text-gray-500">
                {financeData.finance_profit.profit.comparison_text}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center justify-between border-t border-gray-200">
          <div className="p-5">
            <h2 className="font-xl text-gray-500 font-bold">Sales</h2>
            <p className="text-xl font-semibold text-gray-950 mt-5">
              {financeData.finance_profit.sales.value} AED
            </p>
            <div className="text-sm mt-3">
              <span className={`font-medium px-2 py-1 rounded-full ${getPercentageClass(financeData.finance_profit.sales.percentage_change)}`}>
                {financeData.finance_profit.sales.percentage_change}
              </span>{" "}
              <span className="text-gray-500">
                {financeData.finance_profit.sales.comparison_text}
              </span>
            </div>
          </div>
          <div className="border-l border-gray-200 p-5">
            <h2 className="font-xl text-gray-500 font-bold">Expenses</h2>
            <p className="text-xl font-semibold text-gray-950 mt-5">
              {financeData.finance_profit.expenses.value} AED
            </p>
            <div className="text-sm mt-3">
              <span className={`font-medium px-2 py-1 rounded-full ${getPercentageClass(financeData.finance_profit.expenses.percentage_change)}`}>
                {financeData.finance_profit.expenses.percentage_change}
              </span>{" "}
              <span className="text-gray-500">
                {financeData.finance_profit.expenses.comparison_text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* finance_sales */}
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-500">Sales</h2>
            <select className="border bg-gray-100 border-gray-300 rounded-md p-1 text-sm">
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
            </select>
          </div>
          <div className="my-5">
            <h2 className="text-3xl font-semibold">
              {financeData.finance_sales.sales.this_month} AED
            </h2>
          </div>
        </div>
        <div className="flex gap-3 items-center justify-between border-t border-gray-200 mt-5">
          <div className="p-5 w-full">
            <h2 className="font-xl text-gray-500 font-bold">New contracts</h2>
            <p className="text-xl font-semibold text-gray-950 mt-4">
              {financeData.finance_sales.newcontracts.new_this_month} AED
            </p>
            <div className="text-sm mt-1">
              <span className="font-medium px-2 py-1 rounded-full text-[#10AE12]">
                {financeData.finance_sales.newcontracts.percentage_change}%
              </span>
            </div>
          </div>
          <div className="border-l border-gray-200 p-5 w-full">
            <h2 className="font-xl text-gray-500 font-bold">Renewal</h2>
            <p className="text-xl font-semibold text-gray-950 mt-4">
              {financeData.finance_sales.renewalcontracts.renew_this_month} AED
            </p>
            <div className="text-sm mt-1">
              <span className="font-medium px-2 py-1 rounded-full text-[#10AE12]">
                {financeData.finance_sales.renewalcontracts.percentage_change}%
              </span>
            </div>
          </div>
        </div>
        {/* progress bar */}
        <div className="p-5">
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-[#10AE12] rounded-full"
                style={{
                  width: `${financeData.finance_sales.newcontracts.percentage_change}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* payment_methods */}
      <div className="bg-white rounded-lg border border-gray-200 sm:p-6 h-full flex flex-col">
        <h2 className="text-2xl text-gray-800 font-semibold">
          Payment Methods
        </h2>
        <div className="mt-5 flex items-center justify-between gap-5">
          <div>
            {paymentMethodsData.map((item, index) => (
              <div key={item.name} className="flex flex-col items-start mt-5">
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <h2 className="font-semibold text-gray-800">{item.name}</h2>
                </div>
                <p className="text-2xl">{item.value}%</p>
              </div>
            ))}
          </div>

          {/* Pie Chart */}
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {paymentMethodsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Finance;