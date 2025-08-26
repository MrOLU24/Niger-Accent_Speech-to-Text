
# ToriType: Nigerian English & Pidgin Speech-to-Text Platform

ToriType is an inclusive, culturally-aware speech-to-text web application designed for Nigerian English and Pidgin speakers. It combines a modern Next.js frontend with a FastAPI backend powered by a fine-tuned Whisper model, delivering accurate transcriptions for local accents and dialects.

## Project Overview

Millions of Nigerians face poor transcription quality due to accent and dialect gaps in standard speech-to-text systems. ToriType solves this by:
- Fine-tuning Whisper on Nigerian English and Pidgin datasets
- Supporting browser-based recording and file uploads
- Returning authentic, uncorrected transcriptions

## Features

- Audio recording via browser (MediaRecorder API)
- Audio file upload (WAV, MP3, OGG, etc.)
- Real-time transcription using a custom-trained Whisper model
- Accurate support for Nigerian English and Pidgin
- Culturally-accurate output (no forced accent correction)

## Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- MediaRecorder API

**Backend & ML:**
- FastAPI (Python)
- Uvicorn (ASGI server)
- Whisper (OpenAI, fine-tuned with LoRA)
- Hugging Face transformers, datasets, accelerate

## Quick Start

**Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

**Backend:**
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Team Roles

- Frontend Lead: UI/UX, recording, API integration
- Backend/ML Engineer: FastAPI, Whisper fine-tuning, deployment
- Data Specialist: Nigerian speech data collection/preprocessing

## Development Timeline

**Week 1:** Project setup, monorepo, basic UI, backend skeleton
**Week 2:** Core features, ML fine-tuning, API integration
**Week 3:** Real data testing, UI polish, optimization, documentation

## Expected Outcome

A working prototype that accurately transcribes Nigerian English and Pidgin, ready for demo and further development as an inclusive voice technology for Nigeria.
