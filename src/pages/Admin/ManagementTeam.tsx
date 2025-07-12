import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { 
  Users, 
  Check, 
  X, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Building,
  Award,
  Star,
  FileText,
  User,
  Send,
  Eye,
  ChevronDown,
  ChevronUp
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
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  rejectionEmailSent?: boolean;
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
      status: 'pending',
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
      status: 'approved',
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
      status: 'pending',
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
      status: 'rejected',
      rejectionReason: 'Incomplete documentation and missing required certifications.',
      rejectionEmailSent: true,
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
      status: 'pending',
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
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewingProfile, setViewingProfile] = useState<TeamMember | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'position' | 'department' | 'joinDate' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleApprove = (id: string) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === id 
          ? { ...member, status: 'approved' as const, rejectionReason: undefined }
          : member
      )
    );
  };

  const handleReject = (member: TeamMember) => {
    setSelectedMember(member);
    setShowRejectModal(true);
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

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: TeamMember['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredAndSortedMembers = teamMembers
    .filter(member => filter === 'all' || member.status === filter)
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

  const stats = {
    total: teamMembers.length,
    pending: teamMembers.filter(m => m.status === 'pending').length,
    approved: teamMembers.filter(m => m.status === 'approved').length,
    rejected: teamMembers.filter(m => m.status === 'rejected').length
  };

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  // Profile View Component
  if (viewingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setViewingProfile(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Team List
            </button>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
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
                    <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 mt-4 md:mt-0 ${getStatusColor(viewingProfile.status)}`}>
                      {getStatusIcon(viewingProfile.status)}
                      {viewingProfile.status.charAt(0).toUpperCase() + viewingProfile.status.slice(1)}
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
                      <User className="w-4 h-4" />
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
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
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

          {/* Rejection Reason (if applicable) */}
          {viewingProfile.status === 'rejected' && viewingProfile.rejectionReason && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">Rejection Details</h3>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">{viewingProfile.rejectionReason}</p>
              </div>
              {viewingProfile.rejectionEmailSent && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Rejection notification sent to applicant</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {viewingProfile.status === 'pending' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    handleApprove(viewingProfile.id);
                    setViewingProfile(prev => prev ? { ...prev, status: 'approved' } : null);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Approve Member
                </button>
                <button
                  onClick={() => handleReject(viewingProfile)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Reject Member
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Table View
  return (
   <div className='flex w-screen h-screen from-gray-200'>
    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>

    <div className="h-screen w-11/12 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className=" w-11/12 mx-auto   py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Management Team Administration</h1>
              <p className="text-gray-600">Review and approve management team members</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
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
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                    >
                      Status
                      {sortBy === 'status' && (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {getStatusIcon(member.status)}
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </div>
                      {member.status === 'rejected' && member.rejectionEmailSent && (
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                          <CheckCircle className="w-3 h-3" />
                          Email sent
                        </div>
                      )}
                      {/* {member.status === 'rejected' && member.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800 max-w-xs">
                          <div className="font-medium mb-1">Rejection Reason:</div>
                          <div className="truncate" title={member.rejectionReason}>
                            {member.rejectionReason}
                          </div>
                        </div>
                      )} */}
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
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
  );
}

export default ManagementTeam;