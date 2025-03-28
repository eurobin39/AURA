from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://aura-frontend-62bh.onrender.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

processes = {}

@app.post("/start-session")
async def start_session(request: Request):
    data = await request.json()
    user_id = data.get("userId")

    if not user_id:
        return {"error": "Missing userId"}

   
    tracker_proc = subprocess.Popen(["python3", "tracker.py", str(user_id)])
    face_proc = subprocess.Popen(["python3", "faceAPI.py", str(user_id)])
    processes[user_id] = {"tracker": tracker_proc, "face": face_proc}

    return {"status": "Tracker and FaceAPI started", "userId": user_id}

@app.post("/stop-session")
async def stop_session(request: Request):
    data = await request.json()
    user_id = data.get("userId")

    if not user_id or user_id not in processes:
        return {"error": "No active session found"}

    
    for proc_name, proc in processes[user_id].items():
        proc.terminate()
        try:
            proc.wait(timeout=5)  
        except subprocess.TimeoutExpired:
            proc.kill()  
    del processes[user_id]

    return {"status": "Tracker and FaceAPI stopped", "userId": user_id}