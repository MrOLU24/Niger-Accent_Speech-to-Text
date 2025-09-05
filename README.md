
<div align="center">

# ToriType — Nigerian English & Pidgin Speech‑to‑Text

Professional, inclusive STT built for Nigerian voices. Fine‑tuned Whisper model, modern UX, and scalable cloud deployment.

[![AltSchool Africa](Frontend/public/altschool.png)](https://altschoolafrica.com/)

<sup>Built during the AltSchool Africa Hackathon.</sup>

</div>

## Highlights

- Accurate transcription for Nigerian English and Pidgin (Whisper + LoRA)
- Modern, responsive dashboard (Next.js + Tailwind)
- Browser recording and audio upload
- Pidgin‑aware post‑processing that preserves culture
- Split, scalable architecture: ML on Hugging Face Spaces, API on Render

## Architecture

- Frontend: `Frontend/` (Next.js 15, React 19, Tailwind)
- Backend API: `Backend/app/` (FastAPI, MongoDB Atlas)
- ML Inference Service: `Backend/hf_space/` (FastAPI on Hugging Face Spaces)
- Training scripts: `Backend/ml/scripts/`

Data flow:
1) Browser records or uploads audio
2) Frontend calls Backend `/transcription/transcribe`
3) Backend forwards file to Hugging Face Space `/transcribe`
4) Result is post‑processed and stored in MongoDB

## Live/Deploy Targets

- ML Service: Hugging Face Space (URL set via `ML_SERVICE_URL`)
- API: Render service (FastAPI) with CORS for the Vercel URL
- Frontend: Vercel (or any Next.js host)

## Quick Start

Frontend
```bash
cd Frontend
npm install
npm run dev
```

Backend
```bash
cd Backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.sample .env  # fill values
uvicorn app.main:app --reload --port 8000
```

Key env vars (see `Backend/.env.sample`):
- `MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION_NAME`
- `SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES`
- `ML_SERVICE_URL` (HF Space base URL)

## API Overview

- `POST /transcription/transcribe` — form‑data `file=@audio.wav`
- `GET /transcription/{id}` — fetch stored transcript
- `POST /transcription/sentiment` — `{ text }`

The Backend internally calls the Space endpoints:
- `POST {ML_SERVICE_URL}/transcribe`
- `POST {ML_SERVICE_URL}/sentiment`

## Data Sources & Citations

- Whisper: Radford et al., “Robust Speech Recognition via Large‑Scale Weak Supervision,” 2022 (OpenAI Whisper)
- Indicative Nigerian datasets used/considered for fine‑tuning and evaluation include Common Voice (en‑NG) and curated Nigerian Pidgin samples. Ensure usage complies with each dataset’s license.
- Sentiment baseline: DistilBERT SST‑2 (Hugging Face) for optional text classification in Space.

## Development Notes

- Pidgin post‑processing in `Backend/app/utils/pidgin_processor.py`
- Mongo persistence via `motor` (`app/core/db.py`)
- Settings in `app/core/settings.py` using pydantic‑settings
- CORS configured in `app/main.py`

## Contributing

1) Create a feature branch
2) Add/modify tests or examples when changing public behavior
3) Keep commits focused and descriptive
4) Open a PR with screenshots for UI changes

## Backend Team Guide

See `Backend/BACKEND_TEAM_GUIDE.md` for:
- Folder structure
- Local env setup (`.env.sample` provided)
- Fine‑tuning LoRA and exporting adapters
- Redeploying to Hugging Face Spaces
- Updating Render `ML_SERVICE_URL` and testing

## License

For hackathon evaluation only. Dataset components remain under their respective licenses. Whisper license applies to model usage.
