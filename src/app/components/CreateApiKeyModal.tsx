'use client';

import { useState } from 'react';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, limit: number) => void;
}

export default function CreateApiKeyModal({ isOpen, onClose, onSubmit }: CreateApiKeyModalProps) {
  const [keyName, setKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState(1000);
  const [hasLimit, setHasLimit] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(keyName, hasLimit ? monthlyLimit : 0);
    setKeyName('');
    setMonthlyLimit(1000);
    setHasLimit(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create a new API key</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Enter a name and limit for the new API key.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Key Name
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    — A unique name to identify this key
                  </span>
                </label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Key Name"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hasLimit}
                    onChange={(e) => setHasLimit(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Limit monthly usage*</span>
                </label>

                {hasLimit && (
                  <input
                    type="number"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                    min="1"
                    className="mt-2 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 