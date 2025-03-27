from math import sqrt
import os
import requests
import time
import cv2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

API_KEY = os.getenv("FACE_APIKEY")
ENDPOINT = os.getenv("FACE_API_ENDPOINT")

BACKEND_URL = "http://127.0.0.1:5001"
face_api_url = f"{ENDPOINT}/face/v1.0/detect"

# Set headers for the API request
headers = {"Ocp-Apim-Subscription-Key": API_KEY, "Content-Type": "application/octet-stream"}
# Define parameters for face detection and attributes to return
params = {"returnFaceAttributes": "headPose,blur,exposure,occlusion", "detectionModel": "detection_01"}


def analyze_face(image_path):
    """Analyze the image using Azure Face API and return detected faces."""
    try:
        with open(image_path, "rb") as image_file:
            response = requests.post(face_api_url, headers=headers, params=params, data=image_file)

        if response.status_code != 200:
            print(f"❌ API Error: {response.status_code} - {response.text}")
            return None

        faces = response.json()
        return faces if faces else None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None


# Initialize previous head position globally
previous_yaw, previous_pitch = None, None

def estimate_efficiency(faces, image_name=""):
    """Estimate focus and fatigue based on face attributes and send data to backend."""
    global previous_yaw, previous_pitch

    if not faces:
        print("⚠️ No face detected → Efficiency unknown")
        return None

    face = faces[0]
    attributes = face.get("faceAttributes", {})
    head_pose = attributes.get("headPose", {})

    yaw, pitch = head_pose.get("yaw", 0), head_pose.get("pitch", 0)
    blur = attributes.get("blur", {}).get("value", 0)
    eye_occluded = attributes.get("occlusion", {}).get("eyeOccluded", False)

    # Calculate deviation of head position parameters (ignore the deviation within range -5 to 5)
    yaw_deviation = abs(yaw) if abs(yaw) > 5 else 0
    pitch_deviation = abs(pitch) if abs(pitch) > 5 else 0
    total_deviation = sqrt(yaw_deviation**2 + pitch_deviation**2)

    # Calculate centrality penalty
    centrality_penalty = total_deviation * 2  # Deviation from (0,0) reduces focus

    # If this is the first frame, use only the head position for focus score
    if previous_yaw is None or previous_pitch is None:
        focus_score = max(0, 100 - centrality_penalty)  # Only centrality penalty
    else:
        # Calculate head movement from the last frame
        yaw_change = abs(yaw - previous_yaw)
        pitch_change = abs(pitch - previous_pitch)    
        position_change = sqrt(yaw_change**2 + pitch_change**2)

        # Calculate movement penalty
        movement_penalty = position_change * 3  # More movement = lower focus

        # Calculate focus score (movement + centrality penalty)
        focus_score = max(0, 100 - movement_penalty - centrality_penalty)

    # Update previous head position
    previous_yaw, previous_pitch = yaw, pitch

    print(f"🎯 Focus Score: {focus_score:.1f}% (Yaw={yaw}, Pitch={pitch})")
    if eye_occluded:
        print("⚠️ Eyes occluded → Possible fatigue")

    # Prepare data to send to backend
    face_data = {
        "image_name": image_name,
        "focus_score": focus_score,
        "yaw": yaw,
        "pitch": pitch,
        "blur": blur,
        "eye_occluded": eye_occluded
    }

    send_to_backend(face_data)
    return face_data

def send_to_backend(data):
    """Send analyzed face data to the backend."""
    try:
        response = requests.post(f"{BACKEND_URL}/face-analysis", json=data)

        if response.status_code == 200:
            print("✅ Data successfully sent to backend!")
        else:
            print(f"❌ Backend Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Failed to send data to backend: {str(e)}")


cap = cv2.VideoCapture(0)
frame_skip = 300  # Process every 300th frame

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
        if frame_count % frame_skip == 0:
            image_path = "temp_frame.jpg"
            cv2.imwrite(image_path, frame)
            print("\n🔍 Sending frame to Azure Face API...")

            faces = analyze_face(image_path)
            estimate_efficiency(faces, image_name=image_path)

        cv2.imshow("Webcam Feed", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    cap.release()
    cv2.destroyAllWindows()


# Test loop for processing test images
if __name__ == "__main__":
    image_folder = "test_images"
    image_files = [f for f in os.listdir(image_folder) if f.endswith(('jpg', 'jpeg', 'png'))]

    for image_name in image_files:
        image_path = os.path.join(image_folder, image_name)
        for _ in range(3):
            print(f"\n🔍 Analyzing: {image_path}")
            faces = analyze_face(image_path)
            estimate_efficiency(faces, image_name=image_name)
            time.sleep(2)