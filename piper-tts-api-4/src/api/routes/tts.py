from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import subprocess
from src.utils.audio_processing import split_text
from src.services.piper_service import PiperService

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/api/tts")
async def generate_tts(request: TextRequest):
    text = request.text
    chunks = split_text(text)
    
    audio_files = []
    for chunk in chunks:
        audio_file = PiperService.check_cache(chunk)
        if audio_file:
            audio_files.append(audio_file)
        else:
            try:
                audio_file = PiperService.generate_audio(chunk)
                audio_files.append(audio_file)
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    
    return {"audio_files": audio_files}