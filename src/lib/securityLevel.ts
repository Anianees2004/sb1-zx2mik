import { User } from '../types/auth';
import { logActivity } from './activityLogger';

export type SecurityLevel = 'basic' | 'enhanced' | 'maximum';

interface SecurityRequirement {
  check: (user: User) => boolean;
  description: string;
}

export const securityRequirements: Record<SecurityLevel, SecurityRequirement[]> = {
  basic: [],
  enhanced: [
    {
      check: (user) => user.twoFactorEnabled,
      description: 'Enable two-factor authentication'
    },
    {
      check: (user) => user.securityQuestions.length >= 2,
      description: 'Set up at least 2 security questions'
    }
  ],
  maximum: [
    {
      check: (user) => user.twoFactorEnabled,
      description: 'Enable two-factor authentication'
    },
    {
      check: (user) => user.securityQuestions.length >= 3,
      description: 'Set up at least 3 security questions'
    },
    {
      check: (user) => user.identityDocuments.some(doc => doc.status === 'verified'),
      description: 'Verify your identity with official documents'
    }
  ]
};

export const updateSecurityLevel = (user: User): SecurityLevel => {
  if (meetsSecurityRequirements(user, 'maximum')) {
    return 'maximum';
  } else if (meetsSecurityRequirements(user, 'enhanced')) {
    return 'enhanced';
  }
  return 'basic';
};

export const meetsSecurityRequirements = (
  user: User,
  level: SecurityLevel
): boolean => {
  return securityRequirements[level].every(req => req.check(user));
};

export const getMissingRequirements = (
  user: User,
  targetLevel: SecurityLevel
): string[] => {
  return securityRequirements[targetLevel]
    .filter(req => !req.check(user))
    .map(req => req.description);
};

export const setSecurityLevel = (
  user: User,
  newLevel: SecurityLevel
): void => {
  const oldLevel = user.securityLevel;
  user.securityLevel = newLevel;
  
  logActivity(user, 'security_level_changed', {
    from: oldLevel,
    to: newLevel
  });
};