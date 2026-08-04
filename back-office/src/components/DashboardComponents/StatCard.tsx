import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactElement;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, loading = false }) => {
  const isPositive = change?.startsWith('+');

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <span
              className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
            >
              {change}
            </span>
          )}
        </div>
        {icon && <div className="ml-4">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
