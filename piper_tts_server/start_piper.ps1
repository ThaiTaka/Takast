# Start Piper TTS Server
Write-Host "🚀 Starting Piper TTS Server..." -ForegroundColor Green
Write-Host ""

# Check if piper.exe exists
$piperPath = ".\piper_bin\piper.exe"
if (-not (Test-Path $piperPath)) {
    Write-Host "❌ Error: piper.exe not found!" -ForegroundColor Red
    Write-Host "Please download from: https://github.com/rhasspy/piper/releases" -ForegroundColor Yellow
    Write-Host "Place piper.exe in: piper_bin\" -ForegroundColor Yellow
    pause
    exit 1
}

# Check if model exists
$modelPath = ".\models\vi_VN-25hours-single-low.onnx"
if (-not (Test-Path $modelPath)) {
    Write-Host "❌ Error: Model file not found!" -ForegroundColor Red
    Write-Host "Please download Vietnamese model from Piper releases" -ForegroundColor Yellow
    Write-Host "Place .onnx and .onnx.json in: models\" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✓ Piper executable found" -ForegroundColor Green
Write-Host "✓ Model file found" -ForegroundColor Green
Write-Host ""

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& D:\bookweb\.venv\Scripts\Activate.ps1

# Install requirements if needed
Write-Host "Checking dependencies..." -ForegroundColor Cyan
pip show fastapi | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

Write-Host ""
Write-Host "✓ Starting Piper TTS Server on port 8000..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at:" -ForegroundColor Cyan
Write-Host "  - API: http://localhost:8000" -ForegroundColor White
Write-Host "  - Demo: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop server" -ForegroundColor Yellow
Write-Host ""

# Start server
python server.py
