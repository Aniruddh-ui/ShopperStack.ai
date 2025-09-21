from uagents import Agent, Context, Protocol, Model
import base64
import os
from dotenv import load_dotenv
from typing import Optional

# Use Gemini Vision for captions
from services.gemini import caption_image_from_base64

load_dotenv()

class ImageData(Model):
    image_base64: str  # Image sent as base64-encoded string
    reply_id: Optional[str] = None

class CaptionResponse(Model):
    caption: str
    reply_id: Optional[str] = None

# uAgent instance
image_caption_agent = Agent(
    name="image_caption_agent",
    port=8010,
    seed="imagecaptionagent_secret", 
    endpoint=["http://127.0.0.1:8010/submit"]
)

@image_caption_agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info("Image Caption Agent is running!")

# Handle image messages directly on the agent
@image_caption_agent.on_message(model=ImageData)
async def handle_image(ctx: Context, sender: str, msg: ImageData):
    ctx.logger.info("Received image, generating caption via Gemini Vision...")
    try:
        # Prefer Gemini Vision captioning (module-level wrapper handles fallbacks)
        caption = caption_image_from_base64(msg.image_base64)

        # If the caption function returned an error message, fall back to a simple heuristic
        if not caption or caption.lower().startswith("error"):
            ctx.logger.warning(f"Gemini caption returned error or empty: {caption}")
            image_data = base64.b64decode(msg.image_base64)
            if len(image_data) > 100000:
                caption = "A high-resolution image of clothing or fashion item"
            elif len(image_data) > 50000:
                caption = "A medium-sized image showing a garment or accessory"
            else:
                caption = "A small image of a clothing item"
        
        ctx.logger.info(f"Caption generated: {caption}")
        await ctx.send(sender, CaptionResponse(caption=caption, reply_id=msg.reply_id))

    except Exception as e:
        ctx.logger.error(f"Error in caption generation: {e}")
        fallback_caption = "An image of clothing or fashion item"
        await ctx.send(sender, CaptionResponse(caption=fallback_caption, reply_id=msg.reply_id))
