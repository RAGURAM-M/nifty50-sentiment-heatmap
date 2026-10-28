@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo  NIFTY 50 FINANCIAL SENTIMENT ANALYZER & STOCK HEATMAP
echo ========================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected:
node -v
echo.

:: 2. Check and install backend dependencies if missing
if not exist "%~dp0backend\node_modules\" (
    echo [SETUP] Installing backend dependencies (first time setup)...
    cd /d "%~dp0backend"
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies!
        pause
        exit /b 1
    )
    cd /d "%~dp0"
    echo [OK] Backend dependencies ready.
    echo.
)

:: 3. Check and install frontend dependencies if missing
if not exist "%~dp0frontend\node_modules\" (
    echo [SETUP] Installing frontend dependencies (first time setup)...
    cd /d "%~dp0frontend"
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies!
        pause
        exit /b 1
    )
    cd /d "%~dp0"
    echo [OK] Frontend dependencies ready.
    echo.
)

:: 4. Launch Backend Server in a new window
echo [1/2] Starting Backend Server on http://localhost:5000...
start "Nifty50 Backend API" cmd /k "cd /d %~dp0backend && npm start"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

:: 5. Launch Frontend Dev Server in a new window
echo [2/2] Starting Frontend Dev Server on http://127.0.0.1:5173...
start "Nifty50 Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait 2 seconds and open default browser
timeout /t 2 /nobreak >nul
echo.
echo [LAUNCH] Opening Web Application in your browser...
start http://127.0.0.1:5173/

echo.
echo ========================================================
echo  Both services launched successfully!
echo  - Frontend Web App: http://127.0.0.1:5173/
echo  - Backend REST API: http://localhost:5000/
echo.
echo  NOTE: If MongoDB is not installed on this PC, the app
echo  automatically uses its built-in in-memory database!
echo ========================================================
pause
