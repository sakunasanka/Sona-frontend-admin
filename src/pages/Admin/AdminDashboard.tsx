import { useState, useEffect } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
  ongoingSessions: number | null;
  scheduledSessions: number;
  cancelledSessions?: number;
  totalSessions?: number;
}

interface ChartData {
  name?: string;
  value?: number;
  month?: string;
  clients?: number;
  sessions?: number;
  revenue?: number;
}

interface MetricCard {
  label: string;
  value: string | number;
  secondaryValue?: string;
  secondaryLabel?: string;
  icon: any;
  color: string;
  textcolor: string;
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
  monthlyData: ChartData[];
  monthlyRevenueData: ChartData[];
  lineData1: ChartData[];
  lineData2: ChartData[];
  topCounselors: TopCounselor[];
  recentActivities: RecentActivity[];
}

const MonthlyRevenueSection = ({ monthlyRevenueData }: { monthlyRevenueData: ChartData[] }) => {

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Monthly Revenue</h2>
          <p className="text-sm text-gray-600">Revenue trends over the past 6 months</p>
        </div>
        <HandCoins className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="h-[300px]">
        {monthlyRevenueData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <HandCoins className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No revenue data available</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`Rs.${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* {monthlyRevenueData.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-lg font-bold text-gray-900">Rs.{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Monthly</p>
            <p className="text-lg font-bold text-gray-900">Rs.{averageRevenue.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Latest Month</p>
            <p className="text-lg font-bold text-gray-900">Rs.{latestRevenue.toLocaleString()}</p>
          </div>
        </div>
      )} */}
    </div>
  );
};

// New component for Login Metrics
const LoginMetricsSection = ({ loginMetrics }: { loginMetrics: LoginMetrics }) => {
  const loginMetricsArray = [
    { 
      label: 'Counselor Logins', 
      value: (loginMetrics.counselorLogins || 0).toLocaleString(),
      icon: UserCog,
      color: "bg-indigo-100",
      textcolor: "text-indigo-600"
    },
    { 
      label: 'Psychiatrist Logins', 
      value: (loginMetrics.psychiatristLogins || 0).toLocaleString(),
      icon: Stethoscope,
      color: "bg-purple-100",
      textcolor: "text-purple-600"
    },
    { 
      label: 'Client Logins', 
      value: (loginMetrics.clientLogins || 0).toLocaleString(),
      icon: Users,
      color: "bg-cyan-100",
      textcolor: "text-cyan-600"
    },
    { 
      label: 'Management Logins', 
      value: (loginMetrics.managementLogins || 0).toLocaleString(),
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
      value: sessionMetrics.counselorSessions || 0,
      icon: UserCog,
      color: "bg-blue-100",
      textcolor: "text-blue-600"
    },
    { 
      label: 'Psychiatrist Sessions', 
      value: sessionMetrics.psychiatristSessions || 0,
      icon: Stethoscope,
      color: "bg-purple-100",
      textcolor: "text-purple-600"
    },
    { 
      label: 'Completed Sessions', 
      value: sessionMetrics.completedSessions || 0,
      icon: Award,
      color: "bg-green-100",
      textcolor: "text-green-600"
    },
    { 
      label: 'Ongoing Sessions', 
      value: sessionMetrics.ongoingSessions || 0,
      icon: Clock,
      color: "bg-yellow-100",
      textcolor: "text-yellow-600"
    },
    { 
      label: 'Scheduled Sessions', 
      value: sessionMetrics.scheduledSessions || 0,
      icon: Calendar,
      color: "bg-orange-100",
      textcolor: "text-orange-600"
    },
    ...(sessionMetrics.cancelledSessions !== undefined ? [{ 
      label: 'Cancelled Sessions', 
      value: sessionMetrics.cancelledSessions || 0,
      icon: Clock,
      color: "bg-red-100",
      textcolor: "text-red-600"
    }] : []),
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

    {/* ✅ First Row (3 cards) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {sessionMetricsArray.slice(0, 3).map((metric, index) => {
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

    {/* ✅ Second Row (remaining cards) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessionMetricsArray.slice(3).map((metric, index) => {
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

  // return (
  //   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-8">
  //     <div className="flex items-center justify-between mb-6">
  //       <div>
  //         <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Session Breakdown</h2>
  //         <p className="text-sm text-gray-600">Detailed session statistics by type and status</p>
  //       </div>
  //       <Activity className="w-5 h-5 text-gray-400" />
  //     </div>
      
  //     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  //       {sessionMetricsArray.map((metric, index) => {
  //         const IconComponent = metric.icon;
  //         return (
  //           <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
  //             <div className="flex items-center gap-3">
  //               <div className={`w-10 h-10 ${metric.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
  //                 <IconComponent className={`w-5 h-5 ${metric.textcolor}`} />
  //               </div>
  //               <div className="min-w-0 flex-1">
  //                 <p className="text-lg font-bold text-gray-900">{metric.value}</p>
  //                 <p className="text-gray-600 text-xs leading-tight">{metric.label}</p>
  //               </div>
  //             </div>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
};

const AnalyticsSection = ({
  lineData1,
  lineData2
}: {
  lineData1: ChartData[];
  lineData2: ChartData[];
}) => {
  return (
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
  );
};const RecentActivitySection = ({ recentActivities }: { recentActivities: RecentActivity[] }) => {
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
                  <span className="text-xs text-gray-600">{counselor.rating.toFixed(1)}</span>
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
    monthlyData: [],
    monthlyRevenueData: [],
    lineData1: [],
    lineData2: [],
    topCounselors: [],
    recentActivities: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting dashboard data fetch...');

      // Fetch all dashboard data from backend APIs using the correct endpoints
      const [
        metricsResponse,
        loginMetricsResponse,
        sessionBreakdownResponse,
        userDistributionResponse,
        monthlyUsersResponse,
        dailySessionsResponse,
        monthlyGrowthResponse,
        monthlyRevenueResponse,
        topCounselorsResponse,
        recentActivitiesResponse
      ] = await Promise.allSettled([
        API.get('/admin/dashboard/metrics'),
        API.get('/admin/dashboard/login-metrics?period=30d'),
        API.get('/admin/dashboard/session-breakdown'),
        API.get('/admin/dashboard/user-distribution'),
        API.get('/admin/dashboard/monthly-users?months=5'),
        API.get('/admin/dashboard/daily-sessions?days=7'),
        API.get('/admin/dashboard/monthly-growth?months=6'),
        API.get('/admin/dashboard/monthly-revenue?months=6'),
        API.get('/admin/dashboard/top-counselors?limit=10&period=30d'),
        API.get('/admin/dashboard/recent-activities?limit=10')
      ]);

      console.log('API Responses Status:', {
        metrics: metricsResponse.status,
        loginMetrics: loginMetricsResponse.status,
        sessionBreakdown: sessionBreakdownResponse.status,
        userDistribution: userDistributionResponse.status,
        monthlyUsers: monthlyUsersResponse.status,
        dailySessions: dailySessionsResponse.status,
        monthlyGrowth: monthlyGrowthResponse.status,
        monthlyRevenue: monthlyRevenueResponse.status,
        topCounselors: topCounselorsResponse.status,
        recentActivities: recentActivitiesResponse.status
      });

      // Process monthly revenue data first (needed for total revenue calculation)
      let monthlyRevenueData: ChartData[] = [];
      let totalRevenue = 0;
      if (monthlyRevenueResponse.status === 'fulfilled') {
        console.log('Monthly revenue data:', monthlyRevenueResponse.value.data);
        const responseData = monthlyRevenueResponse.value.data;
        const monthlyRevenueRaw = responseData.data || responseData;
        if (Array.isArray(monthlyRevenueRaw)) {
          monthlyRevenueData = monthlyRevenueRaw.map((item: any) => {
            totalRevenue += item.revenue || 0;
            return {
              month: item.month,
              revenue: item.revenue || 0
            };
          });
        }
      } else {
        console.error('Monthly revenue API failed:', monthlyRevenueResponse.reason);
      }

      // Process metrics data - expecting array format from backend
      let metrics = {
        totalCounselors: 0,
        totalPsychiatrists: 0,
        totalSessions: 0,
        totalRevenue: 'Rs.0'
      };

      if (metricsResponse.status === 'fulfilled') {
        console.log('Metrics data:', metricsResponse.value.data);
        const responseData = metricsResponse.value.data;
        // Handle the case where data might be wrapped in a success object
        const metricsArray = responseData.data || responseData;
        console.log('Metrics array:', metricsArray);
        
        if (Array.isArray(metricsArray)) {
          metrics = {
            totalCounselors: metricsArray.find((m: any) => m.label === 'Total Counselors')?.value || 0,
            totalPsychiatrists: metricsArray.find((m: any) => m.label === 'Total Psychiatrists')?.value || 0,
            totalSessions: metricsArray.find((m: any) => m.label === 'Total Sessions')?.value || 0,
            totalRevenue: totalRevenue > 0 ? `Rs.${totalRevenue.toLocaleString()}` : (metricsArray.find((m: any) => m.label === 'Total Revenue')?.value || 'Rs.0')
          };
        } else {
          console.error('Metrics data is not an array:', metricsArray);
        }
      } else {
        console.error('Metrics API failed:', metricsResponse.reason);
      }

      // Process login metrics data
      let loginMetrics = {
        counselorLogins: 0,
        psychiatristLogins: 0,
        clientLogins: 0,
        managementLogins: 0
      };

      if (loginMetricsResponse.status === 'fulfilled') {
        console.log('Login metrics data:', loginMetricsResponse.value.data);
        const responseData = loginMetricsResponse.value.data;
        const rawData = responseData.data || responseData;
        
        // Handle both array and object formats
        if (Array.isArray(rawData)) {
          // If it's an array, convert it to the expected object structure
          console.log('Login metrics is array, converting...', rawData);
          loginMetrics = {
            counselorLogins: rawData.find(item => item.label === 'Counselor Logins')?.value || 0,
            psychiatristLogins: rawData.find(item => item.label === 'Psychiatrist Logins')?.value || 0,
            clientLogins: rawData.find(item => item.label === 'Client Logins')?.value || 0,
            managementLogins: rawData.find(item => item.label === 'Management Logins')?.value || 0
          };
        } else {
          // If it's an object, use it directly
          loginMetrics = rawData;
        }
        console.log('Processed login metrics:', loginMetrics);
      } else {
        console.error('Login metrics API failed:', loginMetricsResponse.reason);
      }

      // Process session breakdown data
      let sessionMetrics = {
        counselorSessions: 0,
        psychiatristSessions: 0,
        completedSessions: 0,
        ongoingSessions: 0,
        scheduledSessions: 0,
        cancelledSessions: 0,
        totalSessions: 0
      };

      if (sessionBreakdownResponse.status === 'fulfilled') {
        console.log('Session breakdown data:', sessionBreakdownResponse.value.data);
        const responseData = sessionBreakdownResponse.value.data;
        const rawData = responseData.data || responseData;
        
        // Handle both array and object formats
        if (Array.isArray(rawData)) {
          // If it's an array, convert it to the expected object structure
          console.log('Session breakdown is array, converting...', rawData);
          sessionMetrics = {
            counselorSessions: rawData.find(item => item.label === 'Counselor Sessions')?.value || 0,
            psychiatristSessions: rawData.find(item => item.label === 'Psychiatrist Sessions')?.value || 0,
            completedSessions: rawData.find(item => item.label === 'Completed Sessions')?.value || 0,
            ongoingSessions: rawData.find(item => item.label === 'Ongoing Sessions')?.value || 0,
            scheduledSessions: rawData.find(item => item.label === 'Scheduled Sessions')?.value || 0,
            cancelledSessions: rawData.find(item => item.label === 'Cancelled Sessions')?.value || 0,
            totalSessions: rawData.find(item => item.label === 'Total Sessions')?.value || 0
          };
        } else {
          // If it's an object, use it directly
          sessionMetrics = {
            counselorSessions: rawData.counselorSessions || 0,
            psychiatristSessions: rawData.psychiatristSessions || 0,
            completedSessions: rawData.completedSessions || 0,
            ongoingSessions: rawData.ongoingSessions || 0,
            scheduledSessions: rawData.scheduledSessions || 0,
            cancelledSessions: rawData.cancelledSessions || 0,
            totalSessions: rawData.totalSessions || 0
          };
        }
        console.log('Processed session metrics:', sessionMetrics);
      } else {
        console.error('Session breakdown API failed:', sessionBreakdownResponse.reason);
      }

      // Process chart data with error handling
      let userDistributionData: ChartData[] = [];
      if (userDistributionResponse.status === 'fulfilled') {
        console.log('User distribution data:', userDistributionResponse.value.data);
        const responseData = userDistributionResponse.value.data;
        userDistributionData = responseData.data || responseData;
      } else {
        console.error('User distribution API failed:', userDistributionResponse.reason);
      }

      // Process monthly users data and convert to chart format for line graph
      let lineData1: ChartData[] = [];
      if (monthlyUsersResponse.status === 'fulfilled') {
        console.log('Monthly users data:', monthlyUsersResponse.value.data);
        const responseData = monthlyUsersResponse.value.data;
        const monthlyUsersRaw = responseData.data || responseData;
        if (Array.isArray(monthlyUsersRaw)) {
          lineData1 = monthlyUsersRaw.map((item: any) => ({
            name: item.month,
            value: item.total
          }));
        }
      } else {
        console.error('Monthly users API failed:', monthlyUsersResponse.reason);
      }

      // Process daily sessions data and convert to chart format - ensure at least 7 days
      let lineData2: ChartData[] = [];
      if (dailySessionsResponse.status === 'fulfilled') {
        console.log('Daily sessions data:', dailySessionsResponse.value.data);
        const responseData = dailySessionsResponse.value.data;
        const dailySessionsRaw = responseData.data || responseData;
        
        // Create a map of existing data by date
        const dataMap = new Map<string, number>();
        if (Array.isArray(dailySessionsRaw)) {
          dailySessionsRaw.forEach((item: any) => {
            const dateKey = new Date(item.date).toISOString().split('T')[0]; // YYYY-MM-DD format
            dataMap.set(dateKey, item.total || 0);
          });
        }
        
        // Generate last 7 days including today
        const today = new Date();
        lineData2 = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateKey = date.toISOString().split('T')[0];
          const value = dataMap.get(dateKey) || 0;
          
          lineData2.push({
            name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: value
          });
        }
      } else {
        console.error('Daily sessions API failed:', dailySessionsResponse.reason);
      }

      // Process monthly growth data
      let monthlyData: ChartData[] = [];
      if (monthlyGrowthResponse.status === 'fulfilled') {
        console.log('Monthly growth data:', monthlyGrowthResponse.value.data);
        const responseData = monthlyGrowthResponse.value.data;
        const monthlyGrowthRaw = responseData.data || responseData;
        if (Array.isArray(monthlyGrowthRaw)) {
          monthlyData = monthlyGrowthRaw.map((item: any) => ({
            month: item.month,
            clients: item.users,
            sessions: item.sessions,
            revenue: item.revenue
          }));
        }
      } else {
        console.error('Monthly growth API failed:', monthlyGrowthResponse.reason);
      }

      let topCounselors: TopCounselor[] = [];
      if (topCounselorsResponse.status === 'fulfilled') {
        console.log('Top counselors data:', topCounselorsResponse.value.data);
        const responseData = topCounselorsResponse.value.data;
        topCounselors = responseData.data || responseData;
      } else {
        console.error('Top counselors API failed:', topCounselorsResponse.reason);
      }

      let recentActivities: RecentActivity[] = [];
      if (recentActivitiesResponse.status === 'fulfilled') {
        console.log('Recent activities data:', recentActivitiesResponse.value.data);
        const responseData = recentActivitiesResponse.value.data;
        const activitiesRaw = responseData.data || responseData;
        if (Array.isArray(activitiesRaw)) {
          recentActivities = activitiesRaw.map((activity: any) => ({
            ...activity,
            icon: getActivityIcon(activity.type),
            color: getActivityColor(activity.type)
          }));
        }
      } else {
        console.error('Recent activities API failed:', recentActivitiesResponse.reason);
      }

      const finalDashboardData = {
        metrics,
        loginMetrics,
        sessionMetrics,
        userDistributionData,
        monthlyData,
        monthlyRevenueData,
        lineData1,
        lineData2,
        topCounselors,
        recentActivities
      };

      console.log('Final dashboard data:', finalDashboardData);
      
      setDashboardData(finalDashboardData);

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

  const metrics: MetricCard[] = [
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
      secondaryValue: dashboardData.monthlyRevenueData.length > 0
        ? `Rs.${Math.round(dashboardData.monthlyRevenueData.reduce((sum, item) => sum + (item.revenue || 0), 0) / dashboardData.monthlyRevenueData.length).toLocaleString()}`
        : 'Rs.0',
      secondaryLabel: 'Average Monthly',
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
                        {metric.secondaryValue && (
                          <div className="mt-1">
                            <p className="text-sm font-semibold text-gray-800">{metric.secondaryValue}</p>
                            <p className="text-gray-500 text-xs">{metric.secondaryLabel}</p>
                          </div>
                        )}
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
            />

            {/* Monthly Growth and Revenue Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Monthly Growth</h2>
                </div>
                <div className="h-[300px]">
                  {dashboardData.monthlyData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No monthly growth data available</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.monthlyData}>
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

              <MonthlyRevenueSection monthlyRevenueData={dashboardData.monthlyRevenueData} />
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