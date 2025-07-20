import React, { useState } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { Search, Filter, Eye, Check, X, Mail, AlertCircle, CheckCircle, XCircle, User, Phone, Calendar, MapPin, GraduationCap, Clock, BookOpen, CreditCard, DollarSign, FileText } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  status: 'active' | 'inactive' | 'suspended';
  age: number;
  location: string;
  bio: string;
  avatar?: string;
  studentPackage?: {
    applied: boolean;
    status: 'pending' | 'approved' | 'rejected';
    appliedDate?: string;
    school?: string;
    studentId?: string;
    graduationYear?: string;
    verificationDocument?: string;
    rejectionReason?: string;
  };
  subscriptionType: 'free' | 'basic' | 'premium' | 'student';
  sessionsCompleted: number;
  totalSpent: number;
}

const Client: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      registeredDate: '2024-01-15',
      status: 'active',
      age: 28,
      location: 'Los Angeles, CA',
      bio: 'Working professional seeking therapy for work-life balance and stress management.',
      subscriptionType: 'premium',
      sessionsCompleted: 12,
      totalSpent: 480,
      studentPackage: {
        applied: false,
        status: 'pending'
      }
    },
    {
      id: '2',
      name: 'Emma Martinez',
      email: 'emma.martinez@student.ucla.edu',
      phone: '+1 (555) 234-5678',
      registeredDate: '2024-01-12',
      status: 'active',
      age: 21,
      location: 'Los Angeles, CA',
      bio: 'College student dealing with academic stress and anxiety.',
      subscriptionType: 'student',
      sessionsCompleted: 8,
      totalSpent: 120,
      studentPackage: {
        applied: true,
        status: 'approved',
        appliedDate: '2024-01-12',
        school: 'UCLA',
        studentId: 'UCLA123456',
        graduationYear: '2025',
        verificationDocument: 'student-id-card.pdf'
      }
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@student.stanford.edu',
      phone: '+1 (555) 345-6789',
      registeredDate: '2024-01-10',
      status: 'active',
      age: 22,
      location: 'Palo Alto, CA',
      bio: 'Graduate student working on thesis and managing academic pressure.',
      subscriptionType: 'basic',
      sessionsCompleted: 4,
      totalSpent: 160,
      studentPackage: {
        applied: true,
        status: 'pending',
        appliedDate: '2024-01-10',
        school: 'Stanford University',
        studentId: 'STAN789012',
        graduationYear: '2024',
        verificationDocument: 'enrollment-letter.pdf'
      }
    },
    {
      id: '4',
      name: 'Sarah Thompson',
      email: 'sarah.thompson@email.com',
      phone: '+1 (555) 456-7890',
      registeredDate: '2024-01-08',
      status: 'inactive',
      age: 35,
      location: 'San Francisco, CA',
      bio: 'Parent seeking family therapy and parenting guidance.',
      subscriptionType: 'basic',
      sessionsCompleted: 6,
      totalSpent: 240,
      studentPackage: {
        applied: false,
        status: 'pending'
      }
    },
    {
      id: '5',
      name: 'David Rodriguez',
      email: 'david.rodriguez@student.usc.edu',
      phone: '+1 (555) 567-8901',
      registeredDate: '2024-01-05',
      status: 'active',
      age: 20,
      location: 'Los Angeles, CA',
      bio: 'Undergraduate student dealing with social anxiety and relationship issues.',
      subscriptionType: 'free',
      sessionsCompleted: 2,
      totalSpent: 0,
      studentPackage: {
        applied: true,
        status: 'rejected',
        appliedDate: '2024-01-05',
        school: 'USC',
        studentId: 'USC345678',
        graduationYear: '2026',
        verificationDocument: 'fake-document.pdf',
        rejectionReason: 'Submitted verification document appears to be invalid. Please provide an official enrollment letter or current student ID card from your institution.'
      }
    },
    {
      id: '6',
      name: 'Lisa Wilson',
      email: 'lisa.wilson@email.com',
      phone: '+1 (555) 678-9012',
      registeredDate: '2024-01-03',
      status: 'suspended',
      age: 42,
      location: 'Oakland, CA',
      bio: 'Professional seeking therapy for career transitions and personal growth.',
      subscriptionType: 'premium',
      sessionsCompleted: 15,
      totalSpent: 750,
      studentPackage: {
        applied: false,
        status: 'pending'
      }
    },
    {
      id: '7',
      name: 'Jessica Park',
      email: 'jessica.park@student.berkeley.edu',
      phone: '+1 (555) 789-0123',
      registeredDate: '2024-01-01',
      status: 'active',
      age: 23,
      location: 'Berkeley, CA',
      bio: 'PhD student researching anxiety and depression, seeking personal therapy.',
      subscriptionType: 'free',
      sessionsCompleted: 1,
      totalSpent: 0,
      studentPackage: {
        applied: true,
        status: 'pending',
        appliedDate: '2024-01-01',
        school: 'UC Berkeley',
        studentId: 'UCB456789',
        graduationYear: '2026',
        verificationDocument: 'student-transcript.pdf'
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedSubscription, setSelectedSubscription] = useState('All Subscriptions');
  const [activeTab, setActiveTab] = useState('regular');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStudentPackageAction, setIsStudentPackageAction] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const getSubscriptionBadge = (subscription: string) => {
    const badges = {
      'free': 'bg-gray-100 text-gray-800',
      'basic': 'bg-blue-100 text-blue-800',
      'premium': 'bg-purple-100 text-purple-800',
      'student': 'bg-green-100 text-green-800'
    };
    return badges[subscription as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStudentPackageStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  // Separate student and regular users
  const studentUsers = clients.filter(client => 
    client.studentPackage?.applied === true || client.subscriptionType === 'student'
  );

  const regularUsers = clients.filter(client => 
    client.studentPackage?.applied !== true && client.subscriptionType !== 'student'
  );

  const currentClients = activeTab === 'students' ? studentUsers : regularUsers;

  const filteredClients = currentClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All Status' || client.status === selectedStatus;
    const matchesSubscription = selectedSubscription === 'All Subscriptions' || client.subscriptionType === selectedSubscription;
    
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleViewProfile = (client: Client) => {
    setSelectedClient(client);
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
    if (!selectedClient) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setClients(prev => 
        prev.map(c => 
          c.id === selectedClient.id 
            ? { 
                ...c, 
                studentPackage: {
                  ...c.studentPackage!,
                  status: actionType as 'approved' | 'rejected',
                  rejectionReason: actionType === 'reject' ? rejectionReason : undefined
                },
                subscriptionType: actionType === 'approve' ? 'student' : c.subscriptionType
              }
            : c
        )
      );
      
      showNotification('success', `Student package application ${actionType}d successfully!`);
      
      setShowProfileModal(false);
      setShowActionModal(false);
      setShowConfirmation(false);
      setSelectedClient(null);
      setRejectionReason('');
      setIsStudentPackageAction(false);
      
    } catch (error) {
      showNotification('error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-600 font-medium">Filters:</span>
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All Status</option>
                    <option>active</option>
                    <option>inactive</option>
                    <option>suspended</option>
                  </select>
                  <select
                    value={selectedSubscription}
                    onChange={(e) => setSelectedSubscription(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All Subscriptions</option>
                    <option>free</option>
                    <option>basic</option>
                    <option>premium</option>
                    <option>student</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm">
              {/* Title and Stats */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
                    <p className="text-gray-600 mt-1">
                      {activeTab === 'students' ? studentUsers.length : regularUsers.length} {activeTab === 'students' ? 'student' : 'regular'} clients
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {currentClients.filter(c => c.status === 'active').length} Active
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {currentClients.filter(c => c.status === 'inactive').length} Inactive
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {currentClients.filter(c => c.status === 'suspended').length} Suspended
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 border-b border-gray-200">
                <div className="flex gap-8 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('regular')}
                    className={`flex items-center gap-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'regular'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Regular Users</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === 'regular'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {regularUsers.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('students')}
                    className={`flex items-center gap-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'students'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Student Users</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === 'students'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {studentUsers.length}
                    </span>
                  </button>
                </div>
              </div>

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
                {filteredClients.map((client) => (
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
                              {client.studentPackage.status.charAt(0).toUpperCase() + client.studentPackage.status.slice(1)}
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
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
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
                ))}
              </div>
            </div>

            {/* Profile Modal */}
            {showProfileModal && selectedClient && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
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
                              {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                            </span>
                            <br />
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionBadge(selectedClient.subscriptionType)}`}>
                              {selectedClient.subscriptionType}
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
                                  {selectedClient.studentPackage.status.charAt(0).toUpperCase() + selectedClient.studentPackage.status.slice(1)}
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

            {/* Action Modal */}
            {showActionModal && selectedClient && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-lg w-full p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {actionType === 'approve' ? 'Approve Student Package' : 'Reject Student Package'}
                    </h3>
                    <button
                      onClick={closeModals}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700 mb-2">
                        {actionType === 'approve'
                          ? `Are you sure you want to approve the student package application for ${selectedClient.name}?`
                          : `Are you sure you want to reject the student package application for ${selectedClient.name}?`}
                      </p>
                      {actionType === 'reject' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rejection Reason
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            rows={3}
                            placeholder="Provide a reason for rejection..."
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={closeModals}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmAction}
                        className={`px-4 py-2 rounded-lg text-white ${
                          actionType === 'approve'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {actionType === 'approve' ? 'Approve' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmation && selectedClient && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Confirm Action</h3>
                    <button
                      onClick={closeModals}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      {actionType === 'approve'
                        ? `Approve student package application for ${selectedClient.name}?`
                        : `Reject student package application for ${selectedClient.name}?`}
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={closeModals}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={executeAction}
                        className={`px-4 py-2 rounded-lg text-white ${
                          actionType === 'approve'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Confirm'}
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