from typing import Any
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from api.transcription.routes import router as transcription_router



# -----------------------------
# FastAPI App Initialization
# -----------------------------
app = FastAPI(
    title="ToriType API",
    description="Nigerian English & Pidgin Speech-to-text API",
    version="1.0.0",
)

# -----------------------------
# API Router Registration
# -----------------------------
app.include_router(transcription_router)

# -----------------------------
# Root Endpoint
# -----------------------------
@app.get("/", response_class=HTMLResponse)
async def home() -> Any:
    return """
    <html>
        <head>
            <title>Welcome to ToriType</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding-top: 50px;">
            <h1>Welcome to <span style="color: #87CEEB;">ToriType</span></h1>
            <p>Your Nigerian English & Pidgin Speech-to-text API.</p>
        </body>
    </html>
    """