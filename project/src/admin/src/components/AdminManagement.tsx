import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Edit3,
  Trash2,
  Search,
  Shield,
  Eye,
  EyeOff,
  X,
  Plus,
  Filter,
  MoreHorizontal,
  Home,
  Settings,
  BarChart3,
  UserCheck,
  UserX,
  Activity
} from 'lucide-react';
import { adminAPI } from '../../../utils/api';
import { toast } from 'react-toastify';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sub-Admin' | 'Analyst';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  avatar?: string;
}

interface AdminFormData {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Sub-Admin' | 'Analyst';
}

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    email: '',
    password: '',
    role: 'Analyst'
  });
  const [metrics, setMetrics] = useState({ totalAdmins: 0, activeAdmins: 0, subAdmins: 0, analysts: 0 });
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch admins and metrics
  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminAPI.getAll(),
      adminAPI.getMetrics()
    ])
      .then(([adminsData, metricsData]) => {
        setAdmins(adminsData.map(a => ({
          ...a,
          name: a.full_name || a.username,
          lastLogin: a.last_login
        })));
        setMetrics(metricsData);
      })
      .catch((err) => {
        setAdmins([]);
        setMetrics({ totalAdmins: 0, activeAdmins: 0, subAdmins: 0, analysts: 0 });
        toast.error(err.message || 'Failed to load admin data');
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchAdminsAndMetrics = async () => {
    setLoading(true);
    try {
      const [adminsData, metricsData] = await Promise.all([
        adminAPI.getAll(),
        adminAPI.getMetrics()
      ]);
      setAdmins(adminsData.map(a => ({
        ...a,
        name: a.full_name || a.username,
        lastLogin: a.last_login
      })));
      setMetrics(metricsData);
    } catch (err: any) {
      setAdmins([]);
      setMetrics({ totalAdmins: 0, activeAdmins: 0, subAdmins: 0, analysts: 0 });
      toast.error(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name) return 'Name is required';
    if (!formData.email) return 'Email is required';
    if (!editingAdmin && !formData.password) return 'Password is required';
    if (!formData.role) return 'Role is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData, username: formData.name, full_name: formData.name };
      delete payload.name;
      if (editingAdmin) {
        await adminAPI.update(editingAdmin.id, payload);
        toast.success('Admin updated successfully');
      } else {
        await adminAPI.create(payload);
        toast.success('Admin created successfully');
      }
      await fetchAdminsAndMetrics();
      setShowModal(false);
      setEditingAdmin(null);
      setFormData({ name: '', email: '', password: '', role: 'Analyst' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to save admin');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    if (!window.confirm('Are you sure you want to delete this admin?')) {
      setDeletingId(null);
      return;
    }
    setLoading(true);
    try {
      await adminAPI.delete(id);
      toast.success('Admin deleted successfully');
      await fetchAdminsAndMetrics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete admin');
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  const toggleStatus = async (id: string) => {
    setLoading(true);
    try {
      await adminAPI.toggleStatus(id);
      toast.success('Admin status updated');
      await fetchAdminsAndMetrics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter(admin => {
    if (!admin || !admin.name || !admin.email) return false;
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || admin.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const MetricCard = ({ title, value, icon: Icon, gradient }: { 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    gradient: string; 
  }) => (
    <div className={`${gradient} rounded-2xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-xs md:text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-white/20 rounded-full p-2 md:p-3">
          <Icon className="w-6 h-6 md:w-8 md:h-8" />
        </div>
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-200 rounded-2xl p-4 md:p-6 animate-pulse">
            <div className="h-3 md:h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-6 md:h-8 bg-gray-300 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 md:h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-8 md:py-12">
      <div className="bg-gray-100 rounded-full p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 flex items-center justify-center">
        <Users className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
      </div>
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No admins found</h3>
      <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">Get started by adding your first admin user.</p>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
      >
        Add Admin
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your admin users and their permissions</p>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <MetricCard
                title="Total Admins"
                value={metrics.totalAdmins}
                icon={Users}
                gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
              />
              <MetricCard
                title="Active Admins"
                value={metrics.activeAdmins}
                icon={UserCheck}
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <MetricCard
                title="Sub-Admins"
                value={metrics.subAdmins}
                icon={Shield}
                gradient="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <MetricCard
                title="Analysts"
                value={metrics.analysts}
                icon={Activity}
                gradient="bg-gradient-to-br from-pink-500 to-pink-600"
              />
            </div>

            {/* Table Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                      <input
                        type="text"
                        placeholder="Search admins..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm md:text-base"
                      />
                    </div>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    >
                      <option value="All">All Roles</option>
                      <option value="Admin">Admin</option>
                      <option value="Sub-Admin">Sub-Admin</option>
                      <option value="Analyst">Analyst</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Add Admin</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              {filteredAdmins.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(filteredAdmins || []).map((admin) => (
                        <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                                  {admin.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              </div>
                              <div className="ml-3 md:ml-4">
                                <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              admin.role === 'Admin' 
                                ? 'bg-red-100 text-red-800' 
                                : admin.role === 'Sub-Admin'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="hidden sm:inline">{admin.email}</span>
                            <span className="sm:hidden text-xs">{admin.email && admin.email.length > 20 ? admin.email.substring(0, 20) + '...' : admin.email}</span>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleStatus(admin.id)}
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                                admin.status === 'Active'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {admin.status}
                            </button>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="hidden md:inline">{admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}</span>
                            <span className="md:hidden text-xs">{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}</span>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-1 md:space-x-2">
                              <button
                                onClick={() => handleEdit(admin)}
                                className="text-blue-600 hover:text-blue-900 p-1 md:p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(admin.id)}
                                className="text-red-600 hover:text-red-900 p-1 md:p-2 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingAdmin(null);
                    setFormData({ name: '', email: '', password: '', role: 'Analyst' });
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    placeholder="Enter admin name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {editingAdmin && '(leave empty to keep current)'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!editingAdmin}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'Sub-Admin' | 'Analyst' })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Sub-Admin">Sub-Admin</option>
                    <option value="Analyst">Analyst</option>
                  </select>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                      <button onClick={() => setError(null)} className="text-red-900">
                        <span>&times;</span>
                      </button>
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingAdmin(null);
                      setFormData({ name: '', email: '', password: '', role: 'Analyst' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editingAdmin ? 'Update Admin' : 'Add Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;