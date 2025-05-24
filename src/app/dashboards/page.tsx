'use client';

import { useState } from 'react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');

  const generateApiKey = () => {
    if (!newKeyName) return;
    
    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKeyName,
      key: `vb_${Math.random().toString(36).substr(2, 24)}`,
      createdAt: new Date().toISOString(),
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
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

        {/* API Keys List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your API Keys</h2>
          
          {apiKeys.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No API keys created yet.</p>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="border dark:border-gray-700 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium">{key.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                      {key.key}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Created: {new Date(key.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteApiKey(key.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 