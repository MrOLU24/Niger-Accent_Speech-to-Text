import { NextRequest, NextResponse } from 'next/server';

// Your actual deployed backend URLs
const API_BASE_URL = process.env.BACKEND_API_URL || 'https://toritype.onrender.com';

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }
    
    // Log file details for debugging
    console.log('Received audio file:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });
    
    // Forward the request to your actual backend
  try {
      const backendFormData = new FormData();
      backendFormData.append('file', audioFile, audioFile.name);
      
      console.log(`Calling backend API: ${API_BASE_URL}/transcription/transcribe`);
      console.log('File details:', {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type
      });
      
      const response = await fetch(`${API_BASE_URL}/transcription/transcribe`, {
        method: 'POST',
        body: backendFormData,
        // Don't set headers - let fetch handle multipart/form-data boundary
      });
      
      console.log(`Backend response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend API error: ${response.status} - ${errorText}`);
        throw new Error(`Backend API error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      
      // Return the transcription in the expected format
      return NextResponse.json({
        text: result.text,
        transcription: result.text, // For backward compatibility
        status: 'success',
        language_detected: result.language_detected,
        pidgin_confidence: result.pidgin_confidence,
        sentiment: result.sentiment
      });
      
    } catch (backendError) {
      console.error('Backend API call failed:', backendError);
      console.error('API Base URL:', API_BASE_URL);
      console.error('Full URL:', `${API_BASE_URL}/transcription/transcribe`);
      
      // Return error response
      const msg = backendError instanceof Error ? backendError.message : 'Unknown error';
      const isFetchFailed = typeof msg === 'string' && msg.toLowerCase().includes('fetch failed');
      return NextResponse.json({
        error: isFetchFailed
          ? 'We could not complete the transcription. Please re-record in a quiet place and speak up.'
          : 'Transcription service temporarily unavailable. Please try again later.',
        error_code: isFetchFailed ? 'FETCH_FAILED' : 'BACKEND_ERROR',
        details: msg,
        debug_info: {
          api_base_url: API_BASE_URL,
          endpoint: '/transcription/transcribe',
          full_url: `${API_BASE_URL}/transcription/transcribe`
        }
      }, { status: 503 });
    }
    
  } catch (error) {
    console.error('Error processing transcription:', error);
    return NextResponse.json(
      { error: 'Internal server error during transcription' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Check backend health using the root endpoint
    const response = await fetch(`${API_BASE_URL}/`, { 
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/json'
      }
    });
    
    if (response.ok) {
      return NextResponse.json({
        status: 'healthy',
        message: 'Transcription API is running',
        backend_status: 'connected',
        backend_url: API_BASE_URL,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        status: 'degraded',
        message: 'Frontend API running, backend unavailable',
        backend_status: 'disconnected',
        backend_response_status: response.status,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      message: 'Frontend API running, backend unreachable',
      backend_status: 'error',
      backend_url: API_BASE_URL,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
