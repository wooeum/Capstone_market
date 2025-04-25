from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product, User
from .serializers import ProductSerializer
import json

# Create your views here.

# 라즈베리파이가 POST하는 뷰
@api_view(['POST'])
def add_to_cart(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        product = serializer.save()
        # 가격 계산 로직 실행
        product.calculate_price()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# React가 GET으로 데이터 받아가는 뷰
@api_view(['GET'])
def cart_items(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def remove_from_cart(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return Response({
            'success': True,
            'message': '상품이 삭제되었습니다'
        }, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({
            'success': False,
            'message': '상품을 찾을 수 없습니다'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_cart_item(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            updated_product = serializer.save()
            # 수량이나 무게가 변경된 경우 가격 재계산
            updated_product.calculate_price()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def clear_cart(request):
    """장바구니 전체 비우기"""
    try:
        Product.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@csrf_exempt
def login(request):
    data = request.data
    phone_number = data.get('phone_number')
    
    try:
        user = User.objects.get(phone_number=phone_number)
        request.session['user_id'] = user.id
        return Response({
            'success': True,
            'user': {
                'id': user.id,
                'name': user.name,
                'phone_number': user.phone_number
            }
        })
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@csrf_exempt
def register(request):
    data = request.data
    
    # 전화번호로 기존 사용자 확인
    if User.objects.filter(phone_number=data.get('phone_number')).exists():
        return Response({
            'success': False,
            'message': 'Phone number already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # 새 사용자 생성
    try:
        user = User.objects.create(
            name=data.get('name'),
            birth_date=data.get('birth_date'),
            phone_number=data.get('phone_number')
        )
        return Response({
            'success': True,
            'user': {
                'id': user.id,
                'name': user.name,
                'phone_number': user.phone_number
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
