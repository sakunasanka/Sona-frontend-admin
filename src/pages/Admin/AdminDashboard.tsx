import { useState, useEffect } from 'react';
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
  ArrowRight,
  Calendar,
  HandCoins,
  UserCheck,
  Award,
  LogIn,
  UserCog,
  Stethoscope,
  RefreshCw
} from "lucide-react";
import API from '../../api/api';

// Types
interface DashboardMetrics {
  totalCounselors: number;
  totalPsychiatrists: number;
  totalSessions: number;
  totalRevenue: string;
}

interface LoginMetrics {
  counselorLogins: number;
  psychiatristLogins: number;
  clientLogins: number;
  managementLogins: number;
}

interface SessionMetrics {
  counselorSessions: number;
  psychiatristSessions: number;
  completedSessions: number;
  ongoingSessions: number;
  scheduledSessions: number;
}

interface ChartData {
  name?: string;
  value?: number;
  month?: string;
  clients?: number;
  sessions?: number;
}

interface TopCounselor {
  name: string;
  sessions: number;
  rating: number;
  specialty: string;
}

interface RecentActivity {
  type: string;
  message: string;
  time: string;
  icon: any;
  color: string;
}

interface DashboardData {
  metrics: DashboardMetrics;
  loginMetrics: LoginMetrics;
  sessionMetrics: SessionMetrics;
  userDistributionData: ChartData[];
  sessionStatusData: ChartData[];
  monthlyData: ChartData[];
  lineData1: ChartData[];
  lineData2: ChartData[];
  specialtyData: ChartData[];
  topCounselors: TopCounselor[];
  recentActivities: RecentActivity[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// New component for Login Metrics
const LoginMetricsSection = ({ loginMetrics }: { loginMetrics: LoginMetrics }) => {
  const loginMetricsArray = [
    { 
      label: 'Counselor Logins', 
      value: loginMetrics.counselorLogins.toLocaleString(),
      icon: UserCog,
      color: "bg-indigo-100",
      textcolor: "text-indigo-600"
    },
    { 
      label: 'Psychiatrist Logins', 
      value: loginMetrics.psychiatristLogins.toLocaleString(),
      icon: Stethoscope,
      color: "bg-purple-100",
      textcolor: "text-purple-600"
    },
    { 
      label: 'Client Logins', 
      value: loginMetrics.clientLogins.toLocaleString(),
      icon: Users,
      color: "bg-cyan-100",
      textcolor: "text-cyan-600"
    },
    { 
      label: 'Management Logins', 
      value: loginMetrics.managementLogins.toLocaleString(),
      icon: UserCheck,
      color: "bg-orange-100",
      textcolor: "text-orange-600"
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">User Login Statistics</h2>
          <p className="text-sm text-gray-600">Total logins by user type</p>
        </div>
        <LogIn className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loginMetricsArray.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${metric.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${metric.textcolor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                  <p className="text-gray-600 text-xs leading-tight">{metric.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// New component for Session Breakdown
const SessionBreakdownSection = ({ sessionMetrics }: { sessionMetrics: SessionMetrics }) => {
  const sessionMetricsArray = [
    { 
      label: 'Counselor Sessions', 
      value: sessionMetrics.counselorSessions,
      icon: UserCog,
      color: "bg-blue-100",
      textcolor: "text-blue-600"
    },
    { 
      label: 'Psychiatrist Sessions', 
      value: sessionMetrics.psychiatristSessions,
      icon: Stethoscope,
      color: "bg-purple-100",
      textcolor: "text-purple-600"
    },
    { 
      label: 'Completed Sessions', 
      value: sessionMetrics.completedSessions,
      icon: Award,
      color: "bg-green-100",
      textcolor: "text-green-600"
    },
    { 
      label: 'Ongoing Sessions', 
      value: sessionMetrics.ongoingSessions,
      icon: Clock,
      color: "bg-yellow-100",
      textcolor: "text-yellow-600"
    },
    { 
      label: 'Scheduled Sessions', 
      value: sessionMetrics.scheduledSessions,
      icon: Calendar,
      color: "bg-orange-100",
      textcolor: "text-orange-600"
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Session Breakdown</h2>
          <p className="text-sm text-gray-600">Detailed session statistics by type and status</p>
        </div>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {sessionMetricsArray.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${metric.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${metric.textcolor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                  <p className="text-gray-600 text-xs leading-tight">{metric.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UserDistributionSection = ({ userDistributionData }: { userDistributionData: ChartData[] }) => {
  const totalUsers = userDistributionData.reduce((sum, group) => sum + (group.value || 0), 0);
  const mostActiveGroup = userDistributionData.length > 0 
    ? userDistributionData.reduce((max, group) => 
        (max.value || 0) > (group.value || 0) ? max : group
      )
    : { name: 'No data', value: 0 };

  const hasData = userDistributionData.length > 0 && totalUsers > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">User Demographics</h2>
          <p className="text-sm text-gray-600">Breakdown of platform users by age groups</p>
        </div>
        <Users className="w-5 h-5 text-gray-400" />
      </div>
      
      {!hasData ? (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No user distribution data available</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
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
                  {userDistributionData.map((_, index) => (
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
                    <span className="text-sm font-semibold">{group.value || 0} users</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${((group.value || 0) / totalUsers) * 100}%`,
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
                  <span className="text-sm font-semibold">{mostActiveGroup.name || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SessionStatusSection = ({ sessionStatusData }: { sessionStatusData: ChartData[] }) => {
  const totalSessions = sessionStatusData.reduce((sum, group) => sum + (group.value || 0), 0);
  const completionRate = sessionStatusData.length > 0 && sessionStatusData[0].value ? ((sessionStatusData[0].value / totalSessions) * 100).toFixed(0) : '0';
  const hasData = sessionStatusData.length > 0 && totalSessions > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Session Status</h2>
          <p className="text-sm text-gray-600">Overview of session completion rates</p>
        </div>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>
      
      {!hasData ? (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          <div className="text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No session status data available</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
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
                  {sessionStatusData.map((_, index) => (
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
                    <span className="text-sm font-semibold">{group.value || 0} sessions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${((group.value || 0) / totalSessions) * 100}%`,
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
      )}
    </div>
  );
};

const AnalyticsSection = ({ 
  lineData1, 
  lineData2, 
  monthlyData, 
  specialtyData 
}: { 
  lineData1: ChartData[];
  lineData2: ChartData[];
  monthlyData: ChartData[];
  specialtyData: ChartData[];
}) => {
  return (
    <>
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
            {lineData1.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No monthly user data available</p>
                </div>
              </div>
            ) : (
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
            )}
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
            {lineData2.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No daily session data available</p>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Monthly Growth</h2>
          </div>
          <div className="h-[300px]">
            {monthlyData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No monthly growth data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
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
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Session Types</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-[300px]">
            {specialtyData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No session type data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
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
                    {specialtyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const RecentActivitySection = ({ recentActivities }: { recentActivities: RecentActivity[] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Activity</h2>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      {recentActivities.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activities available</p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

const TopCounselorsSection = ({ topCounselors }: { topCounselors: TopCounselor[] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Top Performing Counselors</h2>
        <Award className="w-5 h-5 text-gray-400" />
      </div>
      {topCounselors.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          <div className="text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No counselor performance data available</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {topCounselors.map((counselor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <UserCheck size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{counselor.name}</p>
                  <p className="text-xs text-gray-600">{counselor.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{counselor.sessions} sessions</p>
                <div className="flex items-center gap-1 justify-end">
                  <Star className="text-yellow-500" size={14} fill="currentColor" />
                  <span className="text-xs text-gray-600">{counselor.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    metrics: {
      totalCounselors: 0,
      totalPsychiatrists: 0,
      totalSessions: 0,
      totalRevenue: 'Rs.0'
    },
    loginMetrics: {
      counselorLogins: 0,
      psychiatristLogins: 0,
      clientLogins: 0,
      managementLogins: 0
    },
    sessionMetrics: {
      counselorSessions: 0,
      psychiatristSessions: 0,
      completedSessions: 0,
      ongoingSessions: 0,
      scheduledSessions: 0
    },
    userDistributionData: [],
    sessionStatusData: [],
    monthlyData: [],
    lineData1: [],
    lineData2: [],
    specialtyData: [],
    topCounselors: [],
    recentActivities: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data from backend APIs
      const [
        metricsResponse,
        loginMetricsResponse,
        sessionMetricsResponse,
        userDistributionResponse,
        sessionStatusResponse,
        monthlyDataResponse,
        dailyUsersResponse,
        dailySessionsResponse,
        specialtyDataResponse,
        topCounselorsResponse,
        recentActivitiesResponse
      ] = await Promise.allSettled([
        API.get('/admin/dashboard/metrics'),
        API.get('/admin/dashboard/login-metrics'),
        API.get('/admin/dashboard/session-metrics'),
        API.get('/admin/dashboard/user-distribution'),
        API.get('/admin/dashboard/session-status'),
        API.get('/admin/dashboard/monthly-data'),
        API.get('/admin/dashboard/daily-users'),
        API.get('/admin/dashboard/daily-sessions'),
        API.get('/admin/dashboard/specialty-data'),
        API.get('/admin/dashboard/top-counselors'),
        API.get('/admin/dashboard/recent-activities')
      ]);

      // Process metrics data
      const metrics = metricsResponse.status === 'fulfilled' 
        ? metricsResponse.value.data 
        : {
            totalCounselors: 0,
            totalPsychiatrists: 0,
            totalSessions: 0,
            totalRevenue: 'Rs.0'
          };

      // Process login metrics data
      const loginMetrics = loginMetricsResponse.status === 'fulfilled'
        ? loginMetricsResponse.value.data
        : {
            counselorLogins: 0,
            psychiatristLogins: 0,
            clientLogins: 0,
            managementLogins: 0
          };

      // Process session metrics data
      const sessionMetrics = sessionMetricsResponse.status === 'fulfilled'
        ? sessionMetricsResponse.value.data
        : {
            counselorSessions: 0,
            psychiatristSessions: 0,
            completedSessions: 0,
            ongoingSessions: 0,
            scheduledSessions: 0
          };

      // Process chart data
      const userDistributionData = userDistributionResponse.status === 'fulfilled'
        ? userDistributionResponse.value.data
        : [];

      const sessionStatusData = sessionStatusResponse.status === 'fulfilled'
        ? sessionStatusResponse.value.data
        : [];

      const monthlyData = monthlyDataResponse.status === 'fulfilled'
        ? monthlyDataResponse.value.data
        : [];

      const lineData1 = dailyUsersResponse.status === 'fulfilled'
        ? dailyUsersResponse.value.data
        : [];

      const lineData2 = dailySessionsResponse.status === 'fulfilled'
        ? dailySessionsResponse.value.data
        : [];

      const specialtyData = specialtyDataResponse.status === 'fulfilled'
        ? specialtyDataResponse.value.data
        : [];

      const topCounselors = topCounselorsResponse.status === 'fulfilled'
        ? topCounselorsResponse.value.data
        : [];

      const recentActivities = recentActivitiesResponse.status === 'fulfilled'
        ? recentActivitiesResponse.value.data.map((activity: any) => ({
            ...activity,
            icon: getActivityIcon(activity.type),
            color: getActivityColor(activity.type)
          }))
        : [];

      setDashboardData({
        metrics,
        loginMetrics,
        sessionMetrics,
        userDistributionData,
        sessionStatusData,
        monthlyData,
        lineData1,
        lineData2,
        specialtyData,
        topCounselors,
        recentActivities
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for activity icons and colors
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session':
        return MessageCircle;
      case 'appointment':
        return Calendar;
      case 'feedback':
        return Star;
      case 'registration':
        return UserCheck;
      case 'login':
        return LogIn;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'session':
        return 'text-green-600';
      case 'appointment':
        return 'text-blue-600';
      case 'feedback':
        return 'text-yellow-600';
      case 'registration':
        return 'text-purple-600';
      case 'login':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={toggleSidebar} />
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-lg text-gray-600">Loading dashboard...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={toggleSidebar} />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    { 
      label: 'Total Counselors', 
      value: dashboardData.metrics.totalCounselors,
      icon: Users,
      color: "bg-blue-100",
      textcolor: "text-blue-600"
    },
    { 
      label: 'Total Psychiatrists', 
      value: dashboardData.metrics.totalPsychiatrists,
      icon: Stethoscope,
      color: "bg-purple-100",
      textcolor: "text-purple-600"
    },
    { 
      label: 'Total Sessions', 
      value: dashboardData.metrics.totalSessions,
      icon: MessageCircle,
      color: "bg-green-100",
      textcolor: "text-green-600"
    },
    { 
      label: 'Total Revenue', 
      value: dashboardData.metrics.totalRevenue,
      icon: HandCoins,
      color: "bg-yellow-100",
      textcolor: "text-yellow-600"
    },
  ];

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
                  <p className="text-gray-600">Comprehensive overview of platform metrics and statistics</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
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

            {/* Login Metrics Section */}
            <LoginMetricsSection loginMetrics={dashboardData.loginMetrics} />

            {/* Session Breakdown Section */}
            <SessionBreakdownSection sessionMetrics={dashboardData.sessionMetrics} />

            {/* Analytics Charts */}
            <AnalyticsSection 
              lineData1={dashboardData.lineData1}
              lineData2={dashboardData.lineData2}
              monthlyData={dashboardData.monthlyData}
              specialtyData={dashboardData.specialtyData}
            />

            {/* User and Session Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <UserDistributionSection userDistributionData={dashboardData.userDistributionData} />
              <SessionStatusSection sessionStatusData={dashboardData.sessionStatusData} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <RecentActivitySection recentActivities={dashboardData.recentActivities} />
              <TopCounselorsSection topCounselors={dashboardData.topCounselors} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}