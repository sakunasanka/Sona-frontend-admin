import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export interface ManagementTeamMember {
    id: string;
    name: string;
    email: string;
    joinedDate: string;
    role: string;
    status: 'active' | 'inactive' | 'on_leave';
    phone?: string;
    department?: string;
    bio?: string;
    avatar?: string;
}

export interface ManagementTeamFilters {
    status: 'all' | 'active' | 'inactive' | 'on_leave';
    department: 'all' | 'hr' | 'finance' | 'operations' | 'it' | 'marketing';
    role: 'all' | 'manager' | 'lead' | 'director' | 'executive';
}

interface ManagementTeamFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: ManagementTeamFilters) => void;
}

const ManagementTeamFilter : React.FC<ManagementTeamFilterProps> = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ManagementTeamFilters>({
    status: 'all',
    department: 'all',
    role: 'all'
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterClick = (filterType: keyof ManagementTeamFilters, value: string) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-red-200 shadow-sm border-b border-gray-200 px-6 py-4 m-6">
      <div className="flex items-center justify-between space-x-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search management team..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 font-medium">Filters:</span>
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-1">
            <label htmlFor="department-filter" className="sr-only">
              Department
            </label>
            <select
              id="department-filter"
              value={activeFilters.department}
              onChange={(e) => handleFilterClick('department', e.target.value)}
              className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="it">IT</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-1">
            <label htmlFor="role-filter" className="sr-only">
              Role
            </label>
            <select
              id="role-filter"
              value={activeFilters.role}
              onChange={(e) => handleFilterClick('role', e.target.value)}
              className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="manager">Manager</option>
              <option value="lead">Lead</option>
              <option value="director">Director</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1">
            <label htmlFor="status-filter" className="sr-only">
              Status
            </label>
            <select
              id="status-filter"
              value={activeFilters.status}
              onChange={(e) => handleFilterClick('status', e.target.value)}
              className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementTeamFilter ;