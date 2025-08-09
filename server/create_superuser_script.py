import os
import django

def create_superuser():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.server.settings')
    django.setup()
    
    from django.contrib.auth import get_user_model
    
    User = get_user_model()
    
    # Check if superuser already exists
    if not User.objects.filter(email='admin@example.com').exists():
        User.objects.create_superuser(
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            password='admin123',
            is_active=True,
            is_staff=True,
            is_superuser=True
        )
        print('Superuser created successfully!')
    else:
        print('Superuser already exists.')

if __name__ == '__main__':
    create_superuser()
