export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  verified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  securityQuestions: SecurityQuestion[];
  identityDocuments: IdentityDocument[];
  lastLogin: string;
  lastActivity?: string;
  loginHistory: LoginRecord[];
  securityLevel: 'basic' | 'enhanced' | 'maximum';
}

export interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface IdentityDocument {
  id: string;
  type: 'passport' | 'driverLicense' | 'nationalId';
  status: 'pending' | 'verified' | 'rejected';
  dateSubmitted: string;
  expiryDate?: string;
}

export interface LoginRecord {
  id: string;
  timestamp: string;
  device: string;
  location: string;
  ipAddress: string;
  success: boolean;
}

export interface Credentials {
  email: string;
  password: string;
  name?: string;
  twoFactorCode?: string;
}