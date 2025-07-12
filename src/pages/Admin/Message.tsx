import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

const Message = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'online', unreadCount: 2 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'offline', unreadCount: 0 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'online', unreadCount: 1 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'away', unreadCount: 3 },
    { id: 5, name: 'David Brown', email: 'david@example.com', status: 'online', unreadCount: 0 }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, userId: 1, content: 'Welcome to our platform!', sender: 'Admin', timestamp: '2024-01-15T10:30:00Z', read: false, type: 'sent' },
    { id: 2, userId: 1, content: 'Thank you for the welcome message!', sender: 'John Doe', timestamp: '2024-01-15T10:35:00Z', read: true, type: 'received' },
    { id: 3, userId: 3, content: 'Your account has been verified successfully.', sender: 'Admin', timestamp: '2024-01-15T11:00:00Z', read: false, type: 'sent' },
    { id: 4, userId: 4, content: 'Please update your profile information.', sender: 'Admin', timestamp: '2024-01-15T11:15:00Z', read: false, type: 'sent' },
    { id: 5, userId: 4, content: 'I have some questions about my account.', sender: 'Sarah Wilson', timestamp: '2024-01-15T11:20:00Z', read: true, type: 'received' },
    { id: 6, userId: 4, content: 'Can you help me with billing issues?', sender: 'Sarah Wilson', timestamp: '2024-01-15T11:25:00Z', read: false, type: 'received' }
  ]);

  type User = {
    id: number;
    name: string;
    email: string;
    status: string;
    unreadCount: number;
  };
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  type Notification = {
    id: number;
    message: string;
    type: string;
    timestamp: number;
  };
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type = 'success') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: Date.now()
    };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getUserMessages = (userId: number) => {
    return messages.filter(msg => msg.userId === userId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message = {
      id: Date.now(),
      userId: selectedUser.id,
      content: newMessage,
      sender: 'Admin',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    addNotification(`Message sent to ${selectedUser.name}`);
  };

  const markAsRead = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const deleteMessage = (messageId: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    addNotification('Message deleted', 'info');
  };

  const formatTime = (timestamp: string | number) => {
    return new Date(timestamp).toLocaleString([], { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getUnreadCount = (userId: number) => {
    return messages.filter(msg => msg.userId === userId && msg.type === 'received' && !msg.read).length;
  };

  useEffect(() => {
    // Update unread counts for users
    setUsers(prev => prev.map(user => ({
      ...user,
      unreadCount: getUnreadCount(user.id)
    })));
  }, [messages]);

  // Sidebar state and handler
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (

    <div className="  bg-slate-100 flex h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-2 rounded-lg shadow-lg animate-pulse transform transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <div className="w-9/12 mx-auto h-[95vh] mt-4 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex border border-white/20">
        {/* Sidebar - Users List */}
        <div className="w-1/3 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-red-400 text-white p-6">
            <h1 className="text-2xl font-bold mb-4">Message Center</h1>
            
            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Search users..."
              />
              <svg className="absolute right-3 top-2.5 w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all" className="text-gray-800">All Users</option>
              <option value="online" className="text-gray-800">Online</option>
              <option value="away" className="text-gray-800">Away</option>
              <option value="offline" className="text-gray-800">Offline</option>
            </select>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                  selectedUser?.id === user.id
                    ? 'bg-pink-50 border-pink-200 shadow-md'
                    : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {user.unreadCount > 0 && (
                    <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {user.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Messages */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(selectedUser.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedUser.name}</h2>
                      <p className="text-gray-500">{selectedUser.email} • {selectedUser.status}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {getUserMessages(selectedUser.id).length} messages
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {getUserMessages(selectedUser.id).map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl ${
                      message.type === 'sent'
                        ? 'bg-pink-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    } rounded-2xl px-5 py-4 shadow-md relative group`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{message.sender}</span>
                        <div className="flex items-center space-x-2">
                          {!message.read && message.type === 'received' && (
                            <button
                              onClick={() => markAsRead(message.id)}
                              className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full hover:bg-pink-200 transition-colors"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs opacity-75">{formatTime(message.timestamp)}</span>
                        {message.type === 'received' && (
                          <div className={`w-2 h-2 rounded-full ${message.read ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-white p-6">
                <div className="flex space-x-4">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1 border-2 border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 resize-none transition-all duration-200"
                    placeholder={`Send a message to ${selectedUser.name}...`}
                    rows={3}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send</span>
                  </button>
                </div>

                {/* Quick Messages */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Thank you for your message!",
                    "We've received your request.",
                    "Your issue has been resolved.",
                    "Please check your email for updates."
                  ].map((quickMsg, index) => (
                    <button
                      key={index}
                      onClick={() => setNewMessage(quickMsg)}
                      className="bg-pink-50 hover:bg-pink-100 text-pink-700 px-3 py-1 rounded-lg text-sm transition-all duration-200 border border-pink-200 hover:border-pink-300"
                    >
                      {quickMsg}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
              <div className="text-center text-gray-500">
                <div className="text-8xl mb-6">💬</div>
                <h3 className="text-2xl font-semibold mb-2">Select a User</h3>
                <p className="text-lg text-gray-400">Choose a user from the list to view and send messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;