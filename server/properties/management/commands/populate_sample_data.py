from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from properties.models import (
    Property, PropertyImage, Hotel, RoomType, RoomImage, 
    Amenity, BlogPost, Tag
)
from django.utils.text import slugify
import random
from datetime import datetime, timedelta
import os
from django.core.files import File
from django.conf import settings

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with sample data for testing and development'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Get or create sample users
        admin_user, _ = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()
        
        manager_user, _ = User.objects.get_or_create(
            email='manager@example.com',
            defaults={
                'first_name': 'Hotel',
                'last_name': 'Manager',
                'is_staff': True
            }
        )
        manager_user.set_password('manager123')
        manager_user.save()
        
        agent_user, _ = User.objects.get_or_create(
            email='agent@example.com',
            defaults={
                'first_name': 'Real',
                'last_name': 'Estate Agent'
            }
        )
        agent_user.set_password('agent123')
        agent_user.save()
        
        # Create sample amenities
        amenities = []
        amenity_data = [
            {'name': 'WiFi', 'icon': 'fa-wifi'},
            {'name': 'Swimming Pool', 'icon': 'fa-swimming-pool'},
            {'name': 'Parking', 'icon': 'fa-parking'},
            {'name': 'Restaurant', 'icon': 'fa-utensils'},
            {'name': 'Air Conditioning', 'icon': 'fa-snowflake'},
            {'name': 'Gym', 'icon': 'fa-dumbbell'},
            {'name': 'Bar', 'icon': 'fa-cocktail'},
            {'name': 'Spa', 'icon': 'fa-spa'},
            {'name': 'Breakfast', 'icon': 'fa-coffee'},
            {'name': 'Beach Access', 'icon': 'fa-umbrella-beach'},
        ]
        
        for amenity in amenity_data:
            obj, created = Amenity.objects.get_or_create(
                name=amenity['name'],
                defaults={'icon': amenity['icon']}
            )
            amenities.append(obj)
        
        # Create sample properties
        properties = []
        property_data = [
            {
                'title': 'Luxury Villa with Ocean View',
                'description': 'Beautiful luxury villa with stunning ocean views and modern amenities.',
                'property_type': 'villa',
                'price': 2500000,
                'bedrooms': 4,
                'bathrooms': 3,
                'area': 350.5,
                'address': '123 Ocean Drive, Malindi',
                'city': 'Malindi',
                'country': 'Kenya',
                'latitude': -3.2175,
                'longitude': 40.1191,
            },
            {
                'title': 'Modern Apartment in Nairobi',
                'description': 'Stylish apartment in the heart of Nairobi with great amenities.',
                'property_type': 'apartment',
                'price': 8500000,
                'bedrooms': 3,
                'bathrooms': 2,
                'area': 180.0,
                'address': '456 Westlands Road, Nairobi',
                'city': 'Nairobi',
                'country': 'Kenya',
                'latitude': -1.2657,
                'longitude': 36.8025,
            },
        ]
        
        for prop in property_data:
            slug = slugify(prop['title'])
            obj, created = Property.objects.get_or_create(
                slug=slug,
                defaults={
                    'title': prop['title'],
                    'description': prop['description'],
                    'property_type': prop['property_type'],
                    'price': prop['price'],
                    'bedrooms': prop['bedrooms'],
                    'bathrooms': prop['bathrooms'],
                    'area': prop['area'],
                    'address': prop['address'],
                    'city': prop['city'],
                    'country': prop['country'],
                    'latitude': prop['latitude'],
                    'longitude': prop['longitude'],
                    'owner': agent_user,  # Assign the agent as the owner
                }
            )
            properties.append(obj)
        
        # Create sample hotels
        hotels = []
        hotel_data = [
            {
                'name': 'Serena Beach Resort',
                'description': 'Luxury beachfront resort with world-class amenities and stunning ocean views.',
                'address': 'P.O. Box 35, Shanzu Beach, Mombasa',
                'city': 'Mombasa',
                'country': 'Kenya',
                'star_rating': 5,
                'check_in_time': '14:00:00',
                'check_out_time': '11:00:00',
            },
            {
                'name': 'Safari Park Hotel',
                'description': 'Iconic hotel in Nairobi known for its beautiful gardens and conference facilities.',
                'address': 'Mbagathi Road, Nairobi',
                'city': 'Nairobi',
                'country': 'Kenya',
                'star_rating': 4,
                'check_in_time': '14:00:00',
                'check_out_time': '11:00:00',
            },
        ]
        
        for hotel in hotel_data:
            slug = slugify(hotel['name'])
            obj, created = Hotel.objects.get_or_create(
                slug=slug,
                defaults={
                    'name': hotel['name'],
                    'description': hotel['description'],
                    'address': hotel['address'],
                    'city': hotel['city'],
                    'country': hotel['country'],
                    'star_rating': hotel['star_rating'],
                    'check_in_time': hotel['check_in_time'],
                    'check_out_time': hotel['check_out_time'],
                    'manager': manager_user,
                }
            )
            # Add some random amenities to the hotel
            obj.amenities.set(random.sample(amenities, 5))
            hotels.append(obj)
        
        # Create sample room types
        room_types = []
        room_type_data = [
            {
                'name': 'Deluxe Room',
                'description': 'Spacious room with a king-size bed and modern amenities.',
                'max_guests': 2,
                'price_per_night': 25000,
                'quantity': 10,
            },
            {
                'name': 'Executive Suite',
                'description': 'Luxurious suite with separate living area and premium amenities.',
                'max_guests': 3,
                'price_per_night': 45000,
                'quantity': 5,
            },
            {
                'name': 'Family Room',
                'description': 'Perfect for families with children, featuring extra beds and space.',
                'max_guests': 4,
                'price_per_night': 35000,
                'quantity': 8,
            },
        ]
        
        for hotel in hotels:
            for room in room_type_data:
                obj, created = RoomType.objects.get_or_create(
                    hotel=hotel,
                    name=room['name'],
                    defaults={
                        'description': room['description'],
                        'max_guests': room['max_guests'],
                        'price_per_night': room['price_per_night'],
                        'quantity': room['quantity'],
                    }
                )
                # Add some random amenities to the room type
                obj.amenities.set(random.sample(amenities, 3))
                room_types.append(obj)
        
        # Create sample blog posts
        tags = []
        tag_names = ['Travel', 'Luxury', 'Real Estate', 'Hotels', 'Vacation', 'Tips', 'Destinations']
        
        for tag_name in tag_names:
            tag, _ = Tag.objects.get_or_create(
                name=tag_name,
                defaults={'slug': slugify(tag_name)}
            )
            tags.append(tag)
        
        blog_posts = []
        blog_post_data = [
            {
                'title': 'Top 10 Luxury Hotels in Kenya',
                'content': 'Discover the most luxurious hotels in Kenya with stunning views and world-class amenities...',
                'excerpt': 'Explore the best luxury hotels Kenya has to offer.',
                'is_published': True,
                'published_date': datetime.now() - timedelta(days=10),
                'tag_names': ['Luxury', 'Hotels', 'Travel'],
            },
            {
                'title': 'Real Estate Investment Tips for Beginners',
                'content': 'Learn how to start investing in real estate with these expert tips...',
                'excerpt': 'Essential tips for new real estate investors.',
                'is_published': True,
                'published_date': datetime.now() - timedelta(days=5),
                'tag_names': ['Real Estate', 'Tips'],
            },
        ]
        
        for post in blog_post_data:
            slug = slugify(post['title'])
            obj, created = BlogPost.objects.get_or_create(
                slug=slug,
                defaults={
                    'title': post['title'],
                    'content': post['content'],
                    'excerpt': post['excerpt'],
                    'author': admin_user,
                    'is_published': post['is_published'],
                    'published_date': post['published_date'],
                }
            )
            # Add tags to the blog post
            post_tags = [t for t in tags if t.name in post['tag_names']]
            obj.tags.set(post_tags)
            blog_posts.append(obj)
        
        self.stdout.write(self.style.SUCCESS('Successfully populated the database with sample data!'))
