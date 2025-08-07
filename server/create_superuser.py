import os
import sys

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

# Now we can import the User model
from properties.models import User

try:
    # Create superuser with email and password
    user = User.objects.create_superuser(
        email='admin@example.com',
        password='admin',
        is_active=True,
        is_staff=True,
        is_superuser=True
    )
    print(f"Superuser created successfully with email: {user.email}")
except Exception as e:
    print(f"Error creating superuser: {e}")
