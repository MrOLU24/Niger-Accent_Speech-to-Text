'use client';

import { Button } from '../ui/button';
import { 
  Copy, 
  Check, 
  Download, 
  FileAudio, 
  Edit3, 
  Save, 
  RotateCcw 
} from 'lucide-react';

interface TranscriptionDisplayProps {
  transcriptText: string;
  isEditing: boolean;
  editableText: string;
  isCopied: boolean;
  isProcessing: boolean;
  apiStatus: 'idle' | 'connecting' | 'connected' | 'error';
  audioBlob: Blob | null;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  setEditableText: (text: string) => void;
  handleCopyText: () => void;
  handleEditStart: () => void;
  handleEditSave: () => void;
  handleEditCancel: () => void;
  downloadTranscript: () => void;
  downloadAudio: () => void;
}

export default function TranscriptionDisplay({
  transcriptText,
  isEditing,
  editableText,
  isCopied,
  isProcessing,
  apiStatus,
  audioBlob,
  textareaRef,
  setEditableText,
  handleCopyText,
  handleEditStart,
  handleEditSave,
  handleEditCancel,
  downloadTranscript,
  downloadAudio
}: TranscriptionDisplayProps) {

  return (
    <div className="flex-1 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Transcription</h2>
          
          {/* API status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              apiStatus === 'connected' ? 'bg-green-500' :
              apiStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              apiStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {apiStatus === 'connected' ? 'API Connected' :
               apiStatus === 'connecting' ? 'Connecting...' :
               apiStatus === 'error' ? 'Mock Mode' : 'Checking...'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            onClick={handleCopyText}
            variant="outline"
            size="sm"
            className="bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20"
          >
            {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {isCopied ? 'Copied!' : 'Copy'}
          </Button>
          
          <Button
            onClick={downloadTranscript}
            variant="outline"
            size="sm"
            className="bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          {audioBlob && (
            <Button
              onClick={downloadAudio}
              variant="outline"
              size="sm"
              className="bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20"
            >
              <FileAudio className="w-4 h-4 mr-2" />
              Audio
            </Button>
          )}
          
          {!isEditing ? (
            <Button
              onClick={handleEditStart}
              variant="outline"
              size="sm"
              className="bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleEditSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleEditCancel}
                variant="outline"
                size="sm"
                className="bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          className="flex-1 min-h-[300px] sm:min-h-[400px] p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-[#0db2f3] focus:border-[#0db2f3] outline-none"
          placeholder="Your transcription will appear here..."
        />
      ) : (
        <div className="flex-1 min-h-[300px] sm:min-h-[400px] p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-y-auto relative">
          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center backdrop-blur-sm rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0db2f3]"></div>
                <span className="text-gray-900 dark:text-white font-medium">Processing audio...</span>
              </div>
            </div>
          )}
          <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
            {transcriptText}
          </p>
        </div>
      )}
    </div>
  );
}
