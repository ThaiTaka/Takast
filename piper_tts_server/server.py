"""
Piper TTS FastAPI Server
Local TTS server using Piper engine for Vietnamese text-to-speech
"""

import os
import sys
import hashlib
import subprocess
import re
from pathlib import Path
from typing import Optional
import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
BASE_DIR = Path(__file__).parent
PIPER_BIN = BASE_DIR / "piper_bin" / "piper.exe"
MODEL_DIR = BASE_DIR / "models"
CACHE_DIR = BASE_DIR / "cache"

# Vietnamese model (user needs to download)
MODEL_FILE = MODEL_DIR / "vi_VN-25hours-single-low.onnx"
MODEL_CONFIG = MODEL_DIR / "vi_VN-25hours-single-low.onnx.json"

# Create cache directory if not exists
CACHE_DIR.mkdir(exist_ok=True)

# FastAPI app
app = FastAPI(
    title="Piper TTS Server",
    description="Local Vietnamese Text-to-Speech using Piper",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TTSRequest(BaseModel):
    """TTS request model"""
    text: str
    voice: Optional[str] = "default"
    speed: Optional[float] = 1.0


class TTSResponse(BaseModel):
    """TTS response model"""
    success: bool
    audio_url: Optional[str] = None
    cached: bool = False
    message: Optional[str] = None


def validate_environment():
    """Validate that Piper and model files exist"""
    errors = []
    
    if not PIPER_BIN.exists():
        errors.append(f"Piper executable not found: {PIPER_BIN}")
        errors.append("Please download piper.exe from https://github.com/rhasspy/piper/releases")
    
    if not MODEL_FILE.exists():
        errors.append(f"Model file not found: {MODEL_FILE}")
        errors.append("Please download vi_VN-25hours-single-low.onnx from Piper releases")
    
    if not MODEL_CONFIG.exists():
        errors.append(f"Model config not found: {MODEL_CONFIG}")
        errors.append("Make sure the .onnx.json file is in the models directory")
    
    if errors:
        logger.error("Environment validation failed:")
        for error in errors:
            logger.error(f"  - {error}")
        return False
    
    logger.info("✓ Environment validation passed")
    return True


def split_text(text: str, max_length: int = 500) -> list[str]:
    """
    Split long text into smaller chunks based on Vietnamese punctuation
    
    Args:
        text: Input text to split
        max_length: Maximum length of each chunk
        
    Returns:
        List of text chunks
    """
    if len(text) <= max_length:
        return [text.strip()]
    
    # Vietnamese sentence delimiters
    sentence_delimiters = r'[.!?;]\s+'
    
    # Split by sentences
    sentences = re.split(sentence_delimiters, text)
    
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        
        # If adding this sentence exceeds max_length, save current chunk
        if len(current_chunk) + len(sentence) + 2 > max_length:
            if current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = sentence
            else:
                # Single sentence is too long, split by comma
                if len(sentence) > max_length:
                    parts = sentence.split(',')
                    for part in parts:
                        part = part.strip()
                        if len(current_chunk) + len(part) + 2 > max_length:
                            if current_chunk:
                                chunks.append(current_chunk.strip())
                            current_chunk = part
                        else:
                            current_chunk += (", " if current_chunk else "") + part
                else:
                    current_chunk = sentence
        else:
            current_chunk += (". " if current_chunk else "") + sentence
    
    # Add remaining chunk
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks


def get_text_hash(text: str) -> str:
    """Generate MD5 hash for text caching"""
    return hashlib.md5(text.encode('utf-8')).hexdigest()


def get_cached_audio(text_hash: str) -> Optional[Path]:
    """Check if cached audio exists for given text hash"""
    cache_file = CACHE_DIR / f"{text_hash}.wav"
    if cache_file.exists():
        logger.info(f"Cache hit: {text_hash}")
        return cache_file
    return None


def generate_audio_piper(text: str, output_path: Path) -> bool:
    """
    Generate audio using Piper TTS engine
    
    Args:
        text: Text to synthesize
        output_path: Output WAV file path
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Piper command
        cmd = [
            str(PIPER_BIN),
            "--model", str(MODEL_FILE),
            "--config", str(MODEL_CONFIG),
            "--output_file", str(output_path)
        ]
        
        logger.info(f"Running Piper: {' '.join(cmd)}")
        
        # Run Piper with text as stdin
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8'
        )
        
        stdout, stderr = process.communicate(input=text, timeout=30)
        
        if process.returncode != 0:
            logger.error(f"Piper failed with return code {process.returncode}")
            logger.error(f"stderr: {stderr}")
            return False
        
        if not output_path.exists():
            logger.error(f"Output file not created: {output_path}")
            return False
        
        logger.info(f"✓ Audio generated: {output_path.name}")
        return True
        
    except subprocess.TimeoutExpired:
        logger.error("Piper process timeout")
        process.kill()
        return False
    except Exception as e:
        logger.error(f"Error generating audio: {e}")
        return False


@app.on_event("startup")
async def startup_event():
    """Validate environment on startup"""
    if not validate_environment():
        logger.error("Server cannot start due to missing dependencies")
        sys.exit(1)


@app.get("/")
async def root():
    """Root endpoint - serve demo page"""
    index_file = BASE_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": "Piper TTS Server is running", "status": "ok"}


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "piper_exists": PIPER_BIN.exists(),
        "model_exists": MODEL_FILE.exists(),
        "cache_dir": str(CACHE_DIR),
        "cached_files": len(list(CACHE_DIR.glob("*.wav")))
    }


@app.post("/api/tts", response_model=TTSResponse)
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech using Piper TTS
    
    Args:
        request: TTS request with text
        
    Returns:
        TTSResponse with audio URL or error
    """
    try:
        text = request.text.strip()
        
        if not text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if len(text) > 10000:
            raise HTTPException(status_code=400, detail="Text too long (max 10000 characters)")
        
        # Generate hash for caching
        text_hash = get_text_hash(text)
        
        # Check cache
        cached_file = get_cached_audio(text_hash)
        if cached_file:
            return TTSResponse(
                success=True,
                audio_url=f"/api/audio/{text_hash}",
                cached=True,
                message="Audio retrieved from cache"
            )
        
        # Generate new audio
        output_path = CACHE_DIR / f"{text_hash}.wav"
        
        success = generate_audio_piper(text, output_path)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to generate audio")
        
        return TTSResponse(
            success=True,
            audio_url=f"/api/audio/{text_hash}",
            cached=False,
            message="Audio generated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in text_to_speech: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/audio/{audio_hash}")
async def get_audio(audio_hash: str):
    """
    Serve cached audio file
    
    Args:
        audio_hash: MD5 hash of the text
        
    Returns:
        Audio file
    """
    # Validate hash format (prevent path traversal)
    if not re.match(r'^[a-f0-9]{32}$', audio_hash):
        raise HTTPException(status_code=400, detail="Invalid audio hash")
    
    audio_file = CACHE_DIR / f"{audio_hash}.wav"
    
    if not audio_file.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        audio_file,
        media_type="audio/wav",
        headers={
            "Cache-Control": "public, max-age=86400",  # Cache for 1 day
            "Accept-Ranges": "bytes"
        }
    )


@app.post("/api/tts/batch")
async def text_to_speech_batch(request: TTSRequest):
    """
    Convert long text to speech by splitting into chunks
    Returns array of audio URLs for seamless playback
    
    Args:
        request: TTS request with long text
        
    Returns:
        List of audio URLs
    """
    try:
        text = request.text.strip()
        
        if not text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Split text into chunks
        chunks = split_text(text, max_length=500)
        logger.info(f"Split text into {len(chunks)} chunks")
        
        audio_urls = []
        
        for i, chunk in enumerate(chunks):
            text_hash = get_text_hash(chunk)
            
            # Check cache
            cached_file = get_cached_audio(text_hash)
            if not cached_file:
                # Generate audio
                output_path = CACHE_DIR / f"{text_hash}.wav"
                success = generate_audio_piper(chunk, output_path)
                
                if not success:
                    logger.error(f"Failed to generate audio for chunk {i+1}")
                    continue
            
            audio_urls.append({
                "index": i,
                "url": f"/api/audio/{text_hash}",
                "text": chunk[:50] + "..." if len(chunk) > 50 else chunk
            })
        
        return {
            "success": True,
            "total_chunks": len(chunks),
            "audio_urls": audio_urls
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in batch TTS: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/cache/clear")
async def clear_cache():
    """Clear all cached audio files"""
    try:
        count = 0
        for wav_file in CACHE_DIR.glob("*.wav"):
            wav_file.unlink()
            count += 1
        
        logger.info(f"Cleared {count} cached files")
        return {
            "success": True,
            "message": f"Cleared {count} cached files"
        }
    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
