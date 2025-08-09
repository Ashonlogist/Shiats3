import logging
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserProfileSerializer,
    UserProfileExtendedSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    PasswordResetConfirmSerializer
)
from .models import User, UserProfile, EmailVerification

logger = logging.getLogger(__name__)
User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    """View for user registration."""
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = serializer.save()
            
            # Create user profile
            UserProfile.objects.create(user=user)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Prepare response data
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user, context=self.get_serializer_context()).data
            }
            
            return Response(data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error during user registration: {str(e)}")
            return Response(
                {"detail": _("An error occurred during registration. Please try again later.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token obtain view that includes user information in the response."""
    serializer_class = CustomTokenObtainPairSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """View to retrieve and update user profile information."""
    serializer_class = UserProfileExtendedSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_object(self):
        return self.request.user.profile
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserProfileSerializer
        return UserProfileExtendedSerializer
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Handle file uploads
        if 'profile_picture' in request.data and request.data['profile_picture'] == 'null':
            request.data.pop('profile_picture')
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        
        return Response(serializer.data)


class ChangePasswordView(generics.UpdateAPIView):
    """View for changing user password."""
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Update session auth hash to prevent logout
        from django.contrib.auth import update_session_auth_hash
        update_session_auth_hash(request, user)
        
        return Response({"detail": _("Password updated successfully")}, status=status.HTTP_200_OK)


class PasswordResetView(APIView):
    """View for initiating password reset."""
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_description="Initiate password reset",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, format='email')
            }
        ),
        responses={
            200: 'Password reset email sent',
            400: 'Invalid email',
            500: 'Internal server error'
        }
    )
    def post(self, request):
        email = request.data.get('email')
        
        try:
            user = User.objects.get(email=email)
            
            # Generate password reset token (using Django's built-in password reset)
            from django.contrib.auth.tokens import default_token_generator
            from django.utils.encoding import force_bytes
            from django.utils.http import urlsafe_base64_encode
            from django.urls import reverse
            from django.conf import settings
            
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # In a real application, you would send an email here
            # For now, we'll just log the reset link
            reset_url = f"{settings.FRONTEND_URL}/auth/reset-password/confirm/{uid}/{token}/"
            logger.info(f"Password reset link for {user.email}: {reset_url}")
            
            return Response(
                {"detail": _("Password reset email sent")},
                status=status.HTTP_200_OK
            )
            
        except User.DoesNotExist:
            return Response(
                {"email": _("No user with this email address exists.")},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error in password reset: {str(e)}")
            return Response(
                {"detail": _("An error occurred. Please try again later.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordResetConfirmView(APIView):
    """View for confirming password reset."""
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_description="Confirm password reset",
        request_body=PasswordResetConfirmSerializer,
        responses={
            200: 'Password reset successful',
            400: 'Invalid data',
            500: 'Internal server error'
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # In a real application, you would validate the token here
                # and reset the password
                user = User.objects.get(email=serializer.validated_data['email'])
                user.set_password(serializer.validated_data['new_password1'])
                user.save()
                
                return Response(
                    {"detail": _("Password reset successful")},
                    status=status.HTTP_200_OK
                )
                
            except User.DoesNotExist:
                return Response(
                    {"email": _("No user with this email address exists.")},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                logger.error(f"Error in password reset confirm: {str(e)}")
                return Response(
                    {"detail": _("An error occurred. Please try again later.")},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    """View for verifying user email."""
    permission_classes = [AllowAny]
    
    def get(self, request, uidb64, token):
        """Verify user email using the provided token."""
        try:
            from django.utils.encoding import force_str
            from django.utils.http import urlsafe_base64_decode
            
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            # In a real application, you would validate the token here
            # For now, we'll just mark the email as verified
            user.email_verified = True
            user.save()
            
            return Response(
                {"detail": _("Email verified successfully")},
                status=status.HTTP_200_OK
            )
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"detail": _("Invalid verification link")},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error in email verification: {str(e)}")
            return Response(
                {"detail": _("An error occurred. Please try again later.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CurrentUserView(APIView):
    """View to get the current user's data."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class LogoutView(APIView):
    """View for logging out users by blacklisting their refresh token."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {'detail': 'Successfully logged out'},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            logger.error(f'Logout error: {str(e)}')
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )
