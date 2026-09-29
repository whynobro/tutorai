@echo off
setlocal
cd /d "%~dp0"
title TutorAI Setup
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\setup-windows.ps1"
set "EXIT_CODE=%ERRORLEVEL%"
echo.
if not "%EXIT_CODE%"=="0" echo Setup did not finish successfully.
pause
exit /b %EXIT_CODE%

