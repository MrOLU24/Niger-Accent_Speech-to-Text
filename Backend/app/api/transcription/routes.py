from fastapi import APIRouter, HTTPException, UploadFile, File
from pathlib import Path
import tempfile
from app.api.transcription.services import TranscriptionService
from app.api.transcription.schemas import TranscriptionResponse

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
    return TranscriptionResponse(id=str(doc.id), text=doc.text)


@router.get("/{transcription_id}", response_model=TranscriptionResponse)
async def get_transcription(transcription_id: str):
    doc = await service.get_transcription_by_id(transcription_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Transcription not found")
    return TranscriptionResponse(id=str(doc.id), text=doc.text)
