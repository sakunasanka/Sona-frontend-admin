import React, { useState } from 'react';
import { FileText, Plus, Download, Filter, Calendar, Eye } from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';
import CreateReport from '../Admin/CreateReport';

type Report = {
  id: string;
  title: string;
  type: 'client' | 'provider' | 'system' | 'financial';
  status: 'completed' | 'generating' | 'failed';
  createdDate: string;
  dateRange: { start: string; end: string };
  createdBy: string;
};

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Client Activity Report',
    type: 'client',
    status: 'completed',
    createdDate: '2024-06-01T10:00:00Z',
    dateRange: { start: '2024-05-01T00:00:00Z', end: '2024-05-31T23:59:59Z' },
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Provider Performance',
    type: 'provider',
    status: 'generating',
    createdDate: '2024-06-02T11:00:00Z',
    dateRange: { start: '2024-05-01T00:00:00Z', end: '2024-05-31T23:59:59Z' },
    createdBy: '2',
  },
  {
    id: '3',
    title: 'System Usage Statistics',
    type: 'system',
    status: 'completed',
    createdDate: '2024-06-03T09:30:00Z',
    dateRange: { start: '2024-05-01T00:00:00Z', end: '2024-05-31T23:59:59Z' },
    createdBy: '1',
  },
  {
    id: '4',
    title: 'Monthly Revenue Report',
    type: 'financial',
    status: 'failed',
    createdDate: '2024-06-04T14:15:00Z',
    dateRange: { start: '2024-05-01T00:00:00Z', end: '2024-05-31T23:59:59Z' },
    createdBy: '3',
  },
];

const Reports = () => {
  const [reports] = useState<Report[]>(mockReports);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'client' | 'provider' | 'system' | 'financial'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const filteredReports = reports.filter(report => 
    filterType === 'all' || report.type === filterType
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'client':
        return 'bg-blue-100 text-blue-800';
      case 'provider':
        return 'bg-purple-100 text-purple-800';
      case 'system':
        return 'bg-indigo-100 text-indigo-800';
      case 'financial':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showCreateForm) {
    return <CreateReport onCancel={() => setShowCreateForm(false)} />;
  }

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
            {/* Header and Create Button */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Report</span>
              </button>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="client">Client Reports</option>
                <option value="provider">Provider Reports</option>
                <option value="system">System Reports</option>
                <option value="financial">Financial Reports</option>
              </select>
            </div>

            {/* Reports List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                {filteredReports.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                              {report.type}
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {new Date(report.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span>Period: {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span>By: {report.createdBy === '1' ? 'John Smith' : report.createdBy === '2' ? 'Jane Doe' : 'System'}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          {report.status === 'completed' && (
                            <button className="flex items-center space-x-2 px-3 py-1 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No reports found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;