import os
# Ensure numba and general caches are writable on HF Spaces before heavy imports
os.environ.setdefault("XDG_CACHE_HOME", "/data/.cache")
os.environ.setdefault("NUMBA_CACHE_DIR", "/data/.cache/numba")
# If caching still errors, uncomment to disable JIT entirely
# os.environ["NUMBA_DISABLE_JIT"] = "1"
import tempfile
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from transformers import WhisperForConditionalGeneration, WhisperProcessor, pipeline
from peft.peft_model import PeftModel
import ffmpeg
import librosa
import torch


app = FastAPI(title="ToriType ML Inference Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MODEL_BASE = os.getenv("WHISPER_BASE_MODEL", "openai/whisper-small")
ADAPTER_DIR = os.getenv("LORA_ADAPTER_PATH", str(Path(__file__).resolve().parent / "nigerian-whisper-lora-2k"))

model = None
processor = None
sentiment = None


def convert_to_wav(input_path: Path) -> Path:
    out_file = Path(tempfile.mktemp(suffix=".wav"))
    (
        ffmpeg
        .input(str(input_path))
        .output(str(out_file), ar=16000, ac=1, format='wav')
        .run(overwrite_output=True, quiet=True)
    )
    return out_file


@app.on_event("startup")
def load_model():
    global model, processor, sentiment
    try:
        base = WhisperForConditionalGeneration.from_pretrained(MODEL_BASE)
        adapter_path = Path(ADAPTER_DIR)
        if not adapter_path.exists():
            # If adapter not present, run base model
            model_to_use = base
        else:
            model_to_use = PeftModel.from_pretrained(base, str(adapter_path))

        proc = WhisperProcessor.from_pretrained(MODEL_BASE, task="transcribe")

        # Configure model for inference CPU
        model_to_use.eval()
        for p in model_to_use.parameters():
            p.requires_grad_(False)

        # Save
        model = model_to_use
        processor = proc
        print("✅ Whisper model ready")

        # Lightweight sentiment (optional, CPU)
        try:
            sentiment = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
            print("✅ Sentiment pipeline ready")
        except Exception as e:
            print(f"⚠️ Sentiment init failed: {e}")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        raise


@app.get("/")
def root():
    return {
        "message": "ToriType ML Inference Service", 
        "status": "running",
        "endpoints": {
            "health": "/health",
            "transcribe": "/transcribe (POST)",
            "sentiment": "/sentiment (POST)"
        }
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": MODEL_BASE,
        "adapter_present": Path(ADAPTER_DIR).exists(),
        "sentiment": bool(sentiment),
    }


@app.post("/transcribe")
def transcribe(audio: UploadFile = File(...)):
    if model is None or processor is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Save uploaded file to temp
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(audio.file.read())
            tmp_path = Path(tmp.name)

        # Convert to 16k wav mono
        wav_path = convert_to_wav(tmp_path)

        # Load audio and prepare features
        pcm, _ = librosa.load(str(wav_path), sr=16000)
        inputs = processor(pcm, sampling_rate=16000, return_tensors="pt")

        with torch.no_grad():
            pred_ids = model.generate(
                inputs.input_features,
                forced_decoder_ids=None,
                suppress_tokens=[],
                do_sample=True,
                temperature=0.7,
                max_length=448,
                num_beams=1,
            )

        text = processor.batch_decode(pred_ids, skip_special_tokens=True)[0]

        return JSONResponse({
            "text": text,
            "language": "unknown",  # optional: add language detection if needed
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")
    finally:
        try:
            if 'tmp_path' in locals() and tmp_path.exists():
                tmp_path.unlink(missing_ok=True)
        except Exception:
            pass


@app.post("/sentiment")
def sentiment_api(payload: dict):
    if not sentiment:
        return JSONResponse({"label": "UNKNOWN", "score": 0.0, "model": "none"})
    text = (payload or {}).get("text", "")
    if not text:
        return JSONResponse({"label": "UNKNOWN", "score": 0.0, "model": "none"})
    try:
        res = sentiment(text)
        if isinstance(res, list) and res:
            res = res[0]
        return JSONResponse({
            "label": res.get("label", "UNKNOWN"),
            "score": float(res.get("score", 0.0)),
            "model": "distilbert-sst2",
        })
    except Exception as e:
        return JSONResponse({"label": "UNKNOWN", "score": 0.0, "error": str(e), "model": "distilbert-sst2"})
        try:
            if 'wav_path' in locals() and wav_path.exists():
                wav_path.unlink(missing_ok=True)
        except Exception:
            pass


# Optional for local debugging
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
