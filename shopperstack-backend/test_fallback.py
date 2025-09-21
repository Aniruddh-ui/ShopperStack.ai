import asyncio
import base64
from agents.image_caption_agent import image_caption_agent, ImageData

async def test_fallback():
    # Create a simple test image (1x1 pixel)
    test_image_data = base64.b64encode(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc```\x00\x00\x00\x04\x00\x01\xf5\x27\x04\xfd\x00\x00\x00\x00IEND\xaeB`\x82').decode('utf-8')
    
    # Create message
    msg = ImageData(image_base64=test_image_data)
    
    try:
        # Send message to agent
        response = await image_caption_agent.send(image_caption_agent.address, msg)
        print(f"Response: {response}")
        if hasattr(response, 'caption'):
            print(f"Caption: {response.caption}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Start the agent in a separate thread
    import threading
    def run_agent():
        image_caption_agent.run()
    
    # Start agent in background thread
    agent_thread = threading.Thread(target=run_agent, daemon=True)
    agent_thread.start()
    
    # Wait a bit for agent to start
    import time
    time.sleep(2)
    
    # Run the test
    asyncio.run(test_fallback()) 