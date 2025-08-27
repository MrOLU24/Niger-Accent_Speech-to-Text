from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class TranscriptionInDB(BaseModel):
    id: Optional[PyObjectId] = None
    filename: str
    text: str
    sentiment: Optional[Dict[str, Any]] = None
    language_detected: Optional[str] = None
    pidgin_confidence: Optional[float] = None
    created_at: datetime = datetime.utcnow()

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class TranscriptionResponse(BaseModel):
    id: str
    text: str
    sentiment: Optional[Dict[str, Any]] = None
    language_detected: Optional[str] = None
    pidgin_confidence: Optional[float] = None
