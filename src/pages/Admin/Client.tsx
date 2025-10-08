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
  BookOpen, 
  CreditCard, 
  DollarSign, 
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

interface StudentPackage {
  id: string;
  applied: boolean;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate?: string;
  school?: string;
  studentId?: string;
  graduationYear?: string;
  verificationDocument?: string;
  rejectionReason?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  status: 'active' | 'inactive' | 'banned';
  age: number;
  location: string;
  bio: string;
  avatar?: string;
  studentPackage?: StudentPackage;
  clientType: 'regular' | 'student';
  sessionsCompleted: number;
  totalSpent: number;
  subscriptionType?: string;
}

interface ClientStats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  studentClients: number;
  regularClients: number;
}

// Helper function to validate and sanitize client data
const validateClient = (client: any): Client | null => {
  if (!client || typeof client !== 'object') return null;
  
  // Check for required fields
  if (!client.id || !client.name || !client.email) return null;
  
  return {
    id: client.id || '',
    name: client.name || 'Unknown',
    email: client.email || '',
    phone: client.phone || 'N/A',
    registeredDate: client.registeredDate || new Date().toISOString(),
    status: client.status || 'inactive',
    age: typeof client.age === 'number' ? client.age : 0,
    location: client.location || 'Unknown',
    bio: client.bio || 'No bio available',
    avatar: client.avatar,
    studentPackage: client.studentPackage ? {
      id: client.studentPackage.id || '',
      applied: client.studentPackage.applied || false,
      status: client.studentPackage.status || 'pending',
      appliedDate: client.studentPackage.appliedDate,
      school: client.studentPackage.school,
      studentId: client.studentPackage.studentId,
      graduationYear: client.studentPackage.graduationYear,
      verificationDocument: client.studentPackage.verificationDocument,
      rejectionReason: client.studentPackage.rejectionReason
    } : undefined,
    clientType: client.clientType || 'regular',
    sessionsCompleted: typeof client.sessionsCompleted === 'number' ? client.sessionsCompleted : 0,
    totalSpent: typeof client.totalSpent === 'number' ? client.totalSpent : 0,
    subscriptionType: client.subscriptionType
  };
};

const Client: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStats>({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    studentClients: 0,
    regularClients: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedSubscription, setSelectedSubscription] = useState('All Subscriptions');
  const [activeTab, setActiveTab] = useState<'regular' | 'students'>('regular');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isStudentPackageAction, setIsStudentPackageAction] = useState(false);
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
      } else if (clientsData && Array.isArray(clientsData.clients)) {
        clientsArray = clientsData.clients.map(validateClient).filter(Boolean) as Client[];
      } else if (clientsData && Array.isArray(clientsData.data)) {
        clientsArray = clientsData.data.map(validateClient).filter(Boolean) as Client[];
      } else if (clientsData && typeof clientsData === 'object') {
        // If it's an object but not an array, try to extract clients
        console.warn('Unexpected API response structure:', clientsData);
        setApiError('Unexpected data format from server');
      } else {
        console.warn('Invalid API response:', clientsData);
        setApiError('Invalid data received from server');
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
      
      if (response.data && typeof response.data === 'object') {
        setStats({
          totalClients: response.data.totalClients || 0,
          activeClients: response.data.activeClients || 0,
          inactiveClients: response.data.inactiveClients || 0,
          studentClients: response.data.studentClients || 0,
          regularClients: response.data.regularClients || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Don't show error for stats, just use defaults
    }
  };

  const fetchClientById = async (id: string) => {
    try {
      const response = await API.get(`/adminclients/${id}`);
      return validateClient(response.data);
    } catch (error) {
      console.error('Error fetching client:', error);
      showNotification('error', 'Failed to fetch client details');
      return null;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      banned: 'bg-red-100 text-red-700 border-red-200'
    };
    return badges[status as keyof typeof badges] || badges.inactive;
  };

  const getSubscriptionBadge = (subscription: string | undefined) => {
    const badges = {
      'free': 'bg-gray-100 text-gray-700',
      'basic': 'bg-blue-100 text-blue-700',
      'premium': 'bg-purple-100 text-purple-700',
      'student': 'bg-green-100 text-green-700'
    };
    return badges[subscription as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getStudentPackageStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  // Safe array access - always ensure we're working with an array
  const safeClients = Array.isArray(clients) ? clients : [];

  // Separate student and regular users with null checks
  const studentUsers = safeClients.filter(client => 
    client && (client.studentPackage?.applied === true || client.clientType === 'student')
  );

  const regularUsers = safeClients.filter(client => 
    client && (client.studentPackage?.applied !== true && client.clientType !== 'student')
  );

  const currentClients = activeTab === 'students' ? studentUsers : regularUsers;

  const filteredClients = currentClients.filter(client => {
    if (!client) return false;
    
    const matchesSearch = 
      (client.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (client.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All Status' || client.status === selectedStatus.toLowerCase();
    const matchesSubscription = selectedSubscription === 'All Subscriptions' || client.clientType === selectedSubscription.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleViewProfile = async (client: Client) => {
    if (!client?.id) return;
    
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
    if (!selectedClient) return;
    
    setActionType(type);
    setIsStudentPackageAction(true);
    setRejectionReason('');
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (!selectedClient) return;
    
    if (actionType === 'reject' && isStudentPackageAction && !rejectionReason.trim()) {
      showNotification('error', 'Please provide a rejection reason.');
      return;
    }
    
    setShowConfirmation(true);
  };

  const executeAction = async () => {
    if (!selectedClient || !selectedClient.studentPackage) return;
    
    setActionLoading(true);
    
    try {
      if (actionType === 'approve') {
        await API.post(`/adminclients/${selectedClient.id}/student-package/approve`, {
          packageId: selectedClient.studentPackage.id
        });
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
      setIsStudentPackageAction(false);
      
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
    setIsStudentPackageAction(false);
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
              {/* Total Clients */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
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

              {/* Active Clients */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.activeClients}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Active</p>
                  </div>
                </div>
              </div>

              {/* Inactive Clients */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.inactiveClients}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Inactive</p>
                  </div>
                </div>
              </div>

              {/* Student Clients */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.studentClients}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Students</p>
                  </div>
                </div>
              </div>

              {/* Regular Clients */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
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
            </div>

            {/* Debug Info - Remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Debug Info:</strong> {safeClients.length} clients loaded | API Error: {apiError || 'None'}
                </p>
              </div>
            )}

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

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="All Status">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 md:col-span-2 lg:col-span-1">
                  <button
                    onClick={() => setActiveTab('regular')}
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
                  <div className="col-span-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Package</span>
                  </div>
                )}
                {activeTab === 'regular' && (
                  <div className="col-span-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Sessions</span>
                  </div>
                )}
                <div className="col-span-2">Status</div>
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
                    client && (
                      <div key={client.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                        <div className="col-span-3 flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                            client.status === 'active' ? 'bg-green-500' :
                            client.status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {getInitials(client.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{client.name}</p>
                            <p className="text-sm text-gray-500">{client.age} years old</p>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <p className="text-gray-900 text-sm">{client.email}</p>
                          <p className="text-sm text-gray-500">{client.phone}</p>
                        </div>
                        {activeTab === 'students' && (
                          <div className="col-span-2">
                            {client.studentPackage?.applied ? (
                              <div className="space-y-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStudentPackageStatusBadge(client.studentPackage.status)}`}>
                                  {client.studentPackage.status?.charAt(0)?.toUpperCase() + client.studentPackage.status?.slice(1) || 'Unknown'}
                                </span>
                                <p className="text-xs text-gray-500">{client.studentPackage.school}</p>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">Not applied</span>
                            )}
                          </div>
                        )}
                        {activeTab === 'regular' && (
                          <div className="col-span-2">
                            <p className="text-sm font-medium text-gray-900">{client.sessionsCompleted} sessions</p>
                            <p className="text-xs text-gray-500">Total completed</p>
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(client.status)}`}>
                            {client.status?.charAt(0)?.toUpperCase() + client.status?.slice(1) || 'Unknown'}
                          </span>
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
                    )
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
                            selectedClient.status === 'active' ? 'bg-green-500' :
                            selectedClient.status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {getInitials(selectedClient.name)}
                          </div>
                          <h3 className="mt-4 text-xl font-bold text-gray-900">{selectedClient.name}</h3>
                          <p className="text-gray-600">{selectedClient.age} years old</p>
                          <div className="mt-4 space-y-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(selectedClient.status)}`}>
                              {selectedClient.status?.charAt(0)?.toUpperCase() + selectedClient.status?.slice(1) || 'Unknown'}
                            </span>
                            <br />
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionBadge(selectedClient.subscriptionType || 'regular')}`}>
                              {selectedClient.clientType?.charAt(0)?.toUpperCase() + selectedClient.clientType?.slice(1) || 'Unknown'}
                            </span>
                          </div>
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
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{selectedClient.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p className="font-medium">{selectedClient.location}</p>
                            </div>
                          </div>
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
                            <DollarSign className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Total Spent</p>
                              <p className="font-medium">${selectedClient.totalSpent}</p>
                            </div>
                          </div>
                        </div>

                        {/* Student Package Section */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <GraduationCap className="w-5 h-5 text-gray-400" />
                            <h4 className="font-semibold text-gray-900">Student Package Application</h4>
                          </div>
                          
                          {selectedClient.studentPackage?.applied ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStudentPackageStatusBadge(selectedClient.studentPackage.status)}`}>
                                  {selectedClient.studentPackage.status?.charAt(0)?.toUpperCase() + selectedClient.studentPackage.status?.slice(1) || 'Unknown'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">School:</span>
                                  <p className="font-medium">{selectedClient.studentPackage.school}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Student ID:</span>
                                  <p className="font-medium">{selectedClient.studentPackage.studentId}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Graduation Year:</span>
                                  <p className="font-medium">{selectedClient.studentPackage.graduationYear}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Applied Date:</span>
                                  <p className="font-medium">{selectedClient.studentPackage.appliedDate ? new Date(selectedClient.studentPackage.appliedDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                              </div>
                              
                              {selectedClient.studentPackage.verificationDocument && (
                                <div className="flex items-center gap-2 text-sm">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-500">Verification Document:</span>
                                  <span className="font-medium text-blue-600">{selectedClient.studentPackage.verificationDocument}</span>
                                </div>
                              )}

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

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                          <p className="text-gray-600">{selectedClient.bio}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                      {selectedClient.studentPackage?.applied && selectedClient.studentPackage?.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction('reject')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => handleAction('approve')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rest of your modals remain the same */}
            {/* ... (Action Modal, Confirmation Modal) ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;