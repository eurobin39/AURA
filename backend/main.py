from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://aura-frontend-62bh.onrender.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/start-session")
async def start_session(request: Request):
    data = await request.json()
    user_id = data.get("userId")

    if not user_id:
        return {"error": "Missing userId"}

    # userId를 인자로 넘겨 실행
    subprocess.Popen(["python3", "Tracker.py", str(user_id)])
    subprocess.Popen(["python3", "faceAPI.py", str(user_id)])
    return {"status": "Tracker and FaceAPI started", "userId": user_id}
