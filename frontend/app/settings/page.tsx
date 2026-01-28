'use client';

import ProtectedLayout from '../protected-layout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI, userAPI } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function SettingsPage() {
  const { user: currentUser, token } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  // Load user profile data
  useEffect(() => {
    if (currentUser) {
      setProfile({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username
      });
      setLoading(false);
    }
  }, [currentUser]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { firstName: string; lastName: string; email: string; username: string }) => {
      if (!currentUser) throw new Error('No user found');
      const response = await userAPI.update(currentUser.id, {
        ...profileData,
        role: currentUser.role,
        isActive: currentUser.isActive
      });
      return response.data;
    },
    onSuccess: () => {
      setMessage('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData: { currentPassword: string; newPassword: string }) => {
      // In a real implementation, you would call an API to change password
      // For now, we'll just simulate the API call
      return new Promise((resolve) => {
        setTimeout(() => resolve({ message: 'Password changed successfully' }), 500);
      });
    },
    onSuccess: () => {
      setMessage('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to change password');
      setTimeout(() => setError(''), 3000);
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profile);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
          
          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'profile' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'password' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('password')}
            >
              Password
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'preferences' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
          </div>
          
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                
                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                
                <div className="sm:col-span-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                
                <div className="sm:col-span-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                
                <div className="sm:col-span-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change Password
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'preferences' && (
            <div className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email notifications</h3>
                    <p className="text-sm text-gray-500">Receive emails about important updates</p>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-200"
                    role="switch"
                    aria-checked="false"
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-0"
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Push notifications</h3>
                    <p className="text-sm text-gray-500">Receive push notifications on your devices</p>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600"
                    role="switch"
                    aria-checked="true"
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-5"
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Dark mode</h3>
                    <p className="text-sm text-gray-500">Use dark theme for the application</p>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-200"
                    role="switch"
                    aria-checked="false"
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-0"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}