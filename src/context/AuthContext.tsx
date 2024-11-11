import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { User, Credentials } from '../types/auth';
import {
  createUser,
  getUserByEmail,
  verifyPassword,
  updateUserLastLogin,
  createLoginHistory,
  storeOTPCode,
  verifyOTPCode,
} from '../lib/db';
import { sendOTPEmail } from '../lib/email';
import { logActivity } from '../lib/activityLogger';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  requiresOTP: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  verifyOTP: (code: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  requiresOTP: false,
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'REQUIRE_OTP' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, isLoading: false, user: action.payload, error: null, requiresOTP: false };
    case 'AUTH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'REQUIRE_OTP':
      return { ...state, isLoading: false, requiresOTP: true };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [pendingUser, setPendingUser] = React.useState<User | null>(null);

  const login = useCallback(async (credentials: Credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const user = await getUserByEmail(credentials.email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await verifyPassword(credentials.password, user.password);
      if (!isValid) {
        logActivity(user, 'login_failed', { reason: 'Invalid password' });
        throw new Error('Invalid credentials');
      }

      const updatedUser: User = {
        ...user,
        identityDocuments: user.identityDocuments || [],
        loginHistory: user.loginHistory || [],
        securityQuestions: user.securityQuestions || [],
        verified: user.verified || false,
        twoFactorEnabled: user.twoFactorEnabled || false,
        securityLevel: user.securityLevel || 'basic',
        lastLogin: new Date().toISOString()
      };

      if (updatedUser.twoFactorEnabled) {
        setPendingUser(updatedUser);
        const otpCode = generateOTP();
        await storeOTPCode(updatedUser.id, otpCode, 'email');
        await sendOTPEmail(updatedUser.email, otpCode);
        dispatch({ type: 'REQUIRE_OTP' });
        return;
      }

      await updateUserLastLogin(updatedUser.id);
      await createLoginHistory(
        updatedUser.id,
        navigator.userAgent,
        'Unknown',
        '0.0.0.0',
        true
      );

      logActivity(updatedUser, 'login_success', {});
      dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Login failed' });
    }
  }, []);

  const register = useCallback(async (credentials: Credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const existingUser = await getUserByEmail(credentials.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const user = await createUser({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name || credentials.email.split('@')[0],
        verified: false,
        twoFactorEnabled: false,
        securityLevel: 'basic',
        identityDocuments: [],
        loginHistory: [],
        securityQuestions: [],
        lastLogin: new Date().toISOString()
      });

      await createLoginHistory(
        user.id,
        navigator.userAgent,
        'Unknown',
        '0.0.0.0',
        true
      );

      logActivity(user, 'login_success', { type: 'registration' });
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Registration failed' });
    }
  }, []);

  const verifyOTP = useCallback(async (code: string) => {
    if (!pendingUser) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'No pending authentication' });
      return;
    }

    try {
      dispatch({ type: 'AUTH_START' });
      
      const isValid = verifyOTPCode(pendingUser.id, code);
      if (!isValid) {
        logActivity(pendingUser, 'login_failed', { reason: 'Invalid 2FA code' });
        throw new Error('Invalid or expired code');
      }

      await updateUserLastLogin(pendingUser.id);
      await createLoginHistory(
        pendingUser.id,
        navigator.userAgent,
        'Unknown',
        '0.0.0.0',
        true
      );

      logActivity(pendingUser, 'login_success', { type: '2fa' });
      dispatch({ type: 'AUTH_SUCCESS', payload: pendingUser });
      setPendingUser(null);
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Verification failed' });
    }
  }, [pendingUser]);

  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  const logout = useCallback(() => {
    if (state.user) {
      logActivity(state.user, 'logout', {});
    }
    dispatch({ type: 'LOGOUT' });
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, verifyOTP, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}