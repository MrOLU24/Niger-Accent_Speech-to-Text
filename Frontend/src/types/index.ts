export interface TranscriptionResult {
  text: string;
  confidence: number;
  language: 'english' | 'pidgin' | 'auto';
  timestamp: Date;
  duration?: number;
}

export interface AudioFile {
  file: File;
  url: string;
  size: number;
  duration?: number;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
}

export interface TranscriptionRequest {
  audio: Blob | File;
  language?: 'auto' | 'en-ng' | 'pidgin';
  format: string;
}
