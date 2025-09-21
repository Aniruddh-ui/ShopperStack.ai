# ShopperStack Backend

AI-powered image-to-product matching backend using FastAPI.

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure API Keys
Create a `.env` file in the root directory with your API keys:

```bash
# HuggingFace API Key for BLIP image captioning
# Get from: https://huggingface.co/settings/tokens
HF_API_KEY=your_huggingface_api_key_here

# Gemini API Key for query refinement
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Tavily API Key for product search
# Get from: https://tavily.com/
TAVILY_API_KEY=your_tavily_api_key_here
```

### 3. Run the Backend
```bash
# Option 1: Direct Python
python main.py

# Option 2: Uvicorn (recommended)
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 4. Test the API
- Health check: `GET http://127.0.0.1:8000/`
- Upload image: `POST http://127.0.0.1:8000/upload`

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health check with API status
- `POST /upload` - Upload image and get AI analysis

## How It Works

1. **Image Upload** → Backend receives image file
2. **BLIP (HuggingFace)** → Generates raw caption from image
3. **Gemini API** → Refines caption into search query
4. **Tavily API** → Searches for similar products
5. **Response** → Returns caption, refined query, and product results

## Troubleshooting

- If APIs return fallback data, check your `.env` file
- Ensure all API keys are valid and have proper permissions
- Check console logs for detailed error messages 