from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django_rest_passwordreset.models import ResetPasswordToken

class UserManager(BaseUserManager):
    """Custom user model manager where email is the unique identifier."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a user with the given email and password."""
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that uses email as the unique identifier."""
    
    class UserType(models.TextChoices):
        BUYER = 'buyer', _('Buyer')
        SELLER = 'seller', _('Seller')
        AGENT = 'agent', _('Agent')
        HOTEL_MANAGER = 'hotel_manager', _('Hotel Manager')
        ADMIN = 'admin', _('Administrator')
    
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    phone_number = models.CharField(_('phone number'), max_length=20, blank=True)
    user_type = models.CharField(
        _('user type'), 
        max_length=20,  # Increased to accommodate 'hotel_manager'
        choices=UserType.choices, 
        default=UserType.BUYER
    )
    
    # Required fields
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    last_login = models.DateTimeField(_('last login'), auto_now=True)
    
    # Additional fields
    profile_picture = models.ImageField(
        _('profile picture'), 
        upload_to='profile_pictures/', 
        null=True, 
        blank=True
    )
    bio = models.TextField(_('bio'), blank=True)
    email_verified = models.BooleanField(_('email verified'), default=False)
    phone_verified = models.BooleanField(_('phone verified'), default=False)
    
    # Social auth
    social_provider = models.CharField(
        _('social provider'), 
        max_length=20, 
        blank=True,
        null=True
    )
    social_uid = models.CharField(
        _('social uid'), 
        max_length=200, 
        blank=True, 
        null=True
    )
    
    # Preferences
    receive_newsletter = models.BooleanField(
        _('receive newsletter'), 
        default=True
    )
    notification_preferences = models.JSONField(
        _('notification preferences'),
        default=dict,
        blank=True,
        help_text=_('User preferences for notifications')
    )
    
    objects = UserManager()
    
    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        full_name = f'{self.first_name} {self.last_name}'.strip()
        return full_name if full_name else self.email
    
    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name or self.email.split('@')[0]
    
    @property
    def is_buyer(self):
        return self.user_type == self.UserType.BUYER
    
    @property
    def is_seller(self):
        return self.user_type == self.UserType.SELLER
    
    @property
    def is_agent(self):
        return self.user_type == self.UserType.AGENT


class UserProfile(models.Model):
    """Extended user profile information."""
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='profile'
    )
    
    # Contact Information
    company_name = models.CharField(_('company name'), max_length=100, blank=True)
    address = models.TextField(_('address'), blank=True)
    city = models.CharField(_('city'), max_length=100, blank=True)
    state = models.CharField(_('state/province'), max_length=100, blank=True)
    country = models.CharField(_('country'), max_length=100, blank=True)
    postal_code = models.CharField(_('postal code'), max_length=20, blank=True)
    
    # Social Media
    website = models.URLField(_('website'), blank=True)
    facebook = models.URLField(_('facebook profile'), blank=True)
    twitter = models.URLField(_('twitter profile'), blank=True)
    linkedin = models.URLField(_('linkedin profile'), blank=True)
    instagram = models.URLField(_('instagram profile'), blank=True)
    
    # Professional Information
    license_number = models.CharField(
        _('real estate license number'), 
        max_length=50, 
        blank=True
    )
    specialties = models.TextField(_('specialties'), blank=True)
    languages = models.JSONField(
        _('languages spoken'),
        default=list,
        blank=True,
        help_text=_('List of languages spoken')
    )
    
    # Preferences
    preferred_contact_method = models.CharField(
        _('preferred contact method'),
        max_length=20,
        choices=[
            ('email', _('Email')),
            ('phone', _('Phone')),
            ('whatsapp', _('WhatsApp')),
            ('sms', _('SMS')),
        ],
        default='email'
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('user profile')
        verbose_name_plural = _('user profiles')
    
    def __str__(self):
        return f"{self.user.get_full_name()}'s Profile"


class EmailVerification(models.Model):
    """Model to track email verification tokens."""
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='email_verifications'
    )
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def mark_as_used(self):
        self.is_used = True
        self.save(update_fields=['is_used'])
    
    class Meta:
        ordering = ['-created_at']
