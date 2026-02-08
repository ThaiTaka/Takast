# Simple one-command starter
Write-Host "🚀 Starting Vietnamese Book Reader..." -ForegroundColor Green
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\bookweb\backend; D:\bookweb\.venv\Scripts\python.exe app.py"

# Wait a bit
Start-Sleep -Seconds 3

# Start frontend in new window  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\bookweb\frontend; npm run dev"

# Wait a bit
Start-Sleep -Seconds 2

Write-Host "✓ Backend starting at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "✓ Frontend starting at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✓ Done! Close the terminal windows to stop servers." -ForegroundColor Green
