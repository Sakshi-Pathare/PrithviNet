@echo off
echo Stopping PrithviNet processes...
taskkill /F /IM uvicorn.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
echo PrithviNet stopped successfully.
pause

