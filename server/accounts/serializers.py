from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions as django_exceptions
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django_rest_passwordreset.serializers import PasswordTokenSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone_number',
            'user_type', 'is_active', 'date_joined', 'last_login',
            'profile_picture', 'bio', 'email_verified', 'phone_verified',
            'receive_newsletter'
        ]
        read_only_fields = ['id', 'is_active', 'date_joined', 'last_login']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
        }

    def validate_email(self, value):
        """Ensure email is unique and properly formatted."""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(_("A user with this email already exists."))
        return value.lower()


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new user account."""
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        trim_whitespace=False
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'phone_number',
            'user_type', 'password', 'password_confirm',
            'receive_newsletter'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
            'user_type': {'default': 'buyer'}
        }

    def validate(self, attrs):
        """Validate that the two password fields match."""
        password = attrs.get('password')
        password_confirm = attrs.pop('password_confirm', None)
        
        if password != password_confirm:
            raise serializers.ValidationError({"password_confirm": _("The two password fields didn't match.")})
        
        # Validate password strength
        try:
            validate_password(password)
        except django_exceptions.ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        
        return attrs

    def create(self, validated_data):
        """Create and return a new user with encrypted password."""
        # Remove password_confirm from the data
        validated_data.pop('password_confirm', None)
        
        # Create the user
        user = User.objects.create_user(**validated_data)
        
        # Set the password separately to ensure it's properly hashed
        user.set_password(validated_data['password'])
        user.save()
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile information."""
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number', 'profile_picture',
            'bio', 'email_verified', 'phone_verified', 'receive_newsletter'
        ]
        read_only_fields = ['email_verified', 'phone_verified']


class UserProfileExtendedSerializer(serializers.ModelSerializer):
    """Extended serializer for user profile with additional fields."""
    email = serializers.EmailField(source='user.email', read_only=True)
    user_type = serializers.CharField(source='user.user_type', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'phone_number', 'user_type',
            'profile_picture', 'bio', 'email_verified', 'phone_verified',
            'company_name', 'address', 'city', 'state', 'country', 'postal_code',
            'website', 'facebook', 'twitter', 'linkedin', 'instagram',
            'license_number', 'specialties', 'languages',
            'preferred_contact_method', 'receive_newsletter',
            'notification_preferences'
        ]
        read_only_fields = ['email', 'user_type', 'email_verified', 'phone_verified']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer that includes user information in the response."""
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom claims
        refresh = self.get_token(self.user)
        
        # Add user information to the response
        data['user'] = UserSerializer(self.user).data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        
        return data


class PasswordResetConfirmSerializer(PasswordTokenSerializer):
    """Serializer for confirming a password reset."""
    new_password1 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    new_password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        
        # Check that the two password fields match
        if attrs['new_password1'] != attrs['new_password2']:
            raise serializers.ValidationError({
                'new_password2': _("The two password fields didn't match.")
            })
            
        # Validate password strength
        try:
            validate_password(attrs['new_password1'])
        except django_exceptions.ValidationError as e:
            raise serializers.ValidationError({'new_password1': list(e.messages)})
            
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing a user's password."""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password1 = serializers.CharField(required=True, write_only=True)
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        """Check that the old password is correct."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(_("Your old password was entered incorrectly. Please enter it again."))
        return value

    def validate(self, attrs):
        """Validate that the two new password fields match."""
        if attrs['new_password1'] != attrs['new_password2']:
            raise serializers.ValidationError({
                'new_password2': _("The two password fields didn't match.")
            })
        
        # Validate password strength
        try:
            validate_password(attrs['new_password1'])
        except django_exceptions.ValidationError as e:
            raise serializers.ValidationError({'new_password1': list(e.messages)})
            
        return attrs

    def save(self, **kwargs):
        """Save the new password."""
        password = self.validated_data['new_password1']
        user = self.context['request'].user
        user.set_password(password)
        user.save()
        return user
