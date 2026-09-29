@echo off
setlocal
cd /d "%~dp0"
title TutorAI Local API
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-tutorai.ps1"
set "EXIT_CODE=%ERRORLEVEL%"
echo.
if not "%EXIT_CODE%"=="0" echo TutorAI stopped with an error.
pause
exit /b %EXIT_CODE%

