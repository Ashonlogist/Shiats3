from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

# Main router for the API
router = DefaultRouter()

# Authentication URLs
router.register(r'auth/users', views.UserViewSet, basename='user')

# Property related endpoints
router.register(r'properties', views.PropertyViewSet, basename='property')

# Hotel related endpoints
router.register(r'hotels', views.HotelViewSet, basename='hotel')

# Blog related endpoints
router.register(r'blog/posts', views.BlogPostViewSet, basename='blogpost')

# Utility endpoints
router.register(r'amenities', views.AmenityViewSet, basename='amenity')
router.register(r'tags', views.TagViewSet, basename='tag')
router.register(r'dashboard', views.DashboardViewSet, basename='dashboard')

# Nested routers for related resources
property_router = routers.NestedSimpleRouter(router, r'properties', lookup='property')
property_router.register(r'images', views.PropertyImageViewSet, basename='property-image')
property_router.register(r'inquiries', views.InquiryViewSet, basename='property-inquiry')

hotel_router = routers.NestedSimpleRouter(router, r'hotels', lookup='hotel')
hotel_router.register(r'room-types', views.RoomTypeViewSet, basename='hotel-room-type')

# Room type images
room_type_router = routers.NestedSimpleRouter(hotel_router, r'room-types', lookup='roomtype')
room_type_router.register(r'images', views.RoomImageViewSet, basename='room-type-image')

# Bookings (can be accessed at /bookings/ or /hotels/<slug>/bookings/)
router.register(r'bookings', views.BookingViewSet, basename='booking')
hotel_router.register(r'bookings', views.BookingViewSet, basename='hotel-booking')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(property_router.urls)),
    path('', include(hotel_router.urls)),
    path('', include(room_type_router.urls)),
    
    # Authentication endpoints
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    
    # API documentation
    path('api/docs/', include('rest_framework.urls', namespace='rest_framework')),
]
