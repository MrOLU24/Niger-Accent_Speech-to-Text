---
title: Niger Accent Whisper
emoji: 🗣️
colorFrom: indigo
colorTo: blue
sdk: docker
sdk_version: "latest"
pinned: false
---
- `WHISPER_BASE_MODEL` (default: `openai/whisper-small`)
- `LORA_ADAPTER_PATH` – optional path to the LoRA adapter inside the Space repo

## Project Layout
- `app.py` – FastAPI app
- `requirements.txt` – Python deps
- `packages.txt` – System packages (ffmpeg)
- `nigerian-whisper-lora-2k/` – optional adapter folder (add `adapter_model.safetensors` & `adapter_config.json`)

## Deploy on Hugging Face Spaces (Step-by-step)
1. Create a Space: https://huggingface.co/spaces → New Space → Type: "Docker Spaces" or "Python (FastAPI)".
2. Upload files from this folder:
   - `app.py`
   - `requirements.txt`
   - `packages.txt`
   - (optional) `nigerian-whisper-lora-2k/` with adapter files
3. Set Space variables:
   - `WHISPER_BASE_MODEL=openai/whisper-small`
   - `LORA_ADAPTER_PATH=nigerian-whisper-lora-2k` (if you uploaded adapter)
4. Start Space and wait until it’s running. Note the Space URL, e.g. `https://<user>-<space>.hf.space`.

## Integrate with Render API Backend
- In your Render service (FastAPI), set env var `ML_SERVICE_URL` to the Space URL.
- Update backend code to POST audio to `${ML_SERVICE_URL}/transcribe` and return the JSON result to the client.

## Local Run (optional)
```bash
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 7860
```

> For local inference you need ffmpeg installed.