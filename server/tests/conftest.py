"""Pytest configuration and fixtures for the Shiats3 project."""
import os
import tempfile
import pytest
from django.conf import settings
from django.test import TestCase
from django.test.utils import override_settings

# Use in-memory SQLite for faster tests
TEST_DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Override settings for tests
TEST_SETTINGS = {
    'DATABASES': TEST_DATABASES,
    'PASSWORD_HASHERS': [
        'django.contrib.auth.hashers.MD5PasswordHasher',
    ],
    'MEDIA_ROOT': os.path.join(tempfile.gettempdir(), 'shiats3_test_media'),
    'DEFAULT_FILE_STORAGE': 'django.core.files.storage.FileSystemStorage',
    'STATICFILES_STORAGE': 'django.contrib.staticfiles.storage.StaticFilesStorage',
    'EMAIL_BACKEND': 'django.core.mail.backends.locmem.EmailBackend',
    'CACHES': {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'unique-snowflake',
        }
    },
    'CELERY_TASK_ALWAYS_EAGER': True,
    'CELERY_TASK_EAGER_PROPAGATES': True,
}

# Apply test settings
settings.configure(**TEST_SETTINGS)

# Initialize Django
django.setup()

# Import models after Django is set up
from django.contrib.auth import get_user_model
User = get_user_model()


@pytest.fixture(scope='session')
def django_db_setup():
    """Set up the test database."""
    from django.core.management import call_command
    call_command('migrate', '--noinput')


@pytest.fixture
def api_client():
    """Return an API client."""
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def admin_user():
    """Create and return an admin user."""
    return User.objects.create_superuser(
        email='admin@example.com',
        password='adminpass123',
        first_name='Admin',
        last_name='User'
    )


@pytest.fixture
def regular_user():
    """Create and return a regular user."""
    return User.objects.create_user(
        email='user@example.com',
        password='testpass123',
        first_name='Regular',
        last_name='User'
    )


@pytest.fixture
def authenticated_client(regular_user):
    """Return an authenticated API client."""
    from rest_framework.test import APIClient
    client = APIClient()
    client.force_authenticate(user=regular_user)
    return client


@pytest.fixture
def admin_client(admin_user):
    """Return an authenticated admin API client."""
    from rest_framework.test import APIClient
    client = APIClient()
    client.force_authenticate(user=admin_user)
    return client
