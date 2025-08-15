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
  Menu
} from 'lucide-react';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface Recording {
  id: string;
  name: string;
  duration: string;
  transcript: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [activeTab, setActiveTab] = useState('record');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      setShowUploadModal(false);
      // TODO: Implement file upload logic
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'record', label: 'Record', icon: Mic },
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
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-[#0db2f3]/20 text-[#0db2f3] border border-[#0db2f3]/30'
                      : 'text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
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
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          {activeTab === 'record' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Voice Recording Studio</h2>
                <p className="text-gray-600 dark:text-white/60">Record your voice and get instant Nigerian-English transcriptions</p>
              </div>

              {/* Recording Interface */}
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-3xl p-8 mb-8">
                <div className="text-center space-y-8">
                  {/* Timer */}
                  <div>
                    <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                      {formatTime(recordingTime)}
                    </div>
                    {isRecording && (
                      <div className="flex items-center justify-center gap-2 text-white/60">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-lg">{isPaused ? 'Recording Paused' : 'Recording in Progress'}</span>
                      </div>
                    )}
                  </div>

                  {/* Recording Controls */}
                  <div className="flex justify-center items-center gap-6">
                    {!isRecording ? (
                      <>
                        <Button
                          onClick={startRecording}
                          className="w-24 h-24 rounded-full bg-gradient-to-r from-[#0db2f3] to-blue-500 hover:from-[#0db2f3]/80 hover:to-blue-500/80 shadow-lg shadow-[#0db2f3]/30 transition-all duration-300 hover:scale-105"
                        >
                          <Mic className="w-10 h-10 text-white" />
                        </Button>
                        
                        <Button
                          onClick={() => setShowUploadModal(true)}
                          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 hover:scale-105"
                        >
                          <Plus className="w-8 h-8 text-white" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={pauseRecording}
                          variant="outline"
                          className="w-16 h-16 rounded-full border-white/20 text-white hover:bg-white/10"
                        >
                          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                        </Button>
                        
                        <Button
                          onClick={stopRecording}
                          className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all duration-300"
                        >
                          <Square className="w-8 h-8 text-white fill-current" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Live Transcript */}
                  {isRecording && currentTranscript && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
                      <h3 className="text-lg font-medium text-white/80 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#0db2f3] rounded-full animate-pulse"></div>
                        Live Transcript
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed">{currentTranscript}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#0db2f3] mb-1">{recordings.length}</div>
                  <div className="text-white/60 text-sm">Total Recordings</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">98.5%</div>
                  <div className="text-white/60 text-sm">Accuracy Rate</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {recordings.reduce((total, r) => {
                      const [mins, secs] = r.duration.split(':').map(Number);
                      return total + mins + (secs / 60);
                    }, 0).toFixed(1)}m
                  </div>
                  <div className="text-white/60 text-sm">Total Duration</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Recording History</h2>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Export All
                </Button>
              </div>

              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div key={recording.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-2">{recording.name}</h3>
                        <div className="flex items-center gap-6 text-sm text-white/60">
                          <span className="flex items-center gap-2">
                            <FileAudio className="w-4 h-4" />
                            {recording.duration}
                          </span>
                          <span>{recording.timestamp}</span>
                          <span className={`px-3 py-1 rounded-full text-xs ${
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
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          {copiedId === recording.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteRecording(recording.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/90 leading-relaxed">{recording.transcript}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recordings.slice(0, 3).map((recording) => (
                      <div key={recording.id} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#0db2f3] rounded-full"></div>
                        <span className="text-white/80">{recording.name}</span>
                        <span className="text-white/60">{recording.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setActiveTab('record')}
                      className="w-full bg-gradient-to-r from-[#0db2f3] to-blue-500 justify-start"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Start New Recording
                    </Button>
                    <Button 
                      onClick={() => setShowUploadModal(true)}
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10 justify-start"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Audio File
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Recording Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-white/80">Auto-save recordings</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-white/80">Real-time transcription</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Language Settings</h3>
                    <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                      <option value="en-ng">Nigerian English</option>
                      <option value="pcm">Nigerian Pidgin</option>
                      <option value="en-us">American English</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0b0f] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Upload Audio File</h3>
              <Button
                onClick={() => setShowUploadModal(false)}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#0db2f3]/50 transition-colors">
              <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <p className="text-white/80 mb-2">Drop your audio file here or click to browse</p>
              <p className="text-white/60 text-sm mb-4">Supports MP3, WAV, M4A (Max 100MB)</p>
              
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0db2f3] to-blue-500 text-white rounded-lg cursor-pointer hover:from-[#0db2f3]/80 hover:to-blue-500/80 transition-all"
              >
                <FileAudio className="w-4 h-4" />
                Choose File
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
