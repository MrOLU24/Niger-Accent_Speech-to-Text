import { NextRequest, NextResponse } from 'next/server';

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
    
    // TODO: Replace this with actual API call to your Python backend
    // For now, simulate processing time and return mock transcription
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock transcription response
    const mockTranscriptions = [
      "Wetin dey happen for Nigeria today? The economy don dey struggle, but we still dey hope say things go better. The people dem need good leadership wey go carry everybody along.",
      "How far? This na one very important matter wey we dey discuss. The educational system for Nigeria need serious reform. We suppose get quality education for all our children dem.",
      "My brother, the healthcare system for this country need urgent attention. Too many people dey suffer because dem no get access to proper medical care. Government suppose do something about am.",
      "Na so e supposed be, but reality different. The infrastructure for Nigeria still dey lag behind. We need good roads, stable electricity, and clean water for everybody.",
      "You know say technology don change everything for this world. Nigeria suppose embrace digital transformation to compete with other countries globally."
    ];
    
    const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    
    // Return the transcription in the expected format
    return NextResponse.json({
      transcription: randomTranscription,
      status: 'success',
      processing_time: '2.1s',
      confidence: 0.95
    });
    
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
  return NextResponse.json({
    status: 'healthy',
    message: 'Transcription API is running',
    timestamp: new Date().toISOString()
  });
}
