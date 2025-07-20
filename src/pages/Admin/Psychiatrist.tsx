import React, { useState } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { Search, Filter, Eye, Check, X, Mail, AlertCircle, CheckCircle, XCircle, User, Phone, Calendar, MapPin, GraduationCap, Clock, Shield } from 'lucide-react';

interface Psychiatrist {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  specialization: string;
  experience: string;
  education: string;
  license: string;
  location: string;
  bio: string;
  avatar?: string;
}

const Psychiatrist: React.FC = () => {
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      registeredDate: '2024-01-15',
      category: 'Clinical',
      status: 'approved',
      specialization: 'Clinical Psychology',
      experience: '8 years',
      education: 'PhD in Clinical Psychology, Harvard University',
      license: 'PSY-12345-CA',
      location: 'Los Angeles, CA',
      bio: 'Specialized in anxiety disorders, depression, and trauma therapy with extensive experience in cognitive behavioral therapy.'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      registeredDate: '2024-01-12',
      category: 'Family',
      status: 'approved',
      specialization: 'Family Therapy',
      experience: '12 years',
      education: 'PhD in Marriage and Family Therapy, UCLA',
      license: 'MFT-67890-CA',
      location: 'San Francisco, CA',
      bio: 'Expert in couples counseling, family dynamics, and relationship therapy with a focus on communication improvement.'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 345-6789',
      registeredDate: '2024-01-10',
      category: 'Career',
      status: 'rejected',
      specialization: 'Career Counseling',
      experience: '5 years',
      education: 'Masters in Career Development, Stanford University',
      license: 'CC-11111-CA',
      location: 'Palo Alto, CA',
      bio: 'Helps professionals navigate career transitions, workplace stress, and professional development challenges.'
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      email: 'james.wilson@email.com',
      phone: '+1 (555) 456-7890',
      registeredDate: '2024-01-08',
      category: 'Addiction',
      status: 'approved',
      specialization: 'Addiction Counseling',
      experience: '10 years',
      education: 'PhD in Addiction Psychology, UC Berkeley',
      license: 'AC-22222-CA',
      location: 'Oakland, CA',
      bio: 'Specialized in substance abuse treatment, addiction recovery, and behavioral interventions.'
    },
    {
      id: '5',
      name: 'Dr. Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 567-8901',
      registeredDate: '2024-01-05',
      category: 'Trauma',
      status: 'pending',
      specialization: 'Trauma Therapy',
      experience: '7 years',
      education: 'PhD in Trauma Psychology, USC',
      license: 'TT-33333-CA',
      location: 'Los Angeles, CA',
      bio: 'Expert in PTSD treatment, trauma recovery, and crisis intervention with specialized training in EMDR.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPsychiatrist, setSelectedPsychiatrist] = useState<Psychiatrist | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
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
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      'Clinical': 'bg-purple-100 text-purple-800',
      'Family': 'bg-blue-100 text-blue-800',
      'Career': 'bg-green-100 text-green-800',
      'Addiction': 'bg-red-100 text-red-800',
      'Trauma': 'bg-orange-100 text-orange-800'
    };
    return badges[category as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const filteredPsychiatrists = psychiatrists.filter(psychiatrist => {
    const matchesSearch = psychiatrist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         psychiatrist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         psychiatrist.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || psychiatrist.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || psychiatrist.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusCounts = () => {
    const pending = psychiatrists.filter(p => p.status === 'pending').length;
    const approved = psychiatrists.filter(p => p.status === 'approved').length;
    const rejected = psychiatrists.filter(p => p.status === 'rejected').length;
    return { pending, approved, rejected };
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleViewProfile = (psychiatrist: Psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist);
    setShowProfileModal(true);
  };

  const handleAction = (type: 'approve' | 'reject') => {
    if (!selectedPsychiatrist) return;
    
    setActionType(type);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPsychiatrists(prev => 
        prev.map(p => 
          p.id === selectedPsychiatrist.id 
            ? { ...p, status: actionType as 'approved' | 'rejected' }
            : p
        )
      );
      
      showNotification('success', `Psychiatrist ${actionType}d successfully!`);
      
      setShowProfileModal(false);
      setShowActionModal(false);
      setShowConfirmation(false);
      setSelectedPsychiatrist(null);
      setRejectionReason('');
      
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
    setSelectedPsychiatrist(null);
    setRejectionReason('');
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
            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search psychiatrists..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-600 font-medium">Filters:</span>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option>All Categories</option>
                    <option>Clinical</option>
                    <option>Family</option>
                    <option>Career</option>
                    <option>Addiction</option>
                    <option>Trauma</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option>All Status</option>
                    <option>pending</option>
                    <option>approved</option>
                    <option>rejected</option>
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
                    <h1 className="text-2xl font-bold text-gray-900">Psychiatrist Management</h1>
                    <p className="text-gray-600 mt-1">{psychiatrists.length} psychiatrists found</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {statusCounts.pending} Pending
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {statusCounts.approved} Approved
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {statusCounts.rejected} Rejected
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Header */}
              <div className="px-6 py-4 bg-gray-50 grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Name</span>
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Registered Date</span>
                </div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Action</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredPsychiatrists.map((psychiatrist) => (
                  <div key={psychiatrist.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-3 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        psychiatrist.status === 'approved' ? 'bg-green-500' :
                        psychiatrist.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {getInitials(psychiatrist.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{psychiatrist.name}</p>
                        <p className="text-sm text-gray-500">{psychiatrist.specialization}</p>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <p className="text-gray-900 text-sm">{psychiatrist.email}</p>
                      <p className="text-sm text-gray-500">{psychiatrist.phone}</p>
                    </div>
                    <div className="col-span-2 text-gray-900">
                      {new Date(psychiatrist.registeredDate).toLocaleDateString()}
                    </div>
                    <div className="col-span-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadge(psychiatrist.category)}`}>
                        {psychiatrist.category}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(psychiatrist.status)}`}>
                        {psychiatrist.status.charAt(0).toUpperCase() + psychiatrist.status.slice(1)}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => handleViewProfile(psychiatrist)}
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
            {showProfileModal && selectedPsychiatrist && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Profile Info */}
                      <div className="lg:col-span-1">
                        <div className="text-center">
                          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold ${
                            selectedPsychiatrist.status === 'approved' ? 'bg-green-500' :
                            selectedPsychiatrist.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {getInitials(selectedPsychiatrist.name)}
                          </div>
                          <h3 className="mt-4 text-xl font-bold text-gray-900">{selectedPsychiatrist.name}</h3>
                          <p className="text-gray-600">{selectedPsychiatrist.specialization}</p>
                          <div className="mt-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(selectedPsychiatrist.status)}`}>
                              {selectedPsychiatrist.status.charAt(0).toUpperCase() + selectedPsychiatrist.status.slice(1)}
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
                              <p className="font-medium">{selectedPsychiatrist.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{selectedPsychiatrist.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p className="font-medium">{selectedPsychiatrist.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Registered Date</p>
                              <p className="font-medium">{new Date(selectedPsychiatrist.registeredDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Experience</p>
                              <p className="font-medium">{selectedPsychiatrist.experience}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">License</p>
                              <p className="font-medium">{selectedPsychiatrist.license}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <GraduationCap className="w-5 h-5 text-gray-400" />
                            <p className="text-sm text-gray-500">Education</p>
                          </div>
                          <p className="font-medium">{selectedPsychiatrist.education}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                          <p className="text-gray-600">{selectedPsychiatrist.bio}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                      {selectedPsychiatrist.status === 'pending' && (
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
                      {selectedPsychiatrist.status === 'rejected' && (
                        <button
                          onClick={() => handleAction('approve')}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                      )}
                      {selectedPsychiatrist.status === 'approved' && (
                        <button
                          onClick={() => handleAction('reject')}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Revoke Approval</span>
                        </button>
                      )}
                    </div>
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
                        {actionType === 'approve' ? 'Approve Psychiatrist' : 'Reject Psychiatrist'}
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
                          : `Are you sure you want to reject ${selectedPsychiatrist.name}'s application?`}
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
                            className="w-full border border-gray-300 rounded-lg p-3"
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
                            : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
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
            {showConfirmation && selectedPsychiatrist && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        actionType === 'approve' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {actionType === 'approve' ? (
                          <Check className="w-6 h-6 text-green-600" />
                        ) : (
                          <X className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                        </h3>
                        <p className="text-gray-600">
                          {actionType === 'approve'
                            ? `This will approve ${selectedPsychiatrist.name}'s application.`
                            : `This will reject ${selectedPsychiatrist.name}'s application.`}
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
                            : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}</span>
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