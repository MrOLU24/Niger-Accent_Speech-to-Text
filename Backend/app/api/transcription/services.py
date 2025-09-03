from pathlib import Path
from datetime import datetime, timezone
from bson import ObjectId
import tempfile
import os
import httpx
from app.api.transcription.schemas import TranscriptionInDB
from app.core.settings import settings
from app.utils.pidgin_processor import PidginProcessor


USE_MOCK = getattr(settings, "USE_OPENAI_MOCK", False)  # Default to using remote service now


class TranscriptionService:
    def __init__(self):
        # Remote ML service URL (Hugging Face Space)
        self.ml_service_url = getattr(settings, "ML_SERVICE_URL", None)
        if not self.ml_service_url:
            print("⚠️ ML_SERVICE_URL is not set. Transcription will fail until configured.")

        # Use remote sentiment by default
        self.sentiment_remote = True
        self.sentiment_service_url = getattr(settings, "SENTIMENT_SERVICE_URL", None) or self.ml_service_url

        # Lightweight local processors
        self.pidgin_processor = PidginProcessor()

    def analyze_sentiment(self, text: str) -> dict:
        """
        Analyze sentiment of text with improved error handling and preprocessing
        
        Args:
            text: Text to analyze
            
        Returns:
            dict: Sentiment analysis results with label, score, confidence, and model info
        """
        if not text or not text.strip():
            return {
                "sentiment": "unknown",
                "label": "UNKNOWN",
                "score": 0.0,
                "confidence": "low",
                "model_used": "none",
                "error": "Empty text"
            }
            
        try:
            if self.sentiment_remote and self.sentiment_service_url:
                payload = {"text": text}
                with httpx.Client(timeout=60.0) as client:
                    resp = client.post(f"{self.sentiment_service_url}/sentiment", json=payload)
                resp.raise_for_status()
                data = resp.json()
                # Expecting { label, score } or custom format; normalize
                label = (data.get("label") or data.get("sentiment") or "UNKNOWN").upper()
                score = float(data.get("score") or data.get("confidence", 0.0))
                sentiment = "positive" if "POS" in label else ("negative" if "NEG" in label else "neutral")
                confidence = "high" if score > 0.85 else ("medium" if score > 0.65 else "low")
                return {
                    "sentiment": sentiment,
                    "label": label,
                    "score": round(score, 3),
                    "confidence": confidence,
                    "model_used": data.get("model", "remote")
                }
        except Exception as e:
            print(f"⚠️ Remote sentiment failed: {e}")
        
        # Fallback
        return {
            "sentiment": "unknown",
            "label": "UNKNOWN",
            "score": 0.0,
            "confidence": "low",
            "model_used": "none",
            "error": "Sentiment unavailable"
        }

    async def transcribe_audio(self, file_path: Path, filename: str) -> TranscriptionInDB:
        from app.core.db import audio_transcripts_collection  # dynamic import

        if not self.ml_service_url:
            raise RuntimeError("ML_SERVICE_URL is not configured")

        try:
            # Send file to remote ML service
            with open(file_path, "rb") as f:
                files = {"audio": (filename, f, "application/octet-stream")}
                with httpx.Client(timeout=120.0) as client:
                    resp = client.post(f"{self.ml_service_url}/transcribe", files=files)
            resp.raise_for_status()
            data = resp.json()
            raw_text = data.get("text", "")
            language_detected = data.get("language", "unknown")

            # Process and enrich
            pidgin_confidence = self.pidgin_processor.get_pidgin_confidence(raw_text)  # type: ignore
            preserve = pidgin_confidence > 0.1
            text = self.pidgin_processor.process_text(raw_text, preserve_pidgin=preserve)  # type: ignore

            # Sentiment
            sentiment_result = self.analyze_sentiment(text)

        finally:
            try:
                os.unlink(file_path)
            except Exception:
                pass

        # Store in MongoDB
        doc = TranscriptionInDB(
            filename=filename,
            text=text,
            sentiment=sentiment_result,
            language_detected=language_detected,
            pidgin_confidence=round(pidgin_confidence, 3),
        )
        result = await audio_transcripts_collection.insert_one(doc.model_dump())
        doc.id = result.inserted_id
        return doc

    async def get_transcription_by_id(self, transcription_id: str) -> TranscriptionInDB | None:
        from app.core.db import audio_transcripts_collection  # dynamic import
        doc = await audio_transcripts_collection.find_one({"_id": ObjectId(transcription_id)})
        if not doc:
            return None
        return TranscriptionInDB(**doc)
