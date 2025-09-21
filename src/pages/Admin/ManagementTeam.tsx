import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { 
  Users, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Building,
  Award,
  Star,
  FileText,
  User as UserIcon,
  Send,
  Eye,
  ChevronDown,
  ChevronUp,
  Plus,
  Upload,
  Save,
  Search,
  Filter,
  CheckCircle,
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
  phone: string;
  location: string;
  joinDate: string;
  department: string;
  avatar: string;
  experience: string;
  skills: string[];
  bio: string;
  education: string[];
  certifications: string[];
  previousRoles: Array<{
    company: string;
    position: string;
    duration: string;
  }>;
  achievements: string[];
  salary: string;
  //reportingTo: string;
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
  const [sortBy, setSortBy] = useState<'name' | 'position' | 'department' | 'joinDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  
  // Add member modal states
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    position: '',
    email: '',
    phone: '',
    location: '',
    joinDate: new Date().toISOString().split('T')[0],
    department: '',
    avatar: '',
    experience: '',
    skills: [],
    bio: '',
    education: [],
    certifications: [],
    previousRoles: [],
    achievements: [],
    salary: '',
    //reportingTo: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newRole, setNewRole] = useState({ company: '', position: '', duration: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Edit member state
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/adminmtmembers');
      // Flatten user fields into each member
      const members = response.data.data.map((item: any) => ({
        ...item,
        name: item.user?.name || '',
        email: item.user?.email || '',
        avatar: item.user?.avatar || '',
        id: item.user?.id || item.id || item._id || '',
        skills: item.skills || [],
        education: item.education || [],
        certifications: item.certifications || [],
        achievements: item.achievements || [],
        previousRoles: item.previousRoles || [],
      }));
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
      phone: '',
      location: '',
      joinDate: new Date().toISOString().split('T')[0],
      department: '',
      avatar: '',
      experience: '',
      skills: [],
      bio: '',
      education: [],
      certifications: [],
      previousRoles: [],
      achievements: [],
      salary: '',
      //reportingTo: ''
    });
    setNewSkill('');
    setNewEducation('');
    setNewCertification('');
    setNewAchievement('');
    setNewRole({ company: '', position: '', duration: '' });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setNewMemberForm(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setNewMemberForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddEducation = () => {
    if (newEducation.trim()) {
      setNewMemberForm(prev => ({
        ...prev,
        education: [...prev.education, newEducation.trim()]
      }));
      setNewEducation('');
    }
  };

  const handleRemoveEducation = (index: number) => {
    setNewMemberForm(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setNewMemberForm(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (index: number) => {
    setNewMemberForm(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setNewMemberForm(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setNewMemberForm(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleAddRole = () => {
    if (newRole.company.trim() && newRole.position.trim() && newRole.duration.trim()) {
      setNewMemberForm(prev => ({
        ...prev,
        previousRoles: [...prev.previousRoles, { ...newRole }]
      }));
      setNewRole({ company: '', position: '', duration: '' });
    }
  };

  const handleRemoveRole = (index: number) => {
    setNewMemberForm(prev => ({
      ...prev,
      previousRoles: prev.previousRoles.filter((_, i) => i !== index)
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setNewMemberForm(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitNewMember = async () => {
  setFormSubmitting(true);

  try {
    console.log("Payload being sent:", newMemberForm);

    const response = await API.post("/adminmtmembers", newMemberForm);
    console.log("API response:", response.data);

    // Refresh the list
    await fetchTeamMembers();

    // Reset form and close modal
    resetAddMemberForm();
    setShowAddMemberModal(false);

    console.log("New member added successfully");
  } catch (error: any) {
    console.error(" Failed to add member:", error.response?.data || error.message);
    setError("Failed to add team member. Please try again.");
  } finally {
    setFormSubmitting(false);
  }
};


  const handleEditMember = async () => {
    if (!editingMember) return;
    
    setFormSubmitting(true);
    
    try {
      await API.put(`/adminmtmembers/${editingMember._id || editingMember.id}`, editingMember);
      
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

  // // Get unique departments for filter
  // const departments = ['all', ...Array.from(new Set(teamMembers.map(member => member.department)))];

  const filteredAndSortedMembers = teamMembers
  .filter(member => {
    // Safely normalize values for search
    const name = member.name?.toLowerCase() ?? '';
    const position = member.position?.toLowerCase() ?? '';
    const email = member.email?.toLowerCase() ?? '';
    const department = member.department?.toLowerCase() ?? '';

    // Search filter
    const matchesSearch =
      searchTerm === '' ||
      name.includes(searchTerm.toLowerCase()) ||
      position.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      department.includes(searchTerm.toLowerCase());

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
                    placeholder="Search members by name, position, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Department Filter
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div> */}
              

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
                      {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('position')}
                          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                        >
                          Position
                          {sortBy === 'position' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th> */}
                      {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('department')}
                          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                        >
                          Department
                          {sortBy === 'department' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th> */}
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
                              <div className="text-sm text-gray-500">{member.experience}</div>
                            </div>
                          </div>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.position}</div>
                          <div className="text-sm text-gray-500">Reports to {member.reportingTo}</div>
                        </td> */}
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.department}</div>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.email}</div>
                          <div className="text-sm text-gray-500">{member.phone}</div>
                          <div className="text-sm text-gray-500">{member.location}</div>
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
                              View
                            </button>
                            <button
                              onClick={() => {
                                setEditingMember(member);
                                setShowEditModal(true);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member._id || member.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
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
                  <p className="text-gray-500">Try adjusting your filter to see more results.</p>
                </div>
              )}
            </div>
          </div>

          {/* Profile View Modal */}
          {viewingProfile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{viewingProfile.name}</h1>
                            <p className="text-xl text-blue-600 font-medium mb-1">{viewingProfile.position}</p>
                            <p className="text-gray-600">{viewingProfile.department} Department</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-6">{viewingProfile.bio}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{viewingProfile.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{viewingProfile.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{viewingProfile.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {new Date(viewingProfile.joinDate).toLocaleDateString()}</span>
                          </div>
                          {/* <div className="flex items-center gap-2 text-gray-600">
                            <UserIcon className="w-4 h-4" />
                            <span>Reports to {viewingProfile.reportingTo}</span>
                          </div> */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>{viewingProfile.experience} experience</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Skills */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-blue-600" />
                        Skills & Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {viewingProfile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        Education
                      </h3>
                      <div className="space-y-2">
                        {viewingProfile.education.map((edu, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-gray-700">{edu}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Certifications
                      </h3>
                      <div className="space-y-2">
                        {viewingProfile.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <span className="text-gray-700">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        Key Achievements
                      </h3>
                      <div className="space-y-2">
                        {viewingProfile.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                            <span className="text-gray-700">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Work History */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      Work History
                    </h3>
                    <div className="space-y-4">
                      {viewingProfile.previousRoles.map((role, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <h4 className="font-medium text-gray-900">{role.position}</h4>
                          <p className="text-blue-600">{role.company}</p>
                          <p className="text-sm text-gray-500">{role.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Member Modal */}
          {showAddMemberModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                    <div className="p-6 space-y-6">
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
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, name: e.target.value }))}
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
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                              type="tel"
                              value={newMemberForm.phone}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                              type="text"
                              value={newMemberForm.location}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, location: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter location"
                            />
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                            <select
                              value={newMemberForm.department}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, department: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Department</option>
                              <option value="Product">Product</option>
                              <option value="Engineering">Engineering</option>
                              <option value="Marketing">Marketing</option>
                              <option value="Sales">Sales</option>
                              <option value="Design">Design</option>
                              <option value="Operations">Operations</option>
                              <option value="Finance">Finance</option>
                              <option value="HR">HR</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                            <input
                              type="text"
                              value={newMemberForm.experience}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, experience: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., 5 years"
                            />
                          </div>
                          {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reports To</label>
                            <input
                              type="text"
                              value={newMemberForm.reportingTo}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, reportingTo: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter reporting manager"
                            />
                          </div> */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                            <input
                              type="text"
                              value={newMemberForm.salary}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, salary: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., $120,000"
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
                        <div className="mt-4">
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
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Skills & Expertise
                        </h4>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                          />
                          <button
                            onClick={handleAddSkill}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newMemberForm.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                            >
                              {skill}
                              <button
                                onClick={() => handleRemoveSkill(index)}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Education
                        </h4>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newEducation}
                            onChange={(e) => setNewEducation(e.target.value)}
                            placeholder="Add education (e.g., MBA - Harvard Business School)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddEducation()}
                          />
                          <button
                            onClick={handleAddEducation}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="space-y-2">
                          {newMemberForm.education.map((edu, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-sm">{edu}</span>
                              <button
                                onClick={() => handleRemoveEducation(index)}
                                className="text-red-600 hover:bg-red-50 rounded p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Certifications
                        </h4>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            placeholder="Add certification"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCertification()}
                          />
                          <button
                            onClick={handleAddCertification}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="space-y-2">
                          {newMemberForm.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-sm">{cert}</span>
                              <button
                                onClick={() => handleRemoveCertification(index)}
                                className="text-red-600 hover:bg-red-50 rounded p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Previous Roles */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Previous Roles
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                          <input
                            type="text"
                            value={newRole.company}
                            onChange={(e) => setNewRole(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Company"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={newRole.position}
                            onChange={(e) => setNewRole(prev => ({ ...prev, position: e.target.value }))}
                            placeholder="Position"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={newRole.duration}
                            onChange={(e) => setNewRole(prev => ({ ...prev, duration: e.target.value }))}
                            placeholder="Duration (e.g., 2020-2023)"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={handleAddRole}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add Role
                          </button>
                        </div>
                        <div className="space-y-2">
                          {newMemberForm.previousRoles.map((role, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded">
                              <div>
                                <div className="font-medium text-sm">{role.position}</div>
                                <div className="text-xs text-gray-600">{role.company} • {role.duration}</div>
                              </div>
                              <button
                                onClick={() => handleRemoveRole(index)}
                                className="text-red-600 hover:bg-red-50 rounded p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Key Achievements
                        </h4>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newAchievement}
                            onChange={(e) => setNewAchievement(e.target.value)}
                            placeholder="Add an achievement"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                          />
                          <button
                            onClick={handleAddAchievement}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="space-y-2">
                          {newMemberForm.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start justify-between bg-white p-2 rounded">
                              <span className="text-sm flex-1">{achievement}</span>
                              <button
                                onClick={() => handleRemoveAchievement(index)}
                                className="text-red-600 hover:bg-red-50 rounded p-1 ml-2"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
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
                          disabled={!newMemberForm.name || !newMemberForm.position || !newMemberForm.email || !newMemberForm.department}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                          <Save className="w-4 h-4" />
                          Add Member
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

          {/* Edit Member Modal */}
          {showEditModal && editingMember && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

                    {/* Modal Content - Similar to Add Member but with editingMember data */}
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
                          {/* Add other fields similarly */}
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