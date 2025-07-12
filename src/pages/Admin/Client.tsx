import React, { useState } from 'react';
import  Sidebar  from '../../components/layout/Sidebar';
import { 
  User, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin,
  ArrowLeft,
  CheckCircle, 
  AlertCircle,
  Star,
  Heart,
  Brain, 
  FileText,
  Video,
  Users,
  Search,
  Filter,
  
} from 'lucide-react';

interface Session {
  id: string;
  date: string;
  time: string;
  duration: number;
  type: 'individual' | 'group' | 'family' | 'assessment';
  counselor: string;
  status: 'completed' | 'scheduled' | 'cancelled';
  notes: string;
  mood: number; // 1-5 scale
  progress: string;
  sessionFormat: 'in-person' | 'video' | 'phone';
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  startDate: string;
  primaryCounselor: string;
  goals: string[];
  currentMood: number;
  avatar: string;
  status: 'active' | 'inactive' | 'on-hold';
  totalSessions: number;
  lastSession: string;
  nextSession?: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Wellness Ave, Peaceful City, PC 12345',
    emergencyContact: {
      name: 'Michael Johnson',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse'
    },
    startDate: '2024-01-15',
    primaryCounselor: 'Dr. Emily Chen',
    goals: [
      'Manage anxiety and stress',
      'Improve communication skills',
      'Develop healthy coping strategies',
      'Build self-confidence'
    ],
    currentMood: 4,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: 'active',
    totalSessions: 8,
    lastSession: '2024-03-08',
    nextSession: '2024-03-15'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1985-08-22',
    address: '456 Harmony St, Serene Town, ST 67890',
    emergencyContact: {
      name: 'Maria Rodriguez',
      phone: '+1 (555) 876-5432',
      relationship: 'Sister'
    },
    startDate: '2023-11-20',
    primaryCounselor: 'Dr. James Wilson',
    goals: [
      'Overcome depression',
      'Improve work-life balance',
      'Strengthen relationships'
    ],
    currentMood: 3,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: 'active',
    totalSessions: 12,
    lastSession: '2024-03-10',
    nextSession: '2024-03-17'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1992-12-03',
    address: '789 Tranquil Rd, Calm City, CC 13579',
    emergencyContact: {
      name: 'Robert Davis',
      phone: '+1 (555) 765-4321',
      relationship: 'Father'
    },
    startDate: '2024-02-01',
    primaryCounselor: 'Dr. Sarah Thompson',
    goals: [
      'Manage PTSD symptoms',
      'Improve sleep quality',
      'Build trust in relationships'
    ],
    currentMood: 2,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: 'active',
    totalSessions: 6,
    lastSession: '2024-03-05',
    nextSession: '2024-03-12'
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.thompson@email.com',
    phone: '+1 (555) 456-7890',
    dateOfBirth: '1988-04-18',
    address: '321 Peace Blvd, Quiet Village, QV 24680',
    emergencyContact: {
      name: 'Lisa Thompson',
      phone: '+1 (555) 654-3210',
      relationship: 'Wife'
    },
    startDate: '2023-09-10',
    primaryCounselor: 'Dr. Emily Chen',
    goals: [
      'Anger management',
      'Improve family relationships',
      'Develop emotional regulation'
    ],
    currentMood: 3,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: 'on-hold',
    totalSessions: 15,
    lastSession: '2024-02-28'
  },
  {
    id: '5',
    name: 'Jessica Wilson',
    email: 'jessica.wilson@email.com',
    phone: '+1 (555) 567-8901',
    dateOfBirth: '1995-07-11',
    address: '654 Mindful Ave, Zen City, ZC 97531',
    emergencyContact: {
      name: 'Mark Wilson',
      phone: '+1 (555) 543-2109',
      relationship: 'Brother'
    },
    startDate: '2024-01-08',
    primaryCounselor: 'Dr. James Wilson',
    goals: [
      'Overcome social anxiety',
      'Build self-esteem',
      'Improve public speaking confidence'
    ],
    currentMood: 4,
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: 'active',
    totalSessions: 7,
    lastSession: '2024-03-07',
    nextSession: '2024-03-14'
  }
];

const mockSessions: { [clientId: string]: Session[] } = {
  '1': [
    {
      id: '1',
      date: '2024-03-15',
      time: '10:00 AM',
      duration: 50,
      type: 'individual',
      counselor: 'Dr. Emily Chen',
      status: 'scheduled',
      notes: 'Focus on anxiety management techniques and homework review.',
      mood: 0,
      progress: '',
      sessionFormat: 'in-person'
    },
    {
      id: '2',
      date: '2024-03-08',
      time: '10:00 AM',
      duration: 50,
      type: 'individual',
      counselor: 'Dr. Emily Chen',
      status: 'completed',
      notes: 'Discussed recent stressors at work. Practiced breathing exercises and introduced progressive muscle relaxation. Client showed good engagement and understanding.',
      mood: 4,
      progress: 'Made significant progress with breathing techniques. Client reported feeling more in control during stressful situations.',
      sessionFormat: 'in-person'
    },
    {
      id: '3',
      date: '2024-03-01',
      time: '2:00 PM',
      duration: 50,
      type: 'individual',
      counselor: 'Dr. Emily Chen',
      status: 'completed',
      notes: 'Explored childhood experiences and their impact on current anxiety patterns. Assigned journaling homework to track triggers.',
      mood: 3,
      progress: 'Good insight into anxiety triggers. Client is becoming more self-aware of patterns.',
      sessionFormat: 'video'
    }
  ],
  '2': [
    {
      id: '4',
      date: '2024-03-17',
      time: '2:00 PM',
      duration: 50,
      type: 'individual',
      counselor: 'Dr. James Wilson',
      status: 'scheduled',
      notes: 'Continue work on depression management and coping strategies.',
      mood: 0,
      progress: '',
      sessionFormat: 'in-person'
    },
    {
      id: '5',
      date: '2024-03-10',
      time: '2:00 PM',
      duration: 50,
      type: 'individual',
      counselor: 'Dr. James Wilson',
      status: 'completed',
      notes: 'Discussed medication compliance and side effects. Worked on cognitive restructuring techniques for negative thought patterns.',
      mood: 3,
      progress: 'Client showing improvement in mood stability. Better adherence to treatment plan.',
      sessionFormat: 'in-person'
    }
  ],
  '3': [
    {
      id: '6',
      date: '2024-03-12',
      time: '11:00 AM',
      duration: 50,
      type: 'individual',
      counselor: 'Dr. Sarah Thompson',
      status: 'scheduled',
      notes: 'EMDR session for trauma processing.',
      mood: 0,
      progress: '',
      sessionFormat: 'in-person'
    },
    {
      id: '7',
      date: '2024-03-05',
      time: '11:00 AM',
      duration: 50,
      type: 'individual',
      counselor: 'Dr. Sarah Thompson',
      status: 'completed',
      notes: 'Continued trauma-focused therapy. Client reported fewer nightmares this week. Practiced grounding techniques.',
      mood: 2,
      progress: 'Gradual improvement in sleep quality. Client is developing better coping mechanisms.',
      sessionFormat: 'in-person'
    }
  ]
};

function Client() {
  const [currentView, setCurrentView] = useState<'clients' | 'client-detail'>('clients');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'on-hold'>('all');

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.primaryCounselor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual':
        return <User className="w-4 h-4" />;
      case 'group':
        return <Users className="w-4 h-4" />;
      case 'family':
        return <Heart className="w-4 h-4" />;
      case 'assessment':
        return <FileText className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-600" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-green-600" />;
      case 'in-person':
        return <MapPin className="w-4 h-4 text-purple-600" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderMoodStars = (mood: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < mood ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setCurrentView('client-detail');
  };

  const renderClientsList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">View and monitor all client information and sessions</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients by name, email, or counselor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-blue-600">{mockClients.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-green-600">
                {mockClients.filter(c => c.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Hold</p>
              <p className="text-2xl font-bold text-yellow-600">
                {mockClients.filter(c => c.status === 'on-hold').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-purple-600">
                {mockClients.reduce((sum, client) => sum + client.totalSessions, 0)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Clients ({filteredClients.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Counselor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mood
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">
                          Started {formatDate(client.startDate)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.primaryCounselor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.totalSessions}</div>
                    {client.nextSession && (
                      <div className="text-xs text-blue-600">
                        Next: {formatDate(client.nextSession)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(client.lastSession)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {renderMoodStars(client.currentMood)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewClient(client)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderClientDetail = () => {
    if (!selectedClient) return null;

    const clientSessions = mockSessions[selectedClient.id] || [];
    const completedSessions = clientSessions.filter(s => s.status === 'completed');
    const upcomingSessions = clientSessions.filter(s => s.status === 'scheduled');
    const averageMood = completedSessions.length > 0 
      ? completedSessions.reduce((sum, s) => sum + s.mood, 0) / completedSessions.length 
      : 0;

    return (
      <div className="space-y-6 w-10/12 h-sreen  overflow-y-auto">
        {/* Header */}
        <div className="flex items-center ">
          <div className="flex items-center space-x-4"> 
            <button
              onClick={() => setCurrentView('clients')}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors "
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Details</h1>
              <p className="text-gray-600 mt-1">Complete client information and session history</p>
            </div>
          </div>
        </div>

        {/* Client Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 ">
          <div className="flex items-start space-x-6 mb-8">
            <img
              src={selectedClient.avatar}
              alt={selectedClient.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedClient.name}</h2>
                  <p className="text-gray-600">Client since {formatDate(selectedClient.startDate)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClient.status)}`}>
                  {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Contact Information</h3>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedClient.phone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Primary Counselor</h3>
                  <p className="text-sm text-gray-700">{selectedClient.primaryCounselor}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Current Mood</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderMoodStars(selectedClient.currentMood)}
                    </div>
                    <span className="text-sm text-gray-600">({selectedClient.currentMood}/5)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{selectedClient.totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{completedSessions.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{upcomingSessions.length}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{averageMood.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Mood</div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Date of Birth:</span>
                  <span className="ml-2 text-sm text-gray-700">{formatDate(selectedClient.dateOfBirth)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Address:</span>
                  <span className="ml-2 text-sm text-gray-700">{selectedClient.address}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <span className="ml-2 text-sm text-gray-700">{selectedClient.emergencyContact.name}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Phone:</span>
                  <span className="ml-2 text-sm text-gray-700">{selectedClient.emergencyContact.phone}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Relationship:</span>
                  <span className="ml-2 text-sm text-gray-700">{selectedClient.emergencyContact.relationship}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Treatment Goals */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Treatment Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedClient.goals.map((goal, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Session History */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Session History</h3>
          <div className="space-y-6">
            {clientSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      {getTypeIcon(session.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {session.type} Session
                      </h4>
                      <p className="text-sm text-gray-600">with {session.counselor}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{session.time} • {session.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getFormatIcon(session.sessionFormat)}
                    <span className="text-sm text-gray-700 capitalize">{session.sessionFormat}</span>
                  </div>
                </div>

                {session.status === 'completed' && session.mood > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600">Session Mood:</span>
                      <div className="flex items-center space-x-1">
                        {renderMoodStars(session.mood)}
                      </div>
                      <span className="text-sm text-gray-600">({session.mood}/5)</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-1">Session Notes</h5>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">{session.notes}</p>
                  </div>
                  
                  {session.progress && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Progress & Insights</h5>
                      <p className="text-sm text-gray-700 bg-green-50 rounded p-3">{session.progress}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
   const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className='flex h-screen'>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
    <div className=" w-10/12 h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 py-8">
        {currentView === 'clients' && renderClientsList()}
        {currentView === 'client-detail' && renderClientDetail()}
      </main>
    </div>
    </div>
  );
}

export default Client;