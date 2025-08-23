from pathlib import Path
from datetime import datetime, timezone
from bson import ObjectId
import whisper
import tempfile
import os
from app.api.transcription.schemas import TranscriptionInDB
from app.core.settings import settings
from app.utils.pidgin_processor import PidginProcessor

USE_MOCK = getattr(settings, "USE_OPENAI_MOCK", False)  # Default to using Whisper


class TranscriptionService:
    def __init__(self):
        # Load Whisper model (using 'base' for speed, can upgrade to 'large' for accuracy)
        if not USE_MOCK:
            self.model = whisper.load_model("base")
        else:
            self.model = None
        
        # Initialize Nigerian Pidgin processor
        self.pidgin_processor = PidginProcessor()

    async def transcribe_audio(self, file_path: Path, filename: str) -> TranscriptionInDB:
        from app.core.db import audio_transcripts_collection  # dynamic import

        # Handle mock or real Whisper transcription
        if self.model is None:
            text = f"Mock transcription for {filename} at {datetime.now(timezone.utc).isoformat()}"
        else:
            # Use local Whisper model for transcription
            result = self.model.transcribe(str(file_path))
            raw_text = result["text"]
            
            # Process to preserve authentic Nigerian Pidgin
            pidgin_confidence = self.pidgin_processor.get_pidgin_confidence(raw_text)
            
            # Always preserve Pidgin expressions without converting to English
            if pidgin_confidence > 0.2:  # Lower threshold for better detection
                text = self.pidgin_processor.process_text(raw_text, preserve_pidgin=True)
            else:
                # Still clean up the text but don't force Pidgin patterns
                text = self.pidgin_processor.process_text(raw_text, preserve_pidgin=False)
            
            # Clean up temporary file
            try:
                os.unlink(file_path)
            except:
                pass

        # Store in MongoDB (collection fetched dynamically)
        doc = TranscriptionInDB(filename=filename, text=text)
        result = await audio_transcripts_collection.insert_one(doc.model_dump())
        doc.id = result.inserted_id
        return doc

    async def get_transcription_by_id(self, transcription_id: str) -> TranscriptionInDB | None:
        from app.core.db import audio_transcripts_collection  # dynamic import
        doc = await audio_transcripts_collection.find_one({"_id": ObjectId(transcription_id)})
        if not doc:
            return None
        return TranscriptionInDB(**doc)
