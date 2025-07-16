import React, { useState } from 'react';
import StatCard from './StatCard';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { usersAPI } from '../utils/api';

const cardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: '28px 24px',
  background: 'linear-gradient(135deg, rgba(59,130,246,0.13) 0%, rgba(251,191,36,0.08) 100%)',
  boxShadow: '0 8px 32px 0 rgba(59,130,246,0.10)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1.5px solid rgba(59,130,246,0.10)',
  margin: 0,
  overflow: 'hidden',
};

const inputStyle: React.CSSProperties = {
  border: '1.5px solid #2563eb',
  borderRadius: 10,
  padding: '10px 16px',
  fontSize: 16,
  marginRight: 12,
  width: 320,
  maxWidth: '100%',
  outline: 'none',
  transition: 'border 0.2s',
};

const buttonStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '10px 28px',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
  transition: 'background 0.18s',
};

const RecentActivity = ({ activity }: { activity: string[] }) => (
  <div style={{ ...cardStyle, minHeight: 220 }}>
    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#2563eb' }}>Recent Activity</div>
    <ul style={{ paddingLeft: 22, color: '#334155', fontSize: 15, margin: 0 }}>
      {activity.map((item, idx) => <li key={idx} style={{ marginBottom: 6 }}>{item}</li>)}
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
    <div style={{ padding: 36 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28, color: '#2563eb' }}>User Search</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
        <input
          type="text"
          placeholder="Enter number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={handleGetUser}
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? 'Getting...' : 'Get'}
        </button>
      </div>
      {error && <div style={{ color: '#ef4444', marginBottom: 10 }}>{error}</div>}
      {userInfo && (
        <div style={{ ...cardStyle, marginTop: 18 }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, color: '#2563eb' }}>User Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
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
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#2563eb' }}>Quick Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 18 }}>
              <StatCard title="Usage (kWh)" value={userInfo.usage_history?.reduce((acc: number, cur: any) => acc + cur.usage, 0)} icon={<span>⚡</span>} />
              <StatCard title="Bills" value={userInfo.payment_history?.filter((p: any) => p.paid).length} icon={<span>💳</span>} />
              <StatCard title="Last Payment" value={userInfo.payment_history?.slice(-1)[0]?.month || '-'} icon={<span>📅</span>} />
              <StatCard title="Alerts" value={userInfo.alert_history?.reduce((acc: number, cur: any) => acc + cur.alerts, 0)} icon={<span>🚨</span>} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            <div style={{ ...cardStyle, height: 290, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#2563eb' }}>Usage Over Time</div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userInfo.usage_history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#334155' }} />
                  <YAxis tick={{ fontSize: 14, fill: '#334155' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ ...cardStyle, height: 290, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#2563eb' }}>Payment History</div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userInfo.payment_history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#334155' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#334155' }} />
                  <Tooltip />
                  <Bar dataKey="paid" fill="#22c55e" name="Paid (1=Yes, 0=No)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            <div style={{ ...cardStyle, height: 290, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#2563eb' }}>Alert History</div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userInfo.alert_history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#334155' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#334155' }} />
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