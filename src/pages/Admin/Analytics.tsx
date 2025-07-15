// import React, { useState } from 'react';
// import { 
//   Users, 
//   Calendar, 
//   DollarSign, 
//   TrendingUp, 
//   Clock, 
//   Heart,
//   BarChart3,
//   Activity,
//   UserCheck,
//   MessageCircle,
//   Star,
//   ArrowUp,
//   ArrowDown,
//   Filter,
//   Download,
//   ChevronDown,
//   MapPin,
//   Phone,
//   Globe,
//   Award
// } from 'lucide-react';

// function Analytics() {
//   const [timeFilter, setTimeFilter] = useState('7d');
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   // Mock data for Sri Lankan counselling analytics
//   const metrics = [
//     {
//       title: 'Total Clients',
//       value: '1,847',
//       change: '+18.5%',
//       trend: 'up',
//       icon: Users,
//       color: 'bg-blue-500'
//     },
//     {
//       title: 'Sessions This Month',
//       value: '892',
//       change: '+12.3%',
//       trend: 'up',
//       icon: Calendar,
//       color: 'bg-green-500'
//     },
//     {
//       title: 'Monthly Revenue',
//       value: 'LKR 2,450,000',
//       change: '+22.1%',
//       trend: 'up',
//       icon: DollarSign,
//       color: 'bg-purple-500'
//     },
//     {
//       title: 'Avg Session Rating',
//       value: '4.7/5',
//       change: '+0.3',
//       trend: 'up',
//       icon: Star,
//       color: 'bg-yellow-500'
//     },
//     {
//       title: 'Active Counselors',
//       value: '15',
//       change: '+3',
//       trend: 'up',
//       icon: UserCheck,
//       color: 'bg-indigo-500'
//     },
//     {
//       title: 'Completion Rate',
//       value: '84.2%',
//       change: '+2.1%',
//       trend: 'up',
//       icon: TrendingUp,
//       color: 'bg-teal-500'
//     }
//   ];

//   const sessionData = [
//     { day: 'Mon', sessions: 38, height: '65%' },
//     { day: 'Tue', sessions: 45, height: '75%' },
//     { day: 'Wed', sessions: 32, height: '55%' },
//     { day: 'Thu', sessions: 52, height: '88%' },
//     { day: 'Fri', sessions: 48, height: '80%' },
//     { day: 'Sat', sessions: 25, height: '42%' },
//     { day: 'Sun', sessions: 18, height: '30%' }
//   ];

//   const recentActivities = [
//     {
//       type: 'session',
//       message: 'Dr. Priyanka Perera completed family therapy session in Colombo',
//       time: '5 minutes ago',
//       icon: Clock,
//       color: 'text-green-600'
//     },
//     {
//       type: 'appointment',
//       message: 'New appointment booked for anxiety counseling in Kandy',
//       time: '20 minutes ago',
//       icon: Calendar,
//       color: 'text-blue-600'
//     },
//     {
//       type: 'feedback',
//       message: 'Client from Galle provided 5-star rating for depression therapy',
//       time: '1 hour ago',
//       icon: Star,
//       color: 'text-yellow-600'
//     },
//     {
//       type: 'message',
//       message: 'Dr. Chaminda sent follow-up in Sinhala to client in Matara',
//       time: '2 hours ago',
//       icon: MessageCircle,
//       color: 'text-purple-600'
//     },
//     {
//       type: 'session',
//       message: 'Online group therapy session completed (Tamil language)',
//       time: '3 hours ago',
//       icon: Users,
//       color: 'text-indigo-600'
//     }
//   ];

//   const topCounselors = [
//     { 
//       name: 'Dr. Priyanka Perera', 
//       sessions: 67, 
//       rating: 4.9, 
//       specialty: 'Family & Marriage Counseling',
//       location: 'Colombo',
//       languages: 'Sinhala, English'
//     },
//     { 
//       name: 'Dr. Chaminda Silva', 
//       sessions: 58, 
//       rating: 4.8, 
//       specialty: 'Depression & Anxiety',
//       location: 'Kandy',
//       languages: 'Sinhala, English'
//     },
//     { 
//       name: 'Dr. Kavitha Rajendran', 
//       sessions: 52, 
//       rating: 4.9, 
//       specialty: 'Child Psychology',
//       location: 'Jaffna',
//       languages: 'Tamil, English'
//     },
//     { 
//       name: 'Dr. Nuwan Fernando', 
//       sessions: 48, 
//       rating: 4.7, 
//       specialty: 'Addiction Recovery',
//       location: 'Galle',
//       languages: 'Sinhala, English'
//     },
//     { 
//       name: 'Dr. Rashika Mendis', 
//       sessions: 44, 
//       rating: 4.8, 
//       specialty: 'Trauma Counseling',
//       location: 'Negombo',
//       languages: 'Sinhala, English'
//     }
//   ];

//   const regionalData = [
//     { province: 'Western Province', clients: 542, sessions: 1247, revenue: 'LKR 890,000' },
//     { province: 'Central Province', clients: 298, sessions: 687, revenue: 'LKR 485,000' },
//     { province: 'Southern Province', clients: 234, sessions: 523, revenue: 'LKR 375,000' },
//     { province: 'Northern Province', clients: 187, sessions: 412, revenue: 'LKR 295,000' },
//     { province: 'Eastern Province', clients: 156, sessions: 348, revenue: 'LKR 248,000' },
//     { province: 'North Western Province', clients: 143, sessions: 321, revenue: 'LKR 230,000' }
//   ];

//   const specialtyStats = [
//     { specialty: 'Depression & Anxiety', percentage: 35, sessions: 312, color: 'bg-blue-500' },
//     { specialty: 'Family Counseling', percentage: 28, sessions: 249, color: 'bg-green-500' },
//     { specialty: 'Child Psychology', percentage: 18, sessions: 160, color: 'bg-purple-500' },
//     { specialty: 'Addiction Recovery', percentage: 12, sessions: 107, color: 'bg-orange-500' },
//     { specialty: 'Trauma Therapy', percentage: 7, sessions: 62, color: 'bg-red-500' }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//                 <Heart className="text-emerald-600" size={32} />
//                 MindCare Lanka Analytics
//               </h1>
//               <p className="text-gray-600 mt-1 flex items-center gap-2">
//                 <MapPin size={16} className="text-emerald-600" />
//                 Mental Health Services Across Sri Lanka
//               </p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <button
//                   onClick={() => setIsFilterOpen(!isFilterOpen)}
//                   className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <Filter size={16} />
//                   Last {timeFilter === '7d' ? '7 days' : timeFilter === '30d' ? '30 days' : '90 days'}
//                   <ChevronDown size={16} />
//                 </button>
//                 {isFilterOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
//                     {['7d', '30d', '90d'].map((filter) => (
//                       <button
//                         key={filter}
//                         onClick={() => {
//                           setTimeFilter(filter);
//                           setIsFilterOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
//                       >
//                         Last {filter === '7d' ? '7 days' : filter === '30d' ? '30 days' : '90 days'}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
//                 <Download size={16} />
//                 Export Report
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Key Metrics Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {metrics.map((metric, index) => (
//             <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className={`${metric.color} p-3 rounded-lg`}>
//                     <metric.icon className="text-white" size={24} />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">{metric.title}</p>
//                     <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
//                   </div>
//                 </div>
//                 <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
//                   metric.trend === 'up' 
//                     ? 'bg-green-100 text-green-700' 
//                     : 'bg-red-100 text-red-700'
//                 }`}>
//                   {metric.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
//                   {metric.change}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts and Regional Data */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Sessions This Week Chart */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                 <BarChart3 className="text-emerald-600" size={20} />
//                 Weekly Sessions Overview
//               </h3>
//               <span className="text-sm text-gray-500">Total: 258 sessions</span>
//             </div>
//             <div className="flex items-end justify-between h-48 gap-2">
//               {sessionData.map((day, index) => (
//                 <div key={index} className="flex flex-col items-center flex-1">
//                   <div 
//                     className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500"
//                     style={{ height: day.height }}
//                   ></div>
//                   <span className="text-xs text-gray-600 mt-2 font-medium">{day.day}</span>
//                   <span className="text-xs text-gray-500">{day.sessions}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Regional Distribution */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
//               <MapPin className="text-blue-600" size={20} />
//               Provincial Distribution
//             </h3>
//             <div className="space-y-4">
//               {regionalData.map((region, index) => (
//                 <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div>
//                     <p className="font-medium text-gray-900">{region.province}</p>
//                     <p className="text-sm text-gray-500">{region.clients} clients • {region.sessions} sessions</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold text-emerald-600">{region.revenue}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Counselors and Specialties */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Top Counselors */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
//               <Award className="text-yellow-600" size={20} />
//               Top Performing Counselors
//             </h3>
//             <div className="space-y-4">
//               {topCounselors.map((counselor, index) => (
//                 <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                       {counselor.name.split(' ').map(n => n[0]).join('')}
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{counselor.name}</p>
//                       <p className="text-sm text-gray-600">{counselor.specialty}</p>
//                       <div className="flex items-center gap-4 mt-1">
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                           <MapPin size={12} />
//                           {counselor.location}
//                         </span>
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                           <Globe size={12} />
//                           {counselor.languages}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold text-gray-900">{counselor.sessions} sessions</p>
//                     <div className="flex items-center gap-1">
//                       <Star className="text-yellow-500" size={14} fill="currentColor" />
//                       <span className="text-sm text-gray-600">{counselor.rating}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Specialty Breakdown */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
//               <Activity className="text-purple-600" size={20} />
//               Counseling Specialties
//             </h3>
//             <div className="space-y-4">
//               {specialtyStats.map((specialty, index) => (
//                 <div key={index} className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium text-gray-700">{specialty.specialty}</span>
//                     <span className="text-sm text-gray-500">{specialty.sessions} sessions</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`${specialty.color} h-2 rounded-full transition-all duration-500`}
//                       style={{ width: `${specialty.percentage}%` }}
//                     ></div>
//                   </div>
//                   <div className="text-xs text-gray-500">{specialty.percentage}% of total sessions</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity and Quick Stats */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Recent Activity */}
//           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
//               <Clock className="text-purple-600" size={20} />
//               Recent Activity
//             </h3>
//             <div className="space-y-4">
//               {recentActivities.map((activity, index) => (
//                 <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
//                     <activity.icon size={16} />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-900">{activity.message}</p>
//                     <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick Insights */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Sri Lanka Insights</h3>
//             <div className="space-y-6">
//               <div>
//                 <p className="text-sm text-gray-600 mb-2">Multilingual Support</p>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-xs">
//                     <span>Sinhala</span>
//                     <span>65%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                     <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
//                   </div>
//                 </div>
//                 <div className="space-y-2 mt-2">
//                   <div className="flex justify-between text-xs">
//                     <span>English</span>
//                     <span>25%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                     <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
//                   </div>
//                 </div>
//                 <div className="space-y-2 mt-2">
//                   <div className="flex justify-between text-xs">
//                     <span>Tamil</span>
//                     <span>10%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                     <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '10%' }}></div>
//                   </div>
//                 </div>
//               </div>
              
//               <div>
//                 <p className="text-sm text-gray-600 mb-2">Online vs In-Person</p>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '72%' }}></div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">72% online sessions</p>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-600 mb-2">Client Retention</p>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89%' }}></div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">89% return for follow-up</p>
//               </div>

//               <div className="pt-4 border-t border-gray-100">
//                 <div className="text-center">
//                   <p className="text-2xl font-bold text-gray-900">LKR 8.2M</p>
//                   <p className="text-sm text-gray-600">Quarterly Revenue</p>
//                   <p className="text-xs text-emerald-600 flex items-center justify-center gap-1 mt-1">
//                     <ArrowUp size={12} />
//                     +24.3% from last quarter
//                   </p>
//                 </div>
//               </div>

//               <div className="bg-emerald-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Phone size={16} className="text-emerald-600" />
//                   <span className="text-sm font-medium text-emerald-800">24/7 Helpline</span>
//                 </div>
//                 <p className="text-xs text-emerald-700">1333 (Suicide Prevention)</p>
//                 <p className="text-xs text-emerald-700">Available in all three languages</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Analytics;


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
  totalCounsellors: number;
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
    totalCounsellors: 12,
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
          title="Total Counsellors"
          value={analytics.totalCounsellors}
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