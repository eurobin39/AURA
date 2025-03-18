import os
import requests
import json
from dotenv import load_dotenv

# Load .env file
load_dotenv()

API_KEY = os.getenv("FACE_APIKEY")
ENDPOINT = os.getenv("FACE_API_ENDPOINT")

if not API_KEY:
    raise ValueError("FACE_APIKEY is missing. Set it in .env or environment variables.")

face_api_url = f"{ENDPOINT}/face/v1.0/detect"

# Headers for API Request
headers = {
    "Ocp-Apim-Subscription-Key": API_KEY,
    "Content-Type": "application/octet-stream"
}

# API Parameters (Only Detect Faces, No Extra Attributes)
params = {
    "returnFaceId": "true"
}

def is_face_detected(image_path):
    """Sends image to Azure Face API and checks if a face is detected."""
    with open(image_path, "rb") as image_file:
        response = requests.post(face_api_url, headers=headers, params=params, data=image_file)
    
    if response.status_code != 200:
        print("❌ Error:", response.json())
        return None

    faces = response.json()

    if faces:
        print("🎯 Face Detected!")
        return True
    else:
        print("⚠️ No face detected.")
        return False

# Test with face.jpg
is_face_detected("face.jpg")




