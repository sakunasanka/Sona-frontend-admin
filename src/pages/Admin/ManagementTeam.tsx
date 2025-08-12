import React, { useState } from 'react';
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
  AlertTriangle
} from 'lucide-react';

interface TeamMember {
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
  reportingTo: string;
}

function ManagementTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Senior Product Manager',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      joinDate: '2024-01-15',
      department: 'Product',
      avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150',
      experience: '8 years',
      skills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis'],
      bio: 'Experienced product manager with a passion for creating user-centric solutions. Led multiple successful product launches and cross-functional teams.',
      education: ['MBA - Stanford University', 'BS Computer Science - UC Berkeley'],
      certifications: ['Certified Scrum Product Owner', 'Google Analytics Certified'],
      previousRoles: [
        { company: 'TechCorp', position: 'Product Manager', duration: '2020-2023' },
        { company: 'StartupXYZ', position: 'Associate Product Manager', duration: '2018-2020' }
      ],
      achievements: [
        'Increased user engagement by 45% through product optimization',
        'Led team of 12 engineers and designers',
        'Launched 3 major product features with 95% user satisfaction'
      ],
      salary: '$145,000',
      reportingTo: 'VP of Product'
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'Engineering Lead',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      location: 'Seattle, WA',
      joinDate: '2024-01-10',
      department: 'Engineering',
      avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=150',
      experience: '12 years',
      skills: ['Full Stack Development', 'Cloud Architecture', 'Team Leadership', 'DevOps'],
      bio: 'Senior engineering leader with extensive experience in building scalable systems and leading high-performance teams.',
      education: ['MS Computer Science - MIT', 'BS Software Engineering - Carnegie Mellon'],
      certifications: ['AWS Solutions Architect', 'Kubernetes Certified Administrator'],
      previousRoles: [
        { company: 'Amazon', position: 'Senior Software Engineer', duration: '2019-2023' },
        { company: 'Microsoft', position: 'Software Engineer', duration: '2016-2019' }
      ],
      achievements: [
        'Architected microservices handling 10M+ requests daily',
        'Reduced system downtime by 80%',
        'Mentored 15+ junior engineers'
      ],
      salary: '$165,000',
      reportingTo: 'CTO'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      position: 'Head of Marketing',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      location: 'New York, NY',
      joinDate: '2024-01-20',
      department: 'Marketing',
      avatar: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=150',
      experience: '10 years',
      skills: ['Digital Marketing', 'Brand Strategy', 'Growth Hacking', 'Analytics'],
      bio: 'Strategic marketing leader with proven track record in building brands and driving growth across multiple channels.',
      education: ['MBA Marketing - Wharton', 'BA Communications - NYU'],
      certifications: ['Google Ads Certified', 'HubSpot Marketing Certified'],
      previousRoles: [
        { company: 'Nike', position: 'Marketing Director', duration: '2021-2023' },
        { company: 'Coca-Cola', position: 'Brand Manager', duration: '2018-2021' }
      ],
      achievements: [
        'Increased brand awareness by 60% in 18 months',
        'Generated $5M in new revenue through campaigns',
        'Built marketing team from 3 to 20 members'
      ],
      salary: '$135,000',
      reportingTo: 'CMO'
    },
    {
      id: '4',
      name: 'David Kumar',
      position: 'VP of Sales',
      email: 'david.kumar@company.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      joinDate: '2024-01-08',
      department: 'Sales',
      avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150',
      experience: '6 years',
      skills: ['B2B Sales', 'CRM Management', 'Lead Generation', 'Negotiation'],
      bio: 'Results-driven sales professional with expertise in enterprise sales and team management.',
      education: ['MBA - UT Austin', 'BS Business Administration - Texas A&M'],
      certifications: ['Salesforce Certified Administrator'],
      previousRoles: [
        { company: 'Oracle', position: 'Senior Sales Manager', duration: '2020-2023' },
        { company: 'IBM', position: 'Sales Representative', duration: '2018-2020' }
      ],
      achievements: [
        'Exceeded sales targets by 25% for 3 consecutive years',
        'Closed $2M+ in enterprise deals',
        'Built sales pipeline worth $10M+'
      ],
      salary: '$125,000',
      reportingTo: 'Chief Revenue Officer'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      position: 'Head of Design',
      email: 'lisa.thompson@company.com',
      phone: '+1 (555) 567-8901',
      location: 'Los Angeles, CA',
      joinDate: '2024-01-25',
      department: 'Design',
      avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150',
      experience: '9 years',
      skills: ['UI/UX Design', 'Design Systems', 'Prototyping', 'User Testing'],
      bio: 'Creative design leader passionate about creating intuitive user experiences and building design systems at scale.',
      education: ['MFA Design - Art Center', 'BA Graphic Design - UCLA'],
      certifications: ['Adobe Certified Expert', 'Google UX Design Certificate'],
      previousRoles: [
        { company: 'Airbnb', position: 'Senior UX Designer', duration: '2020-2023' },
        { company: 'Spotify', position: 'Product Designer', duration: '2018-2020' }
      ],
      achievements: [
        'Redesigned core product increasing user satisfaction by 40%',
        'Built design system used by 50+ designers',
        'Led design for award-winning mobile app'
      ],
      salary: '$140,000',
      reportingTo: 'VP of Design'
    }
  ]);

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
    reportingTo: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newRole, setNewRole] = useState({ company: '', position: '', duration: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);

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
      reportingTo: ''
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate new ID
      const newId = (Math.max(...teamMembers.map(m => parseInt(m.id))) + 1).toString();
      
      // Create new member
      const newMember: TeamMember = {
        ...newMemberForm,
        id: newId,
        avatar: newMemberForm.avatar || 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150'
      };
      
      // Add to team members
      setTeamMembers(prev => [...prev, newMember]);
      
      // Reset form and close modal
      resetAddMemberForm();
      setShowAddMemberModal(false);
      
      console.log('New member added successfully:', newMember);
    } catch (error) {
      console.error('Failed to add member:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const sendRejectionEmail = async (member: TeamMember, reason: string) => {
    setEmailSending(true);
    
    try {
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
      
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === selectedMember.id 
            ? { 
                ...member, 
                status: 'rejected' as const, 
                rejectionReason: rejectionReason.trim(),
                rejectionEmailSent: emailSuccess
              }
            : member
        )
      );
      
      setTimeout(() => {
        setShowRejectModal(false);
        setSelectedMember(null);
        setRejectionReason('');
        setEmailSent(false);
      }, 2000);
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

  // Get unique departments for filter
  const departments = ['all', ...Array.from(new Set(teamMembers.map(member => member.department)))];

  const filteredAndSortedMembers = teamMembers
    .filter(member => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Department filter
      const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
      
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case 'joinDate':
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        default:
          aValue = a[sortBy].toLowerCase();
          bValue = b[sortBy].toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

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

                {/* Department Filter */}
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
                        <button
                          onClick={() => handleSort('department')}
                          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                        >
                          Department
                          {sortBy === 'department' && (
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
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.position}</div>
                          <div className="text-sm text-gray-500">Reports to {member.reportingTo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.email}</div>
                          <div className="text-sm text-gray-500">{member.phone}</div>
                          <div className="text-sm text-gray-500">{member.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(member.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setViewingProfile(member)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
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
                          <div className="flex items-center gap-2 text-gray-600">
                            <UserIcon className="w-4 h-4" />
                            <span>Reports to {viewingProfile.reportingTo}</span>
                          </div>
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reports To</label>
                            <input
                              type="text"
                              value={newMemberForm.reportingTo}
                              onChange={(e) => setNewMemberForm(prev => ({ ...prev, reportingTo: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter reporting manager"
                            />
                          </div>
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