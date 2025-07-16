import React, { useState } from 'react';
import StatCard from './StatCard';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { usersAPI } from '../utils/api';

const RecentActivity = ({ activity }: { activity: string[] }) => (
  <div className="bg-white shadow rounded p-4">
    <div className="text-lg font-semibold mb-2">Recent Activity</div>
    <ul className="list-disc pl-5 text-gray-700">
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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">User Search</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-2 rounded mr-2 w-96 max-w-full"
        />
        <button
          onClick={handleGetUser}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Getting...' : 'Get'}
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {userInfo && (
        <div className="bg-white shadow rounded p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard title="Usage (kWh)" value={userInfo.usage_history?.reduce((acc: number, cur: any) => acc + cur.usage, 0)} icon={<span>⚡</span>} bgColor="bg-blue-500" iconBg="bg-blue-600" />
              <StatCard title="Bills" value={userInfo.payment_history?.filter((p: any) => p.paid).length} icon={<span>💳</span>} bgColor="bg-green-500" iconBg="bg-green-600" />
              <StatCard title="Last Payment" value={userInfo.payment_history?.slice(-1)[0]?.month || '-'} icon={<span>📅</span>} bgColor="bg-purple-500" iconBg="bg-purple-600" />
              <StatCard title="Alerts" value={userInfo.alert_history?.reduce((acc: number, cur: any) => acc + cur.alerts, 0)} icon={<span>🚨</span>} bgColor="bg-red-500" iconBg="bg-red-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow rounded p-4 h-72 flex flex-col">
              <div className="text-lg font-semibold mb-2">Usage Over Time</div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userInfo.usage_history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white shadow rounded p-4 h-72 flex flex-col">
              <div className="text-lg font-semibold mb-2">Payment History</div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userInfo.payment_history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="paid" fill="#22c55e" name="Paid (1=Yes, 0=No)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow rounded p-4 h-72 flex flex-col">
              <div className="text-lg font-semibold mb-2">Alert History</div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userInfo.alert_history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="alerts" fill="#ef4444" name="Alerts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <RecentActivity activity={userInfo.recent_activity || []} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage; 