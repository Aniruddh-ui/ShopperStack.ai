import os
import time
import requests
import base64
from dotenv import load_dotenv
from typing import Optional, List

# Load environment variables
load_dotenv()

# Hugging Face Access Token
HF_API_KEY = os.getenv("HF_API_KEY")

# Read model from env (trim whitespace) or use default
_env_model = (os.getenv("HF_BLIP_MODEL") or "Salesforce/blip-image-captioning-large").strip()

# Ordered fallback list
HF_MODEL_CANDIDATES: List[str] = [
    _env_model,
    "Salesforce/blip-image-captioning-large",
    "Salesforce/blip-image-captioning-base",
    "nlpconnect/vit-gpt2-image-captioning",
]


def _build_headers(content_type: Optional[str] = None) -> dict:
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "X-Wait-For-Model": "true",
    }
    if content_type:
        headers["Content-Type"] = content_type
    return headers


def _detect_content_type(image_bytes: bytes, data_url_mime: Optional[str] = None) -> str:
    if data_url_mime:
        return data_url_mime
    if image_bytes.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if image_bytes.startswith(b"GIF87a") or image_bytes.startswith(b"GIF89a"):
        return "image/gif"
    if len(image_bytes) >= 12 and image_bytes[0:4] == b"RIFF" and image_bytes[8:12] == b"WEBP":
        return "image/webp"
    if image_bytes.startswith(b"BM"):
        return "image/bmp"
    return "application/octet-stream"


def _hf_url(model_id: str) -> str:
    return f"https://api-inference.huggingface.co/models/{model_id}"


def _post_with_retries(image_bytes: bytes, content_type: str, model_id: str, max_retries: int = 3, timeout: int = 60):
    if not HF_API_KEY:
        return None, 0, "Error: Hugging Face API key not found. Set HF_API_KEY in .env.", model_id

    last_err_text = None
    url = _hf_url(model_id)
    for attempt in range(max_retries):
        try:
            resp = requests.post(url, headers=_build_headers(content_type), data=image_bytes, timeout=timeout)
            if resp.status_code == 200:
                return resp, resp.status_code, None, model_id
            last_err_text = resp.text
            # retry on transient 5xx
            if resp.status_code >= 500:
                time.sleep(1.5 ** attempt)
                continue
            # otherwise stop
            return resp, resp.status_code, last_err_text, model_id
        except Exception as e:
            last_err_text = str(e)
            time.sleep(1.5 ** attempt)
    return None, 0, last_err_text or "Unknown error", model_id


def _caption_via_models(image_bytes: bytes, content_type: str):
    """Try each candidate model until one returns 200; return (response, status, err, model_used)."""
    tried = []
    for m in HF_MODEL_CANDIDATES:
        m = m.strip()
        if not m or m in tried:
            continue
        resp, status, err, used = _post_with_retries(image_bytes, content_type, m)
        if resp is not None and status == 200:
            return resp, status, None, used
        # If 404, keep trying next model automatically
        tried.append(m)
    return None, 0, f"All models failed. Last error: {err}", HF_MODEL_CANDIDATES[-1]


# Public helpers

def generate_caption(image_path: str) -> str:
    if not HF_API_KEY:
        return "Error: Hugging Face API key not found. Set HF_API_KEY in .env."

    with open(image_path, "rb") as f:
        image_bytes = f.read()

    content_type = _detect_content_type(image_bytes)
    resp, status, err, model_used = _caption_via_models(image_bytes, content_type)
    if not resp:
        return f"Failed to generate caption: {err} (model tried: {model_used})"

    try:
        data = resp.json()
        if isinstance(data, list) and len(data) > 0:
            first = data[0]
            if isinstance(first, dict) and "generated_text" in first:
                return first["generated_text"]
            if isinstance(first, str):
                return first
        if isinstance(data, dict):
            if "generated_text" in data:
                return data["generated_text"]
            if "text" in data:
                return data["text"]
        text = resp.text.strip()
        if text:
            return text
        return "No caption generated"
    except Exception as e:
        return f"Error parsing response: {e}"


def generate_caption_from_base64(image_base64: str) -> str:
    if not HF_API_KEY:
        return "Error: Hugging Face API key not found. Set HF_API_KEY in .env."

    data_url_mime = None
    if image_base64.startswith("data:"):
        try:
            prefix, payload = image_base64.split(",", 1)
            if prefix.startswith("data:") and ";" in prefix:
                data_url_mime = prefix.split(":", 1)[1].split(";", 1)[0]
            image_base64 = payload
        except Exception:
            return "Error: Invalid data URL"

    try:
        image_bytes = base64.b64decode(image_base64)
    except Exception as e:
        return f"Error decoding base64 image: {e}"

    content_type = _detect_content_type(image_bytes, data_url_mime)
    resp, status, err, model_used = _caption_via_models(image_bytes, content_type)
    if not resp:
        return f"Failed to generate caption: {err} (model tried: {model_used})"

    try:
        data = resp.json()
        if isinstance(data, list) and len(data) > 0:
            first = data[0]
            if isinstance(first, dict) and "generated_text" in first:
                return first["generated_text"]
            if isinstance(first, str):
                return first
        if isinstance(data, dict):
            if "generated_text" in data:
                return data["generated_text"]
            if "text" in data:
                return data["text"]
        text = resp.text.strip()
        if text:
            return text
        return "No caption generated"
    except Exception as e:
        return f"Error parsing response: {e}"
