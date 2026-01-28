import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiUser, FiDollarSign, FiBarChart2, FiCheckCircle } from 'react-icons/fi';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  changeType: 'positive' | 'negative';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, changeType }) => {
  const changeIcon = changeType === 'positive' ? <FiTrendingUp /> : <FiTrendingDown />;
  const changeColor = changeType === 'positive' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`flex items-center text-sm font-medium ${changeColor}`}>
          {changeIcon}
          <span className="ml-1">{change}</span>
        </span>
        <span className="ml-2 text-sm text-gray-500">from last month</span>
      </div>
    </div>
  );
};

export default KPICard;