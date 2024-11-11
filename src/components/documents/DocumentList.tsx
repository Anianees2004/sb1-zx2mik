import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Lock, Globe, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import DocumentPreview from './DocumentPreview';
import { logActivity } from '../../lib/activityLogger';
import { useAuth } from '../../context/AuthContext';

interface Document {
  id: string;
  file: File;
  uploadDate: string;
  isPrivate: boolean;
  uploadedBy: string;
}

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { theme } = useTheme();
  const { user } = useAuth();

  const handleFileUpload = (files: FileList | null) => {
    if (files && files[0] && user) {
      const newDoc: Document = {
        id: crypto.randomUUID(),
        file: files[0],
        uploadDate: new Date().toISOString(),
        isPrivate: false,
        uploadedBy: user.email
      };

      setDocuments(prev => [...prev, newDoc]);
      logActivity(user, 'file_uploaded', { fileName: files[0].name });
    }
  };

  const toggleVisibility = (doc: Document) => {
    if (user) {
      setDocuments(prev =>
        prev.map(d =>
          d.id === doc.id ? { ...d, isPrivate: !d.isPrivate } : d
        )
      );
      logActivity(user, doc.isPrivate ? 'file_approved' : 'file_rejected', {
        fileName: doc.file.name
      });
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />;
    }
    return <FileText className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />;
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
        Documents
      </h2>

      <div
        className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center ${
          theme === 'dark'
            ? 'border-gray-700 hover:border-blue-500 hover:bg-gray-700'
            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <label className="flex flex-col items-center space-y-2 cursor-pointer">
          <FileText className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Drag and drop your files here or{' '}
            <span className="text-blue-500">browse</span>
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </label>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              {getFileIcon(doc.file)}
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {doc.file.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(doc.uploadDate).toLocaleString()}
                  </span>
                  {doc.isPrivate ? (
                    <Lock className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  ) : (
                    <Globe className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedDocument(doc)}
              className={`text-sm ${
                theme === 'dark'
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {selectedDocument && (
        <DocumentPreview
          file={selectedDocument.file}
          onClose={() => setSelectedDocument(null)}
          onToggleVisibility={() => toggleVisibility(selectedDocument)}
          isPrivate={selectedDocument.isPrivate}
        />
      )}
    </div>
  );
}