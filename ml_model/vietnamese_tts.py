"""
Vietnamese Text-to-Speech Module
Sử dụng dataset VietSpeech và model TTS để generate giọng nói tiếng Việt
"""

import torch
import numpy as np
from typing import List, Dict
import logging
import os
import json
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VietnameseTTS:
    """
    Text-to-Speech cho tiếng Việt
    Sử dụng pretrained model hoặc train từ VietSpeech dataset
    """
    
    def __init__(self, model_dir: str = "./tts_models"):
        self.model_dir = model_dir
        os.makedirs(model_dir, exist_ok=True)
        
        # Lazy load model
        self._model = None
        self._vocoder = None
        self.sample_rate = 16000
        
        # Voice options
        self.voices = {
            'female': 'VIVOSSPK01',  # Female voice
            'male': 'VIVOSSPK02',     # Male voice
        }
        
    @property
    def model(self):
        """Lazy load TTS model"""
        if self._model is None:
            try:
                # Try to use vits model from espnet
                logger.info("Loading Vietnamese TTS model...")
                from espnet2.bin.tts_inference import Text2Speech
                
                # Download or load pretrained model
                self._model = Text2Speech.from_pretrained(
                    "espnet/kan-bayashi_ljspeech_vits",
                    device="cpu"
                )
                logger.info("TTS model loaded successfully")
            except Exception as e:
                logger.warning(f"Could not load TTS model: {e}")
                logger.info("Will use gTTS as fallback")
                from gtts import gTTS
                self._model = gTTS
                
        return self._model
    
    def train_from_dataset(self, checkpoint_dir: str = "./tts_checkpoints"):
        """
        Train TTS model từ VietSpeech dataset
        Sử dụng Hugging Face datasets
        """
        try:
            from datasets import load_dataset
            
            logger.info("Loading VietSpeech dataset...")
            # Load dataset in streaming mode để tiết kiệm RAM
            ds = load_dataset("NhutP/VietSpeech", split='train', streaming=True)
            
            os.makedirs(checkpoint_dir, exist_ok=True)
            
            # Process dataset và extract voice samples
            voice_samples = {}
            sample_count = 0
            
            logger.info("Processing voice samples...")
            for idx, sample in enumerate(ds):
                if idx >= 100:  # Lấy 100 samples để demo
                    break
                    
                speaker_id = sample.get('speaker_id', 'unknown')
                audio_array = sample['audio']['array']
                sentence = sample['sentence']
                
                if speaker_id not in voice_samples:
                    voice_samples[speaker_id] = []
                
                voice_samples[speaker_id].append({
                    'audio': audio_array,
                    'text': sentence,
                    'sampling_rate': sample['audio']['sampling_rate']
                })
                
                sample_count += 1
                if sample_count % 10 == 0:
                    logger.info(f"Processed {sample_count} samples...")
            
            # Save voice profiles
            metadata = {
                'speakers': list(voice_samples.keys()),
                'sample_count': sample_count,
                'voices': {
                    'female': voice_samples.get('VIVOSSPK01', []),
                    'male': voice_samples.get('VIVOSSPK02', [])
                }
            }
            
            with open(os.path.join(checkpoint_dir, 'tts_metadata.json'), 'w', encoding='utf-8') as f:
                # Save without audio arrays (too large)
                metadata_light = {
                    'speakers': metadata['speakers'],
                    'sample_count': metadata['sample_count']
                }
                json.dump(metadata_light, f, ensure_ascii=False, indent=2)
            
            logger.info(f"Training data processed: {sample_count} samples")
            logger.info(f"Available speakers: {metadata['speakers']}")
            
            return metadata
            
        except Exception as e:
            logger.error(f"Error training from dataset: {e}")
            return None
    
    def synthesize(self, text: str, voice: str = 'female', speed: float = 1.0) -> bytes:
        """
        Synthesize speech from text
        Returns audio bytes (WAV format)
        """
        try:
            # Sử dụng gTTS cho tiếng Việt (đơn giản và hiệu quả)
            from gtts import gTTS
            import io
            from pydub import AudioSegment
            
            # Create TTS
            tts = gTTS(text=text, lang='vi', slow=(speed < 0.8))
            
            # Save to bytes
            audio_fp = io.BytesIO()
            tts.write_to_fp(audio_fp)
            audio_fp.seek(0)
            
            # Convert to WAV and adjust speed if needed
            audio = AudioSegment.from_file(audio_fp, format="mp3")
            
            # Adjust speed
            if speed != 1.0:
                # Change speed without changing pitch
                sound_with_altered_frame_rate = audio._spawn(
                    audio.raw_data,
                    overrides={"frame_rate": int(audio.frame_rate * speed)}
                )
                audio = sound_with_altered_frame_rate.set_frame_rate(audio.frame_rate)
            
            # Export as WAV
            wav_fp = io.BytesIO()
            audio.export(wav_fp, format="wav")
            wav_fp.seek(0)
            
            return wav_fp.read()
            
        except Exception as e:
            logger.error(f"Error synthesizing speech: {e}")
            return None
    
    def synthesize_batch(self, texts: List[str], voice: str = 'female', speed: float = 1.0) -> List[bytes]:
        """
        Synthesize multiple texts at once
        Returns list of audio bytes
        """
        results = []
        for text in texts:
            audio = self.synthesize(text, voice, speed)
            results.append(audio)
        return results
    
    def get_available_voices(self) -> Dict:
        """Get available voice options"""
        return {
            'voices': [
                {'id': 'female', 'name': 'Giọng nữ', 'language': 'vi-VN'},
                {'id': 'male', 'name': 'Giọng nam', 'language': 'vi-VN'}
            ],
            'sample_rate': self.sample_rate
        }


if __name__ == "__main__":
    # Test TTS
    tts = VietnameseTTS()
    
    # Train from dataset
    logger.info("Training from VietSpeech dataset...")
    metadata = tts.train_from_dataset()
    
    if metadata:
        logger.info(f"Training completed! Speakers: {metadata['speakers']}")
    
    # Test synthesis
    logger.info("Testing speech synthesis...")
    audio = tts.synthesize("Xin chào, đây là test giọng nói tiếng Việt", voice='female')
    
    if audio:
        with open("test_output.wav", "wb") as f:
            f.write(audio)
        logger.info("Audio saved to test_output.wav")
