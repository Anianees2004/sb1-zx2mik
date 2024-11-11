import React from 'react';
import { Activity, getActivityDescription } from '../../lib/activityLogger';
import { Clock, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ActivityLogProps {
  activities: Activity[];
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow p-6`}>
      <h2 className={`text-xl font-semibold ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      } mb-4`}>Activity Log</h2>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className={`text-center py-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No activity recorded yet</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`border-l-4 border-blue-600 pl-4 py-2 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } rounded-r-lg`}
            >
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                {getActivityDescription(activity)}
              </p>
              <div className={`flex items-center space-x-2 mt-1 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Clock className="h-4 w-4" />
                <span>{new Date(activity.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}