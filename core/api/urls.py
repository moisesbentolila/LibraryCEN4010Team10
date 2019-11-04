from django.urls import path
from .views import (ItemListView, AddToCartView,
                    OrderDetailView, OrderItemDeleteView,
                    OrderQuantityUpdateView, PaymentView,
                    AddCouponView, ItemDetailView, AddressListView,
                    AddressCreateView, CountryListView, UserIDView)

urlpatterns = [
    path('user-id/', UserIDView.as_view(), name='user-id'),
    path('countries/', CountryListView.as_view(), name='country-list'),
    path('addresses/', AddressListView.as_view(), name='address-list'),
    path('addresses/create/', AddressCreateView.as_view(), name='address-create'),
    path('products/', ItemListView.as_view(), name='product-list'),
    path('products/<pk>/', ItemDetailView.as_view(), name='product-detail'),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('order-summary/', OrderDetailView.as_view(), name='order-summary'),
    path('order-items/<pk>/delete/',
         OrderItemDeleteView.as_view(), name='order-item-delete'),
    path('order-item/update-quantity/',
         OrderQuantityUpdateView.as_view(), name='order-item-update-quantity'),
    path('checkout/', PaymentView.as_view(), name='checkout'),
    path('add-coupon/', AddCouponView.as_view(), name='add-coupon')


]
