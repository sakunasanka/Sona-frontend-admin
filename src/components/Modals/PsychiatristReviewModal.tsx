import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle, XCircle, Clock, Mail, Calendar, Tag, User, Phone,
  Award, FileText, Star
} from 'lucide-react';
import API from '../../api/api';


export interface Psychiatrist {
  id: string;  // user.id
  userId: number; // psychiatrist.userId
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


interface PsychiatristReviewModalProps {
  psychiatrist: Psychiatrist | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (
    psychiatristId: string,
    status: 'approved' | 'rejected' | 'pending',
  ) => void;
  isLoading?: boolean;
}


const PsychiatristReviewModal: React.FC<PsychiatristReviewModalProps> = ({
  psychiatrist,
  isOpen,
  onClose,
  onStatusUpdate,
  isLoading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'rejected' | 'pending'>('pending');


  useEffect(() => {
    if (psychiatrist) {
      setSelectedStatus(psychiatrist.status);
    }
  }, [psychiatrist, isOpen]);


  if (!isOpen || !psychiatrist) return null;


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (!psychiatrist.userId) {
      alert("psychiatrist.userId is missing.");
      return;
    }

    const res = await API.put(`/adminpsychiatrists/${psychiatrist.userId}/status`, {
      status: selectedStatus,
    });

    if (res.status === 200) {
      onStatusUpdate(psychiatrist.userId, selectedStatus);
      onClose();
    } else {
      alert('Failed to update status');
    }
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update status. Please try again.');
  }
};



  const statusOptions = [
    {
      value: 'pending' as const,
      label: 'Pending',
      icon: Clock,
      color: 'yellow',
      description: 'Keep this application under review',
    },
    {
      value: 'approved' as const,
      label: 'Approved',
      icon: CheckCircle,
      color: 'green',
      description: 'Accept this psychiatrist registration',
    },
    {
      value: 'rejected' as const,
      label: 'Rejected',
      icon: XCircle,
      color: 'red',
      description: 'Reject this psychiatrist application',
    },
  ];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Review Psychiatrist Application</h2>
              <p className="text-sm text-gray-600">Evaluate psychiatrist registration details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>


        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="p-6">
            {/* Psychiatrist Profile */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Psychiatrist Profile</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {psychiatrist.name?.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{psychiatrist.user?.name ?? 'N/A'}</h4>
                    <p className="text-gray-600">{psychiatrist.specialization.join('') ?? 'N/A'}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{psychiatrist.experience ?? 'N/A'} Experience</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{psychiatrist.user?.email ?? 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{psychiatrist.contact_no ?? 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Registered: {psychiatrist.createdAt ? psychiatrist.createdAt.split('T')[0] : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                      {psychiatrist.category
                        ? psychiatrist.category.charAt(0).toUpperCase() + psychiatrist.category.slice(1)
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>


            {/* Qualifications */}
            {psychiatrist.qualifications?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  <span>Qualifications</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {psychiatrist.qualifications.map((qualification, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">{qualification}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span>Professional Bio</span>
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{psychiatrist.description ?? 'N/A'}</p>
              </div>
            </div>


            {/* Status Update Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Application Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedStatus === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? `border-${option.color}-300 bg-${option.color}-50 shadow-md`
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={isSelected}
                          onChange={(e) => setSelectedStatus(e.target.value as any)}
                          className="sr-only"
                          disabled={isLoading}
                        />
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className={`h-5 w-5 ${isSelected ? `text-${option.color}-600` : 'text-gray-400'}`} />
                          <span className={`font-medium ${isSelected ? `text-${option.color}-900` : 'text-gray-700'}`}>
                            {option.label}
                          </span>
                        </div>
                        <p className={`text-sm ${isSelected ? `text-${option.color}-700` : 'text-gray-500'}`}>
                          {option.description}
                        </p>
                      </label>
                    );
                  })}
                </div>
              </div>


              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Add any review notes..."
                  disabled={isLoading}
                />
              </div>


              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Update Status</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PsychiatristReviewModal;
