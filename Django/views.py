# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import User, Product, CartItem
from .serializers import UserSerializer, ProductSerializer, CartItemSerializer

@api_view(['POST'])
def login(request):
    phone_number = request.data.get('phone_number')
    user = get_object_or_404(User, phone_number=phone_number)
    request.session['user_id'] = user.id
    return Response({'user': UserSerializer(user).data})

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CartViewSet(viewsets.ViewSet):
    def list(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({'error': 'Not logged in'}, status=status.HTTP_401_UNAUTHORIZED)
        
        cart_items = CartItem.objects.filter(user_id=user_id)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def create(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({'error': 'Not logged in'}, status=status.HTTP_401_UNAUTHORIZED)

        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            cart_item, created = CartItem.objects.get_or_create(
                user_id=user_id,
                product_id=product_id,
                defaults={'quantity': quantity}
            )
            if not created:
                cart_item.quantity = quantity
                cart_item.save()
            
            serializer = CartItemSerializer(cart_item)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({'error': 'Not logged in'}, status=status.HTTP_401_UNAUTHORIZED)

        cart_item = get_object_or_404(CartItem, user_id=user_id, product_id=pk)
        cart_item.quantity = request.data.get('quantity', cart_item.quantity)
        cart_item.save()
        
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({'error': 'Not logged in'}, status=status.HTTP_401_UNAUTHORIZED)

        cart_item = get_object_or_404(CartItem, user_id=user_id, product_id=pk)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def cart_items(request):
    # 장바구니 목록 조회 로직
    pass

@api_view(['POST'])
def add_to_cart(request):
    # 장바구니에 상품 추가 로직
    pass

@api_view(['DELETE'])
def remove_from_cart(request, product_id):
    # 장바구니에서 상품 제거 로직
    pass

@api_view(['PUT'])
def update_cart_item(request, product_id):
    # 장바구니 상품 수량 업데이트 로직
    pass
