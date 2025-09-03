# Base image
FROM python:3.10-slim

# Ensure output is flushed and no .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# System dependencies: ffmpeg for audio processing, libsndfile for soundfile/librosa
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Configure writable Hugging Face caches on Spaces persistent storage
ENV HF_HOME=/data/.cache/huggingface
ENV TRANSFORMERS_CACHE=/data/.cache/huggingface/transformers
ENV HF_HUB_CACHE=/data/.cache/huggingface/hub
ENV XDG_CACHE_HOME=/data/.cache
ENV NUMBA_CACHE_DIR=/data/.cache/numba
ENV TOKENIZERS_PARALLELISM=false
ENV HOME=/app

RUN mkdir -p /data/.cache/huggingface /data/.cache/numba && chmod -R 777 /data

# Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code (including app.py and model adapter dir)
COPY . .

# Expose default port (Spaces will inject PORT env var)
EXPOSE 7860

# Start FastAPI app via Uvicorn, binding to injected $PORT or default 7860
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-7860}"]
