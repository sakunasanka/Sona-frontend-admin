import React from 'react'; 
import { Phone, Mail, Calendar, MapPin } from 'lucide-react';


export const clients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    emergencyContact: 'Mike Johnson',
    emergencyPhone: '+1 (555) 123-4568',
    registrationDate: '2024-01-15',
    status: 'active',
    address: '123 Main St, New York, NY 10001',
    occupation: 'Marketing Manager',
    referralSource: 'Online Search',
    notes: 'Dealing with anxiety and work-related stress. Very committed to therapy.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1978-11-22',
    emergencyContact: 'Linda Chen',
    emergencyPhone: '+1 (555) 234-5679',
    registrationDate: '2024-02-01',
    status: 'active',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    occupation: 'Software Engineer',
    referralSource: 'Friend Referral',
    notes: 'Relationship counseling with partner. Good progress in recent sessions.'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1992-07-08',
    emergencyContact: 'Carlos Rodriguez',
    emergencyPhone: '+1 (555) 345-6790',
    registrationDate: '2024-01-28',
    status: 'pending',
    address: '789 Pine St, Chicago, IL 60601',
    occupation: 'Teacher',
    referralSource: 'Doctor Referral',
    notes: 'New client, initial assessment pending.'
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.thompson@email.com',
    phone: '+1 (555) 456-7890',
    dateOfBirth: '1980-12-03',
    emergencyContact: 'Jane Thompson',
    emergencyPhone: '+1 (555) 456-7891',
    registrationDate: '2023-11-15',
    status: 'active',
    address: '321 Elm Dr, Austin, TX 78701',
    occupation: 'Accountant',
    referralSource: 'Insurance Provider',
    notes: 'Long-term client with depression. Consistent attendance and progress.'
  }
];

interface Session {
  id: string;
  clientId: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: string;
  counsellor: string;
  notes?: string;
  nextSession?: string;
  sessionNumber: number;
  totalSessions: number;
  paymentStatus: string;
  amount: number;
}

export const sessions: Session[] = [
  {
    id: '1',
    clientId: '1',
    date: '2024-12-20',
    time: '10:00 AM',
    duration: 50,
    type: 'individual',
    status: 'completed',
    counsellor: 'Dr. Patricia Williams',
    notes: 'Discussed coping strategies for work anxiety. Client showed improvement in stress management techniques.',
    nextSession: '2024-12-27',
    sessionNumber: 8,
    totalSessions: 12,
    paymentStatus: 'paid',
    amount: 120
  },
  {
    id: '2',
    clientId: '1',
    date: '2024-12-13',
    time: '10:00 AM',
    duration: 50,
    type: 'individual',
    status: 'completed',
    counsellor: 'Dr. Patricia Williams',
    notes: 'Explored triggers for anxiety attacks. Introduced mindfulness exercises.',
    sessionNumber: 7,
    totalSessions: 12,
    paymentStatus: 'paid',
    amount: 120
  },
  {
    id: '3',
    clientId: '1',
    date: '2024-12-27',
    time: '10:00 AM',
    duration: 50,
    type: 'individual',
    status: 'scheduled',
    counsellor: 'Dr. Patricia Williams',
    sessionNumber: 9,
    totalSessions: 12,
    paymentStatus: 'pending',
    amount: 120
  },
  {
    id: '4',
    clientId: '2',
    date: '2024-12-19',
    time: '2:00 PM',
    duration: 60,
    type: 'couples',
    status: 'completed',
    counsellor: 'Dr. Robert Martinez',
    notes: 'Couples session focused on communication patterns. Both partners engaged actively.',
    nextSession: '2024-12-26',
    sessionNumber: 5,
    totalSessions: 10,
    paymentStatus: 'paid',
    amount: 150
  },
  {
    id: '5',
    clientId: '2',
    date: '2024-12-26',
    time: '2:00 PM',
    duration: 60,
    type: 'couples',
    status: 'scheduled',
    counsellor: 'Dr. Robert Martinez',
    sessionNumber: 6,
    totalSessions: 10,
    paymentStatus: 'pending',
    amount: 150
  },
  {
    id: '6',
    clientId: '4',
    date: '2024-12-21',
    time: '11:00 AM',
    duration: 50,
    type: 'individual',
    status: 'completed',
    counsellor: 'Dr. Sarah Kim',
    notes: 'Significant progress in managing depressive episodes. Client reports better sleep patterns.',
    nextSession: '2024-12-28',
    sessionNumber: 15,
    totalSessions: 20,
    paymentStatus: 'paid',
    amount: 110
  }
];


interface Client {
  id: string;
  name: string;
  occupation: string;
  status: string;
  email: string;
  phone: string;
  registrationDate: string | Date;
  dateOfBirth: string;
  emergencyContact: string;
  emergencyPhone: string;
  address?: string;
  referralSource?: string;
  notes?: string;
}

interface ClientCardProps {
  client: Client;
  isSelected: boolean;
  onClick: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, isSelected, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-500 shadow-lg'
          : 'bg-white border border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {client.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
            <p className="text-sm text-gray-600">{client.occupation}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Mail size={16} className="text-gray-400" />
          <span>{client.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone size={16} className="text-gray-400" />
          <span>{client.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-gray-400" />
          <span>Registered: {new Date(client.registrationDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;