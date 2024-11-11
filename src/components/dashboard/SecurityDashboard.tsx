import React, { useState, useCallback } from 'react';
import { Shield, Lock, AlertTriangle, Smartphone, FileCheck, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SecurityLevel from './SecurityLevel';
import LoginHistory from './LoginHistory';
import IdentityDocuments from './IdentityDocuments';
import SecurityControls from './SecurityControls';
import ActivityLog from './ActivityLog';
import { getUserActivities } from '../../lib/activityLogger';
import Card from '../common/Card';
import Alert from '../common/Alert';

export default function SecurityDashboard() {
  const { user, updateUser } = useAuth();
  const [activities, setActivities] = useState(() => 
    user ? getUserActivities(user.id) : []
  );
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleUserUpdate = useCallback((updatedUser: typeof user) => {
    try {
      if (updateUser) {
        updateUser(updatedUser);
        setActivities(getUserActivities(updatedUser.id));
        setAlert({ type: 'success', message: 'Security settings updated successfully' });
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: 'Failed to update security settings. Please try again.' 
      });
    }
  }, [updateUser]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Security Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage and protect your digital identity
        </p>
      </div>

      {alert && (
        <div className="mb-6">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <SecurityControls user={user} onUserUpdate={handleUserUpdate} />
        </Card>
        <Card>
          <ActivityLog activities={activities} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <IdentityDocuments documents={user.identityDocuments} />
        </Card>
        <Card>
          <LoginHistory history={user.loginHistory} />
        </Card>
      </div>
    </div>
  );
}