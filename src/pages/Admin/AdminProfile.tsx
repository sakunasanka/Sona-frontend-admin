import React, { useState, useEffect } from 'react';
import { User, Lock, Edit3, Camera, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';
import API from '../../api/api';

interface AdminProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  role: string; 
  profilePicture: string;
  lastLogin: string;
}

const AdminProfile: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'edit' | 'password'>('profile');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [profile, setProfile] = useState<AdminProfileData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    joinDate: '',
    role: '',
    profilePicture: 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png',
    lastLogin: '',
  });

  const [editForm, setEditForm] = useState(profile);

  // Fetch admin profile on component mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin-profile/profile');
      if (response.data.success) {
        setProfile(response.data.data);
        setEditForm(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin profile:', error);
      // You might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await API.put('/admin-profile/profile', editForm);
      if (response.data.success) {
        setProfile(response.data.data);
        setActiveTab('profile');
        setShowEditSuccess(true);
        setTimeout(() => setShowEditSuccess(false), 2500);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Handle error (show error message)
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB.');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setSaving(true);
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'admin_images');

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;

            // Send the Cloudinary URL to backend
      const response = await API.put('/admin-profile/profile/picture', {
        profilePicture: imageUrl
      });

      if (response.data.success) {
        setProfile(response.data.data);
        setEditForm(response.data.data);
        setShowImageUpload(false);
        setSelectedFile(null);
        setImagePreview(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      alert(`Failed to upload profile picture: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={toggleSidebar} profilePicture={profile.profilePicture} />
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Loading profile...</div>
            </div>
          </div>
        </div>
      </div>
    );
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
            {/* Success Messages */}
            {showEditSuccess && (
              <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>Profile updated successfully!</span>
                </div>
              </div>
            )}

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-slate-600 to-slate-800"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                      <img 
                        src={profile.profilePicture || 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png'} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button 
                      onClick={() => setShowImageUpload(true)}
                      className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    <p className="text-lg text-gray-600 mb-1">{profile.role}</p>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-all ${
                      activeTab === 'profile' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-all ${
                      activeTab === 'edit' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 gap-6">
              {/* Profile View */}
              {activeTab === 'profile' && (
                <>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-semibold">{profile.email}</p>
                        </div>
                      </div>
                      {profile.phone && (
                        <div className="flex items-start gap-4">
                          <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                            <Phone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-semibold">{profile.phone}</p>
                          </div>
                        </div>
                      )}
                      {profile.location && (
                        <div className="flex items-start gap-4">
                          <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                            <MapPin className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-semibold">{profile.location}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-xl flex-shrink-0">
                          <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Join Date</p>
                          <p className="font-semibold">{new Date(profile.joinDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-3 rounded-xl flex-shrink-0">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Admin ID</p>
                          <p className="font-semibold">{profile.id}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-3 rounded-xl flex-shrink-0">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Role</p>
                          <p className="font-semibold">{profile.role}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-3 rounded-xl flex-shrink-0">
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Login</p>
                          <p className="font-semibold">{new Date(profile.lastLogin).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Edit Profile */}
              {activeTab === 'edit' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setShowEditConfirm(true);
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                        />
                      </div>
                      {/* Only show phone field for MT-Team members */}
                      {(profile.role.includes('MT-Team') || profile.role.includes('MT Team')) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      )}
                      {/* Only show location field for MT-Team members */}
                      {(profile.role.includes('MT-Team') || profile.role.includes('MT Team')) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input
                          type="text"
                          value={editForm.role}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(true)}
                        className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Modal */}
          {showImageUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Change Profile Picture</h3>
                  <button
                    onClick={() => {
                      setShowImageUpload(false);
                      setSelectedFile(null);
                      setImagePreview(null);
                      // Reset file input
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      />
                    </div>
                  )}

                  <label className="block">
                    <span className="sr-only">Choose profile photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </label>
                  <p className="text-sm text-gray-500">
                    Choose a JPG, PNG, or GIF image. Maximum file size is 5MB.
                  </p>

                  {/* Update Button */}
                  {selectedFile && (
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview(null);
                          // Reset file input
                          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
                        disabled={saving}
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleImageUpload}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Uploading...' : 'Update Picture'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Edit Confirmation Modal */}
          {showEditConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 text-center">
                <div className="mb-4">
                  <Edit3 className="w-10 h-10 mx-auto text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Save Profile Changes?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to save the changes to your profile?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowEditConfirm(false)}
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      setShowEditConfirm(false);
                      handleProfileUpdate(e as any);
                    }}
                    disabled={saving}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Confirmation Modal */}
          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 text-center">
                <div className="mb-4">
                  <X className="w-10 h-10 mx-auto text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Cancel Editing?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to cancel? Unsaved changes will be lost.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    No
                  </button>
                  <button
                    onClick={() => {
                      setShowCancelConfirm(false);
                      setActiveTab('profile');
                      setEditForm(profile);
                    }}
                    className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;