from pydantic import BaseSettings

class Settings(BaseSettings):
    piper_executable: str = "/path/to/piper/executable"
    model_path: str = "/path/to/piper/models"
    audio_cache_path: str = "/path/to/audio/cache"

    class Config:
        env_file = ".env"