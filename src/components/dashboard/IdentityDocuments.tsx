import React, { useCallback, useState } from 'react';
import { FileCheck, Upload, AlertCircle, Trash2 } from 'lucide-react';
import type { IdentityDocument } from '../../types/auth';
import FilePreview from './FilePreview';

interface IdentityDocumentsProps {
  documents: IdentityDocument[];
}

interface UploadedFile {
  id: string;
  file: File;
  uploadDate: string;
  status: 'uploading' | 'complete' | 'error';
}

export default function IdentityDocuments({ documents }: IdentityDocumentsProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (files) {
      const file = files[0];
      if (file) {
        const newFile: UploadedFile = {
          id: crypto.randomUUID(),
          file,
          uploadDate: new Date().toISOString(),
          status: 'complete',
        };
        setUploadedFiles(prev => [...prev, newFile]);
      }
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Identity Documents</h2>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <label className="flex flex-col items-center space-y-2 cursor-pointer">
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="text-gray-600">
            Drag and drop your files here or{' '}
            <span className="text-blue-600">browse</span>
          </span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <span className="text-sm text-gray-500">
            Supported formats: PDF, JPG, PNG
          </span>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileCheck className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(uploadedFile.uploadDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedFile(uploadedFile.file)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileCheck className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Submitted on {new Date(doc.dateSubmitted).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  doc.status === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : doc.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>
            </div>
            {doc.expiryDate && (
              <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500">
                <AlertCircle className="h-4 w-4" />
                <span>Expires on {new Date(doc.expiryDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}