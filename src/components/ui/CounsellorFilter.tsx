import React, { useState } from 'react';
import { Search, Filter, Users, Award, Clock } from 'lucide-react';

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

interface CounsellorFilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: CounsellorFilters) => void;
}

const CounsellorFilterBar: React.FC<CounsellorFilterBarProps> = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<CounsellorFilters>({
    status: 'all',
    category: 'all',
    experience: 'all'
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterClick = (filterType: keyof CounsellorFilters, value: string) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-blue-200 shadow-sm border-b border-gray-200 px-6 py-4 m-6">
      <div className="flex items-center justify-between space-x-4">
        {/* Search Bar */}
        {/* <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search counsellors..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div> */}

        {/* Filters */}
        {/* <div className="flex items-center space-x-4"> */}
          {/* <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 font-medium">Filters:</span>
          </div> */}

          {/* Category Filter */}
          {/* <div className="flex items-center space-x-1">
            <label htmlFor="category-filter" className="sr-only">
              Category
            </label>
            <select
              id="category-filter"
              value={activeFilters.category}
              onChange={(e) => handleFilterClick('category', e.target.value)}
              className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="clinical">Clinical</option>
              <option value="family">Family</option>
              <option value="career">Career</option>
              <option value="addiction">Addiction</option>
              <option value="trauma">Trauma</option>
            </select>
          </div> */}

          {/* Experience Filter */}
          {/* <div className="flex items-center space-x-1">
            <label htmlFor="experience-filter" className="sr-only">
              Experience
            </label>
            <select
              id="experience-filter"
              value={activeFilters.experience}
              onChange={(e) => handleFilterClick('experience', e.target.value)}
              className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Experience</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default CounsellorFilterBar;