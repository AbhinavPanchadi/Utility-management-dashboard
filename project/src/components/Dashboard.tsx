import React from 'react';
import { ShoppingCart, Activity, DollarSign, Users } from 'lucide-react';
import StatCard from './StatCard';
import TensionChart from './TensionChart';
import RegionChart from './RegionChart';
import ReadingMethodsChart from './ReadingMethodsChart';
import CustomerSegments from './CustomerSegments';
import CustomerPhase from './CustomerPhase';
import TariffTable from './TariffTable';
import ActivityTable from './ActivityTable';
import AgencyTable from './AgencyTable';

// Add a simple RecentAlertsCard component
const RecentAlertsCard = () => (
  <div className="rounded-2xl p-4 md:p-6 bg-gradient-to-br from-red-50 to-amber-50 shadow-lg border border-red-100 min-h-[200px] md:min-h-[220px] flex flex-col justify-center">
    <h3 className="text-lg md:text-xl font-bold text-red-600 mb-3 md:mb-4">Recent Alerts</h3>
    <ul className="pl-4 md:pl-5 text-red-800 text-sm md:text-base space-y-2">
      <li>High usage detected in North District</li>
      <li>Payment overdue: User #1023</li>
      <li>System maintenance scheduled for 7/20</li>
      <li>New alert: Unusual activity in West District</li>
    </ul>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Overview Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Users"
            value="10000"
            icon={<ShoppingCart size={20} className="md:w-6 md:h-6" />}
          />
          <StatCard
            title="Active Users"
            value="2405"
            icon={<Activity size={20} className="md:w-6 md:h-6" />}
          />
          <StatCard
            title="Inactive Users"
            value="3628"
            icon={<DollarSign size={20} className="md:w-6 md:h-6" />}
          />
          <StatCard
            title="Alert Cases"
            value="3958"
            icon={<Users size={20} className="md:w-6 md:h-6" />}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <ReadingMethodsChart />
        <div className="space-y-4 md:space-y-6">
          <CustomerSegments />
          <CustomerPhase />
        </div>
        <TensionChart />
      </div>

      {/* Region Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <RegionChart />
        <RecentAlertsCard />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <TariffTable />
        <ActivityTable />
        <AgencyTable />
      </div>
    </div>
  );
};

export default Dashboard;