import React from 'react';
import { X, FileText, Image as ImageIcon, Download, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DocumentPreviewProps {
  file: File;
  onClose: () => void;
  onToggleVisibility?: () => void;
  isPrivate?: boolean;
}

export default function DocumentPreview({ 
  file, 
  onClose, 
  onToggleVisibility,
  isPrivate = false 
}: DocumentPreviewProps) {
  const { theme } = useTheme();
  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  const fileUrl = URL.createObjectURL(file);

  React.useEffect(() => {
    return () => URL.revokeObjectURL(fileUrl);
  }, [fileUrl]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden`}>
        <div className={`p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
          <div className="flex items-center space-x-2">
            {isImage ? (
              <ImageIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            ) : (
              <FileText className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
            <h3 className="font-medium">{file.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {onToggleVisibility && (
              <button
                onClick={onToggleVisibility}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title={isPrivate ? 'Make Public' : 'Make Private'}
              >
                {isPrivate ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
            <button
              onClick={handleDownload}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {isImage ? (
            <img src={fileUrl} alt={file.name} className="max-w-full h-auto" />
          ) : isPDF ? (
            <iframe
              src={fileUrl}
              title={file.name}
              className="w-full h-[60vh]"
            />
          ) : (
            <div className={`flex flex-col items-center justify-center p-8 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            } rounded-lg`}>
              <FileText className={`h-16 w-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Preview not available for this file type
              </p>
            </div>
          )}
        </div>
        <div className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>File size: {(file.size / 1024).toFixed(2)} KB</p>
            <p>Type: {file.type || 'Unknown'}</p>
            <p>Last modified: {new Date(file.lastModified).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}