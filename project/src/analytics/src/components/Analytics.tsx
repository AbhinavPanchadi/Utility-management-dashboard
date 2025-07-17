import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity,
  MousePointer,
  Target,
  DollarSign,
  ShoppingCart,
  UserCheck,
  Zap,
  PieChart,
  LineChart
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
    conversionRate: number;
  };
  traffic: {
    organic: number;
    direct: number;
    social: number;
    referral: number;
    email: number;
    paid: number;
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  topPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
    bounceRate: number;
  }>;
  realtimeUsers: number;
  weeklyData: Array<{
    day: string;
    users: number;
    sessions: number;
    pageviews: number;
  }>;
  countries: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock analytics data
  const mockData: AnalyticsData = {
    overview: {
      totalUsers: 28450,
      activeUsers: 8920,
      pageViews: 89340,
      bounceRate: 28.5,
      avgSessionDuration: '4m 15s',
      conversionRate: 6.2
    },
    traffic: {
      organic: 42,
      direct: 28,
      social: 18,
      referral: 7,
      email: 3,
      paid: 2
    },
    devices: {
      desktop: 48,
      mobile: 42,
      tablet: 10
    },
    topPages: [
      { page: '/home', views: 15680, uniqueViews: 12340, bounceRate: 22.4 },
      { page: '/courses', views: 12450, uniqueViews: 9870, bounceRate: 26.8 },
      { page: '/about', views: 8920, uniqueViews: 7450, bounceRate: 31.2 },
      { page: '/contact', views: 6780, uniqueViews: 5890, bounceRate: 35.6 },
      { page: '/blog', views: 5430, uniqueViews: 4680, bounceRate: 28.9 }
    ],
    realtimeUsers: 156,
    weeklyData: [
      { day: 'Mon', users: 1850, sessions: 2340, pageviews: 5680 },
      { day: 'Tue', users: 2120, sessions: 2890, pageviews: 6890 },
      { day: 'Wed', users: 2450, sessions: 3120, pageviews: 7890 },
      { day: 'Thu', users: 2280, sessions: 2980, pageviews: 7340 },
      { day: 'Fri', users: 2890, sessions: 3680, pageviews: 8920 },
      { day: 'Sat', users: 2340, sessions: 3120, pageviews: 7680 },
      { day: 'Sun', users: 1980, sessions: 2560, pageviews: 6240 }
    ],
    countries: [
      { country: 'India', users: 11380, percentage: 40.0 },
      { country: 'United States', users: 5690, percentage: 20.0 },
      { country: 'United Kingdom', users: 2845, percentage: 10.0 },
      { country: 'Canada', users: 2276, percentage: 8.0 },
      { country: 'Australia', users: 1707, percentage: 6.0 },
      { country: 'Others', users: 4552, percentage: 16.0 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1200);
  }, [timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    gradient,
    suffix = ''
  }: { 
    title: string; 
    value: string | number; 
    change: string;
    changeType: 'increase' | 'decrease';
    icon: React.ElementType; 
    gradient: string;
    suffix?: string;
  }) => (
    <div className={`${gradient} rounded-2xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="bg-white/20 rounded-full p-2 md:p-3">
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className={`flex items-center space-x-1 text-xs md:text-sm ${
          changeType === 'increase' ? 'text-green-200' : 'text-red-200'
        }`}>
          {changeType === 'increase' ? (
            <ArrowUp className="w-3 h-3 md:w-4 md:h-4" />
          ) : (
            <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />
          )}
          <span>{change}</span>
        </div>
      </div>
      <div>
        <p className="text-white/80 text-xs md:text-sm font-medium mb-1">{title}</p>
        <p className="text-xl md:text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</p>
      </div>
    </div>
  );

  const TrafficSourceCard = ({ source, percentage, color }: { source: string; percentage: number; color: string }) => (
    <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2 md:space-x-3">
        <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${color}`}></div>
        <span className="font-medium text-gray-900 capitalize text-sm md:text-base">{source}</span>
      </div>
      <div className="text-right">
        <span className="text-base md:text-lg font-semibold text-gray-900">{percentage}%</span>
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-gray-200 rounded-2xl p-4 md:p-6 animate-pulse">
            <div className="h-3 md:h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-6 md:h-8 bg-gray-300 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-48 md:h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Track your performance and user engagement</p>
        </div>
        <LoadingState />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600">Track your performance and user engagement</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm md:text-base"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Real-time Users */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs md:text-sm font-medium text-gray-600">Real-time Users</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-900">{data?.realtimeUsers}</span>
            </div>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <MetricCard
            title="Total Registered Users"
            value={data?.overview.totalUsers || 0}
            change="8.3%"
            changeType="increase"
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <MetricCard
            title="Monthly Active Users"
            value={data?.overview.activeUsers || 0}
            change="12.4%"
            changeType="increase"
            icon={UserCheck}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <MetricCard
            title="Total Page Views"
            value={data?.overview.pageViews || 0}
            change="18.7%"
            changeType="increase"
            icon={Eye}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <MetricCard
            title="Users Leave Quickly"
            value={data?.overview.bounceRate || 0}
            change="3.2%"
            changeType="decrease"
            icon={MousePointer}
            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
            suffix="%"
          />
          <MetricCard
            title="Time Spent Per Visit"
            value={data?.overview.avgSessionDuration || '0s'}
            change="7.8%"
            changeType="increase"
            icon={Clock}
            gradient="bg-gradient-to-br from-pink-500 to-pink-600"
          />
          <MetricCard
            title="Goal Completion Rate"
            value={data?.overview.conversionRate || 0}
            change="4.1%"
            changeType="increase"
            icon={Target}
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
            suffix="%"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
          {/* Weekly Traffic Chart */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Daily Visitors This Week</h3>
              <LineChart className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </div>
            <div className="h-48 md:h-64 flex items-end justify-between space-x-1 md:space-x-2">
              {data?.weeklyData.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg mb-2 hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer"
                    style={{ height: `${(day.users / 3000) * 200}px` }}
                    title={`${day.users} users`}
                  ></div>
                  <span className="text-xs text-gray-600 font-medium">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">How Users Find Us</h3>
              <PieChart className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </div>
            <div className="space-y-2 md:space-y-3">
              <TrafficSourceCard source="Google Search" percentage={data?.traffic.organic || 0} color="bg-green-500" />
              <TrafficSourceCard source="Direct Visit" percentage={data?.traffic.direct || 0} color="bg-blue-500" />
              <TrafficSourceCard source="Social Media" percentage={data?.traffic.social || 0} color="bg-purple-500" />
              <TrafficSourceCard source="Other Websites" percentage={data?.traffic.referral || 0} color="bg-orange-500" />
              <TrafficSourceCard source="Email Links" percentage={data?.traffic.email || 0} color="bg-pink-500" />
              <TrafficSourceCard source="Paid Ads" percentage={data?.traffic.paid || 0} color="bg-red-500" />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Pages */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Most Popular Pages</h3>
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 font-medium text-gray-600 text-sm">Page</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 font-medium text-gray-600 text-sm">Total Views</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 font-medium text-gray-600 text-sm">Unique Visitors</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 font-medium text-gray-600 text-sm">Quick Exits</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.topPages.map((page, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 md:py-3 px-2 md:px-4 font-medium text-gray-900 text-sm">{page.page}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-right text-gray-600 text-sm">{page.views.toLocaleString()}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-right text-gray-600 text-sm">{page.uniqueViews.toLocaleString()}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          page.bounceRate < 30 
                            ? 'bg-green-100 text-green-800' 
                            : page.bounceRate < 40 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {page.bounceRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device & Location Stats */}
          <div className="space-y-4 md:space-y-6">
            {/* Device Breakdown */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Device Usage</h3>
                <Monitor className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Monitor className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    <span className="font-medium text-gray-900 text-sm md:text-base">Desktop</span>
                  </div>
                  <span className="text-base md:text-lg font-semibold text-gray-900">{data?.devices.desktop}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Smartphone className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    <span className="font-medium text-gray-900 text-sm md:text-base">Mobile</span>
                  </div>
                  <span className="text-base md:text-lg font-semibold text-gray-900">{data?.devices.mobile}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Monitor className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    <span className="font-medium text-gray-900 text-sm md:text-base">Tablet</span>
                  </div>
                  <span className="text-base md:text-lg font-semibold text-gray-900">{data?.devices.tablet}%</span>
                </div>
              </div>
            </div>

            {/* Top Countries */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Visitor Locations</h3>
                <Globe className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </div>
              <div className="space-y-2 md:space-y-3">
                {data?.countries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 text-sm md:text-base">{country.country}</span>
                    <div className="text-right">
                      <div className="text-xs md:text-sm font-semibold text-gray-900">{country.users.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{country.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;