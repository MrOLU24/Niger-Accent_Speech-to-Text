from pathlib import Path
from datetime import datetime, timezone
from bson import ObjectId
import whisper
import tempfile
import os
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from peft.peft_model import PeftModel
import librosa
from app.api.transcription.schemas import TranscriptionInDB
from app.core.settings import settings
from app.utils.pidgin_processor import PidginProcessor
import ffmpeg
from transformers import pipeline


USE_MOCK = getattr(settings, "USE_OPENAI_MOCK", False)  # Default to using Whisper


async def convert_to_wav(file_path: Path) -> Path:
    """Convert uploaded audio file to 16 kHz mono WAV."""
    out_file = Path(tempfile.mktemp(suffix=".wav"))
    
    try:
        (
            ffmpeg
            .input(str(file_path))
            .output(str(out_file), ar=16000, ac=1, format='wav')
            .run(overwrite_output=True, quiet=True)
        )
        print(f"✅ Successfully converted {file_path.name} to WAV format")
        return out_file
    
    except ffmpeg.Error as e:
        # Handle FFmpeg-specific errors
        error_msg = e.stderr.decode() if e.stderr else str(e)
        print(f"❌ FFmpeg conversion failed: {error_msg}")
        raise RuntimeError(f"Audio conversion failed: {error_msg}")
    
    except Exception as e:
        # Handle any other errors
        print(f"❌ Unexpected error during conversion: {str(e)}")
        raise RuntimeError(f"Audio conversion failed: {str(e)}")


class TranscriptionService:
    def __init__(self):
        if not USE_MOCK:
            try:
                # Load base Whisper model
                base_model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")

                # Resolve adapter path dynamically
                adapter_dir = Path(__file__).resolve().parent / "nigerian-whisper-lora-2k"
                if not adapter_dir.exists():
                    # fallback: look in project root
                    adapter_dir = Path(__file__).resolve().parents[2] / "nigerian-whisper-lora-2k"

                if not adapter_dir.exists():
                    raise FileNotFoundError(f"LoRA adapter not found at {adapter_dir}")

                print(f"🔍 Loading LoRA adapter from: {adapter_dir}")

                # Load fine-tuned model with adapter
                self.model = PeftModel.from_pretrained(base_model, str(adapter_dir))
                self.processor = WhisperProcessor.from_pretrained("openai/whisper-small", task="transcribe")

                # Ensure English+Transcribe mode
                tokenizer = self.processor.tokenizer
                english_token_id = tokenizer.convert_tokens_to_ids("<|en|>")
                transcribe_token_id = tokenizer.convert_tokens_to_ids("<|transcribe|>")

                if english_token_id and transcribe_token_id:
                    self.model.config.forced_decoder_ids = [
                        [1, english_token_id],
                        [2, transcribe_token_id]
                    ]
                    print("✅ English+Transcribe mode set")
                else:
                    self.model.config.forced_decoder_ids = None

                self.model.config.suppress_tokens = []
                print("✅ Finetuned Nigerian Pidgin Whisper model loaded")

            except Exception as e:
                print(f"❌ Failed to load finetuned model: {e}")
                print("👉 Falling back to base Whisper")
                import whisper
                self.model = whisper.load_model("base")
                self.processor = None
        else:
            self.model = None
            self.processor = None
        
        # Initialize Nigerian Pidgin processor
        self.pidgin_processor = PidginProcessor()
        
        # Initialize sentiment analyzer with improved error handling
        self.sentiment_analyzer = None
        self.sentiment_model_name = None
        self._initialize_sentiment_analyzer()

    def _initialize_sentiment_analyzer(self):
        """Initialize sentiment analyzer with fallback strategy"""
        print("📊 Initializing sentiment analyzer...")
        
        models_to_try = [
            
            {
                "name": "nlptown/bert-base-multilingual-uncased-sentiment", 
                "description": "Multilingual BERT for diverse language sentiment"
            },
            {
                "name": "distilbert-base-uncased-finetuned-sst-2-english",
                "description": "Lightweight English sentiment classifier"
            },
            {
                "name": "j-hartmann/emotion-english-distilroberta-base",
                "description": "Emotion classification (can be mapped to sentiment)"
            }
        ]
        
        for model_config in models_to_try:
            try:
                model_name = model_config["name"]
                description = model_config["description"]
                print(f"   Trying: {model_name} ({description})")
                
                self.sentiment_analyzer = pipeline(
                    "text-classification",
                    model=model_name,
                    return_all_scores=False,
                    device=-1  # Use CPU to avoid CUDA issues
                )
                
                # Test the model with a simple phrase
                test_result = self.sentiment_analyzer("I am happy")
                if test_result:
                    self.sentiment_model_name = model_name
                    print(f"✅ Successfully loaded: {model_name}")
                    return
                    
            except Exception as e:
                print(f"   ❌ Failed to load {model_config['name']}: {str(e)[:100]}...")
                continue
        
        print("⚠️ Could not load any sentiment analysis model")
        self.sentiment_analyzer = None
        self.sentiment_model_name = None

    def _preprocess_text_for_sentiment(self, text: str) -> str:
        """Preprocess text for better sentiment analysis"""
        if not text:
            return ""
            
        # Clean and normalize text
        text = text.strip()
        
        # Truncate very long texts (most models have token limits)
        if len(text) > 512:
            text = text[:512] + "..."
            
        return text

    def _normalize_sentiment_result(self, result: dict, model_name: str) -> dict:
        """Normalize different model outputs to consistent format"""
        raw_label = result.get("label", "UNKNOWN").upper()
        score = result.get("score", 0.0)
        
        # Handle different model output formats
        if "twitter-roberta" in model_name:
            # LABEL_0 (negative), LABEL_1 (neutral), LABEL_2 (positive)
            if "LABEL_2" in raw_label or "POSITIVE" in raw_label:
                sentiment = "positive"
            elif "LABEL_0" in raw_label or "NEGATIVE" in raw_label:
                sentiment = "negative"
            else:
                sentiment = "neutral"
        elif "multilingual" in model_name:
            # Star ratings: 1-2 stars = negative, 3 stars = neutral, 4-5 stars = positive
            if "5 STARS" in raw_label or "4 STARS" in raw_label:
                sentiment = "positive"
            elif "1 STAR" in raw_label or "2 STARS" in raw_label:
                sentiment = "negative"
            else:
                sentiment = "neutral"
        elif "emotion" in model_name:
            # Map emotions to sentiment
            if any(emotion in raw_label for emotion in ["JOY", "LOVE", "SURPRISE"]):
                sentiment = "positive"
            elif any(emotion in raw_label for emotion in ["ANGER", "FEAR", "SADNESS"]):
                sentiment = "negative"
            else:
                sentiment = "neutral"
        else:
            # Default handling for standard sentiment models
            if "POSITIVE" in raw_label:
                sentiment = "positive"
            elif "NEGATIVE" in raw_label:
                sentiment = "negative"
            else:
                sentiment = "neutral"
        
        # Determine confidence level
        if score > 0.85:
            confidence = "high"
        elif score > 0.65:
            confidence = "medium"
        else:
            confidence = "low"
            
        return {
            "sentiment": sentiment,
            "label": raw_label,
            "score": round(score, 3),
            "confidence": confidence,
            "model_used": model_name
        }

    def analyze_sentiment(self, text: str) -> dict:
        """
        Analyze sentiment of text with improved error handling and preprocessing
        
        Args:
            text: Text to analyze
            
        Returns:
            dict: Sentiment analysis results with label, score, confidence, and model info
        """
        # Return default result if no analyzer or empty text
        if not self.sentiment_analyzer or not text or not text.strip():
            return {
                "sentiment": "unknown",
                "label": "UNKNOWN",
                "score": 0.0,
                "confidence": "low",
                "model_used": "none",
                "error": "No analyzer available or empty text"
            }
        
        try:
            # Preprocess text
            processed_text = self._preprocess_text_for_sentiment(text)
            
            if not processed_text:
                return {
                    "sentiment": "unknown",
                    "label": "UNKNOWN",
                    "score": 0.0,
                    "confidence": "low",
                    "model_used": self.sentiment_model_name or "unknown",
                    "error": "Empty text after preprocessing"
                }
            
            # Run sentiment analysis
            result = self.sentiment_analyzer(processed_text)
            
            # Handle different result formats
            if isinstance(result, list) and len(result) > 0:
                sentiment_result = result[0]
            elif isinstance(result, dict):
                sentiment_result = result
            else:
                raise ValueError(f"Unexpected result format: {type(result)}")
            
            # Normalize the result
            normalized_result = self._normalize_sentiment_result(
                sentiment_result, 
                self.sentiment_model_name or "unknown"
            )
            
            return normalized_result
            
        except Exception as e:
            error_msg = f"Sentiment analysis failed: {str(e)[:100]}"
            print(f"⚠️ {error_msg}")
            
            # Try to reinitialize analyzer on certain errors
            if "CUDA" in str(e) or "memory" in str(e).lower():
                print("   Attempting to reinitialize sentiment analyzer...")
                self._initialize_sentiment_analyzer()
            
            return {
                "sentiment": "unknown",
                "label": "ERROR",
                "score": 0.0,
                "confidence": "low",
                "model_used": self.sentiment_model_name or "unknown",
                "error": error_msg
            }

    async def transcribe_audio(self, file_path: Path, filename: str) -> TranscriptionInDB:
        from app.core.db import audio_transcripts_collection  # dynamic import

        # Convert audio to standardized WAV format first
        wav_path = await convert_to_wav(file_path)
        
        try:
            # Handle mock or real Whisper transcription
            if self.model is None:
                text = f"Mock transcription for {filename} at {datetime.now(timezone.utc).isoformat()}"
                language_detected = "unknown"
                pidgin_confidence = 0.0
                sentiment_result = {
                    "sentiment": "neutral", 
                    "label": "NEUTRAL", 
                    "score": 0.5, 
                    "confidence": "low", 
                    "model_used": "mock"
                }
            else:
                # Use appropriate model for transcription
                if self.processor:  # Using finetuned HuggingFace model
                    # Load and preprocess audio from converted WAV
                    audio, sr = librosa.load(str(wav_path), sr=16000)
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
                    # Use the converted WAV file for better compatibility
                    result = self.model.transcribe(str(wav_path))
                    raw_text = result["text"]
                
                # Process to preserve authentic Nigerian Pidgin
                pidgin_confidence = self.pidgin_processor.get_pidgin_confidence(raw_text) # type: ignore
                
                # Determine language type
                if pidgin_confidence > 0.3:
                    language_detected = "pidgin"
                    text = self.pidgin_processor.process_text(raw_text, preserve_pidgin=True) # type: ignore
                elif pidgin_confidence > 0.1:
                    language_detected = "mixed"  # Contains some Pidgin elements
                    text = self.pidgin_processor.process_text(raw_text, preserve_pidgin=True) # type: ignore
                else:
                    language_detected = "english"
                    text = self.pidgin_processor.process_text(raw_text, preserve_pidgin=False) # type: ignore
                
                # Perform sentiment analysis on the processed text
                print(f"🎭 Analyzing sentiment for {language_detected} text: '{text[:50]}...'")
                sentiment_result = self.analyze_sentiment(text)
                print(f"✅ Sentiment: {sentiment_result.get('label', 'UNKNOWN')} ({sentiment_result.get('confidence', 'unknown')} confidence)")
        
        finally:
            # Clean up temporary files
            try:
                os.unlink(file_path)  # Original uploaded file
            except:
                pass
            
            try:
                os.unlink(wav_path)   # Converted WAV file
            except:
                pass

        # Store in MongoDB with sentiment analysis and language detection
        doc = TranscriptionInDB(
            filename=filename, 
            text=text,
            sentiment=sentiment_result,
            language_detected=language_detected,
            pidgin_confidence=round(pidgin_confidence, 3)
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