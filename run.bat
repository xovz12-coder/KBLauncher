@echo off
title KBLauncher
cd /d "%~dp0"

echo ==========================================
echo       Запуск лаунчера KBLauncher
echo ==========================================

:: Запуск легковесного локального веб-сервера
start /B node server.js >nul 2>&1

:: Небольшая пауза для инициализации сервера
timeout /t 1 /nobreak >nul

:: Запуск в режиме отдельного настольного окна без рамок браузера
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    echo [KBLauncher] Запуск в режиме рабочего стола (Edge App)...
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:3000 --window-size=1280,720
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo [KBLauncher] Запуск в режиме рабочего стола (Chrome App)...
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000 --window-size=1280,720
) else (
    echo [KBLauncher] Открытие в браузере...
    start http://localhost:3000
)

echo [KBLauncher] Лаунчер успешно запущен!
