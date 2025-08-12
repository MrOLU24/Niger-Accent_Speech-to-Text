# ToriType - Nigerian English & Pidgin Speech-to-Text

An inclusive and highly accurate speech-to-text platform specifically designed for Nigerian English and Pidgin speakers.

## 🎯 The Problem
Standard speech-to-text models often struggle with Nigerian accents and Pidgin, leading to poor transcription quality for millions of speakers. ToriType addresses this gap with culturally-aware AI.

## 💡 ToriType's Solution
A machine learning platform that accurately transcribes Nigerian English and Pidgin without attempting to "correct" accents. Users can upload audio files or record directly through their browser for real-time transcription.

## 🏗️ Project Structure

- **Frontend/**: Next.js + TypeScript application with browser recording
- **Backend/**: FastAPI server with fine-tuned Whisper model

## 🚀 Getting Started

### Frontend (Next.js)
```bash
cd Frontend
npm run dev
```

### Backend (FastAPI)
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## ✨ Key Features

- [ ] **Audio Recording**: Browser-based microphone recording (MediaRecorder API)
- [ ] **Audio Upload**: Support for common audio formats via file input
- [ ] **Real-time Transcription**: Fine-tuned Whisper model API integration
- [ ] **Nigerian English Support**: Accurate transcription of Nigerian accents
- [ ] **Pidgin Language Support**: Specialized handling of Nigerian Pidgin
- [ ] **Cultural Accuracy**: Preserves authentic language usage

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Recording**: MediaRecorder API
- **Communication**: Fetch API for backend requests

### Backend & ML
- **Framework**: FastAPI
- **Server**: Uvicorn (ASGI)
- **Base Model**: OpenAI Whisper
- **Fine-tuning**: Hugging Face transformers + datasets + accelerate
- **Technique**: LoRA (Low-Rank Adaptation)
- **Deployment**: Monorepo strategy

## 👥 Team Roles

- **Frontend Lead**: UI/UX, recording functionality, API integration
- **Backend/ML Engineer**: FastAPI setup, Whisper fine-tuning, model deployment
- **Data Specialist**: Nigerian speech data collection and preprocessing

## 📅 3-Week Development Timeline

### Week 1: Foundation
- [x] Project setup and monorepo structure
- [ ] Frontend: Basic UI with recording/upload components
- [ ] Backend: FastAPI skeleton with file upload endpoints
- [ ] ML: Whisper model setup and initial testing

### Week 2: Core Development
- [ ] Frontend: Complete recording and upload functionality
- [ ] Backend: Audio processing pipeline
- [ ] ML: Fine-tuning Whisper on Nigerian speech data
- [ ] Integration: Connect frontend to backend API

### Week 3: Polish & Deploy
- [ ] Testing with real Nigerian speech samples
- [ ] UI/UX improvements and error handling
- [ ] Performance optimization
- [ ] Documentation and demo preparation

## 🎊 Expected Outcome
A functional prototype demonstrating accurate transcription of Nigerian English and Pidgin, laying groundwork for an inclusive voice technology tool for the Nigerian community.
