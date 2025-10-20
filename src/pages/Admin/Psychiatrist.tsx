import React, { useState, useEffect } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Clock, 
  Shield,
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  Briefcase,
  RotateCcw // Added for revoke icon
} from 'lucide-react';
import API from '../../api/api';

interface EducationQualification {
  id: number;
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  document?: string; // This is the correct field for document URL
  title?: string;
  year?: number;
  status: 'pending' | 'approved' | 'rejected';
  proof?: string; // This might be null
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Experience {
  id: number;
  userId: number;
  position: string;
  company?: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  proof?: string; // This might be null
  document?: string; // This is the correct field for document URL
  verificationDocument?: string;
  approvedAt?: string;
  approvedBy?: number;
  createdAt: string;
  updatedAt: string;
}

interface Psychiatrist {
  id: number;
  name: string;
  email: string;
  contact_no: string;
  createdAt: string;
  specialities: string[];
  title: string;
  address: string;
  description?: string;
  license_no: string;
  status: 'pending' | 'approved' | 'rejected';
  avatar?: string;
  isAvailable?: boolean;
  rating?: number;
  sessionFee?: number;
  eduQualifications?: EducationQualification[];
  experiences?: Experience[];
  // Rejection information
  rejectionReason?: string;
  rejectedBy?: number;
  rejectedByName?: string;
  rejectedByRole?: string;
}


const Psychiatrist: React.FC = () => {
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPsychiatrist, setSelectedPsychiatrist] = useState<Psychiatrist | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'revoke'>('approve'); // Added 'revoke'
  const [rejectionReason, setRejectionReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'experiences'>('profile');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [psychiatristsRes, countsRes] = await Promise.all([
          API.get('/adminpsychiatrists'),
          API.get('/adminpsychiatrists/stats/counts')
        ]);
        
        setPsychiatrists(psychiatristsRes.data);
        setStatusCounts(countsRes.data);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        showNotification('error', 'Failed to fetch psychiatrists data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getInitials = (name: string | undefined) => {
    if (!name || typeof name !== 'string') return '';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const filteredPsychiatrists = psychiatrists.filter(psychiatrist => {
    const name = psychiatrist?.name || '';
    const email = psychiatrist?.email || '';
    const specialities = psychiatrist?.specialities?.join(' ') || '';
    const title = psychiatrist?.title || '';
    const status = psychiatrist?.status || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialities.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All Status' || status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleViewProfile = (psychiatrist: Psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist);
    setShowProfileModal(true);
    setActiveTab('profile');
  };

  const handleAction = (type: 'approve' | 'reject' | 'revoke') => {
    if (!selectedPsychiatrist) return;
    
    setActionType(type);
    setRejectionReason('');
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (!selectedPsychiatrist) return;
    
    if (actionType === 'reject' && !rejectionReason.trim()) {
      showNotification('error', 'Please provide a rejection reason.');
      return;
    }
    
    setShowConfirmation(true);
  };

  const executeAction = async () => {
    if (!selectedPsychiatrist) return;
    
    setLoading(true);
    
    try {
      let response;
      
      if (actionType === 'revoke') {
        // Use the new revoke endpoint
        response = await API.post(`/adminpsychiatrists/${selectedPsychiatrist.id}/revoke`);
      } else {
        const newStatus = actionType === 'approve' ? 'approved' : 'rejected';
        
        const requestData: any = { status: newStatus };
        if (actionType === 'reject') {
          requestData.rejectionReason = rejectionReason;
        }

        console.log('Updating psychiatrist:', selectedPsychiatrist.id, 'with data:', requestData);

        response = await API.put(
          `/adminpsychiatrists/${selectedPsychiatrist.id}/status`,
          requestData
        );
      }

      // Update the psychiatrist with the full response data including rejection info
      setPsychiatrists(prev => 
        prev.map(p => 
          p.id === selectedPsychiatrist.id
            ? { 
                ...p, 
                status: actionType === 'revoke' ? 'pending' : 
                       actionType === 'approve' ? 'approved' : 'rejected',
                rejectionReason: response.data.rejectionReason,
                rejectedBy: response.data.rejectedBy,
                rejectedByName: response.data.rejectedByName,
                rejectedByRole: response.data.rejectedByRole
              }
            : p
        )
      );

      // Update status counts
      const newCounts = { ...statusCounts };
      const oldStatus = selectedPsychiatrist.status;
      
      if (oldStatus === 'pending') newCounts.pending--;
      if (oldStatus === 'approved') newCounts.approved--;
      if (oldStatus === 'rejected') newCounts.rejected--;
      
      if (actionType === 'revoke') {
        newCounts.pending++;
      } else {
        newCounts[actionType === 'approve' ? 'approved' : 'rejected']++;
      }
      
      setStatusCounts(newCounts);

      const actionMessages = {
        approve: 'approved',
        reject: 'rejected',
        revoke: 'revoked'
      };
      
      showNotification('success', `Psychiatrist ${actionMessages[actionType]} successfully!`);
      
      closeModals();
      
    } catch (error: any) {
      console.error('Error updating psychiatrist status:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg ||
                          'Failed to update status. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get the correct document URL - check both document and proof fields
  const getDocumentUrl = (item: EducationQualification | Experience): string | null => {
    // For education qualifications, use document field first, then proof
    if ('institution' in item) {
      return item.document || item.proof || null;
    }
    // For experiences, use document field first, then proof
    return item.document || item.proof || null;
  };

  const handleViewDocument = (documentUrl: string) => {
    if (!documentUrl) {
      showNotification('error', 'No document available to view.');
      return;
    }
    setSelectedDocument(documentUrl);
    setShowDocumentModal(true);
  };

  const handleDownloadDocument = (documentUrl: string, fileName: string) => {
    if (!documentUrl) {
      showNotification('error', 'No document available to download.');
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = fileName || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('success', 'Document download started');
    } catch (error) {
      console.error('Error downloading document:', error);
      showNotification('error', 'Failed to download document');
    }
  };

  const getDocumentFileName = (url: string) => {
    if (!url) return 'document';
    return url.split('/').pop() || 'document';
  };

  const isImageFile = (url: string) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  };

  const isPDFFile = (url: string) => {
    if (!url) return false;
    return /\.pdf$/i.test(url);
  };

  const formatEducationDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getEducationDuration = (startDate?: string, endDate?: string) => {
    if (!startDate) return '';
    
    const start = formatEducationDate(startDate);
    const end = endDate ? formatEducationDate(endDate) : 'Present';
    
    return `${start} - ${end}`;
  };

  const closeModals = () => {
    setShowProfileModal(false);
    setShowActionModal(false);
    setShowConfirmation(false);
    setShowDocumentModal(false);
    setSelectedPsychiatrist(null);
    setRejectionReason('');
    setSelectedDocument(null);
    setActiveTab('profile');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

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
            {/* Notification */}
            {notification && (
              <div className={`fixed top-5 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
                notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {notification.type === 'error' && <XCircle className="w-5 h-5" />}
                {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
                <span>{notification.message}</span>
                <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Header */}
            <div className="mb-6 lg:mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Psychiatrists
                  </h1>
                  <p className="text-gray-600">View and manage psychiatrist applications</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              {/* Total Psychiatrists */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 h-[80px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{statusCounts.total}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Total Psychiatrists</p>
                  </div>
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 h-[80px] flex items-center">
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

              {/* Approved */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 h-[80px] flex items-center">
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

              {/* Rejected */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 h-[80px] flex items-center">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 lg:p-6 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Filters</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                {/* Search */}
                <div className="relative md:col-span-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or specialities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                {/* Status Filter */}
                <div> 
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="All Status">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Psychiatrists Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-x-auto">
              {/* Table Header */}
              <div className="px-4 py-4 bg-gray-50 grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[1000px]">
                <div className="col-span-3 flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>Psychiatrist</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  <span>Contact</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Registered</span>
                </div>
                <div className="col-span-2">Specialities</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 min-w-[1000px]">
                {loading ? (
                  <div className="px-6 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading psychiatrists...</p>
                  </div>
                ) : filteredPsychiatrists.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No psychiatrists found matching your criteria.
                  </div>
                ) : (
                  filteredPsychiatrists.map((psychiatrist) => {
                    const status = psychiatrist?.status || 'pending';
                    const name = psychiatrist?.name || 'Unknown';
                    const title = psychiatrist?.title || '';
                    const email = psychiatrist?.email || '';
                    const contact_no = psychiatrist?.contact_no || '';
                    const specialities = psychiatrist?.specialities || [];
                    const createdAt = psychiatrist?.createdAt || new Date().toISOString();

                    return (
                      <div key={psychiatrist.id} className="px-4 py-4 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 transition-colors">
                        <div className="col-span-3 flex items-center gap-2">
                          {psychiatrist.avatar ? (
                            <img
                              src={psychiatrist.avatar}
                              alt={name || 'Profile'}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={() => {
                                const target = document.querySelector(`img[alt="${name || 'Profile'}"]`) as HTMLImageElement;
                                if (target) target.style.display = 'none';
                                const fallback = target?.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                            status === 'approved' ? 'bg-green-500' :
                            status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          } ${psychiatrist.avatar ? 'hidden' : ''}`}>
                            {getInitials(name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
                            <p className="text-xs text-gray-500 truncate">{title}</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-900 text-xs truncate">{email}</p>
                          <p className="text-xs text-gray-500 truncate">{contact_no}</p>
                        </div>
                        <div className="col-span-2 text-gray-900 text-xs">
                          {formatDate(createdAt)}
                        </div>
                        <div className="col-span-2">
                          <div className="flex flex-wrap gap-1">
                            {specialities.slice(0, 1).map((speciality, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded truncate max-w-[120px]">
                                {speciality}
                              </span>
                            ))}
                            {specialities.length > 1 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{specialities.length - 1} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(status)}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                        <div className="col-span-1 text-center">
                          <button
                            onClick={() => handleViewProfile(psychiatrist)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 mx-auto"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Profile Modal */}
            {showProfileModal && selectedPsychiatrist && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">Psychiatrist Profile</h2>
                      <button
                        onClick={closeModals}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className="mt-4 border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        <button
                          onClick={() => setActiveTab('profile')}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'profile'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Profile Information
                        </button>
                        <button
                          onClick={() => setActiveTab('education')}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'education'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Education Qualifications
                          {selectedPsychiatrist.eduQualifications && (
                            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                              {selectedPsychiatrist.eduQualifications.length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => setActiveTab('experiences')}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'experiences'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Experiences
                          {selectedPsychiatrist.experiences && (
                            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                              {selectedPsychiatrist.experiences.length}
                            </span>
                          )}
                        </button>
                      </nav>
                    </div>
                  </div>

                  <div className="p-6">
                    {activeTab === 'profile' ? (
                      /* Profile Information Tab */
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Info */}
                        <div className="lg:col-span-1">
                          <div className="text-center">
                            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold ${
                              (selectedPsychiatrist.status || 'pending') === 'approved' ? 'bg-green-500' :
                              (selectedPsychiatrist.status || 'pending') === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}>
                              {getInitials(selectedPsychiatrist.name)}
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-gray-900">{selectedPsychiatrist.name}</h3>
                            <p className="text-gray-600">{selectedPsychiatrist.title}</p>
                            <div className="mt-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(selectedPsychiatrist.status || 'pending')}`}>
                                {(selectedPsychiatrist.status || 'pending').charAt(0).toUpperCase() + (selectedPsychiatrist.status || 'pending').slice(1)}
                              </span>
                            </div>
                            {/* Rejection Information Display */}
                            {selectedPsychiatrist.status === 'rejected' && selectedPsychiatrist.rejectionReason && (
                              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-red-800 mb-2">Rejection Details</h4>
                                    <p className="text-sm text-red-700 mb-2">{selectedPsychiatrist.rejectionReason}</p>
                                    {selectedPsychiatrist.rejectedByName && (
                                      <p className="text-xs text-red-600">
                                        Rejected by: {selectedPsychiatrist.rejectedByName}
                                        {selectedPsychiatrist.rejectedByRole && ` (${selectedPsychiatrist.rejectedByRole})`}
                                        {selectedPsychiatrist.rejectedBy && ` (${selectedPsychiatrist.rejectedBy})`}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{selectedPsychiatrist.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{selectedPsychiatrist.contact_no}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">{selectedPsychiatrist.address}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Registered Date</p>
                                <p className="font-medium">{formatDate(selectedPsychiatrist.createdAt)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Shield className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">License</p>
                                <p className="font-medium">{selectedPsychiatrist.license_no}</p>
                              </div>
                            </div>
                            {selectedPsychiatrist.rating && (
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 text-gray-400">⭐</div>
                                <div>
                                  <p className="text-sm text-gray-500">Rating</p>
                                  <p className="font-medium">{selectedPsychiatrist.rating}/5</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <GraduationCap className="w-5 h-5 text-gray-400" />
                              <p className="text-sm text-gray-500">Specialities</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedPsychiatrist.specialities?.map((speciality, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                  {speciality}
                                </span>
                              ))}
                            </div>
                          </div>

                          {selectedPsychiatrist.description && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                              <p className="text-gray-600">{selectedPsychiatrist.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : activeTab === 'education' ? (
                      /* Education Qualifications Tab - Table Structure */
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                          <h3 className="text-xl font-bold text-gray-900">Education Qualifications</h3>
                        </div>

                        {!selectedPsychiatrist.eduQualifications || selectedPsychiatrist.eduQualifications.length === 0 ? (
                          <div className="text-center py-12">
                            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No education qualifications found</p>
                            <p className="text-gray-400 text-sm mt-2">
                              This psychiatrist hasn't added any education qualifications yet.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Institution & Degree
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Field & Grade
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Duration
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Document
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {selectedPsychiatrist.eduQualifications.map((edu) => {
                                    const documentUrl = getDocumentUrl(edu);
                                    return (
                                      <tr key={edu.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div>
                                            <div className="text-sm font-medium text-gray-900">
                                              {edu.institution}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {edu.degree || edu.title || 'No degree specified'}
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm text-gray-900">
                                            {edu.field || 'N/A'}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {edu.grade || 'No grade specified'}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {edu.startDate && edu.endDate 
                                            ? getEducationDuration(edu.startDate, edu.endDate)
                                            : edu.year 
                                            ? `Graduated: ${edu.year}`
                                            : 'Date not specified'
                                          }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          {documentUrl ? (
                                            <div className="flex items-center">
                                              <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                              <span className="text-sm text-gray-600">
                                                {isImageFile(documentUrl) ? 'Image' : 
                                                 isPDFFile(documentUrl) ? 'PDF' : 'Document'}
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="text-sm text-gray-400">No document</span>
                                          )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                          {documentUrl ? (
                                            <div className="flex justify-end space-x-2">
                                              <button
                                                onClick={() => handleViewDocument(documentUrl)}
                                                className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                                              >
                                                <Eye className="w-3 h-3" />
                                                View
                                              </button>
                                              <button
                                                onClick={() => handleDownloadDocument(documentUrl, getDocumentFileName(documentUrl))}
                                                className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                                              >
                                                <Download className="w-3 h-3" />
                                                Download
                                              </button>
                                            </div>
                                          ) : (
                                            <span className="text-gray-400 text-xs">No actions</span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Experiences Tab - Table Structure */
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                          <h3 className="text-xl font-bold text-gray-900">Professional Experiences</h3>
                        </div>

                        {!selectedPsychiatrist.experiences || selectedPsychiatrist.experiences.length === 0 ? (
                          <div className="text-center py-12">
                            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No experiences found</p>
                            <p className="text-gray-400 text-sm mt-2">
                              This psychiatrist hasn't added any professional experiences yet.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Start Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      End Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Document
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {selectedPsychiatrist.experiences.map((exp) => {
                                    const documentUrl = getDocumentUrl(exp);
                                    return (
                                      <tr key={exp.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm font-medium text-gray-900">
                                            {exp.position || 'No position specified'}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4">
                                          <div className="text-sm text-gray-600 max-w-xs">
                                            {truncateText(exp.description, 100)}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {formatDate(exp.startDate) || 'Date not specified'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {formatDate(exp.endDate) || 'Date not specified'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          {documentUrl ? (
                                            <div className="flex items-center">
                                              <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                              <span className="text-sm text-gray-600">
                                                {isImageFile(documentUrl) ? 'Image' : 
                                                 isPDFFile(documentUrl) ? 'PDF' : 'Document'}
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="text-sm text-gray-400">No document</span>
                                          )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                          {documentUrl ? (
                                            <div className="flex justify-end space-x-2">
                                              <button
                                                onClick={() => handleViewDocument(documentUrl)}
                                                className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                                              >
                                                <Eye className="w-3 h-3" />
                                                View
                                              </button>
                                              <button
                                                onClick={() => handleDownloadDocument(documentUrl, getDocumentFileName(documentUrl))}
                                                className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                                              >
                                                <Download className="w-3 h-3" />
                                                Download
                                              </button>
                                            </div>
                                          ) : (
                                            <span className="text-gray-400 text-xs">No actions</span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons - Only show on profile tab */}
                    {activeTab === 'profile' && (
                      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                        {(selectedPsychiatrist.status || 'pending') === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction('reject')}
                              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                            <button
                              onClick={() => handleAction('approve')}
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                          </>
                        )}
                        {/* Revoke button for approved or rejected psychiatrists */}
                        {((selectedPsychiatrist.status || 'pending') === 'approved' || 
                          (selectedPsychiatrist.status || 'pending') === 'rejected') && (
                          <button
                            onClick={() => handleAction('revoke')}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Revoke Status</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Document Preview Modal */}
            {showDocumentModal && selectedDocument && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Document Preview - {getDocumentFileName(selectedDocument)}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadDocument(selectedDocument, getDocumentFileName(selectedDocument))}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowDocumentModal(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
                    {isImageFile(selectedDocument) ? (
                      <div className="flex justify-center">
                        <img 
                          src={selectedDocument} 
                          alt="Document preview"
                          className="max-w-full max-h-full object-contain rounded"
                          onError={(e) => {
                            console.error('Error loading image:', selectedDocument);
                            showNotification('error', 'Failed to load image');
                          }}
                        />
                      </div>
                    ) : isPDFFile(selectedDocument) ? (
                      <div className="flex flex-col items-center justify-center h-96">
                        <FileText className="w-16 h-16 text-red-500 mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">PDF Document</p>
                        <p className="text-gray-600 mb-4">{getDocumentFileName(selectedDocument)}</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDownloadDocument(selectedDocument, getDocumentFileName(selectedDocument))}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download PDF
                          </button>
                          <a
                            href={selectedDocument}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open in New Tab
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-96">
                        <FileText className="w-16 h-16 text-gray-500 mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">Document</p>
                        <p className="text-gray-600 mb-4">{getDocumentFileName(selectedDocument)}</p>
                        <button
                          onClick={() => handleDownloadDocument(selectedDocument, getDocumentFileName(selectedDocument))}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Document
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Modal */}
            {showActionModal && selectedPsychiatrist && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-lg w-full">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">
                        {actionType === 'approve' ? 'Approve Psychiatrist' : 
                         actionType === 'reject' ? 'Reject Psychiatrist' : 
                         'Revoke Psychiatrist Status'}
                      </h2>
                      <button
                        onClick={closeModals}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        {actionType === 'approve'
                          ? `Are you sure you want to approve ${selectedPsychiatrist.name}'s application?`
                          : actionType === 'reject'
                          ? `Are you sure you want to reject ${selectedPsychiatrist.name}'s application?`
                          : `Are you sure you want to revoke ${selectedPsychiatrist.name}'s status and reset it to pending?`}
                      </p>
                      {actionType === 'reject' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Provide a reason for rejection..."
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            rows={4}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={closeModals}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmAction}
                        disabled={actionType === 'reject' && !rejectionReason.trim()}
                        className={`px-4 py-2 rounded-lg text-white transition-colors ${
                          actionType === 'approve'
                            ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
                            : actionType === 'reject'
                            ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                            : 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300'
                        }`}
                      >
                        {actionType === 'approve' ? 'Approve' : 
                         actionType === 'reject' ? 'Reject' : 'Revoke'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmation && selectedPsychiatrist && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        actionType === 'approve' ? 'bg-green-100' : 
                        actionType === 'reject' ? 'bg-red-100' : 'bg-orange-100'
                      }`}>
                        {actionType === 'approve' ? (
                          <Check className="w-6 h-6 text-green-600" />
                        ) : actionType === 'reject' ? (
                          <X className="w-6 h-6 text-red-600" />
                        ) : (
                          <RotateCcw className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {actionType === 'approve' ? 'Confirm Approval' : 
                           actionType === 'reject' ? 'Confirm Rejection' : 'Confirm Revocation'}
                        </h3>
                        <p className="text-gray-600">
                          {actionType === 'approve'
                            ? `This will approve ${selectedPsychiatrist.name}'s application.`
                            : actionType === 'reject'
                            ? `This will reject ${selectedPsychiatrist.name}'s application.`
                            : `This will revoke ${selectedPsychiatrist.name}'s status and reset it to pending.`}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={closeModals}
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={executeAction}
                        disabled={loading}
                        className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors flex items-center justify-center gap-2 ${
                          actionType === 'approve'
                            ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
                            : actionType === 'reject'
                            ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                            : 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300'
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>
                            Confirm {actionType === 'approve' ? 'Approval' : 
                                    actionType === 'reject' ? 'Rejection' : 'Revocation'}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Psychiatrist;