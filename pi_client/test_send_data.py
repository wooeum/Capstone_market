import requests
import time
import random

# Django 서버 URL
DJANGO_URL = "http://localhost:8000/api/cart/add/"

# 테스트용 상품 데이터
test_items = [
    {
        "name": "apple",
        "category": "fruit",
        "weight": 0.5,
        "price": 0,  # 가격은 서버에서 자동 계산
        "quantity": 1
    },
    {
        "name": "potato",
        "category": "vegetable",
        "weight": 0.3,
        "price": 0,
        "quantity": 1
    },
    {
        "name": "mandarine",
        "category": "fruit",
        "weight": 0.2,
        "price": 0,
        "quantity": 1
    },
    {
        "name": "oreo",
        "category": "snack",
        # "weight": None,
        "weight": 0.3,

        "price": 0,
        "quantity": 1
    },
        {
        "name": "potato",
        "category": "vegetable",
        "weight": 0.3,
        "price": 0,
        "quantity": 1
    },
    {
        "name": "mandarine",
        "category": "fruit",
        "weight": 0.2,
        "price": 0,
        "quantity": 1
    },
    {
        "name": "oreo",
        "category": "snack",
        # "weight": None,
        "weight": 0.3,

        "price": 0,
        "quantity": 1
    },
    # {
    #     "name": "banana",
    #     "category": "fruit",
    #     "weight": 0.4,
    #     "price": 0,
    #     "quantity": 1
    # },
    # {
    #     "name": "carrot",
    #     "category": "vegetable",
    #     "weight": 0.25,
    #     "price": 0,
    #     "quantity": 1
    # },
]

def send_test_data():
    """테스트 데이터를 서버로 전송"""
    print("테스트 데이터 전송 시작...")
    
    for item in test_items:
        try:
            # 데이터 전송
            response = requests.post(DJANGO_URL, json=item)
            
            # 응답 확인
            if response.status_code == 201:
                print(f"성공: {item['name']} 추가됨")
                print(f"응답: {response.json()}")
            else:
                print(f"실패: {item['name']}, 상태 코드: {response.status_code}")
                print(f"에러: {response.text}")
            
            # 잠시 대기 (서버 부하 방지)
            time.sleep(1)
            
        except Exception as e:
            print(f"에러 발생: {str(e)}")

if __name__ == "__main__":
    # 기존 데이터를 보내기 전에 랜덤하게 섞기
    random.shuffle(test_items)
    send_test_data() 