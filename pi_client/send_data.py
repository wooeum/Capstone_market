from ultralytics import YOLO
from picamera2 import Picamera2
import requests
import time

model = YOLO("best.pt")

picam2 = Picamera2()
config = picam2.create_preview_configuration(main={"format": "RGB888", "size": (640, 480)})
picam2.configure(config)
picam2.start()

DJANGO_URL = "http://0.0.0.0:8000/api/cart/add/"

print("[INFO] YOLO Detection & Data Send")

def determine_category(item_name):
    # 간단한 카테고리 분류 로직
    fruits = ['apple', 'banana', 'orange', 'mandarine']
    vegetables = ['potato', 'carrot', 'onion']
    snacks = ['oreo', 'chips', 'candy']
    
    if item_name.lower() in fruits:
        return 'fruit'
    elif item_name.lower() in vegetables:
        return 'vegetable'
    elif item_name.lower() in snacks:
        return 'snack'
    else:
        return 'fruit'  # 기본값

try:
    while True:
        frame = picam2.capture_array()
        results = model(frame, conf=0.6)

        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])

            item_name = results[0].names[cls_id]

            data = {
                "name": item_name,
                "category": determine_category(item_name),
            }

            if data["category"] in ['fruit', 'vegetable']:
                data["weight"] = round(0.1 + 1.5 * conf, 3)
                data["quantity"] = 1
            else:  # snack
                data["quantity"] = 1
                data["weight"] = None

            response = requests.post(DJANGO_URL, json=data)
            print(f"Sent {data}, Response: {response.status_code}")

        time.sleep(1)

except KeyboardInterrupt:
    print("프로그램 종료")
