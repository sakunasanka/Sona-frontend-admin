import React, { useState } from 'react';
import { 
  Eye, CheckCircle, XCircle, Clock, RotateCcw, Calendar, User, Heart, 
  TrendingUp, Filter, Search, X, AlertTriangle, MapPin, Mail, Tag,
  ArrowRight, BookOpen, MessageCircle, Star
} from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';
import { useNavigate } from 'react-router-dom';

interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinDate: string;
  totalPosts: number;
  location: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
  tags: string[];
  featuredImage: string;
  readTime: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  viewCount: number;
  likes: number;
  isPublished: boolean;
}

const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Dr. Nimal Perera',
    email: 'nimal.perera@counselling.lk',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bio: 'Licensed psychologist with 15+ years of experience in mental health counselling in Sri Lanka.',
    joinDate: '2022-05-10',
    totalPosts: 42,
    location: 'Colombo, Sri Lanka'
  },
  {
    id: '2',
    name: 'Ms. Shanika Fernando',
    email: 'shanika.fernando@counselling.lk',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bio: 'Youth counsellor and advocate for mental wellness among Sri Lankan teens.',
    joinDate: '2023-01-18',
    totalPosts: 27,
    location: 'Kandy, Sri Lanka'
  },
  {
    id: '3',
    name: 'Mr. Ruwan Jayasuriya',
    email: 'ruwan.jayasuriya@counselling.lk',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bio: 'Family therapist specializing in relationship and marriage counselling.',
    joinDate: '2021-09-05',
    totalPosts: 35,
    location: 'Galle, Sri Lanka'
  }
];

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Managing Exam Stress: Tips for Sri Lankan Students',
    content: `Exams are a stressful time for many students in Sri Lanka. Here are some practical tips to manage anxiety and perform your best...`,
    excerpt: 'Practical advice for students in Sri Lanka to cope with exam-related stress and anxiety.',
    author: mockAuthors[1],
    createdAt: '2024-05-01T09:00:00Z',
    updatedAt: '2024-05-01T09:00:00Z',
    status: 'pending',
    category: 'Student Counselling',
    tags: ['Stress', 'Exams', 'Students', 'Sri Lanka', 'Mental Health'],
    featuredImage: 'https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    readTime: '5 min read',
    viewCount: 320,
    likes: 18,
    isPublished: false
  },
  {
    id: '2',
    title: 'How to Support a random Friend Facing Depression',
    content: `Depression is a common mental health challenge in Sri Lanka. If you suspect a friend is struggling...`,
    excerpt: 'Learn how to help friends in Sri Lanka who may be experiencing depression.',
    author: mockAuthors[0],
    createdAt: '2024-04-20T14:30:00Z',
    updatedAt: '2024-04-20T14:30:00Z',
    status: 'approved',
    category: 'Mental Health',
    tags: ['Depression', 'Support', 'Sri Lanka', 'Counselling'],
    featuredImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    readTime: '7 min read',
    approvedBy: 'Admin',
    approvedAt: '2024-04-21T10:00:00Z',
    viewCount: 540,
    likes: 34,
    isPublished: true
  },
  {
    id: '3',
    title: 'Family Counselling: Building Stronger Relationships',
    content: `Family relationships can be challenging. Counselling helps families in Sri Lanka communicate better and resolve conflicts...`,
    excerpt: 'Discover how family counselling can strengthen relationships in Sri Lankan families.',
    author: mockAuthors[2],
    createdAt: '2024-03-15T11:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z',
    status: 'rejected',
    category: 'Family Counselling',
    tags: ['Family', 'Relationships', 'Sri Lanka', 'Therapy'],
    featuredImage: 'https://images.pexels.com/photos/160994/pexels-photo-160994.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    readTime: '6 min read',
    rejectionReason: 'Please include more local case studies and practical exercises for Sri Lankan families.',
    rejectedBy: 'Admin',
    rejectedAt: '2024-03-16T08:30:00Z',
    viewCount: 210,
    likes: 11,
    isPublished: false
  },
  {
    id: '4',
    title: 'Online Counselling: Safe and Confidential Support in Sri Lanka',
    content: `Online counselling is growing in Sri Lanka, offering privacy and convenience...`,
    excerpt: 'Explore the benefits of online counselling services available in Sri Lanka.',
    author: mockAuthors[0],
    createdAt: '2024-02-10T16:45:00Z',
    updatedAt: '2024-02-10T16:45:00Z',
    status: 'pending',
    category: 'Online Counselling',
    tags: ['Online', 'Sri Lanka', 'Confidential', 'Support'],
    featuredImage: 'https://images.pexels.com/photos/318439/pexels-photo-318439.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    readTime: '4 min read',
    viewCount: 185,
    likes: 9,
    isPublished: false
  }
];

const PostCard = ({ post, onView }: { post: BlogPost; onView: (post: BlogPost) => void }) => {
  const getStatusColor = (status: BlogPost['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    } 
  };

  const getStatusIcon = (status: BlogPost['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
            {getStatusIcon(post.status)}
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.viewCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {post.likes}
          </span>
          <span>{post.readTime}</span>
        </div>

        <button
          onClick={() => onView(post)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

const PostDetailsModal = ({ 
  post, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject, 
  onRevoke 
}: {
  post: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (postId: string) => void;
  onReject: (post: BlogPost) => void;
  onRevoke: (postId: string) => void;
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: BlogPost['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: BlogPost['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'approved': return <CheckCircle className="w-5 h-5" />;
      case 'rejected': return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(post.status)}`}>
                {getStatusIcon(post.status)}
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-6">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose max-w-none mb-6">
                <div className="whitespace-pre-line text-gray-700">
                  {post.content}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Author Details</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{post.author.name}</h4>
                    <p className="text-sm text-gray-600">{post.author.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{post.author.bio}</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {post.author.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(post.author.joinDate)}
                  </p>
                  <p className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {post.author.totalPosts} posts published
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Views
                    </span>
                    <span className="font-medium text-gray-900">{post.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Likes
                    </span>
                    <span className="font-medium text-gray-900">{post.likes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Read Time
                    </span>
                    <span className="font-medium text-gray-900">{post.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Created</p>
                      <p className="text-xs text-gray-600">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  {post.updatedAt !== post.createdAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Updated</p>
                        <p className="text-xs text-gray-600">{formatDate(post.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  {post.approvedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Approved</p>
                        <p className="text-xs text-gray-600">{formatDate(post.approvedAt)}</p>
                      </div>
                    </div>
                  )}
                  {post.rejectedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Rejected</p>
                        <p className="text-xs text-gray-600">{formatDate(post.rejectedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3 justify-end">
            
            {post.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    onApprove(post.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    onReject(post);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </>
            )}
            
            {(post.status === 'approved' || post.status === 'rejected') && (
              <button
                onClick={() => {
                  onRevoke(post.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <RotateCcw className="w-5 h-5" />
                Revoke
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RejectModal = ({ 
  post, 
  isOpen, 
  onClose, 
  onSubmit 
}: {
  post: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) => {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const commonReasons = [
    'Content violates community guidelines',
    'Inappropriate language or content',
    'Plagiarism or copyright infringement',
    'Factual inaccuracies or misleading information',
    'Poor writing quality or formatting',
    'Off-topic or irrelevant content',
    'Spam or promotional content',
    'Missing required information or details'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason || reason;
    if (finalReason.trim()) {
      onSubmit(finalReason.trim());
      setReason('');
      setSelectedReason('');
    }
  };

  const handleReasonSelect = (selectedReason: string) => {
    setSelectedReason(selectedReason);
    setReason('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reject Post</h2>
              <p className="text-sm text-gray-600">Provide a reason for rejecting this post</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Common reasons
            </label>
            <div className="grid grid-cols-1 gap-2">
              {commonReasons.map((reasonOption) => (
                <button
                  key={reasonOption}
                  type="button"
                  onClick={() => handleReasonSelect(reasonOption)}
                  className={`p-3 text-left text-sm rounded-lg border ${
                    selectedReason === reasonOption
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {reasonOption}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-3">
              Custom reason
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason for rejection..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason && !reason.trim()}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [postToReject, setPostToReject] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleAction = (action: { type: 'approve' | 'reject' | 'revoke'; postId: string; reason?: string }) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === action.postId) {
          const now = new Date().toISOString();
          
          switch (action.type) {
            case 'approve':
              return {
                ...post,
                status: 'approved',
                approvedBy: 'Admin',
                approvedAt: now,
                rejectionReason: undefined,
                rejectedBy: undefined,
                rejectedAt: undefined,
                isPublished: true
              };
            case 'reject':
              return {
                ...post,
                status: 'rejected',
                rejectionReason: action.reason,
                rejectedBy: 'Admin',
                rejectedAt: now,
                approvedBy: undefined,
                approvedAt: undefined,
                isPublished: false
              };
            case 'revoke':
              return {
                ...post,
                status: 'pending',
                approvedBy: undefined,
                approvedAt: undefined,
                rejectedBy: undefined,
                rejectedAt: undefined,
                rejectionReason: undefined,
                isPublished: false
              };
            default:
              return post;
          }
        }
        return post;
      })
    );
  };

  const handleViewPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = (postId: string) => {
    handleAction({ type: 'approve', postId });
  };

  const handleReject = (post: BlogPost) => {
    setPostToReject(post);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = (reason: string) => {
    if (postToReject) {
      handleAction({ type: 'reject', postId: postToReject.id, reason });
      setIsRejectModalOpen(false);
      setPostToReject(null);
    }
  };

  const handleRevoke = (postId: string) => {
    handleAction({ type: 'revoke', postId });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      all: posts.length,
      pending: posts.filter(p => p.status === 'pending').length,
      approved: posts.filter(p => p.status === 'approved').length,
      rejected: posts.filter(p => p.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

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
            {/* Header */}
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Blog Management
                  </h1>
                  <p className="text-gray-600">Review and approve counseling blog posts</p>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {/* Total Posts */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{statusCounts.all}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Total Posts</p>
                  </div>
                </div>
              </div>

              {/* Pending Posts */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Pending</p>
                  </div>
                </div>
              </div>

              {/* Approved Posts */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{statusCounts.approved}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Approved</p>
                  </div>
                </div>
              </div>

              {/* Rejected Posts */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{statusCounts.rejected}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Rejected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="appearance-none px-4 py-2 pr-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 w-full"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>


            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onView={handleViewPost}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-6">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedPost && (
        <PostDetailsModal
          post={selectedPost}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPost(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          onRevoke={handleRevoke}
        />
      )}

      {postToReject && (
        <RejectModal
          post={postToReject}
          isOpen={isRejectModalOpen}
          onClose={() => {
            setIsRejectModalOpen(false);
            setPostToReject(null);
          }}
          onSubmit={handleRejectSubmit}
        />
      )}
    </div>
  );
};

export default BlogAdmin;