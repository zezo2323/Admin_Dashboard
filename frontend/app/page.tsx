'use client';

import ProtectedLayout from './protected-layout';
import KPICard from '@/components/KPICard';
import { FiUser, FiDollarSign, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { businessAPI, userAPI } from '@/services/api';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import heavy chart components with loading fallbacks
const BarChartComponent = dynamic(() => import('@/components/BarChart'), {
  loading: () => <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80" />,
  ssr: false // Don't render on server
});

const LineChartComponent = dynamic(() => import('@/components/LineChart'), {
  loading: () => <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80" />,
  ssr: false // Don't render on server
});

export default function DashboardPage() {
  // Fetch dashboard data with React Query
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['users-count'],
    queryFn: async () => {
      const response = await userAPI.getAll({ limit: 1 });
      return response.data.pagination.total;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: businessData, isLoading: businessLoading } = useQuery({
    queryKey: ['business-entities-count'],
    queryFn: async () => {
      const response = await businessAPI.getAll({ limit: 1 });
      return response.data.pagination.total;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mock data for charts
  const userActivityData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const revenueData = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 3800 },
  ];

  // Prepare KPI data with loading states
  const kpiData = [
    {
      title: 'Total Users',
      value: userLoading ? '...' : userData?.toString() || '0',
      change: '+12%',
      icon: <FiUser className="w-6 h-6" />,
      changeType: 'positive' as const
    },
    {
      title: 'Business Entities',
      value: businessLoading ? '...' : businessData?.toString() || '0',
      change: '+3',
      icon: <FiBarChart2 className="w-6 h-6" />,
      changeType: 'positive' as const
    },
    {
      title: 'Revenue',
      value: '$42,567',
      change: '+18%',
      icon: <FiDollarSign className="w-6 h-6" />,
      changeType: 'positive' as const
    },
    {
      title: 'Tasks',
      value: '142',
      change: '+5',
      icon: <FiCheckCircle className="w-6 h-6" />,
      changeType: 'positive' as const
    }
  ];

  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to your admin dashboard</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                icon={kpi.icon}
                changeType={kpi.changeType}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80" />}>
              <LineChartComponent 
                data={userActivityData} 
                title="User Activity" 
              />
            </Suspense>
            <Suspense fallback={<div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80" />}>
              <BarChartComponent 
                data={revenueData} 
                title="Revenue Overview" 
              />
            </Suspense>
          </div>
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Project Update</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                    </p>
                    <p className="mt-2 text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}