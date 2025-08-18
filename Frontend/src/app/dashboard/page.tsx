'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '../../components/ui/button';
import Image from 'next/image';
import { 
  Mic, 
  Upload, 
  Download, 
  Play, 
  Pause, 
  Square, 
  FileAudio, 
  History, 
  Settings, 
  LogOut,
  Home,
  Trash2,
  Copy,
  Check,
  Plus,
  X,
  Sun,
  Moon,
  Menu,
  MessageCircle,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcriptText, setTranscriptText] = useState('Welcome to ToriType! Start recording or upload an audio file to see your transcription here...');
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [activeMode, setActiveMode] = useState<'record' | 'chat' | 'upload'>('record');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const { resolvedTheme, setTheme } = useTheme();
  
  const supabase = createClient();
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
    setMounted(true);
    
    // Test API connection on component mount
    const testAPI = async () => {
      try {
        setApiStatus('connecting');
        const response = await fetch('/api/health', { method: 'GET' });
        if (response.ok) {
          setApiStatus('connected');
        } else {
          setApiStatus('error');
        }
      } catch (error) {
        console.log('API not available, using mock mode');
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

  // Audio processing functions
  const sendAudioToAPI = async (audioData: Blob | File, isRecording: boolean = false) => {
    setIsProcessing(true);
    setTranscriptText(isRecording ? 'Processing recorded audio...' : 'Processing uploaded audio file...');
    
    try {
      // Create FormData for multipart/form-data payload
      const formData = new FormData();
      
      // Add the audio data to the form
      if (isRecording) {
        formData.append('audio', audioData, 'recording.webm');
      } else {
        formData.append('audio', audioData);
      }
      
      // Send fetch request to the /transcribe API endpoint
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      
      // Display the transcribed text from the API response
      if (result.transcription || result.text) {
        const transcription = result.transcription || result.text;
        setTranscriptText(transcription);
        setApiStatus('connected');
      } else {
        throw new Error('No transcription received from API');
      }
      
      // Update filename for uploads
      if (!isRecording && audioData instanceof File) {
        setUploadedFileName(audioData.name);
      }
      
    } catch (error) {
      console.error('Error sending audio to API:', error);
      setApiStatus('error');
      
      // Fallback to mock transcription for development/demo
      console.log('Falling back to mock transcription...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTranscription = isRecording 
        ? `⚠️ API not available - Mock transcription:\n\nRecording completed and processed.\n\nTranscribed Nigerian English/Pidgin:\n\n"Wetin dey happen for Nigeria today? The government need to do better for the people dem. We suppose get good infrastructure, better healthcare, and quality education for everybody. Na so e suppose be."\n\nDuration: ${formatTime(recordingTime)}\n\n[Note: This is a demo. Connect to your backend API for real transcription.]`
        : `⚠️ API not available - Mock transcription:\n\nFile: "${(audioData as File).name}" processed successfully.\n\nSimulated transcription of Nigerian English/Pidgin:\n\n"Wetin dey happen? This na one sample transcription from your audio file. For real implementation, this go connect to speech-to-text API wey go understand Nigerian accent and Pidgin English. The system go process the audio and return the transcribed text for you to see and edit."\n\n[Note: This is a demo. Connect to your backend API for real transcription.]`;
      
      setTranscriptText(mockTranscription);
      
      if (!isRecording && audioData instanceof File) {
        setUploadedFileName(audioData.name);
      }
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

  // New functions for the updated interface
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(transcriptText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setEditableText(transcriptText);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleEditSave = () => {
    setTranscriptText(editableText);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditableText(transcriptText);
    setIsEditing(false);
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `toritype-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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

  const triggerFileUpload = () => {
    if (!isProcessing) {
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload triggered:', event);
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    
    if (file) {
      // Validate file type
      const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg', 'audio/webm', 'audio/ogg'];
      console.log('File type:', file.type);
      
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid audio file (MP3, WAV, M4A, WEBM, OGG)');
        return;
      }
      
      // Validate file size (100MB max)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert('File size must be less than 100MB');
        return;
      }
      
      console.log('Processing file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
      await processAudioFile(file);
    }
    
    // Reset input
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
      
      // Validate file type
      const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg', 'audio/webm', 'audio/ogg'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid audio file (MP3, WAV, M4A, WEBM, OGG)');
        return;
      }
      
      // Validate file size (100MB max)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert('File size must be less than 100MB');
        return;
      }
      
      console.log('Processing dropped file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
      await processAudioFile(file);
    }
  };

  const startRecording = async () => {
    try {
      // Request microphone access with high-quality settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      // Create MediaRecorder with appropriate MIME type
      const options = {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4'
      };
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      // Reset audio chunks for new recording
      const chunks: Blob[] = [];
      setAudioChunks(chunks);
      
      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          setAudioChunks([...chunks]);
        }
      };
      
      // Handle recording stop event
      mediaRecorder.onstop = () => {
        // Create blob from recorded chunks
        const audioBlob = new Blob(chunks, { type: options.mimeType });
        setAudioBlob(audioBlob);
        
        // Send audio to API for transcription
        processAudioBlob(audioBlob);
        
        // Stop all media tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Update UI state
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setTranscriptText('🎤 Recording started... Speak clearly for best results!');
      
      // Start recording (collect data every 100ms for smoother processing)
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
      setTranscriptText('Unable to start recording. Please check microphone permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsPaused(!isPaused);
      if (!isPaused) {
        mediaRecorderRef.current.pause();
        setTranscriptText(prev => prev + '\n\n⏸️ Recording paused...');
      } else {
        mediaRecorderRef.current.resume();
        setTranscriptText(prev => prev + '\n\n▶️ Recording resumed...');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      
      setTranscriptText('🛑 Recording stopped. Processing audio...');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f16] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0db2f3]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f16] flex">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="outline"
          size="sm"
          className="bg-white dark:bg-[#0a0b0f] border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`
        w-64 bg-white dark:bg-[#0a0b0f] border-r border-gray-200 dark:border-white/10 flex flex-col
        lg:relative lg:translate-x-0
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Close Button for Mobile */}
        <div className="lg:hidden p-4 flex justify-end">
          <Button
            onClick={() => setSidebarOpen(false)}
            variant="outline"
            size="sm"
            className="bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-xl flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#0db2f3] to-blue-400 bg-clip-text text-transparent">
                ToriType
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60">Nigerian AI Platform</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Sign Out */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-100 dark:bg-white/5 rounded-xl">
            <Image
              src={user?.user_metadata?.avatar_url || '/default-avatar.png'}
              alt="Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-[#0db2f3]/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-gray-600 dark:text-white/60 truncate">{user?.email}</p>
            </div>
          </div>
          
          {/* Theme Toggle */}
          {mounted && (
            <div className="mb-4">
              <Button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                variant="outline"
                className="w-full bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/20"
              >
                {resolvedTheme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>
          )}
          
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 flex flex-col">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            
            {/* Transcription Display - Top with more space */}
            <div className="flex-1 min-h-0 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Transcription</h2>
                  
                  {/* API Status Indicator */}
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
                <div className="flex flex-wrap items-center gap-2">
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
                  className="w-full h-full min-h-[300px] sm:min-h-[400px] p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-[#0db2f3] focus:border-[#0db2f3] outline-none"
                  placeholder="Your transcription will appear here..."
                />
              ) : (
                <div className="h-full min-h-[300px] sm:min-h-[400px] p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-y-auto relative">
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

            {/* Control Buttons & Upload - Bottom */}
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
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
