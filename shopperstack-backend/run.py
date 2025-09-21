#!/usr/bin/env python3
"""
Robust startup script for the shopperstack backend
Handles uAgents lifecycle and suppresses harmless warnings
"""

import asyncio
import warnings
import sys
from main import app
import uvicorn

# Suppress specific asyncio warnings
warnings.filterwarnings("ignore", category=RuntimeWarning, message=".*coroutine.*was never awaited.*")
warnings.filterwarnings("ignore", category=RuntimeWarning, message=".*Task was destroyed.*")

def main():
    """Main entry point with proper error handling"""
    try:
        print("Starting ShopperStack Backend...")
        print("FastAPI server will run on: http://127.0.0.1:8000")
        print("Image Caption Agent will run on: http://127.0.0.1:8002")
        print("Tavily Agent will run on: http://127.0.0.1:8003")
        print("Press Ctrl+C to stop the server")
        
        uvicorn.run(
            "main:app",
            host="127.0.0.1",
            port=8000,
            log_level="info",
            access_log=True
        )
        
    except KeyboardInterrupt:
        print("\nShutting down gracefully...")
    except Exception as e:
        print(f"Error starting application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
