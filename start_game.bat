@echo off
setlocal
title Math-Laro: Bislig Edition - Launcher

echo ========================================================
echo   Math-Laro: Bislig Edition (Leyte) - Client Launcher
echo ========================================================
echo.

:: Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo Recommended version: LTS
    echo.
    pause
    exit /b
)

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] First time setup: Installing dependencies...
    echo (This may take a minute, please wait)
    call npm install
)

:: Start the game
echo [INFO] Starting the Math-Laro application...
echo Opening browser to http://localhost:5173 (or 5174)...
echo.
npm run dev

pause
