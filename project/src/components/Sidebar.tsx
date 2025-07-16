import React from 'react';
import { Home, Users, Shield, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const sidebarStyle: React.CSSProperties = {
  background: '#18181b',
  color: '#fff',
  width: 240,
  minHeight: '100vh',
  padding: '32px 16px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
};

const titleStyle: React.CSSProperties = {
  marginBottom: 32,
  fontSize: 22,
  fontWeight: 600,
  textAlign: 'center',
  letterSpacing: 1,
  color: '#38bdf8',
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const navItemStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 18px',
  borderRadius: 10,
  cursor: 'pointer',
  background: active ? '#2563eb' : 'none',
  color: active ? '#fff' : '#cbd5e1',
  fontWeight: active ? 600 : 500,
  fontSize: 16,
  boxShadow: active ? '0 2px 8px rgba(37,99,235,0.08)' : 'none',
  transition: 'background 0.2s, color 0.2s',
});

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isUsers = location.pathname === '/users';
  const isAdmin = location.pathname === '/admin';
  const isAnalytics = location.pathname === '/analytics';
  return (
    <aside style={sidebarStyle}>
      <div style={titleStyle}>Dashboard</div>
      <nav style={navStyle}>
        <div
          style={navItemStyle(isDashboard)}
          onClick={() => navigate('/dashboard')}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') navigate('/dashboard'); }}
          aria-current={isDashboard ? 'page' : undefined}
        >
          <Home size={20} />
          <span>Home</span>
        </div>
        <div
          style={navItemStyle(isUsers)}
          onClick={() => navigate('/users')}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') navigate('/users'); }}
          aria-current={isUsers ? 'page' : undefined}
        >
          <Users size={20} />
          <span>Users</span>
        </div>
        <div
          style={navItemStyle(isAdmin)}
          onClick={() => navigate('/admin')}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') navigate('/admin'); }}
          aria-current={isAdmin ? 'page' : undefined}
        >
          <Shield size={20} />
          <span>Admin</span>
        </div>
        <div
          style={navItemStyle(isAnalytics)}
          onClick={() => navigate('/analytics')}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') navigate('/analytics'); }}
          aria-current={isAnalytics ? 'page' : undefined}
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;