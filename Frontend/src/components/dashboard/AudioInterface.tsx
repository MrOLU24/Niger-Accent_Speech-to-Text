import React, { useState } from 'react';
import { Mic, Pause, Play, Upload, Plus, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioInterfaceProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  activeMode: 'record' | 'upload';
  onModeChange: (mode: 'record' | 'upload') => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const AudioInterface: React.FC<AudioInterfaceProps> = ({
  isRecording,
  isPaused,
  recordingTime,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onFileUpload,
  isProcessing,
  activeMode,
  onModeChange,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const [dragCounter, setDragCounter] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(dragCounter + 1);
    onDragOver(e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(dragCounter - 1);
    if (dragCounter === 1) {
      onDragLeave(e);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(0);
    onDrop(e);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-2xl border border-gray-700 p-6">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-700 rounded-full p-1 flex">
          <Button
            variant={activeMode === 'record' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('record')}
            className={`rounded-full px-4 ${
              activeMode === 'record' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Mic className="w-4 h-4 mr-2" />
            Record
          </Button>
          <Button
            variant={activeMode === 'upload' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('upload')}
            className={`rounded-full px-4 ${
              activeMode === 'upload' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Recording Interface */}
      {activeMode === 'record' && (
        <div className="text-center space-y-6">
          {/* Recording Visualization */}
          <div className="relative">
            <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
              isRecording && !isPaused
                ? 'border-red-500 bg-red-500/10 animate-pulse' 
                : 'border-gray-600 bg-gray-700/50'
            }`}>
              {isRecording && !isPaused ? (
                <Mic className="w-12 h-12 text-red-500" />
              ) : (
                <Mic className="w-12 h-12 text-gray-400" />
              )}
            </div>
            
            {/* Recording Time */}
            {isRecording && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-200">
                  {formatTime(recordingTime)}
                </div>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center items-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={onStartRecording}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16"
              >
                <Mic className="w-6 h-6" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={isPaused ? onResumeRecording : onPauseRecording}
                  variant="outline"
                  className="rounded-full w-12 h-12 border-gray-600 text-gray-300 hover:text-white"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </Button>
                
                <Button
                  onClick={onStopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16"
                >
                  <Square className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>

          {/* Status Text */}
          <div className="text-gray-400 text-sm">
            {isProcessing 
              ? 'Processing your recording...' 
              : isRecording && !isPaused
              ? 'Recording in progress...'
              : isRecording && isPaused
              ? 'Recording paused'
              : 'Click to start recording'
            }
          </div>
        </div>
      )}

      {/* Upload Interface */}
      {activeMode === 'upload' && (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragOver 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center ${
              isDragOver ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 bg-gray-700/50'
            }`}>
              <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-2">
                {isDragOver ? 'Drop your audio file here' : 'Upload audio file'}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Drag and drop or click to select • MP3, WAV, M4A
              </p>
              
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
                id="audio-upload"
                disabled={isProcessing}
              />
              
              <label
                htmlFor="audio-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Choose File
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioInterface;
