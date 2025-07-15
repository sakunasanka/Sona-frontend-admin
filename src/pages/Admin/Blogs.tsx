import React, { useState } from 'react';
import { 
  Eye, CheckCircle, XCircle, Clock, RotateCcw, Calendar, User, Heart, 
  TrendingUp, Filter, Search, X, AlertTriangle, MapPin, Mail, Tag 
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar' ;

// Types
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

interface AdminAction {
  type: 'approve' | 'reject' | 'revoke';
  postId: string;
  reason?: string;
}

// Mock Data
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
    content: `Exams are a stressful time for many students in Sri Lanka. Here are some practical tips to manage anxiety and perform your best:

1. **Plan Ahead**: Create a study schedule and stick to it.
2. **Take Breaks**: Short breaks help your mind relax and improve focus.
3. **Talk to Someone**: Share your worries with a trusted adult or counsellor.
4. **Practice Mindfulness**: Simple breathing exercises can reduce stress.
5. **Eat Well & Sleep Well**: Healthy habits support mental health.

Remember, your mental wellbeing is just as important as your grades. Reach out for help if you need it.`,
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
    title: 'How to Support a Friend Facing Depression',
    content: `Depression is a common mental health challenge in Sri Lanka. If you suspect a friend is struggling:

- Listen without judgment
- Encourage professional help
- Avoid giving advice unless asked
- Check in regularly
- Educate yourself about depression

Support can make a big difference. If you or someone you know needs help, contact a local counsellor or helpline.`,
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
    content: `Family relationships can be challenging. Counselling helps families in Sri Lanka communicate better and resolve conflicts.

- **Open Communication**: Share feelings honestly.
- **Respect Differences**: Every family member is unique.
- **Seek Help Early**: Professional support can prevent bigger issues.
- **Practice Forgiveness**: Let go of grudges for healthier relationships.

Family counselling is available in Colombo, Kandy, Galle, and online.`,
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
    content: `Online counselling is growing in Sri Lanka, offering privacy and convenience.

**Benefits:**
- Accessible from anywhere
- Flexible scheduling
- Confidential and secure
- Wide range of counsellors

If you need support, consider booking an online session with a licensed Sri Lankan counsellor.`,
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

// Post Card Component - Only shows View button, no approve/reject
const PostCard: React.FC<{
  post: BlogPost;
  onView: (post: BlogPost) => void;
}> = ({ post, onView }) => {
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Featured Image */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status and Category */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(post.status)}`}>
            {getStatusIcon(post.status)}
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-md font-bold text-gray-900 mb-3  ">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {post.viewCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
            <Heart className="w-3 h-3" />
            {post.likes}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded-full">{post.readTime}</span>
        </div>

        {/* Publication Status */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            post.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {post.isPublished ? 'Published' : 'Not Published'}
          </span>
        </div>

        {/* Action Button - Only View */}
        <button
          onClick={() => onView(post)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
        >
          <Eye className="w-4 h-4" />
          View Full Post
        </button>
      </div>
    </div>
  );
};

// Post Details Modal Component - Shows approve/reject buttons inside the modal
const PostDetailsModal: React.FC<{
  post: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (postId: string) => void;
  onReject: (post: BlogPost) => void;
  onRevoke: (postId: string) => void;
}> = ({ post, isOpen, onClose, onApprove, onReject, onRevoke }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between rounded-t-2xl">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-4 mb-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(post.status)}`}>
                {getStatusIcon(post.status)}
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                post.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {post.isPublished ? 'Published' : 'Not Published'}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{post.excerpt}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Image */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-8 shadow-lg">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Content */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed text-base">
                  {post.content}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="w-5 h-5 text-gray-500" />
                  <span className="text-lg font-semibold text-gray-900">Tags</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Details */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Author Details</h3>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{post.author.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {post.author.email}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">{post.author.bio}</p>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="flex items-center gap-3 p-2 bg-white rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{post.author.location}</span>
                  </p>
                  <p className="flex items-center gap-3 p-2 bg-white rounded-lg">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span>Joined {formatDate(post.author.joinDate)}</span>
                  </p>
                  <p className="flex items-center gap-3 p-2 bg-white rounded-lg">
                    <User className="w-4 h-4 text-purple-500" />
                    <span>{post.author.totalPosts} posts published</span>
                  </p>
                </div>
              </div>

              {/* Post Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Post Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      Views
                    </span>
                    <span className="font-bold text-lg text-gray-900">{post.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Likes
                    </span>
                    <span className="font-bold text-lg text-gray-900">{post.likes}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      Read Time
                    </span>
                    <span className="font-bold text-lg text-gray-900">{post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Post Timeline */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 shadow-sm"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Created</p>
                      <p className="text-xs text-gray-600">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  {post.updatedAt !== post.createdAt && (
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 shadow-sm"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Updated</p>
                        <p className="text-xs text-gray-600">{formatDate(post.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  {post.approvedAt && (
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2 shadow-sm"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Approved</p>
                        <p className="text-xs text-gray-600">{formatDate(post.approvedAt)}</p>
                        <p className="text-xs text-gray-500">by {post.approvedBy}</p>
                      </div>
                    </div>
                  )}
                  {post.rejectedAt && (
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2 shadow-sm"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Rejected</p>
                        <p className="text-xs text-gray-600">{formatDate(post.rejectedAt)}</p>
                        <p className="text-xs text-gray-500">by {post.rejectedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rejection Reason - Only shown inside the modal */}
              {post.status === 'rejected' && post.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Rejection Reason
                  </h3>
                  <p className="text-sm text-red-700 leading-relaxed bg-white p-4 rounded-lg border border-red-200">
                    {post.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Only shown inside the modal */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Close
            </button>
            
            {post.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    onApprove(post.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve & Publish
                </button>
                <button
                  onClick={() => {
                    onReject(post);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Post
                </button>
              </>
            )}
            
            {(post.status === 'approved' || post.status === 'rejected') && (
              <button
                onClick={() => {
                  onRevoke(post.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <RotateCcw className="w-5 h-5" />
                Revoke Decision
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reject Modal Component
const RejectModal: React.FC<{
  post: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}> = ({ post, isOpen, onClose, onSubmit }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reject Post</h2>
              <p className="text-sm text-gray-600">This will prevent the post from being published</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Post Info */}
          <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2 text-lg">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-2">By {post.author.name}</p>
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          </div>

          {/* Warning */}
          <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-2">Important Notice</p>
                <p className="text-sm text-yellow-700 leading-relaxed">
                  This action will prevent the post from being published. The author will be notified about the rejection. Please provide clear, constructive feedback to help them improve their content.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Reasons */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Select a common reason (optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commonReasons.map((reasonOption) => (
                <button
                  key={reasonOption}
                  type="button"
                  onClick={() => handleReasonSelect(reasonOption)}
                  className={`p-4 text-left text-sm rounded-xl border-2 transition-all duration-200 ${
                    selectedReason === reasonOption
                      ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  {reasonOption}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          <div className="mb-6">
            <label htmlFor="custom-reason" className="block text-sm font-semibold text-gray-700 mb-3">
              {selectedReason ? 'Add additional details (optional)' : 'Custom reason'}
            </label>
            <textarea
              id="custom-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={selectedReason ? 'Add more specific details or suggestions for improvement...' : 'Please provide a detailed reason for rejection with constructive feedback...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-200"
              rows={5}
            />
          </div>

          {/* Selected Reason Preview */}
          {selectedReason && (
            <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-semibold text-red-800 mb-3">Selected reason:</p>
              <p className="text-sm text-red-700 bg-white p-4 rounded-lg border border-red-200 leading-relaxed">
                {selectedReason}
              </p>
              {reason && (
                <div className="mt-4 pt-4 border-t border-red-200">
                  <p className="text-sm font-semibold text-red-800 mb-2">Additional details:</p>
                  <p className="text-sm text-red-700 bg-white p-4 rounded-lg border border-red-200 leading-relaxed">
                    {reason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason && !reason.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              <XCircle className="w-5 h-5" />
              Reject & Block Publication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Blog Admin Component
export const CompleteBlogAdmin: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [postToReject, setPostToReject] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleAction = (action: AdminAction) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === action.postId) {
          const now = new Date().toISOString();
          
          switch (action.type) {
            case 'approve':
              return {
                ...post,
                status: 'approved' as const,
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
                status: 'rejected' as const,
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
                status: 'pending' as const,
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
      published: posts.filter(p => p.isPublished).length
    };
  };

  const statusCounts = getStatusCounts();

   // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const closeSidebar = () => setSidebarOpen(false);
  return (
<div className=" h-screen w-screen bg-gradient-to-br from-gray-50 to-blue-50 flex ">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto flex-1">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-9  ">
          <h1 className="text-2xl font-bold text-gray-900 mb-3   ">
            Blog Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Review and approve blog posts before publication</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">{statusCounts.all}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-gray-900">{statusCounts.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-gray-900">{statusCounts.rejected}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Published</p>
                <p className="text-3xl font-bold text-gray-900">{statusCounts.published}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-red-100 rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts or authors..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                    {statusCounts[status]}
                  </span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
            <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria</p>
          </div>
        )}
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
    </div>
  );
};

function Blogs() {
  return (
    <div className="min-h-screen">
      <CompleteBlogAdmin />
    </div>
  );
}

export default Blogs;

// import React, { useState } from 'react';
// import { 
//   Eye, CheckCircle, XCircle, Clock, RotateCcw, Calendar, User, Heart, 
//   TrendingUp, Filter, Search, X, AlertTriangle, MapPin, Mail, Tag, EyeOff 
// } from 'lucide-react';

// // Types
// interface Author {
//   id: string;
//   name: string;
//   email: string;
//   avatar: string;
//   bio: string;
//   joinDate: string;
//   totalPosts: number;
//   location: string;
// }

// interface BlogPost {
//   id: string;
//   title: string;
//   content: string;
//   excerpt: string;
//   author: Author;
//   createdAt: string;
//   updatedAt: string;
//   status: 'pending' | 'approved' | 'rejected';
//   category: string;
//   tags: string[];
//   featuredImage: string;
//   readTime: string;
//   rejectionReason?: string;
//   approvedBy?: string;
//   approvedAt?: string;
//   rejectedBy?: string;
//   rejectedAt?: string;
//   viewCount: number;
//   likes: number;
//   isPublished: boolean;
//   viewedByAdmin: boolean;
//   adminViewedAt?: string;
// }

// interface AdminAction {
//   type: 'approve' | 'reject' | 'revoke' | 'view';
//   postId: string;
//   reason?: string;
// }

// // Mock Data
// const mockAuthors: Author[] = [
//   {
//     id: '1',
//     name: 'John Smith',
//     email: 'john.smith@example.com',
//     avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
//     bio: 'Tech enthusiast and full-stack developer with 5 years of experience in React and Node.js.',
//     joinDate: '2023-01-15',
//     totalPosts: 24,
//     location: 'San Francisco, CA'
//   },
//   {
//     id: '2',
//     name: 'Sarah Johnson',
//     email: 'sarah.johnson@example.com',
//     avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
//     bio: 'UI/UX designer passionate about creating intuitive user experiences.',
//     joinDate: '2023-03-20',
//     totalPosts: 18,
//     location: 'New York, NY'
//   },
//   {
//     id: '3',
//     name: 'Michael Chen',
//     email: 'michael.chen@example.com',
//     avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
//     bio: 'Data scientist and machine learning engineer with expertise in Python and AI.',
//     joinDate: '2023-02-10',
//     totalPosts: 31,
//     location: 'Seattle, WA'
//   }
// ];

// const mockPosts: BlogPost[] = [
//   // ... (same as above, omitted for brevity)
// ];

// // PostCard, PostDetailsModal, RejectModal components (same as above, omitted for brevity)

// // Minimal PostCard implementation
// interface PostCardProps {
//   post: BlogPost;
//   onView: (post: BlogPost) => void;
//   onApprove: (postId: string) => void;
//   onReject: (post: BlogPost) => void;
//   onRevoke: (postId: string) => void;
// }

// const PostCard: React.FC<PostCardProps> = ({ post, onView, onApprove, onReject, onRevoke }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col justify-between h-full">
//       <div>
//         <img src={post.featuredImage} alt={post.title} className="w-full h-40 object-cover rounded-lg mb-4" />
//         <h2 className="text-xl font-bold mb-2">{post.title}</h2>
//         <p className="text-gray-600 mb-2">{post.excerpt}</p>
//         <div className="flex items-center gap-2 mb-2">
//           <User className="w-4 h-4 text-gray-400" />
//           <span className="text-sm text-gray-700">{post.author.name}</span>
//         </div>
//         <div className="flex items-center gap-2 mb-2">
//           <Calendar className="w-4 h-4 text-gray-400" />
//           <span className="text-sm text-gray-700">{new Date(post.createdAt).toLocaleDateString()}</span>
//         </div>
//         <div className="flex items-center gap-2 mb-2">
//           <Tag className="w-4 h-4 text-gray-400" />
//           <span className="text-sm text-gray-700">{post.category}</span>
//         </div>
//         <div className="flex items-center gap-2 mb-2">
//           <Eye className="w-4 h-4 text-gray-400" />
//           <span className="text-sm text-gray-700">{post.viewCount} views</span>
//         </div>
//         <div className="flex items-center gap-2 mb-2">
//           <Heart className="w-4 h-4 text-gray-400" />
//           <span className="text-sm text-gray-700">{post.likes} likes</span>
//         </div>
//         <div className="flex items-center gap-2 mb-2">
//           <Clock className="w-4 h-4 text-gray-400" />
//           <span className="text-sm text-gray-700">{post.readTime} read</span>
//         </div>
//         <div className="flex items-center gap-2 mb-2">
//           {post.status === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
//           {post.status === 'approved' && <CheckCircle className="w-4 h-4 text-green-500" />}
//           {post.status === 'rejected' && <XCircle className="w-4 h-4 text-red-500" />}
//           <span className={`text-sm font-semibold ${
//             post.status === 'pending' ? 'text-yellow-600' :
//             post.status === 'approved' ? 'text-green-600' :
//             'text-red-600'
//           }`}>
//             {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
//           </span>
//         </div>
//       </div>
//       <div className="flex gap-2 mt-4">
//         <button
//           className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
//           onClick={() => onView(post)}
//         >
//           View
//         </button>
//         {post.status === 'pending' && (
//           <>
//             <button
//               className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold"
//               onClick={() => onApprove(post.id)}
//             >
//               Approve
//             </button>
//             <button
//               className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold"
//               onClick={() => onReject(post)}
//             >
//               Reject
//             </button>
//           </>
//         )}
//         {post.status === 'approved' && (
//           <button
//             className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold"
//             onClick={() => onRevoke(post.id)}
//           >
//             Revoke
//           </button>
//         )}
//       </div>
//     </div>
// };

// // Minimal RejectModal implementation
// interface RejectModalProps {
//   post: BlogPost;
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (reason: string) => void;
// }

// const RejectModal = ({ post, isOpen, onClose, onSubmit }: RejectModalProps) => {
//   const [reason, setReason] = useState<string>('');
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Reject Post</h2>
//         <p className="mb-2">Please provide a reason for rejecting <span className="font-semibold">{post.title}</span>:</p>
//         <textarea
//           className="w-full border border-gray-300 rounded-lg p-2 mb-4"
//           rows={4}
//           value={reason}
//           onChange={e => setReason(e.target.value)}
//           placeholder="Enter rejection reason..."
//         />
//         <div className="flex justify-end gap-2">
//           <button
//             className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold"
//             onClick={() => {
//               onSubmit(reason);
//               setReason('');
//             }}
//             disabled={!reason.trim()}
//           >
//             Reject
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Blog Admin Component
// const Blogs: React.FC = () => {
//   const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
//   const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
//   const [postToReject, setPostToReject] = useState<BlogPost | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

//   const handleAction = (action: AdminAction) => {
//     setPosts(prevPosts => 
//       prevPosts.map(post => {
//         if (post.id === action.postId) {
//           const now = new Date().toISOString();
//           switch (action.type) {
//             case 'approve':
//               return {
//                 ...post,
//                 status: 'approved' as const,
//                 approvedBy: 'Admin',
//                 approvedAt: now,
//                 rejectionReason: undefined,
//                 rejectedBy: undefined,
//                 rejectedAt: undefined,
//                 isPublished: true
//               };
//             case 'reject':
//               return {
//                 ...post,
//                 status: 'rejected' as const,
//                 rejectionReason: action.reason,
//                 rejectedBy: 'Admin',
//                 rejectedAt: now,
//                 approvedBy: undefined,
//                 approvedAt: undefined,
//                 isPublished: false
//               };
//             case 'revoke':
//               return {
//                 ...post,
//                 status: 'pending' as const,
//                 approvedBy: undefined,
//                 approvedAt: undefined,
//                 rejectedBy: undefined,
//                 rejectedAt: undefined,
//                 rejectionReason: undefined,
//                 isPublished: false
//               };
//             case 'view':
//               return {
//                 ...post,
//                 viewedByAdmin: true,
//                 adminViewedAt: now
//               };
//             default:
//               return post;
//           }
//         }
//         return post;
//       })
//     );
//   };

//   const handleViewPost = (post: BlogPost) => {
//     setSelectedPost(post);
//     setIsDetailsModalOpen(true);
//   };

//   const handleMarkAsViewed = (postId: string) => {
//     handleAction({ type: 'view', postId });
//   };

//   const handleApprove = (postId: string) => {
//     handleAction({ type: 'approve', postId });
//   };

//   const handleReject = (post: BlogPost) => {
//     setPostToReject(post);
//     setIsRejectModalOpen(true);
//   };

//   const handleRejectSubmit = (reason: string) => {
//     if (postToReject) {
//       handleAction({ type: 'reject', postId: postToReject.id, reason });
//       setIsRejectModalOpen(false);
//       setPostToReject(null);
//     }
//   };

//   const handleRevoke = (postId: string) => {
//     handleAction({ type: 'revoke', postId });
//   };

//   const filteredPosts = posts.filter(post => {
//     const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusCounts = () => {
//     return {
//       all: posts.length,
//       pending: posts.filter(p => p.status === 'pending').length,
//       approved: posts.filter(p => p.status === 'approved').length,
//       rejected: posts.filter(p => p.status === 'rejected').length,
//       published: posts.filter(p => p.isPublished).length,
//       unviewed: posts.filter(p => !p.viewedByAdmin && p.status === 'pending').length
//     };
//   };

//   const statusCounts = getStatusCounts();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Blog Admin Dashboard
//           </h1>
//           <p className="text-gray-600 text-lg">Review and approve blog posts before publication</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
//           {/* ...stats cards as above... */}
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search posts or authors..."
//                   className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="flex gap-2">
//               {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => setStatusFilter(status)}
//                   className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
//                     statusFilter === status
//                       ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
//                   }`}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                   {status !== 'all' && (
//                     <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
//                       {statusCounts[status as keyof typeof statusCounts]}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//             </div>
//           </div>
//         </div>

//         {/* Posts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
//           {filteredPosts.map((post) => (
//             <PostCard
//               key={post.id}
//               post={post}
//               onView={handleViewPost}
//               onApprove={handleApprove}
//               onReject={handleReject}
//               onRevoke={handleRevoke}
//             />
//           ))}
//         </div>

//         {/* Empty State */}
//         {filteredPosts.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-gray-400 mb-6">
//               <Search className="w-16 h-16 mx-auto" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts found</h3>
//             <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
//           </div>
//         )}

//         {/* Details Modal */}
//         {selectedPost && (
//           <PostDetailsModal
//             post={selectedPost}
//             isOpen={isDetailsModalOpen}
//             onClose={() => setIsDetailsModalOpen(false)}
//             onApprove={handleApprove}
//             onReject={handleReject}
//             onRevoke={handleRevoke}
//             onMarkAsViewed={handleMarkAsViewed}
//           />
//         )}

//         {/* Reject Modal */}
//         {postToReject && (
//           <RejectModal
//             post={postToReject}
//             isOpen={isRejectModalOpen}
//             onClose={() => {
//               setIsRejectModalOpen(false);
//               setPostToReject(null);
//             }}
//             onSubmit={handleRejectSubmit}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Blogs;

  