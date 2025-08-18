'use client';

import { 
  FileAudio, 
  Plus 
} from 'lucide-react';

interface UploadInterfaceProps {
  isDragOver: boolean;
  isProcessing: boolean;
  uploadedFileName: string;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileUpload: () => void;
}

export default function UploadInterface({
  isDragOver,
  isProcessing,
  uploadedFileName,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileUpload,
  triggerFileUpload
}: UploadInterfaceProps) {
  return (
    <div className="flex-1">
      <div 
        className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-colors cursor-pointer ${
          isDragOver 
            ? 'border-[#0db2f3] bg-[#0db2f3]/10 dark:bg-[#0db2f3]/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-[#0db2f3] dark:hover:border-[#0db2f3]'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileUpload}
      >
        <FileAudio className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 ${
          isDragOver ? 'text-[#0db2f3]' : 'text-gray-400 dark:text-gray-500'
        }`} />
        <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm sm:text-base">
          {isDragOver ? 'Drop your audio file here!' : 'Drop your audio file here or click to browse'}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-4">Supports MP3, WAV, M4A, WEBM, OGG (Max 100MB)</p>
        
        {uploadedFileName && (
          <div className="mb-4 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <p className="text-green-800 dark:text-green-400 text-sm">
              ✅ Last uploaded: {uploadedFileName}
            </p>
          </div>
        )}
        
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          disabled={isProcessing}
        />
        <label 
          htmlFor="file-upload"
          onClick={triggerFileUpload}
          className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all cursor-pointer ${
            isProcessing 
              ? 'bg-gray-400 text-white opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#0db2f3] to-blue-500 hover:from-[#0db2f3]/80 hover:to-blue-500/80 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Choose File
            </>
          )}
        </label>
      </div>
    </div>
  );
}
