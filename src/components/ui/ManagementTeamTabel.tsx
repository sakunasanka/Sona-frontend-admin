import React from 'react';
import { Eye, Mail, Calendar, Tag, CheckCircle, Clock, XCircle, User, Phone, Award } from 'lucide-react';

export interface ManagementTeamMember {
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

export interface ManagementTeamFilters {
    status: 'all' | 'pending' | 'approved' | 'rejected';
    category: 'all' | 'clinical' | 'family' | 'career' | 'addiction' | 'trauma';
    experience: 'all' | 'junior' | 'mid' | 'senior';
}

interface ManagementTeamTableProps {
  counsellors: ManagementTeamMember[];
  onReview: (counsellor: ManagementTeamMember) => void;
}

const ManagementTeamTable: React.FC<ManagementTeamTableProps> = ({ counsellors, onReview }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3 w-3" />;
      case 'rejected':
        return <XCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'clinical': 'bg-purple-100 text-purple-800',
      'family': 'bg-blue-100 text-blue-800',
      'career': 'bg-green-100 text-green-800',
      'addiction': 'bg-red-100 text-red-800',
      'trauma': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Name</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Registered Date</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>Category</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {counsellors.map((counsellor, index) => (
              <tr 
                key={counsellor.id} 
                className={`hover:bg-blue-50 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <span className="text-white text-sm font-semibold">
                        {counsellor.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {counsellor.name}
                      </div>
                      {counsellor.specialization && (
                        <div className="text-xs text-gray-500 flex items-center space-x-1">
                          <Award className="h-3 w-3" />
                          <span>{counsellor.specialization}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{counsellor.email}</div>
                  {counsellor.phone && (
                    <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                      <Phone className="h-3 w-3" />
                      <span>{counsellor.phone}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{counsellor.registeredDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(counsellor.category)}`}>
                    {counsellor.category.charAt(0).toUpperCase() + counsellor.category.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(counsellor.status)}`}>
                    {getStatusIcon(counsellor.status)}
                    <span className="capitalize">{counsellor.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onReview(counsellor)}
                    className="inline-flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Review</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {counsellors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No counsellors found</h3>
          <p className="text-gray-500">No counsellor registrations match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default ManagementTeamTable;