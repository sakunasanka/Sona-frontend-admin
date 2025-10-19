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
  Calendar, 
  MapPin, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  CreditCard, 
  HandCoins,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RefreshCw,
  Download,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

interface StudentPackage {
  applied: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  appliedDate?: string;
  school?: string;
  uniEmail?: string;
  graduationYear?: string;
  verificationDocument?: string;
  studentIDCopy?: string; // Added this field
  rejectionReason?: string;
  clientID?: number;
}

interface Client {
  id: number;
  firebaseId?: string;
  name: string;
  email: string;
  phone?: string;
  registeredDate: string;
  age?: number;
  location?: string;
  bio?: string;
  avatar?: string;
  studentPackage: StudentPackage;
  clientType: 'regular' | 'student';
  sessionsCompleted: number;
  totalSpent: number;
  subscriptionType?: string;
  isStudent: boolean;
  nickName?: string;
  concerns?: string[];
  role: string;
}

interface ClientStats {
  totalClients: number;
  studentClients: number;
  regularClients: number;
  pendingApplications: number;
}

// Helper function to validate and sanitize client data
const validateClient = (client: any): Client | null => {
  if (!client || typeof client !== 'object') return null;
  
  // Check for required fields
  if (!client.id || !client.name || !client.email) return null;
  
  return {
    id: client.id || 0,
    firebaseId: client.firebaseId,
    name: client.name || 'Unknown',
    email: client.email || '',
    phone: client.phone || '',
    registeredDate: client.registeredDate || new Date().toISOString(),
    age: typeof client.age === 'number' ? client.age : 0,
    location: client.location || 'Unknown',
    bio: client.bio || 'No bio available',
    avatar: client.avatar,
    studentPackage: {
      applied: client.studentPackage?.applied || false,
      status: client.studentPackage?.status,
      appliedDate: client.studentPackage?.appliedDate,
      school: client.studentPackage?.school,
      uniEmail: client.studentPackage?.uniEmail,
      graduationYear: client.studentPackage?.graduationYear,
      verificationDocument: client.studentPackage?.verificationDocument,
      studentIDCopy: client.studentPackage?.studentIDCopy, // Added this line
      rejectionReason: client.studentPackage?.rejectionReason,
      clientID: client.studentPackage?.clientID
    },
    clientType: client.clientType || 'regular',
    isStudent: client.isStudent || false,
    sessionsCompleted: typeof client.sessionsCompleted === 'number' ? client.sessionsCompleted : 0,
    totalSpent: typeof client.totalSpent === 'number' ? client.totalSpent : 0,
    subscriptionType: client.subscriptionType,
    nickName: client.nickName,
    concerns: client.concerns || [],
    role: client.role || 'Client'
  };
};

const Client: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStats>({
    totalClients: 0,
    studentClients: 0,
    regularClients: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'notApplied' | 'pending' | 'rejected'>('all');
  const [activeTab, setActiveTab] = useState<'regular' | 'students'>('regular');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Fetch clients and stats on component mount
  useEffect(() => {
    fetchClients();
    fetchStats();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setApiError(null);
      console.log('Fetching clients from API...');
      
      const response = await API.get('/adminclients');
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      // Handle different possible response structures
      let clientsData = response.data;
      let clientsArray: Client[] = [];
      
      if (Array.isArray(clientsData)) {
        clientsArray = clientsData.map(validateClient).filter(Boolean) as Client[];
      } else if (clientsData && Array.isArray(clientsData.data)) {
        clientsArray = clientsData.data.map(validateClient).filter(Boolean) as Client[];
      } else if (clientsData && Array.isArray(clientsData.clients)) {
        clientsArray = clientsData.clients.map(validateClient).filter(Boolean) as Client[];
      } else {
        console.warn('Unexpected API response structure:', clientsData);
        setApiError('Unexpected data format from server');
      }
      
      setClients(clientsArray);
      console.log('Processed clients:', clientsArray);
      
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch clients';
      setApiError(errorMessage);
      showNotification('error', errorMessage);
      setClients([]); // Ensure clients is always an array
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get('/adminclients/stats');
      console.log('Stats response:', response.data);

      if (response.data && response.data.success) {
        setStats({
          totalClients: response.data.data.total || 0,
          studentClients: response.data.data.students || 0,
          regularClients: response.data.data.regular || 0,
          pendingApplications: response.data.data.pending || 0
        });
      } else {
        console.warn('Unexpected stats response structure:', response.data);
        // Calculate stats from clients data as fallback
        calculateStatsFromClients();
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Calculate stats from clients data as fallback
      calculateStatsFromClients();
    }
  };

  const calculateStatsFromClients = () => {
    const totalClients = clients.length;
    const studentClients = clients.filter(client => 
      client.studentPackage.applied && client.studentPackage.status === 'approved'
    ).length;
    const regularClients = clients.filter(client => 
      !client.studentPackage.applied || client.studentPackage.status !== 'approved'
    ).length;
    const pendingApplications = clients.filter(client => 
      client.studentPackage.applied && client.studentPackage.status === 'pending'
    ).length;

    setStats({
      totalClients,
      studentClients,
      regularClients,
      pendingApplications
    });
  };

  const fetchClientById = async (id: number) => {
    try {
      const response = await API.get(`/adminclients/${id}`);
      return validateClient(response.data);
    } catch (error) {
      console.error('Error fetching client:', error);
      showNotification('error', 'Failed to fetch client details');
      return null;
    }
  };

  // Function to handle downloading the student ID copy
  const handleDownloadStudentID = (studentIDCopyUrl: string, clientName: string) => {
    if (!studentIDCopyUrl) {
      showNotification('error', 'No student ID copy available for download');
      return;
    }

    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = studentIDCopyUrl;
      
      // Extract filename from URL or use client name
      const fileName = studentIDCopyUrl.split('/').pop() || `student_id_${clientName.replace(/\s+/g, '_')}`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('success', 'Student ID copy downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      showNotification('error', 'Failed to download student ID copy');
    }
  };

  // Function to check if file is an image based on extension
  const isImageFile = (url: string) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  // Function to check if file is a PDF based on extension
  const isPdfFile = (url: string) => {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf');
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSubscriptionBadge = (subscription: string | undefined) => {
    const badges = {
      'free': 'bg-gray-100 text-gray-700',
      'basic': 'bg-blue-100 text-blue-700',
      'premium': 'bg-purple-100 text-purple-700',
      'student': 'bg-green-100 text-green-700',
      'regular': 'bg-blue-100 text-blue-700'
    };
    return badges[subscription as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getStudentPackageStatusBadge = (status: string | undefined) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  // Safe array access - always ensure we're working with an array
  const safeClients = Array.isArray(clients) ? clients : [];

  // Filter clients based on the new structure
  const studentUsers = safeClients.filter(client => 
    client.studentPackage.applied && client.studentPackage.status === 'approved'
  );

  const regularUsers = safeClients.filter(client => 
    !client.studentPackage.applied || client.studentPackage.status !== 'approved'
  );

  // Filter regular users based on selected filter
  const getFilteredRegularUsers = () => {
    switch (selectedFilter) {
      case 'notApplied':
        return regularUsers.filter(client => !client.studentPackage.applied);
      case 'pending':
        return regularUsers.filter(client => 
          client.studentPackage.applied && client.studentPackage.status === 'pending'
        );
      case 'rejected':
        return regularUsers.filter(client => 
          client.studentPackage.applied && client.studentPackage.status === 'rejected'
        );
      case 'all':
      default:
        return regularUsers;
    }
  };

  const currentClients = activeTab === 'students' ? studentUsers : getFilteredRegularUsers();

  const filteredClients = currentClients.filter(client => {
    const matchesSearch = 
      (client.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (client.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleViewProfile = async (client: Client) => {
    // Fetch latest client data
    const updatedClient = await fetchClientById(client.id);
    if (updatedClient) {
      setSelectedClient(updatedClient);
    } else {
      setSelectedClient(client);
    }
    setShowProfileModal(true);
  };

  const handleAction = (type: 'approve' | 'reject') => {
    setActionType(type);
    setRejectionReason('');
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (!selectedClient) return;
    
    if (actionType === 'reject' && !rejectionReason.trim()) {
      showNotification('error', 'Please provide a rejection reason.');
      return;
    }
    
    setShowConfirmation(true);
  };

  const executeAction = async () => {
    if (!selectedClient) return;
    
    setActionLoading(true);
    
    try {
      if (actionType === 'approve') {
        await API.post(`/adminclients/${selectedClient.id}/student-package/approve`);
      } else {
        await API.post(`/adminclients/${selectedClient.id}/student-package/reject`, {
          rejectionReason
        });
      }
      
      showNotification('success', `Student package application ${actionType}d successfully!`);
      
      // Refresh data
      await fetchClients();
      await fetchStats();
      
      setShowProfileModal(false);
      setShowActionModal(false);
      setShowConfirmation(false);
      setSelectedClient(null);
      setRejectionReason('');
      
    } catch (error: any) {
      console.error('Error executing action:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const closeModals = () => {
    setShowProfileModal(false);
    setShowActionModal(false);
    setShowConfirmation(false);
    setSelectedClient(null);
    setRejectionReason('');
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={toggleSidebar} />
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading clients...</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Client Management
                  </h1>
                  <p className="text-gray-600">View and manage your client relationships</p>
                </div>
                <button
                  onClick={fetchClients}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700">API Error: {apiError}</p>
                  </div>
                  <button 
                    onClick={() => setApiError(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

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

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4 mb-4">
              {/* Total Clients */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 justify-between w-[23%] h-[80px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Total Clients</p>
                  </div>
                </div>
              </div>

              {/* Student Clients */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 justify-between w-[23%] h-[80px] flex items-center">
                 <div className="flex items-center gap-3 w-full">
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                     <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6  text-purple-600" />
                   </div>
                   <div className="min-w-0 flex-1">
                     <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.studentClients}</p>
                     <p className="text-gray-600 text-xs lg:text-sm leading-tight">Students</p>
                   </div>
                 </div>
              </div> 

              {/* Regular Clients */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 justify-between w-[23%] h-[80px] flex items-center">
                 <div className="flex items-center gap-3 w-full">
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                     <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
                   </div>
                   <div className="min-w-0 flex-1">
                     <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.regularClients}</p>
                     <p className="text-gray-600 text-xs lg:text-sm leading-tight">Regular</p>
                   </div>
                 </div>
              </div> 

              {/* Pending Applications */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 justify-between w-[23%] h-[80px] flex items-center">
                 <div className="flex items-center gap-3 w-full">
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                     <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                   </div>
                   <div className="min-w-0 flex-1">
                     <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                     <p className="text-gray-600 text-xs lg:text-sm leading-tight">Pending</p>
                   </div>
                 </div>
              </div> 
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Filters</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {/* Search */}
                <div className="relative md:col-span-1 lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                {/* Regular Clients Filter */}
                {activeTab === 'regular' && (
                  <div>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value as any)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="all">All Regular Clients</option>
                      <option value="notApplied">Not Applied</option>
                      <option value="pending">Pending Applications</option>
                      <option value="rejected">Rejected Applications</option>
                    </select>
                  </div>
                )}

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 md:col-span-2 lg:col-span-1">
                  <button
                    onClick={() => {
                      setActiveTab('regular');
                      setSelectedFilter('all');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                      activeTab === 'regular'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Regular</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('students')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                      activeTab === 'students'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Students</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
              {/* Table Header */}
              <div className="px-6 py-4 bg-gray-50 grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Client</span>
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </div>
                {activeTab === 'students' && (
                  <div className="col-span-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Package</span>
                  </div>
                )}
                {activeTab === 'regular' && (
                  <div className="col-span-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Application Status</span>
                  </div>
                )}
                <div className="col-span-2">Sessions</div>
                <div className="col-span-1">Action</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredClients.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <p className="text-gray-500">
                      {safeClients.length === 0 ? 'No clients available' : 'No clients match your filters'}
                    </p>
                    {safeClients.length === 0 && (
                      <button
                        onClick={fetchClients}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <div key={client.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          client.studentPackage.applied && client.studentPackage.status === 'approved' ? 'bg-green-500' :
                          client.studentPackage.applied && client.studentPackage.status === 'pending' ? 'bg-yellow-500' :
                          client.studentPackage.applied && client.studentPackage.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                        }`}>
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.nickName && `@${client.nickName}`}</p>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <p className="text-gray-900 text-sm">{client.email}</p>
                      </div>
                      {activeTab === 'students' && (
                        <div className="col-span-3">
                          <div className="space-y-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStudentPackageStatusBadge(client.studentPackage.status)}`}>
                              {client.studentPackage.status
                                ? client.studentPackage.status.charAt(0).toUpperCase() + client.studentPackage.status.slice(1)
                                : 'Unknown'}
                            </span>
                            <p className="text-xs text-gray-500">{client.studentPackage.school}</p>
                          </div>
                        </div>
                      )}
                      {activeTab === 'regular' && (
                        <div className="col-span-3">
                          {client.studentPackage.applied ? (
                            <div className="space-y-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStudentPackageStatusBadge(client.studentPackage.status)}`}>
                                {client.studentPackage.status === 'pending' ? 'Pending Review' :
                                 client.studentPackage.status === 'rejected' ? 'Application Rejected' :
                                 'Application Status'}
                              </span>
                              {client.studentPackage.status === 'pending' && (
                                <p className="text-xs text-gray-500">Awaiting approval</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Not Applied</span>
                          )}
                        </div>
                      )}
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-900">{client.sessionsCompleted} sessions</p>
                        <p className="text-xs text-gray-500">Total completed</p>
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={() => handleViewProfile(client)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1 text-sm"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Profile Modal */}
            {showProfileModal && selectedClient && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">Client Profile</h2>
                      <button
                        onClick={closeModals}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Profile Info */}
                      <div className="lg:col-span-1">
                        <div className="text-center">
                          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold ${
                            selectedClient.studentPackage.applied && selectedClient.studentPackage.status === 'approved' ? 'bg-green-500' :
                            selectedClient.studentPackage.applied && selectedClient.studentPackage.status === 'pending' ? 'bg-yellow-500' :
                            selectedClient.studentPackage.applied && selectedClient.studentPackage.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                          }`}>
                            {getInitials(selectedClient.name)}
                          </div>
                          <h3 className="mt-4 text-xl font-bold text-gray-900">{selectedClient.name}</h3>
                          <p className="text-gray-600">{selectedClient.nickName && `@${selectedClient.nickName}`}</p>
                          <div className="mt-4 space-y-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionBadge(selectedClient.subscriptionType)}`}>
                              {selectedClient.clientType?.charAt(0)?.toUpperCase() + selectedClient.clientType?.slice(1) || 'Unknown'}
                            </span>
                          </div>
                          
                          {/* Student ID Copy Section */}
                              {selectedClient.studentPackage.studentIDCopy && (
                                <div className="border-t pt-3 mt-3">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm font-medium text-gray-700">Student ID </span>
                                    </div>
                                    <div className="flex gap-2">
                                      {/* View Button */}
                                      <a
                                        href={selectedClient.studentPackage.studentIDCopy}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>View</span>
                                      </a>
                                      {/* Download Button */}
                                      <button
                                        onClick={() => handleDownloadStudentID(
                                          selectedClient.studentPackage.studentIDCopy!,
                                          selectedClient.name
                                        )}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                      >
                                        <Download className="w-3 h-3" />
                                        <span>Download</span>
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Preview for images */}
                                  {isImageFile(selectedClient.studentPackage.studentIDCopy) && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-500 mb-2">Preview:</p>
                                      <div className="border rounded-lg p-2 bg-white max-w-xs">
                                        <img 
                                          src={selectedClient.studentPackage.studentIDCopy} 
                                          alt="Student ID Copy"
                                          className="max-w-full h-auto rounded"
                                          onError={(e) => {
                                            // If image fails to load, show file link instead
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                              parent.innerHTML = `
                                                <div class="text-center p-4">
                                                  <FileText class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                  <p class="text-sm text-gray-600">Image preview not available</p>
                                                  <a href="${selectedClient.studentPackage.studentIDCopy}" 
                                                     target="_blank" 
                                                     class="text-blue-600 hover:text-blue-800 text-sm">
                                                    View file directly
                                                  </a>
                                                </div>
                                              `;
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Info for PDFs */}
                                  {isPdfFile(selectedClient.studentPackage.studentIDCopy) && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                      {/*<FileText className="w-4 h-4" />*/}
                                      <span>PDF document - Click "View" to open in new tab or "Download" to save</span>
                                    </div>
                                  )}
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
                              <p className="font-medium">{selectedClient.email}</p>
                            </div>
                          </div>
                          {/* <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p className="font-medium">{selectedClient.location || 'Unknown'}</p>
                            </div>
                          </div> */}
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Registered Date</p>
                              <p className="font-medium">{new Date(selectedClient.registeredDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Sessions Completed</p>
                              <p className="font-medium">{selectedClient.sessionsCompleted}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <HandCoins className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Total Spent</p>
                              <p className="font-medium">LKR  {selectedClient.totalSpent}</p>
                            </div>
                          </div>
                        </div>

                        {/* Student Package Section */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <GraduationCap className="w-5 h-5 text-gray-400" />
                            <h4 className="font-semibold text-gray-900">Student Package Application</h4>
                          </div>
                          
                          {selectedClient.studentPackage.applied ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStudentPackageStatusBadge(selectedClient.studentPackage.status)}`}>
                                  {selectedClient.studentPackage.status === 'pending' ? 'Pending Review' :
                                   selectedClient.studentPackage.status === 'rejected' ? 'Application Rejected' :
                                   'Application Approved'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">School:</span>
                                  <p className="font-medium">{selectedClient.studentPackage.school || ''}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Student Email:</span>
                                  <p className="font-medium">{selectedClient.studentPackage.uniEmail || ''}</p>
                                </div>
                                {/* <div>
                                  <span className="text-gray-500">Graduation Year:</span>
                                  <p className="font-medium">{selectedClient.studentPackage.graduationYear || ''}</p>
                                </div> */}
                                <div>
                                  <span className="text-gray-500">Applied Date:</span>
                                  <p className="font-medium">{selectedClient.studentPackage.appliedDate ? new Date(selectedClient.studentPackage.appliedDate).toLocaleDateString() : ''}</p>
                                </div>
                              </div>
                              
                              

                              {selectedClient.studentPackage.status === 'rejected' && selectedClient.studentPackage.rejectionReason && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                                    <div>
                                      <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                                      <p className="text-sm text-red-700">{selectedClient.studentPackage.rejectionReason}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No student package application submitted.</p>
                          )}
                        </div>

                        {selectedClient.concerns && selectedClient.concerns.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Concerns</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedClient.concerns.map((concern, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  {concern}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                          <p className="text-gray-600">{selectedClient.bio || 'No bio available'}</p>
                        </div> */}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                      {selectedClient.studentPackage.applied && selectedClient.studentPackage.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction('reject')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject Application</span>
                          </button>
                          <button
                            onClick={() => handleAction('approve')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve Application</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Modal */}
            {showActionModal && selectedClient && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      {actionType === 'approve' ? 'Approve Student Package' : 'Reject Student Package'}
                    </h2>
                  </div>

                  <div className="p-6">
                    {actionType === 'reject' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason *
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Please provide a reason for rejection..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>
                    )}

                    <p className="text-gray-600 mb-4">
                      {actionType === 'approve' 
                        ? `Are you sure you want to approve ${selectedClient.name}'s student package application?`
                        : `Are you sure you want to reject ${selectedClient.name}'s student package application?`
                      }
                    </p>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmAction}
                        className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors ${
                          actionType === 'approve' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {actionType === 'approve' ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Approve</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Confirm Action</h2>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      {actionType === 'approve'
                        ? `You are about to approve ${selectedClient?.name}'s student package application. This action cannot be undone.`
                        : `You are about to reject ${selectedClient?.name}'s student package application. This action cannot be undone.`
                      }
                    </p>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={executeAction}
                        disabled={actionLoading}
                        className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors ${
                          actionType === 'approve' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'
                        } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {actionLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm</span>
                          </>
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

export default Client;