from django.db import models
from django.conf import settings

# Create your models here.


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('fruit', '과일'),
        ('vegetable', '채소'),
        ('snack', '간식'),
    ]
    
    # 상품별 기본 가격 설정 (kg당 가격 또는 개당 가격)
    ITEM_PRICES = {
        # 과일류 (kg당 가격)
        'apple': 4500,      # 사과 1kg당 4,500원
        'mandarine': 3500,  # 귤 1kg당 3,500원
        'banana': 4000,     # 바나나 1kg당 4,000원
        
        # 채소류 (kg당 가격)
        'potato': 2000,     # 감자 1kg당 2,000원
        'carrot': 3000,     # 당근 1kg당 3,000원
        'onion': 2500,      # 양파 1kg당 2,500원
        
        # 과자류 (개당 가격)
        'oreo': 1500,       # 오레오 1개당 1,500원
        'chips': 2000,      # 과자 1개당 2,000원
    }
    
    # 기본 가격 (상품명이 ITEM_PRICES에 없을 경우 사용)
    DEFAULT_PRICES = {
        'fruit': 3000,      # 기본 과일 1kg당 3,000원
        'vegetable': 2000,  # 기본 채소 1kg당 2,000원
        'snack': 1500,      # 기본 과자 1개당 1,500원
    }
    
    name = models.CharField(max_length=100)
    weight = models.FloatField(null=True)
    price = models.IntegerField()
    added_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50)
    quantity = models.IntegerField(null=True)

    def calculate_price(self):
        # 상품별 기본 가격 가져오기 (없으면 카테고리 기본가)
        base_price = self.ITEM_PRICES.get(
            self.name.lower(),  # 상품명으로 가격 검색
            self.DEFAULT_PRICES.get(self.category)  # 없으면 카테고리 기본가
        )
        
        if self.category in ['fruit', 'vegetable']:
            # 과일/채소는 무게 기반 가격 계산
            self.price = int(base_price * self.weight)
        else:  # snack
            # 과자류는 수량 기반 가격 계산
            self.price = base_price * self.quantity
        
        self.save()

    def __str__(self):
        if self.category in ['fruit', 'vegetable']:
            return f"{self.name} - {self.weight}kg - {self.price}원"
        else:
            return f"{self.name} - {self.quantity}개 - {self.price}원"


class User(models.Model):
    name = models.CharField(max_length=100)
    birth_date = models.DateField()
    phone_number = models.CharField(max_length=15, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.phone_number})"
