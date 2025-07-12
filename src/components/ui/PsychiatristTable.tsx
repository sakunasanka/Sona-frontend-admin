import React from 'react';
import { Eye, User, Mail, Phone, Calendar, FileText, Building2 } from 'lucide-react';

interface Psychiatrist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  category: string;
  registeredDate: string;
  status: 'pending' | 'approved' | 'rejected';
  experience: string;
  licenseNumber: string;
  medicalDegree: string;
  hospital: string;
}

interface PsychiatristTableProps {
  psychiatrists: Psychiatrist[];
  onReview: (id: string) => void;
}

const PsychiatristTable: React.FC<PsychiatristTableProps> = ({ psychiatrists, onReview }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'General':
        return 'bg-blue-100 text-blue-800';
      case 'Pediatric':
        return 'bg-purple-100 text-purple-800';
      case 'Forensic':
        return 'bg-red-100 text-red-800';
      case 'Addiction':
        return 'bg-orange-100 text-orange-800';
      case 'Geriatric':
        return 'bg-green-100 text-green-800';
      case 'Neurological':
        return 'bg-indigo-100 text-indigo-800';
      case 'Emergency':
        return 'bg-red-100 text-red-800';
      case 'Sleep':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (psychiatrists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No psychiatrists found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Name</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Registered Date</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>Category</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {psychiatrists.map((psychiatrist) => (
              <tr key={psychiatrist.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(psychiatrist.name)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{psychiatrist.name}</div>
                      <div className="text-sm text-gray-500">{psychiatrist.specialization}</div>
                      <div className="text-xs text-gray-400">{psychiatrist.licenseNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{psychiatrist.email}</div>
                  <div className="text-sm text-gray-500 flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{psychiatrist.phone}</span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center space-x-1 mt-1">
                    <Building2 className="w-3 h-3" />
                    <span>{psychiatrist.hospital}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(psychiatrist.registeredDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(psychiatrist.category)}`}>
                    {psychiatrist.category}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">{psychiatrist.experience} Level</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(psychiatrist.status)}`}>
                    {psychiatrist.status === 'pending' && '⏳ Pending'}
                    {psychiatrist.status === 'approved' && '✅ Approved'}
                    {psychiatrist.status === 'rejected' && '❌ Rejected'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onReview(psychiatrist.id)}
                    className="inline-flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Review</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PsychiatristTable;