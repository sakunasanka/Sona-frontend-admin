import React, { useState } from 'react';
import { 
  FileText, Plus, Download, Filter, Calendar, Eye, ArrowLeft,
  Users, Clock, CheckCircle, XCircle, BarChart3, 
  PieChart, TrendingUp, MessageCircle, Star,
  Target, UserCheck, Search, DollarSign,
  TrendingDown, BookOpen, Mail, Phone
} from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';
import jsPDF from 'jspdf';

// ==================== TYPES AND MOCK DATA ====================

type Report = {
  id: string;
  title: string;
  type: 'session-analytics' | 'counselor-performance' | 'user-engagement' | 'financial';
  status: 'completed' | 'generating' | 'failed';
  createdDate: string;
  dateRange: { start: string; end: string };
  createdBy: string;
};

// Updated Topic Types
type TopicType = 'clinical' | 'family' | 'career' | 'addiction' | 'trauma';

interface SessionAnalyticsData {
  summary: {
    totalSessions: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    averageDuration: number;
    averageRating: number;
  };
  frequency: {
    weekly: { week: string; sessions: number }[];
    monthly: { month: string; sessions: number }[];
  };
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
  averageResponseTime: number;
  punctualityRate: number;
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
  scheduledSessions: number;
  totalPlatformTime: number;
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
  userGrowth: { month: string; users: number }[];
  userDetails: User[];
}

// Financial Types
interface FinancialData {
  revenue: {
    sessions: number;
    subscriptions: number;
    total: number;
  };
  paymentMethods: { method: string; amount: number; percentage: number }[];
  counselorPayouts: { counselor: string; amount: number; commission: number }[];
  profitMargin: number;
  outstandingPayments: { client: string; amount: number; dueDate: string }[];
  monthlyTrends: {
    month: string;
    revenue: number;
    profit: number;
  }[];
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
  }
];

const mockSessionAnalytics: SessionAnalyticsData = {
  summary: {
    totalSessions: 234,
    scheduled: 250,
    completed: 198,
    cancelled: 52,
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
  topics: [
    { topic: 'clinical', count: 78, averageRating: 4.3 },
    { topic: 'family', count: 65, averageRating: 4.5 },
    { topic: 'career', count: 45, averageRating: 4.6 },
    { topic: 'addiction', count: 32, averageRating: 4.2 },
    { topic: 'trauma', count: 28, averageRating: 4.4 }
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
    { rating: 5, comment: 'Very helpful session, great insights about career guidance!', topic: 'career', date: '2024-05-15' },
    { rating: 4, comment: 'Good discussion, would recommend', topic: 'clinical', date: '2024-05-18' },
    { rating: 3, comment: 'Could be more engaging', topic: 'family', date: '2024-05-20' }
  ]
};

const mockCounselors: Counselor[] = [
  {
    id: '1',
    name: 'Dr. Priya Fernando',
    email: 'priya.fernando@mindcare.lk',
    specialization: ['Clinical', 'Trauma', 'Mindfulness'],
    experience: 8,
    qualification: 'PhD in Clinical Psychology',
    joinDate: '2019-03-15',
    city: 'Colombo'
  },
  {
    id: '2',
    name: 'Dr. Rajesh Perera',
    email: 'rajesh.perera@mindcare.lk',
    specialization: ['Career Counseling', 'Family Issues'],
    experience: 6,
    qualification: 'MSc in Counseling Psychology',
    joinDate: '2020-08-22',
    city: 'Kandy'
  },
  {
    id: '3',
    name: 'Dr. Anusha Silva',
    email: 'anusha.silva@mindcare.lk',
    specialization: ['Trauma', 'PTSD', 'Addiction'],
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
    averageResponseTime: 2.1,
    punctualityRate: 96,
    resolvedCases: 52,
    ongoingCases: 16,
    clientFeedbacks: [
      { rating: 5, comment: 'Dr. Fernando provided excellent guidance for my clinical issues', client: 'Samantha R.', date: '2024-05-15' },
      { rating: 4, comment: 'Very professional and understanding counselor', client: 'Michael T.', date: '2024-05-18' },
      { rating: 5, comment: 'Life-changing sessions, highly recommended', client: 'Nadia K.', date: '2024-05-22' }
    ]
  },
  '2': {
    counselorId: '2',
    period: '2024-05',
    sessionsConducted: 55,
    averageFeedback: 4.3,
    averageResponseTime: 3.8,
    punctualityRate: 89,
    resolvedCases: 38,
    ongoingCases: 17,
    clientFeedbacks: [
      { rating: 4, comment: 'Good career guidance sessions', client: 'David M.', date: '2024-05-12' },
      { rating: 4, comment: 'Helpful in family counseling', client: 'Sarah J.', date: '2024-05-20' },
      { rating: 3, comment: 'Could improve follow-up communication', client: 'Rohan P.', date: '2024-05-25' }
    ]
  },
  '3': {
    counselorId: '3',
    period: '2024-05',
    sessionsConducted: 72,
    averageFeedback: 4.8,
    averageResponseTime: 1.5,
    punctualityRate: 98,
    resolvedCases: 58,
    ongoingCases: 14,
    clientFeedbacks: [
      { rating: 5, comment: 'Exceptional trauma counseling skills', client: 'Lisa W.', date: '2024-05-10' },
      { rating: 5, comment: 'Very compassionate and professional', client: 'James L.', date: '2024-05-16' },
      { rating: 4, comment: 'Great addiction counseling techniques', client: 'Emma S.', date: '2024-05-28' }
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
    scheduledSessions: 18,
    totalPlatformTime: 1560,
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
    scheduledSessions: 12,
    totalPlatformTime: 980,
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
    scheduledSessions: 8,
    totalPlatformTime: 420,
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
    total: 5400000
  },
  paymentMethods: [
    { method: 'Credit Card', amount: 2850000, percentage: 52.8 },
    { method: 'Bank Transfer', amount: 2150000, percentage: 39.8 },
    { method: 'Digital Wallet', amount: 400000, percentage: 7.4 }
  ],
  counselorPayouts: [
    { counselor: 'Dr. Priya Fernando', amount: 850000, commission: 26 },
    { counselor: 'Dr. Anusha Silva', amount: 720000, commission: 22 },
    { counselor: 'Dr. Rajesh Perera', amount: 580000, commission: 18 }
  ],
  profitMargin: 32.6,
  outstandingPayments: [
    { client: 'Samantha Rajapaksa', amount: 15000, dueDate: '2024-06-15' },
    { client: 'Michael Thilakarathne', amount: 12000, dueDate: '2024-06-20' }
  ],
  monthlyTrends: [
    { month: 'Jan', revenue: 4850000, profit: 1200000 },
    { month: 'Feb', revenue: 5250000, profit: 1400000 },
    { month: 'Mar', revenue: 5650000, profit: 1600000 },
    { month: 'Apr', revenue: 5980000, profit: 1780000 },
    { month: 'May', revenue: 5400000, profit: 1100000 }
  ]
};

// ==================== UTILITY FUNCTIONS ====================

const downloadAsPDF = (reportType: string, reportData: any) => {
  try {
    console.log('Starting PDF generation for:', reportType, 'with data:', reportData);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
    
    // Page settings
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;
    
    // Add Sona branding header
    pdf.setFontSize(24);
    pdf.setTextColor(41, 128, 185); // Blue color
    pdf.text('SONA', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
    
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Mental Health & Wellness Platform', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Add divider line
    pdf.setDrawColor(41, 128, 185);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    // Report title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text(reportType.toUpperCase() + ' REPORT', margin, yPosition);
    yPosition += 10;
    
    // Date
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${currentDate}`, margin, yPosition);
    yPosition += 20;
    
    // Report content based on report type
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    switch(reportType.toLowerCase()) {
      case 'session-analytics':
      case 'session analytics':
        pdf.text('SESSION ANALYTICS OVERVIEW', margin, yPosition);
        yPosition += 10;
        pdf.text(`• Total Sessions: ${reportData?.totalSessions || '1,245'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Active Users: ${reportData?.activeUsers || '892'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Completion Rate: ${reportData?.completionRate || '87%'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Average Session Duration: ${reportData?.avgDuration || '45 minutes'}`, margin, yPosition);
        yPosition += 15;
        
        pdf.text('SESSION TYPES BREAKDOWN:', margin, yPosition);
        yPosition += 10;
        pdf.text('• Individual Counseling: 45% (561 sessions)', margin + 5, yPosition);
        yPosition += 6;
        pdf.text('• Group Therapy: 25% (311 sessions)', margin + 5, yPosition);
        yPosition += 6;
        pdf.text('• Psychiatric Consultations: 20% (249 sessions)', margin + 5, yPosition);
        yPosition += 6;
        pdf.text('• Crisis Interventions: 10% (124 sessions)', margin + 5, yPosition);
        break;
        
      case 'counselor-performance':
      case 'counselor performance':
        pdf.text('COUNSELOR PERFORMANCE OVERVIEW', margin, yPosition);
        yPosition += 10;
        pdf.text(`• Total Active Counselors: ${reportData?.totalCounselors || '24'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Average Rating: ${reportData?.avgRating || '4.7/5.0'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Sessions Completed: ${reportData?.sessionsCompleted || '2,156'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Client Satisfaction: ${reportData?.clientSatisfaction || '92%'}`, margin, yPosition);
        yPosition += 15;
        
        pdf.text('TOP PERFORMERS:', margin, yPosition);
        yPosition += 10;
        pdf.text('• Dr. Sarah Johnson - 4.9/5.0 (128 sessions)', margin + 5, yPosition);
        yPosition += 6;
        pdf.text('• Dr. Michael Chen - 4.8/5.0 (156 sessions)', margin + 5, yPosition);
        yPosition += 6;
        pdf.text('• Dr. Emily Davis - 4.8/5.0 (142 sessions)', margin + 5, yPosition);
        break;
        
      case 'user-engagement':
      case 'user engagement':
        pdf.text('USER ENGAGEMENT OVERVIEW', margin, yPosition);
        yPosition += 10;
        pdf.text(`• Total Registered Users: ${reportData?.totalUsers || '3,456'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Monthly Active Users: ${reportData?.monthlyActive || '2,189'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Daily Active Users: ${reportData?.dailyActive || '589'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Average Session Time: ${reportData?.avgSessionTime || '32 minutes'}`, margin, yPosition);
        yPosition += 15;
        
        pdf.text('ENGAGEMENT METRICS:', margin, yPosition);
        yPosition += 10;
        pdf.text('• App Opens per User/Day: 3.2', margin + 5, yPosition);
        yPosition += 6;
        pdf.text('• Feature Usage Rate: 78%', margin + 5, yPosition);
        yPosition += 6;
        pdf.text('• Retention Rate (7-day): 85%', margin + 5, yPosition);
        yPosition += 6;
        pdf.text('• Retention Rate (30-day): 67%', margin + 5, yPosition);
        break;
        
      case 'financial':
        pdf.text('FINANCIAL OVERVIEW', margin, yPosition);
        yPosition += 10;
        pdf.text(`• Total Revenue: ${reportData?.totalRevenue || '$125,480'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Monthly Recurring Revenue: ${reportData?.mrr || '$42,160'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Average Revenue per User: ${reportData?.arpu || '$36.25'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Subscription Growth: ${reportData?.growth || '+15%'}`, margin, yPosition);
        yPosition += 15;
        
        pdf.text('REVENUE BREAKDOWN:', margin, yPosition);
        yPosition += 10;
        pdf.text('• Individual Sessions: $78,500 (62.5%)', margin + 5, yPosition);
        yPosition += 6;
        pdf.text('• Subscription Plans: $32,100 (25.6%)', margin + 5, yPosition);
        yPosition += 6;
        pdf.text('• Group Sessions: $14,880 (11.9%)', margin + 5, yPosition);
        break;
        
      default:
        pdf.text('REPORT OVERVIEW', margin, yPosition);
        yPosition += 10;
        pdf.text('This report contains comprehensive analytics and insights', margin, yPosition);
        yPosition += 6;
        pdf.text('for the Sona mental health platform.', margin, yPosition);
        yPosition += 15;
        
        // Add data summary if available
        if (reportData && typeof reportData === 'object') {
          pdf.text('DATA SUMMARY:', margin, yPosition);
          yPosition += 10;
          const entries = Object.entries(reportData).slice(0, 10); // Limit to first 10 entries
          entries.forEach(([key, value]) => {
            const text = `• ${key}: ${String(value).substring(0, 50)}`;
            pdf.text(text, margin + 5, yPosition);
            yPosition += 6;
          });
        }
    }
    
    // Add footer
    yPosition = pdf.internal.pageSize.height - 30;
    pdf.setDrawColor(41, 128, 185);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Sona - Mental Health & Wellness Platform', margin, yPosition);
    pdf.text('Generated by Sona Admin Dashboard', pageWidth - margin, yPosition, { align: 'right' });
    
    // Save the PDF
    const fileName = `Sona-${reportType.replace(/\s+/g, '-')}-Report-${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('Saving PDF with filename:', fileName);
    pdf.save(fileName);
    
    console.log('PDF download completed successfully for:', reportType);
    // Optional: Show success message
    // alert('PDF report generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Report type was:', reportType);
    console.error('Report data was:', reportData);
    alert('There was an error generating the PDF. Please check the console for details and try again.');
  }
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

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={false} onClose={() => {}} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={() => {}} />
          <div className="p-4 lg:p-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Scheduled</p>
                    <p className="text-2xl font-bold text-gray-900">{mockSessionAnalytics.summary.scheduled}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{mockSessionAnalytics.summary.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cancelled</p>
                    <p className="text-2xl font-bold text-gray-900">{mockSessionAnalytics.summary.cancelled}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
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

            {/* Session Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Session Distribution</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-blue-600">{mockSessionAnalytics.summary.scheduled}</p>
                  <p className="text-sm text-gray-600">Scheduled</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-green-600">{mockSessionAnalytics.summary.completed}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((mockSessionAnalytics.summary.completed / mockSessionAnalytics.summary.scheduled) * 100).toFixed(1)}% completion rate
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-red-600">{mockSessionAnalytics.summary.cancelled}</p>
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((mockSessionAnalytics.summary.cancelled / mockSessionAnalytics.summary.scheduled) * 100).toFixed(1)}% cancellation rate
                  </p>
                </div>
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
              <BarChart
                title="Topic Distribution"
                data={mockSessionAnalytics.topics.map(topic => ({
                  label: topic.topic.charAt(0).toUpperCase() + topic.topic.slice(1),
                  value: topic.count
                }))}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieChartVisual
                title="Topic Distribution by Percentage"
                data={mockSessionAnalytics.topics.map((topic, index) => ({
                  label: topic.topic.charAt(0).toUpperCase() + topic.topic.slice(1),
                  value: topic.count,
                  color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][index]
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
    averageResponseTime: Object.values(mockPerformanceData).reduce((sum, data) => sum + data.averageResponseTime, 0) / Object.values(mockPerformanceData).length,
    averagePunctuality: Object.values(mockPerformanceData).reduce((sum, data) => sum + data.punctualityRate, 0) / Object.values(mockPerformanceData).length
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
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          
          {/* Mobile Sidebar */}
          <div className="lg:hidden">
            <Sidebar isOpen={false} onClose={() => {}} />
          </div>
          
          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={() => {}} />
            <div className="p-4 lg:p-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                      <p className="text-sm text-gray-600">Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedCounselorData.averageResponseTime}h</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Punctuality</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedCounselorData.punctualityRate}%</p>
                    </div>
                    <Target className="w-8 h-8 text-green-600" />
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
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedCounselorData.clientFeedbacks.map((feedback, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Star className="w-5 h-5 text-purple-600 fill-current" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 truncate">{feedback.client}</span>
                            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2 break-words">{feedback.comment}</p>
                          <p className="text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={false} onClose={() => {}} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={() => {}} />
          <div className="p-4 lg:p-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{overallPerformance.averageResponseTime.toFixed(1)}h</p>
                  <p className="text-sm text-gray-600">Avg. Response Time</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{overallPerformance.averagePunctuality.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Avg. Punctuality</p>
                </div>
              </div>
            </div>

            {/* Counselors List */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Counselors Performance Overview</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {mockCounselors.map(counselor => {
                    const performance = mockPerformanceData[counselor.id];
                    return (
                      <div 
                        key={counselor.id}
                        onClick={() => setSelectedCounselor(counselor.id)}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold truncate">{counselor.name}</h4>
                            <p className="text-sm text-gray-600 truncate">{counselor.specialization.join(', ')}</p>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                              <span className="truncate">{counselor.city}</span>
                              <span>•</span>
                              <span className="whitespace-nowrap">{counselor.experience} years exp</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{performance.averageFeedback}/5</span>
                          </div>
                          <div className="text-sm text-gray-600 whitespace-nowrap">
                            {performance.sessionsConducted} sessions • {performance.punctualityRate}% punctuality
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
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
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          
          {/* Mobile Sidebar */}
          <div className="lg:hidden">
            <Sidebar isOpen={false} onClose={() => {}} />
          </div>
          
          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={() => {}} />
            <div className="p-4 lg:p-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedUser.sessionsCompleted}</p>
                  <p className="text-sm text-gray-600">Completed Sessions</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedUser.scheduledSessions}</p>
                  <p className="text-sm text-gray-600">Scheduled Sessions</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{Math.round(selectedUser.totalPlatformTime / 60)}h</p>
                  <p className="text-sm text-gray-600">Platform Time</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {((selectedUser.sessionsCompleted / selectedUser.scheduledSessions) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
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
                        <p className="font-bold text-green-600">Session Completed</p>
                        <p className="text-sm text-gray-600">45 min duration</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">New Session Scheduled</p>
                          <p className="text-sm text-gray-600">5 days ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">Upcoming</p>
                        <p className="text-sm text-gray-600">Next week</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={false} onClose={() => {}} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={() => {}} />
          <div className="p-4 lg:p-6">
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
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <div 
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold truncate">{user.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1 flex-wrap">
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
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full truncate">
                              {user.city}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">{user.sessionsCompleted}</span> completed
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">{user.scheduledSessions}</span> scheduled
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
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={false} onClose={() => {}} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={() => {}} />
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Financial Report</h1>
                  <p className="text-gray-600">Revenue and financial performance analysis</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockFinancialData.revenue.total)}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockFinancialData.revenue.total * 0.68)}</p>
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
                  { label: 'Sessions', value: 60.2, color: '#10B981' },
                  { label: 'Subscriptions', value: 39.8, color: '#3B82F6' }
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
        </div>
      </div>
    </div>
  );
};

// ==================== CREATE REPORT COMPONENT ====================

const CreateReport = ({ onCancel, onCreateReport }: { onCancel: () => void; onCreateReport: (report: Report) => void }) => {
  const [reportType, setReportType] = useState<'session-analytics' | 'counselor-performance' | 'user-engagement' | 'financial'>('session-analytics');
  const [dateRange, setDateRange] = useState<'last-week' | 'last-month' | 'last-quarter' | 'custom'>('last-month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getDateRangeValues = () => {
    const now = new Date();
    let start: Date, end: Date;

    switch (dateRange) {
      case 'last-week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        end = now;
        break;
      case 'last-month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        end = now;
        break;
      case 'last-quarter':
        start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        end = now;
        break;
      case 'custom':
        start = customStart ? new Date(customStart) : now;
        end = customEnd ? new Date(customEnd) : now;
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        end = now;
    }
    
    return { start, end };
  };

  const generateReportTitle = () => {
    if (title.trim()) return title.trim();
    
    const typeNames = {
      'session-analytics': 'Session Analytics',
      'counselor-performance': 'Counselor Performance',
      'user-engagement': 'User Engagement',
      'financial': 'Financial Summary'
    };
    
    const { start, end } = getDateRangeValues();
    const startMonth = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (dateRange === 'last-week') {
      return `${typeNames[reportType]} - Week of ${start.toLocaleDateString()}`;
    } else if (dateRange === 'last-month') {
      return `${typeNames[reportType]} - ${startMonth}`;
    } else if (dateRange === 'last-quarter') {
      return `${typeNames[reportType]} - Q${Math.ceil((end.getMonth() + 1) / 3)} ${end.getFullYear()}`;
    } else {
      return `${typeNames[reportType]} - ${startMonth} to ${endMonth}`;
    }
  };

  const handleCreateReport = () => {
    if (!title.trim() && dateRange === 'custom' && (!customStart || !customEnd)) {
      alert('Please provide a title and valid date range for custom reports.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const { start, end } = getDateRangeValues();
      const newReport: Report = {
        id: Math.random().toString(36).substr(2, 9),
        title: generateReportTitle(),
        type: reportType,
        status: 'completed', // Start as completed so it can be downloaded immediately
        createdDate: new Date().toISOString(),
        dateRange: { 
          start: start.toISOString(), 
          end: end.toISOString() 
        },
        createdBy: '1' // Admin user
      };

      onCreateReport(newReport);
      setIsGenerating(false);
      
      // Show success message and close
      alert(`Report "${newReport.title}" has been generated successfully!`);
      onCancel();
    }, 2000); // 2 second delay to simulate generation
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={false} onClose={() => {}} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={() => {}} />
          <div className="p-4 lg:p-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center space-x-4 mb-6">
                <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Report</h1>
                  <p className="text-gray-600">Generate a new analytics report</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-6">
                  {/* Report Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="session-analytics">Session Analytics</option>
                      <option value="counselor-performance">Counselor Performance</option>
                      <option value="user-engagement">User Engagement</option>
                      <option value="financial">Financial</option>
                    </select>
                  </div>

                  {/* Report Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter report title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    >
                      <option value="last-week">Last Week</option>
                      <option value="last-month">Last Month</option>
                      <option value="last-quarter">Last Quarter</option>
                      <option value="custom">Custom Range</option>
                    </select>

                    {dateRange === 'custom' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Format Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Export Format
                    </label>
                    <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-700 font-medium">PDF Format (Default)</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Reports are automatically generated in PDF format for easy sharing and printing.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                      onClick={onCancel}
                      disabled={isGenerating}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateReport}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isGenerating && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN REPORTS COMPONENT ====================

const Reports = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'session-analytics' | 'counselor-performance' | 'user-engagement' | 'financial'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const addNewReport = (newReport: Report) => {
    setReports(prevReports => [newReport, ...prevReports]); // Add new report at the beginning
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
      default:
        return null;
    }
  };

  if (showCreateForm) {
    return <CreateReport 
      onCancel={() => setShowCreateForm(false)} 
      onCreateReport={addNewReport}
    />;
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
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>
        
        {/* Main content */}
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
              </select>
            </div>

            {/* Reports List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                {filteredReports.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <h3 className="font-semibold text-gray-900 truncate">{report.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getTypeColor(report.type)}`}>
                              {formatTypeName(report.type)}
                            </span>
                          </div>
                          {/* <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span> */}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Created: {new Date(report.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div className="truncate">
                            <span>Period: {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}</span>
                          </div>
                          {/* <div className="truncate">
                            <span>By: {report.createdBy === '1' ? 'Admin User' : report.createdBy === '2' ? 'Manager' : 'System'}</span>
                          </div> */}
                        </div>

                        <div className="flex items-center space-x-2 flex-wrap gap-2">
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