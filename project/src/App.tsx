import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UsersPage from './components/UsersPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './hooks/useAuth';
import AdminManagement from './admin/src/components/AdminManagement';
import Analytics from './analytics/src/components/Analytics';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function NotAuthorized() {
  return <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <h2 className="text-2xl font-bold mb-2 text-red-600">Not Authorized</h2>
    <p className="text-gray-700">You do not have permission to view this page.</p>
  </div>;
}

function PermissionRoute({ children, permission, role }: { children: JSX.Element, permission?: string, role?: string }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (permission && !user?.permissions?.includes(permission)) return <NotAuthorized />;
  if (role && !user?.roles?.includes(role)) return <NotAuthorized />;
  return children;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hideLayout = !isAuthenticated || ['/login', '/register'].includes(location.pathname);
  if (hideLayout) return <>{children}</>;
  return (
    <>
      <Header onMenuClick={() => setSidebarOpen((open) => !open)} />
      <div className="flex flex-row items-stretch">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 bg-gray-50 p-2 md:p-6 min-h-screen">{children}</main>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PermissionRoute permission="home_dashboard"><Dashboard /></PermissionRoute>} />
            <Route path="/users" element={<PermissionRoute permission="user_dashboard"><UsersPage /></PermissionRoute>} />
            <Route path="/admin" element={<PermissionRoute role="Admin"><AdminManagement /></PermissionRoute>} />
            <Route path="/analytics" element={<PermissionRoute permission="analytics_dashboard"><Analytics /></PermissionRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;