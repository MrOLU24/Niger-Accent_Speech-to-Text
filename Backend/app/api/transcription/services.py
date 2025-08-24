from pathlib import Path
from datetime import datetime, timezone
from bson import ObjectId
import whisper
import tempfile
import os
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from peft import PeftModel
import librosa
from app.api.transcription.schemas import TranscriptionInDB
from app.core.settings import settings
from app.utils.pidgin_processor import PidginProcessor

USE_MOCK = getattr(settings, "USE_OPENAI_MOCK", False)  # Default to using Whisper


class TranscriptionService:
    def __init__(self):
        # Load Whisper model (using finetuned Nigerian Pidgin model)
        if not USE_MOCK:
            try:
                # Load your finetuned Nigerian Pidgin Whisper model
                base_model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")
                self.model = PeftModel.from_pretrained(
                    base_model, 
                    "/Users/mubarakojewale/Documents/Ravens/Niger-Accent_Speech-to-Text/Backend/whisper-pidgin-lora"
                )
                # Initialize processor without forcing English language
                self.processor = WhisperProcessor.from_pretrained("openai/whisper-small")
                # Remove language constraints to allow Pidgin output
                self.model.config.forced_decoder_ids = None
                self.model.config.suppress_tokens = []
                print("✅ Loaded finetuned Nigerian Pidgin Whisper model")
            except Exception as e:
                print(f"❌ Failed to load finetuned model: {e}")
                # Fallback to original whisper
                self.model = whisper.load_model("base")
                self.processor = None
        else:
            self.model = None
            self.processor = None
        
        # Initialize Nigerian Pidgin processor
        self.pidgin_processor = PidginProcessor()

    async def transcribe_audio(self, file_path: Path, filename: str) -> TranscriptionInDB:
        from app.core.db import audio_transcripts_collection  # dynamic import

        # Handle mock or real Whisper transcription
        if self.model is None:
            text = f"Mock transcription for {filename} at {datetime.now(timezone.utc).isoformat()}"
        else:
            # Use appropriate model for transcription
            if self.processor:  # Using finetuned HuggingFace model
                # Load and preprocess audio
                audio, _ = librosa.load(str(file_path), sr=16000)
                inputs = self.processor(audio, sampling_rate=16000, return_tensors="pt")
                
                # Generate transcription with parameters that encourage Pidgin output
                with torch.no_grad():
                    predicted_ids = self.model.generate(
                        inputs.input_features,
                        forced_decoder_ids=None,  # Don't force any specific language tokens
                        suppress_tokens=[],       # Don't suppress any tokens
                        do_sample=True,          # Enable sampling for more natural output
                        temperature=0.7,         # Slightly randomize to allow Pidgin expressions
                        max_length=448,          # Standard Whisper max length
                        num_beams=1              # Use greedy decoding for consistency
                    )
                
                raw_text = self.processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
            else:  # Fallback to original whisper
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
