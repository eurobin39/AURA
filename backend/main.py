from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/start-session")
def start_session():
    subprocess.Popen(["python3", "Tracker.py"])
    subprocess.Popen(["python3", "faceAPI.py"])
    return {"status": "Tracker and FaceAPI started"}
