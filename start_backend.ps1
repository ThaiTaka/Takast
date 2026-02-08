# Start Backend Server
Write-Host "Starting Vietnamese Book Reader Backend..." -ForegroundColor Green
Write-Host "Dataset Path: C:\Users\karin\.cache\kagglehub\datasets\iambestfeeder\10000-vietnamese-books\versions\1\output" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot
Set-Location -Path backend

& "$PSScriptRoot\.venv\Scripts\python.exe" app.py
