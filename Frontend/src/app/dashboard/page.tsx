'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Menu, Mic, Upload, Square, Play, Pause, History, Settings, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import TranscriptionPanel from '@/components/dashboard/TranscriptionPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ActiveMode = 'record' | 'upload';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcriptText, setTranscriptText] = useState('');
  const [hasTranscript, setHasTranscript] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [activeMode, setActiveMode] = useState<ActiveMode>('record');
  // const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  // Removed sidebar logic
  const [apiStatus, setApiStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  const { theme, setTheme } = useTheme();
  const supabase = createClient();
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const getUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
    }
  }, [router, supabase.auth]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
  // setMounted(true);
    
    // Check API health on mount
    const testAPI = async () => {
      try {
        setApiStatus('connecting');
        // Test our Next.js API route health endpoint
        const response = await fetch('/api/transcribe', { method: 'GET' });
        if (response.ok) {
          const healthData = await response.json();
          setApiStatus(healthData.backend_status === 'connected' ? 'connected' : 'error');
        } else {
          setApiStatus('error');
        }
      } catch (err) { 
        console.error('API health check failed:', err);
        setApiStatus('error');
      }
    };
    
    testAPI();
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio processing functions - connect to real API through Next.js API route
  const sendAudioToAPI = async (audioData: Blob | File, isRecording: boolean = false) => {
    setIsProcessing(true);
    setTranscriptText(isRecording ? 'Processing recorded audio...' : 'Processing uploaded audio file...');
    setIsEditing(false);
    setIsCopied(false);
    
    try {
      // Basic silence/empty check by size
      if ('size' in audioData && audioData.size < 2000) {
        setTranscriptText('We couldn\'t detect any voice. Please re-record in a quiet place and speak up.');
        setHasTranscript(true);
        return;
      }

      const formData = new FormData();
      
      if (isRecording) {
        formData.append('audio', audioData, 'recording.webm');
      } else {
        formData.append('audio', audioData);
      }
      
      // Call our Next.js API route which forwards to the backend
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      let result: {
        text?: string;
        transcription?: string;
        language_detected?: string;
        pidgin_confidence?: number;
        sentiment?: unknown;
        error?: string;
        details?: string;
      } | undefined;
      if (!response.ok) {
        // Attempt to parse JSON; fallback to text
        try {
          result = await response.json();
        } catch {
          const txt = await response.text();
          throw new Error(txt || `API request failed: ${response.status}`);
        }
        const friendly =
          result?.details?.includes('fetch failed') || result?.error?.includes('fetch failed')
            ? 'We could not complete the transcription. Please re-record in a quiet place and speak up.'
            : (result?.error || `API request failed: ${response.status}`);
        throw new Error(friendly);
      } else {
        result = await response.json();
      }
      
      if (result && (result.text || result.transcription)) {
        const transcription = (result.text || result.transcription) as string;
        setTranscriptText(transcription);
        setHasTranscript(true);
        setApiStatus('connected');
      } else {
        throw new Error('No transcription received from API');
      }
      
    } catch (error) {
      console.error('Error sending audio to API:', error);
      setApiStatus('error');
      const message = error instanceof Error ? error.message : '';
      if (typeof message === 'string' && message.toLowerCase().includes('fetch failed')) {
        setTranscriptText('We couldn\'t hear anything. Please re-record in a quiet place and speak up.');
      } else {
        setTranscriptText(
          error instanceof Error 
            ? `Failed to transcribe audio: ${error.message}`
            : 'Failed to transcribe audio. Please check your connection and try again.'
        );
      }
      setHasTranscript(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const processAudioFile = async (file: File) => {
    await sendAudioToAPI(file, false);
  };

  const processAudioBlob = async (blob: Blob) => {
    await sendAudioToAPI(blob, true);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(transcriptText);
  setIsCopied(true);
  setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcriptText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `toritype-transcript-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg', 'audio/webm', 'audio/ogg'];
      
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid audio file (MP3, WAV, M4A, WEBM, OGG)');
        return;
      }
      
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert('File size must be less than 100MB');
        return;
      }
      
      await processAudioFile(file);
    }
    
    event.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg', 'audio/webm', 'audio/ogg'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid audio file (MP3, WAV, M4A, WEBM, OGG)');
        return;
      }
      
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert('File size must be less than 100MB');
        return;
      }
      
      await processAudioFile(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      const options = {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4'
      };
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
  const blob = new Blob(chunks, { type: options.mimeType });
  // setAudioBlob(blob);
  processAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      mediaRecorder.start(100);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      let errorMessage = 'Could not start recording. ';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage += 'Please allow microphone access and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No microphone found. Please connect a microphone and try again.';
        } else {
          errorMessage += 'Please check your microphone and try again.';
        }
      } else {
        errorMessage += 'Please check your microphone and try again.';
      }
      alert(errorMessage);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsPaused(!isPaused);
      if (!isPaused) {
        mediaRecorderRef.current.pause();
      } else {
        mediaRecorderRef.current.resume();
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    if (!user) return 'User';
    const name = user.user_metadata?.name || user.email || 'User';
    if (name.includes('@')) {
      return name.split('@')[0].split('.')[0];
    }
    return name.split(' ')[0];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Modern Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo only */}
            <div className="flex items-center gap-4">
              <div className="font-semibold text-xl text-gray-900 dark:text-white">
                ToriType
              </div>
            </div>

            {/* Right side - User info and menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
                {getGreeting()}, {getUserName()}
              </div>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <UserIcon className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <History className="w-4 h-4 mr-2" />
                    History
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>



      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Transcription Panel - Show if processing or transcript available */}
          {(isProcessing || hasTranscript) && (
            <TranscriptionPanel
              transcriptText={transcriptText || 'Welcome to ToriType. Your transcription will appear here.'}
              isEditing={isEditing}
              editableText={editableText}
              isCopied={isCopied}
              isProcessing={isProcessing}
              onEditStart={() => {
                setEditableText(transcriptText);
                setIsEditing(true);
              }}
              onEditSave={() => {
                setTranscriptText(editableText);
                setIsEditing(false);
              }}
              onEditCancel={() => {
                setIsEditing(false);
                setEditableText(transcriptText);
              }}
              onTextChange={setEditableText}
              onCopy={handleCopyText}
              onDownload={downloadTranscript}
            />
          )}

          {/* Audio Interface - Always at bottom */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6">
              {/* Mode Selection */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setActiveMode('record')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeMode === 'record'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Record Audio
                </button>
                <button
                  onClick={() => setActiveMode('upload')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeMode === 'upload'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {/* Record Mode */}
              {activeMode === 'record' && (
                <div className="text-center">
                  <div className="mb-6">
                    <div className={`mx-auto w-20 h-20 border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all ${
                      isRecording ? 'bg-red-500 border-red-500 animate-pulse' : 'hover:border-blue-600'
                    }`}>
                      {isRecording ? (
                        <div className="w-6 h-6 bg-white"></div>
                      ) : (
                        <Mic className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isRecording && (
                    <div className="mb-4">
                      <div className="text-2xl font-mono text-gray-900 dark:text-white">
                        {formatTime(recordingTime)}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-4">
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={pauseRecording}
                          variant="outline"
                          className="px-4 py-2"
                        >
                          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={stopRecording}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Square className="w-5 h-5 mr-2" />
                          Stop
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Mode */}
              {activeMode === 'upload' && (
                <div
                  className={`border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center transition-colors ${
                    isDragOver ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Drag and drop your audio file here, or click to browse
                  </p>
                  <Button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Choose File
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Supports MP3, WAV, M4A, WEBM, OGG (max 100MB)
                  </p>
                </div>
              )}

              {/* API Status */}
              <div className="mt-4 text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium ${
                  apiStatus === 'connected' ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20' :
                  apiStatus === 'connecting' ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20' :
                  'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    apiStatus === 'connected' ? 'bg-green-500' :
                    apiStatus === 'connecting' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  {apiStatus === 'connected' ? 'API Connected' :
                   apiStatus === 'connecting' ? 'Connecting...' :
                   'API Disconnected'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
