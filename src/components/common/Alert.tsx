import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const alertStyles: Record<AlertType, { bg: string; text: string; icon: JSX.Element }> = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-200',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-200',
    icon: <XCircle className="h-5 w-5 text-red-500" />
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-200',
    icon: <Info className="h-5 w-5 text-blue-500" />
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
  }
};

export default function Alert({ type, message, onClose }: AlertProps) {
  const styles = alertStyles[type];

  return (
    <div className={`${styles.bg} ${styles.text} p-4 rounded-lg flex items-start space-x-3`}>
      {styles.icon}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}