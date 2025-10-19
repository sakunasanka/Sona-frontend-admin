import { useState, useEffect } from 'react';
import {
  FileText, Calendar, Users,
  TrendingUp, DollarSign, ArrowLeft,
  Download, Loader2, CheckCircle, XCircle, Star, UserCheck,
} from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';
import jsPDF from 'jspdf';
import { reportsAPI, SessionAnalyticsData, Counselor, Psychiatrist, DashboardOverview, DashboardMetric, MonthlyUser, DailySession, MonthlyGrowth, MonthlyRevenue, FinancialReportData } from '../../api/reportsAPI';

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
        pdf.text(`• Platform Revenue: ${reportData?.summary?.platformFees ? formatCurrency(reportData.summary.platformFees) : '$0'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Session Fees Processed: ${reportData?.summary?.sessionFees ? formatCurrency(reportData.summary.sessionFees) : '$0'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Total Transaction Volume: ${reportData?.summary?.totalRevenue ? formatCurrency(reportData.summary.totalRevenue) : '$0'}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`• Successful Transactions: ${reportData?.summary?.successfulTransactions || 0}`, margin, yPosition);
        yPosition += 15;
        
        pdf.text('PAYMENT FLOW BREAKDOWN:', margin, yPosition);
        yPosition += 10;
        if (reportData?.paymentTypeBreakdown) {
          reportData.paymentTypeBreakdown.forEach((item: { type: string; revenue: number; count: number; percentage: number }) => {
            pdf.text(`• ${item.type === 'session_fee' ? 'Counselor Payments' : 'Platform Revenue'}: ${formatCurrency(item.revenue)} (${item.percentage}%)`, margin + 5, yPosition);
            yPosition += 6;
          });
        }
        yPosition += 10;
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Note: Session fees are transferred directly to counselors. Platform revenue consists only of platform fees.', margin, yPosition);
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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

const SessionAnalyticsReport = ({ data: _data, onBack }: { data: Report; onBack: () => void }) => {
  const [sessionData, setSessionData] = useState<SessionAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessionAnalytics();
  }, []);

  const fetchSessionAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching session analytics data');
      const data = await reportsAPI.getSessionAnalytics();
      console.log('Received session analytics data:', data);
      setSessionData(data);
    } catch (err) {
      setError('Failed to load session analytics data');
      console.error('Error fetching session analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (sessionData) {
      downloadAsPDF('session-analytics', sessionData);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={false} onClose={() => {}} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={() => {}} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading session analytics...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={false} onClose={() => {}} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={() => {}} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error || 'No data available'}</p>
                <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Go Back
                </button>
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
                  <h1 className="text-2xl font-bold text-gray-900">Session Analytics Report</h1>
                  <p className="text-gray-600">Comprehensive analysis of counseling sessions</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Scheduled</p>
                    <p className="text-2xl font-bold text-gray-900">{sessionData.summary.scheduled}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{sessionData.summary.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cancelled</p>
                    <p className="text-2xl font-bold text-gray-900">{sessionData.summary.cancelled}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Session Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Session Distribution</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-blue-600">{sessionData.summary.scheduled}</p>
                  <p className="text-sm text-gray-600">Scheduled</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-green-600">{sessionData.summary.completed}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((sessionData.summary.completed / sessionData.summary.scheduled) * 100).toFixed(1)}% completion rate
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-red-600">{sessionData.summary.cancelled}</p>
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((sessionData.summary.cancelled / sessionData.summary.scheduled) * 100).toFixed(1)}% cancellation rate
                  </p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <LineChart
                title="Session Frequency (Monthly)"
                data={sessionData.frequency.monthly.map(month => ({
                  label: month.month.split(' ')[0],
                  value: month.sessions
                }))}
              />
              <BarChart
                title="Counselor Performance"
                data={sessionData.counselorPerformance.map(counselor => ({
                  label: counselor.counselor.split(' ')[0],
                  value: counselor.sessions
                }))}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-4">Session Trends</h4>
                <LineChart
                  title="Monthly Trends"
                  data={sessionData.trends.map(trend => ({
                    label: trend.month,
                    value: trend.sessions
                  }))}
                />
              </div>
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

            {/* Feedback Section */}
            {sessionData.feedback.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                <h3 className="font-semibold mb-4">Recent Feedback</h3>
                <div className="space-y-4">
                  {sessionData.feedback.slice(0, 5).map((feedback, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{feedback.rating}/5</span>
                        </div>
                        <span className="text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{feedback.comment}</p>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Counselor:</span> {feedback.counselorName} |
                        <span className="font-medium"> Client:</span> {feedback.clientName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CounselorPerformanceReport = ({ data: _data, onBack }: { data: Report; onBack: () => void }) => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    fetchCounselorData();
  }, [selectedMonth]);

  const fetchCounselorData = async () => {
    try {
      setLoading(true);
      setError(null);
      let year: number | undefined;
      let month: number | undefined;
      
      if (selectedMonth) {
        const [y, m] = selectedMonth.split('-');
        year = parseInt(y);
        month = parseInt(m);
      }
      
      console.log('Fetching counselor data with year:', year, 'month:', month);
      const [counselorsData, psychiatristsData] = await Promise.all([
        reportsAPI.getCounselors(year, month),
        reportsAPI.getPsychiatrists(year, month)
      ]);
      console.log('Received counselors:', counselorsData.length, 'psychiatrists:', psychiatristsData.length);
      setCounselors(counselorsData);
      setPsychiatrists(psychiatristsData);
    } catch (err) {
      setError('Failed to load counselor data');
      console.error('Error fetching counselor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (selectedCounselor) {
      downloadAsPDF(`counselor-${selectedCounselor.id}`, selectedCounselor);
    } else {
      downloadAsPDF('counselor-performance', { counselors, psychiatrists });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={false} onClose={() => {}} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={() => {}} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading counselor data...</p>
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
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={false} onClose={() => {}} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={() => {}} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCounselor) {
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
                    <h1 className="text-2xl font-bold text-gray-900">{selectedCounselor.name}</h1>
                    <p className="text-gray-600">Counselor Profile</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>

              {/* Counselor Profile */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-12 h-12 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCounselor.name}</h2>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                        Counselor
                      </span>
                      <span className="text-gray-600">
                        Joined {new Date(selectedCounselor.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCounselor.specialization.map((spec, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Placeholder for future performance metrics */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold mb-4">Performance Overview</h3>
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p>Detailed performance metrics will be available soon.</p>
                  <p className="text-sm mt-2">Currently showing basic counselor information.</p>
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
                  <h1 className="text-2xl font-bold text-gray-900">Counselor & Psychiatrist Performance Report</h1>
                  <p className="text-gray-600">Overview of all counselors and psychiatrists</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Time</option>
                  <option value="2025-10">October 2025</option>
                  <option value="2025-09">September 2025</option>
                  <option value="2025-08">August 2025</option>
                  <option value="2025-07">July 2025</option>
                  <option value="2025-06">June 2025</option>
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

            {/* Team Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{counselors.length}</p>
                <p className="text-sm text-gray-600">Total Counselors</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{psychiatrists.length}</p>
                <p className="text-sm text-gray-600">Total Psychiatrists</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((counselors.length + psychiatrists.length) > 0 ?
                    counselors.reduce((sum, c) => {
                      const joinYear = new Date(c.joinDate).getFullYear();
                      return sum + (2025 - joinYear);
                    }, 0) / (counselors.length + psychiatrists.length) : 0)}
                </p>
                <p className="text-sm text-gray-600">Avg. Experience (Years)</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">4.6</p>
                <p className="text-sm text-gray-600">Avg. Rating</p>
              </div>
            </div>

            {/* Counselors List */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Counselors</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {counselors.map(counselor => (
                    <div
                      key={counselor.id}
                      onClick={() => setSelectedCounselor(counselor)}
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
                            <span className="whitespace-nowrap">Joined {new Date(counselor.joinDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">{counselor.specialization.length}</span> specializations
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Psychiatrists List */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Psychiatrists</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {psychiatrists.map(psychiatrist => (
                    <div
                      key={psychiatrist.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold truncate">{psychiatrist.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{psychiatrist.specialization.join(', ')}</p>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                            <span className="whitespace-nowrap">Joined {new Date(psychiatrist.joinDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">{psychiatrist.specialization.length}</span> specializations
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

const UserEngagementReport = ({ data: _data, onBack }: { data: Report; onBack: () => void }) => {
  const [engagementData, setEngagementData] = useState<{
    sessionAnalytics: SessionAnalyticsData | null;
    counselors: Counselor[];
    psychiatrists: Psychiatrist[];
    overview: DashboardOverview | null;
    metrics: DashboardMetric[];
    loginMetrics: DashboardMetric[];
    sessionBreakdown: DashboardMetric[];
    monthlyUsers: MonthlyUser[];
    dailySessions: DailySession[];
    monthlyGrowth: MonthlyGrowth[];
    monthlyRevenue: MonthlyRevenue[];
  }>({
    sessionAnalytics: null,
    counselors: [],
    psychiatrists: [],
    overview: null,
    metrics: [],
    loginMetrics: [],
    sessionBreakdown: [],
    monthlyUsers: [],
    dailySessions: [],
    monthlyGrowth: [],
    monthlyRevenue: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    fetchEngagementData();
  }, [selectedMonth]);

  const fetchEngagementData = async () => {
    try {
      setLoading(true);
      setError(null);
      let year: number | undefined;
      let month: number | undefined;
      
      if (selectedMonth) {
        const [y, m] = selectedMonth.split('-');
        year = parseInt(y);
        month = parseInt(m);
      }
      
      console.log('User Engagement - Fetching data with year:', year, 'month:', month);

      // Fetch all data in parallel
      const [
        sessionAnalytics,
        counselors,
        psychiatrists,
        overview,
        metrics,
        loginMetrics,
        sessionBreakdown,
        monthlyUsers,
        dailySessions,
        monthlyGrowth,
        monthlyRevenue
      ] = await Promise.all([
        reportsAPI.getSessionAnalytics(year, month),
        reportsAPI.getCounselors(year, month),
        reportsAPI.getPsychiatrists(year, month),
        reportsAPI.getDashboardOverview(),
        reportsAPI.getDashboardMetrics(),
        reportsAPI.getLoginMetrics(),
        reportsAPI.getSessionBreakdown(),
        reportsAPI.getMonthlyUsers(),
        reportsAPI.getDailySessions(),
        reportsAPI.getMonthlyGrowth(),
        reportsAPI.getMonthlyRevenue()
      ]);

      console.log('User Engagement - All data fetched successfully');
      setEngagementData({
        sessionAnalytics,
        counselors,
        psychiatrists,
        overview,
        metrics,
        loginMetrics,
        sessionBreakdown,
        monthlyUsers,
        dailySessions,
        monthlyGrowth,
        monthlyRevenue
      });
    } catch (err) {
      setError('Failed to load user engagement data');
      console.error('User Engagement - Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (engagementData.sessionAnalytics) {
      downloadAsPDF('user-engagement', engagementData);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={false} onClose={() => {}} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={() => {}} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading user engagement data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !engagementData.sessionAnalytics) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={false} onClose={() => {}} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={() => {}} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error || 'No data available'}</p>
                <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Go Back
                </button>
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
                  <p className="text-gray-600">Comprehensive platform activity and user interaction analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    console.log('User Engagement Month changed to:', e.target.value);
                    setSelectedMonth(e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Time</option>
                  <option value="2025-10">October 2025</option>
                  <option value="2025-09">September 2025</option>
                  <option value="2025-08">August 2025</option>
                  <option value="2025-07">July 2025</option>
                  <option value="2025-06">June 2025</option>
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

            {/* Platform Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Counselors</p>
                    <p className="text-2xl font-bold text-gray-900">{engagementData.overview?.totalCounselors || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Active counselors</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Psychiatrists</p>
                    <p className="text-2xl font-bold text-gray-900">{engagementData.overview?.totalPsychiatrists || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Active psychiatrists</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900">{engagementData.overview?.totalClients || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Registered clients</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{engagementData.overview?.totalSessions || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">All counseling sessions</p>
                  </div>
                  <Calendar className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Session Analytics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{engagementData.sessionAnalytics?.summary.scheduled || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{engagementData.sessionAnalytics?.summary.completed || 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cancelled Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{engagementData.sessionAnalytics?.summary.cancelled || 0}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Login Metrics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">User Login Activity</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {engagementData.loginMetrics.map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${metric.color}`}>
                      <span className="text-white text-sm">🔑</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Breakdown */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Session Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {engagementData.sessionBreakdown.map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${metric.color}`}>
                      <span className="text-white text-sm">📅</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly User Growth */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Monthly User Growth</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium">Month</th>
                      <th className="text-right py-2 px-4 font-medium">Counselors</th>
                      <th className="text-right py-2 px-4 font-medium">Psychiatrists</th>
                      <th className="text-right py-2 px-4 font-medium">Clients</th>
                      <th className="text-right py-2 px-4 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagementData.monthlyUsers.map((month, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">{month.month}</td>
                        <td className="py-3 px-4 text-right">{month.counselors}</td>
                        <td className="py-3 px-4 text-right">{month.psychiatrists}</td>
                        <td className="py-3 px-4 text-right">{month.clients}</td>
                        <td className="py-3 px-4 text-right font-bold">{month.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Daily Sessions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Daily Session Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium">Date</th>
                      <th className="text-right py-2 px-4 font-medium">Counselor Sessions</th>
                      <th className="text-right py-2 px-4 font-medium">Psychiatrist Sessions</th>
                      <th className="text-right py-2 px-4 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagementData.dailySessions.map((day, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">{new Date(day.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">{day.counselor}</td>
                        <td className="py-3 px-4 text-right">{day.psychiatrist}</td>
                        <td className="py-3 px-4 text-right font-bold">{day.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Monthly Growth Trends */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Growth Trends</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium">Month</th>
                      <th className="text-right py-2 px-4 font-medium">Users</th>
                      <th className="text-right py-2 px-4 font-medium">Sessions</th>
                      <th className="text-right py-2 px-4 font-medium">Revenue</th>
                      <th className="text-right py-2 px-4 font-medium">Growth Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagementData.monthlyGrowth.map((growth, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">{growth.month}</td>
                        <td className="py-3 px-4 text-right">{growth.users}</td>
                        <td className="py-3 px-4 text-right">{growth.sessions}</td>
                        <td className="py-3 px-4 text-right">Rs.{growth.revenue}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-medium ${growth.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {growth.growth_rate >= 0 ? '+' : ''}{growth.growth_rate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Monthly Revenue</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium">Month</th>
                      <th className="text-right py-2 px-4 font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagementData.monthlyRevenue.map((revenue, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">{revenue.month}</td>
                        <td className="py-3 px-4 text-right font-bold text-green-600">Rs.{revenue.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Counselor Performance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Counselor Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium">Counselor</th>
                      <th className="text-right py-2 px-4 font-medium">Sessions</th>
                      <th className="text-right py-2 px-4 font-medium">Avg Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagementData.sessionAnalytics?.counselorPerformance.map((counselor, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">{counselor.counselor}</td>
                        <td className="py-3 px-4 text-right">{counselor.sessions}</td>
                        <td className="py-3 px-4 text-right">{counselor.averageRating || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Counselors List */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Active Counselors ({engagementData.counselors.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {engagementData.counselors.map((counselor, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{counselor.name}</h4>
                    <p className="text-sm text-gray-600">ID: {counselor.id}</p>
                    <p className="text-sm text-gray-600">Joined: {new Date(counselor.joinDate).toLocaleDateString()}</p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Specializations:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {counselor.specialization.map((spec, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Psychiatrists List */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Active Psychiatrists ({engagementData.psychiatrists.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {engagementData.psychiatrists.map((psychiatrist, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{psychiatrist.name}</h4>
                    <p className="text-sm text-gray-600">ID: {psychiatrist.id}</p>
                    <p className="text-sm text-gray-600">Joined: {new Date(psychiatrist.joinDate).toLocaleDateString()}</p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Specializations:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {psychiatrist.specialization.map((spec, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-4">Monthly Session Trends</h4>
                <LineChart
                  data={engagementData.sessionAnalytics?.frequency.monthly.map(month => ({
                    label: month.month.split(' ')[0],
                    value: month.sessions
                  })) || []}
                  title="Monthly Sessions"
                  color="blue"
                />
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-4">Weekly Session Frequency</h4>
                <BarChart
                  title="Weekly Sessions"
                  color="green"
                  data={engagementData.sessionAnalytics?.frequency.weekly.map(week => ({
                    label: week.week.split('-')[2], // Day of month
                    value: week.sessions
                  })) || []}
                />
              </div>
            </div>

            {/* Recent Feedback */}
            {engagementData.sessionAnalytics?.feedback && engagementData.sessionAnalytics.feedback.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold mb-4">Recent Session Feedback</h3>
                <div className="space-y-4">
                  {engagementData.sessionAnalytics.feedback.slice(0, 5).map((feedback, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{feedback.rating}/5</span>
                        </div>
                        <span className="text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{feedback.comment}</p>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Counselor:</span> {feedback.counselorName} |
                        <span className="font-medium"> Client:</span> {feedback.clientName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialReport = ({ data: _data, onBack }: { data: Report; onBack: () => void }) => {
  const [financialData, setFinancialData] = useState<FinancialReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    fetchFinancialData();
  }, [selectedMonth]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);
      let year: number | undefined;
      let month: number | undefined;
      
      if (selectedMonth) {
        const [y, m] = selectedMonth.split('-');
        year = parseInt(y);
        month = parseInt(m);
      }
      
      console.log('Fetching financial data with year:', year, 'month:', month);
      const data = await reportsAPI.getFinancialReport(year, month);
      console.log('Received financial data:', data);
      setFinancialData(data);
    } catch (err) {
      setError('Failed to load financial data');
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (financialData) {
      downloadAsPDF('financial', financialData);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={false} onClose={() => {}} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={() => {}} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading financial data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !financialData) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={false} onClose={() => {}} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={() => {}} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error || 'No data available'}</p>
                <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Go Back
                </button>
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
                  <h1 className="text-2xl font-bold text-gray-900">Financial Report</h1>
                  <p className="text-gray-600">Revenue and financial performance analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Time</option>
                  <option value="2025-10">October 2025</option>
                  <option value="2025-09">September 2025</option>
                  <option value="2025-08">August 2025</option>
                  <option value="2025-07">July 2025</option>
                  <option value="2025-06">June 2025</option>
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

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Platform Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData!.summary.platformFees)}</p>
                    <p className="text-xs text-gray-500 mt-1">Fees collected by platform</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Session Fees Processed</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData!.summary.sessionFees)}</p>
                    <p className="text-xs text-gray-500 mt-1">Transferred to counselors</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Transaction Volume</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData!.summary.totalRevenue)}</p>
                    <p className="text-xs text-gray-500 mt-1">All payments processed</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Successful Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{financialData!.summary.successfulTransactions}</p>
                    <p className="text-xs text-gray-500 mt-1">Completed payments</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PieChartVisual
                title="Payment Flow Distribution"
                data={financialData!.paymentTypeBreakdown.map((item) => ({
                  label: item.type === 'session_fee' ? 'Counselor Payments' : 'Platform Revenue',
                  value: item.revenue,
                  color: item.type === 'session_fee' ? '#3B82F6' : '#10B981'
                }))}
              />
              <BarChart
                title="Monthly Transaction Volume"
                color="green"
                data={financialData!.monthlyTrends.map((month) => ({
                  label: month.month.split(' ')[0],
                  value: month.totalRevenue
                }))}
              />
            </div>

            {/* Transaction Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-4">Payment Flow Breakdown</h4>
                <div className="space-y-3">
                  {financialData!.paymentTypeBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${
                          item.type === 'session_fee' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <span className="font-medium">
                          {item.type === 'session_fee' ? 'Counselor Payments' : 'Platform Revenue'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(item.revenue)}</p>
                        <p className="text-sm text-gray-600">{item.count} transactions</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Session fees are transferred directly to counselors. Platform only retains platform fees as revenue.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-4">Monthly Performance</h4>
                <LineChart
                  data={financialData!.monthlyTrends.map((month) => ({
                    label: month.month.split(' ')[0],
                    value: month.totalRevenue
                  }))}
                  title="Revenue Trend"
                  color="green"
                />
              </div>
            </div>

            {/* Detailed Monthly Breakdown */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold mb-4">Monthly Transaction Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium">Month</th>
                      <th className="text-right py-2 px-4 font-medium">Total Volume</th>
                      <th className="text-right py-2 px-4 font-medium">Counselor Payments</th>
                      <th className="text-right py-2 px-4 font-medium">Platform Revenue</th>
                      <th className="text-right py-2 px-4 font-medium">Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData!.monthlyTrends.map((month, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">{month.month}</td>
                        <td className="py-3 px-4 text-right font-bold">
                          {formatCurrency(month.totalRevenue)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(month.sessionFees)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-green-600">
                          {formatCurrency(month.platformFees)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {month.transactionCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-medium mb-2">Revenue Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Platform Revenue:</span>
                      <span className="font-bold text-green-600">
                        {((financialData!.summary.platformFees / financialData!.summary.totalRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Counselor Payments:</span>
                      <span className="font-bold text-blue-600">
                        {((financialData!.summary.sessionFees / financialData!.summary.totalRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Platform keeps {((financialData!.summary.platformFees / financialData!.summary.totalRevenue) * 100).toFixed(1)}% of transaction volume</p>
                </div>

                <div className="text-center">
                  <h4 className="font-medium mb-2">Transaction Success Rate</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {financialData!.summary.successfulTransactions > 0 ? '100%' : '0%'}
                  </div>
                  <p className="text-sm text-gray-600">
                    {financialData!.summary.successfulTransactions} successful transactions
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All payments processed successfully</p>
                </div>

                <div className="text-center">
                  <h4 className="font-medium mb-2">Average Platform Fee per Transaction</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(financialData!.summary.successfulTransactions > 0 ?
                      financialData!.summary.platformFees / financialData!.summary.successfulPlatformTransactions : 0)}
                  </div>
                  <p className="text-sm text-gray-600">Platform revenue per transaction</p>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleViewReport = (reportType: 'session-analytics' | 'counselor-performance' | 'user-engagement' | 'financial') => {
    // Create a mock report object for the selected type
    const mockReport: Report = {
      id: reportType,
      title: '',
      type: reportType,
      status: 'completed',
      createdDate: new Date().toISOString(),
      dateRange: { 
        start: new Date().toISOString(), 
        end: new Date().toISOString() 
      },
      createdBy: '1'
    };
    setViewingReport(mockReport);
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

  if (viewingReport) {
    return renderReportComponent();
  }

  const reportTypes = [
    {
      type: 'session-analytics' as const,
      title: 'Session Analytics',
      description: 'Comprehensive analysis of counseling sessions',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      type: 'counselor-performance' as const,
      title: 'Counselor Performance',
      description: 'Overview of counselor and psychiatrist performance',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      type: 'user-engagement' as const,
      title: 'User Engagement',
      description: 'Platform activity and user interaction analysis',
      icon: TrendingUp,
      color: 'bg-indigo-500'
    },
    {
      type: 'financial' as const,
      title: 'Financial Report',
      description: 'Revenue and financial performance analysis',
      icon: DollarSign,
      color: 'bg-green-500'
    }
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
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={toggleSidebar} />
          <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600">Generate and export comprehensive reports</p>
            </div>

            {/* Report Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {reportTypes.map((reportType) => {
                const IconComponent = reportType.icon;
                return (
                  <div
                    key={reportType.type}
                    onClick={() => handleViewReport(reportType.type)}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 ${reportType.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {reportType.title}
                        </h3>
                        <p className="text-sm text-gray-600">{reportType.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Click to generate report</span>
                      <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                        <FileText className="w-5 h-5" />
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
  );
}; 

export default Reports;

