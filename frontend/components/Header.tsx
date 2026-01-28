'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Welcome, {user.firstName} {user.lastName}</span>
                <div className="relative">
                  <button className="flex items-center text-sm rounded-full focus:outline-none">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                >
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900">
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {user ? (
              <>
                <div className="flex items-center px-4 py-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-3">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                  <span className="text-gray-700">Welcome, {user.firstName} {user.lastName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <FiLogOut className="mr-2 inline" /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;