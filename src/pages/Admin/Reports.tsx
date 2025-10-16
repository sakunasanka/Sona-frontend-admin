import React, { useState } from 'react';
import { 
  FileText, Plus, Download, Filter, Calendar, Eye, ArrowLeft,
  Users, Clock, CheckCircle, XCircle, RefreshCw, BarChart3, 
  PieChart, TrendingUp, MessageCircle, Star,
  Target, UserCheck, Search, DollarSign, CreditCard,
  TrendingDown, BookOpen, GraduationCap, Brain, Heart,
  Mail, Phone, Video, MessageSquare, PhoneCall
} from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';
import CreateReport from '../Admin/CreateReport';

// ==================== TYPES AND MOCK DATA ====================

type Report = {
  id: string;
  title: string;
  type: 'session-analytics' | 'counselor-performance' | 'user-engagement' | 'financial' | 'student-program-effectiveness';
  status: 'completed' | 'generating' | 'failed';
  createdDate: string;
  dateRange: { start: string; end: string };
  createdBy: string;
};

// Session Analytics Types
type SessionType = 'video-call' | 'voice-call' | 'message' | 'onsite';
type TopicType = 'stress' | 'anxiety' | 'career' | 'relationships' | 'academic' | 'personal-growth';

interface SessionAnalyticsData {
  summary: {
    totalSessions: number;
    attended: number;
    missed: number;
    rescheduled: number;
    averageDuration: number;
    averageRating: number;
  };
  frequency: {
    weekly: { week: string; sessions: number }[];
    monthly: { month: string; sessions: number }[];
  };
  sessionTypes: { type: SessionType; count: number; percentage: number }[];
  topics: { topic: TopicType; count: number; averageRating: number }[];
  counselorPerformance: {
    counselor: string;
    sessions: number;
    averageRating: number;
    attendanceRate: number;
  }[];
  trends: {
    month: string;
    sessions: number;
    averageDuration: number;
    satisfaction: number;
  }[];
  feedback: {
    rating: number;
    comment: string;
    sessionType: SessionType;
    topic: TopicType;
    date: string;
  }[];
}

// Counselor Performance Types
interface Counselor {
  id: string;
  name: string;
  email: string;
  specialization: string[];
  experience: number;
  qualification: string;
  joinDate: string;
  city: string;
}

interface CounselorPerformance {
  counselorId: string;
  period: string;
  sessionsConducted: number;
  averageFeedback: number;
  clientProgressRate: number;
  averageResponseTime: number;
  punctualityRate: number;
  caseClosureRate: number;
  clientSatisfaction: number;
  resolvedCases: number;
  ongoingCases: number;
  clientFeedbacks: {
    rating: number;
    comment: string;
    client: string;
    date: string;
  }[];
}

// User Engagement Types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
  userType: 'student' | 'working-professional' | 'parent';
  sessionsCompleted: number;
  goalsCompleted: number;
  totalPlatformTime: number;
  averageSessionRating: number;
  city: string;
}

interface UserEngagementData {
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  loginFrequency: { user: string; logins: number; lastActive: string }[];
  averagePlatformTime: number;
  resourceUsage: {
    articles: number;
    videos: number;
    assessments: number;
    worksheets: number;
  };
  goalCompletion: { goal: string; completed: number; total: number }[];
  interactions: {
    messages: number;
    bookings: number;
    surveys: number;
    feedback: number;
  };
  userGrowth: { month: string; users: number }[];
  userDetails: User[];
}

// Financial Types
interface FinancialData {
  revenue: {
    sessions: number;
    subscriptions: number;
    workshops: number;
    total: number;
  };
  paymentMethods: { method: string; amount: number; percentage: number }[];
  counselorPayouts: { counselor: string; amount: number; commission: number }[];
  expenses: {
    salaries: number;
    software: number;
    marketing: number;
    office: number;
    total: number;
  };
  profitMargin: number;
  outstandingPayments: { client: string; amount: number; dueDate: string }[];
  monthlyTrends: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

// Student Program Types
interface StudentProgramData {
  enrollment: {
    total: number;
    completed: number;
    inProgress: number;
    dropped: number;
  };
  assessments: {
    student: string;
    preAssessment: number;
    postAssessment: number;
    improvement: number;
  }[];
  satisfaction: {
    overall: number;
    counseling: number;
    materials: number;
    support: number;
  };
  improvements: {
    academic: number;
    emotional: number;
    social: number;
    behavioral: number;
  };
  feedback: { student: string; comment: string; rating: number }[];
  longTermProgress: { student: string; months: number; progress: number }[];
}

// ==================== MOCK DATA (Sri Lanka Specific) ====================

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Monthly Session Analytics - June 2024',
    type: 'session-analytics',
    status: 'completed',
    createdDate: '2024-06-01T10:00:00Z',
    dateRange: { start: '2024-05-01T00:00:00Z', end: '2024-05-31T23:59:59Z' },
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Counselor Performance Q2 2024',
    type: 'counselor-performance',
    status: 'generating',
    createdDate: '2024-06-02T11:00:00Z',
    dateRange: { start: '2024-05-01T00:00:00Z', end: '2024-05-31T23:59:59Z' },
    createdBy: '2',
  },
  {
    id: '3',
    title: 'User Engagement Report - May 2024',
    type: 'user-engagement',
    status: 'completed',
    createdDate: '2024-06-03T09:30:00Z',
    dateRange: { start: '2024-05-01T00:00:00Z', end: '2024-05-31T23:59:59Z' },
    createdBy: '1',
  },
  {
    id: '4',
    title: 'Financial Summary - May 2024',
    type: 'financial',
    status: 'failed',
    createdDate: '2024-06-04T14:15:00Z',
    dateRange: { start: '2024-05-01T00:00:00Z', end: '2024-05-31T23:59:59Z' },
    createdBy: '3',
  },
  {
    id: '5',
    title: 'Student Program Effectiveness - Semester 1',
    type: 'student-program-effectiveness',
    status: 'completed',
    createdDate: '2024-06-05T16:20:00Z',
    dateRange: { start: '2024-05-01T00:00:00Z', end: '2024-05-31T23:59:59Z' },
    createdBy: '2',
  },
];

const mockSessionAnalytics: SessionAnalyticsData = {
  summary: {
    totalSessions: 234,
    attended: 198,
    missed: 18,
    rescheduled: 18,
    averageDuration: 45,
    averageRating: 4.4
  },
  frequency: {
    weekly: [
      { week: '2024-05-01', sessions: 25 },
      { week: '2024-05-08', sessions: 28 },
      { week: '2024-05-15', sessions: 32 },
      { week: '2024-05-22', sessions: 35 },
      { week: '2024-05-29', sessions: 30 }
    ],
    monthly: [
      { month: 'Jan 2024', sessions: 65 },
      { month: 'Feb 2024', sessions: 72 },
      { month: 'Mar 2024', sessions: 68 },
      { month: 'Apr 2024', sessions: 85 },
      { month: 'May 2024', sessions: 89 }
    ]
  },
  sessionTypes: [
    { type: 'video-call', count: 125, percentage: 53 },
    { type: 'voice-call', count: 68, percentage: 29 },
    { type: 'message', count: 32, percentage: 14 },
    { type: 'onsite', count: 9, percentage: 4 }
  ],
  topics: [
    { topic: 'stress', count: 78, averageRating: 4.3 },
    { topic: 'anxiety', count: 65, averageRating: 4.5 },
    { topic: 'career', count: 45, averageRating: 4.6 },
    { topic: 'relationships', count: 32, averageRating: 4.2 },
    { topic: 'academic', count: 28, averageRating: 4.4 },
    { topic: 'personal-growth', count: 25, averageRating: 4.7 }
  ],
  counselorPerformance: [
    { counselor: 'Dr. Priya Fernando', sessions: 68, averageRating: 4.7, attendanceRate: 94 },
    { counselor: 'Dr. Rajesh Perera', sessions: 55, averageRating: 4.3, attendanceRate: 89 },
    { counselor: 'Dr. Anusha Silva', sessions: 72, averageRating: 4.8, attendanceRate: 96 },
    { counselor: 'Dr. Kamal Gunawardena', sessions: 39, averageRating: 4.2, attendanceRate: 87 }
  ],
  trends: [
    { month: 'Jan', sessions: 65, averageDuration: 42, satisfaction: 4.2 },
    { month: 'Feb', sessions: 72, averageDuration: 43, satisfaction: 4.3 },
    { month: 'Mar', sessions: 68, averageDuration: 44, satisfaction: 4.4 },
    { month: 'Apr', sessions: 85, averageDuration: 45, satisfaction: 4.5 },
    { month: 'May', sessions: 89, averageDuration: 45, satisfaction: 4.6 }
  ],
  feedback: [
    { rating: 5, comment: 'Very helpful video session, great insights about career guidance!', sessionType: 'video-call', topic: 'career', date: '2024-05-15' },
    { rating: 4, comment: 'Good discussion via voice call, would recommend', sessionType: 'voice-call', topic: 'stress', date: '2024-05-18' },
    { rating: 3, comment: 'Message sessions could be more engaging', sessionType: 'message', topic: 'anxiety', date: '2024-05-20' }
  ]
};

const mockCounselors: Counselor[] = [
  {
    id: '1',
    name: 'Dr. Priya Fernando',
    email: 'priya.fernando@mindcare.lk',
    specialization: ['Anxiety', 'Stress Management', 'Mindfulness'],
    experience: 8,
    qualification: 'PhD in Clinical Psychology',
    joinDate: '2019-03-15',
    city: 'Colombo'
  },
  {
    id: '2',
    name: 'Dr. Rajesh Perera',
    email: 'rajesh.perera@mindcare.lk',
    specialization: ['Career Counseling', 'Relationship Issues'],
    experience: 6,
    qualification: 'MSc in Counseling Psychology',
    joinDate: '2020-08-22',
    city: 'Kandy'
  },
  {
    id: '3',
    name: 'Dr. Anusha Silva',
    email: 'anusha.silva@mindcare.lk',
    specialization: ['Trauma', 'PTSD', 'CBT'],
    experience: 10,
    qualification: 'PhD in Trauma Psychology',
    joinDate: '2018-11-05',
    city: 'Galle'
  }
];

const mockPerformanceData: { [key: string]: CounselorPerformance } = {
  '1': {
    counselorId: '1',
    period: '2024-05',
    sessionsConducted: 68,
    averageFeedback: 4.7,
    clientProgressRate: 88,
    averageResponseTime: 2.1,
    punctualityRate: 96,
    caseClosureRate: 82,
    clientSatisfaction: 94,
    resolvedCases: 52,
    ongoingCases: 16,
    clientFeedbacks: [
      { rating: 5, comment: 'Dr. Fernando provided excellent guidance for my anxiety issues', client: 'Samantha R.', date: '2024-05-15' },
      { rating: 4, comment: 'Very professional and understanding counselor', client: 'Michael T.', date: '2024-05-18' },
      { rating: 5, comment: 'Life-changing sessions, highly recommended', client: 'Nadia K.', date: '2024-05-22' }
    ]
  },
  '2': {
    counselorId: '2',
    period: '2024-05',
    sessionsConducted: 55,
    averageFeedback: 4.3,
    clientProgressRate: 75,
    averageResponseTime: 3.8,
    punctualityRate: 89,
    caseClosureRate: 68,
    clientSatisfaction: 86,
    resolvedCases: 38,
    ongoingCases: 17,
    clientFeedbacks: [
      { rating: 4, comment: 'Good career guidance sessions', client: 'David M.', date: '2024-05-12' },
      { rating: 4, comment: 'Helpful in relationship counseling', client: 'Sarah J.', date: '2024-05-20' },
      { rating: 3, comment: 'Could improve follow-up communication', client: 'Rohan P.', date: '2024-05-25' }
    ]
  },
  '3': {
    counselorId: '3',
    period: '2024-05',
    sessionsConducted: 72,
    averageFeedback: 4.8,
    clientProgressRate: 92,
    averageResponseTime: 1.5,
    punctualityRate: 98,
    caseClosureRate: 87,
    clientSatisfaction: 96,
    resolvedCases: 58,
    ongoingCases: 14,
    clientFeedbacks: [
      { rating: 5, comment: 'Exceptional trauma counseling skills', client: 'Lisa W.', date: '2024-05-10' },
      { rating: 5, comment: 'Very compassionate and professional', client: 'James L.', date: '2024-05-16' },
      { rating: 4, comment: 'Great CBT techniques', client: 'Emma S.', date: '2024-05-28' }
    ]
  }
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Samantha Rajapaksa',
    email: 'samantha.r@email.com',
    phone: '+94 77 123 4567',
    joinDate: '2024-01-15',
    lastActive: '2024-05-30',
    status: 'active',
    userType: 'working-professional',
    sessionsCompleted: 15,
    goalsCompleted: 9,
    totalPlatformTime: 1560,
    averageSessionRating: 4.6,
    city: 'Colombo'
  },
  {
    id: '2',
    name: 'Michael Thilakarathne',
    email: 'michael.t@email.com',
    phone: '+94 76 987 6543',
    joinDate: '2024-02-20',
    lastActive: '2024-05-29',
    status: 'active',
    userType: 'student',
    sessionsCompleted: 10,
    goalsCompleted: 7,
    totalPlatformTime: 980,
    averageSessionRating: 4.8,
    city: 'Kandy'
  },
  {
    id: '3',
    name: 'Nadia Kumari',
    email: 'nadia.k@email.com',
    phone: '+94 71 456 7890',
    joinDate: '2024-03-10',
    lastActive: '2024-05-25',
    status: 'inactive',
    userType: 'working-professional',
    sessionsCompleted: 6,
    goalsCompleted: 3,
    totalPlatformTime: 420,
    averageSessionRating: 4.3,
    city: 'Galle'
  }
];

const mockUserEngagement: UserEngagementData = {
  activeUsers: {
    daily: 189,
    weekly: 745,
    monthly: 1820
  },
  loginFrequency: [
    { user: 'user001', logins: 25, lastActive: '2024-05-30' },
    { user: 'user002', logins: 18, lastActive: '2024-05-29' },
    { user: 'user003', logins: 30, lastActive: '2024-05-30' }
  ],
  averagePlatformTime: 28,
  resourceUsage: {
    articles: 389,
    videos: 245,
    assessments: 142,
    worksheets: 167
  },
  goalCompletion: [
    { goal: 'Stress Management', completed: 38, total: 52 },
    { goal: 'Career Planning', completed: 32, total: 45 },
    { goal: 'Relationship Building', completed: 25, total: 35 }
  ],
  interactions: {
    messages: 987,
    bookings: 432,
    surveys: 234,
    feedback: 345
  },
  userGrowth: [
    { month: 'Jan', users: 950 }, { month: 'Feb', users: 1120 },
    { month: 'Mar', users: 1350 }, { month: 'Apr', users: 1580 },
    { month: 'May', users: 1820 }
  ],
  userDetails: mockUsers
};

const mockFinancialData: FinancialData = {
  revenue: {
    sessions: 3250000,
    subscriptions: 2150000,
    workshops: 980000,
    total: 6380000
  },
  paymentMethods: [
    { method: 'Credit Card', amount: 2850000, percentage: 44.7 },
    { method: 'Bank Transfer', amount: 2150000, percentage: 33.7 },
    { method: 'Digital Wallet', amount: 1380000, percentage: 21.6 }
  ],
  counselorPayouts: [
    { counselor: 'Dr. Priya Fernando', amount: 850000, commission: 26 },
    { counselor: 'Dr. Anusha Silva', amount: 720000, commission: 22 },
    { counselor: 'Dr. Rajesh Perera', amount: 580000, commission: 18 }
  ],
  expenses: {
    salaries: 2850000,
    software: 450000,
    marketing: 680000,
    office: 320000,
    total: 4300000
  },
  profitMargin: 32.6,
  outstandingPayments: [
    { client: 'Samantha Rajapaksa', amount: 15000, dueDate: '2024-06-15' },
    { client: 'Michael Thilakarathne', amount: 12000, dueDate: '2024-06-20' }
  ],
  monthlyTrends: [
    { month: 'Jan', revenue: 4850000, expenses: 3650000, profit: 1200000 },
    { month: 'Feb', revenue: 5250000, expenses: 3850000, profit: 1400000 },
    { month: 'Mar', revenue: 5650000, expenses: 4050000, profit: 1600000 },
    { month: 'Apr', revenue: 5980000, expenses: 4200000, profit: 1780000 },
    { month: 'May', revenue: 6380000, expenses: 4300000, profit: 2080000 }
  ]
};

const mockStudentProgramData: StudentProgramData = {
  enrollment: {
    total: 125,
    completed: 72,
    inProgress: 38,
    dropped: 15
  },
  assessments: [
    { student: 'S001', preAssessment: 45, postAssessment: 82, improvement: 82 },
    { student: 'S002', preAssessment: 38, postAssessment: 85, improvement: 124 },
    { student: 'S003', preAssessment: 52, postAssessment: 68, improvement: 31 }
  ],
  satisfaction: {
    overall: 4.6,
    counseling: 4.8,
    materials: 4.4,
    support: 4.7
  },
  improvements: {
    academic: 38,
    emotional: 45,
    social: 32,
    behavioral: 41
  },
  feedback: [
    { student: 'S001', comment: 'Excellent program, helped with exam stress!', rating: 5 },
    { student: 'S002', comment: 'Great support system for university students', rating: 4 },
    { student: 'S003', comment: 'Helpful but challenging program', rating: 4 }
  ],
  longTermProgress: [
    { student: 'S001', months: 6, progress: 88 },
    { student: 'S002', months: 4, progress: 76 },
    { student: 'S003', months: 3, progress: 68 }
  ]
};

// ==================== UTILITY FUNCTIONS ====================

const downloadAsPDF = (reportType: string, reportData: any) => {
  // Create a simple PDF content (in real implementation, use libraries like jsPDF)
  const content = `
    MIND CARE SRI LANKA - ${reportType.toUpperCase()} REPORT
    Generated on: ${new Date().toLocaleDateString()}
    
    REPORT SUMMARY:
    ${JSON.stringify(reportData.summary || reportData, null, 2)}
    
    This is a simplified PDF export. In production, use proper PDF generation libraries.
  `;
  
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ==================== CHART COMPONENTS ====================

const BarChart = ({ data, title, color = 'blue' }: { data: { label: string; value: number }[]; title: string; color?: string }) => {
  const colorClass = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    indigo: 'bg-indigo-500'
  }[color];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold mb-4">{title}</h4>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${colorClass} transition-all duration-500`}
                  style={{ width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChartVisual = ({ data, title }: { data: { label: string; value: number; color: string }[]; title: string }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold mb-4">{title}</h4>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          <svg width="192" height="192" viewBox="0 0 192 192" className="transform -rotate-90">
            {(() => {
              let cumulativePercent = 0;
              return data.map((item, index) => {
                const percentage = item.value / total;
                const circumference = 2 * Math.PI * 36;
                const strokeDasharray = `${percentage * circumference} ${circumference}`;
                const rotation = cumulativePercent * 360;
                const element = (
                  <g key={index}>
                    <circle
                      cx="96"
                      cy="96"
                      r="36"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="72"
                      strokeDasharray={strokeDasharray}
                      transform={`rotate(${rotation} 96 96)`}
                    />
                  </g>
                );
                cumulativePercent += percentage;
                return element;
              });
            })()}
          </svg>
        </div>
        <div className="space-y-2 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">{item.label}</span>
              </div>
              <span className="text-sm font-medium">{((item.value / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LineChart = ({ data, title, color = 'blue' }: { data: { label: string; value: number }[]; title: string; color?: string }) => {
  const colorClass = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  }[color];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold mb-4">{title}</h4>
      <div className="flex items-end justify-between h-32">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 flex-1">
            <div 
              className={`w-3/4 ${colorClass} rounded-t transition-all duration-500 hover:opacity-80`}
              style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 80}px` }}
            />
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== REPORT COMPONENTS ====================

const SessionAnalyticsReport = ({ data, onBack }: { data: Report; onBack: () => void }) => {
  const [dateRange, setDateRange] = useState('last-month');

  const handleDownload = () => {
    downloadAsPDF('session-analytics', mockSessionAnalytics);
  };

  const getSessionTypeIcon = (type: SessionType) => {
    switch (type) {
      case 'video-call': return <Video className="w-4 h-4" />;
      case 'voice-call': return <PhoneCall className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'onsite': return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Session Analytics Report</h1>
            <p className="text-gray-600">Comprehensive analysis of counseling sessions</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="last-year">Last Year</option>
          </select>
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{mockSessionAnalytics.summary.totalSessions}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Duration</p>
              <p className="text-2xl font-bold text-gray-900">{mockSessionAnalytics.summary.averageDuration}m</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {((mockSessionAnalytics.summary.attended / mockSessionAnalytics.summary.totalSessions) * 100).toFixed(1)}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">{mockSessionAnalytics.summary.averageRating}/5</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Session Types */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold mb-4">Session Types Distribution</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {mockSessionAnalytics.sessionTypes.map((type, index) => (
            <div key={type.type} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-2">
                {getSessionTypeIcon(type.type)}
              </div>
              <p className="font-semibold capitalize">{type.type.replace('-', ' ')}</p>
              <p className="text-2xl font-bold text-blue-600">{type.count}</p>
              <p className="text-sm text-gray-600">{type.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LineChart
          title="Session Frequency (Monthly)"
          data={mockSessionAnalytics.frequency.monthly.map(month => ({
            label: month.month.split(' ')[0],
            value: month.sessions
          }))}
        />
        <PieChartVisual
          title="Session Type Distribution"
          data={mockSessionAnalytics.sessionTypes.map((type, index) => ({
            label: type.type.charAt(0).toUpperCase() + type.type.slice(1).replace('-', ' '),
            value: type.percentage,
            color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][index]
          }))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title="Topic Distribution"
          data={mockSessionAnalytics.topics.map(topic => ({
            label: topic.topic.charAt(0).toUpperCase() + topic.topic.slice(1),
            value: topic.count
          }))}
        />
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Session Flow Process
          </h4>
          <div className="flex justify-between items-center">
            {['Booking', 'Scheduling', 'Counseling', 'Feedback', 'Follow-up'].map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="font-semibold text-blue-600">{index + 1}</span>
                </div>
                <span className="text-sm text-gray-600">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CounselorPerformanceReport = ({ data, onBack }: { data: Report; onBack: () => void }) => {
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('last-month');

  const selectedCounselorData = selectedCounselor ? mockPerformanceData[selectedCounselor] : null;
  const selectedCounselorInfo = selectedCounselor ? mockCounselors.find(c => c.id === selectedCounselor) : null;

  // Calculate overall performance metrics
  const overallPerformance = {
    totalSessions: Object.values(mockPerformanceData).reduce((sum, data) => sum + data.sessionsConducted, 0),
    averageRating: Object.values(mockPerformanceData).reduce((sum, data) => sum + data.averageFeedback, 0) / Object.values(mockPerformanceData).length,
    averageProgressRate: Object.values(mockPerformanceData).reduce((sum, data) => sum + data.clientProgressRate, 0) / Object.values(mockPerformanceData).length,
    averageClosureRate: Object.values(mockPerformanceData).reduce((sum, data) => sum + data.caseClosureRate, 0) / Object.values(mockPerformanceData).length
  };

  const handleDownload = () => {
    if (selectedCounselor && selectedCounselorData) {
      downloadAsPDF(`counselor-${selectedCounselor}`, selectedCounselorData);
    } else {
      downloadAsPDF('counselor-performance', { overall: overallPerformance, counselors: mockPerformanceData });
    }
  };

  if (selectedCounselor && selectedCounselorData && selectedCounselorInfo) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSelectedCounselor(null)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedCounselorInfo.name}</h1>
              <p className="text-gray-600">Performance Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="last-week">Last Week</option>
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="last-year">Last Year</option>
            </select>
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{selectedCounselorData.sessionsConducted}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{selectedCounselorData.averageFeedback}/5</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress Rate</p>
                <p className="text-2xl font-bold text-gray-900">{selectedCounselorData.clientProgressRate}%</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Case Closure</p>
                <p className="text-2xl font-bold text-gray-900">{selectedCounselorData.caseClosureRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Client Feedbacks */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Client Feedbacks & Ratings
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {selectedCounselorData.clientFeedbacks.map((feedback, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-purple-600 fill-current" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{feedback.client}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{feedback.comment}</p>
                    <p className="text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Counselor Performance Report</h1>
            <p className="text-gray-600">Comprehensive analysis of counselor performance metrics</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="last-year">Last Year</option>
          </select>
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Overall Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold mb-4">Overall Team Performance</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{overallPerformance.totalSessions}</p>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{overallPerformance.averageRating.toFixed(1)}/5</p>
            <p className="text-sm text-gray-600">Avg. Rating</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{overallPerformance.averageProgressRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Avg. Progress</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{overallPerformance.averageClosureRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Avg. Closure</p>
          </div>
        </div>
      </div>

      {/* Counselors List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Counselors Performance Overview</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {mockCounselors.map(counselor => {
              const performance = mockPerformanceData[counselor.id];
              return (
                <div 
                  key={counselor.id}
                  onClick={() => setSelectedCounselor(counselor.id)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{counselor.name}</h4>
                      <p className="text-sm text-gray-600">{counselor.specialization.join(', ')}</p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span>{counselor.city}</span>
                        <span>•</span>
                        <span>{counselor.experience} years exp</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{performance.averageFeedback}/5</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {performance.sessionsConducted} sessions • {performance.clientProgressRate}% progress
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserEngagementReport = ({ data, onBack }: { data: Report; onBack: () => void }) => {
  const [dateRange, setDateRange] = useState('last-month');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUserEngagement.userDetails.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    if (selectedUser) {
      downloadAsPDF(`user-${selectedUser.id}`, selectedUser);
    } else {
      downloadAsPDF('user-engagement', mockUserEngagement);
    }
  };

  if (selectedUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h1>
              <p className="text-gray-600">User Engagement Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{selectedUser.phone}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedUser.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedUser.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.status}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {selectedUser.userType}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    {selectedUser.city}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Member since</p>
              <p className="font-medium">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mt-2">Last active</p>
              <p className="font-medium">{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* User Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{selectedUser.sessionsCompleted}</p>
            <p className="text-sm text-gray-600">Sessions Completed</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{selectedUser.goalsCompleted}</p>
            <p className="text-sm text-gray-600">Goals Completed</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{Math.round(selectedUser.totalPlatformTime / 60)}h</p>
            <p className="text-sm text-gray-600">Platform Time</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{selectedUser.averageSessionRating}/5</p>
            <p className="text-sm text-gray-600">Avg. Rating</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Completed Stress Management Program</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+85%</p>
                  <p className="text-sm text-gray-600">Improvement</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Weekly Counseling Session</p>
                    <p className="text-sm text-gray-600">5 days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">4.8/5</p>
                  <p className="text-sm text-gray-600">Session Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Engagement Report</h1>
            <p className="text-gray-600">Analysis of user activity and platform interaction</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="last-year">Last Year</option>
          </select>
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Active Users */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockUserEngagement.activeUsers.daily}</p>
          <p className="text-sm text-gray-600">Daily Active</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockUserEngagement.activeUsers.weekly}</p>
          <p className="text-sm text-gray-600">Weekly Active</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockUserEngagement.activeUsers.monthly}</p>
          <p className="text-sm text-gray-600">Monthly Active</p>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BarChart
          title="Resource Usage"
          color="indigo"
          data={[
            { label: 'Articles', value: mockUserEngagement.resourceUsage.articles },
            { label: 'Videos', value: mockUserEngagement.resourceUsage.videos },
            { label: 'Assessments', value: mockUserEngagement.resourceUsage.assessments },
            { label: 'Worksheets', value: mockUserEngagement.resourceUsage.worksheets }
          ]}
        />
        <PieChartVisual
          title="Interaction Distribution"
          data={[
            { label: 'Messages', value: 40, color: '#4F46E5' },
            { label: 'Bookings', value: 25, color: '#7C3AED' },
            { label: 'Surveys', value: 15, color: '#10B981' },
            { label: 'Feedback', value: 20, color: '#F59E0B' }
          ]}
        />
      </div>

      {/* User Growth */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold mb-4">User Growth Trend</h3>
        <LineChart
          data={mockUserEngagement.userGrowth.map(month => ({
            label: month.month,
            value: month.users
          }))}
          title="Monthly User Growth"
          color="indigo"
        />
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">User Details</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <div 
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {user.userType}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                        {user.city}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{user.averageSessionRating}/5</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {user.sessionsCompleted} sessions • {user.goalsCompleted} goals
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialReport = ({ data, onBack }: { data: Report; onBack: () => void }) => {
  const [dateRange, setDateRange] = useState('last-month');

  const handleDownload = () => {
    downloadAsPDF('financial', mockFinancialData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Report</h1>
            <p className="text-gray-600">Revenue, expenses, and financial performance analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="last-year">Last Year</option>
          </select>
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <DollarSign className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockFinancialData.revenue.total)}</p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <TrendingDown className="w-8 h-8 text-red-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockFinancialData.expenses.total)}</p>
          <p className="text-sm text-gray-600">Total Expenses</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockFinancialData.revenue.total - mockFinancialData.expenses.total)}</p>
          <p className="text-sm text-gray-600">Net Profit</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Target className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockFinancialData.profitMargin}%</p>
          <p className="text-sm text-gray-600">Profit Margin</p>
        </div>
      </div>

      {/* Revenue Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PieChartVisual
          title="Revenue Sources"
          data={[
            { label: 'Sessions', value: 50.4, color: '#10B981' },
            { label: 'Subscriptions', value: 32.2, color: '#3B82F6' },
            { label: 'Workshops', value: 17.4, color: '#8B5CF6' }
          ]}
        />
        <BarChart
          title="Monthly Financial Trends"
          color="green"
          data={mockFinancialData.monthlyTrends.map(month => ({
            label: month.month,
            value: month.profit
          }))}
        />
      </div>

      {/* Counselor Payouts */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Counselor Payouts & Commissions</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {mockFinancialData.counselorPayouts.map((payout, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{payout.counselor}</p>
                  <p className="text-sm text-gray-600">{payout.commission}% commission</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(payout.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentProgramEffectivenessReport = ({ data, onBack }: { data: Report; onBack: () => void }) => {
  const [dateRange, setDateRange] = useState('last-month');

  const handleDownload = () => {
    downloadAsPDF('student-program-effectiveness', mockStudentProgramData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Program Effectiveness Report</h1>
            <p className="text-gray-600">Analysis of program impact and student progress</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="last-year">Last Year</option>
          </select>
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Program Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <GraduationCap className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockStudentProgramData.enrollment.total}</p>
          <p className="text-sm text-gray-600">Total Enrolled</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockStudentProgramData.enrollment.completed}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockStudentProgramData.satisfaction.overall}/5</p>
          <p className="text-sm text-gray-600">Satisfaction</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">68%</p>
          <p className="text-sm text-gray-600">Avg. Improvement</p>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BarChart
          title="Pre vs Post Assessment Scores"
          color="amber"
          data={mockStudentProgramData.assessments.flatMap(assessment => [
            { label: `${assessment.student} Pre`, value: assessment.preAssessment },
            { label: `${assessment.student} Post`, value: assessment.postAssessment }
          ])}
        />
        <PieChartVisual
          title="Enrollment Status"
          data={[
            { label: 'Completed', value: 57, color: '#10B981' },
            { label: 'In Progress', value: 29, color: '#3B82F6' },
            { label: 'Dropped', value: 14, color: '#EF4444' }
          ]}
        />
      </div>

      {/* Improvement Areas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold mb-4">Improvement by Area</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-bold">{mockStudentProgramData.improvements.academic}%</p>
            <p className="text-sm text-gray-600">Academic</p>
          </div>
          <div className="text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <p className="text-lg font-bold">{mockStudentProgramData.improvements.emotional}%</p>
            <p className="text-sm text-gray-600">Emotional</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-bold">{mockStudentProgramData.improvements.social}%</p>
            <p className="text-sm text-gray-600">Social</p>
          </div>
          <div className="text-center">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-bold">{mockStudentProgramData.improvements.behavioral}%</p>
            <p className="text-sm text-gray-600">Behavioral</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN REPORTS COMPONENT ====================

const Reports = () => {
  const [reports] = useState<Report[]>(mockReports);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'session-analytics' | 'counselor-performance' | 'user-engagement' | 'financial' | 'student-program-effectiveness'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const filteredReports = reports.filter(report => 
    filterType === 'all' || report.type === filterType
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'session-analytics':
        return 'bg-blue-100 text-blue-800';
      case 'counselor-performance':
        return 'bg-purple-100 text-purple-800';
      case 'user-engagement':
        return 'bg-indigo-100 text-indigo-800';
      case 'financial':
        return 'bg-green-100 text-green-800';
      case 'student-program-effectiveness':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTypeName = (type: string) => {
    switch (type) {
      case 'session-analytics':
        return 'Session Analytics';
      case 'counselor-performance':
        return 'Counselor Performance';
      case 'user-engagement':
        return 'User Engagement';
      case 'financial':
        return 'Financial';
      case 'student-program-effectiveness':
        return 'Program Effectiveness';
      default:
        return type;
    }
  };

  const handleViewReport = (report: Report) => {
    setViewingReport(report);
  };

  const handleBackToList = () => {
    setViewingReport(null);
  };

  // Render specific report component based on type
  const renderReportComponent = () => {
    if (!viewingReport) return null;

    const commonProps = {
      data: viewingReport,
      onBack: handleBackToList
    };

    switch (viewingReport.type) {
      case 'session-analytics':
        return <SessionAnalyticsReport {...commonProps} />;
      case 'counselor-performance':
        return <CounselorPerformanceReport {...commonProps} />;
      case 'user-engagement':
        return <UserEngagementReport {...commonProps} />;
      case 'financial':
        return <FinancialReport {...commonProps} />;
      case 'student-program-effectiveness':
        return <StudentProgramEffectivenessReport {...commonProps} />;
      default:
        return null;
    }
  };

  if (showCreateForm) {
    return <CreateReport onCancel={() => setShowCreateForm(false)} />;
  }

  if (viewingReport) {
    return renderReportComponent();
  }

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
            {/* Header and Create Button */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Report</span>
              </button>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="session-analytics">Session Analytics Reports</option>
                <option value="counselor-performance">Counselor Performance Reports</option>
                <option value="user-engagement">User Engagement Reports</option>
                <option value="financial">Financial Reports</option>
                <option value="student-program-effectiveness">Program Effectiveness Reports</option>
              </select>
            </div>

            {/* Reports List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                {filteredReports.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                              {formatTypeName(report.type)}
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {new Date(report.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span>Period: {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span>By: {report.createdBy === '1' ? 'Admin User' : report.createdBy === '2' ? 'Manager' : 'System'}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewReport(report)}
                            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          {report.status === 'completed' && (
                            <button 
                              onClick={() => downloadAsPDF(report.type, report)}
                              className="flex items-center space-x-2 px-3 py-1 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download PDF</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No reports found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default Reports;