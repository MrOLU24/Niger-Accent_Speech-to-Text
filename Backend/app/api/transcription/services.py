from pathlib import Path
from datetime import datetime, timezone
from bson import ObjectId
from app.api.transcription.schemas import TranscriptionInDB
from app.core.settings import settings

USE_MOCK = getattr(settings, "USE_OPENAI_MOCK", True)


if not USE_MOCK:
    from openai import OpenAI


class TranscriptionService:
    def __init__(self):
        # Only create client if not using mock
        self.client = None if USE_MOCK else OpenAI(api_key=settings.OPENAI_API_KEY)

    async def transcribe_audio(self, file_path: Path, filename: str) -> TranscriptionInDB:
        from app.core.db import audio_transcripts_collection  # dynamic import

        # Handle mock or real OpenAI call
        if self.client is None:
            text = f"Mock transcription for {filename} at {datetime.now(timezone.utc).isoformat()}"
        else:
            with open(file_path, "rb") as audio_file:
                transcription_result = self.client.audio.transcriptions.create(
                    model="gpt-4o-transcribe",
                    file=audio_file
                )
                text = transcription_result.text

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
