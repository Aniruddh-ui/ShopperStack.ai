import os
import google.generativeai as genai
from dotenv import load_dotenv
import io
from PIL import Image, ImageFilter
import base64

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


class GeminiService:
    def __init__(self):
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
            self.model = genai.GenerativeModel("gemini-1.5-flash")
        else:
            self.model = None

    def refine_query(self, raw_caption: str) -> str:
        """Refine the image caption into a detailed product search query."""

        print(f"Refining query from caption: {raw_caption}")

        # Gemini API is available
        if self.model:
            try:
                prompt = f"""
                You are refining image captions into detailed e-commerce product search queries.
                Include: clothing type, color, sleeve length, fabric/material, and occasion (formal/casual/etc.).
                Make it useful for searching online shops.
                Do NOT add extra words like 'photo' or 'image'.

                Raw caption: "{raw_caption}"

                Refined query:
                """
                response = self.model.generate_content(
                    prompt,
                    generation_config={
                        "temperature": 0.7,
                        "max_output_tokens": 60,
                    }
                )
                refined = response.text.strip()
                print(f"Gemini API success: {refined}")
                return refined
            except Exception as e:
                print(f"Gemini API request failed: {e}")

        # -----------------
        # Heuristic fallback
        # -----------------
        print("Using heuristic refinement...")

        caption_lower = raw_caption.lower()

        # Clothing type
        clothing_type = ""
        if 'shirt' in caption_lower:
            clothing_type = "button-up shirt" if 'button' in caption_lower else "shirt"
        elif 'dress' in caption_lower:
            clothing_type = "dress"
        elif 'pants' in caption_lower or 'jeans' in caption_lower:
            clothing_type = "pants"
        elif 'jacket' in caption_lower:
            clothing_type = "jacket"
        else:
            clothing_type = "clothing item"

        # Color
        color = ""
        for c in ["black", "white", "blue", "red", "green", "grey", "beige", "brown"]:
            if c in caption_lower:
                color = c
                break

        # Style / occasion
        style = ""
        if 'formal' in caption_lower or 'office' in caption_lower:
            style = "formal office wear"
        elif 'casual' in caption_lower:
            style = "casual wear"
        elif 'party' in caption_lower:
            style = "party wear"

        # Material
        material = ""
        if 'cotton' in caption_lower:
            material = "cotton"
        elif 'silk' in caption_lower:
            material = "silk"
        elif 'denim' in caption_lower:
            material = "denim"
        elif 'smooth' in caption_lower or 'fabric' in caption_lower:
            material = "premium fabric"

        # Sleeve length
        sleeve = ""
        if 'long-sleeved' in caption_lower or 'long sleeve' in caption_lower:
            sleeve = "long sleeve"
        elif 'short-sleeved' in caption_lower or 'short sleeve' in caption_lower:
            sleeve = "short sleeve"

        # Build refined query
        query_parts = [x for x in [color, clothing_type, sleeve, material, style] if x]

        if len(query_parts) < 3:
            query_parts.extend(["fashion", "clothing", "style"])

        refined = " ".join(query_parts)
        print(f"Heuristic refinement: {refined}")
        return refined

    def caption_image_from_base64(self, image_base64: str) -> str:
        """Generate a short caption for an image provided as a base64 string.
        Tries Gemini Vision if configured; falls back to HuggingFace BLIP if Gemini is unavailable
        or the request fails, and finally to a simple heuristic caption.
        """
        # Normalize data URL / base64
        data_url_mime = None
        if image_base64.startswith("data:"):
            try:
                prefix, payload = image_base64.split(",", 1)
                if prefix.startswith("data:") and ";" in prefix:
                    data_url_mime = prefix.split(":", 1)[1].split(";", 1)[0]
                image_base64 = payload
            except Exception:
                pass

        # Try Gemini Vision via the configured model if available
        if self.model:
            try:
                prompt = (
                    "Provide a concise one-sentence caption describing the image. "
                    "Focus on clothing attributes (type, color, sleeve length, material, occasion) "
                    "and avoid mentioning 'photo' or 'image'."
                )

                # Attempt to pass the base64 as an "image" argument if the client supports it.
                # This is wrapped in try/except to avoid hard-failing on API shape differences.
                response = None
                try:
                    response = self.model.generate_content(
                        prompt,
                        image=image_base64,
                        generation_config={
                            "temperature": 0.0,
                            "max_output_tokens": 60,
                        }
                    )
                except TypeError:
                    # Some client versions expect different arg signatures. Try passing prompt only.
                    response = self.model.generate_content(
                        prompt,
                        generation_config={"temperature": 0.0, "max_output_tokens": 60}
                    )

                # Normalize response
                if response is not None:
                    # prefer .text
                    text = getattr(response, "text", None)

                    # Try to extract from common container fields if .text isn't present
                    if not text:
                        # candidates or outputs may hold text in different SDK versions
                        candidates = getattr(response, "candidates", None) or getattr(response, "outputs", None)
                        if candidates and len(candidates) > 0:
                            first = candidates[0]
                            if isinstance(first, dict):
                                text = first.get("content") or first.get("text") or first.get("output")
                            else:
                                # object with attributes
                                text = getattr(first, "content", None) or getattr(first, "text", None)

                    if text:
                        text = text.strip()
                        # If the model is asking for the image instead of returning a caption,
                        # treat as a failure so fallback mechanisms run.
                        if hasattr(self, "_is_requesting_image") and self._is_requesting_image(text):
                            print(f"Gemini asked for the image instead of returning a caption: '{text}'")
                        else:
                            return text
            except Exception as e:
                print(f"Gemini vision request failed: {e}")

        # Final heuristic/local Pillow fallback
        try:
            # Use local Pillow-based captioner as a robust fallback
            return _local_image_caption(image_base64)
        except Exception:
            return "An image of clothing or a fashion item"

    def _is_requesting_image(text: str) -> bool:
        """Return True if the model's response is asking the user to provide or upload an image."""
        if not text:
            return False
        t = text.lower()
        triggers = [
            "provide the image",
            "please provide the image",
            "upload the image",
            "send the image",
            "i can't see the image",
            "i cannot see the image",
            "i'm unable to see the image",
            "please upload an image",
            "please attach the image",
            "please provide an image",
        ]
        return any(trigger in t for trigger in triggers)

def refine_query(raw_caption: str) -> str:
    """Module-level convenience wrapper used by other modules to refine captions.
    Keeps backward-compatible API: `from services.gemini import refine_query`.
    """
    service = GeminiService()
    return service.refine_query(raw_caption)


# Module-level convenience wrapper
def caption_image_from_base64(image_base64: str) -> str:
    service = GeminiService()
    return service.caption_image_from_base64(image_base64)


def _local_image_caption(image_base64: str) -> str:
    """Lightweight local fallback captioner using Pillow.
    Extracts dominant color and whether the image is patterned vs solid to form a simple caption.
    """
    try:
        # If data URL, strip prefix
        if image_base64.startswith("data:"):
            image_base64 = image_base64.split(",", 1)[1]
        img_bytes = base64.b64decode(image_base64)
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

        # Resize for speed
        thumb = img.copy()
        thumb.thumbnail((200, 200))

        # Determine dominant color by simple averaging
        pixels = list(thumb.getdata())
        r = sum([p[0] for p in pixels]) / len(pixels)
        g = sum([p[1] for p in pixels]) / len(pixels)
        b = sum([p[2] for p in pixels]) / len(pixels)

        # Map to simple color names
        def _nearest_color_name(r, g, b):
            colors = {
                'black': (0,0,0),
                'white': (255,255,255),
                'red': (220,20,60),
                'blue': (30,144,255),
                'green': (34,139,34),
                'beige': (245,245,220),
                'brown': (160,82,45),
                'grey': (128,128,128),
                'yellow': (255,215,0),
                'pink': (255,105,180),
                'purple': (128,0,128)
            }
            best = None
            best_dist = None
            for name, (cr,cg,cb) in colors.items():
                d = (r-cr)**2 + (g-cg)**2 + (b-cb)**2
                if best_dist is None or d < best_dist:
                    best = name
                    best_dist = d
            return best

        color_name = _nearest_color_name(r, g, b) or 'colored'

        # Detect pattern vs solid using edge density
        edges = thumb.convert('L').filter(ImageFilter.FIND_EDGES)
        bbox = edges.getbbox()
        nonzero = sum(1 for px in edges.getdata() if px > 20)
        density = nonzero / (edges.width * edges.height)
        pattern = 'patterned' if density > 0.04 else 'solid'

        # Rough shape heuristic (aspect ratio)
        w,h = img.size
        aspect = h / (w + 1e-6)
        likely = 'shirt' if aspect < 1.6 else 'dress' if aspect > 1.6 else 'garment'

        caption = f"A {pattern} {color_name} {likely}"
        return caption
    except Exception as e:
        return "An image of clothing or a fashion item"
