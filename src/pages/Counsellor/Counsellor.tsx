import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import CounsellorFilter from '../../components/ui/CounsellorFilter';
import CounsellorTable from '../../components/ui/CounsellorTable';
import StatusTabs from '../../components/ui/StatusTabs';
import CounsellorReviewModal from '../../components/Modals/CounsellorReviewModal'; 

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

// Mock data for counsellor registrations
const mockCounsellors: Counsellor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    registeredDate: '2024-01-15',
    category: 'clinical',
    status: 'pending',
    specialization: 'Clinical Psychology',
    experience: 'senior',
    qualifications: [
      'Ph.D. in Clinical Psychology - Harvard University',
      'Licensed Clinical Psychologist (LCP)',
      'Cognitive Behavioral Therapy Certification'
    ],
    bio: 'Dr. Sarah Johnson is a licensed clinical psychologist with over 10 years of experience in treating anxiety, depression, and trauma-related disorders. She specializes in cognitive behavioral therapy and has published numerous research papers in peer-reviewed journals.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    registeredDate: '2024-01-12',
    category: 'family',
    status: 'approved',
    specialization: 'Family Therapy',
    experience: 'mid',
    qualifications: [
      'M.A. in Marriage and Family Therapy',
      'Licensed Marriage and Family Therapist (LMFT)',
      'Gottman Method Couples Therapy Training'
    ],
    bio: 'Michael Chen is a dedicated family therapist who helps couples and families navigate relationship challenges. He uses evidence-based approaches to strengthen family bonds and improve communication.'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    registeredDate: '2024-01-10',
    category: 'career',
    status: 'rejected',
    specialization: 'Career Counseling',
    experience: 'junior',
    qualifications: [
      'M.S. in Career Counseling',
      'National Certified Counselor (NCC)',
      'Career Development Facilitator Certification'
    ],
    bio: 'Dr. Emily Rodriguez specializes in helping individuals navigate career transitions, job search strategies, and professional development. She has experience working with diverse populations including recent graduates and career changers.'
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '+1 (555) 456-7890',
    registeredDate: '2024-01-08',
    category: 'addiction',
    status: 'approved',
    specialization: 'Addiction Counseling',
    experience: 'senior',
    qualifications: [
      'M.A. in Addiction Counseling',
      'Certified Addiction Counselor (CAC)',
      'Motivational Interviewing Training'
    ],
    bio: 'James Wilson is a certified addiction counselor with extensive experience in substance abuse treatment. He uses a compassionate, evidence-based approach to help individuals overcome addiction and maintain long-term recovery.'
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '+1 (555) 567-8901',
    registeredDate: '2024-01-05',
    category: 'trauma',
    status: 'pending',
    specialization: 'Trauma Therapy',
    experience: 'mid',
    qualifications: [
      'Ph.D. in Counseling Psychology',
      'EMDR Therapy Certification',
      'Trauma-Focused CBT Training'
    ],
    bio: 'Dr. Lisa Thompson specializes in trauma therapy and PTSD treatment. She has worked with veterans, survivors of abuse, and individuals who have experienced various forms of trauma. Her approach combines EMDR and trauma-focused cognitive behavioral therapy.'
  },
  {
    id: '6',
    name: 'Robert Davis',
    email: 'robert.davis@email.com',
    phone: '+1 (555) 678-9012',
    registeredDate: '2024-01-03',
    category: 'clinical',
    status: 'pending',
    specialization: 'Child Psychology',
    experience: 'junior',
    qualifications: [
      'M.A. in Child Psychology',
      'Licensed Professional Counselor (LPC)',
      'Play Therapy Certification'
    ],
    bio: 'Robert Davis is a child psychologist who works with children and adolescents facing emotional and behavioral challenges. He uses play therapy and other child-friendly approaches to help young clients express themselves and develop coping skills.'
  }
];

const CounsellorManagement = () => {
  const [counsellors, setCounsellors] = useState<Counsellor[]>(mockCounsellors);
  const [filteredCounsellors, setFilteredCounsellors] = useState<Counsellor[]>(mockCounsellors);
  const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
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
            <CounsellorFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />

            <div className="px-6 py-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Counsellor Registration Management</h1>
                    <p className="text-gray-600 mt-1">
                      {filteredCounsellors.length} counsellor{filteredCounsellors.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4 lg:mt-0">
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
                  </div>
                </div>

                {/* Status Tabs */}
                <StatusTabs
                  activeStatus={activeStatus}
                  onStatusChange={setActiveStatus}
                  counts={getStatusCounts()}
                />
              </div>
              
              {/* Table */}
              <CounsellorTable
                counsellors={filteredCounsellors}
                onReview={handleReview}
              />
            </div>
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