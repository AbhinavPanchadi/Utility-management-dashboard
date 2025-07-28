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
  Activity,
  CheckCircle
} from 'lucide-react';
import { adminAPI } from '../../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/useAuth';
import { usersAPI, rolesAPI, permissionsAPI } from '../../../utils/api';

interface Admin {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: 'Active' | 'Inactive';
  lastLogin: string;
  avatar?: string;
}

interface AdminFormData {
  name: string;
  email: string;
  password: string;
  // role: 'Admin' | 'Sub-Admin' | 'Analyst'; // Remove this line
}

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
}
interface Role {
  id: number;
  name: string;
}
interface Permission {
  id: number;
  view_name: string;
}

console.log("AdminManagement rendered");
const AssignRolesCard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const usersRes = await usersAPI.getAll();
    const rolesRes = await rolesAPI.getAll();
    setUsers(usersRes);
    setRoles(rolesRes);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedRole) {
      toast.error('Select user and role');
      return;
    }
    setAssignLoading(true);
    try {
      // Fetch all permissions for the selected role
      const permsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/roles/${selectedRole}/permissions`);
      if (!permsRes.ok) throw new Error('Failed to fetch role permissions');
      const rolePerms = await permsRes.json();
      const permissionIds = rolePerms.map((p: any) => p.id);
      // Assign role and all permissions to the user
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user-role-permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser,
          role_id: selectedRole,
          permission_ids: permissionIds,
        }),
      });
      if (!res.ok) throw new Error('Failed to assign role and permissions');
      setAssignSuccess(true);
      setTimeout(() => setAssignSuccess(false), 2000);
      await fetchAll();
      setSelectedUser(null);
      setSelectedRole(null);
      toast.success('Role and permissions assigned!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign');
    } finally {
      setAssignLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const mainRole = u.roles && u.roles.length > 0 ? u.roles[0] : '-';
    const matchesRole = !filterRole || mainRole === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="rounded-2xl bg-white shadow-lg border border-blue-100 p-4 md:p-6 mt-6 max-w-4xl w-full mx-auto">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Assign Role</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 w-full text-sm"
        />
        <select
          className="border rounded px-3 py-2 text-sm"
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          {roles.map(r => (
            <option key={r.id} value={r.name}>{r.name}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
          {filteredUsers.map(u => {
            const initials = (u.full_name || u.username || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
            const mainRole = u.roles && u.roles.length > 0 ? u.roles[0] : '-';
            return (
              <div key={u.id} className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{u.full_name || u.username}</span>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{mainRole}</span>
                </div>
                <div className="text-gray-700 text-xs">{u.email}</div>
                <div>
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={selectedUser === u.id ? (selectedRole ?? '') : ''}
                    onChange={e => {
                      setSelectedUser(u.id);
                      setSelectedRole(Number(e.target.value) || null);
                    }}
                  >
                    <option value="">Select role</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium shadow"
                    onClick={handleAssign}
                    type="button"
                    disabled={assignLoading || !selectedUser || !selectedRole || selectedUser !== u.id}
                  >
                    {assignLoading && selectedUser === u.id ? 'Assigning...' : 'Assign'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {assignSuccess && (
        <div className="flex items-center text-green-600 mt-2 text-sm"><CheckCircle className="mr-1 w-4 h-4" />Assigned successfully!</div>
      )}
    </div>
  );
};

const AdminManagement: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
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
    // role: 'Analyst' // Remove this line
  });
  const [metrics, setMetrics] = useState({ totalAdmins: 0, activeAdmins: 0, subAdmins: 0, analysts: 0 });
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ username: '', email: '', password: '', full_name: '' });
  const [creatingUser, setCreatingUser] = useState(false);
  const [createUserError, setCreateUserError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Only allow admin features if user has Admin or Super-Admin role
  const isSuperAdmin = user?.roles?.includes('Super-Admin');
  const isAdmin = user?.roles?.includes('Admin');

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
          lastLogin: a.last_login,
          roles: a.roles || [],
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

  // On mount, clear users list
  useEffect(() => {
    setUsers([]);
  }, []);

  // Fetch users, roles, permissions on mount
  useEffect(() => {
    if (isAdmin) {
      fetchUsersRolesPermissions();
    }
  }, [isAdmin]);

  // Debug output
  useEffect(() => {
    console.log('user:', user);
    console.log('roles:', roles);
    console.log('user roles:', user?.roles);
  }, [user, roles]);

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
        lastLogin: a.last_login,
        roles: a.roles || [],
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

  const fetchUsersRolesPermissions = async () => {
    try {
      const [usersRes, rolesRes, permsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/users`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/roles`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/permissions`).then(r => r.json()),
      ]);
      setUsers(usersRes);
      setRoles(rolesRes);
      setPermissions(permsRes);
    } catch (err: any) {
      toast.error('Failed to fetch users/roles/permissions');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserError(null);
    setCreatingUser(true);
    try {
      const payload = { ...newUserForm };
      await authAPI.register(payload);
      setShowCreateUserModal(false);
      setNewUserForm({ username: '', email: '', password: '', full_name: '' });
      // Always fetch the full users list after creation
      fetchUsersRolesPermissions();
      toast.success('User created!');
    } catch (err: any) {
      setCreateUserError('Failed to create user. ' + (err.message || ''));
    } finally {
      setCreatingUser(false);
    }
  };

  const validateForm = () => {
    if (!formData.name) return 'Name is required';
    if (!formData.email) return 'Email is required';
    if (!editingAdmin && !formData.password) return 'Password is required';
    // if (!formData.role) return 'Role is required'; // Remove this line
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
      // delete payload.role; // Remove this line
      if (editingAdmin) {
        await adminAPI.update(editingAdmin.id, payload);
        toast.success('Admin updated successfully');
      } else {
        await adminAPI.create({ ...payload, status: 'Admin' });
        toast.success('Admin created successfully');
      }
      await fetchAdminsAndMetrics();
      setShowModal(false);
      setEditingAdmin(null);
      setFormData({ name: '', email: '', password: '' });
    } catch (err: any) {
      let errorMsg = err.message || 'Failed to save admin';
      if (errorMsg.includes('Username or email already registered')) {
        errorMsg = 'This username or email is already in use. Please choose a different one.';
      }
      setError(errorMsg);
      toast.error(errorMsg);
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
      // role: admin.role // Remove this line
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
    const matchesRole = filterRole === 'All' || (admin.roles && admin.roles.includes(filterRole));
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
      {isSuperAdmin && (
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
        >
          Add Admin
        </button>
      )}
    </div>
  );

  // Compute assignable permissions for the selected role
  const [assignablePermissions, setAssignablePermissions] = useState<number[]>([]);
  useEffect(() => {
    if (!selectedRole || !user) {
      setAssignablePermissions([]);
      return;
    }
    // Find all permission ids the current user has for the selected role
    // Assume user.user_role_permissions is available, otherwise fetch from backend
    // For robustness, fetch from backend
    const fetchUserRolePermissions = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user-role-permissions/${user.id}`);
        const data = await res.json();
        const perms = data
          .filter((urp: any) => urp.role_id === selectedRole && urp.permission_id)
          .map((urp: any) => urp.permission_id);
        setAssignablePermissions(perms);
      } catch {
        setAssignablePermissions([]);
      }
    };
    fetchUserRolePermissions();
  }, [selectedRole, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your admin users and their permissions</p>
        </div>
        {(loading || authLoading) ? (
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
                  {isSuperAdmin && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Add Admin</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              {filteredAdmins.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    <div>NAME</div>
                    <div>ROLE</div>
                    <div>EMAIL</div>
                    <div>STATUS</div>
                    <div>LAST LOGIN</div>
                    <div>ACTIONS</div>
                  </div>
                  {/* Table Body */}
                  <div className="divide-y divide-gray-200">
                    {(filteredAdmins || []).map((admin) => {
                      const mainRole = admin.roles && admin.roles.length > 0 ? admin.roles[0] : 'User';
                      const initials = (admin.name || '')
                        .split(' ')
                        .map(w => w[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase();
                      return (
                        <div key={admin.id} className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                          {/* Name */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                              {initials}
                            </div>
                            <div className="font-medium text-gray-900">
                              {admin.name}
                            </div>
                          </div>
                          {/* Role */}
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              mainRole === 'Admin' ? 'bg-red-100 text-red-700' :
                              mainRole === 'Analyst' ? 'bg-green-100 text-green-700' :
                              mainRole === 'Manager' ? 'bg-blue-100 text-blue-700' :
                              mainRole === 'Super-Admin' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {mainRole}
                            </span>
                          </div>
                          {/* Email */}
                          <div className="text-gray-700 text-sm">
                            {admin.email}
                          </div>
                          {/* Status */}
                          <div>
                            <button
                              onClick={() => toggleStatus(admin.id)}
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                admin.status === 'Active'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {admin.status}
                            </button>
                          </div>
                          {/* Last Login */}
                          <div className="text-gray-500 text-sm">
                            {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(admin)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(admin.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {/* Only show Assign Roles & Permissions if user is Admin or Super-Admin */}
        {(isAdmin || isSuperAdmin) && (
          <AssignRolesCard />
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
                    setFormData({ name: '', email: '', password: '' });
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

                {/* <div>
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
                </div> */}

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
                      setFormData({ name: '', email: '', password: '' });
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
        {/* Create User Modal */}
        {showCreateUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Create New User</h2>
                <button
                  onClick={() => setShowCreateUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.username}
                    onChange={e => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newUserForm.full_name}
                    onChange={e => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={newUserForm.password}
                    onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter password"
                  />
                </div>
                {createUserError && <div className="text-red-500 text-sm">{createUserError}</div>}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateUserModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    disabled={creatingUser}
                  >
                    {creatingUser ? 'Creating...' : 'Create User'}
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