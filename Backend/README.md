# Backend — FastAPI API and Hugging Face Space

This backend powers ToriType: a FastAPI API deployed to Render that forwards audio to a Hugging Face Space for Whisper‑LoRA inference. MongoDB Atlas stores transcripts and metadata.

## Quick Setup

```bash
cd Backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.sample .env  # fill values
uvicorn app.main:app --reload --port 8000
```

Key folders:
- `app/` — API (`main.py`, routes, services, Mongo, settings)
- `hf_space/` — ML inference FastAPI app for Hugging Face Spaces
- `ml/scripts/` — Training/fine‑tuning helpers

## Start Here

For team onboarding, fine‑tuning, redeploying to Spaces, and end‑to‑end testing, read:

→ `BACKEND_TEAM_GUIDE.md`

