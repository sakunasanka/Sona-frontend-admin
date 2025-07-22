import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PsychiatristFilter from '../../components/ui/CounsellorFilter';
import PsychiatristTable from '../../components/ui/PsychiatristTable';
import StatusTabs from '../../components/ui/StatusTabs';
import PsychiatristReviewModal from '../../components/Modals/PsychiatristReviewModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import API from '../../api/api';

export interface Psychiatrist {
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

export interface PsychiatristFilters {
  status: 'all' | 'pending' | 'approved' | 'rejected';
  category: 'all' | 'clinical' | 'family' | 'career' | 'addiction' | 'trauma';
  experience: 'all' | 'junior' | 'mid' | 'senior';
}

const mapBackendPsychiatristToFrontend = (backendPsychiatrist: any): Psychiatrist => ({
  id: backendPsychiatrist.userId.toString(),
  name: backendPsychiatrist.user?.name || '',
  email: backendPsychiatrist.user?.email || '',
  registeredDate: '',
  category: '',
  status: (backendPsychiatrist.status || 'pending').toLowerCase() as 'pending' | 'approved' | 'rejected',
  phone: '',
  specialization: backendPsychiatrist.specialities ? backendPsychiatrist.specialities.join(', ') : '',
  experience: '',
  qualifications: [],
  bio: '',
  avatar: '',
});

const PsychiatristManagement = () => {
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([]);
  const [filteredPsychiatrists, setFilteredPsychiatrists] = useState<Psychiatrist[]>([]);
  const [selectedPsychiatrist, setSelectedPsychiatrist] = useState<Psychiatrist | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [activeFilters, setActiveFilters] = useState<PsychiatristFilters>({
    status: 'all',
    category: 'all',
    experience: 'all',
  });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    fetchPsychiatrists();
  }, []);

  useEffect(() => {
    if (Array.isArray(psychiatrists)) {
      filterPsychiatrists();
    }
  }, [searchQuery, activeFilters, activeStatus, psychiatrists]);

  const fetchPsychiatrists = async () => {
  try {
    const response = await API.get('/adminpsychiatrists'); // baseURL should already be set in api.ts
    console.log('API response:', response.data);

    if (Array.isArray(response.data.data)) {
      setPsychiatrists(response.data.data);
    } else {
      console.warn('Invalid psychiatrists data format', response.data.data);
      setPsychiatrists([]);
    }
  } catch (err) {
    if (err.response?.status === 401) {
      toast?.error?.('Unauthorized: Please sign in again');
    } else {
      toast?.error?.('Failed to fetch psychiatrists') ?? console.error('Failed to fetch psychiatrists:', err);
    }
  }
};


  const filterPsychiatrists = () => {
    if (!Array.isArray(psychiatrists)) {
      setFilteredPsychiatrists([]);
      return;
    }

    let filtered = [...psychiatrists];

    if (activeStatus !== 'all') {
      filtered = filtered.filter(p => p.status === activeStatus);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.specialization?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(p => p.category === activeFilters.category);
    }

    if (activeFilters.experience !== 'all') {
      filtered = filtered.filter(p => p.experience === activeFilters.experience);
    }

    setFilteredPsychiatrists(filtered);
  };

  const getStatusCounts = () => {
    const list = psychiatrists ?? [];
    return {
      all: list.length,
      pending: list.filter(p => p.status === 'pending').length,
      approved: list.filter(p => p.status === 'approved').length,
      rejected: list.filter(p => p.status === 'rejected').length,
    };
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters: PsychiatristFilters) => {
    setActiveFilters(filters);
  };

  const handleReview = (psychiatrist: Psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist);
    setIsReviewModalOpen(true);
  };

  const handleStatusUpdate = async (
    psychiatristId: string,
    status: 'approved' | 'rejected' | 'pending',
    comment?: string
  ) => {
    try {
      setLoading(true);
      await axios.put(`/api/adminpsychiatrists/${psychiatristId}/status`, { status, comment });
      toast.success(`Psychiatrist ${status}`);
      await fetchPsychiatrists();
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setIsReviewModalOpen(false);
      setSelectedPsychiatrist(null);
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsReviewModalOpen(false);
    setSelectedPsychiatrist(null);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 to-blue-50 flex overflow-y-auto">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="w-10/12 mx-auto overflow-auto">
        <Navbar />
        <main className="p-3 bg-white rounded-tl-3xl w-full shadow-md overflow-y-auto">
          <PsychiatristFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />
          <div className="px-6 py-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Psychiatrist Registration Management</h1>
                  <p className="text-gray-600 mt-1">
                    {filteredPsychiatrists.length} psychiatrist{filteredPsychiatrists.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-600">{getStatusCounts().pending} Pending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600">{getStatusCounts().approved} Approved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-gray-600">{getStatusCounts().rejected} Rejected</span>
                  </div>
                </div>
              </div>
              <StatusTabs
                activeStatus={activeStatus}
                onStatusChange={setActiveStatus}
                counts={getStatusCounts()}
              />
            </div>
            <PsychiatristTable
              psychiatrists={filteredPsychiatrists}
              onReview={handleReview}
            />
          </div>
        </main>
        <PsychiatristReviewModal
          psychiatrist={selectedPsychiatrist}
          isOpen={isReviewModalOpen}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
          isLoading={loading}
        />
      </main>
    </div>
  );
};

export default PsychiatristManagement;
