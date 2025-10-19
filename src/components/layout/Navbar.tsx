import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import NotificationDropdown from '../ui/NotificationDropdown';
import { useNotifications } from '../../hooks/useNotifications';

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const navigate = useNavigate();
  const handleProfile = () => navigate("/admin-profile");

  const [showDropdown, setShowDropdown] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  return (
    <header className="bg-slate-200 shadow-sm border-b border-gray-100 relative z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="p-1 hover:bg-gray-100 rounded-md transition-colors lg:hidden">
            <Menu size={24} className="text-gray-700" />
          </button>

          {/* <div className="flex items-center">
            <img src="/assets/images/Sona-logo-light.png" alt="SONA" className="w-20" />
          </div> */}
        </div>

        <div className="flex items-center space-x-3 relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell size={22} className="text-gray-600" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </div>
            )}
          </button>

          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
            onClearAll={handleClearAll}
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
          />

          <button
            className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-gray-300 transition-all"
            onClick={() => handleProfile()}
          >
            <img
              src="/assets/images/profiles/th.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;