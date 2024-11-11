import React, { useState } from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { User } from '../../types/auth';
import { SecurityLevel, getMissingRequirements } from '../../lib/securityLevel';
import { setupTwoFactor, enableTwoFactor, disableTwoFactor } from '../../lib/twoFactor';

interface SecurityControlsProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export default function SecurityControls({ user, onUserUpdate }: SecurityControlsProps) {
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingCode, setPendingCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleToggle2FA = async () => {
    if (user.twoFactorEnabled) {
      disableTwoFactor(user);
      onUserUpdate({ ...user });
    } else {
      setIsEnabling2FA(true);
      try {
        const code = await setupTwoFactor(user);
        setPendingCode(code);
      } catch (err) {
        setError('Failed to setup 2FA. Please try again.');
      }
    }
  };

  const handleVerify2FA = () => {
    if (verificationCode === pendingCode) {
      enableTwoFactor(user);
      onUserUpdate({ ...user });
      setIsEnabling2FA(false);
      setVerificationCode('');
      setPendingCode('');
      setError(null);
    } else {
      setError('Invalid verification code');
    }
  };

  const securityLevels: SecurityLevel[] = ['basic', 'enhanced', 'maximum'];
  const currentLevel = user.securityLevel;
  const missingRequirements = getMissingRequirements(user, 
    securityLevels[securityLevels.indexOf(currentLevel) + 1] || currentLevel
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Controls</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Security Level</span>
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
            </span>
          </div>
          {missingRequirements.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">To upgrade your security level:</p>
              <ul className="list-disc list-inside mt-1">
                {missingRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Two-Factor Authentication</span>
            </div>
            <button
              onClick={handleToggle2FA}
              disabled={isEnabling2FA}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                user.twoFactorEnabled
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          {isEnabling2FA && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                Enter the verification code sent to your email
              </p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code"
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={6}
                />
                <button
                  onClick={handleVerify2FA}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}