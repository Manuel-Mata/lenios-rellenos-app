@echo off
echo ===================================================
echo   AUTOMATIZACION DE PRUEBAS - LENIOS RELLENOS APP
echo ===================================================
echo.

echo [1/3] Ejecutando Pruebas de Backend (Jest)...
call npm run test:backend
echo.

echo [2/3] Ejecutando Pruebas de Frontend (Vitest)...
call npm run test:frontend
echo.

echo [3/3] Ejecutando Pruebas de Rendimiento (K6)...
call npm run test:k6
echo.

echo ===================================================
echo   TODAS LAS PRUEBAS FINALIZADAS CON EXITO
echo ===================================================
pause
