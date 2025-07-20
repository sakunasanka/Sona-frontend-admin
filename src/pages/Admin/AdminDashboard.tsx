import React, { useState } from 'react';
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
} from 'recharts';
import {
  Users,
  MessageCircle,
  Clock,
  Star,
  Activity,
  BarChart3,
  ArrowRight,
  Calendar,
  BookOpen,
  HandCoins
} from "lucide-react";

const metrics = [
  { 
    label: 'Total Counselors', 
    value: 24,
    icon: Users,
    color: "bg-blue-100",
    textcolor: "text-blue-600"
  },
  { 
    label: 'Total Sessions', 
    value: 128,
    icon: MessageCircle,
    color: "bg-green-100",
    textcolor: "text-green-600"
  },
  { 
    label: 'Total Psychiatrists', 
    value: 8,
    icon: Users,
    color: "bg-purple-100",
    textcolor: "text-purple-600"
  },
  { 
    label: 'Total Revenue', 
    value: 'Rs.12,000',
    icon: HandCoins,
    color: "bg-yellow-100",
    textcolor: "text-yellow-600"
  },
];

const lineData1 = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 200 },
  { name: 'May', value: 400 },
];

const lineData2 = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 28 },
  { name: 'Thu', value: 60 },
  { name: 'Fri', value: 50 },
];

const userDistributionData = [
  { name: 'Clients (18-25)', value: 45 },
  { name: 'Clients (26-35)', value: 30 },
  { name: 'Clients (36-50)', value: 15 },
  { name: 'Clients (50+)', value: 10 },
];

const sessionStatusData = [
  { name: 'Completed', value: 240 },
  { name: 'Pending', value: 120 },
  { name: 'Cancelled', value: 60 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UserDistributionSection = () => {
  const totalUsers = userDistributionData.reduce((sum, group) => sum + group.value, 0);
  const mostActiveGroup = userDistributionData.reduce((max, group) => 
    max.value > group.value ? max : group
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">User Demographics</h2>
          <p className="text-sm text-gray-600">Breakdown of platform users by age groups</p>
        </div>
        <Users className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={userDistributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={false}
                labelLine={false}
              >
                {userDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [
                  `${value} users`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats Breakdown */}
        <div className="w-full lg:w-1/2">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Age Group Distribution</h3>
            
            {userDistributionData.map((group, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium">{group.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{group.value} users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${(group.value / totalUsers) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  ></div>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="text-sm font-semibold">{totalUsers}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Most Active Group</span>
                <span className="text-sm font-semibold">{mostActiveGroup.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionStatusSection = () => {
  const totalSessions = sessionStatusData.reduce((sum, group) => sum + group.value, 0);
  const completionRate = ((sessionStatusData[0].value / totalSessions) * 100).toFixed(0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Session Status</h2>
          <p className="text-sm text-gray-600">Overview of session completion rates</p>
        </div>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sessionStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={false}
                labelLine={false}
              >
                {sessionStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [
                  `${value} sessions`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats Breakdown */}
        <div className="w-full lg:w-1/2">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Session Statistics</h3>
            
            {sessionStatusData.map((group, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium">{group.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{group.value} sessions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${(group.value / totalSessions) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  ></div>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="text-sm font-semibold">{totalSessions}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-semibold">{completionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={closeSidebar} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={toggleSidebar} />
          
          <div className="p-4 lg:p-6">
            {/* Page Header */}
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600">Overview of platform metrics and statistics</p>
                </div>
              </div>
            </div>
            
            {/* First line: Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 ${metric.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-5 h-5 lg:w-6 lg:h-6 ${metric.textcolor}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">{metric.value}</p>
                        <p className="text-gray-600 text-xs lg:text-sm leading-tight">{metric.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Second line: Two Line Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Monthly Users</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 transition-colors">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData1}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#64748b" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Daily Sessions</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 transition-colors">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData2}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#475f76" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Third line: Enhanced Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <UserDistributionSection />
              <SessionStatusSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}