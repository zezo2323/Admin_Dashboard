'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiHome, FiUsers, FiBox, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Users', href: '/users', icon: FiUsers },
    { name: 'Business', href: '/business', icon: FiBox },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  // Only show admin-related items to admin users
  const filteredNavigation = user?.role === 'admin' 
    ? navigation 
    : navigation.filter(item => item.name !== 'Users');

  return (
    <div className="hidden md:block w-64 bg-white shadow-md h-full">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;