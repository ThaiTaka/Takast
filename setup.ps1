# Install all dependencies for Vietnamese Book Reader

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vietnamese Book Reader - Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
python --version

# Install Backend Dependencies
Write-Host "`nInstalling Backend (Python) dependencies..." -ForegroundColor Yellow
Set-Location -Path $PSScriptRoot
& "$PSScriptRoot\.venv\Scripts\python.exe" -m pip install --upgrade pip
& "$PSScriptRoot\.venv\Scripts\python.exe" -m pip install -r backend/requirements.txt

# Install Frontend Dependencies
Write-Host "`nInstalling Frontend (Node.js) dependencies..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\frontend"
npm install

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host "1. Backend:  .\start_backend.ps1" -ForegroundColor White
Write-Host "2. Frontend: .\start_frontend.ps1" -ForegroundColor White
Write-Host ""
