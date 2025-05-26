'use client';

import { useState } from 'react';
import { 
  EyeIcon,
  ClipboardDocumentIcon, 
  PencilIcon, 
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import CreateApiKeyModal from '../components/CreateApiKeyModal';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  usage: number;
  limit: number;
}

interface EditState {
  id: string | null;
  name: string;
}

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [editState, setEditState] = useState<EditState>({ id: null, name: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const generateApiKey = (name: string, limit: number) => {
    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      key: `vb_${Math.random().toString(36).substr(2, 24)}`,
      createdAt: new Date().toISOString(),
      usage: 0,
      limit
    };

    setApiKeys([...apiKeys, newKey]);
    toast.success('API key created successfully');
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
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
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      <CreateApiKeyModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={generateApiKey}
      />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">API Keys</h1>
          <button
            onClick={() => {}}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            View Documentation →
          </button>
        </div>

        {/* Current Plan Card */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-purple-600 via-purple-400 to-blue-400 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm font-medium mb-1">CURRENT PLAN</div>
              <h2 className="text-2xl font-semibold">Developer</h2>
            </div>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors">
              Manage Plan
            </button>
          </div>
          <div className="mt-4">
            <div className="text-sm mb-1">API Limit</div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-white rounded-full"></div>
            </div>
            <div className="text-sm mt-1">250 / 1,000 Requests</div>
          </div>
        </div>

        {/* API Keys Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              + Create API Key
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The key is used to authenticate your requests to the API. To learn more, see the documentation.
              </p>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">NAME</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">KEY</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">USAGE</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">OPTIONS</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No API keys created yet
                    </td>
                  </tr>
                ) : (
                  apiKeys.map((key) => (
                    <tr key={key.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-6">
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
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <span className="font-medium">{key.name}</span>
                            {key.limit > 0 && (
                              <span className="ml-2 text-xs text-gray-500">
                                (Limit: {key.limit})
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm">
                            {showKey[key.id] ? key.key : '••••••••••••••••••••••••••'}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(key.key)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {key.usage}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          {editState.id !== key.id && (
                            <button
                              onClick={() => startEdit(key)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          )}
                          {deleteConfirmId === key.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => deleteApiKey(key.id)}
                                className="text-xs px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(key.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 