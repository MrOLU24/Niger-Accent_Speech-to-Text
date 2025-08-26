'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/dashboard/Sidebar';
import TranscriptionDisplay from '@/components/dashboard/TranscriptionDisplay';
import ControlPanel from '@/components/dashboard/ControlPanel';

type ActiveMode = 'record' | 'chat' | 'upload';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcriptText, setTranscriptText] = useState('Welcome to ToriType! Start recording or upload an audio file to see your transcription here...');
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [activeMode, setActiveMode] = useState<ActiveMode>('record');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

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
    
    // Check API health on mount
    const testAPI = async () => {
      try {
        setApiStatus('connecting');
        const response = await fetch('/api/health', { method: 'GET' });
        if (response.ok) {
          setApiStatus('connected');
        } else {
          setApiStatus('error');
        }
      } catch (err) {
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
    // Prepare audio for upload
      const formData = new FormData();
      
    // Attach audio data
      if (isRecording) {
        formData.append('audio', audioData, 'recording.webm');
      } else {
        formData.append('audio', audioData);
      }
      
    // POST audio to backend
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
      
    // Show transcription result
      if (result.transcription || result.text) {
        const transcription = result.transcription || result.text;
        setTranscriptText(transcription);
        setApiStatus('connected');
      } else {
        throw new Error('No transcription received from API');
      }
      
    // Save uploaded filename
      if (!isRecording && audioData instanceof File) {
        setUploadedFileName(audioData.name);
      }
      
    } catch (error) {
      console.error('Error sending audio to API:', error);
      setApiStatus('error');
      
    // Use mock transcription if API fails
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
      const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg', 'audio/webm', 'audio/ogg']; // Allowed audio formats
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
    event.target.value = ''; // Clear file input
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
      
      // Prepare audio chunks
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      // On stop: save, send, release mic
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: options.mimeType }); // Save audio blob
        setAudioBlob(audioBlob);
        processAudioBlob(audioBlob); // Transcribe audio
        stream.getTracks().forEach(track => track.stop()); // Release microphone
      };
      // Update recording state
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setTranscriptText('🎤 Recording started... Speak clearly for best results!');
      // Start recording
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
    <div className="lg:hidden fixed top-4 left-4 z-50"> {/* Mobile menu */}
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

      {/* Sidebar */}
      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mounted={mounted}
        handleSignOut={handleSignOut}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 flex flex-col">
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col gap-6">
            
            {/* Transcription Display */}
            <TranscriptionDisplay
              transcriptText={transcriptText}
              isEditing={isEditing}
              editableText={editableText}
              setEditableText={setEditableText}
              apiStatus={apiStatus}
              isCopied={isCopied}
              isProcessing={isProcessing}
              audioBlob={audioBlob}
              textareaRef={textareaRef}
              handleCopyText={handleCopyText}
              downloadTranscript={downloadTranscript}
              downloadAudio={downloadAudio}
              handleEditStart={handleEditStart}
              handleEditSave={handleEditSave}
              handleEditCancel={handleEditCancel}
            />

            {/* Control Panel */}
            <ControlPanel
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              isRecording={isRecording}
              isPaused={isPaused}
              recordingTime={recordingTime}
              isDragOver={isDragOver}
              isProcessing={isProcessing}
              uploadedFileName={uploadedFileName}
              startRecording={startRecording}
              pauseRecording={pauseRecording}
              stopRecording={stopRecording}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileUpload={handleFileUpload}
              triggerFileUpload={triggerFileUpload}
            />

          </div>
        </main>
      </div>
    </div>
  );
}
