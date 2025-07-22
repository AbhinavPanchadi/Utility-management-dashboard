// API configuration and utility functions
const API_BASE_URL = 'http://127.0.0.1:8000';

// Helper to get JWT token from localStorage
const getToken = () => localStorage.getItem('token');

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  auth: boolean = false
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  register: async (userData: any) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (username: string, password: string) => {
    // FastAPI expects form data for login
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);
    return apiRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/users/me', {}, true);
  },

  updateProfile: async (profileData: any) => {
    return apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }, true);
  },

  updatePassword: async (password: string) => {
    return apiRequest('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify({ password }),
    }, true);
  },

  getPermissions: async () => {
    return apiRequest('/me/permissions', {}, true);
  },
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: async () => {
    return apiRequest('/dashboard/stats');
  },

  getChartData: async () => {
    return apiRequest('/dashboard/charts');
  },
};

// Users API calls
export const usersAPI = {
  getAll: async () => {
    return apiRequest('/users');
  },

  getById: async (id: string) => {
    return apiRequest(`/users/${id}`);
  },

  create: async (userData: any) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id: string, userData: any) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  getUserByNumber: async (number: string) => {
    return apiRequest(`/users/number/${number}`);
  },
};

// Regional data API calls
export const regionAPI = {
  getAll: async () => {
    return apiRequest('/regions');
  },

  getUsersByRegion: async (regionId: string) => {
    return apiRequest(`/regions/${regionId}/users`);
  },
};

// Power distribution API calls
export const powerAPI = {
  getDistribution: async () => {
    return apiRequest('/power/distribution');
  },

  getTensionData: async () => {
    return apiRequest('/power/tension');
  },
};

// Reading methods API calls
export const readingAPI = {
  getMethods: async () => {
    return apiRequest('/readings/methods');
  },

  getHistory: async () => {
    return apiRequest('/readings/history');
  },
};

// Admin API calls
export const adminAPI = {
  getAll: async (role?: string, search?: string) => {
    let query = '';
    if (role || search) {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (search) params.append('search', search);
      query = `?${params.toString()}`;
    }
    return apiRequest(`/admin/${query}`, {}, true);
  },
  create: async (adminData: any) => {
    return apiRequest('/admin/', {
      method: 'POST',
      body: JSON.stringify(adminData),
    }, true);
  },
  update: async (id: string, adminData: any) => {
    return apiRequest(`/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(adminData),
    }, true);
  },
  delete: async (id: string) => {
    return apiRequest(`/admin/${id}`, {
      method: 'DELETE',
    }, true);
  },
  toggleStatus: async (id: string) => {
    return apiRequest(`/admin/${id}/status`, {
      method: 'PATCH',
    }, true);
  },
  getMetrics: async () => {
    return apiRequest('/admin/metrics', {}, true);
  },
};