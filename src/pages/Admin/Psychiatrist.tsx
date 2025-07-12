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
  ChevronUp,
  GraduationCap,
  Globe,
  MessageSquare,
  Menu
} from 'lucide-react';

interface Psychiatrist {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  education: string;
  licenseNumber: string;
  phone: string;
  profileImage: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  rating: number;
  patientsCount: number;
  bio: string;
  languages: string[];
  certifications: string[];
  rejectionReason?: string;
  rejectionEmailSent?: boolean;
  previousRoles: Array<{
    hospital: string;
    position: string;
    duration: string;
  }>;
  achievements: string[];
  salary: string;
  reportingTo: string;
}

function Psychiatrist() {
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([
    {
      id: '1',
      name: 'Dr. Priyanka Jayawardena',
      email: 'priyanka.jayawardena@gmail.com',
      specialization: 'Clinical Psychology',
      experience: 12,
      education: 'MBBS, MD Psychiatry - University of Colombo',
      licenseNumber: 'SLMC-PSY-2024-001',
      phone: '+94 77 123 4567',
      profileImage: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      location: 'Colombo, Western Province',
      status: 'pending',
      applicationDate: '2024-01-15',
      rating: 4.8,
      patientsCount: 245,
      bio: 'Specialized in anxiety disorders, depression, and cognitive behavioral therapy. Fluent in Sinhala, Tamil, and English with extensive experience in multicultural mental health care.',
      languages: ['Sinhala', 'Tamil', 'English'],
      certifications: ['CBT Certification', 'EMDR Therapy', 'Trauma-Informed Care', 'Sri Lanka College of Psychiatrists'],
      previousRoles: [
        { hospital: 'National Hospital of Sri Lanka', position: 'Senior Psychiatrist', duration: '2020-2023' },
        { hospital: 'Colombo General Hospital', position: 'Psychiatrist', duration: '2018-2020' }
      ],
      achievements: [
        'Treated over 500 patients with anxiety disorders',
        'Published 15 research papers on mental health',
        'Led mental health awareness programs in rural areas'
      ],
      salary: 'Rs. 180,000',
      reportingTo: 'Chief of Psychiatry'
    },
    {
      id: '2',
      name: 'Dr. Rohan Fernando',
      email: 'rohan.fernando@outlook.com',
      specialization: 'Child & Adolescent Psychiatry',
      experience: 15,
      education: 'MBBS, MD Psychiatry - University of Peradeniya',
      licenseNumber: 'SLMC-PSY-2024-002',
      phone: '+94 71 234 5678',
      profileImage: 'https://images.pexels.com/photos/5407764/pexels-photo-5407764.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      location: 'Kandy, Central Province',
      status: 'approved',
      applicationDate: '2024-01-10',
      rating: 4.9,
      patientsCount: 312,
      bio: 'Expert in child and adolescent mental health, ADHD, autism spectrum disorders, and developmental psychology. Active member of the Sri Lankan Association of Child Psychiatrists.',
      languages: ['Sinhala', 'English'],
      certifications: ['Child Psychiatry Board Certification', 'ADHD Specialist', 'Autism Assessment', 'Play Therapy'],
      previousRoles: [
        { hospital: 'Teaching Hospital Kandy', position: 'Consultant Child Psychiatrist', duration: '2019-2023' },
        { hospital: 'Lady Ridgeway Hospital', position: 'Registrar', duration: '2016-2019' }
      ],
      achievements: [
        'Established first autism assessment center in Central Province',
        'Trained 25+ medical officers in child psychiatry',
        'Reduced child psychiatric waiting times by 60%'
      ],
      salary: 'Rs. 200,000',
      reportingTo: 'Director of Child Services'
    },
    {
      id: '3',
      name: 'Dr. Kamala Wijesinghe',
      email: 'kamala.wijesinghe@yahoo.com',
      specialization: 'Addiction Psychiatry',
      experience: 10,
      education: 'MBBS, MD Psychiatry - University of Sri Jayewardenepura',
      licenseNumber: 'SLMC-PSY-2024-003',
      phone: '+94 76 345 6789',
      profileImage: 'https://images.pexels.com/photos/5407715/pexels-photo-5407715.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      location: 'Galle, Southern Province',
      status: 'pending',
      applicationDate: '2024-01-20',
      rating: 4.7,
      patientsCount: 189,
      bio: 'Specializes in substance abuse treatment, alcohol dependency, and addiction recovery. Works closely with rehabilitation centers across Southern Province.',
      languages: ['Sinhala', 'English'],
      certifications: ['Addiction Medicine Certification', 'Motivational Interviewing', 'Group Therapy', 'Detoxification Management'],
      previousRoles: [
        { hospital: 'Karapitiya Teaching Hospital', position: 'Addiction Specialist', duration: '2021-2023' },
        { hospital: 'Base Hospital Matara', position: 'Medical Officer', duration: '2019-2021' }
      ],
      achievements: [
        'Established addiction treatment program in Southern Province',
        'Successfully treated 300+ addiction cases',
        'Conducted community awareness programs on substance abuse'
      ],
      salary: 'Rs. 165,000',
      reportingTo: 'Regional Medical Director'
    },
    {
      id: '4',
      name: 'Dr. Sunil Rajapaksa',
      email: 'sunil.rajapaksa@gmail.com',
      specialization: 'Geriatric Psychiatry',
      experience: 18,
      education: 'MBBS, MD Psychiatry - University of Kelaniya',
      licenseNumber: 'SLMC-PSY-2024-004',
      phone: '+94 75 456 7890',
      profileImage: 'https://images.pexels.com/photos/5407762/pexels-photo-5407762.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      location: 'Negombo, Western Province',
      status: 'rejected',
      applicationDate: '2024-01-05',
      rating: 4.6,
      patientsCount: 156,
      bio: 'Expert in elderly mental health, dementia care, and age-related psychiatric disorders. Former consultant at National Hospital of Sri Lanka.',
      languages: ['Sinhala', 'English'],
      certifications: ['Geriatric Psychiatry Certification', 'Dementia Care Specialist', 'Elder Care Assessment'],
      rejectionReason: 'Incomplete documentation - missing updated SLMC registration certificate and recent CPD credits verification. Please resubmit with complete documentation.',
      rejectionEmailSent: true,
      previousRoles: [
        { hospital: 'National Hospital of Sri Lanka', position: 'Consultant Psychiatrist', duration: '2018-2023' },
        { hospital: 'Colombo North Teaching Hospital', position: 'Senior Registrar', duration: '2015-2018' }
      ],
      achievements: [
        'Pioneered geriatric psychiatry services in Western Province',
        'Published 20+ papers on dementia care',
        'Trained healthcare workers in elder care'
      ],
      salary: 'Rs. 220,000',
      reportingTo: 'Chief Medical Officer'
    },
    {
      id: '5',
      name: 'Dr. Nishanthi Perera',
      email: 'nishanthi.perera@hotmail.com',
      specialization: 'Forensic Psychiatry',
      experience: 8,
      education: 'MBBS, MD Psychiatry - University of Ruhuna',
      licenseNumber: 'SLMC-PSY-2024-005',
      phone: '+94 78 567 8901',
      profileImage: 'https://images.pexels.com/photos/5407730/pexels-photo-5407730.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      location: 'Matara, Southern Province',
      status: 'pending',
      applicationDate: '2024-01-25',
      rating: 4.5,
      patientsCount: 98,
      bio: 'Specialized in forensic psychiatry, criminal psychology, and court assessments. Works with legal system for psychiatric evaluations and expert testimony.',
      languages: ['Sinhala', 'English'],
      certifications: ['Forensic Psychiatry Certification', 'Court Assessment Training', 'Criminal Psychology'],
      previousRoles: [
        { hospital: 'Teaching Hospital Karapitiya', position: 'Forensic Psychiatrist', duration: '2020-2023' },
        { hospital: 'Base Hospital Tangalle', position: 'Medical Officer', duration: '2018-2020' }
      ],
      achievements: [
        'Provided expert testimony in 50+ legal cases',
        'Established forensic psychiatry unit in Southern Province',
        'Trained law enforcement on mental health issues'
      ],
      salary: 'Rs. 175,000',
      reportingTo: 'Judicial Medical Officer'
    }
  ]);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPsychiatrist, setSelectedPsychiatrist] = useState<Psychiatrist | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewingProfile, setViewingProfile] = useState<Psychiatrist | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'specialization' | 'experience' | 'applicationDate' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleApprove = (id: string) => {
    setPsychiatrists(prev => 
      prev.map(psychiatrist => 
        psychiatrist.id === id 
          ? { ...psychiatrist, status: 'approved' as const, rejectionReason: undefined }
          : psychiatrist
      )
    );
  };

  const handleReject = (psychiatrist: Psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist);
    setShowRejectModal(true);
  };

  const sendRejectionEmail = async (psychiatrist: Psychiatrist, reason: string) => {
    setEmailSending(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`Sending rejection email to ${psychiatrist.email}:`);
      console.log(`Subject: Psychiatrist Application Update - Sri Lanka Medical Council`);
      console.log(`Dear Dr. ${psychiatrist.name},

Thank you for your application to join our psychiatric services network.

After careful review by our medical board, we regret to inform you that we cannot approve your application at this time.

Reason for rejection:
${reason}

You may reapply once the mentioned requirements are fulfilled. Please contact our office for guidance on the application process.

Best regards,
Sri Lanka Medical Council
Psychiatric Services Division`);
      
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
    if (selectedPsychiatrist && rejectionReason.trim()) {
      const emailSuccess = await sendRejectionEmail(selectedPsychiatrist, rejectionReason.trim());
      
      setPsychiatrists(prev => 
        prev.map(psychiatrist => 
          psychiatrist.id === selectedPsychiatrist.id 
            ? { 
                ...psychiatrist, 
                status: 'rejected' as const, 
                rejectionReason: rejectionReason.trim(),
                rejectionEmailSent: emailSuccess
              }
            : psychiatrist
        )
      );
      
      setTimeout(() => {
        setShowRejectModal(false);
        setSelectedPsychiatrist(null);
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

  const getStatusColor = (status: Psychiatrist['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: Psychiatrist['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredAndSortedPsychiatrists = psychiatrists
    .filter(psychiatrist => filter === 'all' || psychiatrist.status === filter)
    .sort((a, b) => {
      let aValue: string | Date | number;
      let bValue: string | Date | number;

      switch (sortBy) {
        case 'applicationDate':
          aValue = new Date(a.applicationDate);
          bValue = new Date(b.applicationDate);
          break;
        case 'experience':
          aValue = a.experience;
          bValue = b.experience;
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
    total: psychiatrists.length,
    pending: psychiatrists.filter(p => p.status === 'pending').length,
    approved: psychiatrists.filter(p => p.status === 'approved').length,
    rejected: psychiatrists.filter(p => p.status === 'rejected').length
  };

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
              Back to Psychiatrist List
            </button>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={viewingProfile.profileImage}
                  alt={viewingProfile.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{viewingProfile.name}</h1>
                      <p className="text-xl text-blue-600 font-medium mb-1">{viewingProfile.specialization}</p>
                      <p className="text-gray-600">{viewingProfile.experience} years experience</p>
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
                      <span>Applied {new Date(viewingProfile.applicationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="w-4 h-4" />
                      <span>{viewingProfile.rating} rating ({viewingProfile.patientsCount} patients)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>License: {viewingProfile.licenseNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Education */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Education
              </h3>
              <p className="text-gray-700">{viewingProfile.education}</p>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {viewingProfile.languages.map((language, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
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
                  <p className="text-blue-600">{role.hospital}</p>
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
                  Approve Psychiatrist
                </button>
                <button
                  onClick={() => handleReject(viewingProfile)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Reject Application
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
    <div className='flex w-screen h-screen'>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>

      <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-full mx-auto px-4 py-8">
            {/* Mobile Header */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900"> Psychiatrist</h1> 
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">All</p>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                        >
                          Psychiatrist
                          {sortBy === 'name' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('specialization')}
                          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                        >
                          Specialization
                          {sortBy === 'specialization' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('experience')}
                          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                        >
                          Experience
                          {sortBy === 'experience' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('applicationDate')}
                          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                        >
                          Application Date
                          {sortBy === 'applicationDate' && (
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
                    {filteredAndSortedPsychiatrists.map((psychiatrist) => (
                      <tr key={psychiatrist.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={psychiatrist.profileImage}
                              alt={psychiatrist.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{psychiatrist.name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {psychiatrist.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{psychiatrist.specialization}</div>
                          <div className="text-sm text-gray-500">{psychiatrist.licenseNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{psychiatrist.experience} years</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            {psychiatrist.rating} ({psychiatrist.patientsCount} patients)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{psychiatrist.email}</div>
                          <div className="text-sm text-gray-500">{psychiatrist.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(psychiatrist.applicationDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(psychiatrist.status)}`}>
                            {getStatusIcon(psychiatrist.status)}
                            {psychiatrist.status.charAt(0).toUpperCase() + psychiatrist.status.slice(1)}
                          </div>
                          {psychiatrist.status === 'rejected' && psychiatrist.rejectionEmailSent && (
                            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                              <CheckCircle className="w-3 h-3" />
                              Email sent
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setViewingProfile(psychiatrist)}
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

              {filteredAndSortedPsychiatrists.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No psychiatrists found</h3>
                  <p className="text-gray-500">Try adjusting your filter to see more results.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Rejection Modal with Email Functionality */}
        {showRejectModal && selectedPsychiatrist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              {!emailSending && !emailSent && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Reject Psychiatrist Application</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    You are about to reject <strong>Dr. {selectedPsychiatrist.name}</strong>'s application. 
                    Please provide a reason for rejection. An email notification will be sent to the applicant.
                  </p>
                  
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason (e.g., incomplete documentation, missing certifications, etc.)..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={4}
                  />
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowRejectModal(false);
                        setSelectedPsychiatrist(null);
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
                  <p className="text-gray-600">Please wait while we send the rejection notification to Dr. {selectedPsychiatrist.name}...</p>
                </div>
              )}

              {emailSent && (
                <div className="text-center py-8">
                  <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Sent Successfully</h3>
                  <p className="text-gray-600">Rejection notification has been sent to Dr. {selectedPsychiatrist.name} at {selectedPsychiatrist.email}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div> 
  );
}

export default Psychiatrist;