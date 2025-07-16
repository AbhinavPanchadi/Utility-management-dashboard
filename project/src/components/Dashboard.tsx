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
  <div style={{
    borderRadius: 22,
    padding: '28px 24px',
    background: 'linear-gradient(135deg, rgba(239,68,68,0.13) 0%, rgba(251,191,36,0.08) 100%)',
    boxShadow: '0 8px 32px 0 rgba(239,68,68,0.10)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1.5px solid rgba(239,68,68,0.10)',
    margin: 0,
    overflow: 'hidden',
    minHeight: 220,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }}>
    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ef4444', marginBottom: 18 }}>Recent Alerts</h3>
    <ul style={{ paddingLeft: 18, color: '#991b1b', fontSize: 15, margin: 0 }}>
      <li style={{ marginBottom: 8 }}>High usage detected in North District</li>
      <li style={{ marginBottom: 8 }}>Payment overdue: User #1023</li>
      <li style={{ marginBottom: 8 }}>System maintenance scheduled for 7/20</li>
      <li>New alert: Unusual activity in West District</li>
    </ul>
  </div>
);

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
          />
          <StatCard
            title="Active Users"
            value="2405"
            icon={<Activity size={24} />}
          />
          <StatCard
            title="Inactive Users"
            value="3628"
            icon={<DollarSign size={24} />}
          />
          <StatCard
            title="Alert Cases"
            value="3958"
            icon={<Users size={24} />}
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
        <RecentAlertsCard />
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