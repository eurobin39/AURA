from pynput import keyboard, mouse
from pynput.keyboard import Listener as KeyboardListener
from pynput.mouse import Listener as MouseListener
import time, threading, math, requests, os
import sys

USER_ID = int(sys.argv[1]) if len(sys.argv) > 1 else 1
API_URL = "https://aura-frontend-62bh.onrender.com/api/focus-log"

key_count = 0
click_count = 0
mouse_distance = 0
prev_position = (0, 0)

def on_key_press(key):
    global key_count
    key_count += 1

def on_click(x, y, button, pressed):
    global click_count
    if pressed:
        click_count += 1

def on_move(x, y):
    global prev_position, mouse_distance
    prev_x, prev_y = prev_position
    distance = math.hypot(x - prev_x, y - prev_y)
    mouse_distance += distance
    prev_position = (x, y)

def calculate_focus_score(keys, clicks, distance):
    key_score = min(keys / 150, 1.0) * 50
    click_score = min(clicks / 30, 1.0) * 20
    move_score = min(distance / 2000, 1.0) * 30
    return round(key_score + click_score + move_score, 1)

def send_to_backend(keys, clicks, distance, score):
    payload = {
        "keyboard": keys,
        "mouseClicks": clicks,
        "mouseDistance": int(distance),
        "focusScore": score,
        "userId": USER_ID
    }
    try:
        res = requests.post(API_URL, json=payload)
        if res.status_code == 201:
            print("✅ DB Successfully Sent")
        else:
            print(f"❌ DB Failed: {res.status_code} - {res.text}")
    except Exception as e:
        print("❌ API exception:", e)

def focus_tracker():
    global key_count, click_count, mouse_distance
    stop_file = f"stop_{USER_ID}.txt"
    while not os.path.exists(stop_file): 
        time.sleep(15)
        score = calculate_focus_score(key_count, click_count, mouse_distance)
        print("\n📊 Focus Rate")
        print(f"Keyboard Count : {key_count}")
        print(f"Click Count : {click_count}")
        print(f"Mouse Distance : {int(mouse_distance)} px")
        print(f"📈 Score : {score} / 100\n")

        send_to_backend(key_count, click_count, mouse_distance, score)

        key_count = 0
        click_count = 0
        mouse_distance = 0

keyboard_listener = KeyboardListener(on_press=on_key_press)
mouse_listener = MouseListener(on_click=on_click, on_move=on_move)

keyboard_listener.start()
mouse_listener.start()

tracker_thread = threading.Thread(target=focus_tracker, daemon=True)
tracker_thread.start()

try:
    keyboard_listener.wait()
    mouse_listener.wait()
except KeyboardInterrupt:
    keyboard_listener.stop()
    mouse_listener.stop()

stop_file = f"stop_{USER_ID}.txt"
if os.path.exists(stop_file):
    os.remove(stop_file)