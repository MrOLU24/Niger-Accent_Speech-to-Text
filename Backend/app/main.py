from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.api.transcription.routes import router as transcription_router
from app.core.db import connect_to_mongo, close_mongo_connection

# Lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()       
    yield
    await close_mongo_connection() 

app = FastAPI(
    title="ToriType API",
    description="Nigerian English & Pidgin Speech-to-text API with Sentiment Analysis",
    version="1.0.0",
    lifespan=lifespan
)

# Include router
app.include_router(transcription_router)

# Root endpoint
@app.get("/", response_class=HTMLResponse)
async def home():
    return """
    <html>
        <head>
            <title>Welcome to ToriType</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding-top: 50px;">
            <h1>Welcome to <span style="color: #87CEEB;">ToriType</span></h1>
            <p>Your Nigerian English & Pidgin Speech-to-text API with Sentiment Analysis.</p>
            <p>Visit <a href="/docs">/docs</a> for API documentation.</p>
        </body>
    </html>
    """

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://toritype.vercel.app"],  # change "*" to your frontend domain if known
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
