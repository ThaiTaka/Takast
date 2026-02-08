# Start Frontend Development Server
Write-Host "Starting Vietnamese Book Reader Frontend..." -ForegroundColor Green
Write-Host "Opening browser at: http://localhost:3000" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot
Set-Location -Path frontend

npm run dev
