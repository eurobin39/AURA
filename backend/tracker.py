from pynput import keyboard, mouse
from pynput.keyboard import Listener as KeyboardListener
from pynput.mouse import Listener as MouseListener
import time, threading, math

# 상태 저장용 변수
key_count = 0
click_count = 0
mouse_distance = 0
prev_position = (0, 0)

# 키보드 입력
def on_key_press(key):
    global key_count
    key_count += 1

# 마우스 클릭
def on_click(x, y, button, pressed):
    global click_count
    if pressed:
        click_count += 1

# 마우스 이동 거리
def on_move(x, y):
    global prev_position, mouse_distance
    prev_x, prev_y = prev_position
    distance = math.hypot(x - prev_x, y - prev_y)
    mouse_distance += distance
    prev_position = (x, y)

# 집중도 계산 함수
def calculate_focus_score(keys, clicks, distance):
    key_score = min(keys / 300, 1.0) * 50
    click_score = min(clicks / 100, 1.0) * 20
    move_score = min(distance / 5000, 1.0) * 30
    total = key_score + click_score + move_score
    return round(total, 1)

# 5분마다 측정
def focus_tracker():
    global key_count, click_count, mouse_distance
    while True:
        time.sleep(300)  # 5분 대기
        score = calculate_focus_score(key_count, click_count, mouse_distance)
        print("\n📊 5분 집중도 분석")
        print(f"키보드 입력 수: {key_count}")
        print(f"마우스 클릭 수: {click_count}")
        print(f"마우스 이동 거리: {int(mouse_distance)} px")
        print(f"📈 집중도 점수: {score} / 100\n")

        # 초기화
        key_count = 0
        click_count = 0
        mouse_distance = 0

# 입력 리스너 시작
keyboard_listener = KeyboardListener(on_press=on_key_press)
mouse_listener = MouseListener(on_click=on_click, on_move=on_move)

keyboard_listener.start()
mouse_listener.start()

# 백그라운드로 집중도 추적
threading.Thread(target=focus_tracker, daemon=True).start()

keyboard_listener.join()
mouse_listener.join()
