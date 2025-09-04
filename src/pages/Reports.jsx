import ReportStats from "../components/Reports/ReportStats";
import Finance from "../components/Reports/Finance";
import FinanceExpenses from "../components/Reports/FinanceExpenses";
import SourcesActivity from "../components/Reports/SourcesActivity";
import ExpiringContracts from "../components/Dashboard/ExpiringContracts";
import CasesExpiredContract from "../components/Dashboard/CasesExpiredContract";
import OccupancyChart from "../components/Dashboard/OccupancyChart";
import { Link } from "react-router-dom";
// orange, pink, blue
function Reports() {
  return (
    <div className="p-5">
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:bg-gray-100 p-1 rounded-md text-gray-400">
          Home
        </Link>
        / <span className="text-gray-900">Reports</span>
      </div>
      <h1 className="text-xl md:text-2xl mt-4 mb-1 font-semibold text-gray-800">
        Reports
      </h1>
      <ReportStats />
      <h1 className="text-xl md:text-2xl mt-4 mb-1 font-semibold text-gray-800">
        Finance
      </h1>
      <Finance />
      <FinanceExpenses />
      <h1 className="text-xl md:text-2xl mt-4 mb-1 font-semibold text-gray-800">
        Contracts
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
        <CasesExpiredContract />
        <ExpiringContracts />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          <OccupancyChart title="Al Damam" label="Offices Rented" />
          <OccupancyChart
            title="Occupancy"
            label="Of Private Offices Rented"
          />
        </div>
        <SourcesActivity />
      </div>
    </div>
  );
}

export default Reports;
