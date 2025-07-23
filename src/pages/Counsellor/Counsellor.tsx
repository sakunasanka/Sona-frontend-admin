import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import CounsellorFilter from '../../components/ui/CounsellorFilter';
import CounsellorTable from '../../components/ui/CounsellorTable';
import StatusTabs from '../../components/ui/StatusTabs';
import CounsellorReviewModal from '../../components/Modals/CounsellorReviewModal'; 
import { User, Clock, CheckCircle, XCircle, Filter, Search } from 'lucide-react';

export interface Counsellor {
    id: string;
    name: string;
    email: string;
    registeredDate: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    phone?: string;
    specialization?: string;
    experience?: string;
    qualifications?: string[];
    bio?: string;
    avatar?: string;
}

export interface CounsellorFilters {
    status: 'all' | 'pending' | 'approved' | 'rejected';
    category: 'all' | 'clinical' | 'family' | 'career' | 'addiction' | 'trauma';
    experience: 'all' | 'junior' | 'mid' | 'senior';
}

// Mock data for counsellor registrations with Sri Lankan data
const mockCounsellors: Counsellor[] = [
  {
    id: '1',
    name: 'Dr. Kumari Jayawardena',
    email: 'kumari.jayawardena@gmail.com',
    phone: '+94 77 123 4567',
    registeredDate: '2024-01-15',
    category: 'clinical',
    status: 'pending',
    specialization: 'Clinical Psychology',
    experience: 'senior',
    qualifications: [
      'Ph.D. in Clinical Psychology - University of Colombo',
      'Licensed Clinical Psychologist (SLCP)',
      'Advanced Certificate in CBT - National Institute of Mental Health'
    ],
    bio: 'Senior clinical psychologist with over 15 years of experience in treating anxiety, depression, and trauma-related disorders. Specialized in cognitive behavioral therapy with extensive research in Sri Lankan mental health practices.'
  },
  {
    id: '2',
    name: 'Asanka Perera',
    email: 'asanka.perera@outlook.com',
    phone: '+94 76 234 5678',
    registeredDate: '2024-01-12',
    category: 'family',
    status: 'approved',
    specialization: 'Family Therapy',
    experience: 'mid',
    qualifications: [
      'M.A. in Family Counseling - University of Peradeniya',
      'Certified Family Therapist - Sri Lanka Association of Family Counselors',
      'Diploma in Marriage Counseling - Institute of Professional Counselors'
    ],
    bio: 'Experienced family therapist focusing on relationship dynamics in Sri Lankan families. Expertise in marriage counseling and family conflict resolution.'
  },
  {
    id: '3',
    name: 'Dr. Malini Fernando',
    email: 'malini.fernando@yahoo.com',
    phone: '+94 71 345 6789',
    registeredDate: '2024-01-10',
    category: 'career',
    status: 'rejected',
    specialization: 'Career Counseling',
    experience: 'junior',
    qualifications: [
      'M.Sc. in Career Guidance - University of Kelaniya',
      'Career Development Facilitator - National Career Development Association',
      'Professional Diploma in HR Management - IPM Sri Lanka'
    ],
    bio: 'Specializes in career guidance for young professionals and university students. Experience in conducting career development workshops across Sri Lankan universities.'
  },
  {
    id: '4',
    name: 'Dinesh Gunaratne',
    email: 'dinesh.gunaratne@gmail.com',
    phone: '+94 75 456 7890',
    registeredDate: '2024-01-08',
    category: 'addiction',
    status: 'approved',
    specialization: 'Addiction Counseling',
    experience: 'senior',
    qualifications: [
      'M.A. in Psychology - University of Sri Jayewardenepura',
      'Certified Addiction Professional - National Dangerous Drugs Control Board',
      'Advanced Certificate in Rehabilitation Counseling - NIMH Sri Lanka'
    ],
    bio: 'Leading addiction counselor with extensive experience in substance abuse treatment and rehabilitation programs across Sri Lanka. Worked with major rehabilitation centers in Colombo and Kandy.'
  },
  {
    id: '5',
    name: 'Dr. Priyanka Dissanayake',
    email: 'priyanka.dissanayake@outlook.com',
    phone: '+94 77 567 8901',
    registeredDate: '2024-01-05',
    category: 'trauma',
    status: 'pending',
    specialization: 'Trauma Therapy',
    experience: 'mid',
    qualifications: [
      'Ph.D. in Clinical Psychology - University of Colombo',
      'Certified Trauma Professional - International Association of Trauma Professionals',
      'Advanced Training in EMDR Therapy - Sri Lanka Psychological Association'
    ],
    bio: 'Specialized in trauma therapy and PTSD treatment, with particular focus on post-war trauma rehabilitation in Sri Lanka. Experienced in working with both adults and children affected by natural disasters and civil conflicts.'
  },
  {
    id: '6',
    name: 'Rohan Wijesinghe',
    email: 'rohan.wijesinghe@yahoo.com',
    phone: '+94 76 678 9012',
    registeredDate: '2024-01-03',
    category: 'clinical',
    status: 'pending',
    specialization: 'Child Psychology',
    experience: 'junior',
    qualifications: [
      'M.A. in Child Psychology - University of Ruhuna',
      'Special Education Certification - National Institute of Education',
      'Play Therapy Certificate - Sri Lanka Association of Child Psychologists'
    ],
    bio: 'Child psychologist specializing in developmental disorders and early intervention. Experience in working with schools and child development centers across Southern Province.'
  }
];

const CounsellorManagement = () => {
  const [counsellors, setCounsellors] = useState<Counsellor[]>(mockCounsellors);
  const [filteredCounsellors, setFilteredCounsellors] = useState<Counsellor[]>(mockCounsellors);
  const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [activeFilters, setActiveFilters] = useState<CounsellorFilters>({
    status: 'all',
    category: 'all',
    experience: 'all'
  });

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    filterCounsellors();
  }, [searchQuery, activeFilters, activeStatus, counsellors]);

  const filterCounsellors = () => {
    let filtered = [...counsellors];

    // Status filter from tabs
    if (activeStatus !== 'all') {
      filtered = filtered.filter(counsellor => counsellor.status === activeStatus);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(counsellor =>
        counsellor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        counsellor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        counsellor.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        counsellor.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(counsellor => counsellor.category === activeFilters.category);
    }

    // Experience filter
    if (activeFilters.experience !== 'all') {
      filtered = filtered.filter(counsellor => counsellor.experience === activeFilters.experience);
    }

    setFilteredCounsellors(filtered);
  };

  const getStatusCounts = () => {
    return {
      all: counsellors.length,
      pending: counsellors.filter(c => c.status === 'pending').length,
      approved: counsellors.filter(c => c.status === 'approved').length,
      rejected: counsellors.filter(c => c.status === 'rejected').length,
    };
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters: CounsellorFilters) => {
    setActiveFilters(filters);
  };

  const handleReview = (counsellor: Counsellor) => {
    setSelectedCounsellor(counsellor);
    setIsReviewModalOpen(true);
  };

  const handleStatusUpdate = (counsellorId: string, status: 'approved' | 'rejected' | 'pending', comment?: string) => {
    const updatedCounsellors = counsellors.map(counsellor =>
      counsellor.id === counsellorId
        ? { ...counsellor, status }
        : counsellor
    );
    setCounsellors(updatedCounsellors);
    setIsReviewModalOpen(false);
    setSelectedCounsellor(null);
    
    // Show success message (in a real app, this would be a toast notification)
    console.log(`Counsellor ${counsellorId} status updated to ${status}`, comment);
  };

  const handleCloseModal = () => {
    setIsReviewModalOpen(false);
    setSelectedCounsellor(null);
  };

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
            {/* <CounsellorFilter onSearch={handleSearch} onFilterChange={handleFilterChange} /> */}

            {/* Header */}
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Counsellors</h1>
                  <p className="text-gray-600">View and manage psychiatrist applications</p>
                </div>
                
                {/* <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-600">
                        {counsellors.filter(c => c.status === 'pending').length} Pending
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-gray-600">
                        {counsellors.filter(c => c.status === 'approved').length} Approved
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span className="text-gray-600">
                        {counsellors.filter(c => c.status === 'rejected').length} Rejected
                      </span>
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Status Tabs
              <StatusTabs
                activeStatus={activeStatus}
                onStatusChange={setActiveStatus}
                counts={getStatusCounts()}
              /> */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {/* Total Psychiatrists */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{mockCounsellors.length}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Total Counsellors</p>
                  </div>
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">10</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Busy</p>
                  </div>
                </div>
              </div>

              {/* Approved */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">7</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Online</p>
                  </div>
                </div>
              </div>

              {/* Rejected */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">4</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Offline</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Filters</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                {/* Search */}
                <div className="relative md:col-span-1 lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search psychiatrists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                {/* Category Filter */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="Clinical">Clinical</option>
                    <option value="Family">Family</option>
                    <option value="Career">Career</option>
                    <option value="Addiction">Addiction</option>
                    <option value="Trauma">Trauma</option>
                  </select>
                </div> */}

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
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

            {/* Table */}
            <CounsellorTable
              counsellors={filteredCounsellors}
              onReview={handleReview}
            />
            
          </div>

          {/* Review Modal */}
          <CounsellorReviewModal
            counsellor={selectedCounsellor}
            isOpen={isReviewModalOpen}
            onClose={handleCloseModal}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default CounsellorManagement;