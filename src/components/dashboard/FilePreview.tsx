import React from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onClose: () => void;
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');
  const fileUrl = URL.createObjectURL(file);

  React.useEffect(() => {
    return () => URL.revokeObjectURL(fileUrl);
  }, [fileUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {isImage ? <ImageIcon className="h-5 w-5 text-gray-500" /> : <FileText className="h-5 w-5 text-gray-500" />}
            <h3 className="font-medium text-gray-900">{file.name}</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          {isImage ? (
            <img src={fileUrl} alt={file.name} className="max-w-full h-auto" />
          ) : (
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
              <FileText className="h-16 w-16 text-gray-400" />
              <p className="mt-2 text-gray-600">Preview not available for this file type</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            <p>File size: {(file.size / 1024).toFixed(2)} KB</p>
            <p>Type: {file.type || 'Unknown'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}