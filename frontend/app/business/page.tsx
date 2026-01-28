'use client';

import ProtectedLayout from '../protected-layout';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { businessAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import BusinessEditModal from '@/components/BusinessEditModal';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface BusinessEntity {
  id: number;
  name: string;
  description: string;
  status: string;
  value: number;
  owner?: User;
}

interface BusinessEntityForEdit {
  id: number;
  name: string;
  description: string;
  status: string;
  value: number;
}

export default function BusinessPage() {
  const [selectedEntity, setSelectedEntity] = useState<BusinessEntityForEdit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  /* ================= FETCH ================= */

  const { data, isLoading, error } = useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      const res = await businessAPI.getAll();
      return res.data.data as BusinessEntity[];
    },
    enabled: ['admin', 'manager'].includes(user?.role || ''),
  });

  /* ================= UPDATE ================= */

  const updateMutation = useMutation({
    mutationFn: (entity: BusinessEntityForEdit) =>
      businessAPI.update(entity.id, entity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] });
      setIsModalOpen(false);
      setSelectedEntity(null);
    },
  });

  /* ================= DELETE ================= */

  const deleteMutation = useMutation({
    mutationFn: (id: number) => businessAPI.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] });
    },
  });

  /* ================= HANDLERS ================= */

  const handleEdit = (entity: BusinessEntity) => {
    setSelectedEntity({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      value: entity.value,
    });

    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this entity?')) {
      deleteMutation.mutate(id);
    }
  };

  /* ================= PERMISSION ================= */

  if (!['admin', 'manager'].includes(user?.role || '')) {
    return (
      <ProtectedLayout>
        <p className="p-6 text-red-600">Access denied</p>
      </ProtectedLayout>
    );
  }

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <ProtectedLayout>
        <p className="p-6">Loading...</p>
      </ProtectedLayout>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <ProtectedLayout>
        <p className="p-6 text-red-600">Failed to load data</p>
      </ProtectedLayout>
    );
  }

  /* ================= UI ================= */

  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto p-6">

        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Business</h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        <div className="bg-white shadow rounded overflow-x-auto">

          <table className="w-full border-collapse">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Value</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>

              {data?.map((e) => (

                <tr key={e.id} className="border-t">

                  <td className="p-3">{e.name}</td>

                  <td className="p-3">{e.status}</td>

                  <td className="p-3">${e.value}</td>

                  <td className="p-3">
                    {e.owner
                      ? `${e.owner.firstName} ${e.owner.lastName}`
                      : 'N/A'}
                  </td>

                  <td className="p-3 text-right space-x-3">

                    <button
                      onClick={() => handleEdit(e)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>

                  </td>
                </tr>

              ))}

              {data?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No data
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {isModalOpen && selectedEntity && (
          <BusinessEditModal
            entity={selectedEntity}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={(e) => updateMutation.mutate(e)}
          />
        )}

      </div>
    </ProtectedLayout>
  );
}
