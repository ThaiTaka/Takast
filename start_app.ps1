# Start both Backend and Frontend
Write-Host "Vietnamese Book Reader - Starting Application" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Start Backend in new window
Write-Host "`nStarting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\bookweb\backend; D:/bookweb/.venv/Scripts/python.exe app.py"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend in new window
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\bookweb\frontend; npm run dev"

Write-Host "`n✅ Application started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
