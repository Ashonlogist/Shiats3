from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    User, Property, PropertyImage, Hotel, RoomType, RoomImage, 
    Booking, Amenity, Inquiry, BlogPost, Tag
)
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'phone_number', 'user_type', 'role', 'date_joined', 'is_active'
        ]
        read_only_fields = ['id', 'date_joined', 'email', 'is_active']
    
    def get_role(self, obj):
        if obj.is_superuser:
            return 'admin'
        elif hasattr(obj, 'groups') and obj.groups.filter(name='Hotel Managers').exists():
            return 'hotel_manager'
        elif hasattr(obj, 'groups') and obj.groups.filter(name='Agents').exists():
            return 'agent'
        # Return the user_type from the model if no specific role is found
        return obj.get_user_type_display().lower() if obj.user_type else 'user'

class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'image_url', 'is_primary', 'created_at']
        read_only_fields = ['id', 'created_at', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'icon']
        read_only_fields = ['id']

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'slug', 'description', 'property_type', 'listing_type',
            'price', 'bedrooms', 'bathrooms', 'area', 'address', 'city', 'country',
            'latitude', 'longitude', 'is_featured', 'is_published', 'created_at',
            'updated_at', 'owner', 'images', 'amenities', 'primary_image'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner', 'slug']
        lookup_field = 'slug'
        extra_kwargs = {'url': {'lookup_field': 'slug'}}
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return self.context['request'].build_absolute_uri(primary_image.image.url)
        return None
    
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

class HotelSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    manager = UserSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Hotel
        fields = [
            'id', 'name', 'slug', 'description', 'address', 'city', 'country',
            'star_rating', 'check_in_time', 'check_out_time', 'is_active',
            'created_at', 'updated_at', 'manager', 'amenities', 'primary_image'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'manager']
        lookup_field = 'slug'
        extra_kwargs = {'url': {'lookup_field': 'slug'}}
    
    def get_primary_image(self, obj):
        if hasattr(obj, 'images') and obj.images.exists():
            return self.context['request'].build_absolute_uri(obj.images.first().image.url)
        return None

class RoomImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = RoomImage
        fields = ['id', 'image', 'image_url', 'is_primary']
        read_only_fields = ['id', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

class RoomTypeSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = RoomType
        fields = [
            'id', 'name', 'description', 'max_guests', 'price_per_night',
            'quantity', 'amenities', 'images', 'primary_image', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return self.context['request'].build_absolute_uri(primary.image.url)
        elif obj.images.exists():
            return self.context['request'].build_absolute_uri(obj.images.first().image.url)
        return None

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    room_type = serializers.PrimaryKeyRelatedField(queryset=RoomType.objects.all())
    room_details = RoomTypeSerializer(source='room_type', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'room_type', 'room_details', 'check_in_date',
            'check_out_date', 'status', 'total_price', 'guest_count',
            'special_requests', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'status', 'created_at']
    
    def validate(self, data):
        if data['check_out_date'] <= data['check_in_date']:
            raise serializers.ValidationError("Check-out date must be after check-in date.")
        
        if data['check_in_date'] < timezone.now().date():
            raise serializers.ValidationError("Check-in date cannot be in the past.")
        
        # Check room availability
        room_type = data['room_type']
        overlapping_bookings = Booking.objects.filter(
            room_type=room_type,
            check_in_date__lt=data['check_out_date'],
            check_out_date__gt=data['check_in_date'],
            status__in=['pending', 'confirmed']
        )
        
        if overlapping_bookings.exists():
            booked_rooms = sum(booking.guest_count for booking in overlapping_bookings)
            if booked_rooms + data.get('guest_count', 1) > room_type.quantity:
                raise serializers.ValidationError("Not enough rooms available for the selected dates.")
        
        return data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class InquirySerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)
    
    class Meta:
        model = Inquiry
        fields = [
            'id', 'property', 'property_title', 'name', 'email', 'phone',
            'message', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'is_read']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']
        read_only_fields = ['id', 'slug']

class BlogPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, required=False)
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'author', 'featured_image',
            'featured_image_url', 'is_published', 'published_date', 'tags', 'created_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'published_date']
        lookup_field = 'slug'
        extra_kwargs = {'url': {'lookup_field': 'slug'}}
    
    def get_featured_image_url(self, obj):
        if obj.featured_image:
            return self.context['request'].build_absolute_uri(obj.featured_image.url)
        return None
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        blog_post = BlogPost.objects.create(**validated_data)
        
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(**tag_data)
            blog_post.tags.add(tag)
        
        return blog_post
    
    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)
        
        if tags_data is not None:
            instance.tags.clear()
            for tag_data in tags_data:
                tag, _ = Tag.objects.get_or_create(**tag_data)
                instance.tags.add(tag)
        
        return super().update(instance, validated_data)
