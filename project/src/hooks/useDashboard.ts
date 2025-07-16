import { useState, useEffect } from 'react';
import { DashboardStats } from '../types';
import { dashboardAPI } from '../utils/api';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsData, chartsData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getChartData(),
      ]);

      setStats(statsData);
      setChartData(chartsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      console.error('Dashboard data fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    stats,
    chartData,
    isLoading,
    error,
    refreshData,
  };
};