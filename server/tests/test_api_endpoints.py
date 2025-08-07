import json
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from properties.models import Property, Hotel, RoomType, Booking, Amenity, BlogPost, Tag, Inquiry

User = get_user_model()

class PropertyAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        """Set up test data for the whole test case."""
        # Create test users
        cls.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        cls.admin = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        
        # Create test property
        cls.property_data = {
            'title': 'Luxury Villa in Lagos',
            'description': 'A beautiful luxury villa with ocean view',
            'property_type': 'house',
            'listing_type': 'sale',
            'price': 250000.00,
            'bedrooms': 4,
            'bathrooms': 3,
            'area': 350.50,
            'address': '123 Lekki Phase 1',
            'city': 'Lagos',
            'country': 'Nigeria',
            'is_featured': True,
            'is_published': True,
        }
        cls.property = Property.objects.create(owner=cls.user, **cls.property_data)
    
    def setUp(self):
        """Set up test client and authenticate."""
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_property(self):
        """Test creating a new property"""
        new_property_data = self.property_data.copy()
        new_property_data.update({
            'title': 'New Luxury Villa',
            'slug': 'new-luxury-villa',
            'price': 300000.00
        })
        
        response = self.client.post(
            reverse('property-list'),
            data=json.dumps(new_property_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Property.objects.count(), 2)
        self.assertEqual(response.data['title'], 'New Luxury Villa')
        self.assertEqual(response.data['price'], '300000.00')
        self.assertEqual(response.data['owner'], self.user.id)

    def test_get_property_list(self):
        """Test retrieving a list of properties"""
        # Create a second property
        Property.objects.create(
            owner=self.user,
            title='Second Property',
            slug='second-property',
            description='Another property',
            property_type='apartment',
            listing_type='rent',
            price=1500.00,
            bedrooms=2,
            bathrooms=1,
            area=80.0,
            address='456 Victoria Island',
            city='Lagos',
            country='Nigeria',
            is_published=True
        )
        
        response = self.client.get(reverse('property-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        self.assertEqual(response.data['results'][0]['title'], 'Luxury Villa in Lagos')
        self.assertEqual(response.data['results'][1]['title'], 'Second Property')

    def test_get_property_detail(self):
        """Test retrieving a single property"""
        url = reverse('property-detail', kwargs={'slug': self.property.slug})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.property.title)
        self.assertEqual(response.data['description'], self.property.description)
        self.assertEqual(response.data['price'], str(self.property.price))
        self.assertEqual(response.data['owner'], self.user.id)

class HotelAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        """Set up test data for the whole test case."""
        # Create test users
        cls.hotel_manager = User.objects.create_user(
            email='hotel@example.com',
            password='testpass123',
            first_name='Hotel',
            last_name='Manager',
            is_hotel_manager=True
        )
        
        # Create test hotel data
        cls.hotel_data = {
            'name': 'Grand Hotel',
            'description': 'A luxurious 5-star hotel',
            'address': '456 Victoria Island',
            'city': 'Lagos',
            'country': 'Nigeria',
            'star_rating': 5,
            'check_in_time': '14:00:00',
            'check_out_time': '12:00:00',
            'has_free_wifi': True,
            'has_parking': True,
            'has_pool': True,
            'has_restaurant': True,
            'is_active': True,
        }
        
        # Create test hotel
        cls.hotel = Hotel.objects.create(manager=cls.hotel_manager, **cls.hotel_data)
    
    def setUp(self):
        """Set up test client and authenticate."""
        self.client = APIClient()
        self.client.force_authenticate(user=self.hotel_manager)

    def test_create_hotel(self):
        """Test creating a new hotel"""
        new_hotel_data = self.hotel_data.copy()
        new_hotel_data.update({
            'name': 'Luxury Resort',
            'star_rating': 4,
            'has_pool': False,
            'address': '789 Banana Island',
        })
        
        response = self.client.post(
            reverse('hotel-list'),
            data=json.dumps(new_hotel_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Hotel.objects.count(), 2)
        self.assertEqual(response.data['name'], 'Luxury Resort')
        self.assertEqual(response.data['star_rating'], 4)
        self.assertEqual(response.data['has_pool'], False)
        self.assertEqual(response.data['manager'], self.hotel_manager.id)

class BookingAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='guest@example.com',
            password='testpass123',
            first_name='Guest',
            last_name='User'
        )
        self.hotel_manager = User.objects.create_user(
            email='manager@example.com',
            password='managerpass123',
            first_name='Hotel',
            last_name='Manager',
            is_hotel_manager=True
        )
        self.hotel = Hotel.objects.create(
            name='Test Hotel',
            manager=self.hotel_manager,
            address='123 Test St',
            city='Lagos',
            country='Nigeria',
            star_rating=4,
            is_active=True
        )
        self.room_type = RoomType.objects.create(
            hotel=self.hotel,
            name='Deluxe Room',
            description='Spacious deluxe room with king bed',
            price_per_night=150.00,
            max_occupancy=2,
            quantity_available=5,
            is_available=True
        )
        self.booking_data = {
            'room_type': self.room_type.id,
            'check_in': '2023-12-15',
            'check_out': '2023-12-20',
            'num_guests': 2,
            'guest_name': 'Test User',
            'guest_email': 'test@example.com',
            'guest_phone': '+1234567890',
            'special_requests': 'Late check-in requested',
        }
        self.client.force_authenticate(user=self.user)

    def test_create_booking(self):
        """Test creating a new booking"""
        response = self.client.post(
            reverse('booking-list'),
            data=json.dumps(self.booking_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)

class UserAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User',
            'phone_number': '+1234567890'
        }

    def test_register_user(self):
        """Test user registration"""
        response = self.client.post(
            reverse('user-list'),
            data=json.dumps(self.user_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.first().email, 'newuser@example.com')

    def test_login_user(self):
        """Test user login"""
        user = User.objects.create_user(
            email='login@example.com',
            password='loginpass123',
            first_name='Login',
            last_name='User'
        )
        login_data = {
            'email': 'login@example.com',
            'password': 'loginpass123'
        }
        response = self.client.post(
            '/api/v1/auth/jwt/create/',
            data=json.dumps(login_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
