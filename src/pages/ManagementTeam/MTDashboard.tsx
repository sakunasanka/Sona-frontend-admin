import React from 'react';
import { Users, Calendar, TrendingUp, Star, Activity, Clock } from 'lucide-react';
import Sidebar from '../../components/layout/MTSidebar'; // Adjust the path if Sidebar is located elsewhere
// Mock analytics data directly in this file
const mockAnalytics = {
  totalClients: 128,
  completedSessions: 342,
  averageRating: 4.7,
  monthlyGrowth: 5.2,
  sessionTrends: [
    { month: 'April', clients: 30, sessions: 80 },
    { month: 'May', clients: 40, sessions: 100 },
    { month: 'June', clients: 58, sessions: 162 }
  ]
};

type SessionTrend = {
  month: string;
  clients: number;
  sessions: number;
};

const MTDashboard : React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const stats = [
    {
      title: 'Total Clients',
      value: mockAnalytics.totalClients,
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Sessions',
      value: mockAnalytics.completedSessions,
      change: '+8%',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Provider Rating',
      value: mockAnalytics.averageRating,
      change: '+0.2',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      title: 'Monthly Growth',
      value: `${mockAnalytics.monthlyGrowth}%`,
      change: '+2.5%',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New client registered', user: 'Alice Williams', time: '2 hours ago' },
    { id: 2, action: 'Session completed', user: 'Dr. Sarah Johnson', time: '4 hours ago' },
    { id: 3, action: 'Report generated', user: 'John Smith', time: '6 hours ago' },
    { id: 4, action: 'Blog submitted for review', user: 'Michael Brown', time: '1 day ago' }
  ];

  const upcomingSessions = [
    { id: 1, client: 'Alice Williams', provider: 'Michael Brown', time: '2:00 PM', type: 'Counseling' },
    { id: 2, client: 'Robert Davis', provider: 'Dr. Sarah Johnson', time: '3:30 PM', type: 'Psychiatry' },
    { id: 3, client: 'Emma Wilson', provider: 'Michael Brown', time: '4:00 PM', type: 'Counseling' }
  ];

  return (
    <div className=" h-screen flex">

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
      <div className='overflow-auto w-10/12  m-4 '>

      <div className="flex items-center justify-between  ">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
<div className='flex mb-3 '>
  <div className='w-1/2 pr-4 '>
        {mockAnalytics.sessionTrends.slice(-3).map((trend: SessionTrend, index: number) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{trend.month}</p>
              <p className="text-sm text-gray-600">{trend.clients} new clients</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-600">{trend.sessions}</p>
              <p className="text-sm text-gray-500">sessions</p>
            </div>
          </div>
        ))}
</div>
        {/* Recent Activities */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-1/2 pr-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity: { id: number; action: string; user: string; time: string }) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
</div>
      {/* Upcoming Sessions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session.client}</p>
                  <p className="text-sm text-gray-600">with {session.provider}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{session.time}</p>
                <p className="text-sm text-gray-500">{session.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default MTDashboard;