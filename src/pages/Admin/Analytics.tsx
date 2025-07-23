import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Heart,
  BarChart3,
  Activity,
  UserCheck,
  MessageCircle,
  Star,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  ChevronDown,
  MapPin,
  Phone,
  Globe,
  Award
} from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('7d');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Mock data for Sri Lankan counselling analytics
  const metrics = [
    {
      title: 'Total Clients',
      value: '1,847',
      change: '+18.5%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Sessions This Month',
      value: '892',
      change: '+12.3%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: 'LKR 2,450,000',
      change: '+22.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Avg Session Rating',
      value: '4.7/5',
      change: '+0.3',
      trend: 'up',
      icon: Star,
      color: 'bg-yellow-500'
    },
  ];

  const sessionData = [
    { day: 'Mon', sessions: 38 },
    { day: 'Tue', sessions: 45 },
    { day: 'Wed', sessions: 32 },
    { day: 'Thu', sessions: 52 },
    { day: 'Fri', sessions: 48 },
    { day: 'Sat', sessions: 25 },
    { day: 'Sun', sessions: 18 }
  ];

  const monthlyData = [
    { month: 'Jan', clients: 120, sessions: 210 },
    { month: 'Feb', clients: 145, sessions: 235 },
    { month: 'Mar', clients: 180, sessions: 280 },
    { month: 'Apr', clients: 210, sessions: 320 },
    { month: 'May', clients: 240, sessions: 380 },
    { month: 'Jun', clients: 280, sessions: 420 },
  ];

  const recentActivities = [
    {
      type: 'session',
      message: 'Dr. Priyanka Perera completed family therapy session in Colombo',
      time: '5 minutes ago',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      type: 'appointment',
      message: 'New appointment booked for anxiety counseling in Kandy',
      time: '20 minutes ago',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      type: 'feedback',
      message: 'Client from Galle provided 5-star rating for depression therapy',
      time: '1 hour ago',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      type: 'message',
      message: 'Dr. Chaminda sent follow-up in Sinhala to client in Matara',
      time: '2 hours ago',
      icon: MessageCircle,
      color: 'text-purple-600'
    },
  ];

  const topCounselors = [
    { 
      name: 'Dr. Priyanka Perera', 
      sessions: 67, 
      rating: 4.9, 
      specialty: 'Family & Marriage Counseling',
    },
    { 
      name: 'Dr. Chaminda Silva', 
      sessions: 58, 
      rating: 4.8, 
      specialty: 'Depression & Anxiety',
    },
    { 
      name: 'Dr. Kavitha Rajendran', 
      sessions: 52, 
      rating: 4.9, 
      specialty: 'Child Psychology',
    },
  ];

  const specialtyData = [
    { name: 'Depression', value: 35 },
    { name: 'Anxiety', value: 25 },
    { name: 'Family', value: 20 },
    { name: 'Trauma', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={closeSidebar} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={toggleSidebar} />
          
          <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Heart className="text-emerald-600" size={24} />
                  MindCare Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Insights and metrics for your counseling platform
                </p>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter size={16} />
                    Last {timeFilter === '7d' ? '7 days' : timeFilter === '30d' ? '30 days' : '90 days'}
                    <ChevronDown size={16} />
                  </button>
                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      {['7d', '30d', '90d'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setTimeFilter(filter);
                            setIsFilterOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          Last {filter === '7d' ? '7 days' : filter === '30d' ? '30 days' : '90 days'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* First line: Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-lg p-6 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-500">{metric.title}</span>
                      <span className="text-3xl font-semibold mt-2 block">{metric.value}</span>
                    </div>
                    <div className={`p-3 rounded-lg ${metric.color}`}>
                      <metric.icon className="text-white" size={24} />
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Second line: Two Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="text-blue-600" size={20} />
                  Weekly Sessions
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sessionData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={20} />
                  Monthly Growth
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="clients" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Clients"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Sessions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Third line: Pie Chart and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="text-purple-600" size={20} />
                  Session Types
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={specialtyData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {specialtyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="text-yellow-600" size={20} />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                        <activity.icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fourth line: Top Counselors */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Award className="text-red-600" size={20} />
                Top Performing Counselors
              </h3>
              <div className="space-y-4">
                {topCounselors.map((counselor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {counselor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{counselor.name}</p>
                        <p className="text-sm text-gray-600">{counselor.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{counselor.sessions} sessions</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="text-yellow-500" size={14} fill="currentColor" />
                        <span className="text-sm text-gray-600">{counselor.rating}</span>
                      </div>
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