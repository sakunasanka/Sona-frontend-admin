import React, { useState } from 'react';
import { User, Lock, Edit3, Camera, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar'; // Adjust the path as needed to your Sidebar component
import Navbar from '../../components/layout/Navbar'; // Adjust the path as needed to your Navbar component

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
 // permissions: string[];
}

const AdminProfile: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'edit' | 'password'>('profile');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [profile, setProfile] = useState<AdminProfileData>({
    id: 'ADM001',
    name: 'Abheeth Tilakaratna',
    email: 'Abheeth.sona@company.com',
    phone: '0112 245 145',
    location: 'Colombo, SL',
    joinDate: '2023-01-15',
    role: 'Senior Administrator', 
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    lastLogin: '2024-01-15 14:30:00',
    //permissions: ['User Management', 'System Settings', 'Reports', 'Security', 'Backup Management']
  });

  const [editForm, setEditForm] = useState(profile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    setActiveTab('profile');
    setShowEditSuccess(true);
    setTimeout(() => setShowEditSuccess(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setActiveTab('profile');
    setShowPasswordSuccess(true);
    setTimeout(() => setShowPasswordSuccess(false), 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        setProfile(prev => ({ ...prev, profilePicture: newImageUrl }));
        setEditForm(prev => ({ ...prev, profilePicture: newImageUrl }));
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className=" h-screen bg-gradient-to-br from-slate-50 to-blue-50  flex">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>

    
      <div className="w-10/12 mx-auto">

        <Navbar onMenuClick={() => { /* handle menu click here if needed */ }} />

        {/* Success Messages */}
        {showEditSuccess && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <Save className="w-5 h-5" />
              <span>Profile updated successfully!</span>
            </div>
          </div>
        )}
        {showPasswordSuccess && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Password changed successfully!</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden m-4">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                  <img 
                    src={profile.profilePicture} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => setShowImageUpload(true)}
                  className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                <p className="text-xl text-gray-600 mb-1">{profile.role}</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'profile' 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'edit' 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'password' 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 m-4">
          {/* Profile Details */}
          {activeTab === 'profile' && (
            <>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold">{profile.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold">{profile.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-3 rounded-full">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Join Date</p>
                        <p className="font-semibold">{new Date(profile.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Admin ID</p>
                      <p className="font-semibold text-lg">{profile.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Role</p>
                      <p className="font-semibold text-lg">{profile.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Last Login</p>
                      <p className="font-semibold text-lg">{new Date(profile.lastLogin).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Permissions</h2>
                  <div className="space-y-3">
                    {profile.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
            </>
          )}

            {/* Edit Profile Form */}
            {activeTab === 'edit' && (
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input
                          type="text"
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(true)}
                        className="px-6 py-3 bg-red-500 text-white hover:text-gray-900 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </div>
                {/* Confirmation Modal for Save */}
                {showEditConfirm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in">
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
                          className="px-6 py-2 rounded-lg bg-red-500 text-gray-700 hover:bg-gray-200 transition "
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            setShowEditConfirm(false);
                            handleProfileUpdate(e as any);
                          }}
                          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Confirmation Modal for Cancel */}
                {showCancelConfirm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in">
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
                          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
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
            )}

          {/* Change Password Form */}
          {activeTab === 'password' && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('profile')}
                     className="px-6 py-3 bg-red-500 text-white hover:text-gray-900 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Change Profile Picture</h3>
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
                <p className="text-sm text-gray-500">
                  Choose a JPG, PNG, or GIF image. Maximum file size is 5MB.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;