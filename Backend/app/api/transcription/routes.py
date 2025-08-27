from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.security import create_access_token
from pathlib import Path
import tempfile
from app.api.transcription.services import TranscriptionService
from app.api.transcription.schemas import TranscriptionResponse, SentimentAnalysisRequest, SentimentAnalysisResponse

router = APIRouter(prefix="/transcription", tags=["transcription"])

# Create a single service instance (client & collection handled inside service)
service = TranscriptionService()


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        tmp.write(await file.read())
        tmp_path = Path(tmp.name)

    # All logic handled inside the service
    doc = await service.transcribe_audio(tmp_path, file.filename)
    return TranscriptionResponse(
        id=str(doc.id), 
        text=doc.text,
        sentiment=doc.sentiment,
        language_detected=doc.language_detected,
        pidgin_confidence=doc.pidgin_confidence
    )


@router.get("/{transcription_id}", response_model=TranscriptionResponse)
async def get_transcription(transcription_id: str):
    doc = await service.get_transcription_by_id(transcription_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Transcription not found")
    return TranscriptionResponse(
        id=str(doc.id), 
        text=doc.text,
        sentiment=doc.sentiment,
        language_detected=doc.language_detected,
        pidgin_confidence=doc.pidgin_confidence
    )

@router.post("/sentiment", response_model=SentimentAnalysisResponse)
async def analyze_sentiment(request: SentimentAnalysisRequest):
    """Analyze sentiment of provided text"""
    sentiment_result = service.analyze_sentiment(request.text)
    return SentimentAnalysisResponse(
        text=request.text,
        sentiment=sentiment_result
    )

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # For now, accept any username/password (replace with DB check later)
    user_dict = {"sub": form_data.username}
    token = create_access_token(user_dict)
    return {"access_token": token, "token_type": "bearer"}