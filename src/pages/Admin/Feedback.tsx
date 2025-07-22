import React, { useState, useMemo } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Star,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Tag,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  PlusCircle,
  HandCoins,
  BookOpen,
  Activity,
  BarChart3,
  MessageCircle
} from 'lucide-react';

// Types
interface Feedback {
  id: string;
  type: 'complaint' | 'session' | 'suggestion' | 'emergency' | 'general' | 'testimonial';
  category: 'individual' | 'family' | 'group' | 'online' | 'crisis' | 'addiction' | 'trauma' | 'relationship';
  title: string;
  description: string;
  author: string;
  email: string;
  phone?: string;
  location: string;
  language: 'sinhala' | 'tamil' | 'english';
  status: 'pending' | 'in-progress' | 'resolved' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'critical';
  counsellorAssigned?: string;
  sessionType?: 'face-to-face' | 'online' | 'phone' | 'group';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  rating?: number;
  isAnonymous: boolean;
}

interface FeedbackFilters {
  type: string;
  category: string;
  status: string;
  priority: string;
  location: string;
  language: string;
  search: string;
}

type SortField = 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'rating';
type SortDirection = 'asc' | 'desc';

// Mock Data
const mockFeedback: Feedback[] = [
  {
    id: '1',
    type: 'complaint',
    category: 'individual',
    title: 'Counsellor was late for appointment',
    description: 'My scheduled counselling session at 2:00 PM was delayed by 30 minutes without prior notice. This caused inconvenience as I had to reschedule my work commitments.',
    author: 'Nimal Perera',
    email: 'nimal.perera@email.com',
    phone: '+94771234567',
    location: 'Colombo',
    language: 'english',
    status: 'pending',
    priority: 'medium',
    counsellorAssigned: 'Dr. Kamani Silva',
    sessionType: 'face-to-face',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['punctuality', 'scheduling', 'individual-therapy'],
    isAnonymous: false
  },
  {
    id: '2',
    type: 'session',
    category: 'family',
    title: 'Family counselling session feedback',
    description: 'The family counselling session was very helpful. Dr. Mendis provided excellent guidance for our communication issues. The techniques shared were practical and culturally appropriate.',
    author: 'Priya Jayawardena',
    email: 'priya.j@email.com',
    phone: '+94712345678',
    location: 'Kandy',
    language: 'sinhala',
    status: 'resolved',
    priority: 'low',
    counsellorAssigned: 'Dr. Sunil Mendis',
    sessionType: 'face-to-face',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
    tags: ['family-therapy', 'communication', 'cultural-sensitivity'],
    rating: 5,
    isAnonymous: false
  },
  {
    id: '3',
    type: 'session',
    category: 'individual',
    title: 'Individual therapy session review',
    description: 'The individual counselling session helped me work through my anxiety issues. Dr. Perera was very understanding and provided practical coping strategies.',
    author: 'Saman Kumara',
    email: 'saman.k@email.com',
    location: 'Galle',
    language: 'sinhala',
    status: 'resolved',
    priority: 'low',
    counsellorAssigned: 'Dr. Sandun Perera',
    sessionType: 'face-to-face',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-17'),
    tags: ['anxiety', 'individual-therapy', 'coping-strategies'],
    rating: 4,
    isAnonymous: false
  },
  {
    id: '4',
    type: 'complaint',
    category: 'online',
    title: 'Technical issues during online session',
    description: 'Experienced multiple connection drops during my online counselling session. The session had to be rescheduled due to poor audio quality.',
    author: 'Tharaka Silva',
    email: 'tharaka.s@email.com',
    phone: '+94723456789',
    location: 'Negombo',
    language: 'english',
    status: 'in-progress',
    priority: 'high',
    counsellorAssigned: 'Dr. Anura Wickramasinghe',
    sessionType: 'online',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    tags: ['technical-issues', 'online-therapy', 'connectivity'],
    isAnonymous: false
  },
  {
    id: '5',
    type: 'session',
    category: 'group',
    title: 'Group therapy session feedback',
    description: 'The group therapy session was very beneficial. The group dynamics were well managed and I felt comfortable sharing my experiences.',
    author: 'Malini Fernando',
    email: 'malini.f@email.com',
    location: 'Matara',
    language: 'english',
    status: 'resolved',
    priority: 'low',
    counsellorAssigned: 'Dr. Nayomi Gunasekara',
    sessionType: 'group',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-19'),
    tags: ['group-therapy', 'peer-support', 'addiction-recovery'],
    rating: 5,
    isAnonymous: false
  },
  {
    id: '6',
    type: 'complaint',
    category: 'crisis',
    title: 'Delayed response to crisis call',
    description: 'Called the crisis helpline during an emergency but had to wait 15 minutes before getting connected to a counsellor. This delay could be critical in emergency situations.',
    author: 'Anonymous',
    email: 'anonymous@system.com',
    location: 'Kandy',
    language: 'sinhala',
    status: 'urgent',
    priority: 'critical',
    counsellorAssigned: 'Crisis Team',
    sessionType: 'phone',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    tags: ['crisis-intervention', 'emergency', 'response-time'],
    isAnonymous: true
  }
];

const sriLankanLocations = [
  'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Matara', 'Anuradhapura', 
  'Polonnaruwa', 'Kurunegala', 'Ratnapura', 'Batticaloa', 'Trincomalee', 
  'Badulla', 'Kalutara', 'Gampaha', 'Hambantota', 'Vavuniya', 'Kilinochchi'
];

const FeedbackManagement: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [sessionFilters, setSessionFilters] = useState<FeedbackFilters>({
    type: 'session',
    category: '',
    status: '',
    priority: '',
    location: '',
    language: '',
    search: ''
  });
  const [complaintFilters, setComplaintFilters] = useState<FeedbackFilters>({
    type: 'complaint',
    category: '',
    status: '',
    priority: '',
    location: '',
    language: '',
    search: ''
  });
  const [sessionSortField, setSessionSortField] = useState<SortField>('createdAt');
  const [sessionSortDirection, setSessionSortDirection] = useState<SortDirection>('desc');
  const [complaintSortField, setComplaintSortField] = useState<SortField>('createdAt');
  const [complaintSortDirection, setComplaintSortDirection] = useState<SortDirection>('desc');
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'complaints'>('overview');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleStatusChange = (id: string, status: Feedback['status']) => {
    setFeedback(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status, updatedAt: new Date() }
          : item
      )
    );
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
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesPriority = !filters.priority || item.priority === filters.priority;
      const matchesLocation = !filters.location || item.location === filters.location;
      const matchesLanguage = !filters.language || item.language === filters.language;
      const matchesSearch = !filters.search || 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.author.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesType && matchesCategory && matchesStatus && matchesPriority && matchesLocation && matchesLanguage && matchesSearch;
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
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'status':
          const statusOrder = { pending: 1, 'in-progress': 2, resolved: 3, urgent: 4 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
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
  const totalFeedback = feedback.length;
  const pendingCount = feedback.filter(f => f.status === 'pending').length;
  const inProgressCount = feedback.filter(f => f.status === 'in-progress').length;
  const resolvedCount = feedback.filter(f => f.status === 'resolved').length;
  const sessionFeedbackCount = feedback.filter(f => f.type === 'session').length;
  const complaintsCount = feedback.filter(f => f.type === 'complaint').length;
  const averageRating = feedback.filter(f => f.rating).length > 0 
    ? feedback.filter(f => f.rating).reduce((acc, f) => acc + (f.rating || 0), 0) / feedback.filter(f => f.rating).length
    : 0;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Feedback['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">All Locations</option>
              {sriLankanLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
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
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={toggleSidebar} />
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
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Pending</p>
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
                        <p className="text-xs text-gray-600">{item.author} • {item.rating}/5 stars</p>
                      </div>
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
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
                  {feedback.filter(f => f.type === 'complaint').slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600">{item.author} • {item.priority} priority</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        item.status === 'urgent' ? 'bg-red-100 text-red-700' : 
                        item.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Session Reviews Tab */}
        {activeTab === 'sessions' && (
          <>
            <FilterComponent 
              filters={sessionFilters} 
              onFiltersChange={setSessionFilters}
              showTypeFilter={false}
            />
            
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
                    <SortButton field="status" type="session">Status</SortButton>
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
                      <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                              <p className="text-sm text-gray-600">
                                {item.isAnonymous ? 'Anonymous Client' : item.author}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.rating && getRatingStars(item.rating)}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed">{item.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{item.location}</span>
                          </div>
                          {item.counsellorAssigned && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{item.counsellorAssigned}</span>
                            </div>
                          )}
                          {item.sessionType && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MessageSquare className="w-4 h-4" />
                              <span className="capitalize">{item.sessionType.replace('-', ' ')}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{item.tags.length - 2} more</span>
                            )}
                          </div>
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value as Feedback['status'])}
                            className={`inline-flex items-center px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer transition-colors ${getStatusColor(item.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                    ))}
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
                    <SortButton field="priority" type="complaint">Priority</SortButton>
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
                      <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                              <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                                </span>
                                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value as Feedback['status'])}
                            className={`inline-flex items-center px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer transition-colors ${getStatusColor(item.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed">{item.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{item.isAnonymous ? 'Anonymous' : item.author}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{item.email}</span>
                          </div>
                          {item.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{item.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {formatDate(item.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Updated: {formatDate(item.updatedAt)}</span>
                          </div>
                          {item.counsellorAssigned && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span>Assigned: {item.counsellorAssigned}</span>
                            </div>
                          )}
                          {item.sessionType && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MessageSquare className="w-4 h-4" />
                              <span className="capitalize">{item.sessionType.replace('-', ' ')}</span>
                            </div>
                          )}
                        </div>

                        {item.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="w-4 h-4 text-gray-500" />
                            {item.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {tag}
                              </span>
                            ))}
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
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;