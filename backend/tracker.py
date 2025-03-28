from pynput import keyboard, mouse
from pynput.keyboard import Listener as KeyboardListener
from pynput.mouse import Listener as MouseListener
import time, threading, math, requests

# init
key_count = 0
click_count = 0
mouse_distance = 0
prev_position = (0, 0)

# bakend API info
API_URL = "https://aura-backend.onrender.com/api/focus-log"  # Next.js API address
USER_ID = 1  

# Keyboard
def on_key_press(key):
    global key_count
    key_count += 1

#  Mouse
def on_click(x, y, button, pressed):
    global click_count
    if pressed:
        click_count += 1

# Mouse move
def on_move(x, y):
    global prev_position, mouse_distance
    prev_x, prev_y = prev_position
    distance = math.hypot(x - prev_x, y - prev_y)
    mouse_distance += distance
    prev_position = (x, y)

# calc focus score
def calculate_focus_score(keys, clicks, distance):
    
    key_score = min(keys / 150, 1.0) * 50      
    click_score = min(clicks / 30, 1.0) * 20   
    move_score = min(distance / 2000, 1.0) * 30
    total = key_score + click_score + move_score
    return round(total, 1)


# send to backend
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
            print("✅ DB Sucessfully Sent")
        else:
            print(f"❌ DB Failed: {res.status_code} - {res.text}")
    except Exception as e:
        print("❌ API exception:", e)

# focus tracker every 1 minute
def focus_tracker():
    global key_count, click_count, mouse_distance
    while True:
        time.sleep(15)  # 1min
        score = calculate_focus_score(key_count, click_count, mouse_distance)
        print("\n📊 Focus Rate")
        print(f"Keyboard Count : {key_count}")
        print(f"Click Count : {click_count}")
        print(f"Mouse Distance : {int(mouse_distance)} px")
        print(f"📈 Score : {score} / 100\n")

        # send to backend
        send_to_backend(key_count, click_count, mouse_distance, score)

        # reset
        key_count = 0
        click_count = 0
        mouse_distance = 0

# Keyboard, Mouse Listener
keyboard_listener = KeyboardListener(on_press=on_key_press)
mouse_listener = MouseListener(on_click=on_click, on_move=on_move)

keyboard_listener.start()
mouse_listener.start()

threading.Thread(target=focus_tracker, daemon=True).start()

keyboard_listener.join()
mouse_listener.join()
