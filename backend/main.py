import os
import requests
import time
import cv2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv("FACE_APIKEY")
ENDPOINT = os.getenv("FACE_API_ENDPOINT")
face_api_url = f"{ENDPOINT}/face/v1.0/detect"

# Set headers for the API request
headers = {"Ocp-Apim-Subscription-Key": API_KEY, "Content-Type": "application/octet-stream"}
# Define parameters for face detection and attributes to return
params = {"returnFaceAttributes": "headPose,blur,exposure,occlusion", "detectionModel": "detection_01"}



def analyze_face(image_path):
    """Analyze the image using Azure Face API and return detected faces."""
    try:
        # Open the image file in binary mode
        with open(image_path, "rb") as image_file:
            # Send POST request to Face API
            response = requests.post(face_api_url, headers=headers, params=params, data=image_file)
        # Check if the API response is successful
        if response.status_code != 200:
            print(f"❌ API Error: {response.status_code} - {response.text}")
            return None
        # Parse the JSON response
        faces = response.json()
        # Return faces if detected, otherwise None
        return faces if faces else None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

def estimate_efficiency(faces):
    """Estimate focus and fatigue based on face attributes."""
    # Check if any faces were detected
    if not faces:
        print("⚠️ No face detected → Efficiency unknown")
        return
    
    # Use the first detected face
    face = faces[0]
    attributes = face.get("faceAttributes", {})
    blur = attributes.get("blur", 0)
    print(f"blur:{blur}")
    head_pose = attributes.get("headPose", {})
    # Extract yaw and pitch from head pose (default to 0 if not present)
    yaw, pitch = head_pose.get("yaw", 0), head_pose.get("pitch", 0)
    
    # Estimate focus: less head rotation indicates higher focus
    focus_score = 100 - (abs(yaw) + abs(pitch))  # Simple scoring
    print(f"🎯 Focus Score: {max(0, focus_score):.1f}% (Yaw={yaw}, Pitch={pitch})")
    
    # Estimate fatigue: check if eyes are occluded
    occlusion = attributes.get("occlusion", {})
    if occlusion.get("eyeOccluded", False):
        print("⚠️ Eyes occluded → Possible fatigue")

cap = cv2.VideoCapture(0)
frame_skip = 500  # Process every 500th frame (reduces FPS)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

frame_count = 0

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame")
            break

        frame_count += 1
        if frame_count % frame_skip == 0:  # Process only every Nth frame
            image_path = "temp_frame.jpg"
            cv2.imwrite(image_path, frame)  # Save frame as image
            print("\n🔍 Sending frame to Azure Face API...")
            
            faces = analyze_face(image_path)
            estimate_efficiency(faces)
        cv2.imshow("Webcam Feed", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    cap.release()
    cv2.destroyAllWindows()
'''
# Test loop
if __name__ == "__main__":
    image_folder = "test_images"  # Folder containing test images
    # Get all image files in the folder
    image_files = [f for f in os.listdir(image_folder) if f.endswith(('jpg', 'jpeg', 'png'))]

    # Run the analysis for each image 3 times for testing
    for image_name in image_files:
        image_path = os.path.join(image_folder, image_name)
        for _ in range(3):
            print(f"\n🔍 Analyzing: {image_path}")
            faces = analyze_face(image_path)
            estimate_efficiency(faces)
            # Wait 2 seconds between iterations
            time.sleep(2)'
'''