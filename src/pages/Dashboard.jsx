import DashboardHeader from "../components/Dashboard/DashboardHeader";
import DashboardStats from "../components/Dashboard/DashboardStats";
import RevenueChart from "../components/Dashboard/RevenueChart";
import SourcesActivityChart from "../components/Dashboard/SourcesActivityChart";
import OccupancyChart from "../components/Dashboard/OccupancyChart";
import ExpiringContracts from "../components/Dashboard/ExpiringContracts";
import AccountManagersPerformance from "../components/Dashboard/AccountManagersPerformance";

const Dashboard = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="mt-6">
        <DashboardStats />
      </div>
      <div className="flex md:flex-row flex-col items-center gap-5 mt-6">
        <div className="w-full sm:w-[90%] md:w-[48%] lg:w-[40%] h-[400px]">
          <RevenueChart />
        </div>
        <div className="w-full sm:w-[90%] md:w-[48%] lg:w-[58%] h-[400px]">
          <SourcesActivityChart />
        </div>
        <div className="w-full sm:w-[90%] md:w-[48%] lg:w-[40%] h-[400px]">
          <OccupancyChart />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
        <ExpiringContracts />
        <AccountManagersPerformance />
      </div>
    </div>
  );
};

export default Dashboard;
