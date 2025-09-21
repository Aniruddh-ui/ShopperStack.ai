import base64

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def encode_uploaded_file(file):
    return base64.b64encode(file.file.read()).decode("utf-8")