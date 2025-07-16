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

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value="10000"
            icon={<ShoppingCart size={24} />}
            bgColor="bg-purple-500"
            iconBg="bg-purple-600"
          />
          <StatCard
            title="Active Users"
            value="2405"
            icon={<Activity size={24} />}
            bgColor="bg-green-500"
            iconBg="bg-green-600"
          />
          <StatCard
            title="Inactive Users"
            value="3628"
            icon={<DollarSign size={24} />}
            bgColor="bg-red-500"
            iconBg="bg-red-600"
          />
          <StatCard
            title="Alert Cases"
            value="3958"
            icon={<Users size={24} />}
            bgColor="bg-blue-500"
            iconBg="bg-blue-600"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ReadingMethodsChart />
        <div className="space-y-6">
          <CustomerSegments />
          <CustomerPhase />
        </div>
        <TensionChart />
      </div>

      {/* Region Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RegionChart />
        <div className="space-y-6">
          <CustomerSegments />
          <CustomerPhase />
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TariffTable />
        <ActivityTable />
        <AgencyTable />
      </div>
    </div>
  );
};

export default Dashboard;