import React from 'react';
import { Shield } from 'lucide-react';

interface SecurityLevelProps {
  level: 'basic' | 'enhanced' | 'maximum';
}

export default function SecurityLevel({ level }: SecurityLevelProps) {
  const levels = {
    basic: {
      color: 'yellow',
      text: 'Basic Protection',
      description: 'Enable 2FA and verify your identity to enhance security',
    },
    enhanced: {
      color: 'blue',
      text: 'Enhanced Security',
      description: '2FA enabled with partial identity verification',
    },
    maximum: {
      color: 'green',
      text: 'Maximum Protection',
      description: 'All security features are enabled and verified',
    },
  };

  const current = levels[level];

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Shield className={`h-5 w-5 text-${current.color}-600`} />
        <span className={`font-semibold text-${current.color}-600`}>
          {current.text}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{current.description}</p>
      
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-${current.color}-600`}
          style={{
            width: level === 'basic' ? '33%' : level === 'enhanced' ? '66%' : '100%',
          }}
        />
      </div>
    </div>
  );
}