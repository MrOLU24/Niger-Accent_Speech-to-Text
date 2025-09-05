# ToriType Backend Team Guide

This guide explains our backend structure, local setup, how ML inference is hosted on Hugging Face Spaces, and how any teammate can fine‑tune the Whisper LoRA model and redeploy without depending on the original deployer.

## Architecture Overview

- API: FastAPI app (Render deployment)
  - Entrypoint: `app/main.py`
  - Routes: `app/api/transcription/`
  - Settings: `app/core/settings.py` (reads from `.env`)
  - Database: MongoDB Atlas via `motor` (`app/core/db.py`)
  - Calls remote ML inference service (Hugging Face Space) via `httpx`

- ML Inference: FastAPI app inside `Backend/hf_space/` (Hugging Face Spaces)
  - Entrypoint: `hf_space/app.py`
  - Loads base Whisper and LoRA adapter from `hf_space/nigerian-whisper-lora-2k/`
  - Exposes endpoints:
    - `GET /health`
    - `POST /transcribe` (file upload field: `audio`)
    - `POST /sentiment` (json: `{ "text": "..." }`)

- Training / Fine‑tuning Helpers (local or Colab):
- Scripts under `Backend/ml/scripts/`
  - Current trainer: `ml/scripts/train_nigerian_whisper.py`

## Local Backend Setup

1) Install Python 3.11 (see `Backend/runtime.txt`).

2) Create a virtualenv and install deps:
   - Windows Bash:
     ```bash
     cd Backend
     python -m venv .venv
     source .venv/Scripts/activate
     pip install -r requirements.txt
     ```

3) Configure environment:
   - Copy `Backend/.env.sample` to `Backend/.env` and fill values.
   - Required vars: `MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION_NAME, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, ML_SERVICE_URL`.

4) Run API locally:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Open http://localhost:8000/docs

## How Remote Inference Is Used

- `app/api/transcription/services.py` sends uploads to `ML_SERVICE_URL`:
  - `POST {ML_SERVICE_URL}/transcribe` with `files={"audio": (filename, file_bytes, "application/octet-stream")}`
  - Receives `{ text, language }`
  - Runs lightweight pidgin post‑processing and (optional) sentiment via `{ML_SERVICE_URL}/sentiment`.

Ensure CORS is allowed in `hf_space/app.py` (currently allow all).

## Fine‑Tuning The Whisper LoRA Model

You can fine‑tune locally (GPU recommended) or on Colab/AWS. The provided trainer script expects a combined dataset and saves a LoRA adapter directory.

1) Prepare data
   - Our sample pipeline is referenced by `ml/scripts/train_nigerian_whisper.py` (it imports `ml.datasets.prepare_data`). If your dataset prep script isn’t present locally, you can:
     - Replace the `prepare_all_datasets()` call with your dataset path, or
     - Implement a minimal `ml/datasets/prepare_data.py` that writes audio/transcript pairs into `ml/datasets/combined_nigerian_speech`.
   - Data contract: speech audio (16 kHz or original, will be resampled during training) + text transcripts.

2) Run training
   - Edit defaults in `ml/scripts/train_nigerian_whisper.py` if needed (base model, samples, output dir).
   - Start training:
     ```bash
     cd Backend
     python ml/scripts/train_nigerian_whisper.py
     ```
   - Output directory (default): `models/nigerian-whisper-lora`

3) Export LoRA adapter for deployment
   - After training, copy the adapter files into a directory that mirrors HF Space expectation:
     ```
     models/nigerian-whisper-lora/
       adapter_config.json
       adapter_model.safetensors
       training_config.json  # optional
     ```

## Redeploying To Hugging Face Spaces

We deploy the inference app in `Backend/hf_space/`. It expects the LoRA adapter under `hf_space/nigerian-whisper-lora-2k/` by default (see `ADAPTER_DIR` in `hf_space/app.py`).

Option A: Commit new adapter to repo
------------------------------------
1) Replace directory contents:
   - Copy new `adapter_config.json` and `adapter_model.safetensors` into `Backend/hf_space/nigerian-whisper-lora-2k/` (overwrite existing).
2) Push to GitHub; if Space is connected to this repo path, HF will auto‑build and restart.
3) Verify health:
   - Open `https://<space>.hf.space/health` – should return `{ status: "ok", adapter_present: true }`.

Option B: Use HF Space storage (if enabled)
-------------------------------------------
1) Upload adapter artifacts to the Space or to a model repo, then set env vars on the Space:
   - `WHISPER_BASE_MODEL` (defaults to `openai/whisper-small`)
   - `LORA_ADAPTER_PATH` (absolute path in Space or mounted volume)
2) Restart the Space; on startup it loads the specified adapter.

Notes:
- `hf_space/app.py` is robust to missing adapters and will fall back to the base model, but accuracy will drop. Ensure `adapter_present: true` on `/health`.
- Caching paths are set for Spaces; no extra config needed.

## Updating Render Backend To Point To New Space

After redeploying/updating the HF Space, update the Render environment variable on the API service:
- `ML_SERVICE_URL=https://<new-space-subdomain>.hf.space`
- Redeploy/restart the Render service.

## Testing Endpoints End‑to‑End

1) Test Space directly:
   - Health: `GET https://<space>.hf.space/health`
   - Transcribe:
     - `POST https://<space>.hf.space/transcribe` with form‑data `audio=@sample.wav`
   - Sentiment:
     - `POST https://<space>.hf.space/sentiment` with JSON `{ "text": "I love this" }`

2) Test Backend (Render or local):
   - `POST /transcription/transcribe` with form‑data `file=@sample.wav`
   - `GET /transcription/{id}` to fetch stored result
   - `POST /transcription/sentiment` with JSON payload

## Access & Ownership on Hugging Face

Teammates can redeploy without the original owner if either:
1) The Space is owned by an organization and all teammates are members with write access; OR
2) The original owner invites teammates as collaborators with write access; OR
3) A new Space is created under a shared org, and the repo path in this project is connected to that Space.

Step‑by‑step for collaborators:
1) Ensure you have write access to the Space or create a new Space under the team org.
2) Push changes to `Backend/hf_space/` (new adapter files or code updates).
3) Confirm Space build logs show a successful restart.
4) Hit `/health` and then `/transcribe` with a small audio file.

If you don’t have access to the existing Space, create a new one:
- Duplicate the `Backend/hf_space/` folder into a new repo or connect just that folder during Space creation.
- Upload or reference the latest LoRA adapter directory.
- Update Render `ML_SERVICE_URL` to the new Space URL.

## Troubleshooting

- Space is slow or crashes during load:
  - Ensure hardware type is adequate (at least CPU Basic; GPU preferred if available).
  - Verify `adapter_model.safetensors` exists and matches `adapter_config.json`.

- Transcription fails with 500:
  - Check Space `/health` and logs.
  - Confirm `ML_SERVICE_URL` is correct on Render/backend `.env`.

- MongoDB insert errors:
  - Verify Atlas IP access and connection string.

- CORS blocks:
  - Backend allows the Vercel domain in `app/main.py`. Add your local host or preview URLs as needed.

## File Map (Backend)

```
Backend/
  app/
    main.py                 # FastAPI app & CORS
    api/transcription/
      routes.py             # /transcription endpoints
      services.py           # Calls HF Space, post‑processing, DB save
      schemas.py            # Pydantic models
    core/
      settings.py           # pydantic‑settings from .env
      db.py                 # Mongo connection
    utils/
      pidgin_processor.py   # Pidgin heuristics
  hf_space/
    app.py                  # HF Space FastAPI
    nigerian-whisper-lora-2k/  # LoRA adapter files
  ml/
    scripts/
      train_nigerian_whisper.py  # Fine‑tuning pipeline
```

With this guide, any teammate with Space access can fine‑tune, redeploy, and update the backend to use the new model.
