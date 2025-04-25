# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'cart', views.CartViewSet, basename='cart')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/login/', views.login),
    path('api/register/', views.register),
    path("api/cart/", views.cart_items, name="cart_items"),
    path("api/cart/add/", views.add_to_cart, name="add_to_cart"),
    path("api/cart/remove/<int:product_id>/", views.remove_from_cart, name="remove_from_cart"),
    path("api/cart/update/<int:product_id>/", views.update_cart_item, name="update_cart_item"),
]

# serializers.py
from rest_framework import serializers
from .models import User, Product, CartItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'phone_number', 'birth_date']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'price', 'weight', 'quantity', 'image']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']