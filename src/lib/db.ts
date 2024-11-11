import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { encryptData, decryptData, hashData } from './encryption';
import type { User, IdentityDocument, LoginRecord } from '../types/auth';

// In-memory storage for development
const inMemoryDB = {
  users: new Map<string, User>(),
  sessions: new Map<string, any>(),
  loginHistory: new Map<string, LoginRecord[]>(),
  identityDocuments: new Map<string, IdentityDocument[]>(),
  otpCodes: new Map<string, any[]>(),
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  try {
    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user: User = {
      ...userData,
      id,
      password: hashedPassword,
      lastLogin: new Date().toISOString(),
      identityDocuments: [],
      loginHistory: [],
      securityQuestions: []
    };

    // Encrypt sensitive data before storage
    const encryptedUser = {
      ...user,
      email: encryptData(user.email),
      name: encryptData(user.name)
    };

    inMemoryDB.users.set(userData.email, encryptedUser);
    return user;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('User creation failed');
  }
};

export const getUserByEmail = (email: string): User | null => {
  try {
    const encryptedUser = inMemoryDB.users.get(email);
    if (!encryptedUser) return null;

    // Decrypt sensitive data
    return {
      ...encryptedUser,
      email: decryptData(encryptedUser.email),
      name: decryptData(encryptedUser.name)
    };
  } catch (error) {
    console.error('Failed to get user:', error);
    throw new Error('Failed to retrieve user data');
  }
};

export const updateUserLastLogin = (userId: string): void => {
  try {
    for (const [email, user] of inMemoryDB.users.entries()) {
      if (user.id === userId) {
        user.lastLogin = new Date().toISOString();
        inMemoryDB.users.set(email, user);
        break;
      }
    }
  } catch (error) {
    console.error('Failed to update last login:', error);
    throw new Error('Failed to update login timestamp');
  }
};

export const createLoginHistory = async (
  userId: string,
  device: string,
  location: string,
  ipAddress: string,
  success: boolean
): Promise<void> => {
  try {
    for (const [email, user] of inMemoryDB.users.entries()) {
      if (user.id === userId) {
        const loginRecord: LoginRecord = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          device,
          location,
          ipAddress,
          success,
        };

        user.loginHistory = [...(user.loginHistory || []), loginRecord];
        inMemoryDB.users.set(email, user);

        // Also store in the login history map
        const userHistory = inMemoryDB.loginHistory.get(userId) || [];
        inMemoryDB.loginHistory.set(userId, [...userHistory, loginRecord]);
        break;
      }
    }
  } catch (error) {
    console.error('Failed to create login history:', error);
    throw new Error('Failed to record login attempt');
  }
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Password verification failed:', error);
    throw new Error('Password verification failed');
  }
};

export const storeOTPCode = (
  userId: string,
  code: string,
  type: 'email' | 'sms',
  expiresInMinutes: number = 10
): void => {
  try {
    const hashedCode = hashData(code);
    const otpCodes = inMemoryDB.otpCodes.get(userId) || [];
    otpCodes.push({
      id: crypto.randomUUID(),
      code: hashedCode,
      type,
      expiresAt: new Date(Date.now() + expiresInMinutes * 60000).toISOString(),
      used: false,
    });
    inMemoryDB.otpCodes.set(userId, otpCodes);
  } catch (error) {
    console.error('Failed to store OTP code:', error);
    throw new Error('Failed to generate security code');
  }
};

export const verifyOTPCode = (userId: string, code: string): boolean => {
  try {
    const otpCodes = inMemoryDB.otpCodes.get(userId) || [];
    const hashedInputCode = hashData(code);
    const now = new Date();
    
    const validOTP = otpCodes.find(otp => 
      otp.code === hashedInputCode &&
      !otp.used &&
      new Date(otp.expiresAt) > now
    );

    if (validOTP) {
      validOTP.used = true;
      inMemoryDB.otpCodes.set(userId, otpCodes);
      return true;
    }

    return false;
  } catch (error) {
    console.error('OTP verification failed:', error);
    throw new Error('Security code verification failed');
  }
};