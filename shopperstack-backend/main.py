from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import uvicorn
import os
import asyncio
from typing import Dict, List

# Service helpers
from utils.encode_image import encode_uploaded_file
from services.gemini import caption_image_from_base64, refine_query
from services.tavily import search as tavily_search_service
from services.serp import SerpService

# Load environment variables
load_dotenv()

# Get API keys from environment
HF_API_KEY = os.getenv("HF_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Create FastAPI app instance
app = FastAPI(
    title="ShopperStack Backend",
    description="AI-powered image-to-product matching backend",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# instantiate SerpService directly (avoid agent import issues)
serp_service = SerpService()

async def search_products(query: str):
    """Run tavily search and serp search in parallel and merge results."""
    loop = asyncio.get_event_loop()
    tavily_future = loop.run_in_executor(None, tavily_search_service, query)
    serp_future = loop.run_in_executor(None, serp_service.search_products, query)

    tavily_results, serp_results = await asyncio.gather(tavily_future, serp_future)

    # Normalize results to lists
    if tavily_results is None:
        tavily_results = []
    elif not isinstance(tavily_results, list):
        tavily_results = [tavily_results]

    if serp_results is None:
        serp_results = []
    elif not isinstance(serp_results, list):
        serp_results = [serp_results]

    # Simple merge: concatenation (you can improve ranking/duplicates later)
    return tavily_results + serp_results

@app.get("/")
async def read_root():
    """Health check endpoint"""
    return {
        "message": "ShopperStack Backend is running!",
        "status": "healthy",
        "apis_configured": {
            "huggingface": bool(HF_API_KEY),
            "gemini": bool(GEMINI_API_KEY),
            "tavily": bool(TAVILY_API_KEY)
        }
    }

@app.get("/health")
async def health_check():
    """Detailed health check with API status"""
    return {
        "status": "healthy",
        "timestamp": "2024-01-01T00:00:00Z",
        "api_keys": {
            "huggingface": "configured" if HF_API_KEY else "missing",
            "gemini": "configured" if GEMINI_API_KEY else "missing", 
            "tavily": "configured" if TAVILY_API_KEY else "missing"
        }
    }

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image and process it through the AI pipeline:
    1. BLIP (HF) → raw caption
    2. Gemini → refined search query  
    3. Tavily + Serp → product search results
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400, 
                detail="File must be an image (JPEG, PNG, etc.)"
            )
        
        print(f"Processing upload: {file.filename} ({file.content_type})")
        
        # Step 1: Encode image to base64
        base64_img = encode_uploaded_file(file)
        print(f"Image encoded successfully, size: {len(base64_img)} chars")
        
        # Step 2: Generate raw caption using Gemini Vision
        print("Calling Gemini Vision API for image caption...")
        try:
            raw_caption = caption_image_from_base64(base64_img)
            print(f"Gemini Vision caption generated: {raw_caption}")
        except Exception as e:
            print(f"Gemini Vision API failed: {e}")
            raw_caption = "An image of clothing or fashion item"
        
        # Step 3: Refine caption using Gemini API
        print("Calling Gemini API for query refinement...")
        try:
            refined_query = refine_query(raw_caption)
            print(f"Gemini refinement: {refined_query}")
        except Exception as e:
            print(f"Gemini API failed: {e}")
            refined_query = raw_caption
        
        # Step 4: Search products using Tavily and Serp APIs
        print("Calling Tavily and Serp APIs for product search...")
        try:
            search_results = await search_products(refined_query)
            print(f"Search returned {len(search_results) if isinstance(search_results, list) else 'results'}")
        except Exception as e:
            print(f"Search APIs failed: {e}")
            search_results = []
        
        # Return the complete pipeline results
        return {
            "success": True,
            "raw_caption": raw_caption,
            "refined_query": refined_query,
            "results": search_results,
            "processing_info": {
                "apis_used": {
                    "blip": bool(HF_API_KEY),
                    "gemini": bool(GEMINI_API_KEY),
                    "tavily": bool(TAVILY_API_KEY)
                }
            }
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"Unexpected error in upload_image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

# For development - run with: uvicorn main:app --reload
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
