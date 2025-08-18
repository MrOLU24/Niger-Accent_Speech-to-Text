'use client';

import { Button } from '../ui/button';
import { 
  Mic, 
  Play, 
  Pause, 
  Square 
} from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
}

export default function RecordingControls({
  isRecording,
  isPaused,
  recordingTime,
  startRecording,
  pauseRecording,
  stopRecording
}: RecordingControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      {/* Timer */}
      <div className="text-xl sm:text-2xl font-mono font-bold text-gray-900 dark:text-white">
        {formatTime(recordingTime)}
      </div>

      {/* Recording Button */}
      {!isRecording ? (
        <Button
          onClick={startRecording}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#0db2f3] to-blue-500 hover:from-[#0db2f3]/80 hover:to-blue-500/80 shadow-lg shadow-[#0db2f3]/30 transition-all duration-300 hover:scale-105"
        >
          <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            onClick={pauseRecording}
            variant="outline"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
          >
            {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
          
          <Button
            onClick={stopRecording}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all duration-300"
          >
            <Square className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
          </Button>
        </div>
      )}

      {/* Status */}
      {isRecording && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          {isPaused ? 'Recording Paused' : 'Recording in Progress'}
        </div>
      )}
    </div>
  );
}
