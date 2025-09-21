import requests
import os
from dotenv import load_dotenv

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HF_API_KEY")

def test_huggingface_api():
    # Create a simple test image (1x1 pixel PNG)
    test_image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc```\x00\x00\x00\x04\x00\x01\xf5\x27\x04\xfd\x00\x00\x00\x00IEND\xaeB`\x82'
    
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}"
    }

    try:
        print("Testing HuggingFace API...")
        response = requests.post(
            "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
            headers=headers,
            data=test_image_data
        )

        print(f"Response status: {response.status_code}")
        print(f"Response text: {response.text}")
        
        if response.status_code == 200:
            caption = response.json()[0]["generated_text"]
            print(f"Caption generated: {caption}")
        else:
            print(f"API call failed: {response.text}")
            
    except Exception as e:
        print(f"Error testing API: {e}")

if __name__ == "__main__":
    test_huggingface_api() 