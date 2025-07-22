// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  region: string;
  segment: string;
  phase: '1-phase' | '3-phase';
  createdAt: string;
  updatedAt: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  alertCases: number;
}

// Chart data types
export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export interface PowerDistributionData extends ChartDataItem {}

export interface RegionalData extends ChartDataItem {}

export interface ReadingMethodData {
  name: string;
  value: number;
}

export interface CustomerSegment {
  name: string;
  percentage: number;
  color: string;
}

export interface PhaseData {
  singlePhase: number;
  threePhase: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Table data types
export interface TariffData {
  category: string;
  count: number;
}

export interface ActivityData {
  activity: string;
  count: number;
}

export interface AgencyData {
  agency: string;
  count: number;
}

// Authentication types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  avatar?: string;
  created_at: string;
  roles?: string[];
  permissions?: string[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}