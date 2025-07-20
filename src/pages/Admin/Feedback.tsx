import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/layout/Sidebar'; // Add this import
import Navbar from '../../components/layout/Navbar';
import { 
  MessageCircle, 
  Users, 
  Lightbulb, 
  Bug, 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Tag,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertTriangle,
  Heart,
  Brain,
  Phone,
  MapPin,
  Star,
  Shield
} from 'lucide-react';
import { NavBar } from '../../components/layout';

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
  location: string; // Sri Lankan districts/cities
  language: 'sinhala' | 'tamil' | 'english';
  status: 'pending' | 'in-progress' | 'resolved' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'critical';
  counsellorAssigned?: string;
  sessionType?: 'face-to-face' | 'online' | 'phone' | 'group';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  rating?: number; // 1-5 stars for session feedback
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

// Mock Data with Sri Lankan context
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
    type: 'suggestion',
    category: 'online',
    title: 'Add Tamil language support for online sessions',
    description: 'It would be great to have more counsellors who can conduct sessions in Tamil language, especially for online consultations. This would help Tamil-speaking clients feel more comfortable.',
    author: 'Ravi Shankar',
    email: 'ravi.s@email.com',
    location: 'Jaffna',
    language: 'tamil',
    status: 'in-progress',
    priority: 'high',
    sessionType: 'online',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-17'),
    tags: ['language-support', 'tamil', 'online-therapy', 'accessibility'],
    isAnonymous: false
  },
  {
    id: '4',
    type: 'emergency',
    category: 'crisis',
    title: 'Crisis helpline response time',
    description: 'Called the crisis helpline during a mental health emergency. The response was quick and professional. The counsellor provided immediate support and follow-up resources.',
    author: 'Anonymous Client',
    email: 'anonymous@system.com',
    location: 'Galle',
    language: 'english',
    status: 'resolved',
    priority: 'critical',
    counsellorAssigned: 'Crisis Team',
    sessionType: 'phone',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    tags: ['crisis-intervention', 'emergency', 'helpline', 'immediate-support'],
    rating: 4,
    isAnonymous: true
  },
  {
    id: '5',
    type: 'complaint',
    category: 'addiction',
    title: 'Addiction counselling program concerns',
    description: 'The addiction recovery program lacks sufficient group sessions. More peer support groups would be beneficial for long-term recovery, especially considering Sri Lankan cultural context.',
    author: 'Chaminda Fernando',
    email: 'chaminda.f@email.com',
    phone: '+94723456789',
    location: 'Negombo',
    language: 'sinhala',
    status: 'pending',
    priority: 'high',
    counsellorAssigned: 'Dr. Anura Wickramasinghe',
    sessionType: 'group',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    tags: ['addiction-recovery', 'group-therapy', 'peer-support', 'cultural-context'],
    isAnonymous: false
  },
  {
    id: '6',
    type: 'testimonial',
    category: 'trauma',
    title: 'Trauma counselling success story',
    description: 'After the difficult period following the Easter attacks, the trauma counselling sessions helped me regain my mental stability. Dr. Perera\'s approach was compassionate and effective.',
    author: 'Malini Rodrigo',
    email: 'malini.r@email.com',
    location: 'Colombo',
    language: 'english',
    status: 'resolved',
    priority: 'low',
    counsellorAssigned: 'Dr. Sandun Perera',
    sessionType: 'face-to-face',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    tags: ['trauma-recovery', 'ptsd', 'success-story', 'post-conflict'],
    rating: 5,
    isAnonymous: false
  },
  {
    id: '7',
    type: 'session',
    category: 'relationship',
    title: 'Couples counselling feedback',
    description: 'The couples counselling sessions have significantly improved our relationship. The counsellor understood our cultural background and provided relevant advice for Sri Lankan couples.',
    author: 'Saman & Dilani Wickramaratne',
    email: 'saman.dilani@email.com',
    phone: '+94734567890',
    location: 'Matara',
    language: 'sinhala',
    status: 'in-progress',
    priority: 'medium',
    counsellorAssigned: 'Dr. Nayomi Gunasekara',
    sessionType: 'face-to-face',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-18'),
    tags: ['couples-therapy', 'relationship', 'cultural-awareness', 'communication'],
    rating: 4,
    isAnonymous: false
  },
  {
    id: '8',
    type: 'suggestion',
    category: 'online',
    title: 'Mobile app for appointment booking',
    description: 'A mobile application would make it easier to book appointments and access resources. Many people in rural areas rely on mobile phones for internet access.',
    author: 'Tharaka Bandara',
    email: 'tharaka.b@email.com',
    location: 'Anuradhapura',
    language: 'sinhala',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    tags: ['mobile-app', 'accessibility', 'rural-access', 'technology'],
    isAnonymous: false
  }
];

// Sri Lankan locations
const sriLankanLocations = [
  'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Matara', 'Anuradhapura', 
  'Polonnaruwa', 'Kurunegala', 'Ratnapura', 'Batticaloa', 'Trincomalee', 
  'Badulla', 'Kalutara', 'Gampaha', 'Hambantota', 'Vavuniya', 'Kilinochchi'
];

// Utility Functions
const getTypeIcon = (type: Feedback['type']) => {
  switch (type) {
    case 'complaint':
      return <MessageCircle className="w-5 h-5" />;
    case 'session':
      return <Users className="w-5 h-5" />;
    case 'suggestion':
      return <Lightbulb className="w-5 h-5" />;
    case 'emergency':
      return <AlertTriangle className="w-5 h-5" />;
    case 'testimonial':
      return <Heart className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const getTypeColor = (type: Feedback['type']) => {
  switch (type) {
    case 'complaint':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'session':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'suggestion':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'emergency':
      return 'bg-red-200 text-red-900 border-red-300';
    case 'testimonial':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getCategoryIcon = (category: Feedback['category']) => {
  switch (category) {
    case 'individual':
      return <User className="w-4 h-4" />;
    case 'family':
      return <Users className="w-4 h-4" />;
    case 'group':
      return <Users className="w-4 h-4" />;
    case 'online':
      return <MessageSquare className="w-4 h-4" />;
    case 'crisis':
      return <AlertTriangle className="w-4 h-4" />;
    case 'addiction':
      return <Shield className="w-4 h-4" />;
    case 'trauma':
      return <Brain className="w-4 h-4" />;
    case 'relationship':
      return <Heart className="w-4 h-4" />;
    default:
      return <Tag className="w-4 h-4" />;
  }
};

const getStatusIcon = (status: Feedback['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'in-progress':
      return <AlertCircle className="w-4 h-4" />;
    case 'resolved':
      return <CheckCircle className="w-4 h-4" />;
    case 'urgent':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return null;
  }
};

const getStatusColor = (status: Feedback['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: Feedback['priority']) => {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getLanguageLabel = (lang: Feedback['language']) => {
  switch (lang) {
    case 'sinhala': return 'සිංහල';
    case 'tamil': return 'தமிழ்';
    case 'english': return 'English';
    default: return lang;
  }
};

const getRatingStars = (rating?: number) => {
  if (!rating) return null;
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </span>
  );
};

// Components
const FeedbackStats: React.FC<{ feedback: Feedback[] }> = ({ feedback }) => {
  const totalFeedback = feedback.length;
  const pendingCount = feedback.filter(f => f.status === 'pending').length;
  const inProgressCount = feedback.filter(f => f.status === 'in-progress').length;
  const resolvedCount = feedback.filter(f => f.status === 'resolved').length;
  const urgentCount = feedback.filter(f => f.status === 'urgent').length;

  const stats = [
    {
      title: 'Total Feedback',
      value: totalFeedback,
      icon: MessageSquare,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Pending',
      value: pendingCount,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'In Progress',
      value: inProgressCount,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Resolved',
      value: resolvedCount,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Urgent',
      value: urgentCount,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${stat.textColor}`}>
                {stat.title}
              </p>
              <p className={`text-3xl font-bold ${stat.textColor} mt-1`}>
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FeedbackFiltersComponent: React.FC<{
  filters: FeedbackFilters;
  onFiltersChange: (filters: FeedbackFilters) => void;
}> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: keyof FeedbackFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="">All Categories</option>
            <option value="individual">Individual</option>
            <option value="family">Family</option>
            <option value="group">Group</option>
            <option value="online">Online</option>
            <option value="crisis">Crisis</option>
            <option value="addiction">Addiction</option>
            <option value="trauma">Trauma</option>
            <option value="relationship">Relationship</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="">All Locations</option>
            {sriLankanLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="">All Languages</option>
            <option value="sinhala">සිංහල</option>
            <option value="tamil">தமிழ்</option>
            <option value="english">English</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const FeedbackItem: React.FC<{
  feedback: Feedback;
  onStatusChange: (id: string, status: Feedback['status']) => void;
}> = ({ feedback, onStatusChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${getTypeColor(feedback.type)}`}>
            {getTypeIcon(feedback.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{feedback.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(feedback.type)} mt-1`}>
              {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
            </span>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
              {getCategoryIcon(feedback.category)}
              <span className="ml-1">{feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(feedback.priority)}`}>
            {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
          </span>
          <select
            value={feedback.status}
            onChange={(e) => onStatusChange(feedback.id, e.target.value as Feedback['status'])}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${getStatusColor(feedback.status)}`}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{feedback.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{feedback.isAnonymous ? 'Anonymous' : feedback.author}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{feedback.email}</span>
        </div>
        {feedback.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{feedback.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{feedback.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Created: {formatDate(feedback.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Updated: {formatDate(feedback.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Tag className="w-4 h-4" />
          <span>{feedback.language ? getLanguageLabel(feedback.language) : ''}</span>
        </div>
        {feedback.counsellorAssigned && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{feedback.counsellorAssigned}</span>
          </div>
        )}
        {feedback.sessionType && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MessageSquare className="w-4 h-4" />
            <span>{feedback.sessionType.charAt(0).toUpperCase() + feedback.sessionType.slice(1)}</span>
          </div>
        )}
        {feedback.rating && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getRatingStars(feedback.rating)}
            <span>{feedback.rating}/5</span>
          </div>
        )}
      </div>

      {feedback.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-gray-500" />
          {feedback.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component
function Feedback() {
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [filters, setFilters] = useState<FeedbackFilters>({
    type: '',
    category: '',
    status: '',
    priority: '',
    location: '',
    language: '',
    search: ''
  });
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedFeedback = useMemo(() => {
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

    // Sort the filtered results
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
  }, [feedback, filters, sortField, sortDirection]);

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={closeSidebar} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={() => {}} />
          <div className="p-4 lg:p-6">
            <div className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Management</h1>
                  <p className="text-gray-600">Manage and track all feedback including complaints, session feedback, and suggestions.</p>
                </div>

                <FeedbackStats feedback={feedback} />
                <FeedbackFiltersComponent filters={filters} onFiltersChange={setFilters} />
                
                <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Feedback Items ({filteredAndSortedFeedback.length})
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                        <SortButton field="createdAt">Created Date</SortButton>
                        <SortButton field="updatedAt">Updated Date</SortButton>
                        <SortButton field="priority">Priority</SortButton>
                        <SortButton field="status">Status</SortButton>
                        <SortButton field="rating">Rating</SortButton>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {filteredAndSortedFeedback.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No feedback items found matching your criteria.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {filteredAndSortedFeedback.map(item => (
                          <FeedbackItem
                            key={item.id}
                            feedback={item}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    )}
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

export default Feedback;