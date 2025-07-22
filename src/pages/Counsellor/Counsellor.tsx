//Counsellor.tsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import CounsellorFilter  from '../../components/ui/CounsellorFilter';
import CounsellorTable from '../../components/ui/CounsellorTable';
import StatusTabs from '../../components/ui/StatusTabs';
import CounsellorReviewModal from '../../components/Modals/CounsellorReviewModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import API from '../../api/api';


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






// Helper to map backend data shape to frontend interface
const mapBackendCounsellorToFrontend = (backendCounsellor: any): Counsellor => ({
  id: backendCounsellor.userId.toString(),
  name: backendCounsellor.user?.name || '',
  email: backendCounsellor.user?.email || '',
  registeredDate: '', // Not provided by backend - add if available
  category: '',       // Not provided by backend - add if available
  status: (backendCounsellor.status || 'pending').toLowerCase() as 'pending' | 'approved' | 'rejected',
  phone: '',          // Not provided by backend
  specialization: backendCounsellor.specialities ? backendCounsellor.specialities.join(', ') : '',
  experience: '',     // Not provided by backend
  qualifications: [], // Not provided by backend
  bio: '',            // Not provided by backend
  avatar: '',         // Not provided by backend
});


const CounsellorManagement = () => {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [filteredCounsellors, setFilteredCounsellors] = useState<Counsellor[]>([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [activeFilters, setActiveFilters] = useState<CounsellorFilters>({
    status: 'all',
    category: 'all',
    experience: 'all'
  });
  const [loading, setLoading] = useState(false);


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);


  useEffect(() => {
    fetchCounsellors();
  }, []);


  useEffect(() => {
    if (Array.isArray(counsellors)) {
      filterCounsellors();
    }
  }, [searchQuery, activeFilters, activeStatus, counsellors]);


const fetchCounsellors = async () => {
  try {
    const response = await API.get('/admincounsellors'); // baseURL should already be set in api.ts
    console.log('API response:', response.data);


    if (Array.isArray(response.data.data)) {
      setCounsellors(response.data.data);
    } else {
      console.warn('Invalid counsellors data format', response.data.data);
      setCounsellors([]);
    }
  } catch (err) {
    if (err.response?.status === 401) {
      toast?.error?.('Unauthorized: Please sign in again');
    } else {
      toast?.error?.('Failed to fetch counsellors') ?? console.error('Failed to fetch counsellors:', err);
    }
  }
};








  const filterCounsellors = () => {
    if (!Array.isArray(counsellors)) {
      setFilteredCounsellors([]);
      return;
    }


    let filtered = [...counsellors];


    if (activeStatus !== 'all') {
      filtered = filtered.filter(c => c.status === activeStatus);
    }


    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.specialization?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }


    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(c => c.category === activeFilters.category);
    }


    if (activeFilters.experience !== 'all') {
      filtered = filtered.filter(c => c.experience === activeFilters.experience);
    }


    setFilteredCounsellors(filtered);
  };


  const getStatusCounts = () => {
    const list = counsellors ?? [];
    return {
      all: list.length,
      pending: list.filter(c => c.status === 'pending').length,
      approved: list.filter(c => c.status === 'approved').length,
      rejected: list.filter(c => c.status === 'rejected').length,
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


  const handleStatusUpdate = async (counsellorId: string, status: 'approved' | 'rejected' | 'pending', comment?: string) => {
    try {
      setLoading(true);
      await axios.put(`/api/admincounsellors/${counsellorId}/status`, { status, comment });
      toast.success(`Counsellor ${status}`);
      await fetchCounsellors();
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setIsReviewModalOpen(false);
      setSelectedCounsellor(null);
      setLoading(false);
    }
  };


  const handleCloseModal = () => {
    setIsReviewModalOpen(false);
    setSelectedCounsellor(null);
  };


  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 to-blue-50 flex overflow-y-auto">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="w-10/12 mx-auto overflow-auto">
        <Navbar />
        <main className="p-3  bg-white rounded-tl-3xl w-full shadow-md overflow-y-auto">
          <CounsellorFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />
          <div className="px-6 py-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Counsellor Registration Management</h1>
                  <p className="text-gray-600 mt-1">
                    {filteredCounsellors.length} counsellor{filteredCounsellors.length !== 1 ? 's' : ''} found
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
            <CounsellorTable
              counsellors={filteredCounsellors}
              onReview={handleReview}
            />
          </div>
        </main>
        <CounsellorReviewModal
          counsellor={selectedCounsellor}
          isOpen={isReviewModalOpen}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
          isLoading={loading}
        />
      </main>
    </div>
  );
};


export default CounsellorManagement;
