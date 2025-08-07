from rest_framework import viewsets, status, permissions, filters, generics
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model

from .filters import PropertyFilter

from .models import (
    Property, PropertyImage, Hotel, RoomType, RoomImage, 
    Booking, Amenity, Inquiry, BlogPost, Tag
)
from .serializers import (
    PropertySerializer, PropertyImageSerializer, HotelSerializer,
    RoomTypeSerializer, RoomImageSerializer, BookingSerializer,
    AmenitySerializer, InquirySerializer, BlogPostSerializer, TagSerializer,
    UserSerializer
)

User = get_user_model()

class PropertyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows properties to be viewed or edited.
    """
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['title', 'description', 'address', 'city', 'country']
    ordering_fields = ['price', 'created_at', 'area']
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        """
        Get the list of properties for the view.
        """
        queryset = Property.objects.filter(is_published=True).order_by('-created_at')
        
        # Apply custom filtering
        try:
            # This will apply all the filters defined in PropertyFilter
            queryset = self.filter_queryset(queryset)
            
            # Apply additional filters
            min_price = self.request.query_params.get('min_price')
            max_price = self.request.query_params.get('max_price')
            
            if min_price:
                queryset = queryset.filter(price__gte=min_price)
            if max_price:
                queryset = queryset.filter(price__lte=max_price)
                
            # Filter by amenities if provided
            amenities = self.request.query_params.getlist('amenities')
            if amenities:
                queryset = queryset.filter(amenities__id__in=amenities).distinct()
                
        except Exception as e:
            # Log the error and return an empty queryset
            print(f"Error filtering properties: {str(e)}")
            return Property.objects.none()
            
        return queryset
        if amenities:
            queryset = queryset.filter(amenities__id__in=amenities).distinct()
            
        return queryset

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['create', 'upload_image', 'set_primary_image']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser])
    def upload_image(self, request, slug=None):
        property = self.get_object()
        if 'image' not in request.FILES:
            return Response(
                {"error": "No image file provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        is_primary = not property.images.exists()
        image = PropertyImage.objects.create(
            property=property,
            image=request.FILES['image'],
            is_primary=is_primary
        )
        
        return Response(
            {"id": image.id, "image": image.image.url, "is_primary": is_primary},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def set_primary_image(self, request, slug=None):
        property = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response(
                {"error": "image_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            PropertyImage.objects.filter(property=property).update(is_primary=False)
            image = PropertyImage.objects.get(id=image_id, property=property)
            image.is_primary = True
            image.save()
            return Response({"status": "primary image updated"})
        except PropertyImage.DoesNotExist:
            return Response(
                {"error": "Image not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )


class PropertyImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing property images.
    """
    serializer_class = PropertyImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return PropertyImage.objects.filter(property__owner=self.request.user)

    def perform_create(self, serializer):
        property = Property.objects.get(
            slug=self.kwargs['property_slug'], 
            owner=self.request.user
        )
        is_primary = not property.images.exists()
        serializer.save(property=property, is_primary=is_primary)


class HotelViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing hotels.
    """
    queryset = Hotel.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = HotelSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'country', 'star_rating']
    search_fields = ['name', 'description', 'address', 'city', 'country']
    ordering_fields = ['star_rating', 'created_at']
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['create']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAdminUser | permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser])
    def upload_image(self, request, slug=None):
        hotel = self.get_object()
        if 'image' not in request.FILES:
            return Response(
                {"error": "No image file provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        is_primary = not hasattr(hotel, 'images') or not hotel.images.exists()
        image = HotelImage.objects.create(
            hotel=hotel,
            image=request.FILES['image'],
            is_primary=is_primary
        )
        
        return Response(
            {"id": image.id, "image": image.image.url, "is_primary": is_primary},
            status=status.HTTP_201_CREATED
        )


class RoomImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing room type images.
    """
    serializer_class = RoomImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return RoomImage.objects.filter(room_type__hotel__manager=self.request.user)

    def perform_create(self, serializer):
        room_type = RoomType.objects.get(
            id=self.kwargs['room_type_id'],
            hotel__manager=self.request.user
        )
        is_primary = not room_type.images.exists()
        serializer.save(room_type=room_type, is_primary=is_primary)


class RoomTypeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing room types.
    """
    serializer_class = RoomTypeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['max_guests', 'price_per_night']
    search_fields = ['name', 'description']
    lookup_field = 'id'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        hotel_slug = self.kwargs.get('hotel_slug')
        if hotel_slug:
            return RoomType.objects.filter(hotel__slug=hotel_slug, is_active=True)
        return RoomType.objects.filter(is_active=True)

    def perform_create(self, serializer):
        hotel_slug = self.kwargs.get('hotel_slug')
        hotel = Hotel.objects.get(slug=hotel_slug)
        serializer.save(hotel=hotel)


class BookingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing bookings.
    """
    serializer_class = BookingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'check_in_date', 'check_out_date']
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAdminUser | permissions.IsOwner]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'cancelled':
            return Response(
                {"error": "Booking is already cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Only allow cancellation if check-in is at least 24 hours away
        if booking.check_in_date - timezone.now().date() < timedelta(days=1):
            return Response(
                {"error": "Cannot cancel booking within 24 hours of check-in"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'cancelled'
        booking.save()
        return Response({"status": "booking cancelled"})


class InquiryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing property inquiries.
    """
    serializer_class = InquirySerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAdminUser | permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Inquiry.objects.all()
        return Inquiry.objects.filter(property__owner=user)

    def perform_create(self, serializer):
        property_id = self.request.data.get('property')
        property = Property.objects.get(id=property_id)
        serializer.save(property=property)


class BlogPostViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing blog posts.
    """
    serializer_class = BlogPostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt', 'tags__name']
    ordering_fields = ['published_date', 'created_at']
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['create']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = BlogPost.objects.filter(is_published=True)
        
        # Filter by tag
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags__name__iexact=tag)
            
        # Filter by author
        author = self.request.query_params.get('author')
        if author:
            queryset = queryset.filter(author__username__iexact=author)
            
        # For admin users, include unpublished posts in list view
        if self.request.user.is_staff and self.action == 'list':
            return BlogPost.objects.all()
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AmenityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing amenities.
    """
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    pagination_class = None


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing tags.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pagination_class = None
    lookup_field = 'slug'


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Return the current user's information.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class DashboardViewSet(viewsets.ViewSet):
    """
    API endpoint for dashboard statistics.
    """
    permission_classes = [permissions.IsAdminUser]
    
    def list(self, request):
        """
        Return dashboard statistics.
        """
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        
        # Property statistics
        total_properties = Property.objects.count()
        active_properties = Property.objects.filter(is_published=True).count()
        
        # Booking statistics
        total_bookings = Booking.objects.count()
        recent_bookings = Booking.objects.filter(created_at__date__gte=thirty_days_ago).count()
        
        # Revenue statistics (example for the last 30 days)
        revenue = Booking.objects.filter(
            status='confirmed',
            created_at__date__gte=thirty_days_ago
        ).aggregate(total_revenue=Sum('total_price'))['total_revenue'] or 0
        
        # Recent inquiries
        recent_inquiries = Inquiry.objects.filter(created_at__date__gte=thirty_days_ago).count()
        
        return Response({
            'total_properties': total_properties,
            'active_properties': active_properties,
            'total_bookings': total_bookings,
            'recent_bookings': recent_bookings,
            'recent_revenue': float(revenue),
            'recent_inquiries': recent_inquiries,
        })
