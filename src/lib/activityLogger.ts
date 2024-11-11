import { User } from '../types/auth';

export type ActivityType = 
  | '2fa_enabled'
  | '2fa_disabled'
  | 'security_level_changed'
  | 'login_success'
  | 'login_failed'
  | 'file_uploaded'
  | 'file_approved'
  | 'file_rejected'
  | 'password_changed'
  | 'profile_updated';

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  timestamp: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

const activities = new Map<string, Activity[]>();

export const logActivity = (
  user: User,
  type: ActivityType,
  details: Record<string, any> = {}
): void => {
  const activity: Activity = {
    id: crypto.randomUUID(),
    userId: user.id,
    type,
    timestamp: new Date().toISOString(),
    details,
    ipAddress: '0.0.0.0', // In a real app, get from request
    userAgent: navigator.userAgent
  };

  const userActivities = activities.get(user.id) || [];
  activities.set(user.id, [activity, ...userActivities]);

  // Update user's last activity
  user.lastActivity = activity.timestamp;
};

export const getUserActivities = (userId: string): Activity[] => {
  return activities.get(userId) || [];
};

export const getActivityDescription = (activity: Activity): string => {
  switch (activity.type) {
    case '2fa_enabled':
      return 'Enabled two-factor authentication';
    case '2fa_disabled':
      return 'Disabled two-factor authentication';
    case 'security_level_changed':
      return `Changed security level from ${activity.details.from} to ${activity.details.to}`;
    case 'login_success':
      return activity.details.type === 'registration' 
        ? 'Account created and logged in' 
        : activity.details.type === '2fa'
        ? 'Logged in with two-factor authentication'
        : 'Successful login';
    case 'login_failed':
      return `Failed login attempt${activity.details.reason ? `: ${activity.details.reason}` : ''}`;
    case 'file_uploaded':
      return `Uploaded document: ${activity.details.fileName}`;
    case 'file_approved':
      return `Document approved: ${activity.details.fileName}`;
    case 'file_rejected':
      return `Document rejected: ${activity.details.fileName}`;
    case 'password_changed':
      return 'Changed password';
    case 'profile_updated':
      return 'Updated profile information';
    default:
      return 'Unknown activity';
  }
};