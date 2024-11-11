import { User } from '../types/auth';
import { logActivity } from './activityLogger';
import { updateSecurityLevel } from './securityLevel';
import { sendOTPEmail } from './email';

export const setupTwoFactor = async (user: User): Promise<string> => {
  const secret = generateTOTPSecret();
  user.twoFactorSecret = secret;
  
  // Send verification code via email
  const verificationCode = generateOTPCode();
  await sendOTPEmail(user.email, verificationCode);
  
  return verificationCode;
};

export const enableTwoFactor = (user: User): void => {
  user.twoFactorEnabled = true;
  user.securityLevel = updateSecurityLevel(user);
  
  logActivity(user, '2fa_enabled', {});
};

export const disableTwoFactor = (user: User): void => {
  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  user.securityLevel = updateSecurityLevel(user);
  
  logActivity(user, '2fa_disabled', {});
};

export const generateTOTPSecret = (): string => {
  return crypto.randomUUID();
};

export const generateOTPCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};