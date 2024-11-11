import React from 'react';
import { Clock, MapPin, Monitor } from 'lucide-react';
import type { LoginRecord } from '../../types/auth';

interface LoginHistoryProps {
  history: LoginRecord[];
}

export default function LoginHistory({ history }: LoginHistoryProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Login History</h2>
      <div className="space-y-4">
        {history.map((record) => (
          <div
            key={record.id}
            className="border-l-4 border-blue-600 pl-4 py-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {record.device}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  record.success
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {record.success ? 'Success' : 'Failed'}
              </span>
            </div>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(record.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{record.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}