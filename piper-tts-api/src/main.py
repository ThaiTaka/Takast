from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.tts import router as tts_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tts_router, prefix="/api", tags=["TTS"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Piper TTS API!"}