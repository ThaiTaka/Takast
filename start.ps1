# Start both Backend and Frontend simultaneously
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vietnamese Book Reader - Full Stack" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to start backend
$backendJob = {
    Set-Location "D:\bookweb\backend"
    Write-Host "[Backend] Starting on http://localhost:5000..." -ForegroundColor Yellow
    & "D:\bookweb\.venv\Scripts\python.exe" app.py
}

# Function to start frontend
$frontendJob = {
    Set-Location "D:\bookweb\frontend"
    Write-Host "[Frontend] Starting on http://localhost:3000..." -ForegroundColor Yellow
    npm run dev
}

Write-Host "Starting Backend Server..." -ForegroundColor Green
$backend = Start-Job -ScriptBlock $backendJob

Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Green
$frontend = Start-Job -ScriptBlock $frontendJob

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Both servers are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Monitor both jobs
try {
    while ($true) {
        # Show backend output
        $backendOutput = Receive-Job -Job $backend -ErrorAction SilentlyContinue
        if ($backendOutput) {
            $backendOutput | ForEach-Object { Write-Host "[Backend] $_" -ForegroundColor Cyan }
        }
        
        # Show frontend output
        $frontendOutput = Receive-Job -Job $frontend -ErrorAction SilentlyContinue
        if ($frontendOutput) {
            $frontendOutput | ForEach-Object { Write-Host "[Frontend] $_" -ForegroundColor Magenta }
        }
        
        # Check if jobs are still running
        if ($backend.State -ne 'Running' -and $frontend.State -ne 'Running') {
            Write-Host "Both servers have stopped." -ForegroundColor Red
            break
        }
        
        Start-Sleep -Milliseconds 500
    }
}
finally {
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Job -Job $backend, $frontend -ErrorAction SilentlyContinue
    Remove-Job -Job $backend, $frontend -ErrorAction SilentlyContinue
    Write-Host "Servers stopped." -ForegroundColor Green
}
