@echo off
echo ========================================================
echo   Launching TerraPulse Full-Stack Ecosystem
echo ========================================================
echo.

echo Starting FastAPI Backend on http://localhost:8000 ...
start "TerraPulse Backend API" cmd /k "cd backend && py -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Waiting for Backend initialization...
timeout /t 3 /nobreak >nul

echo Starting Vite React Frontend on http://localhost:5173 ...
start "TerraPulse Frontend UI" cmd /k "cd frontend && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo ========================================================
echo   TerraPulse is now running!
echo   Frontend UI:  http://localhost:5173
echo   API Docs:     http://localhost:8000/docs
echo ========================================================
echo.
pause

