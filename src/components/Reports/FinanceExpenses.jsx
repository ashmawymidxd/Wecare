import { useState, useEffect } from 'react';
import {
  ClipboardDocumentListIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

function FinanceExpenses() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllCheques, setShowAllCheques] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        
        // Simulate network delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch('http://127.0.0.1:8000/api/finance', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Skeleton loader components
  const ExpenseSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-28 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="my-5">
          <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center mt-3">
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded ml-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-between border-t border-gray-200">
        {[1, 2, 3].map((item) => (
          <div key={item} className="p-5">
            <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="flex items-center">
              <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded ml-2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChequesSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col p-5">
      <div className="flex items-center justify-between">
        <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-28 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      <div className="sources">
        <div className="flex items-center justify-between p-3 mt-5">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
        <div className="flex items-center justify-center mt-2">
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  // Get either first 3 cheques or all cheques based on state
  const displayedCheques = showAllCheques 
    ? data?.collected_cheques?.contracts || []
    : data?.collected_cheques?.contracts?.slice(0, 3) || [];

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
      {/* Expenses Section */}
      {loading ? (
        <ExpenseSkeleton />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-500">Expenses</h2>
              <select className="border bg-gray-100 border-gray-300 rounded-md p-1 text-sm">
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
              </select>
            </div>
            <div className="my-5">
              <h2 className="text-3xl font-semibold">{data.expenses.expenses.this_month} AED</h2>
              <div className="text-sm mt-3">
                <span className={`font-medium px-2 py-1 rounded-full ${
                  data.expenses.expenses.percentage_change.startsWith('+') 
                    ? 'text-[#10AE12] bg-[#c3eac3]' 
                    : 'text-red-500 bg-red-100'
                }`}>
                  {data.expenses.expenses.percentage_change}
                </span>{" "}
                <span className="text-gray-500">{data.expenses.expenses.comparison_text}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center justify-between border-t border-gray-200">
            <div className="p-5">
              <h2 className="font-xl text-gray-500 font-bold">Electricity Fees</h2>
              <p className="text-xl font-semibold text-gray-950">{data.expenses.electricity_fees.this_month} AED</p>
              <div className="text-sm mt-3">
                <span className={`font-medium px-2 py-1 rounded-full ${
                  data.expenses.electricity_fees.percentage_change.startsWith('+') 
                    ? 'text-[#10AE12] bg-[#c3eac3]' 
                    : 'text-red-500 bg-red-100'
                }`}>
                  {data.expenses.electricity_fees.percentage_change}
                </span>{" "}
                <span className="text-gray-500">{data.expenses.electricity_fees.comparison_text}</span>
              </div>
            </div>
            <div className="border-l border-gray-200 p-5">
              <h2 className="font-xl text-gray-500 font-bold">Commission</h2>
              <p className="text-xl font-semibold text-gray-950">{data.expenses.commission.this_month} AED</p>
              <div className="text-sm mt-3">
                <span className={`font-medium px-2 py-1 rounded-full ${
                  data.expenses.commission.percentage_change.startsWith('+') 
                    ? 'text-[#10AE12] bg-[#c3eac3]' 
                    : 'text-red-500 bg-red-100'
                }`}>
                  {data.expenses.commission.percentage_change}
                </span>{" "}
                <span className="text-gray-500">{data.expenses.commission.comparison_text}</span>
              </div>
            </div>
            <div className="border-l border-gray-200 p-5">
              <h2 className="font-xl text-gray-500 font-bold">Salaries</h2>
              <p className="text-xl font-semibold text-gray-950">{data.expenses.Salaries.this_month} AED</p>
              <div className="text-sm mt-3">
                <span className={`font-medium px-2 py-1 rounded-full ${
                  data.expenses.Salaries.percentage_change.startsWith('+') 
                    ? 'text-[#10AE12] bg-[#c3eac3]' 
                    : 'text-red-500 bg-red-100'
                }`}>
                  {data.expenses.Salaries.percentage_change}
                </span>{" "}
                <span className="text-gray-500">{data.expenses.Salaries.comparison_text}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collected Cheques Section */}
      {loading ? (
        <ChequesSkeleton />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col p-5">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-xl text-gray-800">
              Collected Cheques ({data.collected_cheques.contracts.length})
            </h1>
            <select className="border bg-gray-100 border-gray-300 rounded-md p-1 text-sm">
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
            </select>
          </div>
          <div className="sources">
            <div className="flex items-center justify-between p-3 mt-5">
              <span className="text-gray-700 font-semibold">Source</span>
              <span className="text-gray-700 font-semibold">Deposit Date</span>
            </div>
            
            {displayedCheques.map((cheque, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-100 border-b duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-gray-700">{cheque.contract_number} ({cheque.payment_method})</span>
                </div>
                <div className="">
                  <span className="text-gray-700">
                    {new Date(cheque.payment_date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {data.collected_cheques.contracts.length > 3 && (
              <button 
                onClick={() => setShowAllCheques(!showAllCheques)}
                className="flex items-center justify-center w-full mt-2 text-blue-600 hover:text-blue-800"
              >
                {showAllCheques ? 'Show Less' : 'View More'}
                <ArrowRightCircleIcon className="w-5 h-5 ml-1" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FinanceExpenses;