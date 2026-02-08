# Install FFmpeg for pydub (required for audio processing)

Write-Host "Checking FFmpeg installation..." -ForegroundColor Yellow

# Check if FFmpeg is installed
$ffmpegInstalled = $false
try {
    $ffmpegVersion = ffmpeg -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ FFmpeg is already installed" -ForegroundColor Green
        $ffmpegInstalled = $true
    }
} catch {
    Write-Host "✗ FFmpeg not found" -ForegroundColor Red
}

if (-not $ffmpegInstalled) {
    Write-Host ""
    Write-Host "Installing FFmpeg via Chocolatey..." -ForegroundColor Yellow
    
    # Check if Chocolatey is installed
    $chocoInstalled = $false
    try {
        choco --version 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $chocoInstalled = $true
        }
    } catch {}
    
    if ($chocoInstalled) {
        Write-Host "Installing FFmpeg..." -ForegroundColor Yellow
        choco install ffmpeg -y
        Write-Host "✓ FFmpeg installed successfully" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Manual Installation Required" -ForegroundColor Yellow
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Please install FFmpeg manually:" -ForegroundColor Yellow
        Write-Host "1. Download from: https://ffmpeg.org/download.html" -ForegroundColor White
        Write-Host "2. Or use Chocolatey: choco install ffmpeg" -ForegroundColor White
        Write-Host "3. Or use Scoop: scoop install ffmpeg" -ForegroundColor White
        Write-Host ""
    }
}

Write-Host ""
Write-Host "Note: FFmpeg is required for audio speed adjustment in TTS" -ForegroundColor Cyan
