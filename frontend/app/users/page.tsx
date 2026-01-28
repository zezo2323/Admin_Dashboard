'use client';

import ProtectedLayout from '../protected-layout';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { userAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import UserEditModal from '@/components/UserEditModal';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  /* ======================
     Fetch Users
  ====================== */
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await userAPI.getAll();
      return res.data;
    },
    enabled: currentUser?.role === 'admin',
  });

  const users: User[] = data?.users || [];

  /* ======================
     Update User
  ====================== */
  const updateUserMutation = useMutation({
    mutationFn: async (user: User) => {
      return userAPI.update(user.id, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      setSelectedUser(null);
    },
  });

  /* ======================
     Delete User
  ====================== */
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      return userAPI.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  /* ======================
     Handlers
  ====================== */
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (user: User) => {
    updateUserMutation.mutate(user);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this user?')) {
      deleteUserMutation.mutate(id);
    }
  };

  /* ======================
     States
  ====================== */
  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="p-6">Loading users...</div>
      </ProtectedLayout>
    );
  }

  if (error || currentUser?.role !== 'admin') {
    return (
      <ProtectedLayout>
        <div className="p-6 text-red-600">
          Access denied or error loading users
        </div>
      </ProtectedLayout>
    );
  }

  /* ======================
     UI
  ====================== */
  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto p-6">

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">

          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">User List</h2>

            <button
              disabled
              className="px-4 py-2 bg-indigo-600 text-white rounded opacity-60 cursor-not-allowed"
            >
              Add User
            </button>
          </div>

          <table className="w-full border-collapse">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-3">
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.username}
                    </div>
                  </td>

                  <td className="p-3">
                    {user.email}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="p-3 text-right">

                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:underline mr-3"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          <div className="p-4 border-t text-sm text-gray-600">
            Showing {users.length} users
          </div>

        </div>

      </div>

      {isModalOpen && selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </ProtectedLayout>
  );
}
