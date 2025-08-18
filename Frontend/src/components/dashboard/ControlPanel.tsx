'use client';

import { 
  Mic, 
  MessageCircle, 
  Upload 
} from 'lucide-react';
import RecordingControls from './RecordingControls';
import UploadInterface from './UploadInterface';

type ActiveMode = 'record' | 'chat' | 'upload';

interface ControlPanelProps {
  activeMode: ActiveMode;
  setActiveMode: (mode: ActiveMode) => void;
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  isDragOver: boolean;
  isProcessing: boolean;
  uploadedFileName: string;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileUpload: () => void;
}

export default function ControlPanel({
  activeMode,
  setActiveMode,
  isRecording,
  isPaused,
  recordingTime,
  isDragOver,
  isProcessing,
  uploadedFileName,
  startRecording,
  pauseRecording,
  stopRecording,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileUpload,
  triggerFileUpload
}: ControlPanelProps) {
  return (
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6">
      {/* Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setActiveMode('record')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                activeMode === 'record'
                  ? 'bg-[#0db2f3] text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              Record
            </button>
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                activeMode === 'chat'
                  ? 'bg-[#0db2f3] text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
            <button
              onClick={() => setActiveMode('upload')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                activeMode === 'upload'
                  ? 'bg-[#0db2f3] text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>

        {/* Recording Controls */}
        {activeMode === 'record' && (
          <RecordingControls
            isRecording={isRecording}
            isPaused={isPaused}
            recordingTime={recordingTime}
            startRecording={startRecording}
            pauseRecording={pauseRecording}
            stopRecording={stopRecording}
          />
        )}

        {/* Chat Interface */}
        {activeMode === 'chat' && (
          <div className="flex items-center justify-center">
            <div className="text-gray-600 dark:text-gray-400 text-center">
              Chat functionality coming soon...
            </div>
          </div>
        )}

        {/* Upload Interface */}
        {activeMode === 'upload' && (
          <UploadInterface
            isDragOver={isDragOver}
            isProcessing={isProcessing}
            uploadedFileName={uploadedFileName}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleFileUpload={handleFileUpload}
            triggerFileUpload={triggerFileUpload}
          />
        )}
      </div>
      
      {/* Hidden file input for uploads */}
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
        disabled={isProcessing}
      />
    </div>
  );
}
