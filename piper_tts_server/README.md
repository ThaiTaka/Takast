# Piper TTS Server - Vietnamese Text-to-Speech

🎙️ Local TTS server using **Piper** engine for Vietnamese book reading with intelligent caching and seamless audio playback.

## 🚀 Features

- ✅ **High-performance FastAPI backend** with async processing
- ✅ **Intelligent MD5 caching** - Never regenerate the same audio twice
- ✅ **Smart text splitting** - Automatically handles long book content
- ✅ **Seamless audio queue** - Continuous playback without gaps
- ✅ **Vietnamese language support** - Optimized for Vietnamese text
- ✅ **GPU acceleration ready** - Works with CUDA-enabled systems
- ✅ **Beautiful demo interface** - Test immediately with included HTML page

## 📁 Project Structure

```
piper_tts_server/
├── server.py              # FastAPI backend
├── index.html             # Demo frontend
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── piper_bin/            # ⚠️ Place piper.exe here
├── models/               # ⚠️ Place .onnx and .onnx.json here
└── cache/                # Auto-generated audio cache
```

## 🔧 Installation

### Step 1: Install Dependencies

```powershell
# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install required packages
pip install -r requirements.txt
```

### Step 2: Download Piper TTS

1. **Download Piper executable:**
   - Visit: https://github.com/rhasspy/piper/releases
   - Download: `piper_windows_amd64.zip` (latest version)
   - Extract `piper.exe` to `piper_bin/` folder

2. **Download Vietnamese model:**
   - Visit: https://github.com/rhasspy/piper/releases/tag/2023.11.14-2
   - Download: `vi_VN-25hours-single-low.onnx` and `vi_VN-25hours-single-low.onnx.json`
   - Place both files in `models/` folder

### Step 3: Verify Structure

Your folder should look like this:

```
piper_tts_server/
├── piper_bin/
│   └── piper.exe                              ✓
├── models/
│   ├── vi_VN-25hours-single-low.onnx         ✓
│   └── vi_VN-25hours-single-low.onnx.json    ✓
├── cache/                                     (empty, auto-created)
├── server.py
├── index.html
└── requirements.txt
```

## 🎮 Usage

### Start the Server

```powershell
# From piper_tts_server directory
python server.py
```

Server will start at: **http://localhost:8000**

### Access Demo Page

Open browser and visit: **http://localhost:8000**

### API Endpoints

#### 1. Single Text-to-Speech

```bash
POST http://localhost:8000/api/tts
Content-Type: application/json

{
  "text": "Xin chào, đây là hệ thống TTS tiếng Việt."
}
```

**Response:**
```json
{
  "success": true,
  "audio_url": "/api/audio/abc123...",
  "cached": false,
  "message": "Audio generated successfully"
}
```

#### 2. Batch Text-to-Speech (Long Text)

```bash
POST http://localhost:8000/api/tts/batch
Content-Type: application/json

{
  "text": "Very long book content here..."
}
```

**Response:**
```json
{
  "success": true,
  "total_chunks": 15,
  "audio_urls": [
    {"index": 0, "url": "/api/audio/hash1", "text": "First sentence..."},
    {"index": 1, "url": "/api/audio/hash2", "text": "Second sentence..."}
  ]
}
```

#### 3. Get Audio File

```bash
GET http://localhost:8000/api/audio/{hash}
```

Returns WAV file (audio/wav)

#### 4. Health Check

```bash
GET http://localhost:8000/api/health
```

#### 5. Clear Cache

```bash
DELETE http://localhost:8000/api/cache/clear
```

## 🧠 How It Works

### 1. Text Processing
- Text is split into chunks (<500 chars) based on Vietnamese punctuation
- Each chunk is processed independently for faster response

### 2. Intelligent Caching
- MD5 hash is calculated for each text chunk
- If audio exists in cache, return immediately (no Piper call)
- Cache persists between server restarts

### 3. Audio Generation
- Piper subprocess is called with text via stdin (UTF-8 encoding)
- WAV file is generated and saved to cache
- File is served via FastAPI FileResponse

### 4. Seamless Playback (Frontend)
- Audio queue manages multiple chunks
- `onended` event triggers next audio automatically
- No gaps between audio segments

## 🎯 Integration with Book Reader

To integrate with your existing book reader (`bookweb`), update `BookReader.jsx`:

```javascript
// Replace Web Speech API with Piper TTS
async function readFromLine(lineIndex) {
  const text = book.lines.slice(lineIndex, lineIndex + 10).join(' ');
  
  // Call Piper API
  const response = await fetch('http://localhost:8000/api/tts/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  
  const data = await response.json();
  
  // Play audio queue
  playAudioQueue(data.audio_urls);
}
```

## ⚡ Performance Optimization

### Cache Benefits
- First request: ~2-5 seconds (Piper generation)
- Cached request: ~50ms (file serve)
- **10x-100x faster** for repeated content

### GPU Acceleration
- Piper automatically uses GPU if available
- RTX 3050 will significantly speed up synthesis
- No additional configuration needed

## 🐛 Troubleshooting

### Server won't start

**Check Piper executable:**
```powershell
Test-Path .\piper_bin\piper.exe
```

**Check model files:**
```powershell
Test-Path .\models\vi_VN-25hours-single-low.onnx
Test-Path .\models\vi_VN-25hours-single-low.onnx.json
```

### Audio not generating

**Test Piper manually:**
```powershell
.\piper_bin\piper.exe --model .\models\vi_VN-25hours-single-low.onnx --output_file test.wav
# Type some Vietnamese text and press Ctrl+Z then Enter
```

### CORS errors

Frontend must call from `http://localhost:3000` or update CORS settings in `server.py`:

```python
allow_origins=["http://localhost:3000", "http://localhost:5000"]
```

## 📊 Cache Management

### View cache size:
```powershell
Get-ChildItem .\cache -Recurse | Measure-Object -Property Length -Sum
```

### Clear cache manually:
```powershell
Remove-Item .\cache\*.wav
```

Or use API: `DELETE http://localhost:8000/api/cache/clear`

## 🔒 Security Notes

- This server is designed for **local development only**
- Do not expose to public internet without authentication
- Cache directory can grow large - monitor disk space
- Consider implementing cache size limits for production

## 🎓 Advanced Usage

### Custom Voice Models

Replace model files with other Vietnamese models from Piper:
- `vi_VN-vais1000-medium.onnx` (higher quality, slower)
- `vi_VN-vivos-medium.onnx` (alternative voice)

### Batch Processing

For large book imports:
```python
import asyncio
import aiohttp

async def generate_all_chapters():
    async with aiohttp.ClientSession() as session:
        tasks = [generate_audio(session, chapter) for chapter in chapters]
        await asyncio.gather(*tasks)
```

## 📝 License

- **This server code**: MIT License
- **Piper TTS**: MIT License
- **Vietnamese models**: Check individual model licenses

## 🤝 Contributing

Contributions welcome! Please:
1. Test thoroughly with Vietnamese text
2. Maintain code style
3. Update documentation

## 📞 Support

For issues:
1. Check logs in terminal
2. Verify Piper works standalone
3. Test with demo page first
4. Check CORS configuration

---

**Made with ❤️ for Vietnamese book readers**

🎉 Enjoy high-quality Vietnamese text-to-speech!
