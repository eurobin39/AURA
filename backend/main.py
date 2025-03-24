import os
import requests
import time
import cv2
from dotenv import load_dotenv


# 환경 변수 로드
load_dotenv()

API_KEY = os.getenv("FACE_APIKEY")
ENDPOINT = os.getenv("FACE_API_ENDPOINT")

BACKEND_URL = "http://127.0.0.1:5001"
face_api_url = f"{ENDPOINT}/face/v1.0/detect"

# API 요청 설정
headers = {"Ocp-Apim-Subscription-Key": API_KEY, "Content-Type": "application/octet-stream"}
params = {
    "returnFaceAttributes": "headPose,blur,exposure,occlusion,emotion",  # emotion 추가
    "detectionModel": "detection_01"
}

def analyze_face(image_path):
    """Azure Face API로 이미지 분석"""
    try:
        with open(image_path, "rb") as image_file:
            response = requests.post(face_api_url, headers=headers, params=params, data=image_file)
        
        if response.status_code == 200:
            faces = response.json()
            return faces if faces else None
        else:
            print(f"❌ API 오류: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ 오류 발생: {str(e)}")
        return None

def estimate_efficiency(faces):
    """업무 효율성 분석"""
    if not faces:
        return {
            "efficiency_score": 0,
            "details": "No face detected",
            "focus": "N/A",
            "fatigue": "N/A",
            "emotion": "N/A"
        }

    # 첫 번째 얼굴 데이터 사용
    face = faces[0]
    attributes = face.get("faceAttributes", {})

    # 1. 초점(Focus) 계산: 머리 자세(headPose) 기반
    head_pose = attributes.get("headPose", {})
    yaw, pitch = head_pose.get("yaw", 0), head_pose.get("pitch", 0)
    focus_score = 100 - (abs(yaw) + abs(pitch))  # 회전이 적을수록 초점 높음
    focus_score = max(0, min(100, focus_score))  # 0~100 범위로 제한

    # 2. 피로도(Fatigue) 추정: 눈 가림, 흐림도 활용
    occlusion = attributes.get("occlusion", {})
    blur = attributes.get("blur", {})
    eye_occluded = occlusion.get("eyeOccluded", False)
    blur_level = blur.get("value", "Low")  # Low, Medium, High
    fatigue_score = 0
    if eye_occluded:
        fatigue_score += 50  # 눈 가림 시 피로도 증가
    if blur_level == "High":
        fatigue_score += 30  # 흐림이 심하면 피로 가능성
    fatigue_score = min(100, fatigue_score)

    # 3. 감정(Emotion) 분석: 긍정적 감정은 효율성에 기여
    emotion = attributes.get("emotion", {})
    positive_emotion = emotion.get("happiness", 0) + emotion.get("neutral", 0)
    negative_emotion = emotion.get("sadness", 0) + emotion.get("anger", 0) + emotion.get("fear", 0)
    emotion_factor = positive_emotion - negative_emotion  # -1 ~ 1 사이 값
    emotion_factor = max(-1, min(1, emotion_factor)) * 20  # -20 ~ 20 점수화

    # 4. 종합 효율성 점수 계산
    efficiency_score = (focus_score * 0.5) - (fatigue_score * 0.3) + emotion_factor
    efficiency_score = max(0, min(100, efficiency_score))  # 0~100으로 제한

    # 결과 반환
    return {
        "efficiency_score": round(efficiency_score, 1),
        "details": {
            "focus": f"{focus_score:.1f}% (Yaw: {yaw}, Pitch: {pitch})",
            "fatigue": f"{fatigue_score}% (Eyes occluded: {eye_occluded}, Blur: {blur_level})",
            "emotion": f"Positive: {positive_emotion:.2f}, Negative: {negative_emotion:.2f}"
        }
    }

if __name__ == "__main__":
    image_path = "face_euro.jpg"  # 테스트 이미지 경로
    print(f"🔍 분석 시작: {image_path}")
    faces = analyze_face(image_path)
    
    if faces:
        result = estimate_efficiency(faces)
        print(f"📊 업무 효율성 점수: {result['efficiency_score']}%")
        print("세부 정보:")
        for key, value in result["details"].items():
            print(f"  {key}: {value}")
    else:
        print("⚠️ 분석 실패: 얼굴 데이터 없음")