import React, { useState } from 'react';
import StatCard from './StatCard';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { usersAPI } from '../utils/api';

const RecentActivity = ({ activity }: { activity: string[] }) => (
  <div className="rounded-2xl p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-100 to-yellow-50 shadow-lg border border-blue-100 min-h-[120px] flex flex-col justify-center mb-4">
    <div className="text-base md:text-lg font-bold text-blue-600 mb-2 md:mb-3">Recent Activity</div>
    <ul className="pl-4 text-slate-700 text-xs sm:text-sm md:text-base space-y-1">
      {activity.map((item, idx) => <li key={idx}>{item}</li>)}
    </ul>
  </div>
);

const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUser = async () => {
    setLoading(true);
    setError(null);
    setUserInfo(null);
    try {
      const data = await usersAPI.getUserByNumber(search);
      setUserInfo(data);
    } catch (err: any) {
      setUserInfo(null);
      setError('No user found for that number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-8 min-h-screen bg-gray-50">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-blue-600">User Search</h2>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border-2 border-blue-500 rounded-lg px-3 py-2 text-sm sm:text-base w-full sm:w-80 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
        <button
          onClick={handleGetUser}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-lg px-6 sm:px-8 py-2 font-bold text-sm sm:text-base transition hover:from-blue-700 hover:to-cyan-500 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Getting...' : 'Get'}
        </button>
      </div>
      {error && <div className="text-red-500 mb-3 text-sm sm:text-base">{error}</div>}
      {userInfo && (
        <div className="rounded-2xl p-2 sm:p-4 md:p-6 bg-gradient-to-br from-blue-100 to-yellow-50 shadow-lg border border-blue-100 mt-2 sm:mt-4">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-2">User Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-6 text-xs sm:text-sm md:text-base">
              <div><strong>Name:</strong> {userInfo.name}</div>
              <div><strong>Number:</strong> {userInfo.number}</div>
              <div><strong>Email:</strong> {userInfo.email}</div>
              <div><strong>Status:</strong> {userInfo.status}</div>
              <div><strong>Region:</strong> {userInfo.region}</div>
              <div><strong>Segment:</strong> {userInfo.segment}</div>
              <div><strong>Phase:</strong> {userInfo.phase}</div>
              <div><strong>Created At:</strong> {userInfo.createdAt}</div>
            </div>
          </div>
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-600 mb-2">Quick Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              <StatCard title="Usage (kWh)" value={userInfo.usage_history?.reduce((acc: number, cur: any) => acc + cur.usage, 0)} icon={<span>⚡</span>} />
              <StatCard title="Bills" value={userInfo.payment_history?.filter((p: any) => p.paid).length} icon={<span>💳</span>} />
              <StatCard title="Last Payment" value={userInfo.payment_history?.slice(-1)[0]?.month || '-'} icon={<span>📅</span>} />
              <StatCard title="Alerts" value={userInfo.alert_history?.reduce((acc: number, cur: any) => acc + cur.alerts, 0)} icon={<span>🚨</span>} />
            </div>
          </div>
          {/* Responsive grid for charts and activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            {/* Usage Over Time */}
            <div className="rounded-2xl bg-white/80 p-2 sm:p-4 md:p-6 shadow flex flex-col min-h-[180px]">
              <div className="text-base sm:text-lg font-bold text-blue-600 mb-2">Usage Over Time</div>
              <div className="h-40 sm:h-48 md:h-64 w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userInfo.usage_history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#334155' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="usage" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Payment History */}
            <div className="rounded-2xl bg-white/80 p-2 sm:p-4 md:p-6 shadow flex flex-col min-h-[180px]">
              <div className="text-base sm:text-lg font-bold text-blue-600 mb-2">Payment History</div>
              <div className="h-40 sm:h-48 md:h-64 w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userInfo.payment_history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#334155' }} />
                    <Tooltip />
                    <Bar dataKey="paid" fill="#22c55e" name="Paid (1=Yes, 0=No)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Alert History */}
            <div className="rounded-2xl bg-white/80 p-2 sm:p-4 md:p-6 shadow flex flex-col min-h-[180px]">
              <div className="text-base sm:text-lg font-bold text-blue-600 mb-2">Alert History</div>
              <div className="h-40 sm:h-48 md:h-64 w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userInfo.alert_history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#334155' }} />
                    <Tooltip />
                    <Bar dataKey="alerts" fill="#ef4444" name="Alerts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Recent Activity */}
            <RecentActivity activity={userInfo.activity_history || []} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage; 