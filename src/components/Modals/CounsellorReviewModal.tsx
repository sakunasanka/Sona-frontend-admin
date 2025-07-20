import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Clock, Mail, Calendar, Tag, User, Phone, Award, FileText, Star } from 'lucide-react';

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


interface CounsellorReviewModalProps {
  counsellor: Counsellor | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (counsellorId: string, status: 'approved' | 'rejected' | 'pending', comment?: string) => void;
}

const CounsellorReviewModal: React.FC<CounsellorReviewModalProps> = ({ 
  counsellor, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'rejected' | 'pending'>(
    counsellor?.status || 'pending'
  );
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !counsellor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onStatusUpdate(counsellor.id, selectedStatus, comment);
    setIsSubmitting(false);
    onClose();
  };

  const statusOptions = [
    {
      value: 'pending' as const,
      label: 'Pending',
      icon: Clock,
      color: 'yellow',
      description: 'Keep this application under review'
    },
    {
      value: 'approved' as const,
      label: 'Approved',
      icon: CheckCircle,
      color: 'green',
      description: 'Accept this counsellor registration'
    },
    {
      value: 'rejected' as const,
      label: 'Rejected',
      icon: XCircle,
      color: 'red',
      description: 'Reject this counsellor application'
    }
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
              <h2 className="text-xl font-semibold text-gray-900">Review Counsellor Application</h2>
              <p className="text-sm text-gray-600">Evaluate counsellor registration details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="p-6">
            {/* Counsellor Profile */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Counsellor Profile</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {counsellor.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{counsellor.name}</h4>
                    <p className="text-gray-600">{counsellor.specialization}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{counsellor.experience} Experience</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{counsellor.email}</span>
                  </div>
                  {counsellor.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{counsellor.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Registered: {counsellor.registeredDate}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                      {counsellor.category.charAt(0).toUpperCase() + counsellor.category.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Qualifications */}
            {counsellor.qualifications && counsellor.qualifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  <span>Qualifications</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {counsellor.qualifications.map((qualification, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">{qualification}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {counsellor.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <span>Professional Bio</span>
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{counsellor.bio}</p>
                </div>
              </div>
            )}

            {/* Status Selection */}
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
                        />
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className={`h-5 w-5 ${
                            isSelected ? `text-${option.color}-600` : 'text-gray-400'
                          }`} />
                          <span className={`font-medium ${
                            isSelected ? `text-${option.color}-900` : 'text-gray-700'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          isSelected ? `text-${option.color}-700` : 'text-gray-500'
                        }`}>
                          {option.description}
                        </p>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add any notes about this application review..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-top-transparent"></div>
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

export default CounsellorReviewModal;