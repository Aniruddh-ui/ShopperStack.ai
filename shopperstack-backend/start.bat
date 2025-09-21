@echo off
echo Starting ShopperStack Backend...
echo.
echo Make sure you have:
echo 1. Created a .env file with your API keys
echo 2. Installed dependencies with: pip install -r requirements.txt
echo.
echo Starting server on http://127.0.0.1:8000
echo Press Ctrl+C to stop
echo.

.venv\Scripts\python main.py

pause 