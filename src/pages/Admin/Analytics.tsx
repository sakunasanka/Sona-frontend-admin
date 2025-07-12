 import React from 'react';
import { TrendingUp, Users, Calendar, Star, Activity, DollarSign } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';

interface Analytics {
  totalClients: number;
  activeClients: number;
  totalSessions: number;
  completedSessions: number;
  totalProviders: number;
  activeProviders: number;
  averageRating: number;
  monthlyGrowth: number;
  revenueGrowth: number;
  sessionTrends: {
    month: string;
    sessions: number;
    clients: number;
  }[];
}

export const mockAnalytics: Analytics = {
    totalClients: 145,
    activeClients: 128,
    totalSessions: 1250,
    completedSessions: 1180,
    totalProviders: 12,
    activeProviders: 11,
    averageRating: 4.6,
    monthlyGrowth: 12.5,
    revenueGrowth: 8.3,
    sessionTrends: [
      { month: 'Jan', sessions: 95, clients: 20 },
      { month: 'Feb', sessions: 110, clients: 25 },
      { month: 'Mar', sessions: 125, clients: 30 },
      { month: 'Apr', sessions: 140, clients: 35 },
      { month: 'May', sessions: 155, clients: 40 },
      { month: 'Jun', sessions: 170, clients: 45 }
    ]
  };
  
const Analytics: React.FC = () => {
  const analytics = mockAnalytics;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const chartData = analytics.sessionTrends.map((trend, index) => ({
    ...trend,
    height: (trend.sessions / Math.max(...analytics.sessionTrends.map(t => t.sessions))) * 100
  }));

  return (
    <div className="space-y-6 flex h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>

    <div className='w-10/12 mx-auto p-6 bg-gray-100'>
    

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <StatCard
          title="Total Clients"
          value={analytics.totalClients}
          change={analytics.monthlyGrowth}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Sessions"
          value={analytics.totalSessions}
          change={8.2}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Average Rating"
          value={analytics.averageRating}
          change={2.1}
          icon={Star}
          color="bg-yellow-500"
        />
        <StatCard
          title="Revenue Growth"
          value={`${analytics.revenueGrowth}%`}
          change={analytics.revenueGrowth}
          icon={DollarSign}
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Session Trends Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Trends</h3>
          <div className="flex items-end justify-between space-x-2 h-48">
            {chartData.map((data: typeof chartData[number], index: number) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t-lg mb-2 relative">
                  <div
                    className="bg-blue-500 rounded-t-lg transition-all duration-300"
                    style={{ height: `${data.height}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 text-center">
                  <div className="font-medium">{data.month}</div>
                  <div>{data.sessions}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 ">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Growth</h3>
          <div className="flex items-end justify-between space-x-2 h-48">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t-lg mb-2 relative">
                  <div
                    className="bg-green-500 rounded-t-lg transition-all duration-300"
                    style={{ height: `${(data.clients / Math.max(...chartData.map(d => d.clients))) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 text-center">
                  <div className="font-medium">{data.month}</div>
                  <div>{data.clients}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Dr. Sarah Johnson</p>
                <p className="text-sm text-gray-600">Psychiatrist</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">4.8</p>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Michael Brown</p>
                <p className="text-sm text-gray-600">Counsellor</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">4.6</p>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Clients</span>
              <span className="font-medium text-gray-900">
                {analytics.activeClients}/{analytics.totalClients}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Session Completion Rate</span>
              <span className="font-medium text-gray-900">
                {((analytics.completedSessions / analytics.totalSessions) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Providers</span>
              <span className="font-medium text-gray-900">
                {analytics.activeProviders}/{analytics.totalProviders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">System Uptime</span>
              <span className="font-medium text-green-600">99.8%</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Analytics;