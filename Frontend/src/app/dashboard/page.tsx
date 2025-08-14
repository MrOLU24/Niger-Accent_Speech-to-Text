'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { 
  Mic, 
  MicOff, 
  Upload, 
  Download, 
  Play, 
  Pause, 
  Square, 
  FileAudio, 
  History, 
  Settings, 
  User,
  LogOut,
  Home,
  Trash2,
  Copy,
  Check
} from 'lucide-react';

interface Recording {
  id: string;
  name: string;
  duration: string;
  transcript: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: '1',
      name: 'Recording 1',
      duration: '2:34',
      transcript: 'Wetin dey happen for Nigeria today? The government need to...',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2', 
      name: 'Recording 2',
      duration: '1:45',
      transcript: 'Good morning, how you dey? I want talk about...',
      timestamp: '1 day ago',
      status: 'completed'
    }
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };
    getUser();
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setCurrentTranscript('');
      
      mediaRecorder.start();
      
      setCurrentTranscript('Starting transcription...');
      
      setTimeout(() => {
        setCurrentTranscript('How you dey? I wan talk about...');
      }, 3000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not start recording. Please check microphone permissions.');
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
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
    
    const newRecording: Recording = {
      id: Date.now().toString(),
      name: `Recording ${recordings.length + 1}`,
      duration: formatTime(recordingTime),
      transcript: currentTranscript || 'Transcription completed successfully.',
      timestamp: 'Just now',
      status: 'completed'
    };
    
    setRecordings(prev => [newRecording, ...prev]);
    setRecordingTime(0);
    setCurrentTranscript('');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const copyTranscript = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0e0f16] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0db2f3]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0f16]">
      <nav className="sticky top-0 z-50 bg-[#0e0f16]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-xl flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#0db2f3] to-blue-400 bg-clip-text text-transparent">
                  ToriType
                </h1>
                <p className="text-xs text-white/60">Dashboard</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button className="flex items-center space-x-2 text-white/80 hover:text-[#0db2f3] transition-colors">
                <Home className="w-4 h-4" />
                <span>Overview</span>
              </button>
              <button className="flex items-center space-x-2 text-[#0db2f3] transition-colors">
                <Mic className="w-4 h-4" />
                <span>Record</span>
              </button>
              <button className="flex items-center space-x-2 text-white/80 hover:text-[#0db2f3] transition-colors">
                <History className="w-4 h-4" />
                <span>History</span>
              </button>
              <button className="flex items-center space-x-2 text-white/80 hover:text-[#0db2f3] transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user.user_metadata?.avatar_url || '/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-[#0db2f3]/30"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-white/60">{user.email}</p>
                </div>
              </div>
              
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-lg flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                Voice Recording
              </h2>
              
              <div className="text-center space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-white mb-2">
                    {formatTime(recordingTime)}
                  </div>
                  {isRecording && (
                    <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      {isPaused ? 'Recording Paused' : 'Recording in Progress'}
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="w-20 h-20 rounded-full bg-gradient-to-r from-[#0db2f3] to-blue-500 hover:from-[#0db2f3]/80 hover:to-blue-500/80 shadow-lg shadow-[#0db2f3]/30 transition-all duration-300 hover:scale-105"
                    >
                      <Mic className="w-8 h-8 text-white" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={pauseRecording}
                        variant="outline"
                        className="w-12 h-12 rounded-full border-white/20 text-white hover:bg-white/10"
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      </Button>
                      
                      <Button
                        onClick={stopRecording}
                        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all duration-300"
                      >
                        <Square className="w-6 h-6 text-white fill-current" />
                      </Button>
                    </div>
                  )}
                </div>

                {isRecording && currentTranscript && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left">
                    <h3 className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#0db2f3] rounded-full animate-pulse"></div>
                      Live Transcript
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">{currentTranscript}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Upload className="w-5 h-5 text-[#0db2f3]" />
                Upload Audio File
              </h3>
              
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#0db2f3]/50 transition-colors cursor-pointer">
                <FileAudio className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 mb-2">Drop your audio file here or click to browse</p>
                <p className="text-white/60 text-sm">Supports MP3, WAV, M4A (Max 100MB)</p>
                <Button className="mt-4 bg-gradient-to-r from-[#0db2f3] to-blue-500">
                  Choose File
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <History className="w-6 h-6 text-[#0db2f3]" />
                Recent Recordings
              </h2>

              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div key={recording.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{recording.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <FileAudio className="w-3 h-3" />
                            {recording.duration}
                          </span>
                          <span>{recording.timestamp}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            recording.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            recording.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {recording.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => copyTranscript(recording.transcript, recording.id)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 border-white/20 text-white hover:bg-white/10"
                        >
                          {copiedId === recording.id ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 border-white/20 text-white hover:bg-white/10"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => deleteRecording(recording.id)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 border-red-500/20 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
                        {recording.transcript}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4 border-white/20 text-white hover:bg-white/10">
                View All Recordings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
