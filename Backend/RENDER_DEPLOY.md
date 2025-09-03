# Render Deployment Configuration

This backend is designed to run on Render as a lightweight API service.

## Build Command:
```
pip install -r requirements.api.txt
```

## Start Command:
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Environment Variables (set in Render dashboard):
- `MONGO_URI`: Your MongoDB Atlas connection string
- `MONGO_DB_NAME`: toritype_db
- `MONGO_COLLECTION_NAME`: transcriptions
- `SECRET_KEY`: Your JWT secret key
- `ALGORITHM`: HS256
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 180
- `ML_SERVICE_URL`: https://your-username-your-space-name.hf.space
- `SENTIMENT_SERVICE_URL`: https://your-username-your-space-name.hf.space
- `USE_OPENAI_MOCK`: 0

## Root Directory / Files to Deploy:
- Set "Root Directory" to `Backend` in Render so only the API is deployed.
- All files in `Backend/` folder EXCEPT:
  - `hf_space/` folder (deploy this separately to HF Spaces)
  - `nigerian-whisper-lora-2k/` (this goes to HF Spaces)
  - `ml_venv/` or any virtual environments
  - `__pycache__/` folders

## Notes:
- This API has NO heavy ML dependencies
- All ML inference is handled by the remote Hugging Face Space
- The API only handles requests, MongoDB, auth, and post-processing

## CORS
If calling from a different domain (e.g., your Render URL or localhost), update `allow_origins` in `app/main.py` to include your frontend domains or use `*` during testing.
