import React from 'react';
import { CheckCircle, Clock, XCircle, Users } from 'lucide-react';

interface  StatusTabsProps {
  activeStatus: 'all' | 'pending' | 'approved' | 'rejected';
  onStatusChange: (status: 'all' | 'pending' | 'approved' | 'rejected') => void;
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const  StatusTabs: React.FC<StatusTabsProps> = ({ activeStatus, onStatusChange, counts }) => {
  const tabs = [
    {
      key: 'all' as const,
      label: 'All',
      icon: Users,
      color: 'indigo',
      count: counts.all
    },
    {
      key: 'pending' as const,
      label: 'Pending',
      icon: Clock,
      color: 'yellow',
      count: counts.pending
    },
    {
      key: 'approved' as const,
      label: 'Approved',
      icon: CheckCircle,
      color: 'green',
      count: counts.approved
    },
    {
      key: 'rejected' as const,
      label: 'Rejected',
      icon: XCircle,
      color: 'red',
      count: counts.rejected
    }
  ];

  const getTabStyles = (tabKey: string, color: string) => {
    const isActive = activeStatus === tabKey;
    
    const colorStyles = {
      indigo: isActive 
        ? 'bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm' 
        : 'bg-white text-gray-600 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600',
      yellow: isActive 
        ? 'bg-yellow-100 text-yellow-700 border-yellow-200 shadow-sm' 
        : 'bg-white text-gray-600 border-gray-200 hover:bg-yellow-50 hover:text-yellow-600',
      green: isActive 
        ? 'bg-green-100 text-green-700 border-green-200 shadow-sm' 
        : 'bg-white text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-600',
      red: isActive 
        ? 'bg-red-100 text-red-700 border-red-200 shadow-sm' 
        : 'bg-white text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-600'
    };

    return colorStyles[color as keyof typeof colorStyles];
  };

  return (
    <div className="flex items-center space-x-2 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onStatusChange(tab.key)}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all duration-200 ${getTabStyles(tab.key, tab.color)}`}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
            <span className="bg-white bg-opacity-80 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default  StatusTabs;