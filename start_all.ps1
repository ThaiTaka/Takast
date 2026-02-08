# Complete Vietnamese Book Reader Startup with Piper TTS
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "VIETNAMESE BOOK READER - Complete Stack Startup" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

# Check Piper TTS
$piperExists = Test-Path ".\piper_tts_server\piper_bin\piper.exe"
$modelExists = Test-Path ".\piper_tts_server\models\vi_VN-25hours-single-low.onnx"

if ($piperExists -and $modelExists) {
    Write-Host "Piper TTS: Available (High-quality voice)" -ForegroundColor Green
    $usePiper = $true
} else {
    Write-Host "⚠ Piper TTS: Not configured (Will use Web Speech API)" -ForegroundColor Yellow
    Write-Host "  To enable Piper TTS, see: piper_tts_server\SETUP_GUIDE.md" -ForegroundColor Gray
    $usePiper = $false
}

Write-Host ""

# Start Piper TTS Server (if available)
if ($usePiper) {
    Write-Host "Starting Piper TTS Server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\bookweb\piper_tts_server; .\start_piper.ps1"
    Start-Sleep -Seconds 3
}

# Start Backend (Flask)
Write-Host "Starting Backend (Flask API)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\bookweb\backend; D:\bookweb\.venv\Scripts\python.exe app.py"

Start-Sleep -Seconds 3

# Start Frontend (React)
Write-Host "Starting Frontend (React + Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\bookweb\frontend; npm run dev"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "All services starting!" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Service URLs:" -ForegroundColor Yellow
Write-Host "   Frontend:      http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API:   http://localhost:5000" -ForegroundColor White
if ($usePiper) {
    Write-Host "   Piper TTS:     http://localhost:8000" -ForegroundColor White
    Write-Host "   TTS Demo:      http://localhost:8000" -ForegroundColor White
}
Write-Host ""

Write-Host "Features Available:" -ForegroundColor Yellow
Write-Host "   - Voice Search (Web Speech API)" -ForegroundColor Green
Write-Host "   - AI Semantic Search (10,000+ books)" -ForegroundColor Green
Write-Host "   - Favorites System" -ForegroundColor Green
Write-Host "   - Reading Settings (Font, Colors, Themes)" -ForegroundColor Green
if ($usePiper) {
    Write-Host "   - Piper TTS (High-quality Vietnamese voice)" -ForegroundColor Green
} else {
    Write-Host "   - Web Speech API TTS (Basic voice)" -ForegroundColor Green
}
Write-Host ""

Write-Host "Tips:" -ForegroundColor Yellow
if ($usePiper) {
    Write-Host "   - Use Piper TTS option in book reader for best voice quality" -ForegroundColor Gray
    Write-Host "   - First audio generation takes 2-3s, then cached (instant)" -ForegroundColor Gray
}
Write-Host "   - Close terminal windows to stop all services" -ForegroundColor Gray
Write-Host "   - Check training progress: python train_offline.py" -ForegroundColor Gray
Write-Host ""

Write-Host "Opening browser in 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Done! Enjoy reading!" -ForegroundColor Green
Write-Host ""
