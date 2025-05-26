'use client';

import { useState } from 'react';
import { 
  ClipboardDocumentIcon, 
  PencilIcon, 
  TrashIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface EditState {
  id: string | null;
  name: string;
}

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [editState, setEditState] = useState<EditState>({ id: null, name: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const generateApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }
    
    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKeyName.trim(),
      key: `vb_${Math.random().toString(36).substr(2, 24)}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    toast.success('API key created successfully');
  };

  const startEdit = (key: ApiKey) => {
    setEditState({ id: key.id, name: key.name });
  };

  const cancelEdit = () => {
    setEditState({ id: null, name: '' });
  };

  const saveEdit = (id: string) => {
    if (!editState.name.trim()) {
      toast.error('Key name cannot be empty');
      return;
    }

    setApiKeys(apiKeys.map(key => 
      key.id === id 
        ? { ...key, name: editState.name.trim() }
        : key
    ));
    setEditState({ id: null, name: '' });
    toast.success('API key updated successfully');
  };

  const toggleKeyStatus = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id 
        ? { ...key, status: key.status === 'active' ? 'inactive' : 'active' }
        : key
    ));
    toast.success('API key status updated');
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    setDeleteConfirmId(null);
    toast.success('API key deleted successfully');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  return (
    <div className="min-h-screen p-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Key Management</h1>
        
        {/* Create new API key */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New API Key</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Enter key name"
              className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              onClick={generateApiKey}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Generate Key
            </button>
          </div>
        </div>

        {/* API Keys Table */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Your API Keys</h2>
          
          {apiKeys.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No API keys created yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-4 px-4">Name</th>
                  <th className="text-left py-4 px-4">API Key</th>
                  <th className="text-left py-4 px-4">Created</th>
                  <th className="text-left py-4 px-4">Status</th>
                  <th className="text-right py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b dark:border-gray-700">
                    <td className="py-4 px-4">
                      {editState.id === key.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editState.name}
                            onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                            className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                          <button
                            onClick={() => saveEdit(key.id)}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span>{key.name}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {key.key}
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.key)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleKeyStatus(key.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          key.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {key.status}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {editState.id !== key.id && (
                          <button
                            onClick={() => startEdit(key)}
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        )}
                        {deleteConfirmId === key.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => deleteApiKey(key.id)}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(key.id)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 