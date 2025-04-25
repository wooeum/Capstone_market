from django.urls import path
from . import views

urlpatterns = [
    path("", views.cart_items, name="cart_items"),
    path("add/", views.add_to_cart, name="add_to_cart"),
    path("remove/<int:product_id>/", views.remove_from_cart, name="remove_from_cart"),
    path("update/<int:product_id>/", views.update_cart_item, name="update_cart_item"),
    path("clear/", views.clear_cart, name="clear_cart"),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
]
