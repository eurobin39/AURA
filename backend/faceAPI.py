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

# Backend API info
API_URL = "http://localhost:3000/api/focus-log"  # Next.js API address

face_api_url = f"{ENDPOINT}/face/v1.0/detect"
headers = {"Ocp-Apim-Subscription-Key": API_KEY, "Content-Type": "application/octet-stream"}
params = {"returnFaceAttributes": "headPose,blur,exposure,occlusion", "detectionModel": "detection_01"}

# Initialize previous head position globally
previous_yaw, previous_pitch = None, None

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

    yaw_deviation = abs(yaw) if abs(yaw) > 5 else 0
    pitch_deviation = abs(pitch) if abs(pitch) > 5 else 0
    total_deviation = sqrt(yaw_deviation**2 + pitch_deviation**2)

    centrality_penalty = total_deviation * 2

    if previous_yaw is None or previous_pitch is None:
        focus_score = max(0, 100 - centrality_penalty)
    else:
        yaw_change = abs(yaw - previous_yaw)
        pitch_change = abs(pitch - previous_pitch)
        position_change = sqrt(yaw_change**2 + pitch_change**2)

        movement_penalty = position_change * 3
        focus_score = max(0, 100 - movement_penalty - centrality_penalty)

    previous_yaw, previous_pitch = yaw, pitch

    print(f"🎯 Focus Score: {focus_score:.1f}% (Yaw={yaw}, Pitch={pitch})")
    if eye_occluded:
        print("⚠️ Eyes occluded → Possible fatigue")

    face_data = {
        "focusScore": round(focus_score, 1),
        "yaw": yaw,
        "pitch": pitch,
    }

    send_to_backend(face_data)
    return face_data

def send_to_backend(data):
    """Send analyzed face data to the backend."""
    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 201:
            print("✅ DB Successfully Sent")
        else:
            print(f"❌ DB Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ API exception: {e}")

cap = cv2.VideoCapture(0)
frame_skip = 300

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
