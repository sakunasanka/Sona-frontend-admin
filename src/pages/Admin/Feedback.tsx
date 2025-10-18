import React, { useState, useEffect } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { feedbackAPI } from '../../api/feedbackAPI';
import { 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Star,
  User,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  FileText,
  Image,
  Eye,
  Loader2
} from 'lucide-react';

// Types
interface ApiFeedback {
  review_id: number;
  sessionId: number;
  rating: number;
  comment: string;
  createdDate: string;
  sessionDate: string;
  timeSlot: string;
  clientName: string;
  counselorName: string;
  sessionStatus: string;
}

interface Feedback {
  id: string;
  type: 'complaint' | 'session' | 'suggestion' | 'emergency' | 'general' | 'testimonial';
  category: 'individual' | 'family' | 'group' | 'online' | 'crisis' | 'addiction' | 'trauma' | 'relationship';
  title: string;
  description: string;
  author: string;
  nickname: string;
  counsellorName: string;
  createdAt: Date;
  updatedAt: Date;
  additionalDetails?: string;
  proof?: {
    type: 'pdf' | 'image';
    url: string;
    name: string;
  };
  resolutionReason?: string;
  tags: string[];
  rating?: number;
  isAnonymous: boolean;
  // Additional session info from API
  sessionDate?: string;
  timeSlot?: string;
  sessionStatus?: string;
  // Status only for complaints, not for session feedback
  status?: 'pending' | 'in-progress' | 'resolved' | 'rejected' | 'urgent';
}

interface FeedbackFilters {
  type: string;
  category: string;
  status: string;
  search: string;
}

type SortField = 'createdAt' | 'updatedAt' | 'status' | 'rating';
type SortDirection = 'asc' | 'desc';

// Helper function to transform API data to component format
const transformApiFeedback = (apiFeedback: ApiFeedback): Feedback => ({
  id: apiFeedback.review_id.toString(),
  type: 'session', // All API data is session feedback
  category: 'individual', // Default category
  title: `Session feedback - Rating: ${apiFeedback.rating}/5`,
  description: apiFeedback.comment,
  author: apiFeedback.clientName,
  nickname: apiFeedback.clientName.split(' ').map(n => n[0]).join('') + apiFeedback.review_id,
  counsellorName: apiFeedback.counselorName,
  createdAt: new Date(apiFeedback.createdDate),
  updatedAt: new Date(apiFeedback.createdDate),
  tags: [`session-${apiFeedback.sessionId}`, 'feedback', `${apiFeedback.sessionDate}-${apiFeedback.timeSlot}`],
  rating: apiFeedback.rating, // Keep decimal rating
  isAnonymous: false,
  // Store additional session info for display
  sessionDate: apiFeedback.sessionDate,
  timeSlot: apiFeedback.timeSlot,
  sessionStatus: apiFeedback.sessionStatus
  // No status field for session feedback
});

const FeedbackManagement: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [sessionFilters, setSessionFilters] = useState<FeedbackFilters>({
    type: 'session',
    category: '',
    status: '',
    search: ''
  });
  const [complaintFilters, setComplaintFilters] = useState<FeedbackFilters>({
    type: 'complaint',
    category: '',
    status: '',
    search: ''
  });
  const [sessionSortField, setSessionSortField] = useState<SortField>('createdAt');
  const [sessionSortDirection, setSessionSortDirection] = useState<SortDirection>('desc');
  const [complaintSortField, setComplaintSortField] = useState<SortField>('createdAt');
  const [complaintSortDirection, setComplaintSortDirection] = useState<SortDirection>('desc');
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'complaints'>('overview');
  const [resolutionReason, setResolutionReason] = useState<{ [key: string]: string }>({});
  const [selectedProof, setSelectedProof] = useState<{ url: string; name: string; type: 'pdf' | 'image' } | null>(null);

  // Fetch feedbacks from API
  const fetchFeedbacks = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackAPI.getAllFeedbacks(page, pagination.limit);
      
      if (response.data.success) {
        const transformedFeedbacks = response.data.data.feedbacks.map(transformApiFeedback);
        setFeedback(transformedFeedbacks);
        setPagination(response.data.data.pagination);
      } else {
        setError('Failed to fetch feedbacks');
      }
    } catch (err) {
      setError('Error fetching feedbacks: ' + (err as Error).message);
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFeedbacks(1);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleStatusChange = (id: string, status: 'pending' | 'in-progress' | 'resolved' | 'rejected' | 'urgent') => {
    setFeedback(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status, 
              updatedAt: new Date(),
              ...(status === 'resolved' || status === 'rejected' ? { resolutionReason: resolutionReason[id] || '' } : {})
            }
          : item
      )
    );
    // Clear the resolution reason after applying
    if (status === 'resolved' || status === 'rejected') {
      setResolutionReason(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleResolutionReasonChange = (id: string, reason: string) => {
    setResolutionReason(prev => ({ ...prev, [id]: reason }));
  };

  const handleSort = (field: SortField, type: 'session' | 'complaint') => {
    if (type === 'session') {
      if (sessionSortField === field) {
        setSessionSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSessionSortField(field);
        setSessionSortDirection('desc');
      }
    } else {
      if (complaintSortField === field) {
        setComplaintSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setComplaintSortField(field);
        setComplaintSortDirection('desc');
      }
    }
  };

  const getFilteredAndSorted = (filters: FeedbackFilters, sortField: SortField, sortDirection: SortDirection) => {
    let filtered = feedback.filter(item => {
      const matchesType = !filters.type || item.type === filters.type;
      const matchesCategory = !filters.category || item.category === filters.category;
      const matchesStatus = !filters.status || (item.status && item.status === filters.status);
      const matchesSearch = !filters.search || 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.author.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.counsellorName.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesType && matchesCategory && matchesStatus && matchesSearch;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'createdAt':
        case 'updatedAt':
          aValue = new Date(a[sortField]).getTime();
          bValue = new Date(b[sortField]).getTime();
          break;
        case 'status':
          const statusOrder = { pending: 1, 'in-progress': 2, resolved: 3, rejected: 4, urgent: 5 };
          aValue = a.status ? statusOrder[a.status] : 999; // Put items without status at end
          bValue = b.status ? statusOrder[b.status] : 999;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const sessionFeedback = getFilteredAndSorted(sessionFilters, sessionSortField, sessionSortDirection);
  const complaintFeedback = getFilteredAndSorted(complaintFilters, complaintSortField, complaintSortDirection);

  // Stats calculation
  const totalFeedback = pagination.total; // Use API pagination total
  const pendingCount = feedback.filter(f => f.status === 'pending').length; // Only for complaints
  const sessionFeedbackCount = feedback.filter(f => f.type === 'session').length;
  const complaintsCount = feedback.filter(f => f.type === 'complaint').length;
  const averageRating = feedback.filter(f => f.rating).length > 0 
    ? feedback.filter(f => f.rating).reduce((acc, f) => acc + (f.rating || 0), 0) / feedback.filter(f => f.rating).length
    : 0;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status?: 'pending' | 'in-progress' | 'resolved' | 'rejected' | 'urgent') => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'urgent':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          const filled = i < Math.floor(rating);
          const halfFilled = i === Math.floor(rating) && rating % 1 >= 0.5;
          return (
            <Star 
              key={i} 
              className={`w-4 h-4 ${
                filled ? 'text-yellow-400 fill-current' : 
                halfFilled ? 'text-yellow-400 fill-current opacity-50' : 
                'text-gray-300'
              }`} 
            />
          );
        })}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)}/5)</span>
      </div>
    );
  };

  const ProofSection: React.FC<{ proof: Feedback['proof'] }> = ({ proof }) => {
    if (!proof) return null;

    const handleViewProof = () => {
      setSelectedProof(proof);
    };

    return (
      <div className="mt-4">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Supporting Proof
        </h4>
        <button
          onClick={handleViewProof}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-2 transition-colors"
        >
          {proof.type === 'pdf' ? (
            <FileText className="w-4 h-4 text-red-500" />
          ) : (
            <Image className="w-4 h-4 text-blue-500" />
          )}
          <span className="text-sm text-gray-700">{proof.name}</span>
          <Eye className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    );
  };

  const SortButton: React.FC<{ 
    field: SortField; 
    children: React.ReactNode; 
    type: 'session' | 'complaint';
  }> = ({ field, children, type }) => {
    const isActive = (type === 'session' ? sessionSortField : complaintSortField) === field;
    const direction = type === 'session' ? sessionSortDirection : complaintSortDirection;
    
    return (
      <button
        onClick={() => handleSort(field, type)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
      >
        {children}
        {isActive && (
          direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </button>
    );
  };

  const TabButton: React.FC<{ 
    tab: 'overview' | 'sessions' | 'complaints'; 
    children: React.ReactNode;
    icon: React.ReactNode;
  }> = ({ tab, children, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
        activeTab === tab
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {icon}
      {children}
    </button>
  );

  const FilterComponent: React.FC<{
    filters: FeedbackFilters;
    onFiltersChange: (filters: FeedbackFilters) => void;
    showTypeFilter?: boolean;
  }> = ({ filters, onFiltersChange, showTypeFilter = true }) => {
    const handleFilterChange = (key: keyof FeedbackFilters, value: string) => {
      onFiltersChange({
        ...filters,
        [key]: value
      });
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Type Filter - Only show if enabled */}
          {showTypeFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="">All Types</option>
                <option value="complaint">Complaints</option>
                <option value="session">Session Feedback</option>
                <option value="suggestion">Suggestions</option>
                <option value="emergency">Emergency</option>
                <option value="testimonial">Testimonials</option>
                <option value="general">General</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Proof Viewer Modal */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">{selectedProof.name}</h3>
              <button 
                onClick={() => setSelectedProof(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowRight className="w-5 h-5 transform rotate-45" />
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-auto">
              {selectedProof.type === 'pdf' ? (
                <iframe 
                  src={selectedProof.url} 
                  className="w-full h-96 rounded-lg"
                  title={selectedProof.name}
                />
              ) : (
                <img 
                  src={selectedProof.url} 
                  alt={selectedProof.name}
                  className="w-full h-auto rounded-lg max-h-96 object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}

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
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Loading feedbacks...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 lg:p-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">Error</span>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => fetchFeedbacks(pagination.page)}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Main Content - Only show if not loading and no error */}
          {!loading && !error && (
            <div className="p-4 lg:p-6">
              {/* Page Header */}
              <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Feedback Management
                </h1>
                <p className="text-gray-600">Manage session reviews and handle client complaints efficiently.</p>
              </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 mb-6">
              <TabButton tab="overview" icon={<MessageSquare className="w-4 h-4" />}>
                Overview
              </TabButton>
              <TabButton tab="sessions" icon={<Star className="w-4 h-4" />}>
                Session Reviews
              </TabButton>
              <TabButton tab="complaints" icon={<AlertTriangle className="w-4 h-4" />}>
                Complaints
              </TabButton>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
                  {/* Total Feedback */}
                  <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">{totalFeedback}</p>
                        <p className="text-gray-600 text-xs lg:text-sm leading-tight">Total Feedback</p>
                      </div>
                    </div>
                  </div>

                  {/* Pending */}
                  <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">{pendingCount}</p>
                        <p className="text-gray-600 text-xs lg:text-sm leading-tight">Pending Complaints</p>
                      </div>
                    </div>
                  </div>

                  {/* Session Reviews */}
                  <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">{sessionFeedbackCount}</p>
                        <p className="text-gray-600 text-xs lg:text-sm leading-tight">Session Reviews</p>
                      </div>
                    </div>
                  </div>

                  {/* Complaints */}
                  <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">{complaintsCount}</p>
                        <p className="text-gray-600 text-xs lg:text-sm leading-tight">Complaints</p>
                      </div>
                    </div>
                  </div>

                  {/* Average Rating */}
                  <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                        <p className="text-gray-600 text-xs lg:text-sm leading-tight">Avg Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Recent Session Reviews */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Session Reviews</h2>
                      <button 
                        onClick={() => setActiveTab('sessions')}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 transition-colors"
                      >
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {feedback.filter(f => f.type === 'session').slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Star className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-600">{item.nickname} • {item.rating}/5 stars</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Complaints */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Complaints</h2>
                      <button 
                        onClick={() => setActiveTab('complaints')}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 transition-colors"
                      >
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {feedback.filter(f => f.type === 'complaint').length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No complaints found</p>
                        </div>
                      ) : (
                        feedback.filter(f => f.type === 'complaint').slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                              <p className="text-xs text-gray-600">{item.nickname}</p>
                            </div>
                            {item.status && (
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(item.status)}`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Session Reviews Tab */}
            {activeTab === 'sessions' && (
              <>
                {/* <FilterComponent 
                  filters={sessionFilters} 
                  onFiltersChange={setSessionFilters}
                  showTypeFilter={false}
                /> */}
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                  <div className="p-4 lg:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                        Session Reviews ({sessionFeedback.length})
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                        <SortButton field="createdAt" type="session">Created Date</SortButton>
                        <SortButton field="rating" type="session">Rating</SortButton>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {sessionFeedback.length === 0 ? (
                      <div className="text-center py-12">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No session reviews found.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {sessionFeedback.map(item => (
                          <div key={item.id} className="bg-slate-100 rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                  <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                                  <p className="text-sm text-gray-600">
                                    {item.isAnonymous ? 'Anonymous Client' : `${item.author} (${item.nickname})`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.rating && getRatingStars(item.rating)}
                              </div>
                            </div>

                            <p className="text-gray-700 mb-4 leading-relaxed">{item.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Feedback: {formatDate(item.createdAt)}</span>
                              </div>
                              {item.sessionDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>Session: {item.sessionDate} at {item.timeSlot}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>Counsellor: {item.counsellorName}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Pagination Controls */}
                    {sessionFeedback.length > 0 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reviews
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => fetchFeedbacks(pagination.page - 1)}
                            disabled={!pagination.hasPrev}
                            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>
                          <span className="px-3 py-2 text-sm text-gray-600">
                            Page {pagination.page} of {pagination.totalPages}
                          </span>
                          <button
                            onClick={() => fetchFeedbacks(pagination.page + 1)}
                            disabled={!pagination.hasNext}
                            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Complaints Tab */}
            {activeTab === 'complaints' && (
              <>
                <FilterComponent 
                  filters={complaintFilters} 
                  onFiltersChange={setComplaintFilters}
                  showTypeFilter={false}
                />
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                  <div className="p-4 lg:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                        Complaints ({complaintFeedback.length})
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                        <SortButton field="createdAt" type="complaint">Created Date</SortButton>
                        <SortButton field="status" type="complaint">Status</SortButton>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {complaintFeedback.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No complaints found.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {complaintFeedback.map(item => (
                          <div key={item.id} className="bg-slate-100 rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                  <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                                  <p className="text-sm text-gray-600">
                                    {item.isAnonymous ? 'Anonymous' : `${item.author} (${item.nickname})`}
                                  </p>
                                </div>
                              </div>
                              <select
                                value={item.status || 'pending'}
                                onChange={(e) => handleStatusChange(item.id, e.target.value as 'pending' | 'in-progress' | 'resolved' | 'rejected' | 'urgent')}
                                className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer transition-colors ${getStatusColor(item.status || 'pending')}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="rejected">Rejected</option>
                                <option value="urgent">Urgent</option>
                              </select>
                            </div>

                            <p className="text-gray-700 mb-4 leading-relaxed">{item.description}</p>

                            {item.additionalDetails && (
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Additional Details</h4>
                                <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                                  {item.additionalDetails}
                                </p>
                              </div>
                            )}

                            <ProofSection proof={item.proof} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Created: {formatDate(item.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Updated: {formatDate(item.updatedAt)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>Counsellor: {item.counsellorName}</span>
                              </div>
                            </div>

                            {/* Resolution Reason Input */}
                            {(item.status === 'pending' || item.status === 'in-progress') && (
                              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Resolution Reason (Required for Resolved/Rejected status)
                                </label>
                                <textarea
                                  value={resolutionReason[item.id] || ''}
                                  onChange={(e) => handleResolutionReasonChange(item.id, e.target.value)}
                                  placeholder="Enter reason for resolution or rejection..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                  rows={3}
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    This message will be sent to the client
                                  </span>
                                  <button
                                    onClick={() => {
                                      if (resolutionReason[item.id]) {
                                        handleStatusChange(item.id, 'resolved');
                                      }
                                    }}
                                    disabled={!resolutionReason[item.id]}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark Resolved
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Display Resolution Reason */}
                            {item.resolutionReason && (item.status === 'resolved' || item.status === 'rejected') && (
                              <div className={`mt-4 p-4 rounded-xl border ${
                                item.status === 'resolved' 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-red-50 border-red-200'
                              }`}>
                                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  {item.status === 'resolved' ? 'Resolution Reason' : 'Rejection Reason'}
                                </h4>
                                <p className="text-gray-700">{item.resolutionReason}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;