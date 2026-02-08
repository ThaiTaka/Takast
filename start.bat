@echo off
echo ========================================
echo Vietnamese Book Reader - Full Stack
echo ========================================
echo.

echo Starting Backend and Frontend...
echo.

start "Backend Server" cmd /k "cd /d D:\bookweb\backend && D:\bookweb\.venv\Scripts\python.exe app.py"

timeout /t 3 /nobreak >nul

start "Frontend Server" cmd /k "cd /d D:\bookweb\frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close the terminal windows to stop servers
echo.
pause
