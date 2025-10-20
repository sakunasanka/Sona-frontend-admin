// api/reportsAPI.ts
import API from './api';

// Types based on API responses
export interface SessionAnalyticsData {
  summary: {
    totalSessions: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  };
  frequency: {
    weekly: { week: string; sessions: number }[];
    monthly: { month: string; sessions: number }[];
  };
  counselorPerformance: {
    counselor: string;
    sessions: number;
    averageRating: number | null;
  }[];
  trends: { month: string; sessions: number }[];
  feedback: {
    rating: number;
    comment: string;
    date: string;
    counselorName: string;
    clientName: string;
    sessionId: number;
  }[];
}

export interface Counselor {
  id: string;
  name: string;
  specialization: string[];
  joinDate: string;
}

export interface Psychiatrist {
  id: string;
  name: string;
  specialization: string[];
  joinDate: string;
}

export interface DashboardOverview {
  totalCounselors: number;
  totalPsychiatrists: number;
  totalClients: number;
  totalSessions: number;
  completedSessions: number;
  totalRevenue: number;
  ongoingSessions: number | null;
  scheduledSessions: number;
}

export interface DashboardMetric {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  textcolor: string;
}

export interface MonthlyUser {
  month: string;
  counselors: number;
  psychiatrists: number;
  clients: number;
  total: number;
}

export interface DailySession {
  date: string;
  counselor: number;
  psychiatrist: number;
  total: number;
}

export interface MonthlyGrowth {
  month: string;
  users: number;
  sessions: number;
  revenue: number;
  growth_rate: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface SessionType {
  name: string;
  value: number;
  percentage: number;
}

export interface SessionStatus {
  name: string;
  value: number;
}

export interface RecentActivity {
  type: string;
  message: string;
  time: string;
  icon: string;
  color: string;
}

export interface TopCounselor {
  name: string;
  sessions: number;
  rating: number;
  specialty: string;
}

export interface CompleteDashboardData {
  mainMetrics: DashboardMetric[];
  loginMetrics: DashboardMetric[];
  sessionMetrics: DashboardMetric[];
  charts: {
    monthlyUsers: MonthlyUser[];
    dailySessions: DailySession[];
    monthlyGrowth: MonthlyGrowth[];
    monthlyRevenue: MonthlyRevenue[];
    sessionTypes: SessionType[];
    userDistribution: any[];
    sessionStatus: SessionStatus[];
  };
  recentActivities: RecentActivity[];
  topCounselors: TopCounselor[];
}

export interface FinancialReportData {
  summary: {
    totalRevenue: number;
    platformFees: number;
    sessionFees: number;
    successfulTransactions: number;
    successfulSessionTransactions: number;
    successfulPlatformTransactions: number;
  };
  monthlyTrends: {
    month: string;
    totalRevenue: number;
    platformFees: number;
    sessionFees: number;
    transactionCount: number;
  }[];
  paymentTypeBreakdown: {
    type: string;
    revenue: number;
    count: number;
    percentage: number;
  }[];
}

// API Functions
export const reportsAPI = {
  // Session Analytics with year/month parameters
  getSessionAnalytics: async (year?: number, month?: number): Promise<SessionAnalyticsData> => {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const response = await API.get('/admin/reports/session-analytics', { params });
    return response.data.data;
  },

  // Counselors with year/month parameters
  getCounselors: async (year?: number, month?: number): Promise<Counselor[]> => {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const response = await API.get('/admin/reports/counselors', { params });
    return response.data.data;
  },

  // Psychiatrists with year/month parameters
  getPsychiatrists: async (year?: number, month?: number): Promise<Psychiatrist[]> => {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const response = await API.get('/admin/reports/psychiatrists', { params });
    return response.data.data;
  },

  // Dashboard Overview
  getDashboardOverview: async (): Promise<DashboardOverview> => {
    const response = await API.get('/admin/dashboard/overview');
    return response.data.data;
  },

  // Dashboard Metrics
  getDashboardMetrics: async (): Promise<DashboardMetric[]> => {
    const response = await API.get('/admin/dashboard/metrics');
    return response.data.data;
  },

  // Login Metrics
  getLoginMetrics: async (): Promise<DashboardMetric[]> => {
    const response = await API.get('/admin/dashboard/login-metrics');
    return response.data.data;
  },

  // Session Breakdown
  getSessionBreakdown: async (): Promise<DashboardMetric[]> => {
    const response = await API.get('/admin/dashboard/session-breakdown');
    return response.data.data;
  },

  // Monthly Users
  getMonthlyUsers: async (): Promise<MonthlyUser[]> => {
    const response = await API.get('/admin/dashboard/monthly-users');
    return response.data.data;
  },

  // Daily Sessions
  getDailySessions: async (): Promise<DailySession[]> => {
    const response = await API.get('/admin/dashboard/daily-sessions');
    return response.data.data;
  },

  // Monthly Growth
  getMonthlyGrowth: async (): Promise<MonthlyGrowth[]> => {
    const response = await API.get('/admin/dashboard/monthly-growth');
    return response.data.data;
  },

  // Monthly Revenue
  getMonthlyRevenue: async (): Promise<MonthlyRevenue[]> => {
    const response = await API.get('/admin/dashboard/monthly-revenue');
    return response.data.data;
  },

  // Complete Dashboard with year/month parameters
  getCompleteDashboard: async (year?: number, month?: number): Promise<CompleteDashboardData> => {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const response = await API.get('/admin/dashboard/complete', { params });
    return response.data.data;
  },

  // Financial Report with year/month parameters
  getFinancialReport: async (year?: number, month?: number): Promise<FinancialReportData> => {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const response = await API.get('/admin/reports/financial', { params });
    return response.data.data;
  },
};

