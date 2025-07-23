import React, { useState, useMemo } from 'react';
import { Mail, Phone, MapPin, Calendar, User, Search, Filter, Users } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  joinDate: string;
  avatar?: string;
  bio?: string;
}

const initialTeamData: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    position: 'Chief Technology Officer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    joinDate: 'Jan 2020',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    bio: 'Experienced technology leader with 15+ years in software development and team management.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '+1 (555) 234-5678',
    position: 'VP of Marketing',
    department: 'Marketing',
    location: 'New York, NY',
    joinDate: 'Mar 2019',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    bio: 'Strategic marketing professional focused on brand growth and customer acquisition.'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+1 (555) 345-6789',
    position: 'Head of Sales',
    department: 'Sales',
    location: 'Austin, TX',
    joinDate: 'Jul 2021',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    bio: 'Results-driven sales leader with expertise in enterprise solutions and team development.'
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.thompson@company.com',
    phone: '+1 (555) 456-7890',
    position: 'Senior Engineering Manager',
    department: 'Engineering',
    location: 'Seattle, WA',
    joinDate: 'Sep 2018',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    bio: 'Technical leader specializing in scalable architecture and agile development practices.'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    phone: '+1 (555) 567-8901',
    position: 'Director of HR',
    department: 'HR',
    location: 'Chicago, IL',
    joinDate: 'Feb 2020',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    bio: 'People-focused HR professional dedicated to building inclusive and high-performing teams.'
  },
  {
    id: '6',
    name: 'James Mitchell',
    email: 'james.mitchell@company.com',
    phone: '+1 (555) 678-9012',
    position: 'Finance Director',
    department: 'Finance',
    location: 'Boston, MA',
    joinDate: 'Nov 2019',
    avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    bio: 'Financial strategist with expertise in corporate finance and business planning.'
  },
  {
    id: '7',
    name: 'Anna Kowalski',
    email: 'anna.kowalski@company.com',
    phone: '+1 (555) 789-0123',
    position: 'Operations Manager',
    department: 'Operations',
    location: 'Denver, CO',
    joinDate: 'May 2021',
    avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    bio: 'Operations expert focused on process optimization and operational excellence.'
  },
  {
    id: '8',
    name: 'Robert Garcia',
    email: 'robert.garcia@company.com',
    phone: '+1 (555) 890-1234',
    position: 'Product Marketing Manager',
    department: 'Marketing',
    location: 'Los Angeles, CA',
    joinDate: 'Aug 2020',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    bio: 'Product marketing specialist with a passion for user experience and market research.'
  }
];

function Team() {
  const [teamData, setTeamData] = useState<TeamMember[]>(initialTeamData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const getDepartmentColor = (dept: string) => {
    const colors = {
      'Engineering': 'text-blue-600 bg-blue-50 border-blue-200',
      'Marketing': 'text-purple-600 bg-purple-50 border-purple-200',
      'Sales': 'text-green-600 bg-green-50 border-green-200',
      'HR': 'text-orange-600 bg-orange-50 border-orange-200',
      'Finance': 'text-indigo-600 bg-indigo-50 border-indigo-200',
      'Operations': 'text-teal-600 bg-teal-50 border-teal-200'
    };
    return colors[dept as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const filteredTeamMembers = useMemo(() => {
    return teamData.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [teamData, searchTerm, selectedDepartment]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Management Team</h1>
                <p className="text-gray-600">{teamData.length} active members</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all duration-200"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeamMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Users className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTeamMembers.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{member.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getDepartmentColor(member.department)}`}>
                          {member.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.joinDate}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team;