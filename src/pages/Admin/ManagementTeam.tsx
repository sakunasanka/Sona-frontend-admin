import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { 
  Users, 
  X, 
  Mail, 
  Calendar,
  User as UserIcon,
  Send,
  Eye,
  ChevronDown,
  ChevronUp,
  Plus,
  Upload,
  Save,
  Search,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';
import API from '../../api/api';

interface TeamMember {
  _id?: string;
  id: string;
  name: string;
  position: string;
  email: string;
  joinDate: string;
  avatar: string;
  bio: string;
  salary: string;
  status?: string;
  rejectionReason?: string;
  rejectionEmailSent?: boolean;
}

function ManagementTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewingProfile, setViewingProfile] = useState<TeamMember | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'position' | 'joinDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add member modal states
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState<Omit<TeamMember, 'id'> & { password: string; displayName: string }>({
    name: '',
    position: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0],
    avatar: '',
    bio: '',
    salary: '',
    password: 'DefaultPassword123!', // Default password
    displayName: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Edit member state
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/adminmtmembers');
      
      // Handle different possible response structures
      const members = response.data.data.map((item: any) => {
        // If the data already has user fields flattened, use as is
        if (item.name && item.email) {
          return {
            ...item,
          };
        }
        
        // If data has nested user object, flatten it
        return {
          ...item,
          name: item.user?.name || '',
          email: item.user?.email || '',
          avatar: item.user?.avatar || '',
          id: item.user?.id || item.id || item._id || '',
        };
      });
      
      setTeamMembers(members);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
      setError('Failed to load team members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Add member functions
  const resetAddMemberForm = () => {
    setNewMemberForm({
      name: '',
      position: '',
      email: '',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: 'https://via.placeholder.com/150', // Default placeholder,
      bio: '',
      salary: '',
      password: 'DefaultPassword123!',
      displayName: '',
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // For now, just use a placeholder URL to avoid database issues
    // In a real app, you'd upload to a cloud service and get a URL
    setNewMemberForm(prev => ({ 
      ...prev, 
      avatar: "https://via.placeholder.com/150" 
    }));
    setError("Note: Using placeholder avatar. In production, images would be uploaded to cloud storage.");
  }
};

  const handleSalaryChange = (value: string) => {
    // Remove any non-digit characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    setNewMemberForm(prev => ({ ...prev, salary: numericValue }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmitNewMember = async () => {
  setFormSubmitting(true);

  try {
    // Check if email already exists
    const emailExists = await checkEmailExists(newMemberForm.email.trim());
    if (emailExists) {
      setError(`Email "${newMemberForm.email}" is already registered. Please use a different email address.`);
      setFormSubmitting(false);
      return;
    }

    // Transform the data to match backend expectations - only send necessary fields
    const payload = {
      email: newMemberForm.email.trim(),
      password: newMemberForm.password,
      displayName: newMemberForm.name.trim(),
      additionalData: {
        position: newMemberForm.position.trim(),
        joinDate: newMemberForm.joinDate,
        bio: newMemberForm.bio.trim(),
        salary: newMemberForm.salary.trim(),
        // Use a simple placeholder instead of base64 to avoid database limits
        avatar: newMemberForm.avatar && newMemberForm.avatar.length < 1000 
          ? newMemberForm.avatar 
          : "https://via.placeholder.com/150",
      }
    };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    const response = await API.post("/adminmtmembers", payload);
    console.log("API response:", response.data);

    // Refresh the list
    await fetchTeamMembers();

    // Reset form and close modal
    resetAddMemberForm();
    setShowAddMemberModal(false);

    console.log("New member added successfully");
  } catch (error: any) {
    console.error("Failed to add member:", error);
    
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      
      if (error.response.status === 500) {
        const errorMessage = error.response.data?.message || 'Server error occurred';
        
        if (errorMessage.includes('email address is already in use')) {
          setError(`Email "${newMemberForm.email}" is already registered. Please use a different email address.`);
        } else if (errorMessage.includes('value too long')) {
          setError("One of the fields is too long for the database. Please shorten your inputs, especially the avatar image.");
        } else {
          setError(`Server error: ${errorMessage}`);
        }
      } else {
        setError(`Error ${error.response.status}: ${error.response.data?.message || 'Failed to add team member'}`);
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      setError("No response from server. Please check your connection.");
    } else {
      console.error("Error message:", error.message);
      setError("Failed to add team member. Please try again.");
    }
  } finally {
    setFormSubmitting(false);
  }
};

const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await API.get('/adminmtmembers');
    const members = response.data.data;
    
    // Check if any existing member has this email
    const emailExists = members.some((member: any) => 
      member.email === email || (member.user && member.user.email === email)
    );
    
    return emailExists;
  } catch (error) {
    console.error("Error checking email:", error);
    return false; // If we can't check, proceed anyway
  }
};

  const handleEditMember = async () => {
    if (!editingMember) return;
    
    setFormSubmitting(true);
    
    try {
      const payload = {
        name: editingMember.name,
        email: editingMember.email,
        avatar: editingMember.avatar,
        position: editingMember.position,
        joinDate: editingMember.joinDate,
        bio: editingMember.bio,
        salary: editingMember.salary,
      };

      await API.put(`/adminmtmembers/${editingMember._id || editingMember.id}`, payload);
      
      // Refresh the list
      await fetchTeamMembers();
      
      // Close modal
      setShowEditModal(false);
      setEditingMember(null);
      
      console.log('Member updated successfully');
    } catch (error) {
      console.error('Failed to update member:', error);
      setError('Failed to update team member. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }
    
    try {
      await API.delete(`/adminmtmembers/${memberId}`);
      
      // Refresh the list
      await fetchTeamMembers();
      
      console.log('Member deleted successfully');
    } catch (error) {
      console.error('Failed to delete member:', error);
      setError('Failed to delete team member. Please try again.');
    }
  };

  const sendRejectionEmail = async (member: TeamMember, reason: string) => {
    setEmailSending(true);
    
    try {
      // In a real implementation, you would call your email API here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`Sending rejection email to ${member.email}:`);
      console.log(`Subject: Management Team Application Update`);
      console.log(`Dear ${member.name},

Thank you for your interest in joining our management team as ${member.position}.

After careful consideration, we have decided not to move forward with your application at this time.

Reason for rejection:
${reason}

We appreciate the time and effort you put into your application. We encourage you to apply for future opportunities that match your qualifications.

Best regards,
HR Management Team`);
      
      setEmailSent(true);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    } finally {
      setEmailSending(false);
    }
  };

  const confirmReject = async () => {
    if (selectedMember && rejectionReason.trim()) {
      const emailSuccess = await sendRejectionEmail(selectedMember, rejectionReason.trim());
      
      // Update the member status
      try {
        await API.put(`/adminmtmembers/${selectedMember._id || selectedMember.id}`, {
          ...selectedMember,
          status: 'rejected',
          rejectionReason: rejectionReason.trim(),
          rejectionEmailSent: emailSuccess
        });
        
        // Refresh the list
        await fetchTeamMembers();
        
        setTimeout(() => {
          setShowRejectModal(false);
          setSelectedMember(null);
          setRejectionReason('');
          setEmailSent(false);
        }, 2000);
      } catch (error) {
        console.error('Failed to update member status:', error);
        setError('Failed to update member status. Please try again.');
      }
    }
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedMembers = teamMembers
  .filter(member => {
    // Safely normalize values for search
    const name = member.name?.toLowerCase() ?? '';
    const position = member.position?.toLowerCase() ?? '';
    const email = member.email?.toLowerCase() ?? '';

    // Search filter
    const matchesSearch =
      searchTerm === '' ||
      name.includes(searchTerm.toLowerCase()) ||
      position.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    return matchesSearch;
  })
  .sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;

    switch (sortBy) {
      case 'joinDate':
        aValue = a.joinDate ? new Date(a.joinDate) : new Date(0); // default to epoch if null
        bValue = b.joinDate ? new Date(b.joinDate) : new Date(0);
        break;
      default:
        const aField = (a[sortBy] ?? '').toString().toLowerCase();
        const bField = (b[sortBy] ?? '').toString().toLowerCase();
        aValue = aField;
        bValue = bField;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });


  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        <div className={`fixed inset-y-0 left-0 z-50 lg:static lg:block ${sidebarOpen ? 'block' : 'hidden'}`}>
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Management Team</h1>
                  <p className="text-gray-600">Manage and view management team members</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                  <button 
                    onClick={() => setError(null)} 
                    className="float-right text-red-800 hover:text-red-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search members by name, position, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                        >
                          Member
                          {sortBy === 'name' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('position')}
                          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                        >
                          Position
                          {sortBy === 'position' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('joinDate')}
                          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                        >
                          Join Date
                          {sortBy === 'joinDate' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedMembers.map((member) => (
                      <tr key={member._id || member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(member.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setViewingProfile(member)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingMember(member);
                                setShowEditModal(true);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member._id || member.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAndSortedMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                  <p className="text-gray-500">Try adjusting your search to see more results.</p>
                </div>
              )}
            </div>
          </div>

          {/* Profile View Modal - Simplified */}
          {viewingProfile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Team Member Profile</h3>
                    </div>
                    <button
                      onClick={() => setViewingProfile(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Header Section */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={viewingProfile.avatar}
                        alt={viewingProfile.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                      />
                      <div className="flex-1 text-center md:text-left">
                        <div className="mb-4">
                          <h1 className="text-3xl font-bold text-gray-900 mb-2">{viewingProfile.name}</h1>
                          <p className="text-xl text-blue-600 font-medium mb-1">{viewingProfile.position}</p>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-6">{viewingProfile.bio}</p>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{viewingProfile.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {new Date(viewingProfile.joinDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Member Modal - Simplified */}
          {showAddMemberModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {!formSubmitting ? (
                  <>
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Plus className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">Add New Team Member</h3>
                        </div>
                        <button
                          onClick={() => {
                            setShowAddMemberModal(false);
                            resetAddMemberForm();
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6">
                      {/* Basic Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          Basic Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                            <input
                              type="text"
                              value={newMemberForm.name}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, name: e.target.value, displayName: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                            <input
                              type="text"
                              value={newMemberForm.position}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, position: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter position title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input
                              type="email"
                              value={newMemberForm.email}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter email address"
                            />
                            {error && error.includes('already registered') && error.includes(newMemberForm.email) && (
                              <p className="text-red-500 text-xs mt-1">This email is already in use. Please choose a different one.</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newMemberForm.password}
                                onChange={(e) => setNewMemberForm(prev => ({ ...prev, password: e.target.value }))}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter password"
                              />
                              <button
                                type="button"
                                onClick={() => setNewMemberForm(prev => ({ ...prev, password: generatePassword() }))}
                                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                              >
                                Generate
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Default password is provided. Click "Generate" for a secure one.</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                            <input
                              type="date"
                              value={newMemberForm.joinDate}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, joinDate: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                            <input
                              type="text"
                              value={newMemberForm.salary}
                              onChange={(e) => handleSalaryChange(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., 250000"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                          <textarea
                            value={newMemberForm.bio}
                            onChange={(e) => setNewMemberForm(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter a brief bio"
                          />
                        </div>

                        {/* Avatar Upload */}
                        {/* <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                          <div className="flex items-center gap-4">
                            {newMemberForm.avatar && (
                              <img
                                src={newMemberForm.avatar}
                                alt="Preview"
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            )}
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                              <Upload className="w-4 h-4" />
                              Upload Photo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div> */}
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => {
                            setShowAddMemberModal(false);
                            resetAddMemberForm();
                          }}
                          className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitNewMember}
                          disabled={!newMemberForm.name || !newMemberForm.position || !newMemberForm.email || !newMemberForm.password || formSubmitting}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          {formSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Add Member
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Adding Team Member</h3>
                    <p className="text-gray-600">Please wait while we add the new team member...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit Member Modal - Simplified */}
          {showEditModal && editingMember && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {!formSubmitting ? (
                  <>
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Edit className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">Edit Team Member</h3>
                        </div>
                        <button
                          onClick={() => {
                            setShowEditModal(false);
                            setEditingMember(null);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Modal Content - Simplified to only include necessary fields */}
                    <div className="p-6">
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          Basic Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                            <input
                              type="text"
                              value={editingMember.name}
                              onChange={(e) => setEditingMember(prev => prev ? {...prev, name: e.target.value} : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                            <input
                              type="text"
                              value={editingMember.position}
                              onChange={(e) => setEditingMember(prev => prev ? {...prev, position: e.target.value} : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email (Read Only) *</label>
                            <input
                              type="email"
                              value={editingMember.email}
                              onChange={(e) => setEditingMember(prev => prev ? {...prev, email: e.target.value} : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Join Date (Read Only)</label>
                            <input
                              type="date"
                              value={editingMember.joinDate}
                              onChange={(e) => setEditingMember(prev => prev ? {...prev, joinDate: e.target.value} : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            readOnly/>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                            <input
                              type="text"
                              value={editingMember.salary}
                              onChange={(e) => setEditingMember(prev => prev ? {...prev, salary: e.target.value} : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                          <textarea
                            value={editingMember.bio}
                            onChange={(e) => setEditingMember(prev => prev ? {...prev, bio: e.target.value} : null)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => {
                            setShowEditModal(false);
                            setEditingMember(null);
                          }}
                          className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEditMember}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Updating Team Member</h3>
                    <p className="text-gray-600">Please wait while we update the team member...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Rejection Modal with Email Functionality */}
          {showRejectModal && selectedMember && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                {!emailSending && !emailSent && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Reject Team Member</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      You are about to reject <strong>{selectedMember.name}</strong> from the management team. 
                      Please provide a reason for rejection. An email notification will be sent to the applicant.
                    </p>
                    
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter rejection reason..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      rows={4}
                    />
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => {
                          setShowRejectModal(false);
                          setSelectedMember(null);
                          setRejectionReason('');
                        }}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmReject}
                        disabled={!rejectionReason.trim()}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reject & Send Email
                      </button>
                    </div>
                  </>
                )}

                {emailSending && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sending Email Notification</h3>
                    <p className="text-gray-600">Please wait while we send the rejection notification to {selectedMember.name}...</p>
                  </div>
                )}

                {emailSent && (
                  <div className="text-center py-8">
                    <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Sent Successfully</h3>
                    <p className="text-gray-600">Rejection notification has been sent to {selectedMember.name} at {selectedMember.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagementTeam;